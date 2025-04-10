import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar los JSON directamente - Vite maneja esto
// Asegúrate que las rutas sean correctas RELATIVAS a este archivo (i18n.ts)
import enTranslation from '../public/locales/en/translation.json';
import esTranslation from '../public/locales/es/translation.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  es: {
    translation: esTranslation,
  },
};

i18n
  .use(LanguageDetector) // Detecta idioma
  .use(initReactI18next) // Vincula con React
  .init({
    resources, // Tus traducciones importadas
    fallbackLng: 'en', // Idioma por defecto si el detectado no existe
    debug: import.meta.env.DEV, // Logs en consola durante desarrollo
    interpolation: {
      escapeValue: false, // React ya hace el escape
    },
    detection: {
      // Orden de detección: localStorage primero, luego navegador
      order: ['localStorage', 'navigator'],
      // Key para guardar en localStorage
      lookupLocalStorage: 'i18nextLng-customer-pwa', // Nombre específico para evitar colisiones
      // Cachés a usar
      caches: ['localStorage'],
    },
  });

export default i18n; 