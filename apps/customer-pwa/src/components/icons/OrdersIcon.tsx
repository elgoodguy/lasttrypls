import { HTMLAttributes } from 'react';

interface OrdersIconProps extends HTMLAttributes<HTMLImageElement> {
  className?: string;
}

export const OrdersIcon = ({ className, ...props }: OrdersIconProps) => (
  <img
    src="/icons-3d/icons8-package-100 1.png"
    alt="Orders"
    className={className}
    width="100%"
    height="100%"
    {...props}
  />
); 