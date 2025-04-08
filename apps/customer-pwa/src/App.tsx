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
import { useState } from 'react';

function App() {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  const handleRequireAuth = (path: string) => {
    if (!isLoggedIn) {
      setRedirectPath(path);
      setShowAuthModal(true);
      return <Navigate to="/" replace />;
    }
    return null;
  };

  return (
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
  );
}

export default App;
