import Plugin from '../plugin';

export default class Chat extends Plugin {
  onChat = (username, message) => {
    this.log(`${username}: ${message}`);
  };
};
