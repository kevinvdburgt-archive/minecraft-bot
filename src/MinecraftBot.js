import fs from 'fs';
import path from 'path';
import mineflayer from 'mineflayer';
import mineflayerNavigationFactory from 'mineflayer-navigate';
import { read, write } from './utils/cache';
import { authenticate as auth, validate, refresh } from './mojang/authserver';
import { createCookie, acceptTOS, worlds, join } from './mojang/realms';
import { log } from './utils';

const mineflayerNavigate = mineflayerNavigationFactory(mineflayer);

export default class MinecraftBot {
  plugins = [];
  cache = {};

  constructor (config) {
    this.config = config;
    this.cache = read(`bot-${config.username}`);
    this.setup();
  };

  /**
   * Setup the bot
   */
  setup = async () => {
    const session = await this.authenticate();
    if (session === null) {
      return log(`Could not create a session for bot ${this.config.username}.`);
    };

    const server = await this.server(session);
    if (server === null) {
      return log(`Could not find the server for bot ${this.config.username}.`);
    }

    // Create the mineflayer bot itself
    this.bot = mineflayer.createBot({
      session,
      ...server,
    });

    // Add mineflayer core plugins
    mineflayerNavigate(this.bot);

    // Add custom plugins
    this.plugins = fs.readdirSync(path.resolve(__dirname, 'plugins')).map((file) => {
      const plugin = require(path.resolve(__dirname, 'plugins', file)).default;
      log(`Loading plugin: ${file}`);
      return new plugin(this);
    });
  };

  /**
   * Authenticate with the Minecraft Auth services and generates
   * a session object.
   */
  authenticate = async () => {
    // Check if we have a cached version of the session
    if (this.cache.session) {
      return this.cache.session; // @TODO: validate always says the access token is invalid..?
      try {
        log('Validating cached session.');
        await validate(this.cache.session.accessToken);
        log('Cached session is still valid.');
        return this.cache.session;
      } catch (e) {
        log('Cached session is invalid.')
      }
    }

    try {
      log('Authenticating with the Mojang auth servers.');
      const session = await auth(this.config.username, this.config.password);
      this.setCache({ session });
      return session;
    } catch (e) {
      log(`Could not authorize with the Mojang auth servers: ${e.errorMessage}`);
    }

    return null;
  };

  /**
   * Find the server hostname and port, when not using reals, simply
   * connect with the given IP and port given in the bot config.
   */
  server = async (session) => {
    if (!this.config.realm) {
      const { host, port } = this.config;
      return {
        host,
        port,
      };
    }

    const cookie = createCookie(
      session.accessToken,
      session.selectedProfile.id,
      session.selectedProfile.name,
      this.config.version
    );

    // Accept the TOS of the Realms
    await acceptTOS(cookie);

    // Fetch all Realm worlds
    const realms = await worlds(cookie);

    // Find the given realm name
    const realm = realms.servers.find((server) => 
      server.name === this.config.realm
    );

    if (!realm) {
      log(`Available realms: ${realms.servers.map((realm) => realm.name).join(', ')} but no ${this.config.realm} found.`);
      return null;
    }

    const server = await join(cookie, realm.id);

    const address = server.address.split(':');

    return {
      host: address[0],
      port: address[1],
    };
  };

  /**
   * Update the cache data for this bot.
   */
  setCache = (obj) => {
    this.cache = {
      ...this.cache,
      ...obj,
    };

    write(`bot-${this.config.username}`, this.cache);
  }
};
