import Plugin from '../plugin';

export default class Inventory extends Plugin {
  onCommand = (username, command, args) => {
    if (command !== 'inventory') {
      return;
    }

    // Display all the bot's inventory items
    if (args.length === 0) {
      const items = this.bot.inventory.items();

      const inventoryStr = items.map((item) => {
        return `${item.count}: ${item.displayName ? item.displayName : item.name}`;
      }).join(', ');

      this.bot.chat(`I have: ${items.length > 0 ? inventoryStr : 'nothing'} and ${36 - items.length} free slots.`);
    }

    // Drop all items on the ground
    else if (args.length === 1 && args[0] === 'toss') {
      const items = this.bot.inventory.items();

      const toss = (items) => {
        if (items.length === 0) {
          this.bot.chat(`Okay, i've tossed all items now.`);
          return;
        }

        this.bot.tossStack(items.shift(), (err) => {
          if (err) {
            this.bot.chat(`Unable to toss: ${err}`);
            return;
          }

          toss(items);
        });
      };

      toss(items);
    }
  };
};



// function itemStr(item) {
//   if (item) {
//     return (item.displayName ? item.displayName : item.name) + " x " + item.count;
//   } else {
//     return "(nothing)";
//   }
// }