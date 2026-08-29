import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
  MD3Theme,
} from 'react-native-paper';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

export type ExtendedMD3Theme = MD3Theme & {
  colors: MD3Theme['colors'] & {
    textTitle: string;
    card: string;
    opacity: string;
    white: string;
    black: string;
    text: string;
    border: string;
    notification: string;
  };
};

export const PaperThemeDefault: ExtendedMD3Theme = {
  ...MD3LightTheme,
  ...LightTheme,
  fonts: MD3LightTheme.fonts,
  colors: {
    ...MD3LightTheme.colors,
    ...LightTheme.colors,
    primary: '#6200EE',
    onPrimary: '#000000',
    secondaryContainer: '#6200EE',
    onSecondary: '#FFFFFF',
    background: '#F9F9F9',
    onBackground: '#000000',
    surface: '#F9F9F9',
    onSurface: '#000000',
    error: '#FF0000',
    shadow: '#000000',
    textTitle: '#535b6b',
    opacity: '80',
    white: '#ffffff',
    black: '#000000',
    card: '#ffffff',
    text: '#000000',
    border: '#000000',
    notification: '#ffffff',
  },
};

export const PaperThemeDark: ExtendedMD3Theme = {
  ...MD3DarkTheme,
  ...DarkTheme,
  fonts: MD3DarkTheme.fonts,
  dark: true,
  colors: {
    ...MD3DarkTheme.colors,
    ...DarkTheme.colors,
    primary: '#90CAF9',
    onPrimary: '#000000',
    secondaryContainer: '#1E293B',
    onSecondary: '#FFFFFF',
    background: '#121212',
    onBackground: '#FFFFFF',
    surface: '#1E1E1E',
    surfaceVariant: '#2A2A2A',
    onSurface: '#FFFFFF',
    onSurfaceVariant: '#A0AAB8',
    outlineVariant: 'rgba(255, 255, 255, 0.12)',
    error: '#CF6679',
    shadow: '#000000',
    textTitle: '#FFFFFF',
    opacity: '99',
    white: '#ffffff',
    black: '#000000',
    card: '#1e1e1e',
    text: '#ffffff',
    border: '#ffffff',
    notification: '#ffffff',
  },
};
