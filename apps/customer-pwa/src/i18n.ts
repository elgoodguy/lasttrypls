import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { translations } from '@repo/i18n';

// Log the imported translations object
console.log('Imported translations object:', JSON.stringify(translations, null, 2));

// Simplified resources definition with only base languages
const resources = {
  en: {
    translation: translations.en
  },
  es: {
    translation: translations.es
  }
};

// Log the resources being passed to i18n.init
console.log('Resources being passed to i18n.init:', JSON.stringify(resources, null, 2));

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: {
      'en-US': ['en'],
      'es-MX': ['es'],
      'default': ['en']
    },
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
  })
  .then(() => {
    console.log('i18next: initialized');
  });

// Force a language change to ensure translations are properly loaded
i18n.changeLanguage(i18n.language);

export default i18n; 