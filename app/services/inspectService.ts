//Modals
import convertNodeToModel from 'app/models/mapper/deviceInfo';
import DeviceInfo from 'app/models/models/deviceInfo';
// @ts-ignore
import base64 from 'react-native-base64';

const inspectService = (config: {
  ipAddress: string;
  port: number;
  path: string;
  username: string | null;
  password: string | null;
  abortController: AbortController | null;
}): Promise<DeviceInfo> => {
  const { ipAddress, port, path, username, password, abortController } = config;
  return new Promise((resolve, reject) => {
    const controller = abortController ? abortController : new AbortController();
    // 5 second timeout:
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    fetch(`http://${ipAddress}:${port}${path}`, {
      method: 'GET',
      headers:
        username !== null && password !== null
          ? { Authorization: `Basic ${base64.encode(`${username}:${password}`)}` }
          : {},
      signal: controller.signal,
    })
      .then(response => {
        if (!response.ok) {
          let error = new Error('HTTP status ' + response.status);
          Object.assign(error, { code: response.status });
          reject(error);
        }
        return response.json();
      })
      .then(json => {
        resolve(convertNodeToModel(json));
      })
      .catch(error => {
        reject(error);
      })
      .finally(() => {
        clearTimeout(timeoutId);
      });
  });
};

export default inspectService;
