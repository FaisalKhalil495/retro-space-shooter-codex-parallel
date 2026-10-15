// Breakwater-only hazards. Native player weapons, shots and terrain stay intact.
import { detailCanvas } from '../../js/detail.js?v=0.29.0';
import { clamp, rectsOverlap } from '../../js/util.js?v=0.29.0';
import { sfx } from '../../js/audio.js?v=0.29.0';
const cached=(w,h,paint)=>{const {canvas,ctx}=detailCanvas(w,h);paint(ctx);return canvas;};
const poly=(c,p,color)=>{c.fillStyle=color;c.beginPath();c.moveTo(...p[0]);for(const v of p.slice(1))c.lineTo(...v);c.closePath();c.fill();};
export const CLUSTER_ART=cached(8,6,c=>{
  poly(c,[[0,2],[2,0],[6,0],[8,2],[8,4],[6,6],[2,6],[0,4]],'#18242c');
  c.fillStyle='#9b7953';c.fillRect(1,2,6,2);c.fillStyle='#c9c5ac';c.fillRect(2,.5,4,1);c.fillRect(2,4.5,4,1);
  c.fillStyle='#657274';c.fillRect(3,1.5,2,3);c.fillStyle='#e0dcc1';c.fillRect(3,1.5,2,.5);
});
const CLUSTER_FLASH=cached(8,6,c=>{c.drawImage(CLUSTER_ART.hi,0,0,8,6);c.globalCompositeOperation='source-in';c.fillStyle='#e0dcc1';c.fillRect(0,0,8,6);});
export const LANCE_ART=cached(16,6,c=>{
  poly(c,[[0,3],[5,0],[11,0],[16,2],[13,3],[16,5],[11,6],[5,6]],'#18242c');
  c.fillStyle='#a6c9d3';c.fillRect(5,.5,6,5);
  poly(c,[[1,3],[5,1],[10,1],[14,2.5],[10,4],[5,5]],'#e8eee5');
  c.fillStyle='#657274';c.fillRect(7,4,4,1);c.fillStyle='#c9e0e3';c.fillRect(4,2,7,1);
});
export const SPIKE_ART=cached(10,116,c=>{
  poly(c,[[5,0],[7,10],[8,17],[7,26],[10,37],[8,48],[9,63],[8,76],[10,93],[9,116],[1,116],[0,94],[2,79],[1,61],[2,46],[0,32],[2,20],[3,9]],'#18242c');
  c.fillStyle='#18242c';c.fillRect(3.5,4,3,112);
  poly(c,[[5,3],[6,12],[7,34],[7,114],[2,114],[3,49],[3,22]],'#a6c9d3');
  poly(c,[[5,6],[5.5,21],[5.5,114],[3.5,114],[4,31]],'#e8eee5');
  for(let y=29;y<111;y+=19){c.fillStyle='#657274';c.fillRect(6,y,1,6);c.fillStyle='#c9e0e3';c.fillRect(2.5,y+9,1,8);}
});
const BURST_ART=cached(18,18,c=>{
  poly(c,[[9,0],[12,3],[16,2],[15,6],[18,9],[15,12],[16,16],[12,15],[9,18],[6,15],[2,16],[3,12],[0,9],[3,6],[2,2],[6,3]],'#9b7953');
  c.fillStyle='#d99b43';c.beginPath();c.arc(9,9,8,0,Math.PI*2);c.fill();
  c.fillStyle='#e0dcc1';c.beginPath();c.arc(9,9,6,0,Math.PI*2);c.fill();
});
export const circleHit=(cx,cy,r,x,y,w,h)=>{
  const dx=Math.max(x-cx,0,cx-x-w),dy=Math.max(y-cy,0,cy-y-h);return dx*dx+dy*dy<r*r;
};
const log=(g,e,kind,extra={})=>g.audit.push({time:g.time,id:e.id,kind,...extra});
const canHurt=g=>g.state==='playing'&&g.player.entering<=0&&g.player.invuln<=0;
export const mortarPoint=(e,k)=>({x:(1-k)*(1-k)*e.sx+2*(1-k)*k*(e.sx+e.tx)/2+k*k*e.tx,
  y:(1-k)*(1-k)*e.sy+2*(1-k)*k*Math.max(18,Math.min(e.sy,e.ty)-35)+k*k*e.ty});
export function drawMortarMark(c,x,y,snap,lit=true){
  c.save();
  c.strokeStyle=lit?'#d99b43':'#9b7953';c.lineWidth=.5;c.beginPath();c.arc(snap(x),snap(y),8,0,Math.PI*2);c.stroke();
  c.fillStyle='#e0dcc1';c.fillRect(snap(x)-2,snap(y),4,.5);c.fillRect(snap(x),snap(y)-2,.5,4);
  c.restore();
}
export const CLUSTER_SHELL={
  hp:3,score:10,noTarget:true,ram:3,gore:{metal:3},explodeSize:.4,
  init(e){e.w=8;e.h=6;},
  update(e,dt,g){
    if(e.dead)return;
    const k=Math.min(1,e.t/.85),p=mortarPoint(e,k);e.x=p.x-4;e.y=p.y-3;
    if(k<1)return;
    e.dead=true;g.spawnEnemy('clusterBurst',p.x-9,p.y-9,{byBoss:true});
    g.blasts.blast(p.x,p.y,1.1);log(g,e,'clusterBurst',{x:p.x,y:p.y});sfx.explode(.8);
    const h=g.playerHitbox();if(canHurt(g)&&circleHit(p.x,p.y,8,h.x,h.y,h.w,h.h))g.hurtPlayer(3,e);
    // A fatal impact can clear this pattern during the same update. Never
    // release fragments after that cleanup or after a phase/death interruption.
    if(g.state!=='playing'||g.boss?.mode!=='fight'||!g.bossMayAttack(g.boss))return;
    for(let i=0;i<6;i++){const s=g.fireShot(p.x,p.y,-Math.PI/2+i*Math.PI/3,100+e.phase*6,'orb',true);s.cluster=true;}
  },
  hitTest(e,x,y,w,h){return circleHit(e.x+4,e.y+3,2.5,x,y,w,h)?'hit':null;},
  draw(e,c,snap){
    drawMortarMark(c,e.tx,e.ty,snap,Math.floor(e.t*12)%2===0);
    c.drawImage(e.flash>0?CLUSTER_FLASH:CLUSTER_ART,snap(e.x),snap(e.y));
    c.fillStyle=Math.floor(e.t*16)%2?'#d99b43':'#e0dcc1';c.fillRect(snap(e.x+3.5),snap(e.y+2.5),1,1);
  }
};
const visual={hp:Infinity,score:0,noTarget:true,noDrop:true,harmless:true,hitTest:()=>null,shotTest:()=>null,isVulnerable:()=>false};
export const CLUSTER_BURST={...visual,
  init(e){e.w=e.h=18;},
  update(e){if(e.t>=.20)e.dead=true;},
  draw(e,c,snap){c.save();c.globalAlpha=clamp(1-e.t/.20,0,1);c.drawImage(BURST_ART,snap(e.x),snap(e.y));c.restore();}
};
export const ruptureHeight=e=>e.t<.12?119*e.t/.12:e.t<.46?119:119*(.66-e.t)/.20;
export const ruptureRect=e=>{const h=clamp(ruptureHeight(e),0,119);return {x:e.x+3.5,y:130-h+5,w:3,h:Math.max(0,h-5)};};
export const GLACIER_RUPTURE={...visual,
  init(e){e.w=10;e.h=119;e.y=11;},
  update(e,dt,g){
    if(e.dead)return;
    if(e.t>=.66){e.dead=true;g.blasts.dust(e.x+5,128,.4);return;}
    if(e.t>=.46)return; // Shrinking shards are harmless.
    const r=ruptureRect(e),p=g.playerHitbox();
    if(!e.struck&&canHurt(g)&&r.h>0&&rectsOverlap(r.x,r.y,r.w,r.h,p.x,p.y,p.w,p.h)){e.struck=true;g.hurtPlayer(3,e);}
  },
  draw(e,c,snap){const h=clamp(ruptureHeight(e),0,119);if(h>0)c.drawImage(SPIKE_ART,snap(e.x),snap(130-h),10,h);}
};
export function drawLances(g,c,snap){
  c.save();c.beginPath();c.rect(0,11,208,119);c.clip();
  for(const s of g.enemyShots){if(!s.iceLance)continue;
    c.save();c.translate(snap(s.x),snap(s.y));c.rotate(Math.atan2(s.vy,s.vx)-Math.PI);c.drawImage(LANCE_ART,-8,-3);c.restore();
  }
  c.restore();
}
