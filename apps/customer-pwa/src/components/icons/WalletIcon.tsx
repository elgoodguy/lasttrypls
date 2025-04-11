import { SVGProps } from 'react';

export const WalletIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="32" height="32" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Cuerpo principal rectangular de la cartera */}
    <rect x="12" y="20" width="40" height="28" fill="#8B4513" stroke="#070707" strokeWidth="2"/>

    {/* Solapa de la cartera */}
    <rect x="12" y="16" width="40" height="12" fill="#A0522D" stroke="#070707" strokeWidth="2"/>

    {/* Botón o broche */}
    <circle cx="42" cy="22" r="2" fill="#FFD700" stroke="#070707" strokeWidth="1"/>
  </svg>
); 