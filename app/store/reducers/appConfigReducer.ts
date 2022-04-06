/* Login Reducer
 * handles login states in the app
 */
import createReducer from 'app/lib/createReducer';
import * as types from 'app/store/actions/types';
import { IAppConfigState } from 'app/models/reducers/appConfig';

const initialState: IAppConfigState = {
  path: '/data.json',
  port: 8085,
  refreshInterval: 1000,
  username: null,
  password: null,
};

export const appConfigReducer = createReducer(initialState, {
  [types.SET_APP_CONFIG_PATH](state: IAppConfigState, action: { type: string; payload: string }) {
    return {
      ...state,
      path: action.payload,
    };
  },
  [types.SET_APP_CONFIG_PORT](state: IAppConfigState, action: { type: string; payload: string }) {
    return {
      ...state,
      port: action.payload,
    };
  },
  [types.SET_APP_CONFIG_REFRESH_INTERVAL](state: IAppConfigState, action: { type: string; payload: string }) {
    return {
      ...state,
      refreshInterval: action.payload,
    };
  },
  [types.SET_APP_CONFIG_RESTORE_DEFAULT](_state: IAppConfigState, _action: { type: string; payload: string }) {
    return {
      ...initialState,
    };
  },
  [types.SET_APP_CONFIG_AUTH](
    state: IAppConfigState,
    action: { type: string; payload: { username: string; password: string } },
  ) {
    return {
      ...state,
      username: action.payload.username,
      password: action.payload.password,
    };
  },
});
