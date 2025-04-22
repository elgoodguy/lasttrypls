import React, { lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { SupabaseProvider } from '@/providers/SupabaseProvider';
import { AuthProvider, useAuth } from '@/providers/AuthProvider';
import { MainLayout } from '@/components/layout/MainLayout';
import { GlobalLoader } from '@/components/common/GlobalLoader';
import { Toaster } from 'sonner';
import { useAddressStore } from '@/store/addressStore';
import { ForceAddressModal } from '@/components/auth/ForceAddressModal';
import { useSupabase } from '@/providers/SupabaseProvider';
import { getAddresses } from '@repo/api-client';
import { GUEST_ADDRESS_STORAGE_KEY } from '@/store/addressStore';

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

export default function App() {
  const { user, isGuest, isLoading: isLoadingAuth } = useAuth();
  const supabase = useSupabase();
  const { 
    setAddresses, 
    setActiveAddress, 
    setLoading: setIsLoadingAddress,
    setError: setAddressError,
    setIsInitialized,
    isInitialized,
    addresses,
    isLoading: isLoadingAddress,
    activeAddress
  } = useAddressStore();

  // Add new useEffect for address initialization
  useEffect(() => {
    const initializeAddresses = async () => {
      if (isInitialized || isLoadingAuth) {
        if (isInitialized && !isLoadingAuth) setIsLoadingAddress(false);
        return;
      }

      console.log('[App] Initializing addresses...', { isGuest });
      setIsLoadingAddress(true);
      setAddressError(null);

      try {
        if (isGuest) {
          const savedAddressJson = localStorage.getItem(GUEST_ADDRESS_STORAGE_KEY);
          if (savedAddressJson) {
            try {
              const savedAddress = JSON.parse(savedAddressJson);
              console.log('[App] Found guest address in localStorage:', savedAddress);
              setActiveAddress(savedAddress);
              setAddresses([savedAddress]);
            } catch (parseError) {
              console.error('[App] Error parsing guest address from localStorage:', parseError);
              localStorage.removeItem(GUEST_ADDRESS_STORAGE_KEY);
              setActiveAddress(null);
              setAddresses([]);
            }
          } else {
            console.log('[App] No guest address found in localStorage.');
            setActiveAddress(null);
            setAddresses([]);
          }
        } else {
          console.log('[App] Fetching addresses from API...');
          const apiAddresses = await getAddresses(supabase);
          console.log('[App] Fetched API addresses:', apiAddresses);
          setAddresses(apiAddresses);
          const primary = apiAddresses.find((addr) => addr.is_primary);
          if (primary) {
            console.log('[App] Setting primary address as active:', primary);
            setActiveAddress(primary);
          } else {
            console.log('[App] No primary address found, setting active to null.');
            setActiveAddress(null);
          }
        }
      } catch (error) {
        console.error('[App] Error during initialization:', error);
        setAddressError(error as Error);
        setAddresses([]);
        setActiveAddress(null);
      } finally {
        console.log('[App] Initialization finished.');
        setIsLoadingAddress(false);
        setIsInitialized(true);
      }
    };

    initializeAddresses();
  }, [isGuest, isLoadingAuth, isInitialized, supabase, setAddresses, setActiveAddress, setIsLoadingAddress, setAddressError, setIsInitialized]);

  // Show loader if either Auth is loading OR if Address is not initialized yet
  const showLoader = isLoadingAuth || (!isInitialized && !!user);

  // Show force address modal only for logged-in users with no addresses
  const requiresAddress = !!user && !isLoadingAuth && isInitialized && addresses.length === 0 && !isLoadingAddress;

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
