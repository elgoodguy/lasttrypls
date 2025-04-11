import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { useAuth } from './providers/AuthProvider';
import { ForceAddressModal } from './components/auth/ForceAddressModal';
import { Toaster } from 'sonner';
import { useAddressStore, useInitializeAddressStore } from './store/addressStore';
import { useEffect } from 'react';

// --- Import Page Components ---
import HomePage from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import StoreDetailPage from './pages/StoreDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { OrdersPage } from './pages/OrdersPage';
import { WalletPage } from './pages/WalletPage';
import { CartPage } from './pages/CartPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { GlobalLoader } from '@/components/common/GlobalLoader';
import { LandingPage } from './pages/LandingPage';

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { addresses, error: addressError, isLoading: isLoadingAddresses } = useAddressStore();

  // Show force address modal if:
  // - User exists and is authenticated
  // - No error loading addresses
  // - No addresses exist
  // - Not on landing page
  // - Not still loading addresses
  const requiresAddress = !!user && !addressError && addresses.length === 0 && location.pathname !== '/' && !isLoadingAddresses;

  return (
    <>
      {requiresAddress && <ForceAddressModal isOpen={true} />}
      <div className={requiresAddress ? 'opacity-0 pointer-events-none' : 'opacity-100'}>
        {children}
      </div>
    </>
  );
};

function App() {
  const { isLoading: isLoadingSession, user } = useAuth();
  const {
    isLoading: isLoadingAddresses,
    addresses,
    activeAddress,
    error: addressError,
    isInitialized: isAddressStoreInitialized,
  } = useAddressStore();

  // Initialize address store only when there is a user
  useInitializeAddressStore();

  // Show loader if session is loading OR if there's a user but the address store hasn't finished its initial load yet
  const showLoader = isLoadingSession || (!!user && !isAddressStoreInitialized);

  // Debugging logs
  useEffect(() => {
    console.log('App State:', {
      isLoadingSession,
      hasUser: !!user,
      isLoadingAddresses,
      isAddressStoreInitialized,
      addressCount: addresses?.length || 0,
      hasActiveAddress: !!activeAddress,
      hasAddressError: !!addressError,
      showLoader,
    });
  }, [
    isLoadingSession,
    user,
    isLoadingAddresses,
    isAddressStoreInitialized,
    addresses,
    activeAddress,
    addressError,
    showLoader,
  ]);

  return (
    <>
      <Toaster richColors position="top-center" />
      {showLoader && <GlobalLoader />}

      <div className={showLoader ? 'opacity-0 pointer-events-none' : 'opacity-100'}>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<MainLayout />}>
              <Route index element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="store/:storeId" element={<ProtectedRoute><StoreDetailPage /></ProtectedRoute>} />
              <Route path="favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
              <Route path="orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
              <Route path="wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
              <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
