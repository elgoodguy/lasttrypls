import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BottomNavBar as UIBottomNavBar } from '@repo/ui/components/navigation/BottomNavBar';
import { useAuth } from '@/providers/AuthProvider';
import { useTranslation } from 'react-i18next';
import { HomeIcon, FavoritesIcon, OrdersIcon, WalletIcon } from '@/components/icons';
import { AuthModal } from '@/components/auth/AuthModal';

// Define navigation items with custom icons
export const BottomNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading, isGuest } = useAuth();
  const { t } = useTranslation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const navItems = [
    { path: '/home', label: t('navigation.home'), icon: HomeIcon, requiresAuth: false },
    { path: '/favorites', label: t('navigation.favorites'), icon: FavoritesIcon, requiresAuth: true },
    { path: '/orders', label: t('navigation.orders'), icon: OrdersIcon, requiresAuth: true },
    { path: '/wallet', label: t('navigation.wallet'), icon: WalletIcon, requiresAuth: true },
  ];

  const handleNavigate = (path: string, requiresAuth: boolean) => {
    if (requiresAuth && isGuest) {
      setIsAuthModalOpen(true);
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <UIBottomNavBar
        items={navItems}
        currentPath={location.pathname}
        isAuthenticated={!isGuest}
        onNavigate={(path) => {
          const item = navItems.find(item => item.path === path);
          handleNavigate(path, item?.requiresAuth || false);
        }}
      />
      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
    </>
  );
};
