import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

const FALLBACK_LANG = 'es';
const SUPPORTED_LANGS = ['es', 'en'];

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: import.meta.env.DEV 
        ? '/locales/{{lng}}/{{ns}}.json'
        : '/apps/customer-pwa/public/locales/{{lng}}/{{ns}}.json',
    },
    fallbackLng: FALLBACK_LANG,
    supportedLngs: SUPPORTED_LANGS,
    load: 'languageOnly', // Cargar solo el idioma sin región (es en lugar de es-ES)
    ns: ['translation'],
    defaultNS: 'translation',
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })
  .catch((error) => {
    console.error('Error loading translations:', error);
  });

// Eventos de debug solo en desarrollo
if (import.meta.env.DEV) {
  i18n.on('initialized', () => {
    console.log('i18n initialized:', {
      language: i18n.language,
      languages: i18n.languages,
      isInitialized: i18n.isInitialized,
    });
  });

  i18n.on('languageChanged', (lng) => {
    console.log('Language changed to:', lng);
  });

  i18n.on('loaded', (loaded) => {
    console.log('i18n loaded:', loaded);
  });

  i18n.on('failedLoading', (lng, ns, msg) => {
    console.error('i18n failed loading:', { lng, ns, msg });
  });
}

export default i18n; 