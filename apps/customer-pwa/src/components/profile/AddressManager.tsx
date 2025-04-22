import { useState } from 'react';
import { Button, Card } from '@repo/ui';
import { useSupabase } from '@/providers/SupabaseProvider';
import { AddressFormData } from '@/lib/validations/address';
import { useAddressStore } from '@/store/addressStore';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { AddressForm } from './AddressForm';
import { addApiAddress, updateApiAddress, deleteApiAddress, setApiPrimaryAddress } from '@/store/addressStore';
import type { Address } from '@repo/api-client';

export function AddressManager() {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);
  const [isSettingPrimary, setIsSettingPrimary] = useState(false);
  const { addresses } = useAddressStore();
  const supabase = useSupabase();
  const { t } = useTranslation();

  const handleAddressSubmit = async (data: AddressFormData) => {
    try {
      setIsLoading(true);
      if (selectedAddress?.id) {
        await updateApiAddress(supabase, selectedAddress.id, data);
        toast.success(t('address.updateSuccess'));
      } else {
        await addApiAddress(supabase, data);
        toast.success(t('address.addSuccess'));
      }
      setSelectedAddress(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error submitting address:', error);
      toast.error(t(selectedAddress ? 'address.updateError' : 'address.addError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!addressId || deletingAddressId) return;
    if (window.confirm(t('profile.addresses.confirmDelete'))) {
      try {
        setDeletingAddressId(addressId);
        await deleteApiAddress(supabase, addressId);
        toast.success(t('address.deleteSuccess'));
      } catch (error) {
        console.error('[AddressManager] Error deleting address:', error);
        toast.error(t('address.deleteError'));
      } finally {
        setDeletingAddressId(null);
      }
    }
  };

  const handleSetPrimary = async (addressId: string) => {
    if (!addressId || isSettingPrimary) return;
    try {
      setIsSettingPrimary(true);
      await setApiPrimaryAddress(supabase, addressId);
      toast.success(t('address.setPrimarySuccess'));
    } catch (error) {
      console.error('[AddressManager] Error setting primary:', error);
      toast.error(t('address.setPrimaryError'));
    } finally {
      setIsSettingPrimary(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('profile.addresses.title')}</h2>
        <Button onClick={() => setIsEditing(true)}>
          {t('profile.addresses.add')}
        </Button>
      </div>

      {isEditing && (
        <Card className="p-4">
          <AddressForm
            onSubmit={handleAddressSubmit}
            defaultValues={selectedAddress || undefined}
            isLoading={isLoading}
          />
        </Card>
      )}

      <div className="grid gap-4">
        {addresses.map((address) => (
          <Card key={address.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{address.street_address}</p>
                <p>{address.city}, {address.postal_code}</p>
                {address.neighborhood && <p>{address.neighborhood}</p>}
                <p>{address.country}</p>
                {address.is_primary && <span className="text-sm text-primary">{t('address.primary')}</span>}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedAddress(address);
                    setIsEditing(true);
                  }}
                  disabled={isLoading}
                >
                  {t('common.edit')}
                </Button>
                {!address.is_primary && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetPrimary(address.id)}
                    disabled={isSettingPrimary}
                  >
                    {t('address.setPrimary')}
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(address.id)}
                  disabled={deletingAddressId === address.id}
                >
                  {t('common.delete')}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
