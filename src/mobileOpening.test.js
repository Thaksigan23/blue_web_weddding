import test from 'node:test';
import assert from 'node:assert/strict';
import {mobileOpening,shouldUseMobileVideo,startOpeningPlayback} from './mobileOpening.js';
const tick=ms=>new Promise(resolve=>setTimeout(resolve,ms));
class FakeVideo extends EventTarget {
  currentTime=0; ended=false; pauses=0; loads=0; plays=0;
  play(){this.plays++;return Promise.resolve()}
  pause(){this.pauses++}
  load(){this.loads++}
  removeAttribute(name){if(name==='src')this.src=''}
}
function setup(options={}){
 const video=new FakeVideo(),doc=new EventTarget();doc.hidden=false;
 const calls=[];const dispose=startOpeningPlayback(video,{src:'/real-file-added-later.mp4',documentRef:doc,onPlaying:()=>calls.push('playing'),onEnded:()=>calls.push('ended'),onFallback:reason=>calls.push(reason),loadTimeoutMs:200,stallTimeoutMs:20,...options});
 return {video,doc,calls,dispose};
}
test('enabled video selection excludes desktop, reduced motion, disabled configuration and failed attempts',()=>{
 assert.equal(mobileOpening.enabled,true);
 const enabled={...mobileOpening,enabled:true};
 for(const conditions of [{config:{...mobileOpening,enabled:false},mobile:true},{config:enabled,mobile:false},{config:enabled,mobile:true,reduced:true},{config:enabled,mobile:true,failed:true},{config:{...enabled,src:''},mobile:true}])assert.equal(shouldUseMobileVideo(conditions),false);
 assert.equal(shouldUseMobileVideo({config:enabled,mobile:true}),true);
});
test('a successful ending opens once and later errors cannot replace it',()=>{
 const s=setup();assert.equal(s.video.src,'/real-file-added-later.mp4');assert.equal(s.video.muted,true);assert.equal(s.video.playsInline,true);
 s.video.dispatchEvent(new Event('playing'));s.video.dispatchEvent(new Event('ended'));s.video.dispatchEvent(new Event('error'));
 assert.deepEqual(s.calls,['playing','ended']);s.dispose();
});
test('rejected autoplay immediately falls back once',async()=>{
 const v=new FakeVideo();v.play=()=>Promise.reject(new Error('NotAllowedError'));
 const calls=[];const doc=new EventTarget();const dispose=startOpeningPlayback(v,{documentRef:doc,onPlaying:()=>{},onEnded:()=>{},onFallback:r=>calls.push(r)});
 await tick(0);v.dispatchEvent(new Event('error'));assert.deepEqual(calls,['playback-rejected']);dispose();
});
test('unavailable or undecodable media falls back; cleanup releases the source',()=>{
 const s=setup();s.video.dispatchEvent(new Event('error'));assert.deepEqual(s.calls,['media-error']);s.dispose();assert.equal(s.video.src,'');assert.ok(s.video.pauses>0);assert.ok(s.video.loads>=2);
});
test('a slow initial load cannot trap guests',async()=>{
 const s=setup({loadTimeoutMs:10});await tick(30);assert.deepEqual(s.calls,['loading-timeout']);s.video.dispatchEvent(new Event('playing'));assert.equal(s.calls.length,1);s.dispose();
});
test('a persistent playback stall falls back, but advancing frames clear the stall timer',async()=>{
 const s=setup();s.video.dispatchEvent(new Event('playing'));s.video.dispatchEvent(new Event('waiting'));s.video.currentTime=1;s.video.dispatchEvent(new Event('timeupdate'));await tick(30);assert.deepEqual(s.calls,['playing']);s.video.dispatchEvent(new Event('waiting'));await tick(30);assert.deepEqual(s.calls,['playing','playback-stalled']);s.dispose();
});
test('background playback pauses, resumes when visible, and unmount suppresses stale callbacks',async()=>{
 const s=setup();s.video.dispatchEvent(new Event('playing'));s.doc.hidden=true;s.doc.dispatchEvent(new Event('visibilitychange'));assert.equal(s.video.pauses,1);s.doc.hidden=false;s.doc.dispatchEvent(new Event('visibilitychange'));assert.equal(s.video.plays,2);s.dispose();s.video.dispatchEvent(new Event('ended'));s.video.dispatchEvent(new Event('error'));await tick(0);assert.deepEqual(s.calls,['playing']);
});

test('the natural ending is driven by ended, never an early time cutoff',()=>{
 const s=setup();s.video.dispatchEvent(new Event('playing'));s.video.currentTime=9.999;s.video.dispatchEvent(new Event('timeupdate'));assert.deepEqual(s.calls,['playing']);s.video.dispatchEvent(new Event('ended'));assert.deepEqual(s.calls,['playing','ended']);s.dispose();
});
