import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@repo/ui/components/ui/dialog";
import { AddressForm } from './AddressForm';
import { Address } from '@repo/api-client';
import { APIProvider } from '@vis.gl/react-google-maps';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any, addressId?: string) => void;
  isLoading: boolean;
  addressToEdit?: Address | null;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  addressToEdit,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error("Google Maps API Key is missing!");
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{addressToEdit ? 'Edit Address' : 'Add New Address'}</DialogTitle>
          <DialogDescription>
            {addressToEdit ? 'Update your delivery address details below.' : 'Enter your delivery address details below.'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {apiKey ? (
            <APIProvider apiKey={apiKey} libraries={['places']}>
              <AddressForm
                onSubmit={onSubmit}
                initialData={addressToEdit}
                isLoading={isLoading}
              />
            </APIProvider>
          ) : (
            <div className="text-red-500 text-center">
              Google Maps Autocomplete is unavailable. Please configure API Key.
              <AddressForm
                onSubmit={onSubmit}
                initialData={addressToEdit}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 