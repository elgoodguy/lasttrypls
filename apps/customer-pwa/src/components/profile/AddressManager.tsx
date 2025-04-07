import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Address, addAddress, updateAddress, deleteAddress, getAddresses, setPrimaryAddress } from '@repo/api-client';
import { Button } from '@repo/ui/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@repo/ui/components/ui/dialog';
import { AddressCard } from './AddressCard';
import { AddressForm } from './AddressForm';
import { Plus } from 'lucide-react';
import { useSupabase } from '@/providers/SupabaseProvider';

type AddressInput = Omit<Address, 'id' | 'created_at' | 'updated_at' | 'user_id'>;

export const AddressManager: React.FC = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabase();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: addresses = [], isLoading: isLoadingAddresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => getAddresses(supabase),
  });

  const addAddressMutation = useMutation({
    mutationFn: (data: AddressInput) => addAddress(supabase, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setIsDialogOpen(false);
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ addressId, data }: { addressId: string; data: Partial<AddressInput> }) =>
      updateAddress(supabase, addressId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setIsDialogOpen(false);
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

  const handleAddressSubmit = async (data: AddressInput, addressId?: string) => {
    if (addressId) {
      await updateAddressMutation.mutate({ addressId, data });
    } else {
      await addAddressMutation.mutate(data);
    }
  };

  const handleEdit = (address: Address) => {
    setSelectedAddress(address);
    setIsDialogOpen(true);
  };

  const handleDelete = async (addressId: string) => {
    await deleteAddressMutation.mutate(addressId);
  };

  const handleSetPrimary = async (addressId: string) => {
    await setPrimaryAddressMutation.mutate(addressId);
  };

  const handleAddNew = () => {
    setSelectedAddress(null);
    setIsDialogOpen(true);
  };

  if (isLoadingAddresses) {
    return <div className="text-center py-8">Loading addresses...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Delivery Addresses</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedAddress ? 'Edit Address' : 'Add New Address'}
              </DialogTitle>
            </DialogHeader>
            <AddressForm
              onSubmit={handleAddressSubmit}
              initialData={selectedAddress}
              isLoading={addAddressMutation.isPending || updateAddressMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

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