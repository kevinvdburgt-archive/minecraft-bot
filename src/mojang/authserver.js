import request from 'request';

const address = 'https://authserver.mojang.com';
const clientToken = 'MINECRAFT-BOT';

export const authenticate = (username, password) => {
  return new Promise((resolve, reject) => {
    request({
      method: 'POST',
      uri: `${address}/authenticate`,
      json: {
        username,
        password,
        clientToken,
        agent: {
          name: 'Minecraft',
          version: 1,
        },
      },
    }, (error, response, body) => {
      if (error || body.error) {
        return reject(error || body);
      }

      return resolve({
        accessToken: body.accessToken,
        clientToken: body.clientToken,
        selectedProfile: {
          id: body.selectedProfile.id,
          name: body.selectedProfile.name,
        },
      });
    });
  });
};

export const validate = (accessToken) => {
  return new Promise((resolve, reject) => {
    request({
      method: 'POST',
      uri: `${address}/validate`,
      json: {
        accessToken,
        clientToken,
      },
    }, (error, response, body) => {
      if (error) {
        return reject(error);
      }

      if (response.statusCode === 204) {
        return resolve();
      } else {
        return reject(response.statusCode);
      }
    });
  });
};
