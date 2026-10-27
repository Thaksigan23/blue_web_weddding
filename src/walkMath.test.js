import {test} from 'node:test';
import assert from 'node:assert/strict';
import {journey,footTarget,solveJoint,weightShift,PHASES,footContact,ceremonyTimeline,CEREMONY_END} from './walkMath.js';

test('stance soles stay planted in world space and IK preserves bone lengths',()=>{
  for(let distance=0;distance<500;distance+=.2){
    for(let side=0;side<2;side++){
      const foot=footTarget(distance,side), next=footTarget(distance+.01,side);
      if(foot.q<.499&&next.q<.5)assert.ok(Math.abs(distance+foot.x-(distance+.01+next.x))<1e-8);
      const {hip,knee}=solveJoint(foot.x,91-foot.lift,48,48);
      const a=(hip+90)*Math.PI/180,b=a+knee*Math.PI/180;
      assert.ok(Math.abs(48*Math.cos(a)+48*Math.cos(b)-foot.x)<1e-6);
      assert.ok(Math.abs(48*Math.sin(a)+48*Math.sin(b)-(91-foot.lift))<1e-6);
    }
  }
});
test('eight phases alternate weight and travel comes smoothly to rest',()=>{
  assert.equal(PHASES.length,8);
  assert.equal(weightShift(.125),2.5);
  assert.equal(weightShift(.375),-2);
  let last=0;
  for(let t=0;t<9;t+=.01){const j=journey(t);assert.ok(j.progress>=last-1e-9);last=j.progress;}
  assert.ok(Math.abs(journey(5.8).progress-1)<1e-10);
  assert.equal(journey(6).speed,0);
});

test('heel and toe roll preserve the grounded contact point',()=>{
  for(let q=0;q<.5;q+=.001){
    const roll=footContact(q),angle=roll.pitch*Math.PI/180;
    const anchor=roll.pitch<0?-8:15;
    assert.ok(Math.abs(roll.x+anchor*Math.cos(angle)-10*Math.sin(angle)-anchor)<1e-9);
    assert.ok(Math.abs(-roll.lift+anchor*Math.sin(angle)+10*Math.cos(angle)-10)<1e-9);
  }
});

test('ceremony choreography bows, exchanges garlands, and ends joined',()=>{
  const approach=ceremonyTimeline(6),exchange=ceremonyTimeline(8.2),finish=ceremonyTimeline(CEREMONY_END);
  assert.equal(approach.transferVisible,0);
  assert.ok(ceremonyTimeline(6.6).bow>0);
  assert.ok(exchange.raise>0);
  assert.ok(exchange.transferVisible>0);
  assert.equal(finish.raise,0);
  assert.equal(finish.transferVisible,0);
  assert.equal(finish.malas,1);
});
