export default class Plugin {
  state = {};

  constructor (instance) {
    this.bot = instance.bot;
    setImmediate(() => this.bind());
  }

  bind = () => {
    // Handle chat events
    if (typeof this.onCommand === 'function') {
      this.bot.on('chat', (username, message) => {
        console.log('chat event');
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

    // Handle navigation events
    if (typeof this.onNavigate === 'function') {
      this.bot.navigate.on('pathPartFound', (path) => this.onNavigate('pathPartFound', path));
      this.bot.navigate.on('pathFound', (path) => this.onNavigate('pathFound', path));
      this.bot.navigate.on('cannotFind', (path) => this.onNavigate('cannotFind', path));
      this.bot.navigate.on('arrived', () => this.onNavigate('arrived', null));
      this.bot.navigate.on('interrupted', () => this.onNavigate('interrupted', null));
    }
  };

  setState = (obj) => {
    this.state = {
      ...this.state,
      ...obj,
    };
  };
};
