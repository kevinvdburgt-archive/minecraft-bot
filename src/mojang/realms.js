import request from 'request';

const address = 'https://pc.realms.minecraft.net';
const clientToken = 'MINECRAFT-BOT';

export const createCookie = (accessToken, uuid, user, version) => {
  return `sid=token:${accessToken}:${uuid};user=${user};version=${version}`;
};

export const acceptTOS = (cookie) => {
  return new Promise((resolve, reject) => {
    request({
      method: 'POST',
      uri: `${address}/mco/tos/agreed`,
      headers: {
        cookie,
      },
    }, (error, response, body) => {
      if (error || body.error) {
        return reject(error || body);
      }

      return resolve(body);
    });
  });
};

export const worlds = (cookie) => {
  return new Promise((resolve, reject) => {
    request({
      method: 'GET',
      uri: `${address}/worlds`,
      headers: {
        cookie,
      },
    }, (error, response, body) => {
      if (error || body.error) {
        return reject(error || body);
      }

      return resolve(JSON.parse(body));
    });
  });
};

export const join = (cookie, serverId) => {
  return new Promise((resolve, reject) => {
    request({
      method: 'GET',
      uri: `${address}/worlds/v1/${serverId}/join/pc`,
      headers: {
        cookie,
      },
    }, (error, response, body) => {
      if (error || body.error) {
        return reject(error || body);
      }

      return resolve(JSON.parse(body));
    });
  });
};
