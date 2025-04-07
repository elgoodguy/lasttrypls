import React from 'react';
import { Address } from '@repo/api-client';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";
import { Edit3, Trash2, Star } from 'lucide-react';

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (addressId: string) => void;
  onSetPrimary: (addressId: string) => void;
  isDeleting: boolean;
  isSettingPrimary: boolean;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onEdit,
  onDelete,
  onSetPrimary,
  isDeleting,
  isSettingPrimary,
}) => {
  const fullAddress = `${address.street_address}${address.internal_number ? ` #${address.internal_number}` : ''}, ${address.neighborhood ? `${address.neighborhood}, ` : ''}${address.city}, ${address.postal_code}, ${address.country}`;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      onDelete(address.id);
    }
  };

  const handleSetPrimary = () => {
    onSetPrimary(address.id);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">
          {address.is_primary ? 'Primary Address' : 'Address'}
        </CardTitle>
        {address.is_primary && <Badge variant="outline"><Star className="mr-1 h-3 w-3 fill-current" /> Primary</Badge>}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{fullAddress}</p>
        {address.delivery_instructions && (
          <p className="text-xs italic text-muted-foreground mt-1">
            Instructions: {address.delivery_instructions}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(address)}
          disabled={isDeleting || isSettingPrimary}
        >
          <Edit3 className="mr-2 h-4 w-4" /> Edit
        </Button>
        {/* Only show 'Set Primary' if it's not already primary */}
        {!address.is_primary && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSetPrimary}
            disabled={isSettingPrimary || isDeleting}
          >
            <Star className="mr-2 h-4 w-4" /> Set as Primary
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
          onClick={handleDelete}
          disabled={isDeleting || isSettingPrimary}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}; 