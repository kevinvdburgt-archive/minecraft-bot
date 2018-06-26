import chalk from 'chalk';

export default class Plugin {
  state = {};

  constructor (instance) {
    this.bot = instance.bot;
    this.instance = instance;
    setImmediate(() => this.bind()); // @TODO: Feel a bit hacky, but it works..
  }

  /**
   * Bind all events to the plugin methods
   */
  bind = () => {
    // Handle chat events
    if (typeof this.onCommand === 'function') {
      this.bot.on('chat', (username, message) => {
        if (username === this.bot.username) {
          return;
        }

        const args = message.split(' ');

        if (args.shift() !== this.bot.username) {
          return;
        }

        this.onCommand(username, args.shift(), args);
      });
    }

    // Handle chat events
    if (typeof this.onChat === 'function') {
      this.bot.on('chat', (username, message) => this.onChat(username, message));
    }

    // Handle spawn events
    if (typeof this.onSpawn === 'function') {
      this.bot.on('spawn', () => this.onSpawn());
    }

    if (typeof this.onRespawn === 'function') {
      this.bot.on('respawn', () => this.onRespawn());
    }

    if (typeof this.onHealthFoodChange === 'function') {
      this.bot.on('health', () => this.onHealthFoodChange());
    }

    // Handle navigation events
    if (typeof this.onNavigate === 'function') {
      this.bot.navigate.on('pathPartFound', (path) => this.onNavigate('pathPartFound', path));
      this.bot.navigate.on('pathFound', (path) => this.onNavigate('pathFound', path));
      this.bot.navigate.on('cannotFind', (path) => this.onNavigate('cannotFind', path));
      this.bot.navigate.on('arrived', () => this.onNavigate('arrived', null));
      this.bot.navigate.on('interrupted', () => this.onNavigate('interrupted', null));
    }

    // Handle block updates
    if (typeof this.onBlockUpdate === 'function') {
      this.bot.on('blockUpdate', this.onBlockUpdate);
    }

    // Handle entity spawns
    if (typeof this.onEntitySpawn === 'function') {
      this.bot.on('entitySpawn', this.onEntitySpawn);
    }
  };

  /**
   * Changes the state of the plugin
   */
  setState = (obj) => {
    const oldState = this.state;

    this.state = {
      ...this.state,
      ...obj,
    };

    // console.log(oldState, this.state);
  };

  /**
   * Changes the state of the bot
   */
  setBotState = (obj) => {
    this.instance.state = {
      ...this.state.instance,
      ...obj,
    };
  };

  /**
   * Write the log of this plugin
   */
  log = (message) => {
    console.log(`[${chalk.cyan(this.bot.username)}][${chalk.red(this.constructor.name.toLocaleLowerCase())}] ${message}`);
  };

  /**
   * Get a plugin instance by it's classname.
   */
  plugin = (name) => {
    return this.instance.plugins.find((plugin) => {
      return plugin.constructor.name === name;
    });
  };
};
