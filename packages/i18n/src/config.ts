import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { enTranslations } from './translations/en';
import { esTranslations } from './translations/es';
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
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: {
          translation: enTranslations
        },
        es: {
          translation: esTranslations
        }
      },
      fallbackLng: defaultLanguage,
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

  return i18n;
}; 