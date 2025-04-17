import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductWithModifiers, ProductModifierGroup, ProductModifier } from '@repo/api-client';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@repo/ui/components/ui/dialog';
import { Button } from '@repo/ui/components/ui/button';
import { Card } from '@repo/ui/components/ui/card';
import { Checkbox } from '@repo/ui/components/ui/checkbox';
import { Input } from '@repo/ui/components/ui/input';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { Label } from '@repo/ui/components/ui/label';
import { X, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductDetailModalProps {
  product?: ProductWithModifiers;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState('');

  if (!product) {
    return null;
  }

  // Get variant and extras groups
  const variantGroup = product.product_modifier_groups?.find((g: ProductModifierGroup) => g.selection_type === 'single');
  const extrasGroups = product.product_modifier_groups?.filter((g: ProductModifierGroup) => g.selection_type === 'multiple') || [];

  // Calculate total price
  const calculateTotalPrice = () => {
    let total = product.base_price;

    // Add variant price if selected
    if (selectedVariantId && variantGroup) {
      const selectedVariant = variantGroup.product_modifiers.find((m: ProductModifier) => m.id === selectedVariantId);
      if (selectedVariant) {
        total += selectedVariant.additional_price;
      }
    }

    // Add extras prices
    extrasGroups.forEach((group: ProductModifierGroup) => {
      group.product_modifiers.forEach((modifier: ProductModifier) => {
        if (selectedExtras.has(modifier.id)) {
          total += modifier.additional_price;
        }
      });
    });

    // Multiply by quantity
    return total * quantity;
  };

  const handleVariantSelect = (variantId: string) => {
    setSelectedVariantId(variantId);
  };

  const handleExtraToggle = (extraId: string) => {
    const newExtras = new Set(selectedExtras);
    if (newExtras.has(extraId)) {
      newExtras.delete(extraId);
    } else {
      newExtras.add(extraId);
    }
    setSelectedExtras(newExtras);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    // For now, just log the configuration
    console.log({
      productId: product.id,
      quantity,
      selectedVariantId: selectedVariantId || null,
      selectedExtraIds: Array.from(selectedExtras),
      itemNotes: notes,
      totalPrice: calculateTotalPrice(),
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="pr-8">{product.name}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* Product Image */}
        {product.image_urls?.[0] && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <img
              src={product.image_urls[0]}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        {/* Description */}
        {product.description && (
          <p className="text-sm text-muted-foreground">{product.description}</p>
        )}

        {/* Variants */}
        {variantGroup && (
          <div className="space-y-3">
            <Label>{variantGroup.name}</Label>
            <div className="grid grid-cols-2 gap-3">
              {variantGroup.product_modifiers.map((variant: ProductModifier) => (
                <Card
                  key={variant.id}
                  className={cn(
                    'p-4 cursor-pointer transition-colors',
                    selectedVariantId === variant.id
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-primary/50'
                  )}
                  onClick={() => handleVariantSelect(variant.id)}
                >
                  <div className="font-medium">{variant.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {variant.additional_price > 0
                      ? `+$${variant.additional_price.toFixed(2)}`
                      : t('common.included')}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Extras */}
        {extrasGroups.map((group: ProductModifierGroup) => (
          <div key={group.id} className="space-y-3">
            <Label>{group.name}</Label>
            <div className="space-y-2">
              {group.product_modifiers.map((extra: ProductModifier) => (
                <div key={extra.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={extra.id}
                    checked={selectedExtras.has(extra.id)}
                    onCheckedChange={() => handleExtraToggle(extra.id)}
                  />
                  <label
                    htmlFor={extra.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex justify-between items-center flex-1"
                  >
                    <span>{extra.name}</span>
                    {extra.additional_price > 0 && (
                      <span className="text-muted-foreground">
                        +${extra.additional_price.toFixed(2)}
                      </span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Quantity */}
        <div className="space-y-3">
          <Label>{t('product.quantity')}</Label>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 text-center"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-3">
          <Label>{t('product.notes')}</Label>
          <Textarea
            placeholder={t('product.notesPlaceholder')}
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button
            onClick={handleAddToCart}
            className="w-full"
            disabled={variantGroup?.is_required && !selectedVariantId}
          >
            {t('product.addToCart')} - ${calculateTotalPrice().toFixed(2)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 