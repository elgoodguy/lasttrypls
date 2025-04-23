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
const StoreDetailPage = lazy(() => import('@/pages/StoreDetailPage'));
const CartPage = lazy(() => import('@/pages/CartPage').then(module => ({ default: module.CartPage })));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage').then(module => ({ default: module.NotificationsPage })));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage').then(module => ({ default: module.CheckoutPage })));

// Protected route wrapper
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
      retry: 1,
    },
  },
});

function App() {
  const { isLoading: isLoadingAuth, user } = useAuth();
  const {
    isLoading: isLoadingAddr,
    addresses,
    isInitialized: isAddrInitialized,
    activeAddress
  } = useAddressStore();
  const supabase = useSupabase();

  // Initialize address store
  useInitializeAddressStore();

  // Show loader if either Auth is loading OR if Address is not initialized yet
  const showLoader = isLoadingAuth || (!isAddrInitialized && !!user);

  // Show force address modal only for logged-in users with no addresses
  const requiresAddress = !!user && !isLoadingAuth && isAddrInitialized && addresses.length === 0 && !isLoadingAddr;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <SupabaseProvider supabase={supabase}>
          <AuthProvider>
            {/* Show loader while initializing */}
            {showLoader && <GlobalLoader />}

            {/* Show force address modal only if not loading and address is required */}
            {!showLoader && requiresAddress && <ForceAddressModal isOpen={true} />}

            {/* Render router when not loading and address not required */}
            {!showLoader && !requiresAddress && (
              <Router>
                <Routes>
                  {/* Landing Page Route: Render ONLY if no user AND no active address */}
                  <Route 
                    path="/" 
                    element={
                      !user && !activeAddress 
                        ? <LandingPage /> 
                        : <Navigate to="/home" replace />
                    } 
                  />
                  
                  {/* Checkout Route: Top-level route without MainLayout */}
                  <Route path="/checkout" element={<CheckoutPage />} />
                  
                  {/* Main App Layout Route: Render if user OR activeAddress exists */}
                  <Route 
                    path="/home/*"
                    element={
                      user || activeAddress 
                        ? <MainLayout /> 
                        : <Navigate to="/" replace />
                    }
                  >
                    {/* Public Routes */}
                    <Route index element={<HomePage />} />
                    <Route path="store/:storeId" element={<StoreDetailPage />} />
                    <Route path="cart" element={<CartPage />} />

                    {/* Protected Routes */}
                    <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path="favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
                    <Route path="orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                    <Route path="wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
                    <Route path="notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                  </Route>

                  {/* Catch-all Not Found Route */}
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
