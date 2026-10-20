import { detailCanvas } from '../../js/detail.js?v=0.29.0';
import { PLAYER } from '../../js/config.js?v=0.29.0';
import { clamp } from '../../js/util.js?v=0.29.0';
import { sfx } from '../../js/audio.js?v=0.29.0';
// Original compact missile, pointing left. The solid center contains the
// 1.5px hurt circle at every angle; the fins and exhaust are harmless.
const paint=flash=>{
  const {canvas,ctx:c}=detailCanvas(7,4);
  c.fillStyle=flash?'#e0dcc1':'#18242c';c.beginPath();
  c.moveTo(0,2);c.lineTo(2,0);c.lineTo(5,0);c.lineTo(7,1);c.lineTo(6,2);c.lineTo(7,3);c.lineTo(5,4);c.lineTo(2,4);c.closePath();c.fill();
  c.fillStyle=flash?'#e0dcc1':'#c9c5ac';c.fillRect(2,.5,3,3);
  c.fillStyle=flash?'#e0dcc1':'#96977b';c.fillRect(3,1,2,2);
  c.fillStyle=flash?'#e0dcc1':'#9b7953';c.fillRect(1,1.5,1,1);
  c.fillStyle='#e0dcc1';c.fillRect(2.5,.5,2,.5);
  const hi=canvas.hi.getContext('2d'),im=hi.getImageData(0,0,14,8);
  for(let i=0;i<im.data.length;i+=4)im.data[i+3]=im.data[i+3]>=128?255:0;
  hi.putImageData(im,0,0);return canvas;
};
export const TORPEDO_ART=paint(false),TORPEDO_FLASH=paint(true);
const circle=(e,x,y,w,h)=>{
  const cx=e.x+3.5,cy=e.y+2;
  const dx=Math.max(x-cx,0,cx-x-w),dy=Math.max(y-cy,0,cy-y-h);
  return dx*dx+dy*dy<2.25?'hit':null;
};
export const HUNT=[0,2,2.3,2.6],TURN=[0,6.1,7,8.1],LEAD=[0,.14,.17,.20];
export const HUNT_SPEED=[0,132,152,172],LOCK_SPEED=[0,148,166,184],EJECT=.12,LIFETIME=4.5;
export const HUNTER_TORPEDO={
 hp:2,score:15,noTarget:true,ram:2,gore:{metal:2},explodeSize:.3,
 init(e,g){e.w=7;e.h=4;e.mode='hunt';e.trail=0;e.phase=e.phase||1;e.hunt=e.hunt??HUNT[e.phase];e.lastPlayer=g.playerCenter();},
 update(e,dt,g){
  if(e.dead)return;
  const p=g.playerCenter(),last=e.lastPlayer||p;
  const vx=clamp((p.x-last.x)/dt,-PLAYER.speed,PLAYER.speed),vy=clamp((p.y-last.y)/dt,-PLAYER.speed,PLAYER.speed);
  e.lastPlayer=p;
  if(e.mode==='hunt'&&e.t>EJECT){
   if(e.t<e.hunt+EJECT){
    const tx=clamp(p.x+vx*LEAD[e.phase],8,200),ty=clamp(p.y+vy*LEAD[e.phase],16,123);
    const want=Math.atan2(ty-e.y-2,tx-e.x-3.5);
    e.aimX=tx;e.aimY=ty;
    const delta=Math.atan2(Math.sin(want-e.angle),Math.cos(want-e.angle));
    e.angle+=clamp(delta,-TURN[e.phase]*dt,TURN[e.phase]*dt);
   }else{
    e.mode='locked';e.lockAt=g.time;e.lockAngle=e.angle;
    g.audit.push({time:g.time,id:e.id,kind:'torpedoLock',phase:e.phase,angle:e.angle});sfx.tick();
   }
  }
  const speed=e.mode==='hunt'?HUNT_SPEED[e.phase]:LOCK_SPEED[e.phase];
  e.vx=Math.cos(e.angle)*speed;e.vy=Math.sin(e.angle)*speed;
  e.x+=e.vx*dt;e.y+=e.vy*dt;
  if((e.trail-=dt)<=0){e.trail=.10;g.burst(e.x+3.5-Math.cos(e.angle)*4,e.y+2-Math.sin(e.angle)*4,1,5,['#9b7953','#d99b43']);}
  if(e.t>=LIFETIME||e.y+2>=128||e.y+2<11||e.x<-9||e.x>210){e.dead=true;g.blasts.blast(e.x+3.5,e.y+2,.18);}
 },
 // The short upward ejection clears the roof before guidance/contact starts.
 shotTest:circle,hitTest:(e,...r)=>e.t>=EJECT?circle(e,...r):null,
 draw(e,c,snap){
  c.save();c.translate(snap(e.x+3.5),snap(e.y+2));c.rotate(e.angle-Math.PI);
  c.drawImage(e.flash>0?TORPEDO_FLASH:TORPEDO_ART,-3.5,-2);
  c.fillStyle=e.mode==='hunt'&&Math.floor(e.t*14)%2?'#d99b43':'#e0dcc1';
  c.fillRect(-1.5,-.5,1,1);c.restore();
 }
};
