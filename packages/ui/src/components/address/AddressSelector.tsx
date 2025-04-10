import React from 'react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { MapPin, PlusCircle, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface Address {
  id: string;
  street_address: string;
  is_primary?: boolean;
}

export interface AddressSelectorProps {
  addresses: Address[];
  activeAddress?: Address | null;
  isLoading?: boolean;
  onAddressSelect: (addressId: string) => void;
  onAddNewClick: () => void;
  onManageClick: () => void;
  onSetPrimaryClick?: (addressId: string) => void;
  className?: string;
}

// Helper to format address concisely
function formatShortAddress(address: Address | null | undefined): string {
  if (!address) return 'Set Location';
  let display = address.street_address;
  return display.length > 30 ? display.substring(0, 27) + '...' : display;
}

export function AddressSelector({
  addresses,
  activeAddress,
  isLoading = false,
  onAddressSelect,
  onAddNewClick,
  onManageClick,
  onSetPrimaryClick,
  className,
}: AddressSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={cn('px-2 sm:px-4', className)} disabled={isLoading}>
          <MapPin className="h-4 w-4 mr-1 sm:mr-2 flex-shrink-0" />
          <span className="truncate text-sm">
            {isLoading ? 'Loading...' : formatShortAddress(activeAddress)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 bg-background border shadow-md">
        <DropdownMenuLabel>Deliver to:</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <DropdownMenuItem disabled>Loading addresses...</DropdownMenuItem>
        ) : addresses.length === 0 ? (
          <DropdownMenuItem disabled>No addresses saved yet.</DropdownMenuItem>
        ) : (
          addresses.map(addr => (
            <DropdownMenuItem
              key={addr.id}
              onClick={() => onAddressSelect(addr.id)}
              className={cn('cursor-pointer', { 'bg-accent': addr.id === activeAddress?.id })}
            >
              {addr.is_primary && <Home className="mr-2 h-4 w-4" />}
              <span className="truncate">{formatShortAddress(addr)}</span>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onAddNewClick} className="cursor-pointer">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Address
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onManageClick} className="cursor-pointer">
          <MapPin className="mr-2 h-4 w-4" />
          Manage Addresses
        </DropdownMenuItem>
        {onSetPrimaryClick && activeAddress && !activeAddress.is_primary && (
          <DropdownMenuItem
            onClick={() => onSetPrimaryClick(activeAddress.id)}
            className="cursor-pointer"
          >
            <Home className="mr-2 h-4 w-4" />
            Set Current as Primary
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
