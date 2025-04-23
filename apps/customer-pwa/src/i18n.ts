import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { translations } from '@repo/i18n';

// Initialize i18next
const initI18n = async () => {
  try {
    // Extraer las traducciones directamente del objeto importado
    const { en: enTranslations, es: esTranslations } = translations;

    console.log('[i18n] Starting initialization with resources:', {
      en: Object.keys(enTranslations),
      es: Object.keys(esTranslations)
    });

    await i18n
      // First add the language detector
      .use(LanguageDetector)
      // Finally add React integration
      .use(initReactI18next)
      .init({
        // Keep fallback just in case
        fallbackLng: 'en',
        // Debug mode in development
        debug: import.meta.env.DEV,
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
        }
      });

    // Enhanced debug logs
    if (import.meta.env.DEV) {
      console.group('[i18n] Initialization Complete');
      console.log('- Detected Language:', i18n.language);
      console.log('- Fallback Languages:', i18n.options.fallbackLng);
      console.log('- Is Initialized:', i18n.isInitialized);
      console.log('- Has Resource Bundle:', {
        en: i18n.hasResourceBundle('en', 'translation'),
        es: i18n.hasResourceBundle('es', 'translation'),
        'en-US': i18n.hasResourceBundle('en-US', 'translation'),
        'es-ES': i18n.hasResourceBundle('es-ES', 'translation'),
      });

      // Log full resource store data
      console.group('Resource Store Data');
      console.log(JSON.stringify(i18n.services.resourceStore.data, null, 2));
      console.groupEnd();

      // Test critical translation keys
      const testKeys = [
        'common.welcome',
        'auth.login.title',
        'cart.title',
        'cart.description',
        'cart.empty',
        'checkout.title',
        'checkout.labels.subtotal'
      ];
      console.group('Critical Translation Keys Test');
      testKeys.forEach(key => {
        const enTrans = i18n.getResourceBundle('en', 'translation');
        const esTrans = i18n.getResourceBundle('es', 'translation');
        console.log(`Key: ${key}`);
        console.log(`- EN:`, enTrans ? i18n.t(key, { lng: 'en' }) : 'Bundle missing');
        console.log(`- ES:`, esTrans ? i18n.t(key, { lng: 'es' }) : 'Bundle missing');
      });
      console.groupEnd();

      // Add error handling for missing translations
      i18n.on('missingKey', (lngs: string | string[], namespace: string, key: string) => {
        console.warn('[i18n] Missing translation key:', {
          key,
          languages: lngs,
          namespace,
          availableResources: Object.keys(i18n.services.resourceStore.data)
        });
      });

      // Add additional debug listeners
      i18n.on('loaded', (loaded: Record<string, boolean>) => {
        console.log('[i18n] Resources loaded:', {
          loaded,
          currentLanguage: i18n.language,
          availableResources: Object.keys(i18n.services.resourceStore.data)
        });
      });

      i18n.on('failedLoading', (lng: string, ns: string, msg: string) => {
        console.error('[i18n] Failed loading translation:', { lng, ns, msg });
      });

      // Monitor language changes
      i18n.on('languageChanged', (lng: string) => {
        console.log('[i18n] Language changed:', {
          newLanguage: lng,
          hasBundle: i18n.hasResourceBundle(lng, 'translation'),
          resourceKeys: Object.keys(i18n.getResourceBundle(lng, 'translation') || {})
        });
      });

      console.groupEnd();
    }

    return i18n;
  } catch (error) {
    console.error('[i18n] Failed to initialize:', error);
    throw error;
  }
};

// Export a promise that resolves to the initialized i18n instance
export default await initI18n(); 