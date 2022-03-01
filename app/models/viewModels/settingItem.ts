//Interfaces
import { IconType } from 'react-native-easy-icon/src/Icon';
import { IAppearanceType } from '../reducers/theme';

export interface ISettingItem {
  id: number;
  iconName: string;
  iconType: IconType;
  title: string;
  description?: string;
  route?: any;
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
