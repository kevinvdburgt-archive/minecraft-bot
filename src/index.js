import MinecraftBot from './MinecraftBot';
import { log } from './utils';
import config from '../config';

log(`Creating ${config.bots.length} bot(s)..`);

const bots = config.bots.map((cfg) => {
  return new MinecraftBot(cfg);
});
