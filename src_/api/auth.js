/**
 * Documentation: http://wiki.vg/Authentication
 */

import request from 'request';

const authServer = 'https://authserver.mojang.com';
const clientToken = 'MINECRAFT-BOT';

export const authenticate = (username, password) => {
  return new Promise((resolve, reject) => {
    request.post({
      url: `${authServer}/authenticate`,
      json: {
        username,
        password,
        clientToken,
        agent: {
          name: 'Minecraft',
          version: 1,
        },
      }
    }, (error, response, body) => {
      if (error || body.error) {
        return reject(error || body);
      }

      return resolve(body);
    });
  });
};

export const refresh = (accessToken, clientToken) => {
  return new Promise((resolve, reject) => {
    return reject('Not implemented yet');
  });
};

export const validate = (accessToken, clientToken) => {
  return new Promise((resolve, reject) => {
    return reject('Not implemented yet');
  });
};

export const signout = (accessToken, clientToken) => {
  return new Promise((resolve, reject) => {
    return reject('Not implemented yet');
  });
};

export const invalidate = (accessToken, clientToken) => {
  return new Promise((resolve, reject) => {
    return reject('Not implemented yet');
  });
};
