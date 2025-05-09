import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { translations } from '@repo/i18n';

// Simplified resources definition with only base languages
const resources = {
  en: {
    translation: translations.en
  },
  'en-US': {
    translation: translations.en
  },
  es: {
    translation: translations.es
  },
  'es-MX': {
    translation: translations.es
  },
  'es-ES': {
    translation: translations.es
  }
};

console.log('DEBUG: Translations object loaded into i18n.ts:', JSON.stringify(translations, null, 2));

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng-customer-pwa',
      caches: ['localStorage'],
    },
    ns: ['translation'],
    defaultNS: 'translation',
    react: {
      useSuspense: false
    }
  });

// Force a language change to ensure translations are properly loaded
// i18n.changeLanguage(i18n.language);

export default i18n; 