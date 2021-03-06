//Modals
import IDevice from 'app/models/models/device';
import convertNodeToModel from 'app/models/mapper/deviceInfo';
import { IAppConfigState } from 'app/models/reducers/appConfig';
import DeviceInfo from 'app/models/models/deviceInfo';
import base64 from 'react-native-base64';

const inspectService = ({
  device,
  appConfig,
}: {
  device: IDevice;
  appConfig: IAppConfigState;
}): Promise<DeviceInfo> => {
  return new Promise((resolve, reject) => {
    fetch(`http://${device.ip}:${appConfig.port}${appConfig.path}`, {
      method: 'GET',
      headers: { Authorization: `Basic ${base64.encode(`${appConfig.username}:${appConfig.password}`)}` },
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
      });
  });
};

export default inspectService;
