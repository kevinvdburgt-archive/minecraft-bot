export const navigate = (bot, position, endRadius = 1, timeout = 5000) => {
  return new Promise(async (resolve, reject) => {
    const pathFinding = bot.navigate.findPathSync(position, {
      timeout,
      endRadius,
    });

    bot.navigate.walk(pathFinding.path, (status) => {
      return resolve(status);
    });
  });
};

export const navigateToPlayer = (bot, username) => {
  return new Promise(async (resolve, reject) => {
    if (!bot.players[username]) {
      return reject(`Can't find ${username}.`);
    }

    if (!bot.players[username].entity) {
      return reject(`${username} is too far away.`);
    }

    bot.navigate.to(bot.players[username].entity.position);

    return resolve();
  });
};

export const navigateToPosition = (bot, position) => {
  return new Promise(async (resolve, reject) => {
    bot.navigate.to(position);

    return resolve();
  });
};

export const navigatePath = (bot, path) => {
  return new Promise(async (resolve, reject) => {
    bot.navigate.walk(path);

    return resolve();
  });
};

export const navigateStop = (bot) => {
  return new Promise(async (resolve, reject) => {
    bot.navigate.stop('interrupted');

    return resolve();
  });
};

export const sleep = (bot, block) => {
  return new Promise(async (resolve, reject) => {
    if (!block) {
      block = bot.findBlock({
        matching: 26,
      });
    }

    // Check if the block is a bed
    if (!block || block.type !== 26) {
      return reject(`No bed found!`);
    }

    await navigate(bot, block.position, 2);

    bot.sleep(block, (err) => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
};

export const wake = (bot) => {
  return new Promise(async (resolve, reject) => {
    bot.wake((err) => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
};

export const digEfficient = (bot, block) => {
  return new Promise(async (resolve, reject) => {
    // @TODO: Equip the most efficient tool, if there arent any tools, reject.

    bot.dig(block, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};
