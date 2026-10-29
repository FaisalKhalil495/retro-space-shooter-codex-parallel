import { LOCAL_TYPES } from '../glacier-combat/enemies.js?combat=3';
import { target } from '../glacier-combat/art.js?combat=3';
import { ESCORT } from '../glacier-boss/escorts.js?boss=7';
import { MISSION_ART, body, hit } from './art.js?mission=4';
import { initCombat, updateCombat } from './combat.js?mission=4';

const guns={skiff:[.015,.35],anchor:[.04,.34],dart:[.04,.5],bomber:[.5,.91],roller:[.205,.07],needle:[.012,.55],hunter:[.012,.48]};
function line(c,e,snap,locked){
 const m=e.T.muzzle(e),a=e.angle??Math.PI;c.fillStyle=locked?'#d99b43':'#a88969';
 for(let d=6;d<215;d+=6){const x=m.x+Math.cos(a)*d,y=m.y+Math.sin(a)*d;if(x<0||x>208||y<11||y>129)break;c.fillRect(snap(x),snap(y),1,.5);}
}
export const TYPES=Object.fromEntries(Object.entries(LOCAL_TYPES).filter(([,t])=>guns[t.art]).map(([key,t])=>[key,{
 ...t,hitTest:hit,muzzle(e){const [x,y]=guns[t.art];return {x:e.x+e.w*(e.facingRight?1-x:x),y:e.y+e.h*y};},
 init(e,g){t.init(e,g);initCombat(e,g);},
 update(e,dt,g){
  updateCombat(e,dt,g);
  if(t.flies){
   // Leave clearance above the enlarged ground machines during a dive.
   const limit=g.terrain.floorY-19-e.h;
   if(e.y>limit){e.baseY-=e.y-limit;e.y=limit;}
  }else{
   // A departing skiff must not drive through a slower anchor ahead of it.
   for(const other of g.enemies)if(other!==e&&!other.dead&&other.missionRegular&&!other.T.flies&&other.id<e.id&&other.x<e.x)
    e.x=Math.max(e.x,other.x+other.w+4);
  }
 },
 draw(e,c,snap){
  if(key==='crestBomber'&&e.mode==='warn')target(c,e.tx,e.ty,snap,Math.floor(e.t*8)%2===0);
  if(key==='needleWing'&&['aim','warn'].includes(e.mode))line(c,e,snap,e.mode==='warn');
  if(key==='wakeHunter'&&e.mode==='warn')line(c,e,snap,true);
  body(e,c,snap);
 }
}]));
export const MISSION_ESCORT={...ESCORT,
 draw:TYPES.twinDart.draw,muzzle:TYPES.twinDart.muzzle,
 hitTest(e,...r){return e.passive||e.arriving?null:hit(e,...r);},
 shotTest(e,...r){return e.x+e.w<=208?hit(e,...r):null;},
 init:ESCORT.init,
 update(e,dt,g){
  if(e.dead)return;
  ESCORT.update(e,dt,g);
  // Limit the lower pair's vertical sway so their wider wings never overlap
  // or touch the hull. Rear entry, horizontal motion and firing stay native.
  if(!e.passive){
   if(e.lane===0)e.y=Math.min(e.y,81);
   if(e.lane===3)e.y=e.arriving?94:93.5+Math.sin(e.t*1.1+e.lane)*.5;
  }
 }
};
export const RIGHT_CHARGE={...LOCAL_TYPES.rollingCharge,
 update(e,dt,g){
  if(e.dead)return;
  // Brake at the visible edge so the original fuse warning and burst never
  // disappear off-screen and send unmarked fragments back into the fight.
  e.x=Math.min(200,e.x+54*dt)+54*dt;LOCAL_TYPES.rollingCharge.update(e,dt,g);
 }
};
export function spawn(g,type,x,y,opts,T=TYPES[type]){
 const pic=MISSION_ART[T.art].idle;
 const e={type,T,x,y,w:pic.width,h:pic.height,hp:T.hp,maxHp:T.hp,t:0,flash:0,id:++g.nextId,...opts};
 T.init(e,g);g.enemies.push(e);g.audit.push({time:g.time,id:e.id,type,kind:'spawn'});return e;
}
