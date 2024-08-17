import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import zustandStorage from 'app/store/zustandStorage';
import IConnectionIdentity from 'app/models/models/identity';
import IDevice from 'app/models/models/device';

interface IAppConfigState {
  identities: IConnectionIdentity[];
  devices: IDevice[];
  selectedDevice: IDevice | null;
  refreshRateInMs: number;
}

interface IAppConfigActions {
  reset: () => void;
  upsertIdentity: (identity: IConnectionIdentity) => void;
  deleteIdentity: (id: string) => void;
  upsertDevice: (device: IDevice) => void;
  deleteDevice: (deviceId: string) => void;
  selectDevice: (device: IDevice) => void;
  switchDeviceIp: (ipAddress: string) => void;
}

const initialState: IAppConfigState = {
  identities: [],
  devices: [],
  selectedDevice: null,
  refreshRateInMs: 1000,
};

const useAppConfigStore = create<IAppConfigState & IAppConfigActions>()(
  devtools(
    persist(
      set => ({
        ...initialState,
        reset: () => set(_state => ({ ...initialState })),
        upsertIdentity: (idnt: IConnectionIdentity) =>
          set(state => {
            const newIdentifier = [...state.identities];
            const i = newIdentifier.findIndex(_element => _element.id === idnt.id);
            if (i > -1) {
              newIdentifier[i] = idnt;
            } else {
              newIdentifier.unshift(idnt);
            }
            return { ...state, identities: newIdentifier };
          }),
        deleteIdentity: (id: string) =>
          set(state => ({ ...state, identities: [...state.identities.filter(v => v.id !== id)] })),
        upsertDevice: (dev: IDevice) =>
          set(state => {
            const newDevice = [...state.devices];
            const i = newDevice.findIndex(_element => _element.id === dev.id);
            if (i > -1) {
              newDevice[i] = dev;
            } else {
              newDevice.unshift(dev);
            }
            return {
              ...state,
              devices: newDevice,
              selectedDevice:
                state.selectedDevice?.id === dev.id ? { ...state.selectedDevice, ...dev } : state.selectedDevice,
            };
          }),
        deleteDevice: (id: string) =>
          set(state => ({ ...initialState, devices: [...state.devices.filter(v => v.id !== id)] })),
        selectDevice: (d: IDevice) => set(() => ({ selectedDevice: d })),
        switchDeviceIp: (ip: string) =>
          set(state => {
            const selectedDevice = state.selectedDevice ? { ...state.selectedDevice, selectedIp: ip } : null;
            const newDevices = [...state.devices];
            const devices = newDevices.map(device => (device.id === selectedDevice?.id ? selectedDevice : device));
            return {
              ...state,
              selectedDevice: selectedDevice,
              devices: devices,
            };
          }),
      }),
      {
        name: 'app-config-storage',
        storage: createJSONStorage(() => zustandStorage),
        onRehydrateStorage: state => {
          console.log('useAppConfigStore->hydration starts', state);
        },
        version: 1,
      },
    ),
  ),
);

export default useAppConfigStore;
