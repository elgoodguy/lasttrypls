import { ProfileForm } from '../components/profile/ProfileForm';
import { Button } from '@repo/ui/components/ui/button';
import { Separator } from '@repo/ui/components/ui/separator';
import { useAuth } from '@/providers/AuthProvider';
import { Toaster } from 'sonner';
import { AddressManager } from '../components/profile/AddressManager';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { AuthModal } from '@/components/auth/AuthModal';
import { GlobalLoader } from '@/components/common/GlobalLoader';

export const ProfilePage = () => {
  const { signOut, isLoading, isGuest } = useAuth();
  const { t } = useTranslation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  if (isLoading) {
    return <GlobalLoader />;
  }

  if (isGuest) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 p-6">
        <h2 className="text-2xl font-semibold text-center">
          {t('profile.loginRequired')}
        </h2>
        <p className="text-muted-foreground text-center">
          {t('profile.loginMessage')}
        </p>
        <Button onClick={() => setIsAuthModalOpen(true)}>
          {t('auth.login')} / {t('auth.signup')}
        </Button>
        <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Toaster richColors position="top-center" />
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t('profile.title')}</h2>
        <p className="text-muted-foreground">{t('profile.description')}</p>
      </div>
      <Separator />

      <ProfileForm />

      <Separator />

      <AddressManager />

      <Separator />

      <div>
        <h3 className="text-lg font-medium">{t('profile.security.title')}</h3>
        <p className="text-sm text-muted-foreground">{t('profile.security.description')}</p>
        <Button variant="outline" className="mt-2" disabled>
          {t('profile.security.changePassword')}
        </Button>
      </div>

      <Separator />

      <Button variant="destructive" onClick={signOut}>
        {t('auth.logout')}
      </Button>
    </div>
  );
};
