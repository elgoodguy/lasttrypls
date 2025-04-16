import { HTMLAttributes } from 'react';

interface FavoritesIconProps extends HTMLAttributes<HTMLImageElement> {
  className?: string;
}

export const FavoritesIcon = ({ className, ...props }: FavoritesIconProps) => (
  <img
    src="/icons-3d/icons8-heart-100 1.png"
    alt="Favorites"
    className={className}
    width="100%"
    height="100%"
    {...props}
  />
); 