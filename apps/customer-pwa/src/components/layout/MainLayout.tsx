import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { TopNavBar } from './TopNavBar';
import { BottomNavBar } from './BottomNavBar';
import { Button } from '@repo/ui/components/ui/button';
import { useAuth } from '@/providers/AuthProvider';
import { useInitializeAddressStore } from '@/store/addressStore';

export const MainLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const cartItemCount = 0; // TODO: Get actual cart count from state/context
  const isLoggedIn = !isLoading && !!user;

  // Initialize address store
  useInitializeAddressStore();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Navigation - Fixed */}
      <TopNavBar />

      {/* Main Content - Scrollable with padding for fixed navbars */}
      <main className="flex-1 container overflow-y-auto mt-14 pb-20 pt-6">
        <Outlet />
      </main>

      {/* Cart FAB - Fixed */}
      {isLoggedIn && cartItemCount > 0 && (
        <div className="fixed bottom-20 right-4 z-20">
          <Link to="/cart">
            <Button size="lg" className="rounded-full shadow-lg">
              🛒 <span className="ml-2">{cartItemCount}</span>
            </Button>
          </Link>
        </div>
      )}

      {/* Bottom Navigation - Fixed */}
      <BottomNavBar />
    </div>
  );
};
