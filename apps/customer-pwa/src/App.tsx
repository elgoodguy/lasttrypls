import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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
import { createClient } from '@supabase/supabase-js';

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

// Get Supabase URL and Key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided in .env');
}

// Create the Supabase client instance
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function App() {
  const { isLoading: isLoadingSession, user } = useAuth();
  const {
    isLoading: isLoadingAddresses,
    addresses,
    error: addressError,
    isInitialized: isAddressStoreInitialized,
  } = useAddressStore();

  // Initialize address store only when there is a user
  useInitializeAddressStore();

  // Calculate loading states
  const showLoader = isLoadingSession || (!!user && isLoadingAddresses);
  const requiresAddress = !showLoader && !!user && !addressError && addresses.length === 0 && isAddressStoreInitialized;

  console.log('App: State update', {
    isLoadingSession,
    userId: user?.id,
    isLoadingAddresses,
    isAddressStoreInitialized,
    addressesCount: addresses.length,
    showLoader,
    requiresAddress,
    addressError: addressError?.message
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <SupabaseProvider supabase={supabase}>
          <AuthProvider>
            {showLoader && <GlobalLoader />}
            <ForceAddressModal isOpen={requiresAddress} />
            <div className={showLoader ? 'opacity-0 pointer-events-none' : 'opacity-100'}>
              <Router>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route element={<MainLayout />}>
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
                    <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                    <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                  </Route>
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Router>
            </div>
            <Toaster />
            <ReactQueryDevtools initialIsOpen={false} />
          </AuthProvider>
        </SupabaseProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
