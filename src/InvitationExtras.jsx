import React, {useEffect, useRef, useState} from 'react';
import './invitation-extras.css';

function Icon({name}) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7v10H6V10"/><path d="M9 20v-7h6v7"/></>,
    heart: <path d="M12 21 3.5 12.5C-2 6.5 6 0 12 6c6-6 14 .5 8.5 6.5Z"/>,
    calendar: <><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 2v6m8-6v6M4 11h16m-11 4h1m4 0h1m-6 3h1m4 0h1"/></>,
    gallery: <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="1.5"/><path d="m3 18 6-6 4 4 3-4 5 6"/></>,
    pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    game: <><rect x="3" y="5" width="13" height="16" rx="2"/><path d="M8 2h11a2 2 0 0 1 2 2v13M7 13l3-3 3 3-3 3Z"/></>,
    music: <><path d="M9 18V5l11-2v13M9 8l11-2"/><ellipse cx="6" cy="19" rx="3" ry="2"/><ellipse cx="17" cy="17" rx="3" ry="2"/></>,
    pause: <><path d="M8 4v16m8-16v16"/></>,
    volume: <><path d="M11 4 6 9H2v6h4l5 5Z"/><path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></>,
    whatsapp: <><path d="M21 11.5a9 9 0 0 1-13 8L3 21l1.5-5A9 9 0 1 1 21 11.5Z"/><path d="M8 7c-3 4 5 11 8 7l-3-2-1 1-2-2 1-1Z"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
const links = [
  ['welcome','home','Welcome'], ['introduction','heart','Our invitation'],
  ['celebration','calendar','Ceremony'], ['moments','gallery','Gallery'],
  ['venue','pin','Venue'], ['game','game','Matching game'],
];

export default function InvitationExtras({reduced}) {
  const audio = useRef(null);

  const [playing,setPlaying] = useState(false);


  const [audioError,setAudioError] = useState('');
  const [active,setActive] = useState('welcome');
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
      if (visible.length) setActive(visible[0].target.id);
    }, {rootMargin:'-10% 0px -45% 0px',threshold:0});
    links.forEach(([id]) => {const section=document.getElementById(id);if(section)observer.observe(section)});
    return () => observer.disconnect();
  }, []);
  useEffect(() => {if(audio.current) audio.current.volume=.35}, []);
  const toggleMusic = async () => {
    const player=audio.current;
    if(!player)return;
    if(!player.paused){player.pause();return}
    setAudioError('');
    try{await player.play()}catch{setAudioError('Music could not play. Tap again to retry.')}
  };
  const share = () => {
    const url = new URL(window.location.href);url.hash='';
    window.open(`https://wa.me/?text=${encodeURIComponent(`Join us for S. Sharon & R. Ramaniya’s engagement on 14 December 2026 at 6:00 PM, Concord Grand, Dehiwala. ${url.href}`)}`,'_blank','noopener,noreferrer');
  };
  return <>
    <audio ref={audio} src="/audio/wedding-music.mp3" loop preload="none" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onError={()=>{setPlaying(false);setAudioError('Music is unavailable right now.')}}/>
    {!reduced&&<Butterflies/>}
    <div className="invitation-side-controls">
      <button type="button" className="invitation-round whatsapp-control" onClick={share} aria-label="Share this invitation on WhatsApp" title="Share on WhatsApp"><Icon name="whatsapp"/></button>
    </div>
    <div className="invitation-mobile-dock"><nav aria-label="Quick invitation navigation">{links.map(([id,icon,label])=><a key={id} href={`#${id}`} aria-label={label} title={label} aria-current={active===id?'location':undefined}><Icon name={icon}/></a>)}</nav><button type="button" className={`invitation-round music-control ${playing?'is-playing':''}`} aria-label={playing?'Pause wedding music':'Play wedding music'} aria-pressed={playing} title={playing?'Pause music':'Play music'} onClick={toggleMusic}><Icon name={playing?'pause':'music'}/></button></div>
    {audioError&&<p className="invitation-audio-error" role="status">{audioError}</p>}
  </>;
}

function Butterfly({index}) {
  const [fleeing,setFleeing] = useState(false);
  const timer=useRef(null);
  useEffect(()=>()=>clearTimeout(timer.current),[]);
  const flee=()=>{if(fleeing)return;setFleeing(true);timer.current=setTimeout(()=>setFleeing(false),4200)};
  return <button type="button" className={`blue-butterfly butterfly-${index}${fleeing?' is-fleeing':''}`} onPointerEnter={event=>{if(event.pointerType==='mouse')flee()}} onClick={flee} aria-label="Let the blue butterfly fly away" tabIndex={fleeing?-1:0} aria-disabled={fleeing}>
    <svg viewBox="0 0 60 50" aria-hidden="true"><g className="butterfly-left"><path d="M30 25C12-5-5 1 9 23-2 35 16 49 30 27Z" fill="#6ab9ec"/><path d="M28 24C16 9 8 9 14 22m14 5C17 28 12 35 18 37" fill="none" stroke="#c4e8ff" strokeWidth="1"/></g><g className="butterfly-right"><path d="M30 25C48-5 65 1 51 23c11 12-7 26-21 4Z" fill="#3893ce"/><path d="M32 24C44 9 52 9 46 22m-14 5c11 1 16 8 10 10" fill="none" stroke="#c4e8ff" strokeWidth="1"/></g><path d="M30 32V20m0 1-5-7m5 7 5-7" fill="none" stroke="#153d60" strokeWidth="1.5"/></svg>
  </button>;
}
function Butterflies(){return <div className="invitation-butterflies">{[0,1,2,3,4,5,6,7].map(index=><Butterfly index={index} key={index}/>)}</div>}
