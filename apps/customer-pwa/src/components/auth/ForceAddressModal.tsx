import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { addAddress } from '@repo/api-client';
import { toast } from 'sonner';
import { useSupabase } from '@/providers/SupabaseProvider';
import { AddressModal } from '@/components/profile/AddressModal';
import { useAddressStore } from '@/store/addressStore';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

interface ForceAddressModalProps {
  isOpen: boolean;
}

export const ForceAddressModal: React.FC<ForceAddressModalProps> = ({ isOpen }) => {
  const supabase = useSupabase();
  const { addOrUpdateAddress, setActiveAddress } = useAddressStore();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutate: addAddressMut, isPending: isAddingAddress } = useMutation({
    mutationFn: (newData: any) => addAddress(supabase, { ...newData, is_primary: true }),
    onSuccess: newAddress => {
      toast.success('¡Dirección agregada exitosamente!');
      addOrUpdateAddress(newAddress);
      setActiveAddress(newAddress);
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
    onError: error => {
      console.error('Error al agregar dirección:', error);
      toast.error(t('address.addError'));
    },
  });

  const handleForceSubmit = async (data: AddressFormData) => {
    try {
      const newAddress = await addAddress(supabase, { ...data, is_primary: true });
      addOrUpdateAddress(newAddress);
      setActiveAddress(newAddress);
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error(t('address.addError'));
    }
  };

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
