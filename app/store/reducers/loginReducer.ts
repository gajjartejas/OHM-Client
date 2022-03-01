/* Login Reducer
 * handles login states in the app
 */
import createReducer from 'app/lib/createReducer';
import * as types from 'app/store/actions/types';
import { ILoginState } from 'app/models/reducers/login';

const initialState: ILoginState = {
  isLoggedIn: false,
};

export const loginReducer = createReducer(initialState, {
  [types.LOGIN_REQUEST](state: ILoginState, action: { type: string; payload: boolean }) {
    return {
      ...state,
      id: action.payload,
    };
  },
});
