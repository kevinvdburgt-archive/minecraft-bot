/**
 * Documentation: http://wiki.vg/Mojang_API
 */

import request from 'request';

const apiServer = 'https://api.mojang.com';

export const playersToUUIDs = (players) => {
  return new Promise((resolve, reject) => {
    request.post({
      url: `${apiServer}/profiles/minecraft`,
      json: [
        ...players,
      ],
    }, (error, response, body) => {
      if (error || body.error) {
        return reject(error || body);
      }

      return resolve(body);
    });
  });
};
