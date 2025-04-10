import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BottomNavBar as UIBottomNavBar } from '@repo/ui/components/navigation/BottomNavBar';
import { useAuth } from '@/providers/AuthProvider';
import { Home, Search, Package, Wallet, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Define navigation items with Lucide icons
export const BottomNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();

  // Determine isLoggedIn based on auth state (consider loading state)
  const isLoggedIn = !isLoading && !!user;

  const navItems = [
    { path: '/', label: t('navigation.home'), icon: Home, requiresAuth: false },
    { path: '/favorites', label: t('navigation.favorites'), icon: Heart, requiresAuth: true },
    { path: '/orders', label: t('navigation.orders'), icon: Package, requiresAuth: true },
    { path: '/wallet', label: t('navigation.wallet'), icon: Wallet, requiresAuth: true },
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
