import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import zustandStorage from 'app/store/zustandStorage';
import IConnectionIdentity from 'app/models/models/identity';
import IDevice from 'app/models/models/device';
import IDeviceInfo from 'app/models/models/deviceInfo';
import inspectService from 'app/services/inspectService';

interface IAppConfigState {
  scanning: boolean;
  connected: boolean;
  requestAuth: boolean;
  identities: IConnectionIdentity[];
  devices: IDevice[];
  selectedDevice: IDevice | null;
  error: any | null;
  refreshRateInMs: number;
}

interface IAppConfigActions {
  setScanning: (scanning: boolean) => void;
  reset: () => void;
  upsertIdentity: (identity: IConnectionIdentity) => void;
  deleteIdentity: (id: string) => void;
  upsertDevice: (device: IDevice) => void;
  deleteDevice: (deviceId: string) => void;
  selectDevice: (device: IDevice) => void;
  updateDeviceInfo: (device: IDeviceInfo | null) => void;
  connect: (
    device: IDevice,
    skipStateUpdate: boolean,
    abortController: AbortController | null,
  ) => Promise<{ deviceInfo: IDeviceInfo | null; error: any | null }>;
  disconnect: () => void;
}

const initialState: IAppConfigState = {
  scanning: false,
  connected: false,
  identities: [],
  devices: [],
  selectedDevice: null,
  requestAuth: false,
  error: null,
  refreshRateInMs: 1000,
};

const useAppConfigStore = create<IAppConfigState & IAppConfigActions>()(
  devtools(
    persist(
      set => ({
        ...initialState,
        setScanning: (s: boolean) => set(_state => ({ scanning: s })),
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
        updateDeviceInfo: (d: IDeviceInfo | null) =>
          set(state => ({
            ...state,
            selectedDevice: state.selectedDevice ? { ...state.selectedDevice, deviceInfo: d } : null,
            error: null,
            requestAuth: false,
          })),
        connect: async (d: IDevice, skipStateUpdate: boolean, abortController: AbortController | null) => {
          try {
            let response = await inspectService({
              ipAddress: d.ip,
              port: d.port,
              path: d.path,
              username: d.identity ? d.identity.username : null,
              password: d.identity ? d.identity.password : null,
              abortController: abortController,
            });
            if (!skipStateUpdate) {
              set({
                selectedDevice: { ...d, deviceInfo: response },
                connected: true,
                requestAuth: false,
                error: null,
              });
            }

            return { deviceInfo: response, error: null };
          } catch (e: any) {
            if (!skipStateUpdate) {
              if (e && e.code === 401) {
                set({ requestAuth: true, connected: false, error: e });
              } else {
                set({ error: e, connected: false });
              }
            }

            return { deviceInfo: null, error: e };
          }
        },
        disconnect: () =>
          set(_state => ({
            error: null,
            selectedDevice: null,
            requestAuth: false,
            connected: false,
            deviceInfoLoading: false,
          })),
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
