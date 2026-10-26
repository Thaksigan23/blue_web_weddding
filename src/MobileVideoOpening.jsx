import React, {useCallback, useEffect, useRef, useState} from 'react';
import {motion, useIsPresent} from 'framer-motion';
import {mobileOpening, startOpeningPlayback} from './mobileOpening';
import './mobile-opening.css';
import Monogram from './Monogram';

export default function MobileVideoOpening({onComplete,onFallback,config=mobileOpening}) {
  const video=useRef(null);
  const [playing,setPlaying]=useState(false);
  const [finishing,setFinishing]=useState(false);
  const present=useIsPresent();
  const finish=useCallback(()=>{video.current?.pause();setFinishing(true);onComplete()},[onComplete]);
  useEffect(()=>{
    const player=video.current;
    if(!player.canPlayType(config.type)){onFallback('unsupported-format');return;}
    // Observe failures and playback before assigning the real media source.
    const dispose=startOpeningPlayback(player,{onPlaying:()=>setPlaying(true),onEnded:finish,onFallback,loadTimeoutMs:config.loadTimeoutMs,stallTimeoutMs:config.stallTimeoutMs,src:config.src});
    return dispose;
  },[config,finish,onFallback]);
  return <motion.section className={`mobile-opening${!present?" is-leaving":""}`} aria-hidden={!present} aria-label="Cinematic engagement opening" data-opening-mode="portrait-video" exit={{opacity:0}} transition={{duration:finishing?1.4:.65,ease:[.4,0,.2,1]}}>
    <img className="mobile-opening-poster" src={config.poster} alt="" aria-hidden="true" style={{objectPosition:config.objectPosition}}/>
    <video ref={video} poster={config.poster} className={playing?'mobile-opening-video is-playing':'mobile-opening-video'} style={{objectPosition:config.objectPosition}} muted playsInline preload="auto" disablePictureInPicture aria-hidden="true" tabIndex={-1}/>
    {!playing&&<p className="mobile-opening-status sr-only" role="status">Preparing a little moment of magic…</p>}
    <div className="mobile-opening-shade" aria-hidden="true"/>
    <div className="mobile-opening-mark" aria-hidden="true"><Monogram variant="light" decorative/></div>
    <button className="mobile-opening-skip" onClick={finish} disabled={!present}>Skip <span aria-hidden="true">→</span></button>
  </motion.section>;
}





