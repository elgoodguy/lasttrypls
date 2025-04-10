import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BottomNavBar as UIBottomNavBar } from '@repo/ui';
import { useAuth } from '@/providers/AuthProvider';
import { Home, Search, Package, User } from 'lucide-react';

// Define navigation items with Lucide icons
const navItems = [
  { path: '/', label: 'Home', icon: Home, requiresAuth: false },
  { path: '/search', label: 'Search', icon: Search, requiresAuth: false },
  { path: '/orders', label: 'Orders', icon: Package, requiresAuth: true },
  { path: '/profile', label: 'Profile', icon: User, requiresAuth: true },
];

export const BottomNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  // Determine isLoggedIn based on auth state (consider loading state)
  const isLoggedIn = !isLoading && !!user;

  return (
    <UIBottomNavBar
      items={navItems}
      currentPath={location.pathname}
      isAuthenticated={isLoggedIn}
      onNavigate={navigate}
    />
  );
}; 