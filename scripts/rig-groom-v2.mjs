import fs from 'node:fs';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {PHASES,footTarget,footContact,solveJoint,weightShift} from '../src/walkMath.js';
const root='artifacts/groom-v2-rig',assets='artifacts/groom-v2-preparation',manifestFile=assets+'/manifest.json';
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const inputHash=hash(manifestFile),m=JSON.parse(fs.readFileSync(manifestFile));
const used=['torso-front-with-sleeves','pelvis-with-coat','neck-collar','head-3q-right','hand-left-relaxed-v1','hand-right-relaxed','hand-right-hold','thigh-left','thigh-right','shin-left','shin-right','shoe-left-side','shoe-right-side'];
const images=new Map();
for(const id of used){const l=m.layers.find(l=>l.id===id),file=assets+'/'+l.file,r=spawnSync('ffmpeg',['-v','error','-i',file,'-frames:v','1','-f','rawvideo','-pix_fmt','rgba','pipe:1'],{maxBuffer:4e6});if(r.status)throw Error(r.stderr.toString());images.set(id,{...l,rgba:r.stdout,href:'data:image/png;base64,'+fs.readFileSync(file).toString('base64'),hash:hash(file)});}
const I=[1,0,0,1,0,0],T=(x,y)=>[1,0,0,1,x,y],R=d=>{const a=d*Math.PI/180;return [Math.cos(a),Math.sin(a),-Math.sin(a),Math.cos(a),0,0]},mul=(a,b)=>[a[0]*b[0]+a[2]*b[1],a[1]*b[0]+a[3]*b[1],a[0]*b[2]+a[2]*b[3],a[1]*b[2]+a[3]*b[3],a[0]*b[4]+a[2]*b[5]+a[4],a[1]*b[4]+a[3]*b[5]+a[5]],point=(a,x,y)=>[a[0]*x+a[2]*y+a[4],a[1]*x+a[3]*y+a[5]],inv=a=>{const d=a[0]*a[3]-a[1]*a[2];return [a[3]/d,-a[1]/d,-a[2]/d,a[0]/d,(a[2]*a[5]-a[3]*a[4])/d,(a[1]*a[4]-a[0]*a[5])/d]},around=(x,y,a)=>mul(mul(T(x,y),R(a)),T(-x,-y));
const rect=(x,y,w,h)=>({type:'rect',x,y,w,h}),poly=points=>({type:'poly',points});
const inside=(mask,x,y)=>{if(!mask)return true;if(mask.type==='rect')return x>=mask.x&&x<=mask.x+mask.w&&y>=mask.y&&y<=mask.y+mask.h;let c=false;for(let i=0,j=mask.points.length-1;i<mask.points.length;j=i++){const a=mask.points[i],b=mask.points[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c;}return c};
const bodyMask=poly([[-22,62],[22,62],[26,78],[20,97],[21,122],[21.5,124],[-21.5,124],[-21,122],[-20,97],[-26,78]]);
const coatMask=poly([[-21.5,123.5],[21.5,123.5],[30,171],[-30,171]]);
const armMask=side=>poly((side<0?[[-40,75],[-25,72],[-17,81],[-18,100],[-19,120],[-23,148],[-40,148]]:[[40,75],[25,72],[17,81],[18,100],[19,120],[23,148],[40,148]]));
const pelvisMask=poly([[-7.5,168],[7.5,168],[8.5,176],[0,173.8],[-8.5,177]]);
const clipMarkup=(mask,id)=>!mask?'':`<clipPath id="${id}" clipPathUnits="userSpaceOnUse">${mask.type==='rect'?`<rect x="${mask.x}" y="${mask.y}" width="${mask.w}" height="${mask.h}"/>`:`<polygon points="${mask.points.map(p=>p.join(',')).join(' ')}"/>`}</clipPath>`;
const textureCorrections={};
for(const id of ['thigh-left','thigh-right','shin-left','shin-right']){const l=images.get(id),scale=l.registration.uniformScale,p=l.pivotInLayerPx,w=l.pixelDimensions.width;
 const center=y=>{const row=Math.round(y/scale+p.y),xs=[];for(let x=0;x<w;x++)if(l.rgba[(row*w+x)*4+3]>180)xs.push((x-p.x)*scale);return (xs[0]+xs.at(-1))/2};
 const proximal=center(0),distal=center(48),degrees=Math.atan2(distal-proximal,48)*180/Math.PI;
 textureCorrections[id]={proximalClothCenter:proximal,distalClothCenter:distal,rigidRestRotationDegrees:degrees,matrix:mul(R(degrees),T(-proximal,0)),verifiedAnatomicalJoint:false};
}
function part(id,x,y,M=I,mask=null,tag=id,correct=true){return {id,x,y,M,mask,tag,C:correct&&textureCorrections[id]?textureCorrections[id].matrix:I,img:images.get(id)}}
function alpha(p,x,y){const [lx,ly]=point(inv(p.M),x,y);if(!inside(p.mask,lx,ly))return 0;const [ax,ay]=point(inv(p.C),lx,ly);const s=p.img.registration.uniformScale,px=Math.floor((ax-p.x)/s+p.img.pivotInLayerPx.x),py=Math.floor((ay-p.y)/s+p.img.pivotInLayerPx.y),b=p.img.pixelDimensions;if(px<0||py<0||px>=b.width||py>=b.height)return 0;return p.img.rgba[(py*b.width+px)*4+3]/255;}
function coverage(parts,cx,cy,r=5,reference=null){let n=0,filled=0;for(let y=cy-r;y<=cy+r;y+=.25)for(let x=cx-r;x<=cx+r;x+=.25){if((x-cx)**2+(y-cy)**2>r*r)continue;if(reference&&Math.max(...reference.map(p=>alpha(p,x,y)))<.8)continue;n++;if(parts.some(p=>alpha(p,x,y)>.5))filled++;}return {samples:n,covered:filled,fraction:n?filled/n:0};}
function pose(phase=null,{repair=true,sleeveAngle=0,thighShift=0}={}){
 const standing=phase===null,bob=standing?-5:weightShift(phase),sway=standing?0:Math.sin(phase*Math.PI*2)*1.2,B=T(sway,bob),parts=[],joints=[];
 for(let side=0;side<2;side++){
  const x=side?12:-12,target=standing?{x:0,lift:0,q:0}:footTarget(phase*120,side),roll=standing?{x:0,lift:0,pitch:0}:footContact(target.q),joint=solveJoint(target.x+roll.x-sway,268-target.lift-roll.lift-bob-177,48,48),hip=mul(B,T(x,177)),upper=mul(hip,R(joint.hip)),knee=mul(upper,T(0,48)),lower=mul(knee,R(joint.knee)),ankle=mul(lower,T(0,48)),foot=mul(ankle,R(-joint.hip-joint.knee+roll.pitch)),suffix=side?'right':'left';
  const thigh=part('thigh-'+suffix,0,0,upper,repair?rect(-30,-20,60,70):null,'thigh-'+suffix,repair),shin=part('shin-'+suffix,0,0,lower,repair?rect(-30,-20,60,68.2):null,'shin-'+suffix,repair),shoe=part('shoe-'+suffix+'-side',0,0,foot);
  thigh.C=mul(T(0,thighShift),thigh.C);
  // Parent knee/ankle transforms remain intact. Source rims are hidden by
  // actual overlapping white cloth, never by solid-color patches.
  if(repair)parts.push(shoe,shin,thigh);else parts.push(thigh,shin,shoe);
  joints.push({name:'hip-'+suffix,center:point(hip,0,0),upper,lower,thigh,shin,shoe},{name:'knee-'+suffix,center:point(knee,0,0),upper,lower,thigh,shin,shoe},{name:'ankle-'+suffix,center:point(ankle,0,0),upper,lower,thigh,shin,shoe});
 }
 parts.push(part('neck-collar',0,65,B,rect(-5.5,60,11,8),'neck-underlap'));
 parts.push(part('pelvis-with-coat',0,repair?147:151,B,repair?pelvisMask:null,'pelvis'));
 const angle=standing?sleeveAngle:sleeveAngle*Math.sin(phase*Math.PI*2),left=mul(B,around(-23,83,angle)),right=mul(B,around(23,83,-angle));
 parts.push(part('hand-left-relaxed-v1',-32,repair?144:142,left,repair?rect(-60,142,120,30):null,'left-static-hand'));
 parts.push(part('hand-right-relaxed',31,repair?144:142,right,repair?rect(-60,142,120,30):null,'right-static-hand'));
 if(repair){
  parts.push(part('torso-front-with-sleeves',0,70,B,bodyMask,'body-core'));
  parts.push(part('torso-front-with-sleeves',0,70,left,armMask(-1),'left-sleeve'));
  parts.push(part('torso-front-with-sleeves',0,70,right,armMask(1),'right-sleeve'));
  parts.push(part('torso-front-with-sleeves',0,70,B,coatMask,'coat-foreground'));
 }else parts.push(part('torso-front-with-sleeves',0,70,B));
 // A masked source neck strip sits beneath the head; it closes alpha only.
 // existing painted neck behind the original torso collar instead.
 parts.push(part('head-3q-right',0,65,B,null,'head'));
 return {parts,joints,B,bob,sway,phase,sleeveAngle};
}
let serial=0;
function renderParts(parts){return parts.map(p=>{const name='m'+serial++,l=p.img,s=l.registration.uniformScale,b=l.pixelDimensions;return `<g transform="matrix(${p.M.join(' ')})">${clipMarkup(p.mask,name)}<g ${p.mask?`clip-path="url(#${name})"`:''}><g transform="matrix(${p.C.join(' ')})"><image href="${l.href}" x="${p.x-l.pivotInLayerPx.x*s}" y="${p.y-l.pivotInLayerPx.y*s}" width="${b.width*s}" height="${b.height*s}"/></g></g></g>`}).join('')}
const cases=[{name:'standing',phase:null},...PHASES.map((name,i)=>({name,phase:i/8}))];
const results=cases.map(c=>{const p=pose(c.phase),checks=p.joints.map(j=>{const group=j.name.startsWith('knee')?[j.thigh,j.shin]:j.name.startsWith('ankle')?[j.shin,j.shoe]:[j.thigh,...p.parts.filter(x=>x.tag==='pelvis'||x.tag==='coat-foreground')];const cov=coverage(group,...j.center,j.name.startsWith('hip')?4:4.5);return {joint:j.name,...cov,alphaCoveragePass:cov.fraction>=.985,materialContinuity:'visual-review-required'};});
 const wrist=[[-32,144],[31,144]].map((v,i)=>({joint:'wrist-'+(i?'right':'left'),...coverage(p.parts,...point(p.B,...v),2.4),limit:'static relaxed hand only; holding pose not verified'}));
 const waist=[-12,12].map(x=>coverage(p.parts,...point(p.B,x,171.5),2));
 return {pose:c.name,phase:c.phase,joints:checks,wrists:wrist,waistBridge:waist,fullRigPass:false,blockers:['elbow overlap experimental; material continuity not approved','holding-hand endpoint cannot reach shared grip with static sleeve','hidden lateral hip surfaces and cloth perspective need visual review','left shoe roll/contact landmarks not approved']};});
const sleeveTests=[-3,-2,0,2,3].map(angle=>{const p=pose(null,{sleeveAngle:angle}),reference=pose(null,{repair:false});return {degrees:angle,shoulders:[-23,23].map(x=>({side:x<0?'left':'right',...coverage(p.parts,...point(p.B,x,83),8,reference.parts)})),status:'not-certified-until-visual-review'};});
function elbowTrial(degrees){const p=pose(null),pivot=[31.5,118],L=mul(p.B,around(...pivot,degrees));p.parts=p.parts.filter(x=>x.tag!=='right-sleeve'&&x.tag!=='right-static-hand');p.parts.splice(p.parts.length-1,0,part('torso-front-with-sleeves',0,70,p.B,rect(18,73,23,49),'right-upper-arm'),part('torso-front-with-sleeves',0,70,L,rect(23,114,19,34),'right-forearm'),part('hand-right-hold',31,144,L,rect(20,141,25,25),'right-grip'));const center=point(p.B,...pivot),cov=coverage(p.parts,...center,3.5),contact=point(L,31,153);return {p,degrees,...cov,contact,sharedGripTarget:[61.5,136],targetError:Math.hypot(contact[0]-61.5,contact[1]-136)};}
const elbowTests=[0,-15,-30,-45,-59.85].map(elbowTrial);
const neckTests=[-4,0,4].map(degrees=>{const p=pose(null),head=p.parts.find(x=>x.tag==='head');head.M=mul(p.B,around(0,65,degrees));return {degrees,...coverage(p.parts,...point(p.B,0,65),3)};});
const thighShiftTests=[0,-2,-3,-4].map(shift=>{const samples=cases.map(c=>{const p=pose(c.phase,{thighShift:shift});return {pose:c.name,knees:p.joints.filter(j=>j.name.startsWith('knee')).map(j=>coverage([j.thigh,j.shin],...j.center,4.5).fraction),hips:p.joints.filter(j=>j.name.startsWith('hip')).map(j=>coverage([j.thigh,...p.parts.filter(x=>x.tag==='pelvis'||x.tag==='coat-foreground')],...j.center,4).fraction),waist:[-12,12].map(x=>coverage(p.parts,...point(p.B,x,171.5),2).fraction)};});return {shift,samples,minKnee:Math.min(...samples.flatMap(x=>x.knees)),minHip:Math.min(...samples.flatMap(x=>x.hips)),minWaist:Math.min(...samples.flatMap(x=>x.waist))};});
const svg=(content,title,width=900,height=1200,box='-85 -20 170 315')=>`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${box}"><rect x="-1000" y="-1000" width="5000" height="5000" fill="#07182f"/><style>text{font-family:Arial,sans-serif;fill:#dcecff}</style>${content}<text x="0" y="-10" font-size="3.5" text-anchor="middle">${title}</text></svg>`;
const guide=(p,metrics)=>p.joints.map(j=>{const check=metrics.joints.find(x=>x.joint===j.name);return `<circle cx="${j.center[0]}" cy="${j.center[1]}" r="3" stroke="${check.alphaCoveragePass?'#75d9bd':'#ffa380'}" stroke-width=".6" fill="none"/>`}).join('');
const standing=pose(null);fs.writeFileSync(root+'/standing.svg',svg(renderParts(standing.parts)+guide(standing,results[0])+'<text x="0" y="290" font-size="3" text-anchor="middle">SOURCE-PIXEL REPAIRS ONLY — FULL RIG STILL BLOCKED</text>','Standing: masked pelvis, torso-anchored coat, rims occluded, static sleeves'));
const sheet=cases.slice(1).map((c,i)=>{const p=pose(c.phase),x=(i%4)*190,y=Math.floor(i/4)*330;return `<g transform="translate(${x} ${y})">${renderParts(p.parts)}${guide(p,results[i+1])}<text x="0" y="-10" text-anchor="middle" font-size="5">${i+1}. ${c.name}</text><text x="0" y="292" text-anchor="middle" font-size="3.2">Green: sampled alpha coverage. Orange: gap.</text><text x="0" y="301" text-anchor="middle" font-size="3.2">Elbows / shared grip: BLOCKED in every pose.</text></g>`}).join('');
fs.writeFileSync(root+'/walking-phases.svg',svg(sheet,'',1600,1440,'-90 -25 760 660'));
const sleeves=sleeveTests.map((t,i)=>{const p=pose(null,{sleeveAngle:t.degrees});return `<g transform="translate(${i*160} 0)">${renderParts(p.parts)}<text x="0" y="-10" font-size="5" text-anchor="middle">Shoulder trial ${t.degrees} degrees</text><text x="0" y="289" font-size="3" text-anchor="middle">No elbow flexion. Not an approved grip pose.</text></g>`}).join('');
fs.writeFileSync(root+'/sleeve-tests.svg',svg(sleeves,'',1800,740,'-80 -25 800 330'));
const elbowSheet=elbowTests.map((t,i)=>`<g transform="translate(${i*160} 0)">${renderParts(t.p.parts)}<circle cx="61.5" cy="136" r="2" fill="none" stroke="#f3b87b" stroke-width=".6"/><text x="0" y="-10" font-size="5" text-anchor="middle">Elbow ${t.degrees} degrees</text><text x="0" y="289" font-size="3" text-anchor="middle">Elbow coverage: ${(t.fraction*100).toFixed(1)}%; grip error ${t.targetError.toFixed(1)}</text></g>`).join('');
fs.writeFileSync(root+'/elbow-tests.svg',svg(elbowSheet,'',1800,740,'-80 -25 800 330'));
const audit={thighShiftTests,neckTests,elbowTests:elbowTests.map(({p,...metrics})=>metrics),textureCorrections,status:'DIAGNOSTIC_ONLY_DO_NOT_ACTIVATE',sourceManifestUnchanged:true,sourceManifestSha256:inputHash,assets:used.map(id=>({id,file:images.get(id).file,sha256:images.get(id).hash})),method:'Existing PNGs referenced through SVG clip paths and rigid transforms only. No pixel generation, stretching, recoloring, new extraction or paint duplication to invent anatomy.',results,sleeveTests,scope:'Alpha-disc coverage is a local seam diagnostic, not proof of correct anatomy, cloth shading, grip, global sole contact or hidden surfaces.',activationApproved:false};
fs.writeFileSync(root+'/joint-audit.json',JSON.stringify(audit,null,2));
fs.writeFileSync(root+'/rig.json',JSON.stringify({enabled:false,sourceManifest:manifestFile,repairs:{neck:'Removed duplicate incompatible neck/collar overlay; existing head neck sits behind original torso collar.',pelvis:'White original lower-torso pixels only, masked; no blue tabs follow the legs.',coat:'Separate upper body/core, sleeve masks and lower coat foreground reference the same original pixels. Coat remains torso-anchored.',wrist:'Relaxed hands masked above skin and placed behind original cuffs at measured (-32,144)/(31,144).',knee:'Original shin under original thigh; open thigh rim clipped at local y50. No painted cap inserted.',ankle:'Shoe behind shin; dark open shin rim clipped at local y48.2. Foot source orientation remains unapproved.'},staticSleeves:true,upperBodyMask:bodyMask,pelvisMask,shoulderMask:{left:armMask(-1),right:armMask(1)},registrationStatus:'diagnostic-estimates-only',artworkPixelsModified:false},null,2));
fs.writeFileSync(root+'/index.html',`<!doctype html><html><head><meta charset="UTF-8"><title>Groom V2 joint repair lab</title><style>body{background:#09182b;color:#dfedff;font:14px system-ui;line-height:1.5;margin:24px}h1{font-size:25px}strong{color:#ffbc88}a{color:#a7d6ff}.standing{height:620px}img{max-width:100%}pre{white-space:pre-wrap}details{margin:16px 0;background:#132a42;padding:14px}</style></head><body><h1>Groom V2: non-destructive joint repair lab</h1><p><strong>DIAGNOSTIC ONLY. Live SVG unchanged. Complete animation approval: FAIL.</strong></p><p>Green circles report sampled local alpha coverage only; they do not certify anatomy, embroidery continuity or holding-hand contact.</p><img class="standing" src="standing.svg"><h2>Eight-phase seam stress test — static sleeves</h2><img src="walking-phases.svg"><h2>Restricted shoulder experiments</h2><img src="sleeve-tests.svg"><h2>Right elbow / grip reach stress test</h2><img src="elbow-tests.svg"><p>Any tested opening or texture seam keeps the sleeve motion blocked; the working diagnostic retains static sleeves.</p><details><summary>Measured joint coverage</summary><pre>${JSON.stringify(results,null,2)}</pre></details><p><a href="joint-audit.json">Joint audit JSON</a> · <a href="rig.json">Non-destructive repair definitions</a></p></body></html>`);
if(hash(manifestFile)!==inputHash)throw Error('Input manifest changed');
for(const id of used)if(hash(assets+'/'+images.get(id).file)!==images.get(id).hash)throw Error('Input image changed');
console.log(JSON.stringify({results:results.map(r=>({pose:r.pose,joints:r.joints.map(j=>({joint:j.joint,coverage:+j.fraction.toFixed(3)})),wrists:r.wrists.map(w=>+w.fraction.toFixed(3)),waist:r.waistBridge.map(w=>+w.fraction.toFixed(3))})),sleeves:sleeveTests.map(t=>({angle:t.degrees,shoulderCoverage:t.shoulders.map(s=>+s.fraction.toFixed(3))})),elbows:elbowTests.map(({p,...v})=>({angle:v.degrees,coverage:+v.fraction.toFixed(3),gripError:+v.targetError.toFixed(2)})),neck:neckTests,thighShift:thighShiftTests.map(({samples,...summary})=>summary),inputsUnchanged:true}));
const visualReview={activationApproved:false,standingPass:false,walkingPass:false,torsoCoat:'restricted-view-pass',relaxedWrists:'static-pass',shoulders:'candidate-only-plus-minus-2-degrees; static in gait tests',rightElbow:'experimental overlap; material continuity and grip not approved',neck:'alpha closed; dark artifact and shading seam fail',pelvis:'waist and outer hip gaps fail',knees:'alpha mostly closed; shin-top rims fail visual continuity',ankles:'sampled overlap passes; shoe facing and heel/toe contact unapproved',rejectedThighShift:'Moving cloth upward trades waist gaps for knee gaps; retain original shift 0',evidence:['standing.png','walking-phases.png','arm-tests.png'],missingArtwork:'MISSING_ARTWORK.md'};
const savedAudit=JSON.parse(fs.readFileSync(root+'/joint-audit.json'));savedAudit.visualReview=visualReview;fs.writeFileSync(root+'/joint-audit.json',JSON.stringify(savedAudit,null,2));
const savedRig=JSON.parse(fs.readFileSync(root+'/rig.json'));
savedRig.repairs.neck='Masked original neck strip closes sampled alpha only; dark mark/shading seam remains blocked.';
savedRig.textureRestCorrections=textureCorrections;
savedRig.visualReview=visualReview;
savedRig.layers=standing.parts.map((p,drawOrder)=>({id:p.tag,source:p.img.file,parentBone:p.tag.startsWith('thigh')?'hip-'+p.tag.split('-').at(-1):p.tag.startsWith('shin')?'knee-'+p.tag.split('-').at(-1):p.tag.startsWith('shoe')?'ankle-'+(p.tag.includes('left')?'left':'right'):'body',pivotInSourcePixels:p.img.pivotInLayerPx,uniformScale:p.img.registration.uniformScale,placementInBone:{x:p.x,y:p.y},standingBoneToWorld:p.M,rigidArtworkCorrection:p.C,clip:p.mask,drawOrder,animationApproved:false}));
fs.writeFileSync(root+'/rig.json',JSON.stringify(savedRig,null,2));


export {pose,renderParts,coverage,point,I,PHASES};

export {alpha,mul,T};
