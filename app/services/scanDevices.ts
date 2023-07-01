import LanPortScanner, { LSConfig } from 'react-native-lan-port-scanner';
import { eventChannel, END } from 'redux-saga';
import { IAppConfigState } from 'app/models/reducers/appConfig';

const scanDevices = ({ appConfig }: { appConfig: IAppConfigState }) => {
  return eventChannel(emitter => {
    LanPortScanner.getNetworkInfo().then(networkInfo => {
      let config: LSConfig = {
        networkInfo: networkInfo,
        ports: [appConfig.port],
        timeout: appConfig.scanTimeoutInMs,
        threads: appConfig.scanThreads,
      };

      LanPortScanner.startScan(
        config,
        (_totalHosts: number, _hostScanned: number) => {},
        result => {
          if (result) {
            emitter(result);
          }
        },
        () => {
          emitter(END);
        },
      );
    });
    return () => {};
  });
};

export default scanDevices;
