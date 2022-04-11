import IAPIDeviceInfo, { IAPIHardwareType, IAPISensorType, IAPISystemType } from 'app/models/api/deviceInfo';
import DeviceInfo from 'app/models/models/deviceInfo';

const getHardwareFromImageFile = (typeNode: string): IAPIHardwareType | null => {
  switch (typeNode) {
    case 'images_icon/cpu.png':
      return IAPIHardwareType.CPU;
    case 'images_icon/nvidia.png':
      return IAPIHardwareType.GpuNvidia;
    case 'images_icon/ati.png':
      return IAPIHardwareType.GpuAti;
    case 'images_icon/intel.png':
      return IAPIHardwareType.GpuIntel;
    case 'images_icon/hdd.png':
      return IAPIHardwareType.HDD;
    case 'images_icon/bigng.png':
      return IAPIHardwareType.Heatmaster;
    case 'images_icon/mainboard.png':
      return IAPIHardwareType.Mainboard;
    case 'images_icon/chip.png':
      return IAPIHardwareType.Chipset;
    case 'images_icon/bigng.png':
      return IAPIHardwareType.TBalancer;
    case 'images_icon/ram.png':
      return IAPIHardwareType.RAM;
    case 'images_icon/nic.png':
      return IAPIHardwareType.NIC;
    case 'images_icon/battery.png':
      return IAPIHardwareType.Battery;
    default:
      return null;
  }
};

const getSensorTypeFromImageFile = (typeNode: string): IAPISensorType | null => {
  switch (typeNode) {
    case 'images_icon/voltage.png':
      return IAPISensorType.Voltage;
    case 'images_icon/clock.png':
      return IAPISensorType.Clock;
    case 'images_icon/load.png':
      return IAPISensorType.Load;
    case 'images_icon/temperature.png':
      return IAPISensorType.Temperature;
    case 'images_icon/fan.png':
      return IAPISensorType.Fan;
    case 'images_icon/flow.png':
      return IAPISensorType.Flow;
    case 'images_icon/control.png':
      return IAPISensorType.Control;
    case 'images_icon/level.png':
      return IAPISensorType.Level;
    case 'images_icon/power.png':
      return IAPISensorType.Power;
    case 'images_icon/throughput.png':
      return IAPISensorType.Throughput;
    case 'images_icon/current.png':
      return IAPISensorType.Current;
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
  } as DeviceInfo;
  const imageURL = node.ImageURL;
  if (imageURL) {
    const system = getSystemFromImageFile(imageURL);
    const hardware = getHardwareFromImageFile(imageURL);
    const sensor = getSensorTypeFromImageFile(imageURL);
    if (system) {
      newNode.type = system;
    } else if (hardware) {
      newNode.type = hardware;
    } else if (sensor) {
      newNode.type = sensor;
    }
  }

  if (node.Children && node.Children.length > 0) {
    const childrenNodes = node.Children;
    for (const key in childrenNodes) {
      if (Object.prototype.hasOwnProperty.call(childrenNodes, key)) {
        const childNode = childrenNodes[key];
        const nodeModel = convertNodeToModel(childNode);
        const nodeName = (newNode.type ? newNode.type : newNode.text).toLowerCase();
        // @ts-ignore
        if (!newNode[nodeName]) {
          // @ts-ignore
          newNode[nodeName] = [nodeModel];
        } else {
          // @ts-ignore
          newNode[nodeName].push(nodeModel);
        }
      }
    }
  }

  return newNode;
};

export default convertNodeToModel;
