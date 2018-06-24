import chalk from 'chalk';

export const log = (...args) => {
  console.log(`[${chalk.red('MinecraftBot')}]`, ...args);
};
