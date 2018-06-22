import vec3 from 'vec3';
import { botCommandParser } from '../utils';

export default ({ bot }) => {
  /**
   * Commands:
   * come                 - Comes to the calling player
   * come <playername>    - Comes to the given playername
   * come <x> <y> <z>     - Comes to the given coordinates
   */
  bot.on('chat', (username, message) => {
    const command = botCommandParser(bot, username, message);
    if (!command) {
      return;
    }

    if (command[0] === 'come') {
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

  bot.navigate.on('pathPartFound', (path) => {
    bot.chat(`Going ${path.length} meters in the general direction now.`);
  });

  bot.navigate.on('pathFound', (path) => {
    bot.chat(`I can get there in ${path.length} meters.`);
  });

  bot.navigate.on('cannotFind', (closestPath) => {
    bot.chat('Unable to find path, getting as close as possible.');
    bot.navigate.walk(closestPath);
  });

  bot.navigate.on('arrived', () => {
    bot.chat('I have arrived!');
  });

  bot.navigate.on('interrupted', () => {
    bot.chat('Something interrupted me...');
  });
};

