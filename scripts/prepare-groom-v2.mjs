import fs from 'node:fs';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {PHASES} from '../src/walkMath.js';
const source='public/characters/Groom Character Rig Asset Sheet.png',out='artifacts/groom-v2-preparation';
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const hash=sha(source),W=1536,H=1024;
const raw=spawnSync('ffmpeg',['-v','error','-i',source,'-frames:v','1','-f','rawvideo','-pix_fmt','rgba','pipe:1'],{maxBuffer:16e6}).stdout;
if(raw.length!==W*H*4)throw Error('Unexpected source dimensions');
const owner=new Int32Array(W*H),q=new Int32Array(W*H),components=new Map();let id=0;
for(let p=0;p<W*H;p++){if(owner[p]||raw[p*4+3]<220)continue;const label=++id;let a=0,z=0;q[z++]=p;owner[p]=label;let x0=W,y0=H,x1=0,y1=0;while(a<z){const k=q[a++],x=k%W,y=(k/W)|0;x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);for(const n of [x?k-1:-1,x<W-1?k+1:-1,y?k-W:-1,y<H-1?k+W:-1])if(n>=0&&!owner[n]&&raw[n*4+3]>=220){owner[n]=label;q[z++]=n;}}components.set(label,{area:z,bounds:[x0,y0,x1-x0+1,y1-y0+1]});}
for(let pass=0;pass<2;pass++){const next=new Int32Array(owner);for(let p=0;p<W*H;p++){if(owner[p]||raw[p*4+3]<64)continue;const x=p%W,y=(p/W)|0;for(const n of [x?p-1:-1,x<W-1?p+1:-1,y?p-W:-1,y<H-1?p+W:-1])if(n>=0&&owner[n]){next[p]=owner[n];break;}}owner.set(next);}
// Component IDs are derived reproducibly from the exact source SHA and threshold.
// Parent-local pivots remain provisional; no source art is stretched or redrawn.
const specs=[
 ['head-front',11,[651,210],'head',[0,65],.22,70,'Clean visible front head; neck root and overlay compatibility unverified.'],
 ['head-3q-right',7,[795,199],'head',[0,65],.22,70,'Desired right-looking head is newly isolated; scalp/neck hidden coverage unverified.'],
 ['head-3q-left',4,[963,203],'head',[0,65],.22,70,'Alternate view; neck/collar remains merged.'],
 ['head-back',6,[1100,200],'head',[0,65],.22,70,'Alternate head/back view; not a front-facing hair skin.'],
 ['hair-front',17,[657,288],'head',[0,30],.22,72,'Separate hair drawing exists; root and fit to three-quarter head unverified.'],
 ['hair-back',18,[813,350],'head',[0,45],.22,65,'Separate hair exists; perspective/root registration unverified.'],
 ['neck-collar',20,[967,324],'upper-body',[0,65],.22,45,'Neck is merged with collar/beard cutoff; no complete hidden neck surface.'],
 ['collar-detail',19,[1120,320],'upper-body',[0,72],.2,55,'Rectangular painted detail reference, not an isolated collar skin.'],
 ['torso-front-with-sleeves',31,[92,514],'upper-body',[0,70],.48,50,'Front torso still includes complete sleeves. Cannot independently articulate shoulders/elbows.'],
 ['torso-back',32,[232,521],'upper-body',[0,70],.48,20,'Back view exists; sleeve edges and shoulder coverage still unverified.'],
 ['coat-front-left',37,[348,530],'upper-body',[-6,112],.34,47,'Visible coat panel; hidden waist connection/embroidery continuity unverified.'],
 ['coat-front-right',36,[427,530],'upper-body',[6,112],.34,48,'Visible coat panel; hidden waist connection/embroidery continuity unverified.'],
 ['pelvis-with-coat',41,[532,532],'body',[0,151],.25,25,'New pelvis drawing includes blue coat panels and shorts. Hip caps and cloth separation unverified.'],
 ['sleeve-left-upper-reference',34,[641,523],'upper-arm-left',[0,0],.34,30,'Upper-arm drawing still includes a long sleeve and cuff; elbow cap not a verified upper-arm skin.'],
 ['sleeve-left-forearm-with-hand',38,[720,527],'forearm-left',[0,0],.3,31,'Forearm, cuff and fist fused; independent wrist not available.'],
 ['sleeve-right-upper-reference',33,[951,521],'upper-arm-right',[0,0],.34,60,'Long upper sleeve includes embroidered cuff; shoulder/elbow overlaps unverified.'],
 ['sleeve-right-forearm',42,[1031,539],'forearm-right',[0,0],.3,61,'Visible forearm section exists; elbow/wrist hidden coverage unverified.'],
 ['hands-left-hold-pair',35,[826,575],'pair-world',[61.5,136],.2,80,'Two joined hands remain fused; not a groom-only layer.'],
 ['hand-right-relaxed',39,[1106,605],'forearm-right',[0,38],.16,68,'Individual relaxed hand and cuff available; wrist seam/perspective unverified.'],
 ['hand-right-hold',40,[1176,592],'forearm-right',[0,38],.16,69,'Individual curled hand exists; no independent front/back grip occlusion or bride contact registration.'],
 ['thigh-left',65,[55,813],'hip-left',[0,0],48/149,10,'Visible white cloth intact; hip/knee overlap is not supplied.'],
 ['shin-left',66,[140,815],'knee-left',[0,0],48/149,11,'Open knee/ankle cut ends; no painted hidden joint caps.'],
 ['thigh-right',67,[354,813],'hip-right',[0,0],48/149,12,'Visible white cloth intact; hip/knee overlap not verified.'],
 ['shin-right',69,[441,815],'knee-right',[0,0],48/149,13,'Open ends and hidden joint fill missing.'],
 ['shoe-left-side',70,[674,813],'ankle-left',[0,0],.22,14,'Complete side shoe but points left; matched walking perspective/contact landmarks unverified.'],
 ['shoe-right-side',71,[762,813],'ankle-right',[0,0],.22,15,'Complete side shoe points right; not an approved matched pair.']
];
const layers=[];
for(const [name,label,pivot,parent,target,scale,order,notes] of specs){
 const component=components.get(label);if(!component)throw Error('Missing component '+name);
 let [x,y,w,h]=component.bounds;
 // Exclude the text below torso drawings, never label the remaining composite a clean rig skin.
 if(name==='torso-front-with-sleeves')h=Math.min(h,724-y);
 x=Math.max(0,x-4);y=Math.max(0,y-4);w=Math.min(W-x,w+8);h=Math.min(H-y,h+8);
 const rgba=Buffer.alloc(w*h*4);let visible=0,border=0;
 for(let py=0;py<h;py++)for(let px=0;px<w;px++){const sp=(y+py)*W+x+px,dp=(py*w+px)*4;raw.copy(rgba,dp,sp*4,sp*4+4);if(owner[sp]!==label||(name==='torso-front-with-sleeves'&&y+py>=722)||(name.startsWith('shoe-')&&y+py>=861)||(name==='collar-detail'&&y+py>=374))rgba[dp+3]=0;if(rgba[dp+3]){visible++;if(!px||!py||px===w-1||py===h-1)border++;}}
 const file='layers/'+name+'.png';const encoded=spawnSync('ffmpeg',['-v','error','-y','-f','rawvideo','-pixel_format','rgba','-video_size',w+'x'+h,'-i','pipe:0','-frames:v','1',out+'/'+file],{input:rgba,maxBuffer:4e6});if(encoded.status)throw Error(encoded.stderr.toString());
 layers.push({id:name,file,sourceComponent:label,sourceBoundsPx:{x,y,width:w,height:h},pixelDimensions:{width:w,height:h},sourcePivotPx:{x:pivot[0],y:pivot[1]},pivotInLayerPx:{x:pivot[0]-x,y:pivot[1]-y},parentBone:parent,drawOrder:order,registration:{verified:false,uniformScale:scale,targetPivotInParent:{x:target[0],y:target[1]},boundsInParent:{x:target[0]+(x-pivot[0])*scale,y:target[1]+(y-pivot[1])*scale,width:w*scale,height:h*scale},rotationDegrees:0},extraction:{status:'candidate-matte-review-required',method:'source-alpha core >=220 plus 2px adjacent original edge alpha >=64; no redrawn RGB',visiblePixels:visible,transparentPixels:w*h-visible,visiblePixelsOnBoundary:border,noLabelsVerified:true,matteArtistApproved:false,sourceRegionLimited:name==='torso-front-with-sleeves'},rigReady:false,notes});
}
const v1=JSON.parse(fs.readFileSync('artifacts/groom-preparation/manifest.json'));
const priorHand=v1.layers.find(l=>l.id==='hand-left-relaxed');
const inherited=structuredClone(priorHand);inherited.id='hand-left-relaxed-v1';inherited.file='layers/hand-left-relaxed-v1.png';inherited.sourceMasterFile='public/characters/groom_reference.png';inherited.sourceMasterSha256=v1.source.sha256;inherited.notes='Reused v1 relaxed hand without redraw or mirroring. Lighting, cuff overlap and anatomical-side matching to v2 are unverified.';inherited.registration.verified=false;inherited.rigReady=false;fs.copyFileSync('artifacts/groom-preparation/'+priorHand.file,out+'/'+inherited.file);layers.push(inherited);
const prior=JSON.parse(fs.readFileSync('artifacts/groom-preparation/audit/validation.json'));
const assessment=prior.requiredArtwork.map(n=>{let status='still-required',detail=n.reason;
 if(/head-3q/.test(n.file)){status='new-visible-candidate';detail='Isolated desired head is now present; hidden neck/scalp coverage and registration not verified.';}
 else if(/hair-/.test(n.file)){status='new-visible-candidate';detail='Independent hair drawings added; perspective and hidden roots must be fitted to the chosen head.';}
 else if(/neck/.test(n.file)){status='partial';detail='Neck view exists but is fused with collar and beard cutoff; complete hidden neck still required.';}
 else if(/pelvis/.test(n.file)){status='partial';detail='New lower-torso/shorts drawing exists with baked coat panels. Complete separable pelvis/hip caps are not proven.';}
 else if(/coat-front/.test(n.file)){status='new-visible-candidate';detail='Separate visible panels now present; hidden waist surfaces and embroidered seam alignment remain unverified.';}
 else if(/coat-back/.test(n.file)){detail='No separate rear coat hem layer is provided.';}
 else if(/torso/.test(n.file)){status='partial';detail='Torso illustrations exist, but complete sleeves/side edges remain baked in. Require sleeve-free matching skins.';}
 else if(/upper-arm/.test(n.file)){status='partial';detail='Long cuffed sleeve references exist, not verified shoulder-to-elbow skins with hidden caps.';}
 else if(/forearm/.test(n.file)){status='partial';detail='Visible forearm references exist. Left includes a fused fist; elbow/wrist overlap missing.';}
 else if(/hold/.test(n.file)){status='partial';detail='A single curled right hand is added; split palm/finger occlusion and joined contact are not supplied or verified.';}
 else if(/thigh|shin/.test(n.file)){status='reusable-visible-art-needs-repaint';detail='White trouser pixels can be reused; hidden hip/knee/ankle surfaces and joint overlaps are still open/unverified.';}
 else if(/shoe/.test(n.file)){status='reusable-visible-art-needs-registration';detail='Individual shoes available but side views point opposite ways; matched perspective and heel/toe registration are unverified.';}
 return {...n,status,detail};});
const manifest={schemaVersion:2,status:'INCOMPLETE_DO_NOT_ACTIVATE',enabled:false,source:{requestedName:'public/characters/groom_rig_v2.png',actualFile:source,width:W,height:H,sha256:hash,originalPreserved:true,warning:'Requested filename absent. Newer uploaded sheet used under actual name. Text claiming 24 individual transparent PNGs is not evidence.'},registrationVerified:false,bones:JSON.parse(fs.readFileSync('artifacts/groom-preparation/manifest.json')).bones,layers,previousChecklistComparison:assessment,standing:{status:'provisional-composite-only',passesRigCompleteness:false,reason:'Torso has baked sleeves; pelvis contains coat; wrist/neck/joint coverage unresolved.'},walking:PHASES.map(phase=>({phase,status:'not-run-standing-rig-incomplete'})),romanticStop:{status:'not-run-standing-rig-incomplete'}};
fs.writeFileSync(out+'/manifest.json',JSON.stringify(manifest,null,2));
const draw=(name,x,y)=>{const l=layers.find(l=>l.id===name),p=l.pivotInLayerPx;return `<g transform="translate(${x} ${y}) scale(${l.registration.uniformScale})"><image href="data:image/png;base64,${fs.readFileSync(out+'/'+l.file).toString('base64')}" x="${-p.x}" y="${-p.y}" width="${l.pixelDimensions.width}" height="${l.pixelDimensions.height}"/></g>`};
const assembly=[draw('thigh-left',-12,177),draw('thigh-right',12,177),draw('shin-left',-12,225),draw('shin-right',12,225),draw('shoe-left-side',-12,268),draw('shoe-right-side',12,268),draw('pelvis-with-coat',0,151),draw('torso-front-with-sleeves',0,70),draw('neck-collar',0,65),draw('head-3q-right',0,65),draw('hand-left-relaxed-v1',-32,142),draw('hand-right-relaxed',32,142)].join('');
// The left hand is reused from v1, never duplicated or mirrored from the v2 right hand.
const preview=`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="-90 -25 180 340"><rect x="-90" y="-25" width="180" height="340" fill="#061735"/><text x="0" y="-14" fill="#e8f2ff" font-size="4" text-anchor="middle">V2 PROVISIONAL COMPOSITE — NOT AN ANIMATION SKIN</text>${assembly}<g fill="none" stroke="#ffbf7e" stroke-width=".4" stroke-dasharray="1 2"><path d="M-23 83L-32 118L-32 154M23 83L32 118L32 154"/>${[[-23,83],[23,83],[-12,177],[12,177],[-12,225],[12,225],[-12,268],[12,268],[0,65]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.5"/>`).join('')}</g><text x="0" y="298" fill="#ffbf7e" font-size="3" text-anchor="middle">Baked sleeves, neck/coat seams and unverified wrist joins remain.</text><text x="0" y="306" fill="#ffbf7e" font-size="3" text-anchor="middle">Uniform scales only. All pivots and matte edges require inspection.</text></svg>`;
fs.writeFileSync(out+'/standing-preview.svg',preview);
const cards=layers.map(l=>`<figure><img src="${l.file}"><figcaption>${l.id}<small>${l.notes}</small></figcaption></figure>`).join('');
const contact=layers.map(l=>`<figure><img src="${l.file}"><figcaption>${l.id}</figcaption></figure>`).join('');
fs.writeFileSync(out+'/contact-sheet.html',`<!doctype html><html><head><meta charset="UTF-8"><title>V2 PNG matte review</title><style>body{margin:12px;background:#09182b;color:#e5f0ff;font:11px system-ui}main{display:grid;grid-template-columns:repeat(7,1fr);gap:8px}figure{margin:0;background:linear-gradient(90deg,#eef2f8 50%,#16314c 50%);padding:6px}img{width:100%;height:150px;object-fit:contain}figcaption{background:#0b2038;font-size:10px;padding:5px;min-height:28px;overflow-wrap:anywhere}</style></head><body><h2>Source-pixel PNG candidates — edge and label review</h2><p>Light/dark backgrounds expose fringe and unwanted matte. These are not approved animation layers.</p><main>${contact}</main></body></html>`);
fs.writeFileSync(out+'/index.html',`<!doctype html><html><head><meta charset="UTF-8"><title>Groom v2 inspection</title><style>body{margin:24px;background:#0b1b30;color:#e5f0ff;font:14px system-ui;line-height:1.5}h1{font-size:24px}strong{color:#ffc083}.standing{height:650px}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px}figure{margin:0;padding:12px;background:repeating-conic-gradient(#30445b 0 25%,#172b41 0 50%) 0/16px 16px}figure img{width:100%;height:240px;object-fit:contain}figcaption{background:#10243a;padding:10px}small{display:block;color:#bbd0e3}a{color:#a7d9ff}</style></head><body><h1>Groom v2: artwork additions, not yet a complete rig</h1><p><strong>DO NOT ACTIVATE.</strong> Source: Groom Character Rig Asset Sheet.png. Provisional matte candidates; no source RGB has been repainted.</p><img class="standing" src="standing-preview.svg"><p>The torso already contains sleeves. This preview cannot establish independent articulation; the left relaxed hand is reused from v1 without mirroring; wrist and cuff compatibility are still unverified.</p><h2>Comparison with every prior missing item</h2><ol>${assessment.map(a=>`<li><b>${a.file}: ${a.status}</b><br>${a.detail}</li>`).join('')}</ol><h2>Transparent candidate exports</h2><div class="cards">${cards}</div></body></html>`);
fs.writeFileSync(out+'/MISSING_ARTWORK.md','# Groom v2 assessment — incomplete\n\nActual file: `'+source+'`. The requested `groom_rig_v2.png` is absent. No runtime assets or prior registration have been changed.\n\n'+assessment.map(a=>`- **${a.file} — ${a.status}**: ${a.detail}`).join('\n\n')+'\n\nDo not activate. The image supplies useful additional visible artwork, but no verified hidden joint overlap or bone-compatible complete standing skin. Head/hair/neck perspectives must match; torso must be sleeve-free; pelvis must be independent; arms need proper segment caps; the separate groom holding hand requires correct occlusion/contact; trouser joints need hidden fill; shoes need matched perspective and verified contacts. Preserve source pixels where valid. All source-scale/pivot estimates remain provisional.\n');
if(sha(source)!==hash)throw Error('Master changed');
console.log(JSON.stringify({exports:layers.length,sourcePreserved:true,standingComplete:false,boundaryReview:layers.filter(l=>(l.extraction.visiblePixelsOnBoundary||l.extraction.visiblePixelsOnCropBoundary)).map(l=>l.id)}));
