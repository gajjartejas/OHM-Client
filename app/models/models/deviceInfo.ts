import { IAPIHardwareType, IAPISensorType, IAPISystemType } from 'app/models/api/deviceInfo';

interface IDeviceInfo {
  id: number;
  text: string;
  min: string;
  value: string;
  max: string;
  imageURL: string;
  type: IAPISensorType | IAPIHardwareType | IAPISystemType | null;
  sensor?: IDeviceSensor[];
  computer?: IDeviceComputer[];
  hardwareId?: string;
  sensorId?: string;
  rawMin?: string;
  rawValue?: string;
  rawMax?: string;
  children?: IDeviceInfo[];
  ipAddress?: string;
  [key: string]: unknown;
}

export interface IDeviceSensor {
  id: number;
  text: string;
  min: string;
  value: string;
  max: string;
  imageURL: string;
  type: string;
  computer?: IDeviceComputer[];
  hardwareId?: string;
  sensorId?: string;
  rawMin?: string;
  rawValue?: string;
  rawMax?: string;
  children?: IDeviceInfo[];
}

export interface IDeviceComputer {
  id: number;
  text: string;
  min: string;
  value: string;
  max: string;
  imageURL: string;
  type: string;
  hardwareId?: string;
  sensorId?: string;
  rawMin?: string;
  rawValue?: string;
  rawMax?: string;
  children?: IDeviceInfo[];
  mainboard?: IDeviceMainboard[];
  cpu?: IDeviceCPU[];
  ram?: IDeviceRAM[];
  gpuati?: IDeviceGpuati[];
  gpunvidia?: IDeviceGpunvidia[];
  gpuintel?: IDeviceGpuintel[];
  hdd?: IDeviceHDD[];
  nic?: IDeviceNIC[];
  battery?: IDeviceBattery[];
  [key: string]: unknown;
}

export interface IDeviceCPU {
  id: number;
  text: string;
  min: string;
  value: string;
  max: string;
  imageURL: string;
  type: IAPISensorType | IAPIHardwareType | null;
  hardwareId?: string;
  sensorId?: string;
  rawMin?: string;
  rawValue?: string;
  rawMax?: string;
  children?: IDeviceInfo[];
  clock?: IDeviceSensorData[];
  temperature?: IDeviceSensorData[];
  load?: IDeviceSensorData[];
  power?: IDeviceSensorData[];
  voltage?: IDeviceSensorData[];
  [key: string]: unknown;
}

export interface IDeviceSensorData {
  id: number;
  text: string;
  min: string;
  value: string;
  max: string;
  imageURL: string;
  type: IAPISensorType | IAPIHardwareType | null;
  hardwareId?: string;
  sensorId?: string;
  rawMin?: string;
  rawValue?: string;
  rawMax?: string;
  children?: IDeviceInfo[];
  [key: string]: unknown;
}

export interface IDeviceGpuati {
  id: number;
  text: string;
  min: string;
  value: string;
  max: string;
  imageURL: string;
  type: null;
  clocks?: IDeviceSensorData[];
  temperatures?: IDeviceSensorData[];
  data?: IDeviceSensorData[];
  throughput?: IDeviceSensorData[];
  voltage?: IDeviceSensorData[];
  clock?: IDeviceSensorData[];
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
  data?: IDeviceSensorData[];
  throughput?: IDeviceSensorData[];
  voltage?: IDeviceSensorData[];
  clock?: IDeviceSensorData[];
  temperature?: IDeviceSensorData[];
  load?: IDeviceSensorData[];
  fan?: IDeviceSensorData[];
  control?: IDeviceSensorData[];
  power?: IDeviceSensorData[];
}

export interface IDeviceGpuintel {
  id: number;
  text: string;
  min: string;
  value: string;
  max: string;
  imageURL: string;
  type: null;
  power?: IDeviceSensorData[];
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
  throughput?: IDeviceSensorData[];
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

export interface IDeviceNIC {
  id: number;
  text: string;
  min: string;
  value: string;
  max: string;
  imageURL: string;
  type: null;
  load?: IDeviceSensorData[];
  power?: IDeviceSensorData[];
  throughput?: IDeviceSensorData[];
}

export interface IDeviceBattery {
  id: number;
  text: string;
  min: string;
  value: string;
  max: string;
  imageURL: string;
  type: null;
  voltage?: IDeviceSensorData[];
  current?: IDeviceSensorData[];
  power?: IDeviceSensorData[];
  level?: IDeviceSensorData[];
  capacity?: IDeviceSensorData[];
}

export default IDeviceInfo;
