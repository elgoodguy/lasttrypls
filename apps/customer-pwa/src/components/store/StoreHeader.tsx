import { StoreDetails } from '@repo/api-client';
import { Heart, Star } from 'lucide-react';
import { StoreStatusIndicator } from './StoreStatusIndicator';

interface StoreHeaderProps {
  store: StoreDetails;
}

export function StoreHeader({ store }: StoreHeaderProps) {
  // TODO: Implement proper isOpen logic based on operating_hours
  const isOpen = store.is_active;

  return (
    <div className="relative px-4 py-4">
      {/* Store Info */}
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{store.name}</h1>
            {store.categories && store.categories.length > 0 && (
              <p className="text-muted-foreground">
                {store.categories.map(cat => cat.name).join(', ')}
              </p>
            )}
          </div>
          <button className="rounded-full p-2 hover:bg-muted">
            <Heart className="h-6 w-6" />
          </button>
        </div>

        {/* Status, Delivery Info and Rating in one row */}
        <div className="mt-4 flex items-center gap-6">
          <StoreStatusIndicator status={isOpen ? 'open' : 'closed'} />
          
          {store.estimated_delivery_time_minutes && (
            <span className="text-sm">
              {store.estimated_delivery_time_minutes} min
            </span>
          )}

          {store.delivery_fee !== null && (
            <span className="text-sm">
              ${store.delivery_fee.toFixed(2)}
            </span>
          )}

          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">4.5</span>
            <span className="text-sm text-muted-foreground">(150)</span>
          </div>
        </div>

        {/* Minimum Order in separate row */}
        {store.minimum_order_amount !== null && (
          <div className="mt-2">
            <span className="text-sm text-muted-foreground">
              Pedido mínimo: ${store.minimum_order_amount.toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
} 