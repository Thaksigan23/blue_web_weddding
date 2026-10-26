import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';

const source=path.resolve('public/characters/groom_reference.png');
const out=path.resolve('artifacts/groom-preparation');
fs.mkdirSync(path.join(out,'layers'),{recursive:true});
const hash=()=>crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex');
const originalHash=hash();
// Bounds are in the supplied 1536x1024 source. Pivots are hand-estimated,
// explicitly unverified; no generated or repainted pixels enter these cutouts.
const specs=[
 ['head-left',[330,45,155,215],[405,217],[0,65],.22,'head',70,'head-neck-collar composite; separate collar and repaint hidden neck',true],
 ['head-front',[482,55,117,212],[542,224],[0,65],.22,'head',70,'alternate view only; not a matching head-turn animation',false],
 ['head-right',[599,45,147,221],[668,218],[0,65],.22,'head',70,'alternate view only; neck/collar merged',false],
 ['head-back',[750,55,138,208],[821,220],[0,65],.22,'head',70,'alternate view only; no independently separated hair',false],
 ['torso-front',[898,35,201,300],[1004,78],[0,70],.42,'upper-body',50,'includes attached sleeve; repaint clean shoulder, armpit, pelvis and coat overlap',true],
 ['torso-back',[1099,30,168,306],[1180,76],[0,70],.42,'upper-body',20,'back view differs from front; shoulder and pelvis overlap unverified',false],
 ['coat-left',[1265,40,140,291],[1324,63],[0,112],.39,'upper-body',45,'isolated coat reference; attachment and hidden waist require repaint',false],
 ['coat-right',[1404,40,127,292],[1453,63],[0,112],.39,'upper-body',46,'isolated coat reference; attachment and hidden waist require repaint',false],
 ['sleeve-left-upper-reference',[362,400,108,210],[410,425],[-23,83],.33,'upper-arm-left',30,'bent complete sleeve includes elbow and cuff; not a clean upper-arm bone skin',false],
 ['sleeve-left-lower-reference',[493,399,87,213],[527,421],[0,35],.29,'forearm-left',31,'contains a long sleeve section and cuff; elbow cut and hidden fill missing',false],
 ['sleeve-right-upper-reference',[605,402,118,209],[651,425],[23,83],.33,'upper-arm-right',60,'bent complete sleeve includes elbow and cuff; not a clean upper-arm bone skin',false],
 ['sleeve-right-lower-reference',[727,407,139,172],[750,433],[0,35],.29,'forearm-right',61,'angled cuffed sleeve; matching elbow attachment requires reconstruction',false],
 ['hand-left-relaxed',[878,411,94,173],[935,490],[0,38],.16,'forearm-left',65,'cuff included; wrist seam, anatomy side and contact pose need verification',true],
 ['hand-right-relaxed',[976,411,95,176],[1019,488],[0,38],.16,'forearm-right',66,'cuff included; wrist seam, anatomy side and contact pose need verification',true],
 ['hands-hold-reference',[1086,416,191,170],[1186,515],[61.5,136],.16,'pair-world',80,'two fused hands; cannot use as a separated groom hand; redraw holding pose and wrist',false],
 ['hand-left-open',[1280,413,119,174],[1330,490],[0,38],.16,'forearm-left',65,'alternative hand pose; includes cuff; fingers must remain intact',false],
 ['hand-right-open',[1433,412,91,175],[1476,486],[0,38],.16,'forearm-right',66,'alternative hand pose; includes cuff; verify wrist orientation',false],
 ['thigh-left',[347,697,96,265],[396,718],[-12,177],48/228,'hip-left',10,'visible trouser section only; hidden hip and knee caps/8-unit overlap missing',true],
 ['shin-left',[478,727,80,236],[515,745],[0,48],48/198,'knee-left',11,'open cut ends; hidden knee and ankle overlap missing',true],
 ['thigh-right',[610,696,101,267],[664,716],[12,177],48/228,'hip-right',12,'visible trouser section only; hidden hip and knee caps/8-unit overlap missing',true],
 ['shin-right',[754,724,84,238],[794,744],[0,48],48/198,'knee-right',13,'open cut ends; hidden knee and ankle overlap missing',true],
 ['shoe-left-side',[875,706,165,96],[993,745],[0,48],.14,'ankle-left',14,'intact isolated shoe; facing left; rest angle/heel/toe need registration',true],
 ['shoe-right-side',[1064,705,156,97],[1106,744],[0,48],.14,'ankle-right',15,'intact isolated shoe; rest angle/heel/toe need registration',true],
 ['shoes-front-reference',[880,838,161,119],[959,866],[0,48],.14,'ankle',15,'one isolated front-view shoe; alternative view, not a side-view walking foot',false],
 ['shoes-back-reference',[1061,840,133,114],[1125,868],[0,48],.14,'ankle',15,'one isolated back-view shoe; alternative view, not a side-view walking foot',false]
];
const decoded=spawnSync('ffmpeg',['-v','error','-i',source,'-frames:v','1','-f','rawvideo','-pix_fmt','rgba','pipe:1'],{maxBuffer:16e6});
if(decoded.status!==0)throw new Error('Cannot decode master');
const raw=decoded.stdout,W=1536,H=1024,owners=new Int32Array(W*H),queue=new Int32Array(W*H),components=new Map();let componentId=0;
for(let p=0;p<W*H;p++){if(owners[p]||raw[p*4+3]<32)continue;const id=++componentId;let a=0,z=0;queue[z++]=p;owners[p]=id;let x0=W,y0=H,x1=0,y1=0;while(a<z){const k=queue[a++],x=k%W,y=(k/W)|0;x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);for(const n of [x?k-1:-1,x<W-1?k+1:-1,y?k-W:-1,y<H-1?k+W:-1])if(n>=0&&!owners[n]&&raw[n*4+3]>=32){owners[n]=id;queue[z++]=n;}}components.set(id,{area:z,bounds:[x0,y0,x1-x0+1,y1-y0+1]});}
// Recover up to three pixels of original low-alpha antialiasing, without
// joining separately labeled components or inventing colors/foreground.
for(let pass=0;pass<3;pass++){const next=new Int32Array(owners);for(let p=0;p<W*H;p++){if(owners[p]||!raw[p*4+3])continue;const x=p%W,y=(p/W)|0;for(const n of [x?p-1:-1,x<W-1?p+1:-1,y?p-W:-1,y<H-1?p+W:-1])if(n>=0&&owners[n]){next[p]=owners[n];break;}}owners.set(next);}
const selected={'head-left':7,'head-right':8,'head-back':9,'torso-front':4,'coat-left':6,'sleeve-left-upper-reference':23,'sleeve-left-lower-reference':22,'sleeve-right-upper-reference':24,'sleeve-right-lower-reference':25,'hand-left-relaxed':26,'hand-right-relaxed':27,'hands-hold-reference':30,'hand-left-open':29,'hand-right-open':28,'thigh-left':44,'shin-left':50,'thigh-right':45,'shin-right':49,'shoe-left-side':47,'shoe-right-side':46,'shoes-front-reference':55,'shoes-back-reference':59};
const renamed={'head-left':'heads-left-front-merged-reference','torso-front':'torsos-front-back-merged-reference','coat-left':'coat-panels-merged-reference','shoes-front-reference':'shoe-left-front-reference','shoes-back-reference':'shoe-left-back-reference'};
const merged=new Set(['head-left','torso-front','coat-left']);
const layers=[];

for(const [originalId,unusedBounds,pivot,target,scale,parent,order,originalIssue,originalAssemble] of specs){
  const selectedId=selected[originalId];if(!selectedId)continue;
  const id=renamed[originalId]||originalId;
  const issue=merged.has(originalId)?'Source parts touch/overlap in one alpha component; retained together as reference ONLY; repaint independent parts':originalIssue;
  const assemble=originalAssemble&&!merged.has(originalId);
  const cb=components.get(selectedId).bounds;const bx=Math.max(0,cb[0]-4),by=Math.max(0,cb[1]-4);
  const bounds=[bx,by,Math.min(W,bx+cb[2]+8)-bx,Math.min(H,by+cb[3]+8)-by];
  const localTarget=/^(hip|knee|ankle|upper-arm)-/.test(parent)||parent.startsWith('forearm-')&&originalId.startsWith('sleeve-')?[0,0]:target;
  const [x,y,w,h]=bounds,file=`layers/${id}.png`;
  const rgba=Buffer.alloc(w*h*4);for(let py=0;py<h;py++)for(let px=0;px<w;px++){const sp=(y+py)*W+x+px,dp=(py*w+px)*4;raw.copy(rgba,dp,sp*4,sp*4+4);if(owners[sp]!==selectedId)rgba[dp+3]=0;}
  const result=spawnSync('ffmpeg',['-v','error','-y','-f','rawvideo','-pixel_format','rgba','-video_size',w+'x'+h,'-i','pipe:0','-frames:v','1','-c:v','png',path.join(out,file)],{input:rgba,maxBuffer:4e6});
  if(result.status!==0)throw new Error(result.stderr.toString());
  let transparent=0,visible=0,edge=0,minA=255,maxA=0;
  for(let n=0;n<rgba.length;n+=4){const a=rgba[n+3],p=n/4,px=p%w,py=Math.floor(p/w);minA=Math.min(minA,a);maxA=Math.max(maxA,a);if(a===0)transparent++;if(a>16){visible++;if(px===0||py===0||px===w-1||py===h-1)edge++;}}
  layers.push({id,file,sourceBoundsPx:{x,y,width:w,height:h},pixelDimensions:{width:w,height:h},sourcePivotPx:{x:pivot[0],y:pivot[1]},pivotInLayerPx:{x:pivot[0]-x,y:pivot[1]-y},parentBone:parent,drawOrder:order,registration:{status:'provisional-not-verified',uniformScale:scale,targetPivotInParent:{x:localTarget[0],y:localTarget[1]},boundsInParent:{x:localTarget[0]+(x-pivot[0])*scale,y:localTarget[1]+(y-pivot[1])*scale,width:w*scale,height:h*scale},rotationDegrees:0,requiredOverlapLogical:8,verifiedOverlapLogical:0},extraction:{method:'original-alpha connected-component isolation, source RGB retained, 3px antialias recovery; no generated pixels',transparentPixels:transparent,visiblePixels:visible,minAlpha:minA,maxAlpha:maxA,visiblePixelsOnCropBoundary:edge,needsCropReview:edge>0},rigReady:false,blockers:[issue],previewAssembly:assemble});
}
if(hash()!==originalHash)throw new Error('Source master changed');
const manifest={schemaVersion:1,status:'INCOMPLETE_DO_NOT_ACTIVATE',enabled:false,source:{file:'public/characters/groom_reference.png',sha256:originalHash,width:1536,height:1024,originalPreserved:true},coordinateSystem:{viewBox:[-65,-6,255,290],units:'existing SVG logical units',note:'Raster pixels use positive y down. Left/right names follow source labels, not verified anatomical sides.'},registrationVerified:false,bones:{body:{parent:null,translation:[0,0]},'upper-body':{parent:'body',rotationPivot:[0,160]},head:{parent:'upper-body',rotationPivot:[0,65]},'hip-left':{parent:'body',translation:[-12,177]},'hip-right':{parent:'body',translation:[12,177]},'knee-left':{parent:'hip-left',translation:[0,48]},'knee-right':{parent:'hip-right',translation:[0,48]},'ankle-left':{parent:'knee-left',translation:[0,48]},'ankle-right':{parent:'knee-right',translation:[0,48]},'upper-arm-left':{parent:'upper-body',translation:[-23,83]},'upper-arm-right':{parent:'upper-body',translation:[23,83]},'forearm-left':{parent:'upper-arm-left',translation:[0,35]},'forearm-right':{parent:'upper-arm-right',translation:[0,35]}},missing:['separate neck','separate front/back hair','clean torso with no attached sleeves','pelvis/hidden coat base','true separated upper arms and forearms with joint caps','independent connected-hand pose','hidden hip/knee/ankle fill','verified heel/toe and rest-angle landmarks'],layers};
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));
const byId=id=>layers.find(l=>l.id===id);
const image=(id,x,y,rotation=0)=>{const l=byId(id),s=l.registration.uniformScale,p=l.pivotInLayerPx;return `<g transform="translate(${x} ${y}) rotate(${rotation}) scale(${s})"><image href="data:image/png;base64,${fs.readFileSync(path.join(out,l.file)).toString('base64')}" x="${-p.x}" y="${-p.y}" width="${l.pixelDimensions.width}" height="${l.pixelDimensions.height}"/></g>`};
// A diagnostic rest assembly, deliberately showing gaps/attached sleeve problems.
// Approximate knee/ankle rest positions are shown, not claimed as verified IK.
const assembled=[image('thigh-left',-12,177),image('thigh-right',12,177),image('shin-left',-12,225),image('shin-right',12,225),image('shoe-left-side',-12,268),image('shoe-right-side',12,268),image('head-right',0,65),image('hand-left-relaxed',-32,154),image('hand-right-relaxed',32,154)].join('');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="720" height="950" viewBox="-80 -25 160 340"><rect x="-80" y="-25" width="160" height="340" fill="#061735"/><g fill="none" stroke="#f2a164" stroke-width=".6" stroke-dasharray="2 2"><path d="M-23 83L-32 118L-32 154M23 83L32 118L32 154M-23 75H23L29 177H-29Z"/></g>${assembled}<g fill="#fbad6c" stroke="#fbad6c" stroke-width=".35">${[[-23,83],[23,83],[-12,177],[12,177],[-12,225],[12,225],[-12,268],[12,268],[0,65]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.4"/><path d="M${x-3} ${y}h6M${x} ${y-3}v6"/>`).join('')}</g><text x="0" y="-14" fill="#e8f2ff" font-size="4" text-anchor="middle">INCOMPLETE REST ASSEMBLY — NOT ANIMATION READY</text><text x="0" y="300" fill="#fbad6c" font-size="3.5" text-anchor="middle">Dashed torso/arms are MISSING. Head is an alternate view. Provisional only.</text></svg>`;
fs.writeFileSync(path.join(out,'assembled-preview.svg'),svg);
const cards=layers.map(l=>`<figure><img src="${l.file}"/><figcaption>${l.id}<br/><small>${l.blockers[0]}</small></figcaption></figure>`).join('');
fs.writeFileSync(path.join(out,'preview.html'),`<!doctype html><html><head><meta charset="UTF-8"><title>Groom preparation — incomplete</title><style>body{margin:24px;background:#0b1b30;color:#e6f1ff;font:14px system-ui}h1{font-size:23px}.assembly{height:540px;max-width:100%}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px}figure{margin:0;background:repeating-conic-gradient(#253950 0 25%,#1a2c42 0 50%) 0/18px 18px;padding:12px}figure img{display:block;margin:auto;max-width:100%;height:220px;object-fit:contain}figcaption{background:#10243a;padding:8px}small{color:#b6cce1}strong{color:#ffbd81}</style></head><body><h1>Groom layer preparation</h1><p><strong>INCOMPLETE — DO NOT ACTIVATE.</strong> Original pixels and alpha preserved. Registration is provisional; no hidden anatomy was invented.</p><img class="assembly" src="assembled-preview.svg"/><h2>Extracted components and references</h2><div class="cards">${cards}</div></body></html>`);
fs.writeFileSync(path.join(out,'alpha-components.json'),JSON.stringify([...components].filter(([,c])=>c.area>400).map(([id,c])=>({id,...c})),null,2));
console.log(JSON.stringify({output:out,count:layers.length,sourceUnchanged:true,boundaryReview:layers.filter(l=>l.extraction.needsCropReview).map(l=>l.id)}));
