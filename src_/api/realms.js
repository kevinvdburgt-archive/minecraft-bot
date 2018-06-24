/**
 * Documentation: http://wiki.vg/Realms_API
 */

import request from 'request';

const realmsServer = 'https://pc.realms.minecraft.net';

export const realmsCookieString = (accessToken, uuid, user, version) => {
  return `sid=token:${accessToken}:${uuid};user=${user};version=${version}`;
};

export const realmsAcceptTOS = (cookieString) => {
  return new Promise((resolve, reject) => {
    request.post({
      headers: {
        cookie: cookieString,
      },
      url: `${realmsServer}/mco/tos/agreed`
    }, (error, response, body) => {
      if (error || body.error) {
        return reject(error || body.error);
      }

      return resolve(body);
    });
  });
};

export const realmsWorlds = (cookieString) => {
  return new Promise((resolve, reject) => {
    request.get({
      headers: {
        cookie: cookieString,
      },
      url: `${realmsServer}/worlds`
    }, (error, response, body) => {
      if (error || body.error) {
        return reject(error || body.error);
      }

      return resolve(JSON.parse(body));
    });
  });
};

export const realmsJoin = (cookieString, serverId) => {
  return new Promise((resolve, reject) => {
    request.get({
      headers: {
        cookie: cookieString,
      },
      url: `${realmsServer}/worlds/v1/${serverId}/join/pc`,
    }, (error, response, body) => {
      if (error || body.error) {
        return reject(error || body.error);
      }
      
      return resolve(JSON.parse(body));
    });
  });
};
