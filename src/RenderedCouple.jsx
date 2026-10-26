import React, {useEffect, useRef, useState} from 'react';
import {useAnimationFrame} from 'framer-motion';
import WalkingCouple from './WalkingCouple';
import {journey} from './walkMath';
import {characterMedia} from './characterMedia';

// An actual alpha sample is checked, since codec recognition alone does not
// establish that a browser will composite the transparency correctly.
async function loadTransparentVideo(sources,signal) {
  for(const source of sources || []) {
    if(signal.aborted)throw new Error('Cancelled');
    const video=document.createElement('video');
    video.muted=true;video.playsInline=true;video.preload='auto';
    if(!video.canPlayType(source.type))continue;
    try {
      await new Promise((resolve,reject)=>{
        const cleanup=()=>{video.onloadeddata=null;video.onerror=null;signal.removeEventListener('abort',cancel)};
        const cancel=()=>{cleanup();reject(new Error('Cancelled'))};
        video.onloadeddata=()=>{cleanup();resolve()};
        video.onerror=()=>{cleanup();reject(new Error('Decode failed'))};
        signal.addEventListener('abort',cancel,{once:true});
        video.src=source.src;video.load();
      });
      const canvas=document.createElement('canvas');canvas.width=canvas.height=1;
      const context=canvas.getContext('2d',{willReadFrequently:true});
      context.drawImage(video,0,0,1,1,0,0,1,1);
      if(context.getImageData(0,0,1,1).data[3]>8)throw new Error('Opaque video');
      return video;
    } catch {
      video.removeAttribute('src');video.load();
      if(signal.aborted)throw new Error('Cancelled');
    }
  }
  throw new Error('No compatible transparent source');
}

export default function RenderedCouple({reduced}) {
  const mount=useRef(null),media=useRef(null),clock=useRef(null),elapsed=useRef(0);
  const [active,setActive]=useState(false);
  useEffect(()=>{
    if(!characterMedia)return;
    const abort=new AbortController();
    // Missing, slow, or unsupported footage keeps the existing complete opening.
    const timeout=setTimeout(()=>abort.abort(),2500);
    const owned=[];
    let poster;
    const fail=()=>{setActive(false);media.current=null;owned.forEach(v=>v.pause())};
    async function prepare(){
      try {
        poster=new Image();
        await new Promise((resolve,reject)=>{poster.onload=resolve;poster.onerror=reject;poster.src=characterMedia.poster});
        if(abort.signal.aborted)return;
        poster.className='rendered-character-poster';poster.alt='Sharon and Ramaniya in their navy engagement outfits';
        if(reduced){mount.current?.append(poster);setActive(true);return;}
        const walk=await loadTransparentVideo(characterMedia.walk,abort.signal);owned.push(walk);
        const settle=await loadTransparentVideo(characterMedia.settle,abort.signal);owned.push(settle);
        // Never switch character artwork midway through the walk.
        if(abort.signal.aborted||elapsed.current>.8)return;
        if(!Number.isFinite(walk.duration)||walk.duration<=0||!Number.isFinite(settle.duration)||settle.duration<=0)throw new Error('Invalid duration');
        walk.loop=true;
        [walk,settle].forEach(v=>{v.className='rendered-character-video';v.setAttribute('aria-hidden','true');v.addEventListener('error',fail);mount.current?.append(v)});
        settle.style.opacity='0';
        media.current={walk,settle,started:false,stopped:false};setActive(true);
      } catch {if(!abort.signal.aborted)fail()}
      finally {clearTimeout(timeout)}
    }
    prepare();
    return()=>{abort.abort();clearTimeout(timeout);media.current=null;setActive(false);poster?.remove();owned.forEach(v=>{v.pause();v.removeAttribute('src');v.load();v.remove()})};
  },[reduced]);

  useAnimationFrame(now=>{
    if(clock.current===null)clock.current=now;
    const t=(now-clock.current)/1000;elapsed.current=t;
    const m=media.current;
    if(!m||reduced)return;
    const fallback=()=>{setActive(false);m.walk.pause();m.settle.pause();media.current=null};
    if(t>=1&&t<5.8){
      const stage=mount.current.parentElement;
      const scale=Math.min(stage.clientWidth/255,stage.clientHeight/290);
      const distance=(window.innerWidth/2+stage.clientWidth*.65)/scale;
      const {speed}=journey(t);
      // Match the rendered in-place cycle cadence to the existing root motion.
      const rate=distance/4*speed/(characterMedia.stride||80)*m.walk.duration;
      // Out-of-range playback speeds are less convincing than the working rig.
      if(rate>4){fallback();return;}
      m.walk.playbackRate=Math.max(.0625,rate);
      if(!m.started){m.started=true;m.walk.play().catch(fallback)}
    } else if(t>=5.8&&!m.stopped){
      m.stopped=true;m.walk.pause();m.settle.style.opacity='1';m.walk.style.opacity='0';
      m.settle.play().catch(fallback);
    }
  });
  return <div className="couple-travel" data-character-mode={active?'rendered':'svg-fallback'}>
    <div className="foot-glow"/>
    {/* The live fallback also drives stage positioning and stays in sync on error. */}
    <div className={active?'skeletal-fallback is-covered':'skeletal-fallback'}><WalkingCouple reduced={reduced}/></div>
    <div ref={mount} className={active?'rendered-character-layer is-ready':'rendered-character-layer'}/>
  </div>;
}
