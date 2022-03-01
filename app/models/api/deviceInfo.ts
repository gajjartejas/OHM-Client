export enum IAPISensorType {
  Voltage = 'Voltage',
  Clock = 'Vlock',
  Load = 'Load',
  Temperature = 'Temperature',
  Fan = 'Fan',
  Flow = 'Flow',
  Control = 'Control',
  Level = 'Level',
  Power = 'Power',
}

export enum IAPIHardwareType {
  CPU = 'CPU',
  GpuNvidia = 'GpuNvidia',
  GpuAti = 'GpuAti',
  HDD = 'HDD',
  Heatmaster = 'Heatmaster',
  Mainboard = 'Mainboard',
  Chipset = 'Chipset',
  TBalancer = 'TBalancer',
  RAM = 'RAM',
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
