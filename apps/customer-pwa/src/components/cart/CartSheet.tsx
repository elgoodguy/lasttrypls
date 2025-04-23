import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@repo/ui/components/ui/sheet';
import { Button } from '@repo/ui/components/ui/button';
import { Card } from '@repo/ui/components/ui/card';
import { Separator } from '@repo/ui/components/ui/separator';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { Avatar } from '@repo/ui/components/ui/avatar';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CartSheet: React.FC<CartSheetProps> = ({ open, onOpenChange }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const {
    items,
    getItemsByStore,
    getSubtotal,
    updateQuantity,
    removeItem,
  } = useCartStore();

  // Add diagnostic logging on mount and when language changes
  useEffect(() => {
    console.group('[CartSheet] i18n Status');
    console.log('Current Language:', i18n.language);
    console.log('Is Initialized:', i18n.isInitialized);
    console.log('Has Resource Bundle:', i18n.hasResourceBundle(i18n.language, 'translation'));
    
    // Log specific keys we're using
    const keysToTest = [
      'cart.title',
      'cart.description',
      'cart.empty',
      'cart.storeIdLabel',
      'cart.productImageAlt',
      'cart.notesPlaceholder',
      'cart.continueShopping',
      'cart.proceedToCheckout',
      'checkout.labels.subtotal'
    ];

    console.group('Translation Keys Status');
    keysToTest.forEach(key => {
      console.log(`[CartSheet] Check BEFORE t("${key}"): Lang=`, i18n.language, 'Initialized=', i18n.isInitialized);
      console.log(`[CartSheet] Check BEFORE t("${key}"): Exists=`, i18n.exists(key));
      console.log(`[CartSheet] Check BEFORE t("${key}"): GetResource=`, JSON.stringify(i18n.getResource(i18n.language, 'translation', key)));
      console.log(`[CartSheet] Check BEFORE t("${key}"): Full Bundle Exists?`, !!i18n.getResourceBundle(i18n.language, 'translation'));
    });
    console.groupEnd();

    // Log full resource bundle for current language
    console.group('Current Language Resource Bundle');
    console.log(JSON.stringify(i18n.getResourceBundle(i18n.language, 'translation'), null, 2));
    console.groupEnd();

    console.groupEnd();

    // Cleanup
    return () => {
      console.log('[CartSheet] Component unmounting');
    };
  }, [i18n]); // Re-run when i18n instance changes

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    onOpenChange(false);
    navigate('/checkout');
  };

  // Add pre-translation checks for each t() call
  const checkTranslation = (key: string) => {
    console.group(`[CartSheet] Translation Check for "${key}"`);
    console.log('Language:', i18n.language, 'Initialized:', i18n.isInitialized);
    console.log('Key Exists:', i18n.exists(key));
    console.log('Resource:', JSON.stringify(i18n.getResource(i18n.language, 'translation', key)));
    console.log('Bundle Exists:', !!i18n.getResourceBundle(i18n.language, 'translation'));
    console.groupEnd();
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
            {(() => { checkTranslation('cart.title'); return null; })()}
            <SheetTitle className="flex">
              {t('cart.title')}
            </SheetTitle>
          </div>
          {(() => { checkTranslation('cart.description'); return null; })()}
          <SheetDescription className="flex">
            {t('cart.description')}
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-8">
                {(() => { checkTranslation('cart.empty'); return null; })()}
                <p className="text-muted-foreground">{t('cart.empty')}</p>
              </div>
            ) : (
              Object.entries(getItemsByStore()).map(([storeId, storeItems]) => (
                <div key={storeId} className="space-y-4">
                  {(() => { checkTranslation('cart.storeIdLabel'); return null; })()}
                  <h3 className="font-medium">{t('cart.storeIdLabel')}: {storeId}</h3>
                  {storeItems.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <div className="h-full w-full bg-muted flex items-center justify-center">
                            {(() => { checkTranslation('cart.productImageAlt'); return null; })()}
                            <span className="text-xs text-muted-foreground">{t('cart.productImageAlt')}</span>
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
              {(() => { checkTranslation('cart.notesPlaceholder'); return null; })()}
              <Textarea
                placeholder={t('cart.notesPlaceholder')}
                className="resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-background">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              {(() => { checkTranslation('checkout.labels.subtotal'); return null; })()}
              <span className="font-medium">{t('checkout.labels.subtotal')}:</span>
              <span className="font-medium">${getSubtotal().toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(() => { checkTranslation('cart.continueShopping'); return null; })()}
              <SheetClose asChild>
                <Button variant="outline" className="flex">
                  {t('cart.continueShopping')}
                </Button>
              </SheetClose>
              {(() => { checkTranslation('cart.proceedToCheckout'); return null; })()}
              <Button
                onClick={handleCheckout}
                disabled={items.length === 0}
                className="flex"
              >
                {t('cart.proceedToCheckout')}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}; 