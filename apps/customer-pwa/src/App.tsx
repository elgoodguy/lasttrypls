import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { useAuth } from './providers/AuthProvider';
import { ForceAddressModal } from './components/auth/ForceAddressModal';
import { Toaster } from 'sonner';
import { useAddressStore } from './store/addressStore';
import { useEffect } from 'react';

// --- Import Page Components ---
import HomePage from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';

// Placeholder components
const FavoritesPage = () => <div>Favorites Page Content</div>;
const OrdersPage = () => <div>Orders Page Content</div>;
const WalletPage = () => <div>Wallet Page Content</div>;
const CartPage = () => <div>Cart Page Content</div>;
const LoginPage = () => <div>Login Modal Trigger Area</div>;
const NotFoundPage = () => <div>404 - Page Not Found</div>;
const GlobalLoader = () => <div>Loading...</div>;

function App() {
  const { isLoading: isLoadingSession, user } = useAuth();
  const { 
    isLoading: isLoadingAddresses, 
    addresses, 
    activeAddress, 
    error: addressError 
  } = useAddressStore();

  // Show loader if session is loading OR (user exists AND addresses are loading)
  const showLoader = isLoadingSession || (!!user && isLoadingAddresses);

  // Show force address modal if:
  // - NOT loading (neither session nor addresses)
  // - User exists
  // - No error loading addresses
  // - No addresses exist
  const requiresAddress = !showLoader && !!user && !addressError && (!addresses || addresses.length === 0);

  // Debugging logs
  useEffect(() => {
    console.log({
      isLoadingSession,
      hasUser: !!user,
      isLoadingAddresses,
      addressCount: addresses?.length || 0,
      hasActiveAddress: !!activeAddress,
      hasAddressError: !!addressError,
      showLoader,
      requiresAddress
    });
  }, [isLoadingSession, user, isLoadingAddresses, addresses, activeAddress, addressError, showLoader, requiresAddress]);

  return (
    <>
       <Toaster richColors position="top-center" />
       {showLoader && <GlobalLoader />}
       {requiresAddress && <ForceAddressModal isOpen={true} />}

       <div className={showLoader || requiresAddress ? 'opacity-0 pointer-events-none' : 'opacity-100'}>
            <Router>
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="favorites" element={<FavoritesPage />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="wallet" element={<WalletPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="cart" element={<CartPage />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Router>
       </div>
    </>
  );
}

export default App;
