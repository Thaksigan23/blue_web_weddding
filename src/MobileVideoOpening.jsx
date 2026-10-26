import React, {useEffect, useRef, useState} from 'react';
import {motion} from 'framer-motion';
import {mobileOpening, startOpeningPlayback} from './mobileOpening';
import './mobile-opening.css';

export default function MobileVideoOpening({onComplete,onFallback,config=mobileOpening}) {
  const video=useRef(null);
  const [playing,setPlaying]=useState(false);
  useEffect(()=>{
    const player=video.current;
    if(!player.canPlayType(config.type)){onFallback('unsupported-format');return;}
    // Observe failures and playback before assigning the real media source.
    const dispose=startOpeningPlayback(player,{onPlaying:()=>setPlaying(true),onEnded:onComplete,onFallback,loadTimeoutMs:config.loadTimeoutMs,stallTimeoutMs:config.stallTimeoutMs,src:config.src});
    return dispose;
  },[config,onComplete,onFallback]);
  return <motion.section className="mobile-opening" aria-label="Cinematic engagement opening" data-opening-mode="portrait-video" exit={{opacity:0}} transition={{duration:.65}}>
    <img className="mobile-opening-poster" src={config.poster} alt="" aria-hidden="true" style={{objectPosition:config.objectPosition}}/>
    <video ref={video} poster={config.poster} className={playing?'mobile-opening-video is-playing':'mobile-opening-video'} style={{objectPosition:config.objectPosition}} muted playsInline preload="auto" disablePictureInPicture aria-hidden="true" tabIndex={-1}/>
    {!playing&&<p className="mobile-opening-status sr-only" role="status">Preparing a little moment of magic…</p>}
    <div className="mobile-opening-shade" aria-hidden="true"/>
    <div className="mobile-opening-mark" aria-hidden="true">S <i>&</i> R</div>
    <button className="mobile-opening-skip" onClick={onComplete}>Skip Intro <span aria-hidden="true">→</span></button>
  </motion.section>;
}



