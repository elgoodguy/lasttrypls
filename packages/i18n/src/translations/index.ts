import { enTranslations } from './en';
import { esTranslations } from './es';

// Debug imports
console.log('[i18n Debug] Importing translations:');
console.log('EN:', enTranslations);
console.log('ES:', esTranslations);

// Create and export the translations object
const translations = {
  en: enTranslations,
  es: esTranslations,
  'en-US': enTranslations,  // Add explicit mapping for en-US
  'es-ES': esTranslations,  // Add explicit mapping for es-ES
  'es-MX': esTranslations   // Add explicit mapping for es-MX
} as const;

// Debug exports
console.log('[i18n Debug] Exporting translations:', translations);

export { translations as default, translations, enTranslations, esTranslations }; 