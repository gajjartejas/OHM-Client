import IDevice from 'app/models/models/device';

export interface IDeviceState {
  devices: IDevice[];
  selectedDevice: IDevice | null;
  isScanning: boolean;
  scanningFinished: boolean | null;
  error: any | null;
  deviceInfoLoading: boolean | null;
  connected: boolean;
  requestAuth: boolean;
  invalidAuthCount: number;
}
