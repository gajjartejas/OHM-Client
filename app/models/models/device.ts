import IDeviceInfo from 'app/models/models/deviceInfo';

export default interface IDevice {
  port: number;
  ip: string;
  deviceInfo?: IDeviceInfo | null;
  // eslint-disable-next-line semi
}
