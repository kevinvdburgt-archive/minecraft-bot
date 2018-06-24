import Plugin from '../plugin';
import { inventoryTossAll, inventoryInfo } from '../botutils';

export default class Inventory extends Plugin {
  /**
   * Handle commands
   */
  onCommand = (username, command, args) => {
    if (command !== 'inventory' && command !== 'inv' && command !== 'i') {
      return;
    }

    if (args.length === 0) {
      inventoryInfo(this.bot)
        .then((info) => this.bot.chat(info));
    } else if (args.length === 1 && args[0] === 'toss') {
      inventoryTossAll(this.bot)
        .then(() => this.bot.chat(`Tossed all my inventory items.`));
    }
  };
};
