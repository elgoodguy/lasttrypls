import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from '@repo/ui/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { useTheme } from '@/providers/ThemeProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
import { Button } from '@repo/ui/components/ui/button';
import { LogOut, UserIcon, PlusCircle, Star, Home, MapPin, Package, Wallet } from 'lucide-react';
import { LocationIcon, NotificationsIcon } from '@/components/icons';
import { AuthModal } from '@/components/auth/AuthModal';
import { AddressModal } from '@/components/profile/AddressModal';
import { useAddressStore, GUEST_ADDRESS_STORAGE_KEY } from '@/store/addressStore';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@repo/ui/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { addAddress, Address } from '@repo/api-client';
import { useSupabase } from '@/providers/SupabaseProvider';
import { toast } from 'sonner';
import { AddressFormData } from '@/lib/validations/address';

export const TopNavBar: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: isLoadingAuth, isGuest, signOut } = useAuth();
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { addresses, activeAddress, isLoading: isLoadingAddresses, addOrUpdateAddress, setActiveAddress } = useAddressStore();
  const queryClient = useQueryClient();
  const supabase = useSupabase();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const { mutate: addAddressMut, isPending: isAddingAddress } = useMutation({
    mutationFn: (newData: AddressFormData) => addAddress(supabase, { ...newData, is_primary: true }),
    onSuccess: (newAddress) => {
      toast.success(t('address.addSuccess'));
      addOrUpdateAddress(newAddress);
      setActiveAddress(newAddress);
      console.log('[TopNavBar] Address added and set as active:', newAddress);
      setIsAddressModalOpen(false);
    },
    onError: (error) => {
      console.error('Error adding address:', error);
      toast.error(t('address.addError'));
    },
  });

  const handleSignOut = async () => {
    await signOut();
    queryClient.clear();
    navigate('/');
  };

  const handleAddressSelect = (addressId: string) => {
    const selectedAddress = addresses.find(addr => addr.id === addressId);
    if (!selectedAddress) {
      console.warn('[TopNavBar] Selected address not found:', addressId);
      return;
    }

    // Update active address in store
    setActiveAddress(selectedAddress);
    
    // If this is a guest address, update localStorage
    if (selectedAddress.id === 'guest-address') {
      localStorage.setItem(GUEST_ADDRESS_STORAGE_KEY, JSON.stringify(selectedAddress));
    }

    // Show success message
    toast.success(t('address.selectSuccess'));
    
    // Invalidate queries that depend on the address
    queryClient.invalidateQueries({ queryKey: ['restaurants'] });
    queryClient.invalidateQueries({ queryKey: ['menu'] });
  };

  const handleOpenAddAddress = () => {
    setIsAddressModalOpen(true);
  };

  const handleModalSubmit = async (data: AddressFormData) => {
    console.log('[TopNavBar] Submitting new address:', data);
    
    if (isGuest) {
      const guestAddress: Address = {
        ...data,
        id: 'guest-address',
        is_primary: true,
        user_id: 'guest-user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Update the store
      addOrUpdateAddress(guestAddress);
      setActiveAddress(guestAddress);
      
      // Save to localStorage
      localStorage.setItem(GUEST_ADDRESS_STORAGE_KEY, JSON.stringify(guestAddress));
      
      // Close modal and show success
      toast.success(t('address.addSuccess'));
      setIsAddressModalOpen(false);
      return;
    }
    
    // For registered users, use the mutation
    addAddressMut(data);
  };

  const handleSetPrimary = async () => {
    // Implementar la lógica para establecer la dirección principal
  };

  const formatShortAddress = (address: Address | null) => {
    if (!address) return t('navigation.setlocation');
    
    // Extraer solo la calle y número
    const streetParts = address.street_address.split(',')[0].trim();
    
    // Limitar la longitud y mantener el formato original (no todo mayúsculas)
    const maxLength = 25;
    if (streetParts.length > maxLength) {
      return `${streetParts.substring(0, maxLength)}...`;
    }
    
    return streetParts;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Location Dropdown/Button */}
        <div className="flex-1 flex justify-start">
          {!isLoadingAuth && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="px-2 sm:px-3 max-w-[200px] sm:max-w-none h-10" 
                  disabled={isLoadingAddresses}
                >
                  <LocationIcon className="h-6 w-6 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="truncate text-sm">
                    {isLoadingAddresses ? t('common.loading') : formatShortAddress(activeAddress)}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel>{t('address.deliverTo')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isLoadingAddresses ? (
                  <DropdownMenuItem disabled>{t('common.loading')}</DropdownMenuItem>
                ) : addresses.length === 0 ? (
                  <DropdownMenuItem disabled>{t('address.noAddresses')}</DropdownMenuItem>
                ) : (
                  addresses.map(addr => (
                    <DropdownMenuItem
                      key={addr.id}
                      onClick={() => handleAddressSelect(addr.id)}
                      className={cn('cursor-pointer', { 'bg-accent': addr.id === activeAddress?.id })}
                    >
                      {addr.is_primary && <Home className="mr-2 h-4 w-4" />}
                      <span className="truncate">{formatShortAddress(addr)}</span>
                    </DropdownMenuItem>
                  ))
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleOpenAddAddress} className="cursor-pointer">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('address.addNew')}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => isGuest ? setIsAuthModalOpen(true) : navigate('profile')} 
                  className="cursor-pointer"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {t('address.manage')}
                </DropdownMenuItem>
                {activeAddress && !activeAddress.is_primary && (
                  <DropdownMenuItem
                    onClick={() => isGuest ? setIsAuthModalOpen(true) : handleSetPrimary()}
                    className="cursor-pointer"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    {t('address.setPrimary')}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* User Avatar Dropdown */}
        <div className="flex items-center gap-4">
          {!isLoadingAuth && !isGuest && (
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={() => navigate('/home/notifications')}
            >
              <NotificationsIcon className="h-6 w-6" />
            </Button>
          )}
          {!isLoadingAuth && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-12 w-12 rounded-full">
                  <Avatar className="h-12 w-12">
                    {!isGuest && user && (
                      <AvatarImage
                        src={user.user_metadata?.avatar_url}
                        alt={user.user_metadata?.full_name || user.email}
                      />
                    )}
                    <AvatarFallback>
                      {isGuest ? 'U' : getInitials(user?.user_metadata?.full_name || user?.email || '')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {isGuest ? t('navigation.guest') : user?.user_metadata?.full_name || user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {!isGuest && (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/home/profile')}>
                      <UserIcon className="mr-2 h-4 w-4" />
                      {t('navigation.profile')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/home/favorites')}>
                      <Star className="mr-2 h-4 w-4" />
                      {t('navigation.favorites')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/home/orders')}>
                      <Package className="mr-2 h-4 w-4" />
                      {t('navigation.orders')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/home/wallet')}>
                      <Wallet className="mr-2 h-4 w-4" />
                      {t('navigation.wallet')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <div className="flex items-center justify-between px-2 py-1.5">
                  <ThemeToggle theme={theme} setTheme={setTheme} />
                  <LanguageToggle />
                </div>
                {!isGuest && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      {t('auth.logout')}
                    </DropdownMenuItem>
                  </>
                )}
                {isGuest && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsAuthModalOpen(true)}>
                      <UserIcon className="mr-2 h-4 w-4" />
                      {`${t('auth.login.button')} / ${t('auth.signup.button')}`}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSubmit={handleModalSubmit}
        isLoading={isAddingAddress}
        addressToEdit={null}
      />
    </header>
  );
};
