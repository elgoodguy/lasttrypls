import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';

export const BenefitsList: React.FC = () => {
  const { t } = useTranslation();

  const benefits = [
    t('landing.benefits.saveAddresses'),
    t('landing.benefits.trackOrders'),
    t('landing.benefits.manageWallet'),
    t('landing.benefits.saveFavorites'),
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center">
        {t('landing.benefits.title')}
      </h3>
      <ul className="space-y-3">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <span className="text-muted-foreground">{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}; 