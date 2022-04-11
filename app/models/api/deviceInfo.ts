export enum IAPISensorType {
  Voltage = 'Voltage',
  Clock = 'Clock',
  Load = 'Load',
  Temperature = 'Temperature',
  Fan = 'Fan',
  Flow = 'Flow',
  Control = 'Control',
  Level = 'Level',
  Power = 'Power',
  Throughput = 'Throughput',
  Current = 'Current',
  Capacity = 'Capacity',
}

export enum IAPIHardwareType {
  CPU = 'CPU',
  GpuNvidia = 'GpuNvidia',
  GpuAti = 'GpuAti',
  GpuIntel = 'GpuIntel',
  HDD = 'HDD',
  Heatmaster = 'Heatmaster',
  Mainboard = 'Mainboard',
  Chipset = 'Chipset',
  TBalancer = 'TBalancer',
  RAM = 'RAM',
  NIC = 'NIC',
  Battery = 'Battery',
}

export enum IAPISystemType {
  Computer = 'Computer',
}

export default interface IAPIDeviceInfo {
  id: number;
  Text: string;
  Children: IAPIDeviceInfo[];
  Min: string;
  Value: string;
  Max: string;
  ImageURL: string;
  // eslint-disable-next-line semi
}
