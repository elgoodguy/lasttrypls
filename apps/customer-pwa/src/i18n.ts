import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { translations } from '@repo/i18n';

// Initialize i18next
i18n
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
      en: { translation: translations.en },
      'en-US': { translation: translations.en },
      es: { translation: translations.es },
      'es-ES': { translation: translations.es },
      'es-MX': { translation: translations.es }
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
      useSuspense: true
    }
  }).then(() => {
    // Enhanced debug logs
    console.log('i18next Initialization Debug:');
    console.log('- Detected/Forced Language:', i18n.language);
    console.log('- Has Resource Bundle:', i18n.hasResourceBundle(i18n.language, 'translation'));
    console.log('- Test Translation (common.welcome):', i18n.t('common.welcome'));
    console.log('- Available Languages:', i18n.languages);
    console.log('- Available Namespaces:', i18n.options.ns);
    console.log('- Resources Loaded:', JSON.stringify(i18n.services.resourceStore.data, null, 2));

    // Test a few key translations to verify loading
    const testKeys = ['common.welcome', 'auth.login.title', 'cart.title'];
    console.log('Translation Test Results:');
    testKeys.forEach(key => {
      console.log(`- ${key}:`, i18n.t(key));
    });
  });

// Add error handling for missing translations in development
if (import.meta.env.DEV) {
  i18n.on('missingKey', (lngs: string | string[], namespace: string, key: string) => {
    console.warn(`Missing translation key: ${key} for language(s):`, lngs, 'in namespace:', namespace);
  });

  // Add additional debug listeners
  i18n.on('loaded', (loaded: Record<string, boolean>) => {
    console.log('i18next: Translations loaded:', loaded);
  });

  i18n.on('failedLoading', (lng: string, ns: string, msg: string) => {
    console.error('i18next: Failed loading translation:', { lng, ns, msg });
  });
}

export default i18n; 