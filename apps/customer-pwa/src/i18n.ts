import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { translations } from '@repo/i18n';

// Initialize i18next
const initI18n = async () => {
  try {
    // Extraer las traducciones directamente del objeto importado
    const { en: enTranslations, es: esTranslations } = translations;

    // Verify translations are loaded correctly
    const verifyTranslations = (trans: any, lang: string) => {
      const criticalKeys = [
        'checkout.labels.subtotal',
        'checkout.buttons.selectPayment',
        'auth.signIn',
        'auth.signUp'
      ];
      
      const missingKeys = criticalKeys.filter(key => {
        const parts = key.split('.');
        let current = trans;
        for (const part of parts) {
          if (!current || !current[part]) return true;
          current = current[part];
        }
        return false;
      });

      if (missingKeys.length > 0) {
        console.warn(`[i18n] Missing critical keys in ${lang}:`, missingKeys);
      }
    };

    // Verify translations before initialization
    verifyTranslations(enTranslations, 'en');
    verifyTranslations(esTranslations, 'es');

    await i18n
      // First add the language detector
      .use(LanguageDetector)
      // Finally add React integration
      .use(initReactI18next)
      .init({
        // Keep fallback just in case
        fallbackLng: 'en',
        // Debug mode disabled
        debug: false,
        // Resources configuration with direct translations
        resources: {
          en: { translation: enTranslations },
          'en-US': { translation: enTranslations },
          es: { translation: esTranslations },
          'es-ES': { translation: esTranslations },
          'es-MX': { translation: esTranslations }
        },
        // Basic configuration
        interpolation: {
          escapeValue: false,
        },
        // Namespace configuration
        ns: ['translation'],
        defaultNS: 'translation',
        // React configuration
        react: {
          useSuspense: false,
          bindI18n: 'languageChanged loaded',
          bindI18nStore: 'added removed',
          transEmptyNodeValue: '',
        },
        // Add returnNull: false to prevent returning null for missing keys
        returnNull: false,
        // Add returnEmptyString: false to prevent returning empty string for missing keys
        returnEmptyString: false,
        // Add saveMissing: true in development to help identify missing keys
        saveMissing: import.meta.env.DEV,
        // Add missing key handler in development
        missingKeyHandler: import.meta.env.DEV ? (lng, ns, key) => {
          console.warn(`[i18n] Missing key: ${key} in ${lng}:${ns}`);
        } : undefined
      });

    // Empty DEV block - removed all debug logs and listeners
    if (import.meta.env.DEV) {
      // Development-only code removed
    }

    // Verify initialization was successful
    if (!i18n.isInitialized) {
      throw new Error('i18n failed to initialize properly');
    }

    // Verify all required bundles are loaded
    const requiredBundles = ['en', 'es', 'en-US', 'es-ES', 'es-MX'];
    const missingBundles = requiredBundles.filter(
      lng => !i18n.hasResourceBundle(lng, 'translation')
    );

    if (missingBundles.length > 0) {
      throw new Error(`Missing resource bundles for: ${missingBundles.join(', ')}`);
    }

    return i18n;
  } catch (error) {
    console.error('[i18n] Failed to initialize:', error);
    throw error;
  }
};

// Export the initialization function instead of the awaited instance
export { initI18n as default };
// Also export the named function for flexibility
export { initI18n }; 