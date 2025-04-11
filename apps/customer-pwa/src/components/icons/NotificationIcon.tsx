import { SVGProps } from 'react';

export const NotificationIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="40" height="40" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Campana */}
    <path 
      d="M24 18C24 12 28 8 32 8C36 8 40 12 40 18V26C40 30 42 34 44 36V38H20V36C22 34 24 30 24 26V18Z"
      fill="#FFD700" 
      stroke="#FFD700" 
      strokeWidth="2"
    />
    <circle cx="32" cy="40" r="2" fill="#000000"/>
  </svg>
); 