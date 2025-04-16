import { HTMLAttributes } from 'react';

interface NotificationsIconProps extends HTMLAttributes<HTMLImageElement> {
  className?: string;
}

export const NotificationsIcon = ({ className, ...props }: NotificationsIconProps) => (
  <img
    src="/icons-3d/icons8-bell-100 1.png"
    alt="Notifications"
    className={className}
    width="100%"
    height="100%"
    {...props}
  />
); 