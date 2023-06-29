import { NavigatorScreenParams } from '@react-navigation/native';

export interface LoadingParams {}
export interface MoreAppsParams {}
export interface SettingsParams {}
export interface GeneralSettingParams {}
export interface LicenseTypes {}
export interface AboutParams {}
export interface SelectAppearanceParams {}
export interface TranslatorsParams {}
export interface DashboardTab {
  userId: string;
}
export interface PurchaseScreen {
  fromTheme: boolean;
}

export interface HomeTabsParams {}

export interface MoreTabParams {}
export interface DashboardTabParams {}

export type LoggedInTabNavigatorParams = {
  Loading: LoadingParams;
  HomeTabs: HomeTabsParams;
  MoreApps: MoreAppsParams;
  Settings: SettingsParams;
  GeneralSetting: GeneralSettingParams;
  About: AboutParams;
  SelectAppearance: SelectAppearanceParams;
  License: LicenseTypes;
  Translators: TranslatorsParams;
  Purchase: PurchaseScreen;
};

export type HomeTabsNavigatorParams = {
  DashboardTab: DashboardTabParams;
  MoreTab: MoreTabParams;
};

export type HomeTabNavigatorParams = {
  LoggedInTabNavigator: NavigatorScreenParams<LoggedInTabNavigatorParams>;
};
