import { HTMLAttributes } from 'react';

interface WalletIconProps extends HTMLAttributes<HTMLImageElement> {
  className?: string;
}

export const WalletIcon = ({ className, ...props }: WalletIconProps) => (
  <img
    src="/icons-3d/icons8-wallet-100 1.png"
    alt="Wallet"
    className={className}
    width="100%"
    height="100%"
    {...props}
  />
); 