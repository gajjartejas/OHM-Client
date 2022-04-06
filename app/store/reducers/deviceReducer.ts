/* Login Reducer
 * handles login states in the app
 */
import createReducer from 'app/lib/createReducer';
import * as types from 'app/store/actions/types';
import { IDeviceState } from 'app/models/reducers/device';
import IDevice from 'app/models/models/device';
import IDeviceInfo from 'app/models/models/deviceInfo';
import { LSSingleScanResult } from 'react-native-lan-port-scanner';

const initialState: IDeviceState = {
  devices: [],
  selectedDevice: null,
  isScanning: false,
  error: null,
  scanningFinished: null,
  deviceInfoLoading: null,
  connected: false,
  requestAuth: false,
  invalidAuthCount: 0,
};

export const deviceReducer = createReducer(initialState, {
  [types.DEVICE_REQUEST_SCAN](state: IDeviceState, _action: { type: string }) {
    return {
      ...state,
      isScanning: true,
      error: null,
      scanningFinished: false,
      deviceInfoLoading: false,
    };
  },
  [types.ON_NEW_DEVICE_FOUND](state: IDeviceState, action: { type: string; payload: LSSingleScanResult }) {
    return {
      ...state,
      devices: [...state.devices, action.payload],
    };
  },
  [types.ON_DEVICE_SCAN_FINISH](state: IDeviceState, _action: { type: string; payload: IDevice[] }) {
    return {
      ...state,
      isScanning: false,
      scanningFinished: true,
    };
  },
  [types.DEVICE_REQUEST_SELECT_DEVICE](state: IDeviceState, action: { type: string; payload: IDevice }) {
    return {
      ...state,
      selectedDevice: action.payload,
      error: null,
      deviceInfoLoading: true,
      connected: false,
    };
  },
  [types.DEVICE_REQUEST_REFRESH_DEVICE_INFO](state: IDeviceState, _action: { type: string; payload: IDevice }) {
    return {
      ...state,
      deviceInfoLoading: true,
    };
  },
  [types.DEVICE_REQUEST_REMOVE_SELECTED_DEVICE](state: IDeviceState, _action: { type: string }) {
    return {
      ...state,
      selectedDevice: null,
      error: null,
      deviceInfoLoading: false,
      connected: false,
      requestAuth: false,
      invalidAuthCount: 0,
    };
  },
  [types.ON_REFRESH_DEVICE_INFO](state: IDeviceState, action: { type: string; payload: IDeviceInfo }) {
    return {
      ...state,
      selectedDevice: { ...state.selectedDevice, deviceInfo: action.payload },
      connected: true,
      invalidAuthCount: 0,
    };
  },
  [types.ON_FETCH_DEVICE_INFO](
    state: IDeviceState,
    action: { type: string; payload: { ipAddress: string; deviceInfo: IDeviceInfo } },
  ) {
    return {
      ...state,
      selectedDevice: { ...state.selectedDevice, deviceInfo: action.payload.deviceInfo },
      error: null,
      deviceInfoLoading: false,
    };
  },
  [types.DEVICE_REQUEST_REMOVE_ALL](state: IDeviceState, _action: { type: string }) {
    return {
      ...state,
      selectedDevice: null,
      devices: [],
      error: null,
      connected: false,
    };
  },
  [types.ON_ERROR_FETCH_DEVICE_INFO](state: IDeviceState, action: { payload: any }) {
    return {
      ...state,
      error: action.payload,
      deviceInfoLoading: false,
      connected: false,
    };
  },
  [types.DEVICE_CONFIGURE_STARTUP](state: IDeviceState, _action: { payload: any }) {
    return {
      ...state,
      error: null,
      connected: false,
      requestAuth: false,
      invalidAuthCount: 0,
    };
  },
  [types.ON_INVALID_AUTH_FETCH_DEVICE_INFO](state: IDeviceState, _action: { payload: any }) {
    return {
      ...state,
      error: null,
      connected: false,
      requestAuth: true,
      deviceInfoLoading: false,
      invalidAuthCount: state.invalidAuthCount + 1,
    };
  },
  [types.DEVICE_REQUEST_RESET_INVALID_AUTH_COUNT](state: IDeviceState, _action: { payload: any }) {
    return {
      ...state,
      invalidAuthCount: 0,
    };
  },
  [types.DEVICE_REQUEST_SET_DEVICE_INFO_LOADING](state: IDeviceState, action: { payload: boolean }) {
    return {
      ...state,
      deviceInfoLoading: action.payload,
    };
  },
});
