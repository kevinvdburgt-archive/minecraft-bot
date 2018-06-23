import Plugin from '../plugin';

export default class Inventory extends Plugin {
  reportInventory = () => {
    const items = this.bot.inventory.items();

    const inventoryString = items.length > 0 ? items.map((item) => {
      return `${item.count}: ${item.displayName ? item.displayName : item.name}`;
    }).join(', ') : 'nothing';

    this.bot.chat(`I have: ${inventoryString} and ${36 - items.length} free slots`);
  };

  tossInventory = () => {
    const tossItem = (items) => {
      if (items.length === 0) {
        this.bot.chat(`Tossed all my items on the ground.`);
        return;
      }

      this.bot.tossStack(items.shift(), (err) => {
        if (err) {
          this.bot.chat(`Unable to toss: ${err}`);
          return;
        }

        tossItem(items);
      });
    };

    tossItem(this.bot.inventory.items());
  };

  depositInventory = () => {
    const inventory = this.bot.inventory.items();

    if (inventory.length === 0) {
      this.bot.chat(`I have nothing to deposit.`);
      return;
    }

    const target = this.bot.findBlock({
      matching: [54, 130, 146],
    });

    if (!target) {
      this.bot.chat(`I can't find any nearby chests.`);
      return;
    }

    const path = this.bot.navigate.findPathSync(target.position, {
      timeout: 2000,
      endRadius: 1,
    });

    this.bot.navigate.walk(path.path, (status) => {
      if (status !== 'arrived') {
        this.bot.chat(`Could not reach chest: ${status}.`);
        return;
      }

      const chest = this.bot.openChest(target);

      chest.on('open', () => {
        const deposit = (items) => {
          if (items.length === 0) {
            this.bot.chat(`Deposited all my items in the chest.`);
            chest.close();
            return;
          }

          const item = items.shift();

          chest.deposit(item.type, null, item.count, (err) => {
            if (err) {
              this.bot.chat(`Unable to deposit all my items, ${err}.`);
              chest.close();
              return;
            }

            deposit(items);
          });
        };

        deposit(inventory);
      });
    });
  };

  onCommand = (username, command, args) => {
    if (command !== 'inventory' && command !== 'inv') {
      return;
    }

    if (args.length === 0) {
      this.reportInventory();
    } else if (args.length === 1 && args[0] === 'toss') {
      this.tossInventory();
    } else if (args.length === 1 && args[0] === 'deposit') {
      this.depositInventory();
    }
  };
};
