import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog";
import { AddressForm } from './AddressForm';
import { Address } from '@repo/api-client';

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
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{addressToEdit ? 'Edit Address' : 'Add New Address'}</DialogTitle>
          <DialogDescription>
            {addressToEdit ? 'Update your delivery address details.' : 'Enter the details for your new delivery address.'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <AddressForm
            onSubmit={onSubmit}
            initialData={addressToEdit}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}; 