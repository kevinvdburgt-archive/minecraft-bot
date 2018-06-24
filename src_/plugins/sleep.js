import Plugin from '../plugin';
import { navigate } from '../botutils';

export default class Sleep extends Plugin {
  /**
   * Find the current closest bed, and sleep in it.
   */
  sleep = async () => {
    const bed = this.bot.findBlock({
      matching: 26,
    });

    if (!bed) {
      this.bot.chat(`I can't find any nearby beds.`);
      return;
    };

    await navigate(this.bot, bed.position);

    this.bot.sleep(bed, (err) => {
      if (err) {
        this.bot.chat(`I can't sleep, ${err.message}.`);
        return;
      }

      this.bot.chat(`Sleeping..`);
    });
  };

  /**
   * Wake up from sleeping
   */
  wake = async () => {
    this.bot.wake((err) => {
      if (err) {
        this.bot.chat(`I can't wake up, ${err}.`);
        return;
      }

      this.bot.chat(`I woke up!`);
    });
  };

  /**
   * Handle commands
   */
  onCommand = (username, command, args) => {
    switch (command) {
      case 'sleep':
        this.sleep();
        break;

      case 'wake':
      case 'wakeup':
        this.wake();
        break;
    }
  };
};
