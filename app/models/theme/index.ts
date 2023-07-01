import { MD3Colors } from 'react-native-paper/src/types';
import { MD3Theme } from 'react-native-paper';

export interface AppColors extends MD3Colors {
  primary: string;
  onPrimary: string;
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  error: string;
  card: string;
  opacity: string;
  white: string;
  black: string;
  textTitle: string;
  text: string;
}
export interface AppTheme extends MD3Theme {
  colors: AppColors;
}
