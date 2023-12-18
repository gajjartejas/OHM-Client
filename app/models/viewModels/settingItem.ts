//Interfaces
import { IAppearanceType } from 'app/store/themeConfig';
import { IconType } from 'react-native-easy-icon/src/Icon';

export interface ISettingItem {
  id: number;
  iconName: string;
  iconType: IconType;
  title: string;
  description: string;
  route?: any;
  touchable?: boolean;
}

export interface ISettingSection {
  id: number;
  title: string;
  items: ISettingItem[];
}

export interface ISettingThemeOptions {
  id: number;
  title: string;
  value: IAppearanceType;
}
