import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { useAuth } from '@/providers/AuthProvider';
import {
  HomePage,
  FavoritesPage,
  OrdersPage,
  WalletPage,
  CartPage,
  LoginPage,
  NotFoundPage,
} from './pages';
import { ProfilePage } from './pages/ProfilePage';

function App() {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  return (
    <Router>
      <Routes>
        {/* Routes that use the MainLayout (with Top and Bottom Nav) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          
          {/* Protected Routes */}
          <Route
            path="favorites"
            element={isLoggedIn ? <FavoritesPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="orders"
            element={isLoggedIn ? <OrdersPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="wallet"
            element={isLoggedIn ? <WalletPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="profile"
            element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" replace />}
          />
          <Route path="cart" element={<CartPage />} />

          {/* Catch all route for MainLayout */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Routes without the MainLayout */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
