import { VIEW_W, HUD_H, PAL } from '../../js/config.js?v=0.29.0';
import { clamp, rectsOverlap } from '../../js/util.js?v=0.29.0';
import { sfx } from '../../js/audio.js?v=0.29.0';
import { picture, hullContact, WIDTH, HEIGHT, SHELL } from './art.js?boss=3';
import { updateBreakup, drawBreakup } from './wreck.js?boss=3';
import { target } from '../glacier-combat/art.js?combat=3';
export const MOVES=[null,['broadside','torpedoes','flak','skip'],
  ['ice','darts','broadside','torpedoes','flak','skip'],
  ['rushFlak','pursuit','rush','torpedoes','broadside','ice','darts','flak','skip']];
export const REST=[0,.45,.30,.18];
const LEFT=[0,104,90,76],INTRO=[0,4,2,2];
export const log=(g,e,kind,extra={})=>g.audit.push({time:g.time,id:e.id,kind,phase:e.phase,...extra});
const muzzle=e=>({x:e.x+1,y:e.y+15});
const localThreat=e=>e.type==='twinDart'||e.type==='skipShell'||e.type==='hunterTorpedo';
export function clearThreats(g){
  g.enemyShots=[];g.enemies=g.enemies.filter(e=>{if(!localThreat(e))return true;e.dead=true;return false;});
}
const threats=g=>g.enemyShots.length>0||g.enemies.some(e=>!e.dead&&localThreat(e));
const move=(e,x,speed,dt)=>{e.x+=clamp(x-e.x,-speed*dt,speed*dt);return Math.abs(e.x-x)<.1;};
const rushing=a=>a.name==='rush'||a.name==='rushFlak';
function set(e,mode){e.mode=mode;e.timer=0;}
function saySafe(g,e,text,style='talk'){clearThreats(g);g.say(e,text,style);}
function markedX(x,e){x=clamp(x,14,190);if(x>e.x-9&&x<e.x+e.w+9)return clamp(e.x-20,14,190);return x;}
function iceMarks(e,g){
  const first=markedX(g.playerCenter().x,e);
  const alternatives=[first+48,first-48,190,14].map(x=>markedX(clamp(x,14,190),e));
  return [first,alternatives.find(x=>Math.abs(first-x)>=44)];
}
// Introduce each phase's new tools first; afterwards respond to position,
// avoiding the last two attacks and keeping combined attacks three apart.
export function chooseAttack(e,g){
  const moves=MOVES[e.phase],recent=e.recent||[],intro=e.introIndex||0;
  if(intro<INTRO[e.phase])return moves[intro];
  const options=moves.filter(n=>!recent.slice(-2).includes(n)&&
    (!['pursuit','rushFlak'].includes(n)||!recent.slice(-3).some(v=>['pursuit','rushFlak'].includes(v))));
  const p=g.playerCenter();
  if(e.phase===3&&!recent.some(n=>n==='rushFlak'||n==='pursuit'))return p.y<62?'pursuit':'rushFlak';
  if(e.phase>=2&&p.y<62&&options.includes('darts'))return 'darts';
  if(e.phase>=2&&p.y>94&&options.includes('ice'))return 'ice';
  const weighted=options.map(n=>({name:n,weight:1+(p.x<30&&['torpedoes','flak'].includes(n)?2:0)+
    (p.x>e.x-35&&['rush','rushFlak'].includes(n)?2:0)}));
  let pick=g.rand()*weighted.reduce((s,v)=>s+v.weight,0);
  for(const v of weighted){pick-=v.weight;if(pick<=0)return v.name;}
  return weighted.at(-1)?.name||moves.find(n=>n!==recent.at(-1));
}
export function beginAttack(e,g,name){
  if(!MOVES[e.phase].includes(name)||g.state!=='playing'||!g.bossMayAttack(e)||threats(g))return false;
  const p=g.playerCenter(),m=muzzle(e);
  const a=e.attack={name,t:0,stage:'warn',warn:name==='rushFlak'||name==='flak'?1.15:name==='rush'||name==='skip'?1:[0,.95,.85,.75][e.phase]};
  a.rear=p.x>e.x+e.w/2;a.mx=a.rear?e.x+e.w-2:m.x;a.my=a.rear?e.y+8:m.y;
  a.angle=Math.atan2(p.y-a.my,p.x-a.mx);
  if(name==='torpedoes'||name==='pursuit'){a.count=name==='pursuit'?2:e.phase+1;a.sent=0;a.warn=[0,1,.85,.7][e.phase];}
  if(name==='flak'||name==='rushFlak'){a.gap=clamp(p.y+(p.y>72?-32:32),30,name==='rushFlak'?88:111);a.wallX=e.x-4;}
  if(name==='skip'){
    a.sx=e.x-3;a.tx=clamp(p.x-18,12,188);a.amp=clamp(126-p.y,28,88);
    a.path=Array.from({length:25},(_,i)=>skipPoint(a,i/24));
  }
  if(name==='ice')a.marks=iceMarks(e,g);
  if(rushing(a)){a.left=clamp(p.x-18,30,72);a.home=144;}
  const intro=e.introIndex||0;if(intro<INTRO[e.phase]&&MOVES[e.phase][intro]===name)e.introIndex=intro+1;
  e.recent=[...(e.recent||[]),name].slice(-4);
  log(g,e,'chosen',{attack:name,playerX:p.x,playerY:p.y});
  log(g,e,'warn',{attack:name,duration:a.warn,angle:a.angle,mx:a.mx,my:a.my,marks:a.marks,path:a.path,gap:a.gap,wallX:a.wallX,count:a.count});
  sfx.charge(a.warn);return true;
}
export function skipPoint(a,k){return {x:a.sx+(a.tx-a.sx)*k,y:126-Math.abs(Math.sin(k*Math.PI*2))*a.amp};}
function broadside(e,g,a){
  for(let i=0;i<5;i++)g.fireShot(a.mx,a.my,a.angle+(i-2)*.22,89+e.phase*9,i===2?'shell':'orb',true).dmg=i===2?2:1;
  sfx.cannon();
}
function flak(e,g,a){
  for(let y=14;y<=126;y+=7)if(Math.abs(y-a.gap)>16)g.fireShot(a.wallX,y,Math.PI,86+e.phase*6,'icicle',true);
  sfx.shatter();
}
function ice(e,g,a){
  for(const x of a.marks){g.blasts.blast(x,126,.4);for(let i=0;i<3;i++)g.fireShot(x,125,-Math.PI/2+(i-1)*.10,70+e.phase*3,'icicle',true);}
  sfx.shatter();
}
function launchTorpedo(e,g,a){
  const p=g.playerCenter(),cx=a.rear?Math.min(200,e.x+e.w-2):e.x-4,cy=e.y+(a.rear?6:15);
  let angle=Math.atan2(p.y-cy,p.x-cx);
  if(!a.rear&&angle>0)angle-=Math.PI*2;
  angle=a.rear?-Math.PI/2+(a.sent%2?-.15:.1):clamp(angle+(a.sent%2)*.25,-3,-1.8);
  const t=g.spawnEnemy('hunterTorpedo',cx-3.5,cy-2,{angle,phase:e.phase,hunt:a.name==='pursuit'?.55:.75+e.phase*.05,byBoss:true,owner:e.id});
  a.sent++;log(g,e,'torpedoLaunch',{attack:a.name,missile:t.id,angle,count:a.sent});sfx.mortar();
}
function fire(e,g,a){
  log(g,e,'fire',{attack:a.name,angle:a.angle,mx:a.mx,my:a.my});
  if(a.name==='broadside'){broadside(e,g,a);a.volleys=1;aimAgain(e,g,a);}
  else if(a.name==='flak'||a.name==='rushFlak')flak(e,g,a);
  else if(a.name==='torpedoes'||a.name==='pursuit')launchTorpedo(e,g,a);
  else if(a.name==='skip'){g.spawnEnemy('skipShell',a.sx-3,123,{sx:a.sx,tx:a.tx,amp:a.amp,byBoss:true});sfx.mortar();}
  else if(a.name==='darts'){launchDart(e,g,0);a.pendingDart=true;sfx.tick();}
  else if(a.name==='ice')ice(e,g,a);
  a.stage=rushing(a)?'dash':'active';a.t=0;
}
function aimAgain(e,g,a){
  const p=g.playerCenter(),rear=p.x>e.x+e.w/2;
  a.mx=e.x+(rear?e.w-2:1);a.my=e.y+(rear?8:15);
  a.angle=Math.atan2(p.y-a.my,p.x-a.mx);a.nextWarn=[0,1.1,1,.95][e.phase];
  log(g,e,'warn',{attack:a.name,duration:a.nextWarn,angle:a.angle,mx:a.mx,my:a.my});sfx.charge(a.nextWarn);
}
function launchDart(e,g,lane){
  g.spawnEnemy('twinDart',e.x+39,e.y+12,{lane,byBoss:true,launch:{sx:e.x+39,sy:e.y+12,tx:e.x+(lane?39:12),ty:e.y-18-lane*25,t:0}});
}
function updateAttack(e,a,dt,g){
  a.t+=dt;
  const salvo=(a.name==='torpedoes'||a.name==='pursuit')&&a.stage==='active';
  e.open=a.stage==='recover'||a.stage==='warn'&&a.t>=a.warn-.4||
    a.stage==='active'&&a.name==='broadside'&&a.volleys<5&&a.t>=a.nextWarn-.3||
    salvo&&a.t<.38*(a.count-1)+.55||a.iceWarnAt!==undefined&&!a.iceDone&&a.t>=a.iceWarnAt+.5;
  if(a.stage==='warn'){if(a.t>=a.warn)fire(e,g,a);}
  else if(a.stage==='dash'){
    e.open=false;if(move(e,a.left,a.name==='rushFlak'?140:124,dt)){a.stage='turn';a.t=0;log(g,e,'returnWarning',{duration:.75});sfx.rumble();}
  }else if(a.stage==='turn'){
    if(a.t>=.75){a.stage='return';a.t=0;log(g,e,'return');}
  }else if(a.stage==='return'){
    if(move(e,a.home,a.name==='rushFlak'?100:82,dt)&&!threats(g)){a.stage='recover';a.t=0;}
  }else if(a.stage==='active'){
    if(salvo){
      if(a.sent<a.count){if(a.t>=.38*a.sent)launchTorpedo(e,g,a);return;}
      if(a.name==='pursuit'){
        if(a.iceWarnAt===undefined){
          if(g.enemies.some(t=>t.type==='hunterTorpedo'&&!t.dead&&t.mode==='hunt'))return;
          a.marks=iceMarks(e,g);a.iceWarnAt=a.t;
          log(g,e,'warn',{attack:'pursuitIce',duration:.9,marks:a.marks,angle:-Math.PI/2});sfx.charge(.9);return;
        }
        if(!a.iceDone){
          if(a.t>=a.iceWarnAt+.9){a.iceDone=true;ice(e,g,a);log(g,e,'fire',{attack:'pursuitIce',angle:-Math.PI/2,marks:a.marks});}
          return;
        }
      }
    }
    if(a.pendingDart&&a.t>=.45){launchDart(e,g,1);a.pendingDart=false;}
    if(a.name==='broadside'&&a.volleys<5){
      if(a.t>=a.nextWarn){log(g,e,'fire',{attack:a.name,angle:a.angle,mx:a.mx,my:a.my});broadside(e,g,a);a.volleys++;a.t=0;if(a.volleys<5)aimAgain(e,g,a);}
      return;
    }
    if(a.t>.3&&!a.pendingDart&&!threats(g)){a.stage='recover';a.t=0;log(g,e,'recovery');}
  }else if(a.stage==='recover'&&a.t>1.05){e.attack=null;e.open=false;e.idle=REST[e.phase];}
}
function drawGap(a,c,snap){
  c.fillStyle='#e8eee5';for(const y of [a.gap-16,a.gap+16])c.fillRect(2,snap(y),Math.max(1,a.wallX-4),.5);
}
export const BREAKWATER={
  boss:true,name:'BREAKWATER',title:'THE COASTBREAKER',hp:250,score:7000,voice:'metal',
  taunt:'I OWN THIS COAST',killLines:['SWEPT ASIDE','UNDER MY BOW','THE COAST IS MINE'],
  stageLines:[null,null,'YOU BROKE MY BOW','I WILL BREAK YOU'],
  init(e,g){Object.assign(e,{w:WIDTH,h:HEIGHT,x:VIEW_W+6,y:g.terrain.floorY-HEIGHT,mode:'enter',timer:0,phase:1,open:false,attack:null,idle:.8,introIndex:0,recent:[],targetX:110,sprayT:0});},
  update(e,dt,g){
    e.timer+=dt;e.y=g.terrain.floorY-e.h;e.sprayT-=dt;
    if(e.mode==='dying'){
      e.open=false;updateBreakup(e,dt,g);return;
    }
    if(e.mode==='enter'){
      move(e,144,30,dt);
      if(e.x<=144.1){set(e,'intro');g.showTitle(BREAKWATER);sfx.horn();log(g,e,'entrance');}
    }else if(e.mode==='intro'){
      if(!g.title){set(e,'taunt');saySafe(g,e,BREAKWATER.taunt);}
    }else if(e.mode==='taunt'||e.mode==='transition'){
      if(e.timer>2&&g.bossMayAttack(e)&&g.state==='playing'){set(e,'fight');e.idle=.7;}
    }else if(e.mode==='fight'){
      if(g.state!=='playing'||!g.bossMayAttack(e))return;
      if(e.attack)updateAttack(e,e.attack,dt,g);
      else{
        e.open=false;
        if(e.phase>=2&&g.playerCenter().y>94)e.targetX=clamp(g.player.x+65,LEFT[e.phase],144);
        move(e,e.targetX,[0,28,36,44][e.phase],dt);
        if(Math.abs(e.x-e.targetX)<1)e.targetX=e.targetX<125?144:LEFT[e.phase];
        e.idle-=dt;
        if(e.idle<=0&&!threats(g)){
          const name=chooseAttack(e,g);
          beginAttack(e,g,name);
        }
      }
    }
    if(e.sprayT<=0&&(e.mode==='enter'||!e.attack||['dash','return'].includes(e.attack.stage))){
      e.sprayT=.1;g.burst(e.x+e.w-4,128,2,20,['#e8eee5','#a6c9d3']);
    }
  },
  aimPoint:muzzle,muzzle,voicePoint:e=>({x:e.x+30,y:e.y+6}),supplyY:()=>24,
  onScreen:e=>e.mode!=='enter',isVulnerable:e=>e.mode==='fight'&&e.open,
  hitTest:hullContact,
  shotTest(e,x,y,w,h){
    if(e.mode==='dying'||e.mode==='enter')return null;
    // A clear corridor from the forward edge to the visible chamber.
    if(BREAKWATER.isVulnerable(e)&&rectsOverlap(x,y,w,h,e.x,e.y+9,15,11))return 'hit';
    return hullContact(e,x,y,w,h)?'block':null;
  },
  contactDamage:e=>e.attack&&['dash','return'].includes(e.attack.stage)?3:2,
  knockback(e,p){
    const cx=p.x+p.w/2;
    if(!e.attack||!['dash','return'].includes(e.attack.stage)){
      const x=cx<e.x+12?e.x-p.w-3:cx>e.x+e.w-10?e.x+e.w+3:null;
      if(x!==null&&x>=2&&x<=VIEW_W-p.w-2){p.x=x;return;}
    }
    p.y=Math.max(HUD_H+1,e.y-p.h-2);
  },
  onHit(e,g,x,y){
    g.burst(x,y,2,35,[PAL.amberLight,PAL.cream]);
    const next=e.phase===1&&e.hp<=e.maxHp*.66?2:e.phase===2&&e.hp<=e.maxHp*.33?3:0;
    if(next&&e.hp>0){
      e.phase=next;e.attack=null;e.open=false;e.introIndex=0;e.recent=[];e.idle=.8;set(e,'transition');
      saySafe(g,e,BREAKWATER.stageLines[next],'roar');g.stageBonus(e,next);
      g.blasts.blast(e.x+16,e.y+12,1.2);sfx.crack();g.shake=4;log(g,e,'phase');
    }
  },
  draw(e,c,snap){
    if(e.mode==='dying'){drawBreakup(e,c,snap);return;}
    const a=e.attack;
    if(a){
      const warning=a.stage==='warn'||a.name==='broadside'&&a.stage==='active'&&a.volleys<5;
      c.fillStyle=Math.floor(e.t*10)%2?'#d99b43':'#9b7953';
      if(warning){
        if(a.name==='broadside')for(let d=5;d<240;d+=5){const x=a.mx+Math.cos(a.angle)*d,y=a.my+Math.sin(a.angle)*d;if(x<1||x>207||y<11||y>129)break;c.fillRect(snap(x),snap(y),1,.5);}
        if(a.name==='torpedoes'||a.name==='pursuit'){
          for(let i=0;i<a.count;i++)c.fillRect(snap(e.x+3+i*3),snap(e.y+11),1,2);
          // These are tracking weapons, so show launch arrows, not a false
          // promise of a fixed aim line. Each missile has its own hunt lamp.
          const dir=a.rear?1:-1,x=a.rear?e.x+e.w+3:e.x-3;
          for(let d=4;d<17;d+=4){c.fillRect(snap(x+dir*d),snap(e.y+13-d*.2),1,1);}
        }
        if(a.name==='flak'||a.name==='rushFlak')for(let y=12;y<129;y+=3)if(Math.abs(y-a.gap)>16)c.fillRect(snap(a.wallX),y,1,1);
        if(a.name==='skip'){for(const p of a.path)c.fillRect(snap(p.x),snap(p.y),1,1);target(c,a.tx,125,snap);}
        if(rushing(a))for(let x=a.left;x<e.x;x+=5)c.fillRect(snap(x),e.y+e.h-2,2,.5);
      }
      if((a.name==='ice'&&a.stage==='warn')||(a.iceWarnAt!==undefined&&!a.iceDone))for(const x of a.marks){target(c,x,122,snap);for(let y=86;y<119;y+=5)c.fillRect(snap(x),y,.5,2);}
      if((a.name==='flak'||a.name==='rushFlak')&&a.stage!=='recover')drawGap(a,c,snap);
    }
    const p=picture(e);c.drawImage(e.flash>0?p.flash:p,snap(e.x),snap(e.y));
    if(a&&(['warn','turn'].includes(a.stage)||a.name==='broadside'&&a.stage==='active'&&a.volleys<5)&&Math.floor(e.t*14)%2===0){c.fillStyle='#f1d69a';c.fillRect(snap(e.x+18),snap(e.y+10),1,1);c.fillRect(snap(e.x+41),snap(e.y+13),1,2);}
  }
};
export const SKIP_SHELL={
  hp:1,score:10,noTarget:true,ram:1,gore:{metal:2},explodeSize:.3,
  init(e){e.w=e.h=6;e.mode='hop';},
  update(e,dt,g){
    if(e.dead)return;
    const k=Math.min(1,e.t/2.1),p=skipPoint(e,k);e.x=p.x-3;e.y=p.y-3;
    if(k>=1){e.dead=true;for(let i=0;i<3;i++)g.fireShot(p.x,p.y-1,-Math.PI/2+(i-1)*.4,58,'orb',true);g.blasts.blast(p.x,p.y,.4);log(g,e,'shellBurst');sfx.explode(.3);}
  },
  hitTest(e,x,y,w,h){const dx=Math.max(x-(e.x+3),0,e.x+3-(x+w)),dy=Math.max(y-(e.y+3),0,e.y+3-(y+h));return dx*dx+dy*dy<9?'hit':null;},
  draw(e,c,snap){const p=skipPoint(e,1);target(c,p.x,125,snap,e.t>1.45);c.drawImage(SHELL,snap(e.x),snap(e.y));}
};
