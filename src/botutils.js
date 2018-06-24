export const navigate = (bot, position, endRadius = 1, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const aStar = bot.navigate.findPathSync(position, {
      timeout,
      endRadius,
    });

    bot.navigate.walk(aStar.path, (status) => {
      return resolve();
    });
  });
};

export const inventoryTossAll = (bot) => {
  return new Promise((resolve, reject) => {
    const inventory = bot.inventory.items();

    const toss = (items) => {
      if (items.length === 0) {
        resolve();
        return;
      }

      bot.tossStack(items.shift(), (err) => {
        if (err) {
          reject(err);
          return;
        }

        toss(items);
      });
    };

    bot.look(bot.entity.yaw, 0, true, () => {
      toss(inventory);
    });
  });
};

export const inventoryInfo = (bot) => {
  return new Promise((resolve, reject) => {
    const inventory = bot.inventory.items();

    const string = inventory.length > 0 ? inventory.map((item) => {
      return `${item.count}: ${item.displayName ? item.displayName : item.name}`;
    }).join(', ') : 'nothing';

    resolve(`I have: ${string} and ${36 - items.length} free slots.`);
  });
};

export const efficientDig = (bot, block) => {
  return new Promise((resolve, reject) => {
    // @TODO: Equip the most efficient tool from the invertory for the block

    bot.dig(block, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
};

// export const navigateToPlayer = (bot, username) => {
//   return new Promise((resolve, reject) => {
//     // @TODO: Cancel all current navigation tasks

//     // Check if the player exists or is online
//     if (!bot.players[username]) {
//       bot.chat(`I can't find ${username}`);
//       return reject('notfound');
//     }

//     // Check if the player is nearby
//     if (!bot.players[username].entity) {
//       return reject()
//     }
//   });
// };


// if (this.state.target !== null) {
//   if (typeof this.state.target === 'string') {
//     this.bot.chat(`Already on my way to ${this.state.target}'s position.`);
//   } else if (typeof this.state.target === 'Vec3') {
//     this.bot.chat(`Already on my way to ${this.state.target.x} ${this.state.target.y} ${this.state.target.z}.`);
//   }
//   return;
// }

// if (!this.bot.players[username]) {
//   this.bot.chat(`I can't find ${username}.`);
//   return;
// }

// if (!this.bot.players[username].entity) {
//   this.bot.chat(`${username} is too far away from me.`);
//   return;
// }

// this.setState({
//   target: username,
// });

// this.bot.navigate.to(this.bot.players[username].entity.position);