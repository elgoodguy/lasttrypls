import React, { lazy, useState, useEffect } from 'react';
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
import { useTranslation } from 'react-i18next';

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
  const { i18n } = useTranslation();
  const [isI18nReady, setIsI18nReady] = useState(i18n.isInitialized);

  // Initialize address store
  useInitializeAddressStore();

  // Monitor i18n initialization and add diagnostic logging
  useEffect(() => {
    console.group('[App] i18n Initialization Status');
    console.log('Initial State:', {
      isInitialized: i18n.isInitialized,
      language: i18n.language,
      isI18nReady,
      hasResourceBundle: i18n.hasResourceBundle(i18n.language, 'translation')
    });

    const handleInitialized = () => {
      console.log('[App] i18n initialized event fired');
      console.log('State at initialization:', {
        language: i18n.language,
        hasResourceBundle: i18n.hasResourceBundle(i18n.language, 'translation'),
        resourceKeys: Object.keys(i18n.getResourceBundle(i18n.language, 'translation') || {})
      });
      setIsI18nReady(true);
    };

    const handleLanguageChanged = (lng: string) => {
      console.log('[App] Language changed:', {
        newLanguage: lng,
        hasBundle: i18n.hasResourceBundle(lng, 'translation'),
        resourceKeys: Object.keys(i18n.getResourceBundle(lng, 'translation') || {})
      });
    };

    const handleLoaded = (loaded: Record<string, boolean>) => {
      console.log('[App] Resources loaded:', {
        loaded,
        currentLanguage: i18n.language,
        hasBundle: i18n.hasResourceBundle(i18n.language, 'translation'),
        resourceKeys: Object.keys(i18n.getResourceBundle(i18n.language, 'translation') || {})
      });
    };

    if (i18n.isInitialized) {
      console.log('[App] i18n was already initialized');
      setIsI18nReady(true);
    } else {
      console.log('[App] Waiting for i18n initialization...');
      i18n.on('initialized', handleInitialized);
    }

    // Add listeners for additional diagnostics
    i18n.on('languageChanged', handleLanguageChanged);
    i18n.on('loaded', handleLoaded);

    console.groupEnd();

    return () => {
      i18n.off('initialized', handleInitialized);
      i18n.off('languageChanged', handleLanguageChanged);
      i18n.off('loaded', handleLoaded);
      console.log('[App] Cleaned up i18n listeners');
    };
  }, [isI18nReady, i18n]);

  // Log state changes that affect rendering
  useEffect(() => {
    console.log('[App] Render State Update:', {
      isLoadingAuth,
      isLoadingAddr,
      isAddrInitialized,
      isI18nReady,
      hasUser: !!user,
      hasAddresses: addresses.length > 0,
      hasActiveAddress: !!activeAddress,
      showLoader: isLoadingAuth || (!isAddrInitialized && !!user) || !isI18nReady,
      requiresAddress: !!user && !isLoadingAuth && isAddrInitialized && addresses.length === 0 && !isLoadingAddr
    });
  }, [isLoadingAuth, isLoadingAddr, isAddrInitialized, isI18nReady, user, addresses.length, activeAddress]);

  // Show loader if either Auth is loading OR if Address is not initialized yet OR i18n is not ready
  const showLoader = isLoadingAuth || (!isAddrInitialized && !!user) || !isI18nReady;

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

            {/* Render router when not loading, address not required, and i18n is ready */}
            {!showLoader && !requiresAddress && isI18nReady && (
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
