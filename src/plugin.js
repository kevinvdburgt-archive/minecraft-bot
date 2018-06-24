import chalk from 'chalk';
export default class Plugin {
  state = {};

  constructor (instance) {
    this.bot = instance.bot;
    this.instance = instance;
    setImmediate(() => this.bind());
  }

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
  };

  setState = (obj) => {
    this.state = {
      ...this.state,
      ...obj,
    };
  };

  setBotState = (obj) => {
    this.instance.state = {
      ...this.instance.state,
      ...obj,
    };
  };

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
