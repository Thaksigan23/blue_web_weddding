import React, {useRef} from 'react';
import {useAnimationFrame} from 'framer-motion';
import {PHASES, journey, solveJoint, footTarget, smooth, weightShift, footContact, ceremonyTimeline, CEREMONY_END} from './walkMath';

function useSkeleton(root,clock,reduced) {
  const cache=useRef(null);
  const garlands=useRef(null);
  const finished=useRef('');
  useAnimationFrame((now)=>{
    if(!root.current)return;
    if(clock.current===null)clock.current=now;
    const t=reduced?CEREMONY_END:(now-clock.current)/1000;
    if(!cache.current){
      cache.current=[...root.current.querySelectorAll('.rig-groom,.rig-bride')].map((person,i)=>({
        x:i*123,gaze:person.querySelector('.rig-gaze'),upper:person.querySelector('.rig-upperbody'),body:person.querySelector('.rig-body'),head:person.querySelector('.rig-head'),
        legs:[...person.querySelectorAll('[data-leg]')].map(leg=>({hip:leg.querySelector('[data-hip]'),knee:leg.querySelector('[data-knee]'),ankle:leg.querySelector('[data-ankle]')})),
        arms:[...person.querySelectorAll('[data-arm]')].map(arm=>({held:arm.dataset.arm==='held',shoulder:arm.querySelector('[data-shoulder]'),elbow:arm.querySelector('[data-elbow]')})),
        hair:[...person.querySelectorAll('.rig-back-hair,.rig-front-hair')],skirt:person.querySelector('.rig-skirt'),dupatta:person.querySelector('.rig-dupatta'),mala:person.querySelector('.rig-mala')
      }));
    }
    if(!garlands.current)garlands.current=[...root.current.querySelectorAll('.exchange-garland')];
    const stage=root.current.closest('.couple-travel');
    const layoutKey=`${window.innerWidth}:${stage.clientWidth}:${stage.clientHeight}:${reduced}`;
    if(t>=CEREMONY_END&&finished.current===layoutKey)return;
    const scale=Math.min(stage.clientWidth/255,stage.clientHeight/290);
    const total=(window.innerWidth/2+stage.clientWidth*.65)/scale;
    const {progress,speed}=journey(t);
    const distance=total*progress, phase=distance/120, theta=phase*Math.PI*2;
    const settle=smooth((t-5.8)/.7),romance=smooth((t-6.1)/.7);
    const ceremony=ceremonyTimeline(t);
    stage.style.transform=`translateX(${-total*(1-progress)*scale}px)`;
    root.current.dataset.phase=t>=9.8?'Garland exchange complete':t>=7?'Garland exchange':settle===1?'Facing each other':PHASES[Math.floor((phase%1)*8)];
    root.current.dataset.progress=progress.toFixed(4);
    cache.current.forEach((rig,index)=>{
      const sway=Math.sin(theta)*1.2*speed;
      const bob=weightShift(phase)*speed-5*settle;
      rig.body.setAttribute('transform',`translate(${sway} ${bob})`);
      const lean=(Math.sin(theta-.35)*.8*speed+romance*(index?-4:4)-ceremony.bow*5)*Math.PI/180;
      rig.upper?.setAttribute('transform',`rotate(${lean*180/Math.PI} 0 160)`);
      rig.legs.forEach((leg,i)=>{
        const target=footTarget(distance,i);
        const roll=footContact(target.q);
        // Place one foot at a time when stopping; never drag a grounded sole.
        const plant=smooth((t-5.8-i*.35)/.35);
        const x=(target.x+roll.x)*(1-plant)-sway;
        const lift=(target.lift+roll.lift)*(1-plant)+7*Math.sin(Math.PI*plant);
        const joint=solveJoint(x,268-lift-bob-177,48,48);
        leg.hip.setAttribute('transform',`rotate(${joint.hip})`);
        leg.knee.setAttribute('transform',`translate(0 48) rotate(${joint.knee})`);
        // Cancel both upstream rotations: a planted sole stays level in world space.
        const pitch=roll.pitch*(1-plant);
        leg.ankle.setAttribute('transform',`translate(0 48) rotate(${-joint.hip-joint.knee+pitch})`);
      });
      rig.arms.forEach(arm=>{
        const side=arm.held?(index?-1:1):(index?1:-1);
        // Both held arms solve to one world-space hand target, even as torsos bob.
        const handX=61.5+2*Math.sin(theta)*speed-rig.x-sway;
        const handY=136+14*ceremony.release-38*ceremony.raise+Math.cos(theta)*speed-bob;
        const x=arm.held?Math.cos(lean)*handX+Math.sin(lean)*(handY-160)-side*23:side*5-14*Math.sin(theta)*speed;
        const y=arm.held?-Math.sin(lean)*handX+Math.cos(lean)*(handY-160)+160-83:67-3*Math.cos(theta)*speed;
        const joint=solveJoint(x,y,35,38);
        arm.shoulder.setAttribute('transform',`rotate(${joint.hip})`);
        arm.elbow.setAttribute('transform',`translate(0 35) rotate(${joint.knee})`);
      });
      rig.gaze?.setAttribute('transform',`translate(${romance*(index?-.8:.4)} 0)`);
      rig.head.setAttribute('transform',`rotate(${romance*(index?-9:7)+ceremony.bow*(index?-5:5)+Math.sin(theta*2-.4)*.6*speed} 0 65)`);
      rig.mala?.setAttribute('opacity',String(ceremony.malas));
      // Phase lag gives cloth and hair inertia while all motion decays with speed.
      rig.hair.forEach(h=>h.setAttribute('transform',`rotate(${Math.sin(theta-.7)*1.7*speed} 0 40)`));
      rig.skirt?.setAttribute('transform',`translate(0 ${-bob*.35}) skewX(${Math.sin(theta-.45)*1.1*speed})`);
      rig.dupatta?.setAttribute('transform',`rotate(${Math.sin(theta-1)*1.8*speed} -20 80)`);
    });
    garlands.current.forEach((garland,index)=>{
      const x=61.5+(index?61.5:-61.5)*ceremony.transfer;
      const y=96-23*ceremony.transfer;
      garland.setAttribute('transform',`translate(${x} ${y})`);
      garland.setAttribute('opacity',String(ceremony.transferVisible*(1-ceremony.malas)));
    });
    stage.style.setProperty('--step-light',String(.25+Math.abs(Math.cos(theta*2))*.3*speed));
    finished.current=t>=CEREMONY_END?layoutKey:'';
  });
}

// Reference-informed vector approximation. This is not a cutout or identity-exact
// reconstruction of the supplied seated portrait. Every moving limb is separate.
function Blossom({x,y,size=1}) {return <g transform={`translate(${x} ${y}) scale(${size})`} fill="none" stroke="#b9d2e6" strokeWidth=".65" opacity=".8"><path d="M0 6V-5M0 3Q-8 1-6-3Q0-3 0 3M0 0Q7-2 6-6Q0-6 0 0M0-4Q-5-7 0-11Q5-7 0-4Z"/><path d="M-2 6q2-2 4 0"/><circle cy="-7" r=".8" fill="#e9f3fa"/></g>}
function NeckMala({className='',opacity=1}) {return <g className={className} opacity={opacity}><path d="M-16 67C-16 82-8 94 0 98C8 94 16 82 16 67" fill="none" stroke="#b98736" strokeWidth="4"/><path d="M-16 67C-16 82-8 94 0 98C8 94 16 82 16 67" fill="none" stroke="#fff2d6" strokeWidth="2.7"/>{[[-16,69],[-15,76],[-12,83],[-8,89],[-4,94],[0,97],[4,94],[8,89],[12,83],[15,76],[16,69]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="2.8" fill={i%3===0?'#dca84b':'#fff9e9'} stroke="#a56d2e" strokeWidth=".5"/><circle cx={x} cy={y} r=".9" fill="#a82a3b"/></g>)}</g>}
function ExchangeGarland({side}) {return <g className="exchange-garland" data-side={side}><path d="M-10-12C-13 0-7 15 0 19C7 15 13 0 10-12" fill="none" stroke="#a87532" strokeWidth="4"/><path d="M-10-12C-13 0-7 15 0 19C7 15 13 0 10-12" fill="none" stroke="#fff1d2" strokeWidth="2.7"/>{[[-10,-9],[-11,-2],[-9,5],[-5,12],[0,17],[5,12],[9,5],[11,-2],[10,-9]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="2.2" fill={i%3===0?'#dba64b':'#fff9e8'} stroke="#98652f" strokeWidth=".45"/>)}<path d="M-2-8l2-3 2 3M-2-3l2-3 2 3" fill="none" stroke="#a52b3c" strokeWidth="1.2"/></g>}
function FaceModelling({bride=false}){return <g><path d={bride?'M-17 32Q-21 47-11 56Q-2 64 8 58Q-8 66-17 49Z':'M-11 32Q-17 44-6 53L1 58Q-9 56-14 45Z'} fill="#996c60" opacity=".23"/><path d={bride?'M-3 33Q1 35-1 45L-3 49Q2 51 4 49':'M14 32Q20 36 17 43L16 47Q20 49 22 46'} fill="#fff0d8" opacity=".36"/><path d={bride?'M-14 48q4 2 7 0M5 48q5 2 9-1':'M3 45q6 2 11-1'} stroke="#9a7267" strokeWidth=".5" opacity=".5" fill="none"/>{!bride&&<g stroke="#69717a" strokeWidth=".35" opacity=".5">{Array.from({length:14},(_,i)=><path key={i} d={`M${-7+i*1.7} ${56+Math.sin(i/13*Math.PI)*7}l-.7-2`}/>)}</g>}</g>}
function DressMaterial(){return <g><path d="M-22 77Q0 65 22 77L24 121Q34 179 54 249Q0 270-53 248L-24 119Z" fill="url(#brocade)" opacity=".2"/><g fill="none" strokeLinecap="round"><path d="M-19 124Q-26 177-45 244M-5 127Q-6 187-19 253M10 125Q19 180 23 253M22 132Q35 204 46 247" stroke="#050f26" strokeWidth="3" opacity=".45"/><path d="M-16 128Q-19 190-36 247M1 127Q6 190 2 257M18 132Q26 200 35 252" stroke="#d4ae62" strokeWidth="1" opacity=".58"/><path d="M-49 244Q0 264 51 245M-51 248Q0 270 53 249" stroke="#e7c675" strokeWidth=".8"/></g>{Array.from({length:17},(_,i)=>{const x=-44+i*5.5,y=248+10*Math.sin(i/16*Math.PI);return <g key={i} transform={`translate(${x} ${y})`} fill="none" stroke="#e1c276" strokeWidth=".55"><path d="M0-5q-5 4 0 6q5-2 0-6ZM-2 4h4"/><circle cy="-1" r=".65" fill="#fff1d2"/></g>})}</g>}
function DressDetail(){return <g fill="none" strokeLinecap="round"><path d="M-21 118Q-28 176-43 245M-10 122Q-5 183-12 255M7 124Q20 192 22 254M20 125Q36 198 44 247" stroke="#e8c46d" strokeWidth=".8" opacity=".6"/><path d="M-16 130Q-19 190-30 249M1 130Q8 203 8 256M19 144Q22 215 32 252" stroke="#020f29" strokeWidth="4" opacity=".3"/><path d="M-43 241Q0 256 44 241M-46 247Q0 264 48 248" stroke="#e8c46d" strokeWidth=".8"/>{Array.from({length:13},(_,i)=><g key={i} transform={`translate(${-39+i*6.5} ${248+8*Math.sin(i/12*Math.PI)})`} stroke="#f0d17b" strokeWidth=".55"><path d="M0-4l2 3-2 3-2-3ZM0-6v-2"/><circle cy="4" r=".6" fill="#fff1d2"/></g>)}<path d="M-18 91Q0 99 18 90M-18 95Q0 104 19 95" stroke="#e8c46d" strokeWidth=".7"/>{[-13,-6,1,8,15].map(x=><Blossom key={x} x={x} y={100-Math.abs(x)*.2} size={.3}/>)}</g>}
function KurtaDetail(){return <g fill="none" strokeLinecap="round"><path d="M-19 91Q-24 123-22 151M-16 126l-5 26M15 118Q23 144 22 172M-21 171Q-3 178 21 171" stroke="#d6ad61" strokeWidth=".75" opacity=".62"/><path d="M-16 106Q-12 130-18 159M13 134l6 33" stroke="#2b0a15" strokeWidth="3" opacity=".3"/><path d="M-25 177Q0 185 25 177M-5 85v86" stroke="#f0d07a" strokeWidth=".55" opacity=".85"/><path d="M-20 78Q-11 84-5 83L18 163 11 177 2 176-18 91Z" fill="#ead7ad" stroke="#ab7a38" strokeWidth="1.2"/><path d="M-16 84 7 172M-11 82 12 171" stroke="#b48542" strokeWidth=".75"/>{[87,101,115,129,143,157].map(y=><g key={y} transform={`translate(-3 ${y})`} stroke="#d3ae67" strokeWidth=".55"><path d="M0-2l2 2-2 2-2-2Z"/></g>)}</g>}
function Legs({girl=false}) {return <g className="rig-legs">{[-1,1].map((side,i)=><g key={side} data-leg={i} transform={`translate(${side*12} 177)`}><g data-hip><path d={girl?"M0 0V48":"M-10-1Q-13 16-9 35L-8 50Q0 54 8 50L10 26Q12 10 10-1Z"} fill={girl?"none":"url(#ivory)"} stroke={girl?"#c8967e":"#b9c5d1"} strokeWidth={girl?10:.4} strokeLinecap="round"/>{!girl&&<path d="M-6 8Q-3 25-6 40M5 11L3 30M-5 43l8-3" stroke="#9aaabd" strokeWidth=".65" opacity=".5" fill="none"/>}<g data-knee transform="translate(0 48)"><path d={girl?"M0 0V48":"M-8-2Q-11 9-8 25L-7 48Q0 51 7 48L8 20Q11 8 8-2Z"} fill={girl?"none":"url(#ivory)"} stroke={girl?"#bd8b76":"#b3c2cf"} strokeWidth={girl?9:.4} strokeLinecap="round"/>{!girl&&<><path d="M-7 37Q0 40 7 37l-1 6Q0 46-7 43Z" fill="#b88b43"/><path d="M-4 39h8M-5 42h10" stroke="#f8e3a8" strokeWidth=".7"/><path d="M-4 9l3 25m-2-14 4 8" stroke="#a6b3bd" fill="none"/></>}<g data-ankle transform="translate(0 48)"><path d="M-8-4q10-2 15 5l8 4q3 5-4 6h-21q-5-4 2-15Z" fill={girl?'#7f9dbb':'#0a1728'}/></g></g></g></g>)}</g>}
function Arm({girl=false,joined=false}) {const side=joined?(girl?-1:1):(girl?1:-1);return <g data-arm={joined?'held':'free'} transform={`translate(${side*23} 83)`}><g data-shoulder><path d="M-8-2Q-11 7-8 20L-6 36Q0 40 7 36L8 13Q10 2 6-3Z" fill={girl?"url(#silk)":"url(#navy)"} stroke="#b98a46" strokeWidth=".4"/><path d="M-5 9L-3 27M4 23l-5 6" stroke="#c29a5b" strokeWidth=".55" opacity=".65"/><g data-elbow transform="translate(0 35)"><path d="M-6-1Q-9 8-6 24L-5 35H5L6 17Q8 5 6-2Z" fill={girl?"url(#silk)":"url(#navy)"} stroke="#9a6937" strokeWidth=".5"/><path d="M-5 26l7-4M-4 30l7-2" stroke="#d4ae69" strokeWidth=".55" opacity=".7"/><path d="M-6 29H6" stroke="#f0d17b" strokeWidth="1.5"/><g transform="translate(0 38)"><path d="M-4-6Q-8 0-4 7Q0 11 5 5L5-4Q1-9-4-6" fill="url(#skin)" stroke="#96685c" strokeWidth=".6"/><path d="M-1 0v5M2-1v5" stroke="#b47e69" strokeWidth=".5"/></g></g></g></g>}
function GroomHead(){return <g className="rig-head groom-head"><g transform="translate(0 65) scale(.58) translate(0 -65)">
  <path d="M-21 34Q-27 14-14 9Q-20-1-7 3Q-2-7 9 1Q25-4 28 11Q37 18 25 34L20 49-18 50Z" fill="url(#groomHair)" stroke="#14222d"/>
  <path d="M-16 30Q-9 20 4 25Q15 29 21 27L21 40L25 47Q24 50 20 50Q18 64 5 66Q-8 64-14 53L-19 47Z" fill="url(#skin)" stroke="#bd8a73" strokeWidth=".7"/>
  <ellipse cx="-15" cy="44" rx="5" ry="7" fill="#d1a087"/><path d="M-17 42q5-3 5 5" fill="none" stroke="#986f60" strokeWidth="1"/>
  <path d="M-12 47Q-5 55 2 51Q9 53 18 50L21 51Q17 68 4 67Q-6 64-11 56Z" fill="#20242a"/>
  <path d="M4 51q7-4 14 0l-3 3-11-1" fill="#25232a"/>
  <path d="M4 37q6-3 12 0" stroke="#30282b" strokeWidth="2" fill="none"/><path d="M5 41q5-4 10 0" stroke="#382d30" strokeWidth="1" fill="#fff5e7"/><g className="rig-gaze"><ellipse cx="12" cy="41" rx="1.8" ry="2.3" fill="#242b34"/><circle cx="12.5" cy="40.5" r=".6" fill="#fff"/></g>
  <path d="M18 42l2 6-4 1M7 57q5 2 9-1" stroke="#956657" strokeWidth=".8" fill="none"/>
  <FaceModelling/><path d="M-18 34Q-16 17-2 20Q11 25 23 14Q33 18 26 28Q16 35 9 28Q-4 22-12 34L-13 45-17 42Z" fill="url(#groomHair)"/>
  <path d="M-15 19Q-4 9 8 14M-10 15Q5 6 19 14M-10 28Q0 23 9 28M-5 55l2 4m2-3 2 5m3-5 1 5m3-6 1 4" stroke="#b5a394" opacity=".28" strokeWidth=".6" fill="none"/><path d="M-17 16Q-3 3 14 13M-18 23Q-6 11 12 18M-10 9Q4 2 19 9" stroke="#46505b" strokeWidth="1.3" fill="none" opacity=".65"/><path d="M-5 28h13M-4 31h11" stroke="#fff0d4" strokeWidth="1.7" strokeLinecap="round"/><circle cx="2" cy="33" r="1.8" fill="#a82a3b"/>
  </g></g>}
function BrideAdornment(){return <g className="bride-adornment" transform="translate(0 65) scale(.58) translate(0 -65)"><path d="M-15 67Q0 86 15 67" fill="none" stroke="#f3d37d" strokeWidth="2.4"/><path d="M-11 71Q0 84 11 71" fill="none" stroke="#a56a2a" strokeWidth="1"/><path d="M0 81q-5 5 0 11 5-6 0-11Z" fill="#d8a340" stroke="#f5d984" strokeWidth="1"/><circle cy="83" r="2" fill="#a52b3a"/><path d="M-18 17Q-5 5 10 14" fill="none" stroke="#c89b4c" strokeWidth="1.7"/>{[-15,-10,-5,0,5,10,15].map((x,i)=><g key={x} transform={`translate(${x} ${14-Math.sin(i/6*Math.PI)*4})`}><circle r="2.2" fill="#fffdf3"/><circle cx="-1" cy="-1.5" r=".8" fill="#fff"/><circle r=".6" fill="#e0b95c"/></g>)}</g>}
function BrideHead(){return <g className="rig-head bride-head"><g transform="translate(0 65) scale(.58) translate(0 -65)">
  <path d="M-21 43Q-26 14-4 9Q23 3 28 30L25 59-18 66Z" fill="url(#brideHair)"/>
  <path d="M-17 29Q-3 19 15 30L19 46Q16 62 2 65Q-11 63-18 48L-22 45Z" fill="url(#skin)" stroke="#b88272" strokeWidth=".6"/>
  <path d="M-18 41q6-4.8 12 0Q-11 46-17 42M2 41q6-5 13 0Q9 46.5 3 43" fill="#fcf8ef" stroke="#634547" strokeWidth=".8"/>
  <g className="rig-gaze"><ellipse cx="-11" cy="42" rx="2.4" ry="2.5" fill="#62483e"/><ellipse cx="8" cy="42" rx="2.7" ry="2.8" fill="#62483e"/><circle cx="-10.5" cy="41" r="1" fill="#fff"/><circle cx="9" cy="41" r="1" fill="#fff"/></g>
  <path d="M-18 35q6-4 11-1M3 34q6-3 12 1M-1 43l-2 7 4 1" stroke="#80574f" strokeWidth=".9" fill="none"/><path d="M-6 56q5-3 10 0-5 5-10 0" fill="#af6f71"/><ellipse cx="-12" cy="51" rx="4" ry="2" fill="#d78f86" opacity=".3"/>
  <FaceModelling bride/><path d="M-23 39Q-27 14-5 10Q12 5 23 21L26 46Q17 37 15 25Q-2 20-14 37L-21 52Z" fill="url(#brideHair)"/>
  <path d="M-5 14Q-16 28-20 34M0 13Q18 15 23 35M4 17Q17 22 18 29" fill="none" stroke="#55505a" strokeWidth="1.2" opacity=".7"/>
  <g className="rig-front-hair"><path d="M19 38Q32 45 23 57Q34 66 24 77Q36 87 24 99" fill="none" stroke="url(#brideHair)" strokeWidth="11"/><path d="M20 44Q28 49 23 57Q32 66 25 74M25 80Q33 89 25 96M18 47Q23 52 20 56" fill="none" stroke="#716a78" strokeWidth=".65" opacity=".55"/></g>
  <path d="M-18 39l-2-2M3 39l-2-2M13 39l2-2M-14 51q3 2 5 0M6 52q3 2 6 0" stroke="#8d5c59" opacity=".5" strokeWidth=".55" fill="none"/>  <path d="M-3 16Q-13 25-17 29M6 14Q19 21 21 30M20 63Q27 68 23 76M23 81Q30 89 25 94" stroke="#8c8490" opacity=".4" strokeWidth=".7" fill="none"/><circle cx="-1" cy="32" r="2.2" fill="#a82a3b"/><g fill="#e6edf4" stroke="#b48741" strokeWidth=".6"><circle cx="-19" cy="48" r="1.8"/><path d="M-19 51l-3 6 3 3 3-3Z" fill="#e8c46d"/><circle cx="18" cy="48" r="1.8"/><path d="M18 51l-3 6 3 3 3-3Z" fill="#e8c46d"/></g>
  </g></g>}
function Person({girl=false,ceremony=false}){return <g transform={`translate(${girl?123:0} 0)`} className={girl?'rig-bride':'rig-groom'}><g className="rig-body">
  {girl&&<path className="rig-back-hair" d="M-15 34Q-30 53-19 65Q-32 81-21 92Q-30 110-19 121L24 123Q39 111 27 98Q41 83 29 70Q37 53 21 33Z" fill="url(#brideHair)"/>}
  <Legs girl={girl}/>{!girl&&<g className="veshti-wrap"><path d="M-25 173Q0 184 25 173L22 194Q0 201-22 194Z" fill="url(#ivory)" stroke="#b88b43" strokeWidth="1.1"/><path d="M-20 177Q0 187 20 177M-18 181Q0 191 18 181M-14 186Q0 194 14 186" fill="none" stroke="#d6b66e" strokeWidth="1"/><path d="M-22 193Q0 200 22 193" fill="none" stroke="#a57632" strokeWidth="1.3"/></g>}<g className="rig-upperbody"><Arm girl={girl}/>
  {girl?<g className="rig-skirt"><path d="M-22 77Q0 65 22 77L24 121Q34 179 54 249Q0 270-53 248L-24 122Z" fill="url(#silk)" stroke="#b98745" strokeWidth=".9"/><path d="M-16 124Q-18 192-34 249M-2 125Q10 200 5 257M15 125Q21 190 39 250" stroke="#d1a85d" strokeWidth="1.5" opacity=".82" fill="none"/>{Array.from({length:24},(_,i)=><Blossom key={i} x={-25+(i%5)*13} y={139+Math.floor(i/5)*23} size={.55+(i%3)*.1}/>)}<DressMaterial/><DressDetail/><path d="M-44 246Q0 261 47 247M-45 250Q0 265 48 251" fill="none" stroke="#e8c46d" strokeWidth="1.2"/><g className="rig-dupatta"><path d="M-21 79Q-9 99 20 136L41 236 27 245Q8 165-26 108Z" fill="#5a101f" stroke="#d6ad61" strokeWidth="1.2"/><path d="M-18 87Q-6 110 25 159L36 232" stroke="#e8c46d" strokeDasharray="2 4" fill="none"/><path d="M-17 89Q-2 119 25 166L34 230M-15 91Q1 119 28 167L37 232" stroke="#e8c46d" strokeWidth=".7" fill="none"/>{[0,1,2,3,4,5].map(i=><Blossom key={i} x={-11+i*7} y={107+i*21} size={.35}/>)}</g><path d="M-17 80Q0 91 19 79L20 87Q0 96-18 87Z" stroke="#d1a95e" fill="#711426" strokeWidth="1.3"/></g>:<g><path d="M-23 75Q-9 68 0 70Q12 68 24 77L29 178Q0 190-30 178Z" fill="url(#navy)" stroke="#b98745" strokeWidth=".9"/><path d="M-8 71l8 12 9-12-3-7H-5Z" fill="#5b101f" stroke="#d8b15e" strokeWidth=".9"/><path d="M0 83v94M-22 96l4 70M21 97l-3 72" stroke="#d6ae65" opacity=".6" fill="none"/>{[91,111,131,151,171].map(y=><circle key={y} cy={y} cx="2" r="1.8" fill="#f1d081"/>)}<path d="M8 108h12" stroke="#e2c36f"/><KurtaDetail/></g>}
  <NeckMala className="rig-mala" opacity={ceremony?1:0}/><path d="M-6 60v13q6 6 13 0V59" fill="url(#skin)"/>{girl?<><BrideHead/><BrideAdornment/></>:<GroomHead/>}<Arm girl={girl} joined/>
  </g></g></g>}
export default function WalkingCouple({reduced=false}){const root=useRef();const clock=useRef(null);
  useSkeleton(root,clock,reduced);
  return <svg ref={root} className="couple-rig reference-rig" viewBox="-65 -6 255 290" role="img" aria-label="Sharon and Ramaniya in blue traditional engagement attire, walking together, bowing, exchanging jasmine garlands, and joining hands"><defs>
  <radialGradient id="skin" cx=".62" cy=".35" r=".8"><stop stopColor="#f0c8a9"/><stop offset=".55" stopColor="#d8a487"/><stop offset="1" stopColor="#ac7766"/></radialGradient><pattern id="brocade" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0l4 4M4 0L0 4" stroke="#98b2cd" strokeWidth=".16"/></pattern>
  <linearGradient id="navy" gradientUnits="userSpaceOnUse" x1="-30" y1="0" x2="30" y2="0"><stop stopColor="#0d2947"/><stop offset=".48" stopColor="#174b78"/><stop offset="1" stopColor="#0b213c"/></linearGradient>
  <linearGradient id="silk" gradientUnits="userSpaceOnUse" x1="-45" y1="0" x2="45" y2="0"><stop stopColor="#12315a"/><stop offset=".45" stopColor="#24578d"/><stop offset=".72" stopColor="#1a416f"/><stop offset="1" stopColor="#10294d"/></linearGradient>
  <linearGradient id="ivory" gradientUnits="userSpaceOnUse" x1="-12" y1="0" x2="12" y2="0"><stop stopColor="#d6c7a6"/><stop offset=".4" stopColor="#fff7df"/><stop offset="1" stopColor="#e9ddbd"/></linearGradient>
  <linearGradient id="groomHair" x2=".6" y2="1"><stop stopColor="#121e29"/><stop offset=".5" stopColor="#29323b"/><stop offset="1" stopColor="#111f2a"/></linearGradient>
  <linearGradient id="brideHair"><stop stopColor="#271f24"/><stop offset=".45" stopColor="#2d2930"/><stop offset=".65" stopColor="#20212b"/><stop offset="1" stopColor="#1d2029"/></linearGradient>
  </defs><Person/><Person girl/><ExchangeGarland side="groom"/><ExchangeGarland side="bride"/></svg>}

export function TamilCoupleIllustration(){return <svg className="traditional-couple-illustration" viewBox="-65 -6 255 290" role="img" aria-label="Tamil engagement couple in blue traditional attire after exchanging floral garlands"><defs>
  <radialGradient id="skin" cx=".62" cy=".35" r=".8"><stop stopColor="#f0c8a9"/><stop offset=".55" stopColor="#d8a487"/><stop offset="1" stopColor="#ac7766"/></radialGradient><pattern id="brocade" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0l4 4M4 0L0 4" stroke="#d7a94f" strokeWidth=".16"/></pattern>
  <linearGradient id="navy" gradientUnits="userSpaceOnUse" x1="-30" y1="0" x2="30" y2="0"><stop stopColor="#0d2947"/><stop offset=".48" stopColor="#174b78"/><stop offset="1" stopColor="#0b213c"/></linearGradient>
  <linearGradient id="silk" gradientUnits="userSpaceOnUse" x1="-45" y1="0" x2="45" y2="0"><stop stopColor="#12315a"/><stop offset=".45" stopColor="#24578d"/><stop offset=".72" stopColor="#1a416f"/><stop offset="1" stopColor="#10294d"/></linearGradient>
  <linearGradient id="ivory" gradientUnits="userSpaceOnUse" x1="-12" y1="0" x2="12" y2="0"><stop stopColor="#d6c7a6"/><stop offset=".4" stopColor="#fff7df"/><stop offset="1" stopColor="#e9ddbd"/></linearGradient>
  <linearGradient id="groomHair" x2=".6" y2="1"><stop stopColor="#121e29"/><stop offset=".5" stopColor="#29323b"/><stop offset="1" stopColor="#111f2a"/></linearGradient>
  <linearGradient id="brideHair"><stop stopColor="#271f24"/><stop offset=".45" stopColor="#2d2930"/><stop offset=".65" stopColor="#20212b"/><stop offset="1" stopColor="#1d2029"/></linearGradient>
  </defs><Person ceremony/><Person girl ceremony/></svg>}
