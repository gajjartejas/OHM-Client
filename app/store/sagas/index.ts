//Third Party
import IDevice from 'app/models/models/device';
import { put, call, takeEvery, cancelled, take, select, all, delay, takeLatest } from 'redux-saga/effects';
import * as types from 'app/store/actions/types';

//API+Modals
import scanDevices from 'app/services/scanDevices';
import inspectService from 'app/services/inspectService';
import * as devicesActions from 'app/store/actions/devicesActions';
import IState from 'app/models/models/appState';
import { IAppConfigState } from 'app/models/reducers/appConfig';
import { IDeviceState } from 'app/models/reducers/device';

const getAppConfig = (state: IState) => state.appConfigReducer;
const getDeviceState = (state: IState) => state.deviceReducer;

function* fetchDeviceAsync(_action: { type: string }): Generator<any, any, any> {
  const chan = yield call(scanDevices);

  try {
    while (true) {
      let device = yield take(chan);
      yield put(devicesActions.onNewDeviceFound(device));
    }
  } finally {
    if (yield cancelled()) {
      chan.close();
    }
    yield put(devicesActions.onDeviceScanFinish());
  }
}

function* fetchDeviceInfoAsync(action: { type: string; payload: IDevice }): Generator<any, any, any> {
  if (!action.payload) {
    return;
  }
  try {
    let appConfig = yield select(getAppConfig);
    const response = yield call(inspectService, { device: action.payload, appConfig: appConfig });
    yield put(devicesActions.onFetchDeviceInfo({ ipAddress: action.payload.ip, deviceInfo: response }));
  } catch (error: any) {
    yield processError(error);
  }
}

function* refreshDeviceInfoAsync(_action: { type: string }): Generator<any, any, any> {
  let appConfig: IAppConfigState = yield select(getAppConfig);
  let deviceState: IDeviceState = yield select(getDeviceState);

  if (!deviceState.selectedDevice) {
    return;
  }

  try {
    const response = yield call(inspectService, { device: deviceState.selectedDevice, appConfig: appConfig });
    yield put(devicesActions.onRefreshDeviceInfo(response));
    yield delay(appConfig.refreshInterval);
    yield put(devicesActions.refreshDeviceInfo());
  } catch (error: any) {
    yield processError(error);
    yield delay(appConfig.refreshInterval);
    yield put(devicesActions.refreshDeviceInfo());
  }
}

function* refreshDeviceInfoOnceAsync(_action: { type: string }): Generator<any, any, any> {
  let appConfig: IAppConfigState = yield select(getAppConfig);
  let deviceState: IDeviceState = yield select(getDeviceState);
  if (!deviceState.selectedDevice) {
    return;
  }
  try {
    const response = yield call(inspectService, { device: deviceState.selectedDevice, appConfig: appConfig });
    yield put(devicesActions.onRefreshDeviceInfo(response));
  } catch (error: any) {
    yield processError(error);
  }
}

function* processError(error: any) {
  if (error && error.code === 401) {
    yield put(devicesActions.onInvalidAuthFetchDeviceInfo());
  } else {
    yield put(devicesActions.onErrorFetchDeviceInfo(error));
  }
}

function* actionWatcher() {
  yield takeLatest(types.DEVICE_REQUEST_SCAN, fetchDeviceAsync);
  yield takeLatest(types.DEVICE_REQUEST_SELECT_DEVICE, fetchDeviceInfoAsync);
  yield takeEvery(types.DEVICE_REQUEST_REFRESH_DEVICE_INFO, refreshDeviceInfoAsync);
  yield takeLatest(types.SET_APP_CONFIG_AUTH, refreshDeviceInfoOnceAsync);
}

// Our worker Saga that scan the device
export default function* mySaga() {
  yield all([actionWatcher()]);
}
