import Plugin from '../Plugin';

export default class Chat extends Plugin {
  /**
   * Handle chat events
   */
  onChat = (username, message) => {
    this.log(`${username}: ${message}`);
  };
};
