export enum IAPISensorType {
  Voltage = 'Voltage',
  Current = 'Current',
  Power = 'Power',
  Clock = 'Clock',
  Temperature = 'Temperature',
  Load = 'Load',
  Frequency = 'Frequency',
  Fan = 'Fan',
  Flow = 'Flow',
  Control = 'Control',
  Level = 'Level',
  Factor = 'Factor',
  IntFactor = 'IntFactor',
  Data = 'Data',
  SmallData = 'SmallData',
  Throughput = 'Throughput',
  TimeSpan = 'TimeSpan',
  Timing = 'Timing',
  Energy = 'Energy',
  Noise = 'Noise',
  Conductivity = 'Conductivity',
  Humidity = 'Humidity',
  Capacity = 'Capacity',
  Percentage = 'Percentage',
}

export enum IAPIHardwareType {
  Motherboard = 'Motherboard',
  Mainboard = 'Mainboard',
  SuperIO = 'SuperIO',
  Chipset = 'Chipset',
  CPU = 'CPU',
  Cpu = 'Cpu',
  Memory = 'Memory',
  RAM = 'RAM',
  GpuNvidia = 'GpuNvidia',
  GpuAmd = 'GpuAmd',
  GpuAti = 'GpuAti',
  GpuIntel = 'GpuIntel',
  Storage = 'Storage',
  HDD = 'HDD',
  Network = 'Network',
  NIC = 'NIC',
  Cooler = 'Cooler',
  EmbeddedController = 'EmbeddedController',
  Psu = 'Psu',
  Battery = 'Battery',
  PowerMonitor = 'PowerMonitor',
  Heatmaster = 'Heatmaster',
  TBalancer = 'TBalancer',
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
  HardwareId?: string;
  SensorId?: string;
  Type?: string;
  RawMin?: string;
  RawValue?: string;
  RawMax?: string;
}

