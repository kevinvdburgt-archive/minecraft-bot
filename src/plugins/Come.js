import Plugin from '../Plugin';
import { navigateToPlayer, navigateToPosition, navigateStop, navigatePath } from '../utils/botactions';

export default class Come extends Plugin {
  state = {
    target: false,
  };

  /**
   * Handle commands
   */
  onCommand = (username, command, args) => {
    if (command !== 'come') {
      return;
    }

    if (args.length === 0) {
      navigateToPlayer(this.bot, username)
        .then(() => {
          this.setState({
            target: username,
          });
        })
        .catch((err) => {
          this.bot.chat(err);
        });
    } else if (args.length === 1 && args[0] !== 'stop') {
      navigateToPlayer(this.bot, args[0])
        .then(() => {
          this.setState({
            target: args[0],
          });
        })
        .catch((err) => {
          this.bot.chat(err);
        });
    } else if (args.length === 3) {
      const position = vec3(
        parseInt(args[0]),
        parseInt(args[1]),
        parseInt(args[2]),
      );

      navigateToPosition(this.bot, position)
        .then(() => {
          this.setState({
            target: position,
          });
        })
        .catch((err) => {
          this.bot.chat(err);
        });   
    } else if (args.length === '1' && args[0] === 'stop') {
      navigateStop(this.bot)
        .then(() => {
          this.setState({
            target: null,
          });
        });
    }
  };

  /**
   * Handle navigation
   */
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

        navigatePath(this.bot, path)
          .then(() => {
            this.setState({
              target: null,
            });
          });
        break;
    }
  };
};
