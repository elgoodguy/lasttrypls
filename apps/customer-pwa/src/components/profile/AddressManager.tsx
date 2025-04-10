import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAddresses } from '@repo/api-client';
import { Button } from '@repo/ui/components/ui/button';
import { AddressCard } from './AddressCard';
import { Plus } from 'lucide-react';
import { useSupabase } from '@/providers/SupabaseProvider';
import { AddressModal } from './AddressModal';
import { AddressFormData } from '@/lib/validations/address';
import { useAddressStore } from '@/store/addressStore';

export const AddressManager: React.FC = () => {
  const supabase = useSupabase();
  const [selectedAddress, setSelectedAddress] = useState<AddressFormData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addresses, addAddress, updateAddress, deleteAddress, setPrimaryAddress } =
    useAddressStore();

  useQuery({
    queryKey: ['addresses'],
    queryFn: () => getAddresses(supabase),
  });

  const handleAddressSubmit = async (data: AddressFormData) => {
    if (selectedAddress) {
      await updateAddress(selectedAddress.id!, data);
    } else {
      await addAddress(data);
    }
    setIsModalOpen(false);
    setSelectedAddress(null);
  };

  const handleEdit = (address: AddressFormData) => {
    setSelectedAddress(address);
    setIsModalOpen(true);
  };

  const handleDelete = async (addressId: string) => {
    await deleteAddress(addressId);
  };

  const handleSetPrimary = async (addressId: string) => {
    await setPrimaryAddress(addressId);
  };

  const handleAddNew = () => {
    setSelectedAddress(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Direcciones de entrega</h2>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Agregar dirección
        </Button>
      </div>

      <AddressModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAddress(null);
        }}
        onSubmit={handleAddressSubmit}
        isLoading={false}
        addressToEdit={selectedAddress}
        isForceModal={false}
      />

      {addresses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No has agregado ninguna dirección. Agrega tu primera dirección de entrega.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map(address => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => handleEdit(address)}
              onDelete={() => handleDelete(address.id)}
              onSetPrimary={() => handleSetPrimary(address.id)}
              isDeleting={false}
              isSettingPrimary={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};
