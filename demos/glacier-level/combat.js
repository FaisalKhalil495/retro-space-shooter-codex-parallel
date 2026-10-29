import { GROUND_SPEED } from '../../js/terrain.js?v=0.29.0';
import { sfx } from '../../js/audio.js?v=0.29.0';
import { clamp, rectsOverlap } from '../../js/util.js?v=0.29.0';

// Mission-only combat. The original two review flights retain their tuning.
const event=(g,e,kind,extra={})=>g.audit.push({time:g.time,id:e.id,type:e.type,kind,...extra});
export const facing=(e,g)=>g.state==='playing'&&g.player.entering<=0&&e.x+e.w<=206&&e.x>8&&
 (e.facingRight?e.x+e.w<=g.player.x-5:e.x>=g.player.x+g.player.w+5);
const aim=(e,g)=>{const m=e.T.muzzle(e),p=g.playerCenter();return Math.atan2(p.y-m.y,p.x-m.x);};
function mode(e,name,time=0){e.mode=name;e.timer=time;e.charge=name==='warn'?1:0;}
function warn(e,g,time){
 if(!facing(e,g)||g.time<(g.regularWarnAt??-10)+.28)return false;
 mode(e,'warn',time);g.regularWarnAt=g.time;
 const m=e.T.muzzle(e);event(g,e,'warn',{duration:time,x:m.x,y:m.y,angle:e.angle,targetX:e.tx,targetY:e.ty});return true;
}
const mayFire=(e,g)=>e.timer<=0&&g.time>=(g.regularShotAt??-10)+.18;
function fired(e,g,extra={},sound=true){g.regularShotAt=g.time;event(g,e,'fire',extra);if(sound)sfx.tick();}
function shot(e,g,angle,speed,kind='orb'){
 const m=e.T.muzzle(e),s=g.fireShot(m.x,m.y,angle,speed,kind);if(kind==='shell')s.dmg=2;sfx.tick();
 return {x:m.x,y:m.y,angle,speed:Math.hypot(s.vx,s.vy)};
}
export function initCombat(e,g){
 e.baseY=e.y;e.shots=0;e.volleys=0;e.drops=0;e.facingRight=false;e.baseHoldX=e.type==='twinDart'&&e.lane?177:148;e.holdX=e.baseHoldX;
 mode(e,'enter');
}
function flySpacing(e,g,dt){
 for(const o of g.enemies){
  if(o===e||o.dead||!o.T.flies||e.id<o.id||!rectsOverlap(e.x-2,e.y-2,e.w+4,e.h+4,o.x,o.y,o.w,o.h))continue;
  const dy=e.baseY>=o.y?o.y+o.h+4-e.y:o.y-e.h-4-e.y;
  const y=clamp(e.y+clamp(dy,-90*dt,90*dt),14,g.terrain.floorY-e.h-19);
  e.baseY+=y-e.y;e.y=y;
  if(rectsOverlap(e.x,e.y,e.w,e.h,o.x,o.y,o.w,o.h))e.x+=70*dt;
 }
}
export function updateCombat(e,dt,g){
 if(e.dead)return;
 // Passing a machine must not make the whole right edge permanently safe.
 // Turn only between warnings; a new full warning follows a visible turn.
 if(!['warn','dash','leave'].includes(e.mode)){
  if(g.player.x>=e.x+e.w+5)e.facingRight=true;
  else if(e.x>=g.player.x+g.player.w+5)e.facingRight=false;
 }
 const ground=['shelfSkiff','anchorGun','snowRoller'].includes(e.type);
 const entering=e.mode==='enter',leaving=e.mode==='leave';
 if(ground){
  e.y=g.terrain.floorY-e.h;
  const entry=e.type==='shelfSkiff'?52:e.type==='snowRoller'?42:GROUND_SPEED;
  e.x-=(entering?entry:leaving?(e.type==='shelfSkiff'?65:45):GROUND_SPEED)*dt;
 }else if(e.type!=='wakeHunter'||e.mode!=='dash'){
  // A right-edge player leaves no forward firing lane at the old hover
  // point. Make room to turn instead of hovering harmlessly over the ship.
  e.holdX=g.player.x>140?Math.min(e.baseHoldX,Math.max(100,g.player.x-e.w-8)):e.baseHoldX;
  if(e.type==='twinDart')e.y=e.baseY+Math.sin(e.t*2)*2;
  if(e.type==='crestBomber')e.y=e.baseY+Math.sin(e.t)*1.5;
  const speed=e.type==='crestBomber'?38:e.type==='needleWing'?46:e.type==='wakeHunter'?52:48;
  if(entering||!leaving&&e.x>e.holdX)e.x=Math.max(e.holdX,e.x-speed*dt);
  if(leaving){
   const exitSpeed=e.type==='crestBomber'?52:e.type==='needleWing'?78:e.type==='wakeHunter'?80:70;
   e.x+=(e.type==='wakeHunter'&&e.facingRight?exitSpeed:-exitSpeed)*dt;
   if(e.type==='wakeHunter')e.y=Math.max(14,e.y-30*dt);
  }
 }
 // Each new firing opportunity gets a full warning after respawn. Machines
 // may keep moving, but cannot queue an invisible shot during entry/death.
 if(g.state!=='playing'||g.player.entering>0){
  if(e.mode==='warn'||e.mode==='aim')mode(e,'wait',.2);
  return;
 }
 if(e.mode==='enter'||e.mode==='wait'){
  e.timer-=dt;
  if(e.timer<=0&&facing(e,g)){
   if(e.type==='needleWing'){mode(e,'aim',.5);e.angle=aim(e,g);}
   else{
    if(e.type==='crestBomber'){const p=g.playerCenter();e.tx=clamp(p.x,12,185);e.ty=clamp(p.y,e.y+e.h+14,g.terrain.floorY-13);}
    if(e.type==='wakeHunter')e.angle=aim(e,g);
    warn(e,g,e.type==='shelfSkiff'?.6:e.type==='anchorGun'?.75:e.type==='twinDart'?.45:.8);
   }
  }
 }else if(e.mode==='aim'){
  e.angle=aim(e,g);e.timer-=dt;if(e.timer<=0)warn(e,g,.65);
 }else if(e.mode==='warn'){
  e.timer-=dt;
  if(!facing(e,g))mode(e,'leave');
  else if(mayFire(e,g)){
   if(e.type==='shelfSkiff'){
    const a=aim(e,g);let info;for(const d of [-.17,0,.17])info=shot(e,g,a+d,72);
    fired(e,g,info,false);e.volleys++;mode(e,e.volleys<3?'wait':'leave',.8);
   }else if(e.type==='twinDart'||e.type==='needleWing'||e.type==='anchorGun'){
    const needle=e.type==='needleWing',anchor=e.type==='anchorGun';
    fired(e,g,shot(e,g,needle?e.angle:aim(e,g),needle?110:anchor?70:82,needle?'fast':anchor?'shell':'orb'),false);
    e.shots++;mode(e,anchor?'vent':e.shots<(needle?2:4)?'wait':'leave',anchor?1.6:.75);
   }else if(e.type==='crestBomber'){
    const x=e.x+e.w/2-4,y=e.y+e.h-3;g.spawnEnemy('coastBomb',x,y,{tx:e.tx,ty:e.ty});fired(e,g,{x,y,targetX:e.tx,targetY:e.ty});
    e.drops++;mode(e,e.drops<2?'wait':'leave',1.1);
   }else if(e.type==='snowRoller'){
    const x=e.facingRight?e.x+e.w-2:e.x-6,y=g.terrain.floorY-8;g.spawnEnemy('rollingCharge',x,y,{life:1.5,direction:e.facingRight?1:-1});fired(e,g,{x,y});e.shots++;mode(e,e.shots<2?'wait':'leave',1.2);
   }else if(e.type==='wakeHunter'){
    e.vx=Math.cos(e.angle)*145;e.vy=Math.sin(e.angle)*145;mode(e,'dash',.9);
    event(g,e,'dash',{vx:e.vx,vy:e.vy,angle:e.angle});sfx.tick();
   }
  }
 }else if(e.mode==='vent'){
  e.timer-=dt;if(e.timer<=0)mode(e,'wait',.9);
 }else if(e.mode==='dash'){
  e.x+=e.vx*dt;e.y=clamp(e.y+e.vy*dt,14,g.terrain.floorY-e.h-19);e.timer-=dt;if(e.timer<=0)mode(e,'leave');
 }
 if(!e.facingRight&&e.x<g.player.x+g.player.w+4&&ground&&e.mode!=='enter')mode(e,'leave');
 if(e.t>16&&e.mode!=='dash')mode(e,'leave');
 if(e.T.flies&&e.mode!=='dash')flySpacing(e,g,dt);
}
