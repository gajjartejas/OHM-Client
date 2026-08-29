import { NavigatorScreenParams } from '@react-navigation/native';
import IConnectionIdentity from 'app/models/models/identity';
import IDevice from 'app/models/models/device';

export type LoadingParams = undefined | Record<string, never>;
export type MoreAppsParams = undefined | Record<string, never>;
export type SettingsParams = undefined | Record<string, never>;
export type LicenseTypes = undefined | Record<string, never>;
export type AboutParams = undefined | Record<string, never>;
export type SelectAppearanceParams = undefined | Record<string, never>;
export type TranslatorsParams = undefined | Record<string, never>;
export type DeviceInfoParams = undefined | Record<string, never>;
export interface PurchaseScreenParams {
  fromTheme: boolean;
}

export type HomeTabsParams = undefined | Record<string, never>;

export type MoreTabParams = undefined | Record<string, never>;
export type ScanSettingParams = undefined | Record<string, never>;
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
export type ScanDevicesParams = undefined | Record<string, never>;
export type ChangeLanguageParams = undefined | Record<string, never>;
export type WebViewSettingParams = undefined | Record<string, never>;
export type DeviceInfoWebViewParams = undefined | Record<string, never>;

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
  WebViewSetting: WebViewSettingParams;
  DeviceInfoWebView: DeviceInfoWebViewParams;
};

export type HomeTabsNavigatorParams = {
  ManageDevices: ManageDevicesParams;
  MoreTab: MoreTabParams;
};

export type HomeTabNavigatorParams = {
  LoggedInTabNavigator: NavigatorScreenParams<LoggedInTabNavigatorParams>;
};
