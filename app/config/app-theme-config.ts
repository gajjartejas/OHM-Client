import { adaptNavigationTheme, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

export const PaperThemeDefault = {
  ...MD3LightTheme,
  ...LightTheme,
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
    card: '#FFFFFF',
    opacity: '80',

    white: '#ffffff',
    black: '#000000',
  },
};

export const PaperThemeDark = {
  ...MD3DarkTheme,
  ...DarkTheme,
  dark: true,
  colors: {
    ...MD3DarkTheme.colors,
    ...DarkTheme.colors,

    primary: '#6200EE',
    onPrimary: '#000000',

    secondaryContainer: '#6200EE',
    onSecondary: '#000000',

    background: '#000000',
    onBackground: '#FFFFFF',

    surface: '#222222',
    onSurface: '#FFFFFF',

    error: '#FF0000',
    shadow: '#000000',

    textTitle: '#FFFFFF',
    card: '#1E1E1E',
    opacity: '99',

    white: '#ffffff',
    black: '#000000',
  },
};
