import { HTMLAttributes } from 'react';

interface LocationIconProps extends HTMLAttributes<HTMLImageElement> {
  className?: string;
}

export const LocationIcon = ({ className, ...props }: LocationIconProps) => (
  <img
    src="/icons-3d/icons8-location-100 1.png"
    alt="Location"
    className={className}
    width="100%"
    height="100%"
    {...props}
  />
); 