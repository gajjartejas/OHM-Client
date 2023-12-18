import IDeviceInfo from 'app/models/models/deviceInfo';
import IConnectionIdentity from 'app/models/models/identity';

interface IDevice {
  id: string;
  name?: string | null;
  port: number;
  path: string;
  refreshRateInMs: number;
  ip: string;
  deviceInfo?: IDeviceInfo | null;
  identity?: IConnectionIdentity | null;
}

export default IDevice;
