import React, {useEffect, useState} from 'react';
import './desktop-presentation.css';
import {AmbientButterflies} from './InvitationExtras';

export const PHONE_VIEW_PARAM = 'invitation-phone';

export default function DesktopPresentation({children}) {
  const [desktop,setDesktop]=useState(()=>window.matchMedia('(min-width: 1024px)').matches);
  const [viewportHeight,setViewportHeight]=useState(()=>window.innerHeight);
  const embedded=new URLSearchParams(window.location.search).get(PHONE_VIEW_PARAM)==='1';
  useEffect(()=>{
    document.documentElement.classList.toggle('invitation-phone-view',embedded);
    return()=>document.documentElement.classList.remove('invitation-phone-view');
  },[embedded]);
  useEffect(()=>{
    const query=window.matchMedia('(min-width: 1024px)');
    const update=()=>setDesktop(query.matches);
    query.addEventListener('change',update);
    return()=>query.removeEventListener('change',update);
  },[]);
  useEffect(()=>{
    const resize=()=>setViewportHeight(window.innerHeight);
    window.addEventListener('resize',resize);
    return()=>window.removeEventListener('resize',resize);
  },[]);
  if(!desktop||embedded)return children;
  const url=new URL(window.location.href);url.searchParams.set(PHONE_VIEW_PARAM,'1');
  return <div className="desktop-presentation">
    <AmbientButterflies count={20}/>
    <div className="desktop-phone" style={{'--phone-scale':Math.min(1,Math.max(.35,(viewportHeight-64)/880))}}>
      <div className="desktop-phone-top" aria-hidden="true"><span/><i/></div>
      <iframe src={url.href} title="Sharon and Ramaniya engagement invitation" className="desktop-phone-screen" allow="fullscreen"/>
      <div className="desktop-phone-bottom" aria-hidden="true"><span/></div>
    </div>
    <p className="desktop-presentation-caption">SHARON & RAMANIYA <span>14 DECEMBER 2026</span></p>
  </div>;
}
