import React, { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useTranslation } from 'react-i18next';
import { Button, GlobalLoader } from '@repo/ui';
import { AuthModal } from '@/components/auth/AuthModal';

export const NotificationsPage: React.FC = () => {
  const { isLoading, isGuest } = useAuth();
  const { t } = useTranslation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  if (isLoading) {
    return <GlobalLoader />;
  }

  if (isGuest) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 p-6">
        <h2 className="text-2xl font-semibold text-center">
          {t('notifications.loginRequired')}
        </h2>
        <p className="text-muted-foreground text-center">
          {t('notifications.loginMessage')}
        </p>
        <Button onClick={() => setIsAuthModalOpen(true)}>
          {t('auth.login')} / {t('auth.signup')}
        </Button>
        <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t('notifications.title')}</h1>
      <div className="space-y-4">
        {/* TODO: Implementar lista de notificaciones */}
        <p className="text-muted-foreground">{t('notifications.empty')}</p>
      </div>
    </div>
  );
};

export default NotificationsPage; 