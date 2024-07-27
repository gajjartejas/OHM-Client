import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import zustandStorage from 'app/store/zustandStorage';
import * as RNLocalize from 'react-native-localize';
import { SUPPORTED_LANGUAGES } from 'app/locales';

interface IAppLangConfigState {
  selectedLanguageCode: string;
  selectedLanguageName: string;
}

interface IAppLangConfigActions {
  setSelectedLanguageCode: (code: string) => void;
}

const DEVICE_LANGUAGE_CODE = RNLocalize.getLocales()[0].languageCode;
const FOUND_LANGUAGE = SUPPORTED_LANGUAGES.filter(v => v.code === DEVICE_LANGUAGE_CODE);

const initialState: IAppLangConfigState = {
  selectedLanguageCode:
    FOUND_LANGUAGE && FOUND_LANGUAGE.length > 0 ? FOUND_LANGUAGE[0].code : SUPPORTED_LANGUAGES[0].code,
  selectedLanguageName:
    FOUND_LANGUAGE && FOUND_LANGUAGE.length > 0 ? FOUND_LANGUAGE[0].language : SUPPORTED_LANGUAGES[0].language,
};

const useAppLangConfigStore = create<IAppLangConfigState & IAppLangConfigActions>()(
  devtools(
    persist(
      set => ({
        ...initialState,
        setSelectedLanguageCode: (value: string) =>
          set(() => ({
            selectedLanguageCode: value,
            selectedLanguageName: SUPPORTED_LANGUAGES.filter(v => v.code === value)[0].language,
          })),
      }),
      {
        name: 'app-lang-config-storage',
        storage: createJSONStorage(() => zustandStorage),
        onRehydrateStorage: state => {
          console.log('useAppLangConfigStore->hydration starts', state);
        },
        version: 1,
      },
    ),
  ),
);

export default useAppLangConfigStore;
