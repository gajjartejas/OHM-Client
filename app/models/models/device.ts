import IConnectionIdentity from 'app/models/models/identity';

interface IDevice {
  id: string;
  name: string | null;
  ip1: string;
  ip2: string | null;
  ip3: string | null;
  path: string;
  port: number;
  selectedIp: string;
  reachable?: boolean;
  secureConnection: boolean;
  refreshRateInMs: number;
  identity?: IConnectionIdentity | null;
}

export default IDevice;
