import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@repo/ui';
import { Button } from '@repo/ui';
import { Card } from '@repo/ui';
import { Separator } from '@repo/ui';
import { Textarea } from '@repo/ui';
import { Avatar } from '@repo/ui';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CartSheet: React.FC<CartSheetProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const {
    items,
    getItemsByStore,
    getSubtotal,
    updateQuantity,
    removeItem,
  } = useCartStore();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    onOpenChange(false);
    navigate('/checkout');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full h-[100dvh] sm:w-[450px] p-0 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="p-6 border-b">
          <div className="flex items-center">
            <SheetTitle>Tu Carrito</SheetTitle>
          </div>
          <SheetDescription>
            Revisa tus productos antes de proceder al checkout
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Tu carrito está vacío</p>
              </div>
            ) : (
              Object.entries(getItemsByStore()).map(([storeId, storeItems]) => (
                <div key={storeId} className="space-y-4">
                  <h3 className="font-medium">Tienda ID: {storeId}</h3>
                  {storeItems.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <div className="h-full w-full bg-muted flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">Imagen</span>
                          </div>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{item.name}</h4>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          {item.selectedOptionsDescription && (
                            <p className="text-sm text-muted-foreground">
                              {item.selectedOptionsDescription}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="font-medium">
                              ${((item.basePrice + item.optionsPrice) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Separator />
                </div>
              ))
            )}

            <div className="space-y-4">
              <Textarea
                placeholder="Notas Generales del Pedido"
                className="resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-background">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Subtotal:</span>
              <span className="font-medium">${getSubtotal().toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <SheetClose asChild>
                <Button variant="outline">
                  Seguir Comprando
                </Button>
              </SheetClose>
              <Button
                onClick={handleCheckout}
                disabled={items.length === 0}
              >
                Proceder al Checkout
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}; 