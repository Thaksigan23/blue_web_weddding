export const PHASES = ['Left contact','Left down','Left passing','Left up','Right contact','Right down','Right passing','Right up'];
export const CEREMONY_END = 11.6;
const clamp = (x,a=0,b=1)=>Math.min(b,Math.max(a,x));
export const smooth = x=>{x=clamp(x);return x*x*(3-2*x)};
export function ceremonyTimeline(t) {
  return {
    bow:smooth((t-6.25)/.35)*(1-smooth((t-6.85)/.35)),
    face:smooth((t-6.2)/.8),
    release:smooth((t-6.35)/.45)*(1-smooth((t-9.2)/.55)),
    raise:smooth((t-7)/.65)*(1-smooth((t-8.75)/.65)),
    transfer:smooth((t-7.45)/1.15),
    transferVisible:smooth((t-7.25)/.35)*(1-smooth((t-9.1)/.4)),
    malas:smooth((t-8.5)/.6)
  };
}
export function weightShift(phase){
  const positions=[0,2.5,0,-2,0,2.5,0,-2,0];
  const frame=((phase%1+1)%1)*8,index=Math.floor(frame);
  return positions[index]+(positions[index+1]-positions[index])*smooth(frame-index);
}
// Integrated trapezoidal speed: acceleration, cruise, then a long deceleration.
// Root motion and foot phase use this SAME distance, including during slowdown.
export function journey(t) {
  const u=clamp(t-1,0,4.8), a=.4, decel=1.2, end=4.8, cruiseEnd=end-decel;
  const area=end-(a+decel)/2;
  let distance=u<a?u*u/(2*a):u<cruiseEnd?u-a/2:cruiseEnd-a/2+(u-cruiseEnd)-(u-cruiseEnd)**2/(2*decel);
  return {progress:clamp(distance/area),speed:u<a?u/a:u<cruiseEnd?1:clamp((end-u)/decel)};
}
// Two-bone IK in SVG coordinates; lengths remain constant at every phase.
export function solveJoint(x,y,l1,l2) {
  const d=clamp(Math.hypot(x,y),.001,l1+l2-.001);
  const knee=Math.acos(clamp((d*d-l1*l1-l2*l2)/(2*l1*l2),-1,1));
  const hip=Math.atan2(y,x)-Math.atan2(l2*Math.sin(knee),l1+l2*Math.cos(knee));
  return {hip:hip*180/Math.PI-90,knee:knee*180/Math.PI};
}
export function footTarget(distance,side) {
  const q=((distance/120+side*.5)%1+1)%1;
  // A planted foot travels backwards locally exactly as fast as the root moves
  // forwards. Swing uses smooth interpolation and clears the ground mid-step.
  const swing=clamp((q-.5)*2);
  return {x:q<.5?30-120*q:-30+60*smooth(swing),lift:q<.5?0:16*Math.sin(Math.PI*swing)**2,q};
}

// Roll about the heel at contact and the toe before lift-off. Offset the ankle
// so the selected contact point stays fixed rather than skating during rotation.
export function footContact(q) {
  const pitch=q<.1?-8*(1-smooth(q/.1)):q>.4&&q<.5?14*smooth((q-.4)/.1):q>=.5?8*Math.sin((q-.5)*Math.PI*2):0;
  if(q>=.5)return {pitch,x:0,lift:0};
  const angle=pitch*Math.PI/180,anchor=pitch<0?-8:15;
  return {pitch,x:anchor-(anchor*Math.cos(angle)-10*Math.sin(angle)),lift:anchor*Math.sin(angle)+10*Math.cos(angle)-10};
}
