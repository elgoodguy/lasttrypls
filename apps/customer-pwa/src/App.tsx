import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { useAuth } from '@/providers/AuthProvider';
import {
  HomePage,
  FavoritesPage,
  OrdersPage,
  WalletPage,
  CartPage,
  NotFoundPage,
} from './pages';
import { ProfilePage } from './pages/ProfilePage';
import { AuthModal } from './components/auth/AuthModal';
import { ForceAddressModal } from './components/auth/ForceAddressModal';
import { useState } from 'react';
import { Toaster } from 'sonner';

// Global Loading Component
const GlobalLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background/80 z-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
  </div>
);

function App() {
  const { user, isLoading, isLoadingAddressCheck, requiresAddress } = useAuth();
  const isLoggedIn = !!user;
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  // Determine if we show the main app or a loader/forced action
  const showLoader = isLoading || isLoadingAddressCheck;
  const showForceAddressModal = !showLoader && requiresAddress;

  const handleRequireAuth = (path: string) => {
    if (!isLoggedIn) {
      setRedirectPath(path);
      setShowAuthModal(true);
      return <Navigate to="/" replace />;
    }
    return null;
  };

  return (
    <>
      <Toaster richColors position="top-center" />
      
      {/* Show loader if session or address check is loading */}
      {showLoader && <GlobalLoader />}

      {/* Show force address modal if needed */}
      {showForceAddressModal && <ForceAddressModal isOpen={true} />}

      {/* Main app structure */}
      <div className={showLoader || showForceAddressModal ? 'opacity-0 pointer-events-none' : 'opacity-100'}>
        <Router>
          <Routes>
            {/* Routes that use the MainLayout (with Top and Bottom Nav) */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              
              {/* Protected Routes */}
              <Route
                path="favorites"
                element={handleRequireAuth('/favorites') || <FavoritesPage />}
              />
              <Route
                path="orders"
                element={handleRequireAuth('/orders') || <OrdersPage />}
              />
              <Route
                path="wallet"
                element={handleRequireAuth('/wallet') || <WalletPage />}
              />
              <Route
                path="profile"
                element={handleRequireAuth('/profile') || <ProfilePage />}
              />
              <Route path="cart" element={<CartPage />} />

              {/* Catch all route for MainLayout */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>

          {/* Auth Modal */}
          <AuthModal 
            open={showAuthModal} 
            onOpenChange={(open) => {
              setShowAuthModal(open);
              if (!open) setRedirectPath(null);
            }}
          />
        </Router>
      </div>
    </>
  );
}

export default App;
