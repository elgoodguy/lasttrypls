import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';

interface LanguageToggleProps {
  defaultLanguage?: string;
  supportedLanguages?: string[];
  className?: string;
}

export const LanguageToggle = ({
  defaultLanguage = 'es',
  supportedLanguages = ['es', 'en'],
  className = '',
}: LanguageToggleProps) => {
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState<string>(defaultLanguage);

  useEffect(() => {
    const initLanguage = () => {
      if (i18n.isInitialized) {
        const lang = i18n.language?.split('-')[0] || defaultLanguage;
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
  }, [i18n, defaultLanguage]);

  const toggleLanguage = () => {
    const currentIndex = supportedLanguages.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % supportedLanguages.length;
    const newLanguage = supportedLanguages[nextIndex];
    i18n.changeLanguage(newLanguage);
  };

  if (isLoading) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className={`h-8 w-8 border-muted ${className}`}
      onClick={toggleLanguage}
    >
      <span className="text-sm font-medium">{currentLanguage.toUpperCase()}</span>
    </Button>
  );
}; 