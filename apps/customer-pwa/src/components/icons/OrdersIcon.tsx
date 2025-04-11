import { SVGProps } from 'react';

export const OrdersIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="32" height="32" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Parte superior de la caja cerrada */}
    <polygon points="8,20 32,8 56,20 32,32" fill="#E76F51" stroke="#070707" strokeWidth="2" strokeLinejoin="round"/>

    {/* Parte frontal de la caja */}
    <polygon points="8,20 8,44 32,56 32,32" fill="#F4A261" stroke="#070707" strokeWidth="2" strokeLinejoin="round"/>

    {/* Parte lateral de la caja */}
    <polygon points="56,20 56,44 32,56 32,32" fill="#F4A261" stroke="#070707" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
); 