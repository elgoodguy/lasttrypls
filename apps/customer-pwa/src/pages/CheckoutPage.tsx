import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/components/ui/card';
import { Button } from '@repo/ui/components/ui/button';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { Label } from '@repo/ui/components/ui/label';
import { Separator } from '@repo/ui/components/ui/separator';
import { CreditCard, User, Gift, ArrowLeft, Clock } from 'lucide-react';
import { AddressSelectorSheet } from '@/components/profile/AddressSelectorSheet';
import { AddressModal } from '@/components/profile/AddressModal';
import type { AddressFormData } from '@/lib/validations/address';
import { useAddressStore } from '@/store/addressStore';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useMutation } from '@tanstack/react-query';
import { addAddress } from '@repo/api-client';
import { toast } from 'sonner';
import { useAuth } from '@/providers/AuthProvider';
import { DeliveryTimeModal, DeliveryType } from '@/components/checkout/DeliveryTimeModal';

export const CheckoutPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items = [], getSubtotal } = useCartStore();
  const { addresses, activeAddress, setActiveAddress } = useAddressStore();
  const [isAddressSelectorOpen, setIsAddressSelectorOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isDeliveryTimeModalOpen, setIsDeliveryTimeModalOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('now');
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const supabase = useSupabase();
  const { addOrUpdateAddress } = useAddressStore();
  const { isGuest } = useAuth();
  
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
    if (isGuest) {
      // Para usuarios invitados, creamos una dirección con ID especial
      const guestAddress = {
        ...data,
        id: 'guest-address',
        is_primary: true,
        user_id: 'guest-user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      // Actualizamos el estado local y localStorage
      addOrUpdateAddress(guestAddress);
      setActiveAddress(guestAddress);
      setIsAddressModalOpen(false);
      toast.success(t('address.updateSuccess'));
    } else {
      // Para usuarios registrados, usamos la mutación existente
      addAddressMutation.mutate(data);
    }
  };

  const handleDeliveryTimeConfirm = (type: DeliveryType, date?: Date) => {
    setDeliveryType(type);
    setScheduledDate(date);
  };

  const getDeliveryTimeText = () => {
    if (deliveryType === 'now') {
      return '20-45 mins';
    }
    if (scheduledDate) {
      return new Intl.DateTimeFormat('es', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(scheduledDate);
    }
    return t('checkout.deliveryTime.selectTime');
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

      {/* Delivery Time Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{t('checkout.deliveryTime.title')}</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDeliveryTimeModalOpen(true)}
          >
            {t('checkout.deliveryTime.change')}
          </Button>
        </div>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">{getDeliveryTimeText()}</span>
          </div>
        </Card>
      </section>

      {/* Delivery Address Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{t('checkout.sections.deliveryAddress')}</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (isGuest) {
                setIsAddressModalOpen(true);
              } else {
                setIsAddressSelectorOpen(true);
              }
            }}
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
        addressToEdit={isGuest ? activeAddress : undefined}
      />

      {/* Delivery Time Modal */}
      <DeliveryTimeModal
        isOpen={isDeliveryTimeModalOpen}
        onOpenChange={setIsDeliveryTimeModalOpen}
        onConfirm={handleDeliveryTimeConfirm}
        initialType={deliveryType}
        initialDate={scheduledDate}
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
            <p className="text-muted-foreground text-center py-4">
              {t('checkout.emptyCart')}
            </p>
          )}

          <Separator className="my-4" />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{t('checkout.labels.subtotal')}</span>
              <span>${getSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('checkout.labels.deliveryFee')}</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between font-medium">
              <span>{t('checkout.labels.total')}</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Notes Section */}
      <section>
        <Label htmlFor="notes">{t('checkout.sections.note')}</Label>
        <Textarea
          id="notes"
          placeholder={t('checkout.placeholders.notes')}
          className="mt-2"
        />
      </section>

      {/* Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <Button
          className="w-full"
          size="lg"
          disabled={!activeAddress || items.length === 0}
        >
          {t('checkout.buttons.placeOrder')}
        </Button>
      </div>
    </div>
  );
}; 