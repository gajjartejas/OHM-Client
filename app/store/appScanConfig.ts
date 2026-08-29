import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import zustandStorage from 'app/store/zustandStorage';

interface IAppScanConfigState {
  path: string;
  port: number;
  ports: number[];
  scanTimeoutInMs: number;
  scanThreads: number;
}

interface IAppScanConfigActions {
  setPath: (path: string) => void;
  setPort: (port: number) => void;
  setPorts: (ports: number[]) => void;
  setScanTimeoutInMs: (scanTimeoutInMs: number) => void;
  setScanThreads: (scanThreads: number) => void;
  reset: () => void;
}

const initialState: IAppScanConfigState = {
  path: '/data.json',
  port: 8085,
  ports: [8085],
  scanTimeoutInMs: 1000,
  scanThreads: 150,
};

const useAppScanConfigStore = create<IAppScanConfigState & IAppScanConfigActions>()(
  devtools(
    persist(
      set => ({
        ...initialState,
        setPath: (p: string) => set(_state => ({ path: p })),
        setPort: (p: number) => set(_state => ({ port: p, ports: [p] })),
        setPorts: (ps: number[]) => set(_state => ({ ports: ps, port: ps[0] ?? 8085 })),
        setScanTimeoutInMs: (st: number) => set(_state => ({ scanTimeoutInMs: st })),
        setScanThreads: (st: number) => set(_state => ({ scanThreads: st })),
        reset: () => set(_state => ({ ...initialState })),
      }),
      {
        name: 'app-scan-config-storage',
        storage: createJSONStorage(() => zustandStorage),
        onRehydrateStorage: state => {
          console.log('useAppScanConfigStore->hydration starts', state);
        },
        version: 1,
      },
    ),
  ),
);

export default useAppScanConfigStore;
