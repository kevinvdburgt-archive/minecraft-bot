import fs from 'fs';
import path from 'path';
import sha1 from 'sha1';
import config from '../config';

export const writeCache = (filename, data) => {
  const file = path.resolve(config.cachedir, `${sha1(filename)}.json`);
  fs.writeFile(file, JSON.stringify(data), (err) => {
    if (err) {
      console.error(err);
    }
  })
};

export const readCache = (filename, init = {}) => {
  try {
    const file = path.resolve(config.cachedir, `${sha1(filename)}.json`);
    return JSON.parse(fs.readFileSync(file));
  } catch (e) {
    return init;
  }
};

export const log = (...args) => {
  console.log(...args);
};
