import { useTranslation } from 'react-i18next';
import { Button } from '@repo/ui';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => changeLanguage('en')}
        variant={i18n.language === 'en' ? 'default' : 'secondary'}
        size="sm"
      >
        EN
      </Button>
      <Button
        onClick={() => changeLanguage('es')}
        variant={i18n.language === 'es' ? 'default' : 'secondary'}
        size="sm"
      >
        ES
      </Button>
    </div>
  );
}; 