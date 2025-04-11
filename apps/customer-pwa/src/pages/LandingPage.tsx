import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { useAuth } from '@/providers/AuthProvider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/schemas/auth';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { AuthModal } from '@/components/auth/AuthModal';
import { AddressModal } from '@/components/profile/AddressModal';
import { useAddressStore } from '@/store/addressStore';
import { ThemeToggle } from '@repo/ui/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { BenefitsList } from '@/components/landing/BenefitsList';
import { useTheme } from '@/providers/ThemeProvider';
import { useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '@/providers/SupabaseProvider';
import { addAddress } from '@repo/api-client';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { activeAddress, addOrUpdateAddress } = useAddressStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = React.useState(false);
  const [isGuest, setIsGuest] = React.useState(false);
  const queryClient = useQueryClient();
  const supabase = useSupabase();

  const handleLoginSignup = () => {
    setIsGuest(false);
    setIsAuthModalOpen(true);
  };

  const handleContinueAsGuest = () => {
    setIsGuest(true);
    setIsAddressModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    // Si el usuario no tiene dirección, mostrar el modal de dirección
    if (!activeAddress) {
      setIsAddressModalOpen(true);
    } else {
      navigate('/home');
    }
  };

  const handleAddressSubmit = async (data: any) => {
    if (isGuest) {
      // Para usuarios guest, guardamos la dirección en el store sin enviarla al backend
      addOrUpdateAddress({
        ...data,
        id: 'guest-address',
        is_primary: true,
        user_id: 'guest',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      navigate('/home');
    } else {
      // Para usuarios registrados, guardamos la dirección en el backend
      try {
        const newAddress = await addAddress(supabase, { ...data, is_primary: true });
        addOrUpdateAddress(newAddress);
        queryClient.invalidateQueries({ queryKey: ['addresses'] });
        navigate('/home');
      } catch (error) {
        console.error('Error adding address:', error);
      }
    }
    setIsAddressModalOpen(false);
  };

  // Redirect to home if user is logged in and has address
  React.useEffect(() => {
    if (user && activeAddress) {
      navigate('/home');
    }
  }, [user, activeAddress, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with theme/language toggles */}
      <header className="fixed top-0 left-0 right-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-end gap-2">
          <LanguageToggle />
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container flex flex-col items-center justify-center px-4 py-20">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-2xl">
          <img 
            src="/src/components/common/Nico Logo.svg" 
            alt="Logo" 
            className="w-full h-auto text-primary"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <Button size="lg" onClick={handleLoginSignup}>
            {t('auth.login.button')} / {t('auth.signup.button')}
          </Button>
          <Button variant="outline" size="lg" onClick={handleContinueAsGuest}>
            {t('landing.continueAsGuest')}
          </Button>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 w-full max-w-md">
          <BenefitsList />
        </div>
      </main>

      {/* Modals */}
      <AuthModal 
        open={isAuthModalOpen} 
        onOpenChange={(open) => {
          setIsAuthModalOpen(open);
          if (!open && user && !activeAddress) {
            setIsAddressModalOpen(true);
          }
        }} 
      />
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => {}}
        onSubmit={handleAddressSubmit}
        isLoading={false}
        addressToEdit={null}
        isForceModal={true}
      />
    </div>
  );
}; 