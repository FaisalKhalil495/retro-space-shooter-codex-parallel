import { detailCanvas } from '../../js/detail.js?v=0.29.0';
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
export const HUNTER_TORPEDO={
 hp:2,score:15,noTarget:true,ram:2,gore:{metal:2},explodeSize:.3,
 init(e){e.w=7;e.h=4;e.mode='hunt';e.trail=0;e.hunt=e.hunt??.85;e.phase=e.phase||1;},
 update(e,dt,g){
  if(e.dead)return;
  if(e.mode==='hunt'&&e.t>.22){
   if(e.t<e.hunt+.22){
    const p=g.playerCenter(),want=Math.atan2(p.y-e.y-2,p.x-e.x-3.5);
    const delta=Math.atan2(Math.sin(want-e.angle),Math.cos(want-e.angle));
    e.angle+=clamp(delta,-1.8*dt,1.8*dt);
   }else{
    e.mode='locked';e.lockAt=g.time;e.lockAngle=e.angle;
    g.audit.push({time:g.time,id:e.id,kind:'torpedoLock',phase:e.phase,angle:e.angle});sfx.tick();
   }
  }
  const speed=e.mode==='hunt'?68+e.phase*6:104+e.phase*8;
  e.vx=Math.cos(e.angle)*speed;e.vy=Math.sin(e.angle)*speed;
  e.x+=e.vx*dt;e.y+=e.vy*dt;
  if((e.trail-=dt)<=0){e.trail=.10;g.burst(e.x+3.5-Math.cos(e.angle)*4,e.y+2-Math.sin(e.angle)*4,1,5,['#9b7953','#d99b43']);}
  if(e.t>=3.6||e.y+2>=128||e.y+2<11||e.x<-9||e.x>210){e.dead=true;g.blasts.blast(e.x+3.5,e.y+2,.18);}
 },
 // Emerging missiles are shootable immediately, but don't ram for 0.22s.
 shotTest:circle,hitTest:(e,...r)=>e.t>=.22?circle(e,...r):null,
 draw(e,c,snap){
  c.save();c.translate(snap(e.x+3.5),snap(e.y+2));c.rotate(e.angle-Math.PI);
  c.drawImage(e.flash>0?TORPEDO_FLASH:TORPEDO_ART,-3.5,-2);
  c.fillStyle=e.mode==='hunt'&&Math.floor(e.t*14)%2?'#d99b43':'#e0dcc1';
  c.fillRect(-1.5,-.5,1,1);c.restore();
 }
};
