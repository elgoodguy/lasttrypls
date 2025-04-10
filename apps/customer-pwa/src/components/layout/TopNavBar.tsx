import React, { useState } from 'react';
import { Button } from '@repo/ui/components/ui/button';
import { useAuth } from '@/providers/AuthProvider';
import { AuthModal } from '@/components/auth/AuthModal';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '@/providers/SupabaseProvider';
import { MapPin, LogOut, User as UserIcon, Bell, PlusCircle, Home, Star } from 'lucide-react';
import { AddressModal } from '@/components/profile/AddressModal';
import { toast } from 'sonner';
import { cn } from '@repo/ui/lib/utils';
import { useAddressStore } from '@/store/addressStore';
import {
  setPrimaryAddress,
  addAddress as apiAddAddress,
  AddressInsert,
  Address,
} from '@repo/api-client';

// Helper to format address concisely
const formatShortAddress = (address: Address | null | undefined): string => {
  if (!address) return 'Set Location';
  let display = address.street_address;
  return display.length > 30 ? display.substring(0, 27) + '...' : display;
};

export const TopNavBar: React.FC = () => {
  const supabase = useSupabase();
  const { user, signOut, isLoading: isLoadingAuth } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Get address state from Zustand Store
  const {
    addresses,
    activeAddress,
    isLoading: isLoadingAddresses,
    setActiveAddress,
    addOrUpdateAddress,
  } = useAddressStore();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Mutations
  const { mutate: setPrimaryMut, isPending: isSettingPrimary } = useMutation({
    mutationFn: (addressId: string) => setPrimaryAddress(supabase, addressId),
    onSuccess: updatedAddress => {
      toast.success('Primary address updated!');
      addOrUpdateAddress(updatedAddress);
      queryClient.invalidateQueries({ queryKey: ['addresses', user?.id] });
    },
    onError: error => toast.error('Failed to set primary address: ' + error.message),
  });

  const { mutate: addAddressMut, isPending: isAddingAddress } = useMutation({
    mutationFn: (newData: Omit<AddressInsert, 'user_id' | 'id' | 'created_at' | 'updated_at'>) =>
      apiAddAddress(supabase, newData),
    onSuccess: newAddress => {
      toast.success('Address added successfully!');
      addOrUpdateAddress(newAddress);
      setActiveAddress(newAddress);
      queryClient.invalidateQueries({ queryKey: ['addresses', user?.id] });
      setIsAddressModalOpen(false);
    },
    onError: error => toast.error('Failed to add address: ' + error.message),
  });

  // Event Handlers
  const handleSignOut = async () => {
    await signOut();
    queryClient.clear();
    navigate('/');
  };

  const handleOpenAddAddress = () => setIsAddressModalOpen(true);

  const handleModalSubmit = (data: any) => {
    const insertData: AddressInsert = { ...data, is_primary: !addresses || addresses.length === 0 };
    addAddressMut(insertData);
  };

  const handleSelectAddress = (addressId: string) => {
    const selected = addresses.find(a => a.id === addressId);
    if (selected) {
      setActiveAddress(selected);
      console.log('Active address set to:', selected);
      // Trigger data refresh based on active address
      queryClient.invalidateQueries({ queryKey: ['storesHome'] });
    }
  };

  const getInitials = (name: string | undefined | null) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          {/* Location Dropdown/Button */}
          <div className="flex-1 flex justify-start">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="px-2 sm:px-4" disabled={isLoadingAddresses}>
                    <MapPin className="h-4 w-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <span className="truncate text-sm">
                      {isLoadingAddresses ? 'Loading...' : formatShortAddress(activeAddress)}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64 bg-background border shadow-md">
                  <DropdownMenuLabel>Deliver to:</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isLoadingAddresses ? (
                    <DropdownMenuItem disabled>Loading addresses...</DropdownMenuItem>
                  ) : addresses.length === 0 ? (
                    <DropdownMenuItem disabled>No addresses saved yet.</DropdownMenuItem>
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
                    Add New Address
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <UserIcon className="mr-2 h-4 w-4" />
                      Manage Addresses
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => activeAddress && setPrimaryMut(activeAddress.id)}
                    disabled={!activeAddress || activeAddress.is_primary || isSettingPrimary}
                    className="cursor-pointer"
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Set Current as Primary
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
                <span className="truncate text-sm">Set Location</span>
              </Button>
            )}
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Notifications */}
            {user && (
              <Button variant="ghost" size="icon" asChild>
                <Link to="/notifications">
                  <Bell className="h-5 w-5" />
                </Link>
              </Button>
            )}

            {/* Auth Button/Dropdown */}
            {isLoadingAuth ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
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
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wallet">Wallet</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" onClick={() => setIsAuthModalOpen(true)}>
                Login / Sign Up
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
        isLoading={isAddingAddress}
        addressToEdit={null}
      />
    </>
  );
};
