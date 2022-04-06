import LanPortScanner, { LSConfig } from 'react-native-lan-port-scanner';
import { eventChannel, END } from 'redux-saga';

const scanDevices = () => {
  return eventChannel(emitter => {
    LanPortScanner.getNetworkInfo().then(networkInfo => {
      let config: LSConfig = {
        networkInfo: networkInfo,
        ports: [8085],
        timeout: 1000,
        threads: 150,
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
