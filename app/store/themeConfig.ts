import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { Appearance } from 'react-native';
import zustandStorage from 'app/store/zustandStorage';

export enum IAppearanceType {
  Light = 'light',
  Dark = 'dark',
  Auto = 'auto',
}

interface IThemeConfigState {
  isDark: boolean;
  appearance: IAppearanceType;
  setAppearance: (appearance: IAppearanceType) => void;
  setIsDarkMode: (isDark: boolean) => void;
  resetTheme: () => void;
  setPrimaryColor: (primary: string, onPrimary: string) => void;
  primary: string;
  onPrimary: string;
  secondaryContainer: string;
  onSecondary: string;
}
const colorScheme = Appearance.getColorScheme();

const useThemeConfigStore = create<IThemeConfigState>()(
  devtools(
    persist(
      set => ({
        isDark: colorScheme === 'dark',
        appearance: IAppearanceType.Auto,
        primary: '#6200EE',
        onPrimary: '#000000',
        secondaryContainer: '#6200EE',
        onSecondary: '#FFFFFF',
        setAppearance: a =>
          set(_state => ({
            isDark: a === IAppearanceType.Auto ? Appearance.getColorScheme() === 'dark' : a === 'dark',
            appearance: a,
          })),
        setIsDarkMode: a =>
          set(_state => ({
            isDark: a,
          })),
        resetTheme: () => set(_state => ({ isDark: colorScheme === 'dark', appearance: IAppearanceType.Auto })),
        setPrimaryColor: (p: string, o: string) => set(_state => ({ primary: p, onPrimary: o, secondaryContainer: p })),
      }),
      {
        name: 'app-theme-storage',
        storage: createJSONStorage(() => zustandStorage),
        onRehydrateStorage: state => {
          console.log('useAppConfigStore->hydration starts', state);
        },
        version: 1,
      },
    ),
  ),
);

export default useThemeConfigStore;
