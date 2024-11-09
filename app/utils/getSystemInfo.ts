import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const getSystemInfo = () => {
  const title = 'feedback';
  const osType = Platform.OS;
  const systemVersion = DeviceInfo.getSystemVersion();
  const brand = DeviceInfo.getBrand();
  const model = DeviceInfo.getModel();
  const readableVersion = DeviceInfo.getReadableVersion();
  const body = `OS: ${osType} (${systemVersion})\nBrand: ${brand} (${model})\nApp Version: ${readableVersion}`;
  return { title, body };
};

export default getSystemInfo;
