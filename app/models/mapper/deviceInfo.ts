import IAPIDeviceInfo, { IAPIHardwareType, IAPISensorType, IAPISystemType } from 'app/models/api/deviceInfo';
import DeviceInfo from 'app/models/models/deviceInfo';

const getHardwareFromImageFile = (typeNode: string): IAPIHardwareType | null => {
  switch (typeNode) {
    case 'images_icon/cpu.png':
      return IAPIHardwareType.CPU;
    case 'images_icon/nvidia.png':
      return IAPIHardwareType.GpuNvidia;
    case 'images_icon/ati.png':
    case 'images_icon/amd.png':
      return IAPIHardwareType.GpuAmd;
    case 'images_icon/intel.png':
      return IAPIHardwareType.GpuIntel;
    case 'images_icon/hdd.png':
      return IAPIHardwareType.Storage;
    case 'images_icon/heatmaster.png':
      return IAPIHardwareType.Heatmaster;
    case 'images_icon/mainboard.png':
      return IAPIHardwareType.Motherboard;
    case 'images_icon/chip.png':
      return IAPIHardwareType.SuperIO;
    case 'images_icon/tbalancer.png':
    case 'images_icon/bigng.png':
      return IAPIHardwareType.TBalancer;
    case 'images_icon/ram.png':
      return IAPIHardwareType.Memory;
    case 'images_icon/nic.png':
      return IAPIHardwareType.Network;
    case 'images_icon/battery.png':
      return IAPIHardwareType.Battery;
    case 'images_icon/fan.png':
      return IAPIHardwareType.Cooler;
    case 'images_icon/power-supply.png':
      return IAPIHardwareType.Psu;
    case 'images_icon/powermonitor.png':
      return IAPIHardwareType.PowerMonitor;
    default:
      return null;
  }
};

const getSensorTypeFromImageFile = (typeNode: string): IAPISensorType | null => {
  switch (typeNode) {
    case 'images_icon/voltage.png':
      return IAPISensorType.Voltage;
    case 'images_icon/current.png':
      return IAPISensorType.Current;
    case 'images_icon/power.png':
      return IAPISensorType.Power;
    case 'images_icon/clock.png':
      return IAPISensorType.Clock;
    case 'images_icon/temperature.png':
      return IAPISensorType.Temperature;
    case 'images_icon/load.png':
      return IAPISensorType.Load;
    case 'images_icon/fan.png':
      return IAPISensorType.Fan;
    case 'images_icon/flow.png':
      return IAPISensorType.Flow;
    case 'images_icon/control.png':
      return IAPISensorType.Control;
    case 'images_icon/level.png':
      return IAPISensorType.Level;
    case 'images_icon/factor.png':
      return IAPISensorType.Factor;
    case 'images_icon/data.png':
      return IAPISensorType.Data;
    case 'images_icon/throughput.png':
      return IAPISensorType.Throughput;
    case 'images_icon/time.png':
      return IAPISensorType.TimeSpan;
    case 'images_icon/loudspeaker.png':
      return IAPISensorType.Noise;
    case 'images_icon/humidity.png':
      return IAPISensorType.Humidity;
    default:
      return null;
  }
};

const getSystemFromImageFile = (typeNode: string): IAPISystemType | null => {
  switch (typeNode) {
    case 'images_icon/computer.png':
      return IAPISystemType.Computer;
    default:
      return null;
  }
};

const convertNodeToModel = (node: IAPIDeviceInfo): DeviceInfo => {
  let newNode = {
    id: node.id,
    text: node.Text,
    min: node.Min,
    value: node.Value,
    max: node.Max,
    imageURL: node.ImageURL,
    type: null,
    hardwareId: node.HardwareId,
    sensorId: node.SensorId,
    rawMin: node.RawMin,
    rawValue: node.RawValue,
    rawMax: node.RawMax,
    children: [],
  } as unknown as DeviceInfo;

  if (node.Type && Object.values(IAPISensorType).includes(node.Type as IAPISensorType)) {
    newNode.type = node.Type as IAPISensorType;
  } else if (node.ImageURL) {
    const system = getSystemFromImageFile(node.ImageURL);
    const hardware = getHardwareFromImageFile(node.ImageURL);
    const sensor = getSensorTypeFromImageFile(node.ImageURL);
    if (system) {
      newNode.type = system;
    } else if (hardware) {
      newNode.type = hardware;
    } else if (sensor) {
      newNode.type = sensor;
    }
  }

  if (node.Children && node.Children.length > 0) {
    const childrenModels: DeviceInfo[] = [];
    for (const childNode of node.Children) {
      const nodeModel = convertNodeToModel(childNode);
      childrenModels.push(nodeModel);
      const nodeName = (newNode.type ? newNode.type : newNode.text).toLowerCase();
      const targetObj = newNode as Record<string, unknown>;
      if (!Array.isArray(targetObj[nodeName])) {
        targetObj[nodeName] = [nodeModel];
      } else {
        (targetObj[nodeName] as DeviceInfo[]).push(nodeModel);
      }
    }
    newNode.children = childrenModels;
  }

  return newNode;
};

export default convertNodeToModel;

