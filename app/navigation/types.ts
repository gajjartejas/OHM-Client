import { NavigatorScreenParams } from '@react-navigation/native';
import IConnectionIdentity from 'app/models/models/identity';
import IDevice from 'app/models/models/device';

export interface LoadingParams {}
export interface MoreAppsParams {}
export interface SettingsParams {}
export interface LicenseTypes {}
export interface AboutParams {}
export interface SelectAppearanceParams {}
export interface TranslatorsParams {}
export interface DeviceInfoParams {}
export interface PurchaseScreenParams {
  fromTheme: boolean;
}

export interface HomeTabsParams {}

export interface MoreTabParams {}
export interface ScanSettingParams {}
export interface AddDeviceParams {
  device?: IDevice;
  mode?: 'create' | 'edit' | 'connect';
}
export interface IdentitiesParams {
  mode?: 'view' | 'select';
}
export interface ManageDevicesParams {
  mode?: 'view' | 'select' | 'connect';
}
export interface AddIdentityParams {
  identity?: IConnectionIdentity;
}
export interface ScanDevicesParams {}
export interface ChangeLanguageParams {}

export type LoggedInTabNavigatorParams = {
  Loading: LoadingParams;
  HomeTabs: HomeTabsParams;
  MoreApps: MoreAppsParams;
  Settings: SettingsParams;
  About: AboutParams;
  SelectAppearance: SelectAppearanceParams;
  License: LicenseTypes;
  Translators: TranslatorsParams;
  Purchase: PurchaseScreenParams;
  ScanSetting: ScanSettingParams;
  AddDevice: AddDeviceParams;
  Identities: IdentitiesParams;
  ManageDevices: ManageDevicesParams;
  AddIdentity: AddIdentityParams;
  ScanDevices: ScanDevicesParams;
  ChangeLanguage: ChangeLanguageParams;
  DeviceInfo: DeviceInfoParams;
};

export type HomeTabsNavigatorParams = {
  ManageDevices: ManageDevicesParams;
  MoreTab: MoreTabParams;
};

export type HomeTabNavigatorParams = {
  LoggedInTabNavigator: NavigatorScreenParams<LoggedInTabNavigatorParams>;
};
