import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@repo/ui/components/ui/button';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language.split('-')[0];

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleLanguage}
      className="h-8 w-8 border-muted"
    >
      <span className="text-sm font-medium">
        {currentLanguage === 'en' ? 'ES' : 'EN'}
      </span>
    </Button>
  );
} 