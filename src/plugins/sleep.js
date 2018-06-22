import { botCommandParser } from '../utils';

export default ({ bot }) => {
  /**
   * Find a nearby bed, and sleep in it.
   */
  const sleep = () => {
    const bed = bot.findBlock({
      matching: 26,
    });

    if (bed) {
      bot.sleep(bed, (err) => {
        if (err) {
          bot.chat(`I can't sleep: ${err.message}`);
          return;
        }

        bot.chat('I\'m sleepi.. zzz.. zz..');
      });
    } else {
      bot.chat(`No nearby bed!`);
    }
  };

  /**
   * Wake up from sleeping
   */
  const wake = () => {
    bot.wake((err) => {
      if (err) {
        bot.chat(`I can't wake up: ${err.message}`);
        return;
      }

      bot.chat(`I woke up!`);
    });
  };

  bot.on('sleep', () => bot.chat('Good night!'));
  bot.on('wake', () => bot.chat('Good morning!'));

  bot.on('chat', (username, message) => {
    const command = botCommandParser(bot, username, message);
    if (!command) {
      return;
    }

    if (command[0] === 'sleep') {
      sleep();
    } else if (command[1] === 'wake') {
      wake();
    }
  });
};
