import { IAPIHardwareType, IAPISensorType, IAPISystemType } from 'app/models/api/deviceInfo';

export default interface IDeviceInfo {
  id: number;
  text: string;
  min: string;
  value: string;
  max: string;
  imageURL: string;
  type: IAPISensorType | IAPIHardwareType | IAPISystemType | null;
  sensor: IDeviceSensor[];
  ipAddress: string;
  // eslint-disable-next-line semi
}

export interface IDeviceSensor {
  id: number;
  text: string;
  min: string;
  value: string;
  max: string;
  imageURL: string;
  type: string;
  computer: IDeviceComputer[];
}

export interface IDeviceComputer {
  id: number;
  text: string;
  min: string;
  value: string;
  max: string;
  imageURL: string;
  type: string;
  mainboard?: IDeviceMainboard[];
  cpu?: IDeviceCPU[];
  ram?: IDeviceRAM[];
  gpuati?: IDeviceGpuati[];
  gpunvidia?: IDeviceGpunvidia[];
  hdd?: IDeviceHDD[];
}

export interface IDeviceCPU {
  id: number;
  text: string;
  min: string;
  value: string;
  max: string;
  imageURL: string;
  type: null;
  vlock?: IDeviceSensorData[];
  temperature?: IDeviceSensorData[];
  load?: IDeviceSensorData[];
  power?: IDeviceSensorData[];
}

export interface IDeviceSensorData {
  id: number;
  text: string;
  min: string;
  value: string;
  max: string;
  imageURL: string;
  type: null;
}

export interface IDeviceGpuati {
  id: number;
  text: string;
  min: string;
  value: string;
  max: string;
  imageURL: string;
  type: null;
  voltage?: IDeviceSensorData[];
  vlock?: IDeviceSensorData[];
  temperature?: IDeviceSensorData[];
  load?: IDeviceSensorData[];
  fan?: IDeviceSensorData[];
  control?: IDeviceSensorData[];
  power?: IDeviceSensorData[];
}

export interface IDeviceGpunvidia {
  id: number;
  text: string;
  min: string;
  value: string;
  max: string;
  imageURL: string;
  type: null;
  clocks?: IDeviceSensorData[];
  temperatures?: IDeviceSensorData[];
  load?: IDeviceSensorData[];
  data?: IDeviceSensorData[];
  throughput?: IDeviceSensorData[];
}

export interface IDeviceHDD {
  id: number;
  text: string;
  min: string;
  value: string;
  max: string;
  imageURL: string;
  type: null;
  temperature?: IDeviceSensorData[];
  load?: IDeviceSensorData[];
  data?: IDeviceSensorData[];
  power?: IDeviceSensorData[];
}

export interface IDeviceMainboard {
  id: number;
  text: string;
  min: string;
  value: string;
  max: string;
  imageURL: string;
  type: string;
  chipset: IDeviceChipset[];
}

export interface IDeviceChipset {
  id: number;
  text: string;
  min: string;
  value: string;
  max: string;
  imageURL: string;
  type: null;
  voltage?: IDeviceSensorData[];
  temperature?: IDeviceSensorData[];
  fan?: IDeviceSensorData[];
  control?: IDeviceSensorData[];
}

export interface IDeviceRAM {
  id: number;
  text: string;
  min: string;
  value: string;
  max: string;
  imageURL: string;
  type: null;
  load?: IDeviceSensorData[];
  power?: IDeviceSensorData[];
}
