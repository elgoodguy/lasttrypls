import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { useAuth } from './providers/AuthProvider';
import { ForceAddressModal } from './components/auth/ForceAddressModal';
import { Toaster } from 'sonner';

// --- Import Page Components ---
import HomePage from './pages/HomePage';

// Placeholder components
const FavoritesPage = () => <div>Favorites Page Content</div>;
const OrdersPage = () => <div>Orders Page Content</div>;
const WalletPage = () => <div>Wallet Page Content</div>;
const ProfilePage = () => <div>Profile Page Content</div>;
const CartPage = () => <div>Cart Page Content</div>;
const LoginPage = () => <div>Login Modal Trigger Area</div>;
const NotFoundPage = () => <div>404 - Page Not Found</div>;
const GlobalLoader = () => <div>Loading...</div>;

function App() {
  const { isLoading, isLoadingAddressCheck, requiresAddress } = useAuth();
  const showLoader = isLoading || isLoadingAddressCheck;
  const showForceAddressModal = !showLoader && requiresAddress;

  return (
    <>
       <Toaster richColors position="top-center" />
       {showLoader && <GlobalLoader />}
       {showForceAddressModal && <ForceAddressModal isOpen={true} />}

       <div className={showLoader || showForceAddressModal ? 'opacity-0 pointer-events-none' : 'opacity-100'}>
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
