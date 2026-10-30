import { SPRITES } from '../../js/sprites.js?v=0.29.0';

// Mission-local pictures. Old previews and the campaign retain their originals.
// Atlas cells are sampled ONCE at quarter-pixel detail, never during combat.
const SCALE=4;
export const MISSION_ART={};
export const SIZES={skiff:[18,7],anchor:[17,10],dart:[14,7],bomber:[20,6],roller:[18,8],needle:[20,7],hunter:[19,8]};
function canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function finish(hi,w,h){
 const pic=canvas(w,h);pic.hi=hi;pic.detail=SCALE;
 const c=hi.getContext('2d'),im=c.getImageData(0,0,hi.width,hi.height),b=im.data;
 // Alpha-tested cutouts keep silhouettes crisp without translucent fringes.
 for(let i=0;i<b.length;i+=4)b[i+3]=b[i+3]>=128?255:0;
 c.putImageData(im,0,0);pic.mask=Uint8Array.from({length:hi.width*hi.height},(_,i)=>b[i*4+3]?1:0);
 pic.flash=canvas(w,h);pic.flash.hi=canvas(hi.width,hi.height);
 for(let i=0;i<b.length;i+=4)if(b[i+3]){b[i]=232;b[i+1]=229;b[i+2]=204;}
 pic.flash.hi.getContext('2d').putImageData(im,0,0);return pic;
}
const atlas=new Image();
const fleetReady=new Promise((resolve,reject)=>{
 atlas.onerror=()=>reject(new Error('Invader artwork could not load'));
 atlas.onload=()=>{
  try{
   // Tight source rectangles; the two long fins share a row boundary at
   // different x positions, so clip their own cells before measuring alpha.
   const cells={roller:[0,0,1024,350],needle:[0,350,1024,341],hunter:[0,666,1024,358],bomber:[0,1024,1024,250],skiff:[0,1274,1024,262]};
   for(const [key,[sx,sy,sw,sh]] of Object.entries(cells)){
    const tile=canvas(sw,sh),tc=tile.getContext('2d');
    if(key==='needle'||key==='hunter'){
     tc.beginPath();const pts=key==='needle'?[[0,0],[1024,0],[1024,341],[800,341],[800,316],[0,316]]:[[0,0],[800,0],[800,25],[1024,25],[1024,358],[0,358]];
     pts.forEach(([x,y],i)=>i?tc.lineTo(x,y):tc.moveTo(x,y));tc.closePath();tc.clip();
    }
    tc.drawImage(atlas,sx,sy,sw,sh,0,0,sw,sh);
    const data=tc.getImageData(0,0,sw,sh).data;let x0=sw,y0=sh,x1=0,y1=0;
    for(let y=0;y<sh;y++)for(let x=0;x<sw;x++)if(data[(y*sw+x)*4+3]>=128){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x+1);y1=Math.max(y1,y+1);}
    const [w,h]=SIZES[key],hi=canvas(w*SCALE,h*SCALE),c=hi.getContext('2d');c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
    c.drawImage(tile,x0,y0,x1-x0,y1-y0,0,0,hi.width,hi.height);
    const idle=finish(hi,w,h),openHi=canvas(hi.width,hi.height),oc=openHi.getContext('2d');oc.drawImage(hi,0,0);
    if(key==='bomber'){
     // Exposed copper bombs remain visible; opening the bay adds a dark
     // aperture and two ivory hatch edges at the actual drop position.
     oc.globalCompositeOperation='source-atop';oc.fillStyle='#202a32';oc.fillRect(w*1.65,h*2.9,w*.65,h*.5);
     oc.fillStyle='#e0dcc1';oc.fillRect(w*1.65,h*2.9,1,h*.5);oc.fillRect(w*2.3-1,h*2.9,1,h*.5);
    }
    MISSION_ART[key]={idle,open:finish(openHi,w,h),source:'invaders.png'};
   }
   resolve();
  }catch(e){reject(e);}
 };
});
atlas.src=globalThis.__missionEmbeddedArt||new URL('assets/invaders.png?mission=2',document.baseURI).href;
const remaining=new Image();
const remainingReady=new Promise((resolve,reject)=>{
 remaining.onerror=()=>reject(new Error('Anchor and Dart artwork could not load'));
 remaining.onload=()=>{
  try{
   // State pairs share a fixed source frame. Opening armor must not resize
   // the machine, move its feet or shift the gun between warning frames.
   const cells={anchor:[[0,0,934,448],[0,448,934,439]],dart:[[934,0,840,451],[934,451,840,436]]};
   for(const [key,states] of Object.entries(cells)){
    const tiles=states.map(([x,y,w,h],i)=>{const tile=canvas(w,451),offset=i?(key==='anchor'?28:5):0;tile.getContext('2d').drawImage(remaining,x,y,w,h,0,offset,w,h);return tile;});
    let x0=934,y0=451,x1=0,y1=0;
    for(const tile of tiles){const d=tile.getContext('2d').getImageData(0,0,tile.width,tile.height).data;
     for(let y=0;y<tile.height;y++)for(let x=0;x<tile.width;x++)if(d[(y*tile.width+x)*4+3]>=128){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x+1);y1=Math.max(y1,y+1);}
    }
    const [w,h]=SIZES[key],pictures=tiles.map(tile=>{
     const hi=canvas(w*SCALE,h*SCALE),c=hi.getContext('2d');c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
     c.drawImage(tile,x0,y0,x1-x0,y1-y0,0,0,hi.width,hi.height);return finish(hi,w,h);
    });
    MISSION_ART[key]={idle:pictures[0],open:pictures[1],source:'anchor-darts.png'};
   }
   resolve();
  }catch(e){reject(e);}
 };
});
remaining.src=globalThis.__missionExtraArt||new URL('assets/anchor-darts.png?mission=7',document.baseURI).href;
export const artReady=Promise.all([fleetReady,remainingReady]);
export const picture=e=>MISSION_ART[e.T.art][['warn','vent','aim'].includes(e.mode)?'open':'idle'];
export function hit(e,x,y,w,h){
 const p=picture(e),localX=e.facingRight?e.x+e.w-x-w:x-e.x;
 const x0=Math.max(0,Math.floor(localX*SCALE)),y0=Math.max(0,Math.floor((y-e.y)*SCALE)),x1=Math.min(p.hi.width,Math.ceil((localX+w)*SCALE)),y1=Math.min(p.hi.height,Math.ceil((y+h-e.y)*SCALE));
 for(let py=y0;py<y1;py++)for(let px=x0;px<x1;px++)if(p.mask[py*p.hi.width+px])return 'hit';return null;
}
export function body(e,c,snap){
 const p=picture(e),pic=e.flash>0?p.flash:p;
 if(e.facingRight){c.save();c.translate(snap(e.x)+e.w,snap(e.y));c.scale(-1,1);c.drawImage(pic,0,0);c.restore();}
 else c.drawImage(pic,snap(e.x),snap(e.y));
}

// Keep every original contour and transparent pixel of the selected ship.
// Refine its existing armor/glass at quarter pixels; no new fins or guns.
const ship=SPRITES.player,hi=canvas(ship.width*SCALE,ship.height*SCALE),c=hi.getContext('2d');c.imageSmoothingEnabled=false;c.drawImage(ship.hi,0,0,hi.width,hi.height);
const im=c.getImageData(0,0,hi.width,hi.height),b=im.data,src=ship.hi.getContext('2d').getImageData(0,0,ship.hi.width,ship.hi.height).data;
for(let y=0;y<hi.height;y++)for(let x=0;x<hi.width;x++){
 const i=(y*hi.width+x)*4,j=(Math.floor(y/2)*ship.hi.width+Math.floor(x/2))*4;
 if(!b[i+3]||src[j]<45)continue;
 const blue=src[j+2]>src[j]+10,delta=blue?(y%2===0?12:-9):(y%2===0?7:-5);
 for(let k=0;k<3;k++)b[i+k]=Math.max(0,Math.min(255,b[i+k]+delta));
}
c.putImageData(im,0,0);c.globalCompositeOperation='source-atop';
c.fillStyle='#253554';for(const [x,y,w] of [[6.5,3,3],[6,6.5,5],[8,8.5,2.5]])c.fillRect(x*SCALE,y*SCALE,w*SCALE,1);
c.fillStyle='#e0e7f3';for(const [x,y] of [[6.5,1.5],[9,3],[7,4],[9,6],[7.5,8]])c.fillRect(x*SCALE,y*SCALE,1,1);
export const HERO=finish(hi,ship.width,ship.height);
