import Plugin from '../Plugin';
import { sleep, wake } from '../utils/botactions';

export default class Sleep extends Plugin {
  onCommand = (username, command, args) => {
    switch (command) {
      case 'sleep':
        sleep(this.bot)
          .then(() => {
            this.bot.chat(`Sleeping..`);
          })
          .catch((err) => {
            this.bot.chat(`I can't sleep, ${err}.`);
          });
        break;

      case 'wake':
      case 'wakeup':
        wake(this.bot)
          .then(() => {
            this.bot.chat(`I woke up.`);
          })
          .catch((err) => {
            this.bot.chat(`I can't wake up, ${err}.`);
          });
        break;
    }
  };
};
