import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { addAddress } from '@repo/api-client';
import { toast } from 'sonner';
import { useSupabase } from '@/providers/SupabaseProvider';
import { AddressModal } from '@/components/profile/AddressModal';
import { useAddressStore } from '@/store/addressStore';

interface ForceAddressModalProps {
  isOpen: boolean;
}

export const ForceAddressModal: React.FC<ForceAddressModalProps> = ({ isOpen }) => {
  const supabase = useSupabase();
  const { addOrUpdateAddress } = useAddressStore();

  const { mutate: addAddressMut, isPending: isAddingAddress } = useMutation({
    mutationFn: (newData: any) => addAddress(supabase, { ...newData, is_primary: true }),
    onSuccess: newAddress => {
      toast.success('¡Dirección agregada exitosamente!');
      addOrUpdateAddress(newAddress);
      console.log('[ForceAddressModal onSuccess] Zustand updated. App should re-render and navigate.');
    },
    onError: error => {
      console.error('Error al agregar dirección:', error);
      toast.error('No se pudo agregar la dirección. Por favor intenta de nuevo.');
    },
  });

  const handleForceSubmit = (data: any) => {
    console.log('ForceAddressModal - handleForceSubmit - Data:', data);
    addAddressMut(data);
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
