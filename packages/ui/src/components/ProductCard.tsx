import React from 'react';
import { Product } from '@repo/api-client';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  storeId: string;
  onProductClick?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, storeId, onProductClick }) => {
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.base_price;

  const handleClick = () => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  return (
    <Card 
      className="h-full flex flex-col cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      {/* Product Image */}
      {product.image_urls && product.image_urls[0] && (
        <div className="relative aspect-video w-full overflow-hidden">
          <img
            src={product.image_urls[0]}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        </div>
      )}

      <CardContent className="flex-1 flex flex-col justify-between p-4">
        <div className="space-y-2">
          <h3 className="font-semibold tracking-tight">{product.name}</h3>
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
          )}
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-semibold">${product.base_price.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.compare_at_price?.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 