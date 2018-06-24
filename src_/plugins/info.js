import Plugin from '../plugin';

export default class Info extends Plugin {
  onCommand = (username, command, args) => {
    switch (command) {
      case 'hp':
      case 'health':
        this.bot.chat(`I have ${Math.round((this.bot.health / 2) * 10) / 10}/10 hearts and ${Math.round((this.bot.food / 2) * 10) / 10}/10 food.`);
        break;

      case 'pos':
      case 'position':
      case 'loc':
      case 'location':
        this.bot.chat(`I'm at ${Math.round(this.bot.entity.position.x)}, ${Math.round(this.bot.entity.position.y)}, ${Math.round(this.bot.entity.position.z)} in the ${this.bot.game.dimension}`);
        break;
    }
  };
};
