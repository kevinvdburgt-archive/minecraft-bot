import Plugin from '../plugin';
import vec3 from 'vec3';

export default class Echo extends Plugin {
  state = {
    target: null,
  };

  onCommand = (username, command, args) => {
    if (command !== 'come') {
      return;
    }

    let target = null;
    switch (args.length) {
      case 0: // Come to the asking player
        target = username;

        if (this.bot.players[target].entity === null) {
          this.bot.chat(`You are too far away, i cannot find your position from here.`);
          return;
        }

        this.setState({ target });

        this.bot.navigate.to(this.bot.players[target].entity.position);
        break;

      case 1: // Come to a given playername
        target = args[0];

        if (!this.bot.players[target]) {
          this.bot.chat(`I can't find the player ${target}`);
          return;
        }

        if (this.bot.players[target].entity === null) {
          this.bot.chat(`${target} is too far away, i can't find ${target}'s from here.`);
          return;
        }

        this.setState({ target });

        this.bot.navigate.to(this.bot.players[target].entity.position);
        break;

      case 3: // Come to the given coords x y z
        const x = args[0];
        const y = args[1];
        const z = args[2];

        let point = vec3(x, y, z);

        // @TODO: Check if the block is in range, if so, check if the 
        // block is air and go down until solid ground is found.
        // console.log(this.bot.blockAt(point));

        this.setState({
          target: point,
        });

        this.bot.navigate.to(point);
        break;
    }
  };

  onNavigate = (action, path) => {
    console.log(action);

    if (this.state.target === null) {
      return;
    }

    switch (action) {
      case 'pathPartFound':
        this.bot.chat(`Going ${path.length} meters in the general direction now.`);
        break;

      case 'pathFound':
        this.bot.chat(`I can get there in ${path.length} meters.`);
        break;

      case 'cannotFind':
        this.bot.chat(`Unable to find path, getting as close as possible.`);
        this.bot.navigate.walk(path);
        break;

      case 'arrived':
        this.bot.chat(`I have arrived!`);
        this.setState({
          target: null,
        });
        break;

      case 'interrupted':
        this.bot.chat(`Something interrupted me...`);
        this.setState({
          target: null,
        });
        break;
    }
  };
};
