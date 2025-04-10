import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@repo/ui/components/ui/dialog';
import { AddressForm } from './AddressForm';
import { AddressFormData } from '@/lib/validations/address';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {addressToEdit ? t('address.editTitle') : t('address.addTitle')}
          </DialogTitle>
          <DialogDescription>
            {isForceModal
              ? t('address.forceModalDescription')
              : t('address.modalDescription')}
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
