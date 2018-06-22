import Bot from './bot';
import config from '../config';

const bots = config.bots.map((botConfig) => {
  return new Bot(botConfig);
});
