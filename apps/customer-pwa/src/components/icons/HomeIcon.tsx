import { HTMLAttributes } from 'react';

interface HomeIconProps extends HTMLAttributes<HTMLImageElement> {
  className?: string;
}

export const HomeIcon = ({ className, ...props }: HomeIconProps) => (
  <img
    src="/icons-3d/icons8-home-1500 1.png"
    alt="Home"
    className={className}
    width="100%"
    height="100%"
    {...props}
  />
); 