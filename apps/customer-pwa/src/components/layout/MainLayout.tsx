import { Outlet } from 'react-router-dom';
import { TopNavBar } from './TopNavBar';
import { BottomNavBar } from './BottomNavBar';
import { Button } from '@repo/ui/components/ui/button';
import { Badge } from '@repo/ui/components/ui/badge';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart } from 'lucide-react';
import { CartSheet } from '@/components/cart/CartSheet';
import { useState } from 'react';

export const MainLayout: React.FC = () => {
  // Subscribe to cart items directly using the selector
  const totalItems = useCartStore(state => state.getTotalItems());
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Navigation - Fixed */}
      <TopNavBar />

      {/* Main Content - Scrollable with padding for fixed navbars */}
      <main className="flex-1 container overflow-y-auto mt-4 pb-24">
        <Outlet />
      </main>

      {/* Cart FAB - Fixed */}
      {totalItems > 0 && (
        <div className="fixed bottom-20 right-4 z-30">
          <Button
            size="icon"
            className="rounded-full shadow-lg h-14 w-14 relative bg-primary hover:bg-primary/90"
            onClick={() => setIsCartSheetOpen(true)}
          >
            <ShoppingCart className="h-6 w-6" />
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full flex items-center justify-center"
            >
              {totalItems}
            </Badge>
          </Button>
        </div>
      )}

      {/* Bottom Navigation - Fixed */}
      <BottomNavBar />

      {/* Cart Sheet */}
      <CartSheet open={isCartSheetOpen} onOpenChange={setIsCartSheetOpen} />
    </div>
  );
};
