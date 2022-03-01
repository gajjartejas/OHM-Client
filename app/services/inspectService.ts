//Modals
import IDevice from 'app/models/models/device';
import convertNodeToModel from 'app/models/mapper/deviceInfo';
import { IAppConfigState } from 'app/models/reducers/appConfig';
import DeviceInfo from 'app/models/models/deviceInfo';

const inspectService = ({
  device,
  appConfig,
}: {
  device: IDevice;
  appConfig: IAppConfigState;
}): Promise<DeviceInfo> => {
  return new Promise((resolve, reject) => {
    fetch(`http://${device.ip}:${appConfig.port}${appConfig.path}`)
      .then(response => response.json())
      .then(json => {
        resolve(convertNodeToModel(json));
      })
      .catch(error => {
        reject(error);
      });
  });
};

export default inspectService;
