import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { MapPin, LogOut, UserIcon, PlusCircle, Star, Home } from 'lucide-react';
import { NotificationIcon } from '@/components/icons';
import { AuthModal } from '@/components/auth/AuthModal';
import { AddressModal } from '@/components/profile/AddressModal';
import { useAddressStore } from '@/store/addressStore';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@repo/ui/lib/utils';

export const TopNavBar: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { user, isLoading: isLoadingAuth, signOut } = useAuth();
  const {
    addresses,
    activeAddress,
    isLoading: isLoadingAddresses,
    setPrimaryAddress,
    addAddress,
  } = useAddressStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    queryClient.clear();
    navigate('/');
  };

  const handleSelectAddress = (_addressId: string) => {
    // Implementar lógica para seleccionar dirección
  };

  const handleOpenAddAddress = () => {
    setIsAddressModalOpen(true);
  };

  const handleModalSubmit = async (addressData: any) => {
    await addAddress(addressData);
    setIsAddressModalOpen(false);
  };

  const setPrimaryMut = async (addressId: string) => {
    await setPrimaryAddress(addressId);
  };

  const formatShortAddress = (address: any) => {
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

  const isLoggedIn = !isLoadingAuth && !!user;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          {/* Location Dropdown/Button */}
          <div className="flex-1 flex justify-start">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="px-2 sm:px-4 max-w-[200px] sm:max-w-none" 
                    disabled={isLoadingAddresses}
                  >
                    <MapPin className="h-4 w-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <span className="truncate text-sm">
                      {isLoadingAddresses ? t('common.loading') : formatShortAddress(activeAddress)}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64 bg-background border shadow-md">
                  <DropdownMenuLabel>{t('address.deliverTo')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isLoadingAddresses ? (
                    <DropdownMenuItem disabled>{t('address.loading')}</DropdownMenuItem>
                  ) : addresses.length === 0 ? (
                    <DropdownMenuItem disabled>{t('address.noneSaved')}</DropdownMenuItem>
                  ) : (
                    addresses.map(addr => (
                      <DropdownMenuItem
                        key={addr.id}
                        onClick={() => handleSelectAddress(addr.id)}
                        className={cn('cursor-pointer', {
                          'bg-accent': addr.id === activeAddress?.id,
                        })}
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
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <UserIcon className="mr-2 h-4 w-4" />
                      {t('address.manage')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => activeAddress && setPrimaryMut(activeAddress.id)}
                    disabled={!activeAddress || activeAddress.is_primary}
                    className="cursor-pointer"
                  >
                    <Star className="mr-2 h-4 w-4" />
                    {t('address.setPrimary')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {!user && !isLoadingAuth && (
              <Button
                variant="ghost"
                className="px-2 sm:px-4"
                onClick={() => setIsAuthModalOpen(true)}
              >
                <MapPin className="h-4 w-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="truncate text-sm">{t('navigation.setlocation')}</span>
              </Button>
            )}
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Notifications */}
            {user && (
              <Button variant="ghost" size="icon" className="h-12 w-12" asChild>
                <Link to="/notifications">
                  <NotificationIcon className="h-9 w-9" />
                </Link>
              </Button>
            )}

            {/* Auth Button/Dropdown */}
            {isLoadingAuth ? (
              <div className="h-12 w-12 animate-pulse rounded-full bg-muted"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-12 w-12 rounded-full">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={user.user_metadata?.avatar_url}
                        alt={user.user_metadata?.full_name || user.email}
                      />
                      <AvatarFallback>
                        {getInitials(user.user_metadata?.full_name || user.email)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-background border shadow-md"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <UserIcon className="mr-2 h-4 w-4" />
                      {t('navigation.profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">{t('navigation.orders')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wallet">{t('navigation.wallet')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
                    {t('profile.preferences')}
                  </DropdownMenuLabel>
                  <div className="flex items-center gap-1 px-2 py-1">
                    <ThemeToggle theme={theme} setTheme={setTheme} />
                    <LanguageToggle />
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('auth.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" onClick={() => setIsAuthModalOpen(true)}>
                {t('auth.login.button')} / {t('auth.signup.button')}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Render AuthModal */}
      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />

      {/* Render Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSubmit={handleModalSubmit}
        isLoading={false}
        addressToEdit={null}
      />
    </>
  );
};
