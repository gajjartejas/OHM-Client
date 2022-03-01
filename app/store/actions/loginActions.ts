/*
 * Reducer actions related with login
 */
import * as types from './types';

export function requestLogin(response: boolean) {
  return {
    type: types.LOGIN_REQUEST,
    payload: response,
  };
}
