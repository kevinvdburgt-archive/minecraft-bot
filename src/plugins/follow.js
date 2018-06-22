import Plugin from '../plugin';
import vec3 from 'vec3';

export default class Echo extends Plugin {
  state = {
    target: null,
  };

  followTarget = () => {
    if (this.state.target === null) {
      return;
    }

    const player = this.bot.players[this.state.target];
    const entity = player.entity;

    if (!entity) {
      this.setState({
        target: null,
      });
    }

    const path = this.bot.navigate.findPathSync(entity.position, {
      timeout: 250,
      endRadius: 4,
    });

    this.bot.navigate.walk(path.path, () => {
      this.bot.lookAt(entity.position.plus(vec3(0, 1.62, 0)));
    });

    setTimeout(() => this.followTarget(), 500);
  };

  onCommand = (username, command, args) => {
    if (command !== 'follow') {
      return;
    }

    if (args.length === 0) {
      const target = username;

        if (this.bot.players[target].entity === null) {
          this.bot.chat(`You are too far away, i cannot find your position from here.`);
          return;
        }

        this.setState({ target });

        this.bot.chat(`Okay, i will follow you!`);

        this.followTarget();
    } else if (args.length === 1 && args[0] === 'stop') {
      if (this.state.target === null) {
        this.bot.chat(`I can't stop, i am not following anyone.`);
        return;
      }

      this.bot.chat(`Okay, i'll stop following ${this.state.target}`);

      this.setState({ target: null });

      this.bot.navigate.stop('interrupted');
    } else if (args.length === 1) {
      const target = args[0];

      if (!this.bot.players[target]) {
        this.bot.chat(`I can't find the player ${target}`);
        return;
      }

      if (this.bot.players[target].entity === null) {
        this.bot.chat(`${target} is too far away, i can't find ${target}'s from here.`);
        return;
      }

      this.setState({ target });

      this.bot.chat(`Okay, i will follow ${target}!`);

      this.followTarget();
    }
  };
};
