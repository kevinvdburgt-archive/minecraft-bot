import vec3 from 'vec3';
import Plugin from '../plugin';

export default class Come extends Plugin {
  state = {
    target: null,
  };

  /**
   * Comes to a given player name
   */
  comeToPlayer = (username) => {
    if (this.state.target !== null) {
      if (typeof this.state.target === 'string') {
        this.bot.chat(`Already on my way to ${this.state.target}'s position.`);
      } else if (typeof this.state.target === 'Vec3') {
        this.bot.chat(`Already on my way to ${this.state.target.x} ${this.state.target.y} ${this.state.target.z}.`);
      }
      return;
    }

    if (!this.bot.players[username]) {
      this.bot.chat(`I can't find ${username}.`);
      return;
    }

    if (!this.bot.players[username].entity) {
      this.bot.chat(`${username} is too far away from me.`);
      return;
    }

    this.setState({
      target: username,
    });

    this.bot.navigate.to(this.bot.players[username].entity.position);
  };

  /**
   * Comves to a given vec3 position
   */
  comeToCoords = (position) => {
    if (this.state.target !== null) {
      if (typeof this.state.target === 'string') {
        this.bot.chat(`Already on my way to ${this.state.target}'s position.`);
      } else if (typeof this.state.target === 'Vec3') {
        this.bot.chat(`Already on my way to ${this.state.target.x} ${this.state.target.y} ${this.state.target.z}.`);
      }
      return;
    }

    this.setState({
      target: position,
    });

    this.bot.navigate.to(position);
  };

  /**
   * Stop the coming activity
   */
  stop = () => {
    if (this.state.target === null) {
      this.bot.chat(`I'm not doying anything?`);
      return;
    }

    this.bot.navigate.stop('interrupted');

    this.setState({
      target: null,
    });
  };

  onCommand = (username, command, args) => {
    // Only listen for the command 'come'
    if (command !== 'come') {
      return;
    }

    // Set the bot position to the calling player
    if (args.length === 0) {
      this.comeToPlayer(username);
    }

    // Set the bot position to a given player name
    else if (args.length === 1 && args[0] !== 'stop') {
      this.comeToPlayer(args[0]);
    }

    // Set the bot position to the given coordinates
    else if (args.length === 3) {
      const position = vec3(
        parseInt(args[0]),
        parseInt(args[1]),
        parseInt(args[2]),
      );

      this.comeToCoords(position);
    }

    // Stop the bot from his current actions
    else if (args.length === 1 && args[0] === 'stop') {
      this.stop();
    }
  };

  onNavigate = (action, path) => {
    if (this.state.target === null) {
      return;
    }

    this.log(`Navigation status: ${action}`);

    switch (action) {
      case 'arrived':
        this.bot.chat(`I have arrived on my destionation!`);

        this.setState({
          target: null,
        });
        break;

      case 'interrupted':
        this.bot.chat(`I've been interrupted..`);

        this.setState({
          target: null,
        });
        break;

      case 'obstructed':
        this.bot.chat(`Something happend, the calculated route has been obstructed.`);

        this.setState({
          target: null,
        });
        break;

      case 'stop':
        this.bot.chat(`Stopped coming.`);

        this.setState({
          target: null,
        });
        break;

      case 'pathPartFound':
        this.bot.chat(`Going ${path.length} meters in the general direction now.`);
        break;

      case 'pathFound':
        this.bot.chat(`I can get there in ${path.length} meters.`);
        break;

      case 'cannotFind':
        this.bot.chat(`Unable to find path, getting as close as possible.`);
        this.bot.navigate.walk(path);

        this.setState({
          target: null,
        });
        break;
    }
  };
}
