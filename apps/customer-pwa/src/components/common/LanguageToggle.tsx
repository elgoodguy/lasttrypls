import { useTranslation } from 'react-i18next';
import { Button } from '@repo/ui/components/ui/button';
import { useEffect, useState } from 'react';

export const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState<string>('es');

  useEffect(() => {
    const initLanguage = () => {
      if (i18n.isInitialized) {
        const lang = i18n.language?.split('-')[0] || 'es';
        setCurrentLanguage(lang);
        setIsLoading(false);
      }
    };

    initLanguage();
    i18n.on('initialized', initLanguage);
    i18n.on('languageChanged', (lang) => {
      setCurrentLanguage(lang.split('-')[0]);
    });

    return () => {
      i18n.off('initialized', initLanguage);
    };
  }, [i18n]);

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLanguage);
  };

  if (isLoading) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      className="w-8 px-0"
      onClick={toggleLanguage}
    >
      {currentLanguage.toUpperCase()}
    </Button>
  );
}; 