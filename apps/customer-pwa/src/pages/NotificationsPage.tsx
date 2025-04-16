import React from 'react';
import { useTranslation } from 'react-i18next';

export const NotificationsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-semibold">{t('navigation.notifications')}</h1>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <p className="text-muted-foreground">
            {/* TODO: Implementar lista de notificaciones */}
            {t('notifications.empty')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage; 