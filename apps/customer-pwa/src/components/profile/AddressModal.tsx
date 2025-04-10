import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@repo/ui/components/ui/dialog';
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
  isForceModal = false,
}: AddressModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{addressToEdit ? 'Editar dirección' : 'Agregar dirección'}</DialogTitle>
          <DialogDescription>
            {isForceModal
              ? 'Para continuar, necesitamos que agregues una dirección de entrega.'
              : 'Ingresa los detalles de tu dirección de entrega.'}
          </DialogDescription>
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
