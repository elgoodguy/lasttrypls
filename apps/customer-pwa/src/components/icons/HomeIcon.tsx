import { SVGProps } from 'react';

export const HomeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="100%" height="auto" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Base verde */}
    <rect x="12" y="52" width="40" height="4" rx="2" fill="#4CAF50" stroke="#4CAF50" strokeWidth="2"/>

    {/* Casa principal */}
    <rect x="16" y="28" width="32" height="24" fill="#FFD166" stroke="#FFD166" strokeWidth="2" rx="2"/>

    {/* Techo */}
    <polygon points="12,28 32,12 52,28" fill="#F07167" stroke="#F07167" strokeWidth="2" strokeLinejoin="round"/>

    {/* Chimenea */}
    <rect x="42" y="16" width="6" height="10" fill="#7D8B99" stroke="#7D8B99" strokeWidth="2" rx="1"/>

    {/* Ventana */}
    <rect x="20" y="32" width="8" height="8" fill="#81D4FA" stroke="#81D4FA" strokeWidth="2" rx="1"/>

    {/* Puerta */}
    <rect x="36" y="38" width="8" height="14" fill="#8D5A30" stroke="#8D5A30" strokeWidth="2" rx="2"/>
    <circle cx="42" cy="45" r="1.5" fill="#8D5A30"/>
  </svg>
); 