/*
 * combines all th existing reducers
 */
import * as loginReducer from './loginReducer';
import * as themeReducer from './themeReducer';
import * as deviceReducer from './deviceReducer';
import * as appConfigReducer from './appConfigReducer';
export default Object.assign(loginReducer, themeReducer, deviceReducer, appConfigReducer);
