import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/components/ui/card';
import { Button } from '@repo/ui/components/ui/button';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { Label } from '@repo/ui/components/ui/label';
import { Separator } from '@repo/ui/components/ui/separator';
import { CreditCard, User, Gift, ArrowLeft } from 'lucide-react';
import { AddressSelectorSheet } from '@/components/profile/AddressSelectorSheet';
import { AddressModal } from '@/components/profile/AddressModal';
import type { AddressFormData } from '@/lib/validations/address';
import { useAddressStore } from '@/store/addressStore';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useMutation } from '@tanstack/react-query';
import { addAddress } from '@repo/api-client';
import { toast } from 'sonner';

export const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items = [], getSubtotal } = useCartStore();
  const { addresses, activeAddress, setActiveAddress } = useAddressStore();
  const [isAddressSelectorOpen, setIsAddressSelectorOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const supabase = useSupabase();
  const { addOrUpdateAddress } = useAddressStore();
  
  // Fixed delivery fee placeholder
  const deliveryFee = 62.00;
  const total = getSubtotal() + deliveryFee;

  const handleBack = () => {
    navigate(-1);
  };

  const addAddressMutation = useMutation({
    mutationFn: (data: AddressFormData) => addAddress(supabase, data),
    onSuccess: (newAddress) => {
      toast.success(t('address.addSuccess'));
      addOrUpdateAddress(newAddress);
      setActiveAddress(newAddress);
      setIsAddressModalOpen(false);
      setIsAddressSelectorOpen(false);
    },
    onError: (error) => {
      console.error('Error adding address:', error);
      toast.error(t('address.addError'));
    },
  });

  const handleAddressSelect = (addressId: string) => {
    const selectedAddress = addresses.find((address) => address.id === addressId);
    if (selectedAddress) {
      setActiveAddress(selectedAddress);
      setIsAddressSelectorOpen(false);
    }
  };

  const handleAddNewAddress = () => {
    setIsAddressSelectorOpen(false);
    setIsAddressModalOpen(true);
  };

  const handleAddressSubmit = (data: AddressFormData) => {
    addAddressMutation.mutate(data);
  };

  return (
    <div className="flex flex-col gap-6 pb-32">
      {/* Back Button */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="h-10 w-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {t('checkout.title')}
        </h1>
      </div>

      {/* Delivery Address Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{t('checkout.sections.deliveryAddress')}</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddressSelectorOpen(true)}
          >
            {t('common.buttons.change')}
          </Button>
        </div>
        <Card className="p-4">
          {activeAddress ? (
            <div className="space-y-1">
              <p className="font-medium">
                {activeAddress.street_address}
                {activeAddress.internal_number && ` #${activeAddress.internal_number}`}
              </p>
              <p className="text-sm text-muted-foreground">
                {[
                  activeAddress.neighborhood,
                  activeAddress.city,
                  activeAddress.postal_code
                ].filter(Boolean).join(', ')}
              </p>
              {activeAddress.delivery_instructions && (
                <p className="text-sm text-muted-foreground mt-2">
                  {activeAddress.delivery_instructions}
                </p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">
              {t('checkout.noDeliveryAddress')}
            </p>
          )}
        </Card>
      </section>

      {/* Address Selector Sheet */}
      <AddressSelectorSheet
        isOpen={isAddressSelectorOpen}
        onOpenChange={setIsAddressSelectorOpen}
        addresses={addresses}
        activeAddressId={activeAddress?.id}
        onSelectAddress={handleAddressSelect}
        onAddNew={handleAddNewAddress}
      />

      {/* Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSubmit={handleAddressSubmit}
        isLoading={addAddressMutation.isPending}
      />

      {/* Payment Method Section */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <CreditCard className="h-5 w-5" />
          <CardTitle className="text-lg">{t('checkout.sections.payment')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            {t('checkout.buttons.selectPayment')}
          </Button>
        </CardContent>
      </Card>

      {/* Contact Information Section */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <User className="h-5 w-5" />
          <CardTitle className="text-lg">{t('checkout.sections.contact')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            {t('checkout.buttons.addContact')}
          </Button>
        </CardContent>
      </Card>

      {/* Driver Tip Section */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Gift className="h-5 w-5" />
          <CardTitle className="text-lg">{t('checkout.sections.tip')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            {t('checkout.buttons.addTip')}
          </Button>
        </CardContent>
      </Card>

      {/* Order Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('checkout.sections.order')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4">
                <div className="flex gap-3">
                  <span className="font-medium">{item.quantity}x</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    {item.selectedOptionsDescription && (
                      <span className="text-sm text-muted-foreground">
                        {item.selectedOptionsDescription}
                      </span>
                    )}
                  </div>
                </div>
                <span className="font-medium">
                  ${((item.basePrice + item.optionsPrice) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-2">
              {t('checkout.noItems')}
            </p>
          )}

          <Separator className="my-4" />

          {/* Order Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">{t('checkout.labels.notes')}</Label>
            <Textarea
              id="notes"
              placeholder={t('checkout.placeholders.notes')}
              className="resize-none"
            />
          </div>

          <Separator className="my-4" />

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{t('checkout.labels.subtotal')}</span>
              <span>${getSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('checkout.labels.delivery')}</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold">
              <span>{t('checkout.labels.total')}</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Place Order Button */}
          <Button
            className="w-full mt-4"
            size="lg"
            disabled={!activeAddress || items.length === 0}
          >
            {t('checkout.buttons.placeOrder')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}; 