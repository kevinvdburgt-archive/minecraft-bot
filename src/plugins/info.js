import Plugin from '../plugin';

export default class Info extends Plugin {
  onCommand = (username, command, args) => {
    switch (command) {
      case 'hp':
        this.bot.chat(`I have ${Math.round((this.bot.health / 2) * 10) / 10} hearts.`);
        break;

      case 'pos':
        this.bot.chat(`I'm at ${Math.round(this.bot.entity.position.x)}, ${Math.round(this.bot.entity.position.y)}, ${Math.round(this.bot.entity.position.z)} in the ${this.bot.game.dimension}`);
        break;
    }
  };
};
