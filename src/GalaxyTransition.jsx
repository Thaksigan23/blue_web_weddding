import React, {useEffect, useRef} from 'react';
import {motion} from 'framer-motion';
import './galaxy-transition.css';

const DURATION=2400;

export default function GalaxyTransition({onComplete}) {
  const canvas=useRef(null);
  useEffect(()=>{
    let frame,completed=false;
    const finish=()=>{if(!completed){completed=true;onComplete()}};
    // Arrival is independent of canvas support and background-tab frame throttling.
    const deadline=setTimeout(finish,DURATION+100);
    let context;
    try{context=canvas.current?.getContext('2d')}catch{}
    if(!context)return()=>clearTimeout(deadline);
    let width,height,stars=[];
    const resize=()=>{
      width=window.innerWidth;height=window.innerHeight;
      const ratio=Math.min(window.devicePixelRatio||1,1.5);
      canvas.current.width=Math.round(width*ratio);canvas.current.height=Math.round(height*ratio);
      context.setTransform(ratio,0,0,ratio,0,0);
      stars=Array.from({length:Math.min(620,Math.max(320,Math.round(width*height/1000)))},()=>({x:(Math.random()-.5)*width*2,y:(Math.random()-.5)*height*2,z:100+Math.random()*1200,warm:Math.random()<.12}));
    };
    resize();window.addEventListener('resize',resize);
    let start,last;
    const draw=now=>{
      if(completed)return;
      if(start===undefined){start=now;last=now}
      const progress=Math.min(1,(now-start)/DURATION);
      const delta=Math.min(34,now-last);last=now;
      const speed=.2+3.5*Math.sin(progress*Math.PI);
      const focal=Math.min(width,height)*.78;
      const angle=progress*.16;
      context.clearRect(0,0,width,height);
      context.save();context.translate(width/2,height/2);context.rotate(angle);
      for(const star of stars){
        const previous=star.z;star.z-=delta*speed;
        const x=star.x/star.z*focal,y=star.y/star.z*focal;
        if(star.z<30||Math.abs(x)>width||Math.abs(y)>height){star.z=1200;star.x=(Math.random()-.5)*width*2;star.y=(Math.random()-.5)*height*2;continue}
        const tail=Math.min(36,1+progress*28);
        const tx=star.x/(previous+tail)*focal,ty=star.y/(previous+tail)*focal;
        const alpha=Math.min(.85,.15+(1-star.z/1300)*.7);
        context.strokeStyle=star.warm?`rgba(223,197,142,${alpha})`:`rgba(159,211,249,${alpha})`;
        context.lineWidth=Math.max(.5,1.8-star.z/900);
        context.beginPath();context.moveTo(tx,ty);context.lineTo(x,y);context.stroke();
      }
      context.restore();
      if(progress>=1)finish();else frame=requestAnimationFrame(draw);
    };
    frame=requestAnimationFrame(draw);
    return()=>{completed=true;clearTimeout(deadline);cancelAnimationFrame(frame);window.removeEventListener('resize',resize)};
  },[onComplete]);
  return <motion.div className="galaxy-transition" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.8,ease:[.4,0,.2,1]}} role="status" aria-label="Opening your invitation">
    <div className="galaxy-floral" aria-hidden="true"/><div className="galaxy-nebula" aria-hidden="true"/>
    <canvas ref={canvas} aria-hidden="true"/><div className="galaxy-portal" aria-hidden="true"/>
    <p className="galaxy-caption" aria-hidden="true">Through the stars,<br/><em>to our beautiful beginning.</em></p>
  </motion.div>;
}
