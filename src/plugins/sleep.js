import Plugin from '../plugin';

export default class Sleep extends Plugin {
  sleep = () => {
    const bed = this.bot.findBlock({
      matching: 26,
    });

    if (!bed) {
      this.bot.chat(`I can't find any nearby beds.`);
      return;
    }

    const path = this.bot.navigate.findPathSync(bed.position, {
      timeout: 2000,
      endRadius: 1,
    });

    this.bot.navigate.walk(path.path, () => {
      this.bot.sleep(bed, (err) => {
        if (err) {
          this.bot.chat(`I can't sleep, ${err.message}.`);
          return;
        }
        this.bot.chat(`I'm sleeping`);
      });
    });
  };

  wake = () => {
    this.bot.wake((err) => {
      if (err) {
        this.bot.chat(`I can't wake up, ${err.message}.`);
        return;
      }
      this.bot.chat(`I woke up`);
    });
  };

  onCommand = (username, command, args) => {
    if (command === 'sleep') {
      this.sleep();
    } else if (command === 'wake') {
      this.wake();
    }
  };
};
