import React from 'react';
import {couplePortrait} from './engagement.js';

export default function TamilWeddingArtwork() {
  return <div className="traditional-artwork">
    <img
      className="traditional-couple-photo"
      src={couplePortrait.src}
      alt={couplePortrait.alt}
      width={couplePortrait.width}
      height={couplePortrait.height}
      decoding="async"
    />
  </div>;
}
