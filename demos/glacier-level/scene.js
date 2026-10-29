import { BossGame, battleReady as backgroundReady } from '../glacier-boss/scene.js?boss=7';
import { artReady, HERO } from './art.js?mission=6';
import { TYPES, MISSION_ESCORT, RIGHT_CHARGE, spawn } from './enemies.js?mission=6';
import { MISSION_BOSS } from './boss.js?mission=6';
import { SPRITES } from '../../js/sprites.js?v=0.29.0';
import { LEVELS } from '../../js/levels.js?v=0.29.0';
import { sfx } from '../../js/audio.js?v=0.29.0';
import { drawText } from '../../js/font.js?v=0.29.0';
import { PAL } from '../../js/config.js?v=0.29.0';
export const battleReady=Promise.all([backgroundReady,artReady]);
export const WAVE_SECONDS=180,REGULAR_CAP=8;
export { ARRIVALS, FORMATIONS } from './waves.js?mission=6';
import { ARRIVALS } from './waves.js?mission=6';
const SCENE={number:4,name:'GLACIER COAST',floor:14,background:{sun:false,dust:false},events:[[Number.MAX_SAFE_INTEGER,'end']]};
const ground=new Set(['shelfSkiff','anchorGun','snowRoller']);
// Reuse the original pod contents/times without changing the campaign table.
export const SUPPLIES=LEVELS[1].events.filter(e=>e[1]==='carrier').map(([time,,opts])=>Object.freeze({time,drop:opts.drop}));
export const regulars=g=>g.enemies.filter(e=>e.missionRegular&&!e.dead);
function laneFor(g,event){
 const {type,y}=event,live=regulars(g);
 if(live.length>=REGULAR_CAP)return null;
 if(ground.has(type))return live.filter(e=>ground.has(e.type)).length<2&&live.filter(e=>ground.has(e.type)).every(e=>e.x+e.w+10<213)?0:null;
 const flyers=live.filter(e=>e.T.flies),hunters=flyers.filter(e=>e.type==='wakeHunter'&&e.x+e.w>64);
 const waiting=g.runner.pending.find(e=>!ground.has(e.type));
 if(waiting?.type==='wakeHunter'&&type!=='wakeHunter')return null;
 // A paired hunter dive is a formation of its own. Other flyers finish
 // crossing before the pair enters, then the next flight follows its tail.
 if(flyers.length>=6||type==='wakeHunter'&&flyers.some(e=>e.type!=='wakeHunter'&&e.x+e.w>64)||type!=='wakeHunter'&&hunters.length)return null;
 // Test the whole entry envelope, not only the exact instant of spawning.
 // Same-row followers need a body-length gap; other rows keep their lanes.
 return flyers.every(e=>Math.abs(e.y-y)>e.h+8||e.x+e.w+12<213)?y:null;
}
export class MissionRunner{
 constructor(game){this.g=game;this.t=0;this.phase='waves';this.timer=0;this.next=0;this.pod=0;this.pending=[];this.nextEntry=0;}
 update(dt){
  const g=this.g;if(g.state!=='playing'||g.player.entering>0)return;
  if(this.phase==='waves'){
   this.t+=dt;
   while(this.next<ARRIVALS.length&&ARRIVALS[this.next].time<=this.t)this.pending.push(ARRIVALS[this.next++]);
   this.pending=this.pending.filter(e=>{if(this.t-e.time<=((e.type==='crestBomber'||e.type==='wakeHunter')?12:8))return true;g.audit.push({kind:'waveSkipped',type:e.type,at:this.t,reason:'occupied lanes',scheduled:e.time});return false;});
   if(this.t>=this.nextEntry){
    const index=this.pending.findIndex(e=>laneFor(g,e)!==null);
    if(index>=0){
     const event=this.pending[index],y=laneFor(g,event);
     this.pending.splice(index,1);
     const e=g.spawnEnemy(event.type,213,y,{missionRegular:true,lane:event.slot,formation:event.group,flow:event.flow,holdX:event.holdX});
     g.audit.push({kind:'arrival',id:e.id,type:e.type,at:this.t,scheduled:event.time,delay:this.t-event.time,section:event.section,group:event.group,recipe:event.recipe});
     this.nextEntry=this.t+.28;
    }
   }
   while(this.pod<SUPPLIES.length&&SUPPLIES[this.pod].time<=this.t){
    const pod=SUPPLIES[this.pod++];g.spawnEnemy('carrier',216,14,{drop:pod.drop,missionSupply:true});
    g.audit.push({kind:'missionSupply',at:this.t,drop:pod.drop});
   }
   if(this.t>=WAVE_SECONDS&&this.next===ARRIVALS.length&&!this.pending.length){this.phase='approach';this.timer=0;g.audit.push({kind:'approach',at:this.t});}
  }else if(this.phase==='approach'){
   this.timer+=dt;
   const threats=g.enemies.some(e=>!e.dead&&(e.missionRegular||['coastBomb','rollingCharge'].includes(e.type)))||g.enemyShots.length>0;
   // Ordinary actors naturally leave in under 24 s. This guard also bounds
   // an unexpected stuck actor without letting it fire through the name card.
   if(!threats||this.timer>=24){
    if(threats){for(const e of g.enemies)if(e.missionRegular||['coastBomb','rollingCharge'].includes(e.type))e.dead=true;g.enemies=g.enemies.filter(e=>!e.dead);g.enemyShots=[];g.audit.push({kind:'approachFallback',at:this.t});}
    this.phase='warning';this.timer=0;g.startWarning();
   }
  }else if(this.phase==='warning'){
   this.timer+=dt;
   if(this.timer>=3){this.phase='boss';g.spawnEnemy('breakwater',214,0);g.audit.push({kind:'bossArrival',at:g.time,waveTime:this.t});}
  }
 }
}
export class MissionGame extends BossGame{
 get level(){return SCENE;}
 reset(){super.reset();this.regularWarnAt=-10;this.regularShotAt=-10;this.runner=new MissionRunner(this);}
 spawnEnemy(type,x,y,opts={}){
  if(type==='twinDart'&&opts.persistentEscort)return spawn(this,type,x,y,opts,MISSION_ESCORT);
  if(TYPES[type])return spawn(this,type,x,y,opts);
  const e=super.spawnEnemy(type,x,y,opts);if(type==='breakwater')e.T=MISSION_BOSS;
  if(type==='rollingCharge'&&opts.direction===1)e.T=RIGHT_CHARGE;return e;
 }
 // Use the native boss-weapon fallback for a full special. Drawing and
 // collection both resolve this, so the shown reward always matches the gift.
 resolvePickup(kind){
  if(kind==='ammo'&&this.weapons.kind)return this.weaponPick();
  return super.resolvePickup(kind);
 }
 drawPlayer(c,snap){
  const draw=c.drawImage;
  c.drawImage=function(img,...args){return draw.call(this,img===SPRITES.player?HERO:img,...args);};
  try{super.drawPlayer(c,snap);}finally{c.drawImage=draw;}
 }
 // Boss patterns explicitly pass true; regular weapons keep native ownership.
 fireShot(x,y,angle,speed,kind='orb',byBoss=false){
  const boost=byBoss?1:1.2+Math.min(2,Math.floor((this.runner?.t||0)/60))*.05;
  return super.fireShot(x,y,angle,speed*boost,kind,byBoss);
 }
 killEnemy(e){
  super.killEnemy(e);
  // The reused regular hazards have no dead-update guard. Retire a killed
  // actor immediately so a last-frame shootdown cannot release a later burst.
  this.enemies=this.enemies.filter(other=>other!==e);
 }
 startWarning(){this.reachedBoss=true;this.warning={t:0};sfx.warning();this.audit.push({kind:'bossWarning',at:this.time});}
 retryBoss(){
  if(!this.reachedBoss)return false;
  this.reset();this.reachedBoss=true;this.runner.t=WAVE_SECONDS;this.runner.next=ARRIVALS.length;this.runner.pod=SUPPLIES.length;this.runner.phase='approach';
  return true;
 }
 drawHud(c){super.drawHud(c);if(!this.boss)drawText(c,this.runner.phase==='waves'?'W'+Math.min(3,Math.floor(this.runner.t/60)+1):'BOSS',145,2,PAL.amberLight);}
}
