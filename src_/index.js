import Bot from './bot';
import config from '../config';
import { log } from './utils';

log(`Starting the Minecraft Bot`);

const bots = config.bots.map((botConfig) => {
  return new Bot(botConfig);
});

log(`${bots.length} bot(s) loaded`);

// @TODO: Add some sort of cli to manage these bots
