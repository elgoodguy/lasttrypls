import { SVGProps } from 'react';

export const LocationIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="100%" height="auto" viewBox="20 20 24 36" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path 
      d="M32 22 
        C27 22, 22 27, 22 34
        C22 40, 27 46, 32 54
        C37 46, 42 40, 42 34
        C42 27, 37 22, 32 22Z"
      fill="#FF3B30" 
      stroke="#070707" 
      strokeWidth="2"
    />
    <circle cx="32" cy="34" r="4" fill="#FFF" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
); 