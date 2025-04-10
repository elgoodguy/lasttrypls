import { initializeI18n } from '@repo/i18n';

const i18n = initializeI18n({
  appName: 'customer-pwa',
  debug: true,
  defaultLanguage: 'en',
  localStorageKey: 'i18nextLng'
});

// Para debug
i18n.on('initialized', () => {
  console.log('i18n initialized with resources:', i18n.options.resources);
});

i18n.on('languageChanged', (lng) => {
  console.log('Language changed to:', lng);
  console.log('Current translations:', i18n.getResourceBundle(lng, 'translation'));
});

export default i18n; 