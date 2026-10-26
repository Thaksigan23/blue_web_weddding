// The supplied MP4 is retained, but the active opening uses the shared SVG scene on every screen.
export const mobileOpening = {
  enabled: false,
  src: import.meta.env?.VITE_MOBILE_OPENING_SRC || '/videos/engagement-opening-mobile.mp4',
  poster: '/videos/engagement-opening-mobile-poster.jpg',
  type: 'video/mp4',
  objectPosition: '50% 50%',
  loadTimeoutMs: 2500,
  stallTimeoutMs: 5000,
};
export const MOBILE_OPENING_QUERY = '(max-width: 767.98px)';
export function shouldUseMobileVideo({config, mobile, reduced, failed}) {
  return !!(config.enabled && config.src && mobile && !reduced && !failed);
}
// Kept independent of React so failures/cleanup can be tested without fake media.
export function startOpeningPlayback(video, {onPlaying, onEnded, onFallback, loadTimeoutMs=2500, stallTimeoutMs=5000, src, documentRef=document}) {
  let stopped=false, shown=false, loadTimer, stallTimer, watchdog, previousTime=0;
  const listeners=[];
  const listen=(target,event,handler)=>{target.addEventListener(event,handler);listeners.push(()=>target.removeEventListener(event,handler))};
  const clearTimers=()=>{clearTimeout(loadTimer);clearTimeout(stallTimer);clearInterval(watchdog)};
  const fail=reason=>{if(stopped)return;stopped=true;clearTimers();video.pause();onFallback(reason)};
  const complete=()=>{if(stopped)return;stopped=true;clearTimers();onEnded()};
  const armStall=()=>{if(stopped||documentRef.hidden||stallTimer)return;stallTimer=setTimeout(()=>fail('playback-stalled'),stallTimeoutMs)};
  const progress=()=>{if(video.currentTime>previousTime){previousTime=video.currentTime;clearTimeout(stallTimer);stallTimer=null}};
  const play=()=>{try{Promise.resolve(video.play()).catch(()=>fail('playback-rejected'))}catch{fail('playback-rejected')}};
  listen(video,'error',()=>fail('media-error'));
  listen(video,'ended',complete);
  listen(video,'playing',()=>{if(stopped)return;clearTimeout(loadTimer);progress();if(!shown){shown=true;onPlaying()}});
  listen(video,'timeupdate',progress);
  listen(video,'waiting',armStall);
  listen(video,'stalled',armStall);
  listen(documentRef,'visibilitychange',()=>{
    if(stopped)return;
    if(documentRef.hidden){clearTimeout(stallTimer);stallTimer=null;video.pause()}
    else play();
  });
  loadTimer=setTimeout(()=>fail('loading-timeout'),loadTimeoutMs);
  watchdog=setInterval(()=>{if(!shown||stopped||documentRef.hidden)return;if(video.ended){complete();return}if(video.currentTime>previousTime)progress();else armStall()},1000);
  video.muted=true;video.defaultMuted=true;video.playsInline=true;
  if(src){video.src=src;video.load()} 
  play();
  return ()=>{stopped=true;clearTimers();listeners.forEach(remove=>remove());video.pause();video.removeAttribute('src');video.load()};
}



