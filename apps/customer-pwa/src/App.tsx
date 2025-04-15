import React, { lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { SupabaseProvider } from '@/providers/SupabaseProvider';
import { AuthProvider, useAuth } from '@/providers/AuthProvider';
import { MainLayout } from '@/components/layout/MainLayout';
import { GlobalLoader } from '@/components/common/GlobalLoader';
import { Toaster } from 'sonner';
import { useAddressStore, useInitializeAddressStore } from './store/addressStore';
import { ForceAddressModal } from '@/components/auth/ForceAddressModal';
import { useSupabase } from '@/providers/SupabaseProvider';

// Lazy load pages
const LandingPage = lazy(() => import('@/pages/LandingPage').then(module => ({ default: module.LandingPage })));
const HomePage = lazy(() => import('@/pages/HomePage').then(module => ({ default: module.HomePage })));
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage').then(module => ({ default: module.FavoritesPage })));
const OrdersPage = lazy(() => import('@/pages/OrdersPage').then(module => ({ default: module.OrdersPage })));
const WalletPage = lazy(() => import('@/pages/WalletPage').then(module => ({ default: module.WalletPage })));
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then(module => ({ default: module.ProfilePage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })));

// Componente wrapper para rutas protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isGuest, isLoading } = useAuth();

  if (isLoading) {
    return <GlobalLoader />;
  }

  if (isGuest) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1, // Retry failed requests once
    },
  },
});

function App() {
  const { isLoading: isLoadingSession, user } = useAuth();
  const {
    isLoading: isLoadingAddresses,
    addresses,
    error: addressError,
    isInitialized: isAddressStoreInitialized,
    activeAddress
  } = useAddressStore();
  const supabase = useSupabase();

  // Initialize address store
  useInitializeAddressStore();

  // Calculate loading states
  const showLoader = isLoadingSession || (!!user && isLoadingAddresses && !isAddressStoreInitialized);
  const requiresAddress = !!user && isAddressStoreInitialized && !addressError && addresses.length === 0;
  const canShowApp = !showLoader && !requiresAddress;

  console.log('App: State update', {
    isLoadingSession,
    userId: user?.id,
    isLoadingAddresses,
    isAddressStoreInitialized,
    addressesCount: addresses.length,
    showLoader,
    requiresAddress,
    addressError: addressError?.message,
    hasActiveAddress: !!activeAddress
  });

  console.log(`[App Render] User: ${user?.id}, CanShowApp: ${canShowApp}, RequiresAddress: ${requiresAddress}, ActiveAddress: ${!!activeAddress}`);
  if (!isLoadingSession && (user || activeAddress) && !requiresAddress) {
    console.log('[App Render] Condition met: Should navigate to /home or stay there.');
  } else if (!isLoadingSession && !user && !activeAddress) {
    console.log('[App Render] Condition met: Should navigate to / or stay there.');
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <SupabaseProvider supabase={supabase}>
          <AuthProvider>
            {showLoader && <GlobalLoader />}
            <ForceAddressModal isOpen={requiresAddress} />
            {canShowApp && (
              <Router>
                <Routes>
                  <Route path="/" element={!user && !activeAddress ? <LandingPage /> : <Navigate to="/home" replace />} />
                  <Route path="/home" element={(user || activeAddress) ? <MainLayout /> : <Navigate to="/" replace />}>
                    <Route index element={<HomePage />} />
                    <Route path="favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
                    <Route path="orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                    <Route path="wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
                    <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                  </Route>
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Router>
            )}
            <Toaster />
            <ReactQueryDevtools initialIsOpen={false} />
          </AuthProvider>
        </SupabaseProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
