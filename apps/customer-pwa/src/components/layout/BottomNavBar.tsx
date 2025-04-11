import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BottomNavBar as UIBottomNavBar } from '@repo/ui/components/navigation/BottomNavBar';
import { useAuth } from '@/providers/AuthProvider';
import { useTranslation } from 'react-i18next';
import { HomeIcon, FavoritesIcon, OrdersIcon, WalletIcon } from '@/components/icons';

// Define navigation items with custom icons
export const BottomNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();

  // Determine isLoggedIn based on auth state (consider loading state)
  const isLoggedIn = !isLoading && !!user;

  const navItems = [
    { path: '/', label: t('navigation.home'), icon: HomeIcon, requiresAuth: false },
    { path: '/favorites', label: t('navigation.favorites'), icon: FavoritesIcon, requiresAuth: true },
    { path: '/orders', label: t('navigation.orders'), icon: OrdersIcon, requiresAuth: true },
    { path: '/wallet', label: t('navigation.wallet'), icon: WalletIcon, requiresAuth: true },
  ];

  return (
    <UIBottomNavBar
      items={navItems}
      currentPath={location.pathname}
      isAuthenticated={isLoggedIn}
      onNavigate={navigate}
    />
  );
};
