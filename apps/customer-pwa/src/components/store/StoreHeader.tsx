import { StoreDetails } from '@repo/api-client';
import { Badge } from '@repo/ui';
import { Clock, Heart, Star, Truck } from 'lucide-react';

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

        {/* Status and Rating */}
        <div className="mt-2 flex items-center gap-2">
          <Badge variant={isOpen ? "success" : "destructive"}>
            {isOpen ? "Abierto" : "Cerrado"}
          </Badge>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">4.5</span>
            <span className="text-sm text-muted-foreground">(150)</span>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="mt-4 flex flex-wrap gap-4">
          {store.estimated_delivery_time_minutes && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {store.estimated_delivery_time_minutes} min
              </span>
            </div>
          )}
          {store.delivery_fee !== null && (
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                ${store.delivery_fee.toFixed(2)}
              </span>
            </div>
          )}
          {store.minimum_order_amount !== null && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Pedido mínimo: ${store.minimum_order_amount.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 