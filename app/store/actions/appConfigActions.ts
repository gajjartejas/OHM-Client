/*
 * Reducer actions related with login
 */
import * as types from './types';

export function setAppConfigPath(response: string) {
  return {
    type: types.SET_APP_CONFIG_PATH,
    payload: response,
  };
}

export function setAppConfigPort(response: number) {
  return {
    type: types.SET_APP_CONFIG_PORT,
    payload: response,
  };
}

export function setAppConfigRefreshInterval(response: number) {
  return {
    type: types.SET_APP_CONFIG_REFRESH_INTERVAL,
    payload: response,
  };
}

export function setRefreshing(response: boolean) {
  return {
    type: types.SET_APP_CONFIG_RESTORE_DEFAULT,
    payload: response,
  };
}

export function setAppConfigRestoreDefault() {
  return {
    type: types.SET_APP_CONFIG_RESTORE_DEFAULT,
  };
}

export function setAppConfigAuth(response: { username: string; password: string }) {
  return {
    type: types.SET_APP_CONFIG_AUTH,
    payload: response,
  };
}
