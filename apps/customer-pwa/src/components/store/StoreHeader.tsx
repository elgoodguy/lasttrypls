import { StoreDetails } from '@repo/api-client';
import { Clock, Heart, Percent, Star, Truck } from 'lucide-react';
import { Badge } from '@repo/ui/components/ui/badge';
import { StoreStatusIndicator } from '@repo/ui/components/store/StoreStatusIndicator';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/providers/AuthProvider';
import { useState } from 'react';
import { AuthModal } from '@/components/auth/AuthModal';

interface StoreHeaderProps {
  store: StoreDetails & {
    cashback_rule?: {
      percentage: number;
      minimum_order_amount: number | null;
      maximum_cashback_amount: number | null;
    } | null;
  };
}

export function StoreHeader({ store }: StoreHeaderProps) {
  const { t } = useTranslation();
  const { isGuest } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  // TODO: Implement proper isOpen logic based on operating_hours
  const isOpen = store.is_active;

  const handleFavoriteClick = () => {
    if (isGuest) {
      setIsAuthModalOpen(true);
    } else {
      // TODO: Implement favorite toggle logic
    }
  };

  return (
    <div className="relative px-4 py-4 space-y-3">
      {/* Store Name and Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{store.name}</h1>
          <StoreStatusIndicator isActive={isOpen} />
        </div>
        <button 
          className="rounded-full p-2 hover:bg-muted"
          onClick={handleFavoriteClick}
        >
          <Heart className="h-6 w-6" />
        </button>
      </div>

      {/* Categories */}
      {store.categories && store.categories.length > 0 && (
        <p className="text-muted-foreground">{store.categories.map(cat => cat.name).join(', ')}</p>
      )}

      {/* Primary Info Row */}
      <div className="flex items-center gap-6 text-sm">
        {/* Delivery Time */}
        {store.estimated_delivery_time_minutes && (
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{store.estimated_delivery_time_minutes} {t('store.deliveryTime')}</span>
          </div>
        )}

        {/* Delivery Fee */}
        {store.delivery_fee !== null && (
          <div className="flex items-center gap-1">
            <Truck className="h-4 w-4" />
            <span>${store.delivery_fee.toFixed(2)}</span>
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span>4.5</span>
          <span className="text-muted-foreground">(150)</span>
        </div>
      </div>

      {/* Secondary Info Row */}
      <div className="flex items-center gap-4 text-sm">
        {/* Minimum Order */}
        {store.minimum_order_amount !== null && (
          <div className="text-muted-foreground">
            {t('store.minOrder')} ${store.minimum_order_amount.toFixed(2)}
          </div>
        )}

        {/* Cashback Badge */}
        {store.cashback_rule && store.cashback_rule.percentage > 0 && (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
          >
            <Percent className="mr-1 h-3 w-3" />
            {store.cashback_rule.percentage}% {t('store.cashback')}
          </Badge>
        )}
      </div>

      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
    </div>
  );
}
