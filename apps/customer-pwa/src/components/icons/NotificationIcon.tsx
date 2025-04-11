import { SVGProps } from 'react';

export const NotificationIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="32" height="32" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Campana */}
    <path 
      d="M24 22C24 16 28 12 32 12C36 12 40 16 40 22V30C40 34 42 38 44 40V42H20V40C22 38 24 34 24 30V22Z"
      fill="#FFD700" 
      stroke="#FFD700" 
      strokeWidth="2"
    />
    <circle cx="32" cy="44" r="3" fill="#FFFFFF" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
); 