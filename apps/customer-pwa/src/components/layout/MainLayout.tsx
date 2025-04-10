import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { TopNavBar } from './TopNavBar';
import { BottomNavBar } from './BottomNavBar';
import { Button } from '@repo/ui';
import { useAuth } from '@/providers/AuthProvider';
import { useInitializeAddressStore } from '@/store/addressStore';

export const MainLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const cartItemCount = 0; // TODO: Get actual cart count from state/context
  const isLoggedIn = !isLoading && !!user;

  // Initialize address store
  useInitializeAddressStore();

  return (
    <div className="flex min-h-screen flex-col">
      <TopNavBar />

      {/* Main content area - Outlet renders the matched child route component */}
      {/* Add padding-bottom to avoid overlap with BottomNavBar */}
      <main className="flex-grow container py-6 pb-24">
        {' '}
        {/* pb-24 approx height of bottom nav + fab padding */}
        <Outlet />
      </main>

      {/* Show FAB only if logged in and items > 0 */}
      {isLoggedIn && cartItemCount > 0 && (
        <div className="fixed bottom-20 right-4 z-20">
          <Link to="/cart">
            <Button size="lg" className="rounded-full shadow-lg">
              {/* TODO: Use Lucide Cart Icon */}
              🛒 <span className="ml-2">{cartItemCount}</span>
            </Button>
          </Link>
        </div>
      )}

      <BottomNavBar />
    </div>
  );
};
