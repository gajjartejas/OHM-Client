export enum IAppearanceType {
  Light = 'light',
  Dark = 'dark',
  Auto = 'auto',
}

export interface IThemeState {
  isDark: boolean;

  appearance: IAppearanceType;

  primary: string;
  onPrimary: string;

  background: string;
  onBackground: string;

  surface: string;
  onSurface: string;

  error: string;
}
