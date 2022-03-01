import { IAppearanceType } from '../reducers/theme';

export interface IThemeToggleAction {
  appearance: IAppearanceType;
}

export interface IThemeUpdatePrimaryColorAction {
  primaryColor: string;
  onPrimary: string;
}

export interface IThemeUResetAction {}
