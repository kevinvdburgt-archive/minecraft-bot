import Plugin from '../Plugin';

export default class Info extends Plugin {
  onCommand = (username, command, args) => {
    switch (command) {
      case 'hp':
      case 'health':
      case 'food':
        const health = Math.round((this.bot.health / 2) * 10) / 10;
        const food = Math.round((this.bot.food / 2) * 10) / 10;
        this.bot.chat(`I have ${health} hearts and ${food} food.`)
        break;

      case 'pos':
      case 'position':
      case 'loc':
      case 'location':
        const x = Math.round(this.bot.entity.position.x);
        const y = Math.round(this.bot.entity.position.y);
        const z = Math.round(this.bot.entity.position.z);
        const dimension = this.bot.game.dimension;
        this.bot.chat(`I'm at ${x} ${y} ${z} in the ${dimension}`);
        break;
    }
  };

  onSpawn = () => {
    this.log('Spawned');
  };

  onRespawn = () => {
    this.log('Respawned');
  };

  onHealthFoodChange = () => {
    const health = Math.round((this.bot.health / 2) * 10) / 10;
    const food = Math.round((this.bot.food / 2) * 10) / 10;
    this.log(`HP: ${health}, Food: ${food}`);
  };
};
