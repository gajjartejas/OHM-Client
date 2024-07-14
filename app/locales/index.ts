import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import Config from 'app/config';

export const SUPPORTED_LANGUAGES = [
  { id: 0, selected: false, code: 'en', icon: Config.Images.icons.flag_en, translators: [], language: 'English' },
  {
    id: 1,
    selected: false,
    code: 'de',
    icon: Config.Images.icons.flag_de,
    translators: [],
    language: 'Deutsch(German)',
  },
  {
    id: 2,
    selected: false,
    code: 'es',
    icon: Config.Images.icons.flag_es,
    translators: [],
    language: 'Español(Spanish)',
  },
  {
    id: 3,
    selected: false,
    code: 'fr',
    icon: Config.Images.icons.flag_fr,
    translators: [],
    language: 'Français(French)',
  },
  {
    id: 4,
    selected: false,
    code: 'hi',
    icon: Config.Images.icons.flag_hi,
    translators: [],
    language: 'हिन्दी(Hindi)',
  },
  {
    id: 5,
    selected: false,
    code: 'pt',
    icon: Config.Images.icons.flag_pt_pt,
    translators: [],
    language: 'Português(Portuguese)',
  },
  {
    id: 6,
    selected: false,
    code: 'ru',
    icon: Config.Images.icons.flag_ru,
    translators: [],
    language: 'русский(Russian)',
  },
];

// tips: export each translation to a seperate file
const resources = {
  en: {
    translation: require('./en.json'),
  },
  de: {
    translation: require('./de.json'),
  },
  es: {
    translation: require('./es.json'),
  },
  fr: {
    translation: require('./fr.json'),
  },
  hi: {
    translation: require('./hi.json'),
  },
  pt: {
    translation: require('./pt.json'),
  },
  ru: {
    translation: require('./ru.json'),
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: RNLocalize.getLocales()[0].languageCode,
    fallbackLng: 'en',
    keySeparator: '.',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    compatibilityJSON: 'v3',
  });

export default i18n;
