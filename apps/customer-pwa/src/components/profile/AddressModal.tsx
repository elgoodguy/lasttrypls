import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@repo/ui';
import { AddressForm } from './AddressForm';
import { AddressFormData } from '@/lib/validations/address';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddressFormData) => void;
  isLoading?: boolean;
  addressToEdit?: Partial<AddressFormData> | null;
  isForceModal?: boolean;
}

export function AddressModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  addressToEdit = null,
  isForceModal = false
}: AddressModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {addressToEdit ? 'Editar dirección' : 'Agregar dirección'}
          </DialogTitle>
        </DialogHeader>
        <AddressForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          defaultValues={addressToEdit || undefined}
          isForceModal={isForceModal}
        />
      </DialogContent>
    </Dialog>
  );
} 