import fs from 'fs';
import path from 'path';
import sha1 from 'sha1';
import config from '../../config';
import { log } from '../utils';

export const write = (filename, data) => {
  const file = path.resolve(config.cachedir, `${sha1(filename)}.json`);

  log(`Writing cache file ${file}`);

  fs.writeFile(file, JSON.stringify(data), (err) => {
    if (err) {
      log(`Could not write cache file: ${err}`);
      return false;
    }

    return true;
  });
};

export const read = (filename, defaultData = {}) => {
  const file = path.resolve(config.cachedir, `${sha1(filename)}.json`);

  log(`Loading cache file ${file}`);

  try {
    return JSON.parse(fs.readFileSync(file));
  } catch (err) {
    log(`Could not read cache file: ${err}`);
    return defaultData;
  }
};
