import { detailCanvas, grit } from '../../js/detail.js?v=0.29.0';
import { GROUND_SPEED } from '../../js/terrain.js?v=0.29.0';

// Scenery only. No Game, enemy, projectile, audio, timer or simulation RNG
// references: a distant casualty can never hit the player or alter the fight.
const W = 225, H = 150, Y = -8, FLOOR = 130;
const art = new Image();
export const battleReady = new Promise((resolve, reject) => {
  art.onload = resolve;
  art.onerror = () => reject(new Error('Invasion landscape could not load'));
});
art.src = globalThis.__battleEmbeddedArt || new URL('assets/invasion-world.png?battle=1', document.baseURI).href;
const mod = (n, d) => ((n % d) + d) % d;
const fine = n => Math.round(n * 2) / 2;
function paint(w, h, fn) {
  const { canvas, ctx } = detailCanvas(w, h);
  fn(ctx); return canvas;
}
function poly(c, color, points) {
  c.fillStyle = color; c.beginPath();
  points.forEach(([x,y],i) => i ? c.lineTo(x,y) : c.moveTo(x,y));
  c.closePath(); c.fill();
}
function invader() {
  return paint(32, 14, c => {
    poly(c,'#40536a',[[0,6],[13,1],[21,2],[32,9],[20,12],[7,10]]);
    poly(c,'#637c95',[[1,6],[13,1],[21,2],[23,5],[14,7]]);
    poly(c,'#8196a9',[[13,1],[15,1.5],[18,5.5],[14,6.5]]);
    poly(c,'#50647e',[[18,5.5],[23,5],[31,8.5],[20,9]]);
    poly(c,'#354b64',[[1,7],[14,8],[20,12],[7,10]]);
    c.fillStyle='#9bafbf'; c.fillRect(5,5.5,6,.5); c.fillRect(20,5.5,4,.5);
    c.fillStyle='#3e556e'; c.fillRect(18,3,3,.5); c.fillRect(9,7.5,11,.5);
    c.fillStyle='#71879c'; c.fillRect(8,8.5,2,.5); c.fillRect(24,8,3,.5);
    c.fillStyle='#b1b6aa'; c.fillRect(4,7,.5,.5); c.fillRect(5.5,7,.5,.5);
    c.fillStyle='#33495e'; c.fillRect(12,10,2,2); c.fillRect(16,10.5,2,2); c.fillRect(20,10,2,2);
  });
}
function defender() {
  return paint(14, 7, c => {
    poly(c,'#637e95',[[0,1],[5,2],[7,0],[9,2.5],[14,3.5],[10,5],[7,7],[5,5],[0,6],[2,3.5]]);
    poly(c,'#d8e4e4',[[1,1.5],[5.5,2.5],[7,1],[8,3],[13,3.5],[8,4.5],[7,6],[5,4.5],[1,5],[3,3.5]]);
    c.fillStyle='#799bb0'; c.fillRect(7,3,3,1); c.fillRect(3,3,3,1.5);
    c.fillStyle='#9d7971'; c.fillRect(4,2,1,1); c.fillRect(4,4.5,1,1);
    c.fillStyle='#e8ded0'; c.fillRect(0,3,1.5,1);
  });
}
function puff(frame, hot = false) {
  return paint(14, 14, c => {
    const radius = 1 + frame * .5;
    for (let y=0;y<14;y+=.5) for(let x=0;x<14;x+=.5) {
      const d=Math.hypot(x-7,y-7), n=grit(x*2,y*2,frame+873);
      if(d>radius+(n-.5)*1.5) continue;
      c.fillStyle=hot ? (d<radius*.35?'#edcf96':d<radius*.7?'#ce9767':'#9e7667') : (n>.7?'#8295a4':n>.25?'#657e92':'#506c83');
      c.fillRect(x,y,.5,.5);
    }
  });
}
function flame(frame) {
  return paint(5, 9, c => {
    poly(c,'#b2876c',[[0,1],[4,1],[3.5,5+frame%3],[2,9-frame%2],[.5,5]]);
    poly(c,'#e4b77c',[[.5,1],[3,1],[2.5,6+frame%2],[1.5,7],[1,4]]);
    c.fillStyle='#eee0b5';c.fillRect(1,1,1,3+frame%2);
  });
}
function snowFloor() {
  return paint(416,14,c=>{
    for(let x=0;x<416;x+=.5) for(let y=0;y<14;y+=.5) {
      const drift=4+Math.sin(x/18)*1.1+Math.sin(x/6)*.7, n=grit(x*2,y*2,605);
      c.fillStyle=y<1?'#edf4ef':y<drift?(n>.86?'#f4f7ef':'#dce8e5'):y<8?'#b3cdd6':n>.8?'#a6c9d5':'#7ba9be';
      c.fillRect(x,y,.5,.5);
    }
    for(let x=18;x<416;x+=35){
      c.fillStyle='#92b8c8';c.fillRect(x-5,5,9,.5);
      c.fillStyle='#4e819f';for(let y=8;y<14;y+=.5)c.fillRect(x+Math.floor((y-8)/2)*.5,y,.5,.5);
    }
  });
}

// All positions derive from the fixed-step game clock. Restart is t=0,
// pausing freezes everything, and repeated drawing never advances an event.
// Battle cycles are staggered, keeping several distant engagements in view.
export function battleState(t) {
  const invaders = [
    {x:mod(55-t*2.2,284)-30,y:20+Math.sin(t*.22)*1.3,s:1},
    {x:mod(151-t*1.6,284)-30,y:28+Math.sin(t*.18+1),s:.73},
    {x:mod(252-t*2.8,284)-30,y:18+Math.sin(t*.2+2),s:.52},
    {x:mod(210-t*3.4,284)-30,y:44+Math.sin(t*.25),s:.43},
  ];
  const defenders = [0,1,2,3].map(i=>({
    x:mod(t*(6+i*.6)+i*64,264)-24,
    y:37+(i%2)*13+Math.sin(t*.5+i)*1.7,s:.5+(i%2)*.15,
  }));
  const casualties=[0,1,2].map(i=>{
    const age=mod(t+i*10+7,30), hit=6, fall=Math.max(0,age-hit);
    const impact=10.5;
    return {age,hit,impact,visible:age<impact,
      x:35+i*63+Math.min(age,impact)*1.6,
      y:31+i*4+Math.min(fall,impact-hit)**2*((60-i*.5-31-i*4)/(impact-hit)**2),
      angle:fall*.16,s:.85,burning:age>=hit&&age<impact,
      blast:age>=hit&&age<hit+.9,groundBlast:age>=impact&&age<impact+1,
    };
  });
  return {invaders,defenders,casualties};
}

export class BattlefieldBackground {
  constructor() {
    this.t=0; this.loaded=false;
    battleReady.then(()=>{
      this.world=paint(W,H,c=>{
        c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
        c.drawImage(art,0,0,W,H);
      });
      this.invader=invader();this.defender=defender();this.snow=snowFloor();
      this.smoke=Array.from({length:12},(_,i)=>puff(i));
      this.blast=Array.from({length:12},(_,i)=>puff(i,true));
      this.flames=Array.from({length:4},(_,i)=>flame(i));
      this.fragment=paint(4,3,c=>{
        poly(c,'#718a9b',[[0,0],[4,1],[2.5,3],[0,2]]);
        poly(c,'#b8c9ce',[[0,0],[4,1],[1,1.5]]);
      });
      this.loaded=true;
    }).catch(()=>{}); // main.js provides reload when artwork fails.
  }
  update(dt) { this.t+=dt; }
  draw(c,snap) {
    c.save();c.beginPath();c.rect(0,11,208,133);c.clip();
    c.fillStyle='#7eacd1';c.fillRect(0,11,208,133);
    if(!this.loaded){c.restore();return;}
    const t=this.t, pan=snap(8+Math.sin(t*.025)*7);
    c.drawImage(this.world,-pan,Y);
    // A low-contrast, far-scale battle; every tracer and explosion stays
    // in the horizon/sky. Foreground enemies are drawn later by native Game.
    c.save();c.beginPath();c.rect(0,11,208,60);c.clip();
    const state=battleState(t), flameFrame=this.flames[Math.floor(t*12)%4];
    const ship=(sprite,x,y,s,angle=0)=>{
      c.save();c.translate(snap(x-pan),snap(y));c.rotate(angle);c.scale(s,s);
      c.globalAlpha=.82;c.drawImage(sprite,0,0);c.restore();
    };
    const exhaust=(x,y,s,angle=0)=>{
      c.save();c.translate(snap(x-pan),snap(y));c.rotate(angle);c.globalAlpha=.65;
      c.drawImage(flameFrame,0,0,3*s,6*s);c.restore();
    };
    const smoke=(x,y,age,seed)=>{
      for(let i=0;i<12;i++){
        const a=mod(age+i/3,4),size=3+a*1.8;
        c.globalAlpha=(1-a/4)*.58;
        const px=x-pan-a*4.5+Math.sin(seed+i)*1.2,py=y-a*6.4;
        c.drawImage(this.smoke[Math.min(11,Math.floor(a*3))],snap(px-size/2),snap(py-size/2),size,size);
      }
      c.globalAlpha=1;
    };
    const explosion=(x,y,age,scale=1)=>{
      const frame=Math.min(11,Math.floor(age*13)),size=(6+age*12)*scale;
      c.globalAlpha=Math.max(0,.78-age*.65);
      c.drawImage(this.blast[frame],snap(x-pan-size/2),snap(y-size/2),size,size);
      c.globalAlpha=1;
    };
    const line=(x,y,tx,ty,phase,color)=>{
      // A single short streak, never a long beam resembling a boss warning.
      const dx=tx-x,dy=ty-y,len=Math.hypot(dx,dy), tail=Math.max(0,phase-2.2/len);
      c.strokeStyle=color;c.lineWidth=.5;c.globalAlpha=.5;c.beginPath();
      c.moveTo(fine(x-pan+dx*tail),fine(y+dy*tail));c.lineTo(fine(x-pan+dx*phase),fine(y+dy*phase));c.stroke();c.globalAlpha=1;
    };
    state.invaders.forEach((s,i)=>{
      ship(this.invader,s.x,s.y,s.s);
      for(const port of [12,16,20])exhaust(s.x+port*s.s,s.y+11*s.s,s.s);
      if(i===1){
        const hit=mod(t+4,19);
        if(hit<.75)explosion(s.x+17*s.s,s.y+5*s.s,hit,.65);
        if(hit<8)smoke(s.x+17*s.s,s.y+5*s.s,t,9);
      }
      const target=state.defenders[i];
      line(s.x+4*s.s,s.y+8*s.s,target.x+6,target.y+3,mod(t*1.3+i*.23,1),'#b9b0a0');
    });
    state.defenders.forEach((s,i)=>{
      exhaust(s.x,s.y+3,s.s,Math.PI/2);ship(this.defender,s.x,s.y,s.s);
      const target=state.invaders[i];
      line(s.x+13*s.s,s.y+3*s.s,target.x+14*target.s,target.y+7*target.s,mod(t*1.7+i*.27,1),'#d8d8bb');
    });
    // The local army's losses have a visible cause: a converging incoming
    // shot, a hull hit, then a burning descending ship and drifting smoke.
    state.casualties.forEach((s,i)=>{
      if(s.visible){
        if(s.age>s.hit-.75&&s.age<s.hit)line(s.x+32,s.y-12,s.x+6,s.y+3,(s.age-s.hit+.75)/.75,'#c2ad96');
        if(s.burning){smoke(s.x+2,s.y+1,t,i);exhaust(s.x+2,s.y+2,1.5,-.5);}
        ship(this.defender,s.x,s.y,s.s,s.angle);
        if(s.blast)explosion(s.x+4,s.y+2,s.age-s.hit,.8);
      }
      if(s.age>=s.hit&&s.age<s.impact+1){
        const a=s.age-s.hit;
        for(let j=0;j<3;j++){
          c.save();c.globalAlpha=.65;c.translate(snap(s.x-pan+4+(j-1)*a*2),snap(31+i*4+a*a*.8));
          c.rotate(a*(j%2?1:-1));c.drawImage(this.fragment,0,0,2.2,1.7);c.restore();
        }
      }
      const impactY=60-i*.5;
      if(s.groundBlast)explosion(s.x+4,impactY,s.age-s.impact,1.1);
      if(s.age>=s.impact&&s.age<s.impact+4)smoke(s.x+4,impactY,s.age-s.impact,i);
    });
    // Ground batteries belong to the pictured local defenses. Distant
    // shells arc up from the existing gun tips; impacts remain background.
    for(let i=0;i<4;i++){
      const x=[23,86,148,210][i], y=[51,51,52,52][i],a=mod(t*.58+i*.31,1);
      line(x,y,x+24,y-26,a,'#d2c8ad');
      if(a<.09)explosion(x,y,a*2,.28);
      const hit=mod(t+i*1.7,6);
      if(hit<.65)explosion(x+20,y-25,hit,.6);
      if(hit>.65&&hit<2)smoke(x+20,y-25,hit,i);
    }
    c.restore();
    // Reflected daylight moves on the frozen lake, below the distant battle.
    c.globalAlpha=.12;c.fillStyle='#d1e6ee';
    for(let i=0;i<9;i++){
      const x=mod(i*29-t*(.65+i*.02),240)-16,y=103+i*2.7;
      c.fillRect(snap(x),fine(y),5+Math.sin(t*.7+i)*2,.5);
    }
    c.globalAlpha=1;
    const x=-snap(mod(t*GROUND_SPEED,416));
    c.drawImage(this.snow,x,FLOOR);
    if(x+416<208)c.drawImage(this.snow,x+416,FLOOR);
    c.restore();
  }
}
