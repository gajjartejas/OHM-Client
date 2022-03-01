/**
 * Loading reducer made separate for easy blacklisting
 * Avoid data persist
 */
import createReducer from 'app/lib/createReducer';
import * as types from 'app/store/actions/types';

import { IAppearanceType, IThemeState } from 'app/models/reducers/theme';
import { IThemeToggleAction, IThemeUpdatePrimaryColorAction, IThemeUResetAction } from 'app/models/actions/theme';
import { Appearance } from 'react-native';

const initialState: IThemeState = {
  isDark: Appearance.getColorScheme() === 'dark',
  appearance: IAppearanceType.Auto,

  primary: '#6200EE',
  onPrimary: '#000000',

  background: '#000000',
  onBackground: '#FFFFFF',

  surface: '#222222',
  onSurface: '#FFFFFF',

  error: '#B000020',
};

export const themeReducer = createReducer(initialState, {
  [types.SET_APPEARANCE](state: IThemeState, action: IThemeToggleAction) {
    let isDark =
      action.appearance === IAppearanceType.Auto
        ? Appearance.getColorScheme() === 'dark'
        : action.appearance === 'dark';

    return { ...state, appearance: action.appearance, isDark: isDark };
  },
  [types.SET_PRIMARY_COLOR](state: IThemeState, action: IThemeUpdatePrimaryColorAction) {
    return { ...state, primary: action.primaryColor, onPrimary: action.onPrimary };
  },
  [types.RESET_THEME](_state: IThemeState, _action: IThemeUResetAction) {
    return { ...initialState };
  },
});
