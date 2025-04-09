import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Address, addAddress, updateAddress, deleteAddress, getAddresses, setPrimaryAddress } from '@repo/api-client';
import { Button } from '@repo/ui/components/ui/button';
import { AddressCard } from './AddressCard';
import { Plus } from 'lucide-react';
import { useSupabase } from '@/providers/SupabaseProvider';
import { AddressModal } from './AddressModal';
import { AddressFormData } from './AddressForm';

// Definir explícitamente AddressInput con los campos esperados por addAddress/updateAddress
type AddressInput = {
  street_address: string;
  city: string;
  neighborhood: string | null;
  postal_code: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  google_place_id?: string | null;
  is_primary?: boolean;
  internal_number?: string | null;
  delivery_instructions?: string | null;
};

export const AddressManager: React.FC = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabase();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: addresses = [], isLoading: isLoadingAddresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => getAddresses(supabase),
  });

  const addAddressMutation = useMutation({
    mutationFn: (data: AddressInput) => addAddress(supabase, data), // Asegurar que el tipo coincida
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setIsModalOpen(false);
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ addressId, data }: { addressId: string; data: Partial<AddressInput> }) => // Usar Partial<AddressInput>
      updateAddress(supabase, addressId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setIsModalOpen(false);
      setSelectedAddress(null);
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: (addressId: string) => deleteAddress(supabase, addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });

  const setPrimaryAddressMutation = useMutation({
    mutationFn: (addressId: string) => setPrimaryAddress(supabase, addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });

  const handleAddressSubmit = async (data: AddressFormData, addressId?: string) => {
    // Crear objeto de datos explícitamente con los campos de AddressInput
    const submitData: AddressInput = {
      street_address: data.street_address,
      city: data.city,
      neighborhood: data.neighborhood,
      postal_code: data.postal_code,
      country: data.country,
      latitude: data.latitude,
      longitude: data.longitude,
      google_place_id: data.google_place_id,
      is_primary: data.is_primary,
      internal_number: data.internal_number,
      delivery_instructions: data.delivery_instructions,
    };

    try {
      if (addressId) {
        await updateAddressMutation.mutateAsync({ addressId, data: submitData });
      } else {
        await addAddressMutation.mutateAsync(submitData);
      }
    } catch (error) {
      console.error("Error submitting address:", error);
      // Aquí podrías mostrar un toast o mensaje de error al usuario
    }
  };

  const handleEdit = (address: Address) => {
    setSelectedAddress(address);
    setIsModalOpen(true);
  };

  const handleDelete = async (addressId: string) => {
    await deleteAddressMutation.mutateAsync(addressId);
  };

  const handleSetPrimary = async (addressId: string) => {
    await setPrimaryAddressMutation.mutateAsync(addressId);
  };

  const handleAddNew = () => {
    setSelectedAddress(null);
    setIsModalOpen(true);
  };

  if (isLoadingAddresses) {
    return <div className="text-center py-8">Loading addresses...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Delivery Addresses</h2>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Address
        </Button>
      </div>

      <AddressModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAddress(null);
        }}
        onSubmit={handleAddressSubmit}
        isLoading={addAddressMutation.isPending || updateAddressMutation.isPending}
        addressToEdit={selectedAddress}
        isForceModal={false}
      />

      {addresses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No addresses added yet. Add your first delivery address.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => handleEdit(address)}
              onDelete={() => handleDelete(address.id)}
              onSetPrimary={() => handleSetPrimary(address.id)}
              isDeleting={deleteAddressMutation.isPending}
              isSettingPrimary={setPrimaryAddressMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}; 