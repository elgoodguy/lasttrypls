import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { translations } from './translations';
import { Language } from './types';

export interface I18nConfig {
  appName: string;
  debug?: boolean;
  defaultLanguage?: Language;
  localStorageKey?: string;
}

export const initializeI18n = ({
  appName,
  debug = false,
  defaultLanguage = 'en',
  localStorageKey = 'i18nextLng'
}: I18nConfig) => {
  // Debug translations object
  console.log('[i18n Debug] Raw translations:', translations);
  console.log('[i18n Debug] EN translations available:', !!translations.en);
  console.log('[i18n Debug] ES translations available:', !!translations.es);

  // Define resources explicitly
  const resources = {
    en: {
      translation: translations.en
    },
    'en-US': {
      translation: translations.en
    },
    es: {
      translation: translations.es
    }
  };

  // Debug resources
  console.log('[i18n Debug] Resources before init:', JSON.stringify(resources, null, 2));

  // Initialize i18next
  const instance = i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: {
        'en-US': ['en'],
        'es-ES': ['es'],
        'es-MX': ['es'],
        default: ['en']
      },
      supportedLngs: ['en', 'es', 'en-US', 'es-ES', 'es-MX'],
      nonExplicitSupportedLngs: true,
      load: 'languageOnly',
      debug,
      interpolation: {
        escapeValue: false
      },
      detection: {
        order: ['localStorage', 'navigator'],
        lookupLocalStorage: `${localStorageKey}-${appName}`,
        caches: ['localStorage']
      },
      react: {
        useSuspense: false
      }
    });

  // Debug initialization
  instance.then(() => {
    console.log('[i18n Debug] Initialization complete');
    console.log('[i18n Debug] Current language:', i18n.language);
    console.log('[i18n Debug] Available languages:', i18n.languages);
    console.log('[i18n Debug] Resources after init:', i18n.options.resources);
    console.log('[i18n Debug] EN bundle:', i18n.getResourceBundle('en', 'translation'));
    console.log('[i18n Debug] EN-US bundle:', i18n.getResourceBundle('en-US', 'translation'));
  });

  return i18n;
}; 