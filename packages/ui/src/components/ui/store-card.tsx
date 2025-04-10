import * as React from 'react';
import { cn } from '../../lib/utils';
import { Card, CardContent, CardHeader } from './card';
import { Badge } from './badge';
import { Clock, Truck, ShoppingCart, Percent } from 'lucide-react';
import { StoreStatusIndicator } from '../store/StoreStatusIndicator';

// Define the data structure the card expects
export interface StoreCardData {
  id: string;
  name: string;
  logo_url: string | null;
  estimated_delivery_time_minutes: number | null;
  delivery_fee: number | null;
  minimum_order_amount?: number | null;
  cashback_rules?: Array<{
    percentage: number;
    minimum_order_amount: number | null;
    maximum_cashback_amount: number | null;
  }> | null;
  is_active: boolean;
}

export interface StoreCardProps extends React.HTMLAttributes<HTMLDivElement> {
  store: StoreCardData;
}

const StoreCard = React.forwardRef<HTMLDivElement, StoreCardProps>(
  ({ className, store, ...props }, ref) => {
    // Format delivery fee nicely
    const formatFee = (fee: number | null) => {
      if (fee === null || fee === undefined) return 'N/A';
      if (fee === 0) return 'Free';
      return `$${fee.toFixed(2)}`;
    };

    return (
      <Card
        ref={ref}
        className={cn(
          'w-[280px] overflow-hidden cursor-pointer hover:shadow-md transition-shadow',
          className
        )}
        {...props}
      >
        {/* Store Logo/Image */}
        <div className="h-32 bg-muted flex items-center justify-center">
          {store.logo_url ? (
            <img
              src={store.logo_url}
              alt={`${store.name} logo`}
              className="h-full w-full object-contain p-2"
            />
          ) : (
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
          )}
        </div>

        <CardHeader className="p-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold tracking-tight text-lg truncate">{store.name}</h3>
            <StoreStatusIndicator isActive={store.is_active} />
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0 space-y-2">
          {/* Delivery Info Row */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              <span>
                {store.estimated_delivery_time_minutes
                  ? `${store.estimated_delivery_time_minutes} min`
                  : 'N/A'}
              </span>
            </div>
            <div className="flex items-center">
              <Truck className="mr-1 h-4 w-4" />
              <span>{formatFee(store.delivery_fee)}</span>
            </div>
          </div>

          {/* Minimum Order / Cashback Row */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {store.minimum_order_amount
                ? `Min. $${store.minimum_order_amount.toFixed(2)}`
                : 'No minimum'}
            </span>
            {/* Display Cashback Badge if applicable */}
            {store.cashback_rules && store.cashback_rules.length > 0 && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
              >
                <Percent className="mr-1 h-3 w-3" />
                {Math.max(...store.cashback_rules.map(rule => rule.percentage))}% Cashback
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);
StoreCard.displayName = 'StoreCard';

export { StoreCard };
