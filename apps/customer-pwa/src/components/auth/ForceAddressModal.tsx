import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addAddress } from '@repo/api-client';
import { toast } from 'sonner';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useAuth } from '@/providers/AuthProvider';
import { AddressModal } from '@/components/profile/AddressModal';

interface ForceAddressModalProps {
  isOpen: boolean;
}

export const ForceAddressModal: React.FC<ForceAddressModalProps> = ({ isOpen }) => {
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { mutate: addAddressMut, isPending: isAddingAddress } = useMutation({
    mutationFn: (newData: any) => addAddress(supabase, { ...newData, is_primary: true }),
    onSuccess: () => {
      toast.success("¡Dirección agregada exitosamente!");
      queryClient.invalidateQueries({ queryKey: ['addresses', user?.id] });
    },
    onError: (error) => {
      console.error('Error al agregar dirección:', error);
      toast.error("No se pudo agregar la dirección. Por favor intenta de nuevo.");
    },
  });

  const handleForceSubmit = (data: any) => {
    addAddressMut(data);
  };

  return (
    <AddressModal
      isOpen={isOpen}
      onClose={() => {}} // No-op para el modal forzado
      onSubmit={handleForceSubmit}
      isLoading={isAddingAddress}
      addressToEdit={null}
      isForceModal={true}
    />
  );
}; 