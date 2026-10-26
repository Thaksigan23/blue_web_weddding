import React, {useCallback, useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {motion, AnimatePresence, useReducedMotion} from 'framer-motion';
import './styles.css';
import IllustratedCouple from './IllustratedCouple';
import './refinements.css';
import InvitationPage from './InvitationPage';
import Monogram from './Monogram';
import MobileVideoOpening from './MobileVideoOpening';
import {mobileOpening, MOBILE_OPENING_QUERY, shouldUseMobileVideo} from './mobileOpening';

function Flower({x,y,s=1,rotate=0}){return <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rotate})`}><g className="flower-sway" style={{animationDelay:`${-(x%7)}s`}}><path d="M0 0Q-8-46 6-91M0-30Q-30-51-25-67Q-5-59 0-30M3-53Q27-65 26-81Q8-74 3-53" fill="#264f69" stroke="#7da9c1" strokeWidth=".8"/>{[-55,-30,0,30,55].map((a,i)=><g key={a} transform={`rotate(${a} 6 -88)`}><path d="M6-88Q-13-111 6-130Q25-110 6-88Z" fill={i%2?'#407292':'#285470'} stroke="#b2d0e2" strokeWidth=".8"/><path d="M6-90v-34" stroke="#a4c9e0" strokeWidth=".5" opacity=".7"/></g>)}<circle cx="6" cy="-91" r="2" fill="#edf8ff"/></g></g>}
function Arch(){return <div className="garden-arch"><svg viewBox="0 0 500 600" preserveAspectRatio="none"><path className="arch-line" d="M50 580V240C50-45 450-45 450 240V580"/><path className="arch-vine" d="M42 580Q67 460 45 350T52 230C60-32 440-32 448 230Q429 350 449 450T458 580"/>{Array.from({length:25},(_,i)=>{const a=Math.PI+i/24*Math.PI;return <g key={i} className="arch-flower" style={{animationDelay:`${6+i*.025}s,${7+i*.2}s`}} transform={`translate(${250+200*Math.cos(a)} ${240+214*Math.sin(a)}) rotate(${i*27})`}><path d="M0 0q-20-5-17-18Q-4-18 0 0M0 0q19-6 18-19Q3-17 0 0" fill="#426e89" stroke="#9cbed3" strokeWidth=".6"/>{[0,72,144,216,288].map(r=><ellipse key={r} rx="3" ry="7" cy="-5" transform={`rotate(${r})`} fill="#aecde2" stroke="#e8f3ff" strokeWidth=".4"/>)}<circle r="2" fill="#f0faff"/></g>})}{[310,390,470,550].flatMap((y,i)=>[50,450].map(x=><g key={x+'-'+y} className="arch-leaf" transform={`translate(${x} ${y}) scale(${x===50?1:-1} 1)`}><path d="M0 0Q22-18 28-7Q20 9 0 0M0-18Q-22-36-21-18Q-9-11 0-18" fill="#38617a" stroke="#86afc9" strokeWidth=".7"/><circle cy="-3" r="2" fill="#cbe3f3"/></g>))}</svg></div>}
function Garden(){return <div className="garden" aria-hidden="true"><div className="moon"/><div className="rays"/><div className="atmosphere"/><div className="star-field"/ ><Arch/><svg className="landscape" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice"><defs><radialGradient id="path"><stop stopColor="#648eaf" stopOpacity=".48"/><stop offset="1" stopColor="#102d4b" stopOpacity="0"/></radialGradient><linearGradient id="arch"><stop stopColor="#71b7e7" stopOpacity=".05"/><stop offset=".5" stopColor="#d3ecff"/><stop offset="1" stopColor="#71b7e7" stopOpacity=".05"/></linearGradient></defs><ellipse cx="740" cy="820" rx="440" ry="180" fill="url(#path)"/>{Array.from({length:32},(_,i)=><Flower key={i} x={i<16?i*28:1010+(i-16)*30} y={860+(i%4)*17} s={.5+(i%5)*.18} rotate={i<16?-15:15}/>)}</svg><div className="mist"/>{Array.from({length:32},(_,i)=><i key={i} className={i%7===0?'particle butterfly':'particle'} style={{left:`${(i*37)%100}%`,top:`${15+(i*19)%70}%`,'--delay':`${-i*.73}s`,'--duration':`${6+i%5}s`}}/>)}<div className="petals">{Array.from({length:9},(_,i)=><i key={i} style={{left:`${i*12}%`,animationDelay:`${-i*1.7}s`}}/>)}</div></div>}
function SvgOpening({run,reduced,ready,onOpen}) {return <motion.section key={`intro-${run}`} className="intro" aria-label="Moonlit engagement opening" exit={{opacity:0,filter:reduced?'none':'blur(12px)',scale:reduced?1:1.035}} transition={{duration:reduced?.2:1.2}}><div className="scene-camera"><Garden/><div className="actor-depth"><IllustratedCouple reduced={reduced}/></div></div><div className="topline"><span><Monogram variant="light" decorative/></span><span>14 · 12 · 2026</span></div><div className="intro-heading"><p className="eyebrow">A PROMISE BENEATH THE STARS</p><h1>S. Sharon <em>&</em><br/>R. Ramaniya</h1><div className="rule">✧</div><p className="occasion">Our Engagement</p><p className="date">14 DECEMBER 2026</p></div><div className={`entry ${ready?'visible':''}`}><button className="primary" onClick={onOpen} disabled={!ready}>View Our Invitation <span>↗</span></button><p>A little moment. A lifetime of love.</p></div><button className="skip" onClick={onOpen}>Skip introduction <span>→</span></button><div className="scene-caption">{ready?'TOGETHER, OUR FOREVER BEGINS':'A WALK TOWARDS FOREVER'}</div></motion.section>}
function App(){
  const reducedPreference=useReducedMotion();
  const [reducedInitial]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const reduced=reducedPreference??reducedInitial;
  const [mobile,setMobile]=useState(()=>window.matchMedia(MOBILE_OPENING_QUERY).matches);
  const [opened,setOpened]=useState(reducedInitial);
  const [run,setRun]=useState(0);
  const [failedVideoRun,setFailedVideoRun]=useState(null);
  const [ready,setReady]=useState(false);
  const [videoHandoff,setVideoHandoff]=useState(false);
  useEffect(()=>{const query=window.matchMedia(MOBILE_OPENING_QUERY);const update=()=>setMobile(query.matches);query.addEventListener('change',update);return()=>query.removeEventListener('change',update)},[]);
  useEffect(()=>{if(reduced)setOpened(true)},[reduced]);
  const videoMode=shouldUseMobileVideo({config:mobileOpening,mobile,reduced,failed:failedVideoRun===run});
  useEffect(()=>{setReady(false);if(opened||videoMode||reduced)return;const timer=setTimeout(()=>setReady(true),8200);return()=>clearTimeout(timer)},[run,opened,videoMode,reduced]);
  const openInvitation=useCallback(()=>setOpened(true),[]);
  const videoFallback=useCallback(()=>setFailedVideoRun(run),[run]);
  const completeMobileVideo=useCallback(()=>{setVideoHandoff(true);setOpened(true)},[]);
  const replay=useCallback(()=>{window.scrollTo({top:0,behavior:'instant'});setVideoHandoff(false);setRun(r=>r+1);setOpened(!!reduced)},[reduced]);
  return <main className={reduced?'reduce-motion':''}><AnimatePresence mode={videoMode?"sync":"wait"} initial={false}>
    {opened||reduced?<motion.section key="invitation" className="guest-page-transition" initial={{opacity:reduced||videoHandoff?1:0}} animate={{opacity:1}} transition={{duration:reduced?0:.8}}>{!videoHandoff&&<div className="light-sweep" aria-hidden="true"/>}<InvitationPage reduced={reduced} onReplay={replay}/></motion.section>
    :videoMode?<MobileVideoOpening key={`video-${run}`} onComplete={completeMobileVideo} onFallback={videoFallback}/>
    :<SvgOpening key={`svg-${run}`} run={run} reduced={reduced} ready={ready} onOpen={openInvitation}/>}
  </AnimatePresence></main>;
}
// Reuse the root when Vite re-evaluates this entry during hot updates.
const root=import.meta.hot?.data.root??createRoot(document.getElementById('root'));
if(import.meta.hot)import.meta.hot.data.root=root;
root.render(<App/>);



