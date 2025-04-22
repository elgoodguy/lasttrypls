import React from 'react';
import { useTranslation } from 'react-i18next';
import { Address } from '@repo/api-client';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@repo/ui';
import { Button } from '@repo/ui';
import { Check, MapPin, PlusCircle } from 'lucide-react';
import { cn } from '@repo/ui';

interface AddressSelectorSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  addresses: Address[];
  activeAddressId: string | undefined;
  onSelectAddress: (addressId: string) => void;
  onAddNew: () => void;
}

export const AddressSelectorSheet: React.FC<AddressSelectorSheetProps> = ({
  isOpen,
  onOpenChange,
  addresses,
  activeAddressId,
  onSelectAddress,
  onAddNew,
}) => {
  const { t } = useTranslation();

  const formatAddress = (address: Address) => {
    const parts = [
      address.street_address,
      address.neighborhood,
      address.city,
      address.postal_code,
    ].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] sm:h-[85vh]">
        <SheetHeader className="border-b pb-4">
          <SheetTitle>{t('checkout.addressSelector.title', 'Selecciona una dirección')}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Add New Address Button */}
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={onAddNew}
          >
            <PlusCircle className="h-4 w-4" />
            {t('checkout.buttons.addNewAddress', 'Agregar nueva dirección')}
          </Button>

          {/* Address List */}
          <div className="space-y-2">
            {addresses.map((address) => (
              <button
                key={address.id}
                className={cn(
                  'w-full p-4 text-left rounded-lg border transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  address.id === activeAddressId && 'bg-accent'
                )}
                onClick={() => onSelectAddress(address.id)}
              >
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {address.is_primary && `${t('address.primary')} • `}
                        {formatAddress(address)}
                      </span>
                      {address.id === activeAddressId && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    {address.delivery_instructions && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {address.delivery_instructions}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}; 