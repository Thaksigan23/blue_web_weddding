import React from 'react';
import './monogram.css';
/** Supplied transparent floral artwork, preserved in its original colours. */
export default function Monogram({variant='dark',decorative=false,className=''}) {
  return <img className={`sr-monogram sr-monogram-${variant} ${className}`} src="/branding/sr-floral-monogram.png" width="1536" height="1024" alt={decorative?'':'S & R — Sharon and Ramaniya'} aria-hidden={decorative||undefined} decoding="async"/>;
}
