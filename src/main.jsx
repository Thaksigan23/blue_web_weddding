import React, {useCallback, useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {motion, AnimatePresence, useReducedMotion} from 'framer-motion';
import './styles.css';
import './refinements.css';
import InvitationPage from './InvitationPage';
import Monogram from './Monogram';

function Deepa({x,delay=0}){return <g className="ceremony-deepa" transform={`translate(${x} 0)`} style={{animationDelay:`${delay}s`}}><ellipse cx="0" cy="700" rx="52" ry="9" fill="#09080d" opacity=".4"/><path d="M-25 671h50l12 15h-74l12-15Zm-15 17h80l10 13h-100l10-13Z" fill="url(#ceremony-brass)" stroke="#75451f" strokeWidth="3"/><path d="M-7 670V593q0-12 7-19 7 7 7 19v77Z" fill="url(#ceremony-brass)" stroke="#75451f" strokeWidth="3"/><path d="M-52 589q52-29 104 0-9 22-52 24-43-2-52-24Z" fill="url(#ceremony-brass)" stroke="#75451f" strokeWidth="3"/><path d="M-40 591q40 16 80 0" fill="none" stroke="#f8dfa0" strokeWidth="3"/><path className="deepa-flame" d="M-7 580q-7-17 7-37 12 20 7 37Z" fill="#ef9a42"/><path d="M-2 579q-3-10 2-20 7 11 3 20Z" fill="#fff0a8"/></g>}
function TamilCeremonyScene(){return <div className="garden tamil-ceremony" aria-hidden="true"><div className="ceremony-halo"/><svg className="ceremony-backdrop" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice"><defs><linearGradient id="ceremony-brass" x1="0" x2="1" y2="1"><stop stopColor="#ffe9a1"/><stop offset=".42" stopColor="#c48632"/><stop offset=".72" stopColor="#8c511f"/><stop offset="1" stopColor="#f4d276"/></linearGradient><radialGradient id="kolam-glow"><stop stopColor="#f6ddb0" stopOpacity=".34"/><stop offset="1" stopColor="#f6ddb0" stopOpacity="0"/></radialGradient></defs><ellipse cx="720" cy="832" rx="560" ry="136" fill="url(#kolam-glow)"/><path d="M0 760Q720 690 1440 760V900H0Z" fill="#190f16" opacity=".62"/><path d="M0 777Q720 708 1440 777" fill="none" stroke="#b27c3e" strokeWidth="2" opacity=".6"/><path d="M520 738V456C520 380 920 380 920 456V738" fill="none" stroke="#d4aa68" strokeWidth="3" className="mandapam-frame"/><path d="M536 738V461C536 400 904 400 904 461V738" fill="none" stroke="#f0d7a4" strokeWidth="1.5" className="mandapam-inner"/><path d="M495 737h50m350 0h50M505 717h30m370 0h30" fill="none" stroke="#d9b477" strokeWidth="5" strokeLinecap="round"/><path d="M520 466h22m356 0h22M520 478h22m356 0h22M520 490h22m356 0h22" stroke="#cf9d5a" strokeWidth="2" opacity=".75"/>{Array.from({length:27},(_,i)=>{const a=Math.PI-i*Math.PI/26;const x=720+198*Math.cos(a),y=455-60*Math.sin(a);return <g key={`leaf-${i}`} className="thoranam-leaf" style={{animationDelay:`${1.2+i*.045}s`}} transform={`translate(${x} ${y}) rotate(${(i-13)*5})`}><path d="M0 0q-10-27 4-37q18 17-4 37Z" fill={i%2?'#527542':'#718b4f'} stroke="#d1bc78" strokeWidth=".8"/><path d="M0-2l3-29" stroke="#dce0aa" strokeWidth=".7"/></g>})}{Array.from({length:31},(_,i)=>{const a=Math.PI-i*Math.PI/30;const x=720+205*Math.cos(a),y=456-62*Math.sin(a);return <g key={`malli-${i}`} className="malli-blossom" style={{animationDelay:`${2+i*.035}s`}} transform={`translate(${x} ${y}) scale(${.7+(i%3)*.14})`}>{[0,72,144,216,288].map(rotation=><ellipse key={rotation} cx="0" cy="-5" rx="3.1" ry="5.4" transform={`rotate(${rotation})`} fill="#fff2d6" stroke="#d6b77e" strokeWidth=".7"/>)}<circle r="2.1" fill="#e2bb67"/></g>})}<path d="M605 754Q720 708 835 754M630 766Q720 733 810 766M659 777Q720 754 781 777" fill="none" stroke="#e9d8bd" strokeWidth="2.2" strokeDasharray="3 7" className="kolam-line"/><path d="M720 744c-20 14-28 31-20 42 8 11 20 11 20 25 0-14 12-14 20-25 8-11 0-28-20-42Zm0 17q-20 17 0 31 20-14 0-31Z" fill="none" stroke="#e8ca91" strokeWidth="2" className="kolam-line"/><circle cx="720" cy="792" r="3" fill="#f2dfa9"/><g className="mandapam-pillar" fill="url(#ceremony-brass)" opacity=".8"><path d="M470 430h20v320h-20zM950 430h20v320h-20z"/><path d="M458 420h44v18h-44zm480 0h44v18h-44zM458 737h44v13h-44zm480 0h44v13h-44z"/></g><Deepa x={560} delay={0}/><Deepa x={880} delay={.5}/>{Array.from({length:24},(_,i)=><circle key={`spark-${i}`} className="ceremony-spark" cx={150+(i*173)%1140} cy={180+(i*97)%540} r={i%4===0?2.5:1.5} style={{animationDelay:`${-(i%8)*.7}s`}}/>)}</svg></div>}
function SvgOpening({run,reduced,ready,onOpen}) {
  return <motion.section key={`intro-${run}`} className="intro" aria-label="Blue Tamil engagement opening with Sharon and Ramaniya" exit={{opacity:0,filter:reduced?'none':'blur(12px)',scale:reduced?1:1.035}} transition={{duration:reduced?.2:1.2}}>
    <div className="scene-camera">
      <div className="garden blue-illustration-scene" aria-hidden="true">
        <div className="blue-scene-halo"/>
      </div>
      <div className="actor-depth">
        <div className="opening-couple-motion">
          <div className="opening-couple-atmosphere" aria-hidden="true">
            <i/><i/><i/><i/><i/><i/>
          </div>
          <img className="opening-couple-art" src="/images/blue-couple-opening.png" alt="Sharon and Ramaniya in blue traditional engagement attire, standing together" fetchPriority="high"/>
        </div>
      </div>
    </div>
    <div className="topline"><span><Monogram variant="light" decorative/></span><span>14 · 12 · 2026</span></div>
    <div className="intro-heading"><p className="eyebrow">A TAMIL CELEBRATION OF LOVE</p><h1>S. Sharon <em>&</em> R. Ramaniya</h1><div className="rule">✧</div><p className="occasion">Our Engagement</p><p className="date">14 DECEMBER 2026</p></div>
    <div className={`entry ${ready?'visible':''}`}><button className="primary" onClick={onOpen} disabled={!ready}>View Our Invitation <span>↗</span></button><p>A little moment. A lifetime of love.</p></div>
    <button className="skip" onClick={onOpen}>Skip introduction <span>→</span></button>
    <div className="scene-caption">{ready?'TOGETHER, OUR FOREVER BEGINS':'A BLUE MOMENT, HELD FOREVER'}</div>
  </motion.section>;
}
function App(){
  const reducedPreference=useReducedMotion();
  const [reducedInitial]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const reduced=reducedPreference??reducedInitial;
  const [opened,setOpened]=useState(reducedInitial);
  const [run,setRun]=useState(0);
  const [ready,setReady]=useState(false);
  useEffect(()=>{if(reduced)setOpened(true)},[reduced]);
  useEffect(()=>{setReady(false);if(opened||reduced)return;const timer=setTimeout(()=>setReady(true),12000);return()=>clearTimeout(timer)},[run,opened,reduced]);
  const openInvitation=useCallback(()=>setOpened(true),[]);
  const replay=useCallback(()=>{window.scrollTo({top:0,behavior:'instant'});setRun(r=>r+1);setOpened(!!reduced)},[reduced]);
  return <main className={reduced?'reduce-motion':''}><AnimatePresence mode="wait" initial={false}>
    {opened||reduced?<motion.section key="invitation" className="guest-page-transition" initial={{opacity:reduced?1:0}} animate={{opacity:1}} transition={{duration:reduced?0:.8}}>{!reduced&&<div className="light-sweep" aria-hidden="true"/>}<InvitationPage reduced={reduced} onReplay={replay}/></motion.section>
    :<SvgOpening key={`svg-${run}`} run={run} reduced={reduced} ready={ready} onOpen={openInvitation}/>}
  </AnimatePresence></main>;
}
// Reuse the root when Vite re-evaluates this entry during hot updates.
const root=import.meta.hot?.data.root??createRoot(document.getElementById('root'));
if(import.meta.hot)import.meta.hot.data.root=root;
root.render(<App/>);
