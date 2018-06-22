import { botCommandParser } from '../utils';

export default ({ bot }) => {
  let state = {
    following: null,
  };

  /**
   * Commands:
   * follow               - Follows to the calling player
   * follow <playername>  - Follows to the given playername
   * follow stop          - Stops following
   */
  bot.on('chat', (username, message) => {
    const command = botCommandParser(bot, username, message);
    if (!command) {
      return;
    }

    if (command[0] === 'follow') {
      // Comes to the calling player
      if (command.length === 1) {
        if (bot.players[username].entity === null) {
          bot.chat(`You are too far away, i cannot find you from here.`);
          return;
        }

        bot.navigate.to(bot.players[username].entity.position);
      }

      // Comes to the given playername
      if (command.length === 2) {
        if (bot.players[username].entity === null) {
          bot.chat(`${command[1]} is too far away.`);
          return;
        }

        bot.navigate.to(bot.players[command[1]].entity.position);
      }

      // Comes to the given coordinates
      if (command.length === 4) {
        const position = vec3(
          command[1],
          command[2],
          command[3],
        );

        bot.navigate.to(position);
      }
    }
  });
};

