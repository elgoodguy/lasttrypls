import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSupabase } from '@/providers/SupabaseProvider';
import { AddressModal } from '@/components/profile/AddressModal';
import { useAddressStore } from '@/store/addressStore';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import type { AddressFormData } from '@/lib/validations/address';
import { addApiAddress } from '@/store/addressStore';

interface ForceAddressModalProps {
  isOpen: boolean;
}

export const ForceAddressModal: React.FC<ForceAddressModalProps> = ({ isOpen }) => {
  const supabase = useSupabase();
  const { setActiveAddress } = useAddressStore();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutate: handleForceSubmit, isPending: isAddingAddress } = useMutation({
    mutationFn: (data: AddressFormData) => addApiAddress(supabase, { ...data, is_primary: true }),
    onSuccess: newAddress => {
      toast.success('¡Dirección agregada exitosamente!');
      setActiveAddress(newAddress);
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
    onError: error => {
      console.error('Error al agregar dirección:', error);
      toast.error(t('address.addError'));
    },
  });

  return (
    <AddressModal
      isOpen={isOpen}
      onClose={() => {}} // No podemos cerrar el modal forzado
      onSubmit={handleForceSubmit}
      isLoading={isAddingAddress}
      addressToEdit={null}
      isForceModal={true}
    />
  );
};
