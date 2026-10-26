import React, {useRef} from 'react';
import {useAnimationFrame} from 'framer-motion';
import {PHASES, journey, solveJoint, footTarget, smooth, weightShift} from './walkMathFallback';

function useSkeleton(root,clock,reduced) {
  const cache=useRef(null);
  const finished=useRef('');
  useAnimationFrame((now)=>{
    if(!root.current)return;
    if(clock.current===null)clock.current=now;
    const t=reduced?8:(now-clock.current)/1000;
    if(!cache.current){
      cache.current=[...root.current.querySelectorAll('.rig-groom,.rig-bride')].map((person,i)=>({
        x:i*123,body:person.querySelector('.rig-body'),head:person.querySelector('.rig-head'),
        legs:[...person.querySelectorAll('[data-leg]')].map(leg=>({hip:leg.querySelector('[data-hip]'),knee:leg.querySelector('[data-knee]'),ankle:leg.querySelector('[data-ankle]')})),
        arms:[...person.querySelectorAll('[data-arm]')].map(arm=>({held:arm.dataset.arm==='held',shoulder:arm.querySelector('[data-shoulder]'),elbow:arm.querySelector('[data-elbow]')})),
        hair:[...person.querySelectorAll('.rig-back-hair,.rig-front-hair')],skirt:person.querySelector('.rig-skirt'),dupatta:person.querySelector('.rig-dupatta')
      }));
    }
    const stage=root.current.closest('.couple-travel');
    const layoutKey=`${window.innerWidth}:${stage.clientWidth}:${stage.clientHeight}:${reduced}`;
    if(t>=7&&finished.current===layoutKey)return;
    const scale=Math.min(stage.clientWidth/255,stage.clientHeight/290);
    const total=(window.innerWidth/2+stage.clientWidth*.65)/scale;
    const {progress,speed}=journey(t);
    const distance=total*progress, phase=distance/80, theta=phase*Math.PI*2;
    const settle=smooth((t-5.8)/.7),romance=smooth((t-6.1)/.7);
    stage.style.transform=`translateX(${-total*(1-progress)*scale}px)`;
    root.current.dataset.phase=settle===1?'Romantic standing':PHASES[Math.floor((phase%1)*8)];
    root.current.dataset.progress=progress.toFixed(4);
    cache.current.forEach((rig,index)=>{
      const sway=Math.sin(theta)*1.2*speed;
      const bob=weightShift(phase)*speed-5*settle;
      rig.body.setAttribute('transform',`translate(${sway} ${bob})`);
      rig.legs.forEach((leg,i)=>{
        const target=footTarget(distance,i);
        // Place one foot at a time when stopping; never drag a grounded sole.
        const plant=smooth((t-5.8-i*.35)/.35);
        const x=target.x*(1-plant)-sway;
        const lift=target.lift*(1-plant)+7*Math.sin(Math.PI*plant);
        const joint=solveJoint(x,268-lift-bob-177,48,48);
        leg.hip.setAttribute('transform',`rotate(${joint.hip})`);
        leg.knee.setAttribute('transform',`translate(0 48) rotate(${joint.knee})`);
        // Cancel both upstream rotations: a planted sole stays level in world space.
        const pitch=target.q<.5?0:8*Math.sin((target.q-.5)*Math.PI*2)*(1-settle);
        leg.ankle.setAttribute('transform',`translate(0 48) rotate(${-joint.hip-joint.knee+pitch})`);
      });
      rig.arms.forEach(arm=>{
        const side=arm.held?(index?-1:1):(index?1:-1);
        // Both held arms solve to one world-space hand target, even as torsos bob.
        const x=arm.held?61.5+2*Math.sin(theta)*speed-rig.x-sway-side*23:side*5-14*Math.sin(theta)*speed;
        const y=arm.held?130+Math.cos(theta)*speed-bob-83:67-3*Math.cos(theta)*speed;
        const joint=solveJoint(x,y,35,38);
        arm.shoulder.setAttribute('transform',`rotate(${joint.hip})`);
        arm.elbow.setAttribute('transform',`translate(0 35) rotate(${joint.knee})`);
      });
      rig.head.setAttribute('transform',`rotate(${romance*(index?-7:5)} 0 65)`);
      // Phase lag gives cloth and hair inertia while all motion decays with speed.
      rig.hair.forEach(h=>h.setAttribute('transform',`rotate(${Math.sin(theta-.7)*1.7*speed} 0 40)`));
      rig.skirt?.setAttribute('transform',`translate(0 ${-bob*.35}) skewX(${Math.sin(theta-.45)*1.1*speed})`);
      rig.dupatta?.setAttribute('transform',`rotate(${Math.sin(theta-1)*1.8*speed} -20 80)`);
    });
    stage.style.setProperty('--step-light',String(.25+Math.abs(Math.cos(theta*2))*.3*speed));
    finished.current=t>=7?layoutKey:'';
  });
}

// Reference-informed vector approximation. This is not a cutout or identity-exact
// reconstruction of the supplied seated portrait. Every moving limb is separate.
function Blossom({x,y,size=1}) {
  return <g transform={`translate(${x} ${y}) scale(${size})`} fill="#b9cbd9" opacity=".75">
    {[0,72,144,216,288].map(a=><ellipse key={a} cx="0" cy="-3" rx="1.1" ry="2.7" transform={`rotate(${a})`}/>)}
    <circle r="1" fill="#edf5fc"/>
  </g>;
}
function DressDetail(){return <g fill="none" strokeLinecap="round"><path d="M-21 118Q-28 176-43 245M-10 122Q-5 183-12 255M7 124Q20 192 22 254M20 125Q36 198 44 247" stroke="#7facc6" strokeWidth=".7" opacity=".4"/><path d="M-16 130Q-19 190-30 249M1 130Q8 203 8 256M19 144Q22 215 32 252" stroke="#020f29" strokeWidth="4" opacity=".3"/><path d="M-43 241Q0 256 44 241M-46 247Q0 264 48 248" stroke="#c3d4e5" strokeWidth=".7"/>{Array.from({length:13},(_,i)=><g key={i} transform={`translate(${-39+i*6.5} ${248+8*Math.sin(i/12*Math.PI)})`} stroke="#c8daeb" strokeWidth=".45"><path d="M0-4l2 3-2 3-2-3ZM0-6v-2"/><circle cy="4" r=".6" fill="#d6e4ee"/></g>)}<path d="M-18 91Q0 99 18 90M-18 95Q0 104 19 95" stroke="#9bbbd2" strokeWidth=".6"/>{[-13,-6,1,8,15].map(x=><Blossom key={x} x={x} y={100-Math.abs(x)*.2} size={.3}/>)}</g>}
function KurtaDetail(){return <g fill="none" strokeLinecap="round"><path d="M-19 91Q-24 123-22 151M-16 126l-5 26M15 118Q23 144 22 172M-21 171Q-3 178 21 171" stroke="#789bb5" strokeWidth=".65" opacity=".5"/><path d="M-16 106Q-12 130-18 159M13 134l6 33" stroke="#020e24" strokeWidth="3" opacity=".3"/><path d="M-25 177Q0 185 25 177M-5 85v86" stroke="#a6bdd0" strokeWidth=".45" opacity=".7"/>{[87,101,115,129,143,157].map(y=><g key={y} transform={`translate(-3 ${y})`} stroke="#abc4d5" strokeWidth=".4"><path d="M0-2l2 2-2 2-2-2Z"/></g>)}</g>}
function Legs({girl=false}) {return <g className="rig-legs">{[-1,1].map((side,i)=><g key={side} data-leg={i} transform={`translate(${side*12} 177)`}><g data-hip><path d="M0 0V48" stroke={girl?'#c8967e':'url(#ivory)'} strokeWidth={girl?10:21} strokeLinecap="round"/><g data-knee transform="translate(0 48)"><path d="M0 0V48" stroke={girl?'#bd8b76':'url(#ivory)'} strokeWidth={girl?9:18} strokeLinecap="round"/>{!girl&&<path d="M-4 9l3 25m-2-14 4 8" stroke="#a6b3bd" fill="none"/>}<g data-ankle transform="translate(0 48)"><path d="M-8-4q10-2 15 5l8 4q3 5-4 6h-21q-5-4 2-15Z" fill={girl?'#7f9dbb':'#0a1728'}/></g></g></g></g>)}</g>}
function Arm({girl=false,joined=false}) {const side=joined?(girl?-1:1):(girl?1:-1);return <g data-arm={joined?'held':'free'} transform={`translate(${side*23} 83)`}><g data-shoulder><path d="M0 0V35" stroke={girl?'url(#silk)':'url(#navy)'} strokeWidth={girl?13:17} strokeLinecap="round"/><g data-elbow transform="translate(0 35)"><path d="M0 0V36" stroke={girl?'#163e60':'#10324d'} strokeWidth={girl?11:14} strokeLinecap="round"/><path d="M-6 29H6" stroke="#9cbdcf" strokeWidth="1.5"/><g transform="translate(0 38)"><path d="M-4-6Q-8 0-4 7Q0 11 5 5L5-4Q1-9-4-6" fill="url(#skin)" stroke="#96685c" strokeWidth=".6"/><path d="M-1 0v5M2-1v5" stroke="#b47e69" strokeWidth=".5"/></g></g></g></g>}
function GroomHead(){return <g className="rig-head groom-head">
  <path d="M-21 34Q-27 14-14 9Q-20-1-7 3Q-2-7 9 1Q25-4 28 11Q37 18 25 34L20 49-18 50Z" fill="url(#groomHair)" stroke="#14222d"/>
  <path d="M-16 30Q-9 20 4 25Q15 29 21 27L21 40L25 47Q24 50 20 50Q18 64 5 66Q-8 64-14 53L-19 47Z" fill="url(#skin)" stroke="#bd8a73" strokeWidth=".7"/>
  <ellipse cx="-15" cy="44" rx="5" ry="7" fill="#d1a087"/><path d="M-17 42q5-3 5 5" fill="none" stroke="#986f60" strokeWidth="1"/>
  <path d="M-12 47Q-5 55 2 51Q9 53 18 50L21 51Q17 68 4 67Q-6 64-11 56Z" fill="#20242a"/>
  <path d="M4 51q7-4 14 0l-3 3-11-1" fill="#25232a"/>
  <path d="M4 37q6-3 12 0" stroke="#30282b" strokeWidth="2" fill="none"/><path d="M5 41q5-4 10 0" stroke="#382d30" strokeWidth="1" fill="#fff5e7"/><ellipse cx="12" cy="41" rx="1.8" ry="2.3" fill="#242b34"/><circle cx="12.5" cy="40.5" r=".6" fill="#fff"/>
  <path d="M18 42l2 6-4 1M7 57q5 2 9-1" stroke="#956657" strokeWidth=".8" fill="none"/>
  <path d="M-18 34Q-16 17-2 20Q11 25 23 14Q33 18 26 28Q16 35 9 28Q-4 22-12 34L-13 45-17 42Z" fill="url(#groomHair)"/>
  <path d="M-15 19Q-4 9 8 14M-10 15Q5 6 19 14M-10 28Q0 23 9 28M-5 55l2 4m2-3 2 5m3-5 1 5m3-6 1 4" stroke="#b5a394" opacity=".28" strokeWidth=".6" fill="none"/><path d="M-17 16Q-3 3 14 13M-18 23Q-6 11 12 18M-10 9Q4 2 19 9" stroke="#46505b" strokeWidth="1.3" fill="none" opacity=".65"/>
  </g>}
function BrideHead(){return <g className="rig-head bride-head">
  <path d="M-21 43Q-26 14-4 9Q23 3 28 30L25 59-18 66Z" fill="url(#brideHair)"/>
  <path d="M-17 29Q-3 19 15 30L19 46Q16 62 2 65Q-11 63-18 48L-22 45Z" fill="url(#skin)" stroke="#b88272" strokeWidth=".6"/>
  <path d="M-18 41q6-7 12 0Q-11 48-17 42M2 41q6-7 13 0Q9 49 3 43" fill="#fcf8ef" stroke="#634547" strokeWidth=".8"/>
  <ellipse cx="-11" cy="42" rx="2.4" ry="3.5" fill="#62483e"/><ellipse cx="8" cy="42" rx="2.7" ry="3.8" fill="#62483e"/><circle cx="-10.5" cy="41" r="1" fill="#fff"/><circle cx="9" cy="41" r="1" fill="#fff"/>
  <path d="M-18 35q6-4 11-1M3 34q6-3 12 1M-1 43l-2 7 4 1" stroke="#80574f" strokeWidth=".9" fill="none"/><path d="M-6 56q5-3 10 0-5 5-10 0" fill="#af6f71"/><ellipse cx="-12" cy="51" rx="4" ry="2" fill="#d78f86" opacity=".3"/>
  <path d="M-23 39Q-27 14-5 10Q12 5 23 21L26 46Q17 37 15 25Q-2 20-14 37L-21 52Z" fill="url(#brideHair)"/>
  <path d="M-5 14Q-16 28-20 34M0 13Q18 15 23 35M4 17Q17 22 18 29" fill="none" stroke="#846153" strokeWidth="1.2" opacity=".7"/>
  <path d="M19 38Q32 45 23 57Q34 66 24 77Q36 87 24 99" className="rig-front-hair" fill="none" stroke="url(#brideHair)" strokeWidth="11"/>
  <path d="M-18 39l-2-2M3 39l-2-2M13 39l2-2M-14 51q3 2 5 0M6 52q3 2 6 0" stroke="#8d5c59" opacity=".5" strokeWidth=".55" fill="none"/><path d="M-3 16Q-13 25-17 29M6 14Q19 21 21 30M20 63Q27 68 23 76M23 81Q30 89 25 94" stroke="#b09079" opacity=".4" strokeWidth=".7" fill="none"/><g fill="#e6edf4" stroke="#9fbdcd" strokeWidth=".5"><circle cx="-19" cy="48" r="1.8"/><path d="M-19 51l-3 6 3 3 3-3Z"/><circle cx="18" cy="48" r="1.8"/><path d="M18 51l-3 6 3 3 3-3Z"/></g>
  </g>}
function Person({girl=false}){return <g transform={`translate(${girl?123:0} 0)`} className={girl?'rig-bride':'rig-groom'}><g className="rig-body">
  {girl&&<path className="rig-back-hair" d="M-15 34Q-30 53-19 65Q-32 81-21 92Q-30 110-19 121L24 123Q39 111 27 98Q41 83 29 70Q37 53 21 33Z" fill="url(#brideHair)"/>}
  <Legs girl={girl}/><Arm girl={girl}/>
  {girl?<g className="rig-skirt"><path d="M-22 77Q0 65 22 77L24 121Q32 170 52 249Q0 265-49 248L-24 122Z" fill="url(#silk)" stroke="#426783" strokeWidth=".7"/><path d="M-16 124Q-18 192-34 249M-2 125Q10 200 5 257M15 125Q21 190 39 250" stroke="#48718e" strokeWidth="1.5" opacity=".7" fill="none"/>{Array.from({length:24},(_,i)=><Blossom key={i} x={-25+(i%5)*13} y={139+Math.floor(i/5)*23} size={.55+(i%3)*.1}/>)}<DressDetail/><path d="M-44 246Q0 261 47 247M-45 250Q0 265 48 251" fill="none" stroke="#95afc5" strokeWidth="1"/><g className="rig-dupatta"><path d="M-21 79Q-9 99 20 136L41 236 27 245Q8 165-26 108Z" fill="#143a59" stroke="#93afc5"/><path d="M-18 87Q-6 110 25 159L36 232" stroke="#7395b0" strokeDasharray="2 4" fill="none"/><path d="M-17 89Q-2 119 25 166L34 230M-15 91Q1 119 28 167L37 232" stroke="#c3d8e8" strokeWidth=".5" fill="none"/>{[0,1,2,3,4,5].map(i=><Blossom key={i} x={-11+i*7} y={107+i*21} size={.35}/>)}</g><path d="M-17 80Q0 91 19 79L20 87Q0 96-18 87Z" stroke="#b1bdcd" fill="#133957" strokeWidth="1.3"/></g>:<g><path d="M-23 75Q-9 68 0 70Q12 68 24 77L29 178Q0 190-30 178Z" fill="url(#navy)" stroke="#3c617c" strokeWidth=".7"/><path d="M-8 71l8 12 9-12-3-7H-5Z" fill="#0c2a41" stroke="#61819a" strokeWidth=".7"/><path d="M0 83v94M-22 96l4 70M21 97l-3 72" stroke="#55718a" opacity=".5" fill="none"/>{[91,111,131,151,171].map(y=><circle key={y} cy={y} cx="2" r="1.8" fill="#a5b8c7"/>)}<path d="M8 108h12" stroke="#607f98"/><KurtaDetail/></g>}
  <path d="M-6 60v13q6 6 13 0V59" fill="url(#skin)"/>{girl?<BrideHead/>:<GroomHead/>}<Arm girl={girl} joined/>
  </g></g>}
export default function WalkingCouple({reduced=false}){const root=useRef();const clock=useRef(null);
  useSkeleton(root,clock,reduced);
  return <svg ref={root} className="couple-rig reference-rig" viewBox="-65 -6 255 290" role="img" aria-label="Reference-inspired articulated couple in navy traditional clothes; vector approximation of the original portrait"><defs>
  <linearGradient id="skin"><stop stopColor="#d09b7d"/><stop offset=".5" stopColor="#f0c2a3"/><stop offset="1" stopColor="#d69d81"/></linearGradient>
  <linearGradient id="navy" gradientUnits="userSpaceOnUse" x1="-30" y1="0" x2="30" y2="0"><stop stopColor="#062138"/><stop offset=".5" stopColor="#123f5c"/><stop offset="1" stopColor="#08253d"/></linearGradient>
  <linearGradient id="silk" gradientUnits="userSpaceOnUse" x1="-45" y1="0" x2="45" y2="0"><stop stopColor="#08263f"/><stop offset=".45" stopColor="#164663"/><stop offset=".72" stopColor="#0b304f"/><stop offset="1" stopColor="#071f36"/></linearGradient>
  <linearGradient id="ivory" gradientUnits="userSpaceOnUse" x1="-12" y1="0" x2="12" y2="0"><stop stopColor="#becbd3"/><stop offset=".4" stopColor="#f3f3ef"/><stop offset="1" stopColor="#d5dfe4"/></linearGradient>
  <linearGradient id="groomHair" x2=".6" y2="1"><stop stopColor="#121e29"/><stop offset=".5" stopColor="#29323b"/><stop offset="1" stopColor="#111f2a"/></linearGradient>
  <linearGradient id="brideHair"><stop stopColor="#271f24"/><stop offset=".45" stopColor="#543c36"/><stop offset=".65" stopColor="#392c2e"/><stop offset="1" stopColor="#1d2029"/></linearGradient>
  </defs><Person/><Person girl/></svg>}
