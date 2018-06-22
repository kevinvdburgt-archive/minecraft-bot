import Plugin from '../plugin';

export default class Jump extends Plugin {
  onCommand = (username, command, args) => {
    if (command !== 'jump') {
      return;
    }

    console.log('jump cmd', args);

    if (args.length === 0) {
      this.bot.setControlState('jump', true);
      this.bot.chat(`Okay, jumping like crazy now!`);
    } else if (args.length === 1 && args[0] === 'stop') {
      this.bot.setControlState('jump', false);
      this.bot.chat(`Okay, i stopped..`);
    }
  };
};
