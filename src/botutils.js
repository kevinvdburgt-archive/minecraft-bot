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
