import React from 'react';
import './monogram.css';
/** Original path artwork; no external font is needed to render the identity. */
export default function Monogram({variant='dark',decorative=false,className=''}) {
  return <img className={`sr-monogram ${className}`} src={`/branding/sr-monogram-${variant}.svg`} width="150" height="112" alt={decorative?'':'S & R — S. Sharon and R. Ramaniya'} aria-hidden={decorative||undefined} decoding="async"/>;
}
