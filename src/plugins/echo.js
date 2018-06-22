import Plugin from '../plugin';

export default class Echo extends Plugin {
  onCommand = (username, command, args) => {
    console.log(username, command, args);

    if (command === 'echo') {
      this.bot.chat(args.join(' '));
    }
  };
};
