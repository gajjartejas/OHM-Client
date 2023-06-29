import IDeviceInfo from 'app/models/models/deviceInfo';

interface IDevice {
  port: number;
  ip: string;
  deviceInfo?: IDeviceInfo | null;
}

export default IDevice;
