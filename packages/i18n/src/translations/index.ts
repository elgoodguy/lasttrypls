import { enTranslations } from './en';
import { esTranslations } from './es';

// Create and export the translations object
const translations = {
  en: enTranslations,
  es: esTranslations,
  'en-US': enTranslations,  // Add explicit mapping for en-US
  'es-ES': esTranslations,  // Add explicit mapping for es-ES
  'es-MX': esTranslations   // Add explicit mapping for es-MX
} as const;

export { translations as default, translations, enTranslations, esTranslations }; 