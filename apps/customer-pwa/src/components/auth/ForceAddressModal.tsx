import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addAddress, Address } from '@repo/api-client';
import { toast } from 'sonner';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useAuth } from '@/providers/AuthProvider';
import { AddressForm } from '@/components/profile/AddressForm';

interface ForceAddressModalProps {
  isOpen: boolean;
  // No onClose prop - modal should only close on success
}

type AddressInput = Omit<Address, 'id' | 'created_at' | 'updated_at' | 'user_id'>;

export const ForceAddressModal: React.FC<ForceAddressModalProps> = ({ isOpen }) => {
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Mutation for adding the address
  const { mutate: addAddressMut, isPending: isAddingAddress } = useMutation({
    mutationFn: (newData: AddressInput) => addAddress(supabase, { ...newData, is_primary: true }),
    onSuccess: () => {
      toast.success("Address added successfully!");
      // Invalidate address query in AuthProvider so requiresAddress becomes false
      queryClient.invalidateQueries({ queryKey: ['addresses', user?.id] });
      // Modal will close because isOpen becomes false via requiresAddress in parent
    },
    onError: (error) => {
      console.error('Error adding address:', error);
      toast.error("Failed to add address. Please try again.");
    },
  });

  const handleFormSubmit = (data: AddressInput) => {
    addAddressMut(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Your First Delivery Address</DialogTitle>
          <DialogDescription>
            We need your address to show you relevant stores and calculate delivery fees. 
            Please add your primary address to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <AddressForm
            onSubmit={handleFormSubmit}
            isLoading={isAddingAddress}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}; 