/*
 * Reducer actions related with login
 */
import { IAppearanceType } from 'app/models/reducers/theme';
import * as types from './types';

export function setAppearance(value: IAppearanceType) {
  return {
    type: types.SET_APPEARANCE,
    appearance: value,
  };
}

export function setPrimaryColor(primaryColor: string) {
  return {
    type: types.SET_PRIMARY_COLOR,
    primaryColor: primaryColor,
  };
}

export function resetTheme() {
  return {
    type: types.RESET_THEME,
  };
}
