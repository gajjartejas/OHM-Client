/*
 * Reducer actions related with login
 */
import * as types from './types';
import IDevice from 'app/models/models/device';
import IDeviceInfo from 'app/models/models/deviceInfo';
import { LSSingleScanResult } from 'react-native-lan-port-scanner';

export function requestScan() {
  return {
    type: types.DEVICE_REQUEST_SCAN,
  };
}

export function onNewDeviceFound(response: LSSingleScanResult) {
  return {
    type: types.ON_NEW_DEVICE_FOUND,
    payload: response,
  };
}

export function onDeviceScanFinish() {
  return {
    type: types.ON_DEVICE_SCAN_FINISH,
  };
}

export function selectDevice(response: IDevice | null) {
  return {
    type: types.DEVICE_REQUEST_SELECT_DEVICE,
    payload: response,
  };
}

export function removeSelectedDevice() {
  return {
    type: types.DEVICE_REQUEST_REMOVE_SELECTED_DEVICE,
  };
}

export function refreshDevice(response: IDevice) {
  return {
    type: types.DEVICE_REQUEST_REFRESH_DEVICE_INFO,
    payload: response,
  };
}

export function onRefreshDevice(response: IDeviceInfo) {
  return {
    type: types.ON_REFRESH_DEVICE_INFO,
    payload: response,
  };
}

export function onFetchDeviceInfo(response: { ipAddress: string; deviceInfo: IDeviceInfo }) {
  return {
    type: types.ON_FETCH_DEVICE_INFO,
    payload: response,
  };
}

export function errorOnFetchDeviceInfo(error: any) {
  return {
    type: types.ON_ERROR_FETCH_DEVICE_INFO,
    payload: error,
  };
}

export function removeAllDevices() {
  return {
    type: types.DEVICE_REQUEST_REMOVE_ALL,
  };
}

export function configureStartup() {
  return {
    type: types.DEVICE_CONFIGURE_STARTUP,
  };
}
