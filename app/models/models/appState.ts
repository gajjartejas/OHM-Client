import { ILoginState } from 'app/models/reducers/login';
import { IDeviceState } from 'app/models/reducers/device';
import { IThemeState } from 'app/models/reducers/theme';
import { IAppConfigState } from '../reducers/appConfig';

export default interface IState {
  loginReducer: ILoginState;
  themeReducer: IThemeState;
  deviceReducer: IDeviceState;
  appConfigReducer: IAppConfigState;
  // eslint-disable-next-line semi
}
