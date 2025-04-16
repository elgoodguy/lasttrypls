import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getAddresses, addAddress, updateAddress, Address } from '@repo/api-client';
import { Button } from '@repo/ui/components/ui/button';
import { AddressCard } from './AddressCard';
import { Plus } from 'lucide-react';
import { useSupabase } from '@/providers/SupabaseProvider';
import { AddressModal } from './AddressModal';
import { AddressFormData } from '@/lib/validations/address';
import { useAddressStore } from '@/store/addressStore';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export const AddressManager: React.FC = () => {
  const supabase = useSupabase();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addresses, addOrUpdateAddress, setActiveAddress, deleteAddress, setPrimaryAddress } = useAddressStore();
  const { t } = useTranslation();

  useQuery({
    queryKey: ['addresses'],
    queryFn: () => getAddresses(supabase),
  });

  const addAddressMutation = useMutation({
    mutationFn: (data: AddressFormData) => addAddress(supabase, data),
    onSuccess: (newAddress) => {
      toast.success(t('address.addSuccess'));
      addOrUpdateAddress(newAddress);
      if (addresses.length === 0) {
        setActiveAddress(newAddress);
      }
      setIsModalOpen(false);
      setSelectedAddress(null);
    },
    onError: (error) => {
      console.error('Error adding address:', error);
      toast.error(t('address.addError'));
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ addressId, updates }: { addressId: string; updates: AddressFormData }) => 
      updateAddress(supabase, addressId, updates),
    onSuccess: (updatedAddress) => {
      toast.success(t('address.updateSuccess'));
      addOrUpdateAddress(updatedAddress);
      const currentActiveId = addresses.find(addr => addr.is_primary)?.id;
      if (selectedAddress?.id === currentActiveId) {
        setActiveAddress(updatedAddress);
      }
      setIsModalOpen(false);
      setSelectedAddress(null);
    },
    onError: (error) => {
      console.error('Error updating address:', error);
      toast.error(t('address.updateError'));
    },
  });

  const handleAddressSubmit = (data: AddressFormData) => {
    console.log('[AddressManager] Submitting address:', data);
    if (selectedAddress?.id) {
      updateAddressMutation.mutate({ 
        addressId: selectedAddress.id, 
        updates: data
      });
    } else {
      addAddressMutation.mutate(data);
    }
  };

  const handleEdit = (address: Address) => {
    setSelectedAddress(address);
    setIsModalOpen(true);
  };

  const handleDelete = async (addressId: string) => {
    if (!addressId) return;
    await deleteAddress(addressId);
  };

  const handleSetPrimary = async (addressId: string) => {
    if (!addressId) return;
    await setPrimaryAddress(addressId);
  };

  const handleAddNew = () => {
    setSelectedAddress(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{t('profile.addresses.title')}</h2>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {t('profile.addresses.add')}
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
          {t('profile.addresses.noAddresses')}
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
