import { detailCanvas, grit } from '../../js/detail.js?v=0.29.0';
import { GROUND_SPEED } from '../../js/terrain.js?v=0.29.0';

// Scenery only. No enemies, shots, collisions, audio or simulation randomness.
// The opaque buildings are part of the landscape, fixed to its snowy ledge.
const W=225, H=150, Y=-8, PAN=8, FLOOR=130;
const art=new Image();
export const battleReady=new Promise((resolve,reject)=>{
  art.onload=resolve;art.onerror=()=>reject(new Error('Glacier bases could not load'));
});
art.src=globalThis.__battleEmbeddedArt||new URL('assets/glacier-bases.png?battle=2',document.baseURI).href;
const mod=(n,d)=>((n%d)+d)%d;
export const SMOKE_SOURCES=Object.freeze([
  Object.freeze({x:114,y:56.5,scale:.75,offset:0}), // generator's broken roof
  Object.freeze({x:164,y:55.5,scale:.65,offset:11}), // hangar's collapsed left wing
]);
function paint(w,h,fn){const {canvas,ctx}=detailCanvas(w,h);fn(ctx);return canvas;}
function poly(c,color,points){
  c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();
}
function smokeFrame(frame){
  return paint(28,36,c=>{
    // Merge overlapping billows into one continuous plume before shading.
    // Painting separate highlighted circles makes smoke resemble beads/rings.
    const puffs=Array.from({length:12},(_,i)=>{
      const age=mod(frame/24+i/12,1);
      return {x:14-age*6+Math.sin(frame*Math.PI/12+age*7)*age*1.2,
        y:34-age*28,r:1.5+age*3.6};
    });
    const shades=['#505c64','#5e6b73','#6b7981','#7a878f','#89969d'];
    for(let y=0;y<36;y+=.5)for(let x=0;x<28;x+=.5){
      if(!puffs.some(p=>((x-p.x)**2+(y-p.y)**2/ .82)<p.r*p.r))continue;
      const age=Math.max(0,(34-y)/28),light=Math.sin(x*.22+y*.15)*.4;
      c.fillStyle=shades[Math.max(0,Math.min(4,Math.floor(age*3.8+light+grit(x*2,y*2,977)*.2)))];
      c.globalAlpha=Math.max(0,Math.min(.88,(y-1)*.11));c.fillRect(x,y,.5,.5);
    }
  });
}
function fireFrame(frame){
  return paint(4,5,c=>{
    const sway=[0,.5,0,-.5][frame%4],height=[3,4,3.5,4.5][frame%4];
    poly(c,'#855c43',[[0,5],[.5,2.5],[1.5+sway,5-height],[3,2],[4,5]]);
    poly(c,'#c88a4c',[[.5,5],[1,3],[1.5+sway,6-height],[2.5,3],[3.5,5]]);
    c.fillStyle='#e0b36d';c.fillRect(1.5,3.5,1,1.5);
  });
}
function flareFrame(frame){
  return paint(8,8,c=>{
    const a=frame/8,r=1+a*2.5;c.globalAlpha=1-a;
    poly(c,'#9d6c45',[[4-r,3],[3,4-r],[5,4-r*.7],[4+r,4],[5,4+r],[3,5]]);
    c.fillStyle='#d7a76a';c.fillRect(3,3,2,2);
  });
}
function snowFloor(){
  return paint(416,14,c=>{
    for(let x=0;x<416;x+=.5)for(let y=0;y<14;y+=.5){
      const drift=4+Math.sin(x/18)*1.1+Math.sin(x/6)*.7,n=grit(x*2,y*2,605);
      c.fillStyle=y<1?'#edf4ef':y<drift?(n>.86?'#f4f7ef':'#dce8e5'):y<8?'#b3cdd6':n>.8?'#a6c9d5':'#7ba9be';c.fillRect(x,y,.5,.5);
    }
    for(let x=18;x<416;x+=35){c.fillStyle='#92b8c8';c.fillRect(x-5,5,9,.5);c.fillStyle='#4e819f';for(let y=8;y<14;y+=.5)c.fillRect(x+Math.floor((y-8)/2)*.5,y,.5,.5);}
  });
}
let cached;
function prepare(){
  // Shared immutable pictures: restarting or making another review fixture
  // never repaints the world or effects once they have been prepared.
  return cached||(cached={
    world:paint(W,H,c=>{c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(art,0,0,W,H);}),
    snow:snowFloor(),smoke:Array.from({length:24},(_,i)=>smokeFrame(i)),
    fires:Array.from({length:4},(_,i)=>fireFrame(i)),flares:Array.from({length:8},(_,i)=>flareFrame(i)),
  });
}
export function battleState(t){
  const age=mod(t+4,18);
  return {sources:SMOKE_SOURCES,smokeFrame:Math.floor(t*4)%24,fireFrame:Math.floor(t*6)%4,
    flare:age<.4?{source:0,frame:Math.min(7,Math.floor(age*20))}:null};
}
export class BattlefieldBackground{
  constructor(){
    this.t=0;this.loaded=false;
    battleReady.then(()=>{Object.assign(this,prepare());this.loaded=true;}).catch(()=>{});
  }
  update(dt){this.t+=dt;}
  draw(c,snap){
    c.save();c.beginPath();c.rect(0,11,208,133);c.clip();
    c.fillStyle='#7eacd1';c.fillRect(0,11,208,133);
    if(!this.loaded){c.restore();return;}
    c.drawImage(this.world,-PAN,Y);
    c.save();c.beginPath();c.rect(0,11,208,53);c.clip();
    const state=battleState(this.t);
    for(const s of state.sources){
      const frame=(state.smokeFrame+s.offset)%24;
      c.drawImage(this.smoke[frame],snap(s.x-PAN-14*s.scale),snap(s.y-34*s.scale),28*s.scale,36*s.scale);
      c.drawImage(this.fires[state.fireFrame],snap(s.x-PAN-1.2),snap(s.y-3),2.4,3);
    }
    if(state.flare){
      const s=state.sources[state.flare.source];
      c.drawImage(this.flares[state.flare.frame],snap(s.x-PAN-3),snap(s.y-4),6,6);
    }
    c.restore();
    const x=-snap(mod(this.t*GROUND_SPEED,416));c.drawImage(this.snow,x,FLOOR);
    if(x+416<208)c.drawImage(this.snow,x+416,FLOOR);
    c.restore();
  }
}
