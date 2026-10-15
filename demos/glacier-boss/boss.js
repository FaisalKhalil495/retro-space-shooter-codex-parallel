import { VIEW_W, HUD_H, PAL } from '../../js/config.js?v=0.29.0';
import { clamp, rectsOverlap } from '../../js/util.js?v=0.29.0';
import { sfx } from '../../js/audio.js?v=0.29.0';
import { picture, hullContact, WIDTH, HEIGHT, launcherPort } from './art.js?boss=5.1';
import { updateBreakup, drawBreakup } from './wreck.js?boss=5.1';
import { escorts } from './escorts.js?boss=5.1';
import { drawMortarMark, mortarPoint } from './hazards.js?boss=5.1';
import { target } from '../glacier-combat/art.js?combat=3';
export const MOVES=[null,['broadside','torpedoes','flak','clusters'],
  ['ice','darts','broadside','torpedoes','flak','clusters'],
  ['rushFlak','pursuit','rush','torpedoes','broadside','ice','darts','flak','clusters']];
export const REST=[0,.45,.30,.18];
const LEFT=[0,104,90,76],INTRO=[0,4,2,2];
export const log=(g,e,kind,extra={})=>g.audit.push({time:g.time,id:e.id,kind,phase:e.phase,...extra});
const muzzle=e=>({x:e.x+1,y:e.y+15});
const localThreat=e=>e.type==='twinDart'||['clusterShell','clusterBurst','glacierRupture'].includes(e.type)||e.type==='hunterTorpedo';
export function clearThreats(g,keepFighters=false){
  g.enemyShots=[];g.enemies=g.enemies.filter(e=>{if(!localThreat(e))return true;
    if(keepFighters&&e.persistentEscort){e.passive=true;e.mode='wait';e.timer=.6+e.lane*.4;e.charge=0;return true;}
    e.dead=true;return false;});
}
const threats=g=>g.enemyShots.some(s=>!s.escort)||g.enemies.some(e=>!e.dead&&localThreat(e)&&!e.persistentEscort);
const move=(e,x,speed,dt)=>{e.x+=clamp(x-e.x,-speed*dt,speed*dt);return Math.abs(e.x-x)<.1;};
const rushing=a=>a.name==='rush'||a.name==='rushFlak';
function set(e,mode){e.mode=mode;e.timer=0;}
function saySafe(g,e,text,style='talk'){clearThreats(g,true);g.say(e,text,style);}
function markedX(x,e){x=clamp(x,14,190);if(x>e.x-9&&x<e.x+e.w+9)return clamp(e.x-20,14,190);return x;}
function iceMarks(e,g){return [markedX(g.playerCenter().x,e)];}
function flakGap(e,g){return clamp(g.playerCenter().y+(g.playerCenter().y>72?-32:32),30,e.attack?.name==='rushFlak'?88:111);}
function mortarMark(e,g,a){
  const p=g.playerCenter();a.sx=e.x+56;a.sy=e.y+8;a.tx=clamp(p.x,14,194);a.ty=clamp(p.y,24,111);
  a.mx=a.sx;a.my=a.sy;a.angle=Math.atan2(a.ty-a.sy,a.tx-a.sx);a.path=Array.from({length:19},(_,i)=>mortarPoint(a,i/18));
}
// Introduce each phase's new tools first; afterwards respond to position,
// avoiding the last two attacks and keeping combined attacks three apart.
export function chooseAttack(e,g){
  const moves=MOVES[e.phase].filter(n=>n!=='darts'||escorts(g).length<2),recent=e.recent||[],intro=e.introIndex||0;
  if(intro<INTRO[e.phase]){const name=MOVES[e.phase][intro];if(moves.includes(name))return name;e.introIndex=intro+1;return chooseAttack(e,g);}
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
  if(name==='darts'&&escorts(g).length>=2)return false;
  if(!MOVES[e.phase].includes(name)||g.state!=='playing'||!g.bossMayAttack(e)||threats(g))return false;
  const p=g.playerCenter(),m=muzzle(e);
  const a=e.attack={name,t:0,stage:'warn',warn:name==='rushFlak'||name==='flak'?1.15:name==='rush'||name==='clusters'?1:[0,.95,.85,.75][e.phase]};
  a.rear=p.x>e.x+e.w/2;a.mx=a.rear?e.x+e.w-2:m.x;a.my=a.rear?e.y+8:m.y;
  a.angle=Math.atan2(p.y-a.my,p.x-a.mx);
  if(name==='torpedoes'||name==='pursuit'){a.count=name==='pursuit'?2:e.phase+1;a.sent=0;const port=launcherPort(e,0,2);a.mx=port.x;a.my=port.y;a.warn=[0,1,.85,.7][e.phase];}
  if(name==='flak'||name==='rushFlak'){a.gap=flakGap(e,g);a.wallX=e.x-4;a.gapSize=GAP_SIZE[e.phase];a.waves=0;a.waveCount=name==='rushFlak'?1:e.phase;}
  if(name==='clusters'){a.warn=[0,.95,.85,.75][e.phase];a.sent=0;a.count=e.phase+1;mortarMark(e,g,a);}
  if(name==='ice'){a.marks=iceMarks(e,g);a.strikes=0;a.strikeCount=e.phase;}
  if(rushing(a)){a.left=clamp(p.x-18,30,72);a.home=144;}
  const intro=e.introIndex||0;if(intro<INTRO[e.phase]&&MOVES[e.phase][intro]===name)e.introIndex=intro+1;
  e.recent=[...(e.recent||[]),name].slice(-4);
  log(g,e,'chosen',{attack:name,playerX:p.x,playerY:p.y});
  log(g,e,'warn',{attack:name,duration:a.warn,angle:a.angle,mx:a.mx,my:a.my,marks:a.marks,path:a.path,gap:a.gap,wallX:a.wallX,count:a.count});
  sfx.charge(a.warn);return true;
}
function broadside(e,g,a){
  for(let i=0;i<5;i++)g.fireShot(a.mx,a.my,a.angle+(i-2)*.22,89+e.phase*9,i===2?'shell':'orb',true).dmg=i===2?2:1;
  sfx.cannon();
}
export const LANCE_SPEED=[0,120,132,144],GAP_SIZE=[0,28,26,24];
function flak(e,g,a){
  for(let y=14;y<=126;y+=8)if(Math.abs(y-a.gap)>GAP_SIZE[e.phase]/2){
    const s=g.fireShot(a.wallX,y,Math.PI,LANCE_SPEED[e.phase],'icicle',true);s.dmg=2;s.iceLance=true;
  }
  a.waves++;sfx.shatter();
}
function ice(e,g,a){
  const x=a.marks[0];g.spawnEnemy('glacierRupture',x-5,14,{byBoss:true});
  a.strikes=(a.strikes||0)+1;g.blasts.dust(x,128,.6);sfx.shatter();
}
function repeatWarning(e,g,a){
  a.stage='warn';a.t=0;
  if(a.name==='clusters')mortarMark(e,g,a);
  else if(a.name==='flak'){const old=a.gap;a.gap=flakGap(e,g);if(Math.abs(a.gap-old)<20)a.gap=old<70?Math.min(111,old+32):Math.max(30,old-32);a.wallX=e.x-4;}
  else if(a.name==='ice')a.marks=iceMarks(e,g);
  log(g,e,'warn',{attack:a.name,duration:a.warn,angle:a.angle,mx:a.mx,my:a.my,marks:a.marks,path:a.path,gap:a.gap,wallX:a.wallX});sfx.charge(a.warn);
}
function launchTorpedo(e,g,a){
  const port=launcherPort(e,a.sent%2,2),angle=-Math.PI/2;
  const t=g.spawnEnemy('hunterTorpedo',port.x-3.5,port.y-2,{angle,phase:e.phase,byBoss:true,owner:e.id});
  e.launchFlash=.10;e.launchTube=a.sent%2;
  a.sent++;log(g,e,'torpedoLaunch',{attack:a.name,missile:t.id,angle,count:a.sent,x:port.x,y:port.y});sfx.mortar();
}
function fire(e,g,a){
  log(g,e,'fire',{attack:a.name,angle:a.angle,mx:a.mx,my:a.my});
  if(a.name==='broadside'){broadside(e,g,a);a.volleys=1;aimAgain(e,g,a);}
  else if(a.name==='flak'||a.name==='rushFlak')flak(e,g,a);
  else if(a.name==='torpedoes'||a.name==='pursuit')launchTorpedo(e,g,a);
  else if(a.name==='clusters'){g.spawnEnemy('clusterShell',a.sx-4,a.sy-3,{sx:a.sx,sy:a.sy,tx:a.tx,ty:a.ty,phase:e.phase,byBoss:true});a.sent++;sfx.mortar();}
  else if(a.name==='darts'){a.dartLanes=[0,1].filter(lane=>!escorts(g).some(d=>d.lane===lane));launchDart(e,g,a.dartLanes.shift());a.pendingDart=a.dartLanes.length>0;sfx.tick();}
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
  if(lane===undefined||escorts(g).length>=2||escorts(g).some(d=>d.lane===lane))return;
  g.spawnEnemy('twinDart',e.x+39,e.y+12,{lane,byBoss:true,persistentEscort:true,launch:{sx:e.x+39,sy:e.y+12,tx:lane?176:148,ty:lane?52:80,t:0}});
}
function updateAttack(e,a,dt,g){
  a.t+=dt;
  const salvo=(a.name==='torpedoes'||a.name==='pursuit')&&a.stage==='active';
  e.open=a.stage==='recover'||a.stage==='warn'&&a.t>=a.warn-.4||
    a.stage==='active'&&a.name==='broadside'&&a.volleys<5&&a.t>=a.nextWarn-.3||
    salvo&&a.t<.38*(a.count-1)+.55||a.iceWarning&&!a.iceDone&&a.t>=a.iceWarnAt+.5;
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
          a.strikes=0;a.strikeCount=2;a.iceWarning=true;a.marks=iceMarks(e,g);a.iceWarnAt=a.t;
          log(g,e,'warn',{attack:'pursuitIce',duration:.9,marks:a.marks,angle:-Math.PI/2});sfx.charge(.9);return;
        }
        if(!a.iceDone){
          if(a.iceWarning){
            if(a.t>=a.iceWarnAt+.9){a.iceWarning=false;ice(e,g,a);log(g,e,'fire',{attack:'pursuitIce',angle:-Math.PI/2,marks:a.marks});if(a.strikes===2)a.iceDone=true;}
          }else if(!g.enemies.some(t=>t.type==='glacierRupture'&&!t.dead)){
            a.marks=iceMarks(e,g);a.iceWarnAt=a.t;a.iceWarning=true;
            log(g,e,'warn',{attack:'pursuitIce',duration:.9,marks:a.marks,angle:-Math.PI/2});sfx.charge(.9);
          }
          return;
        }
      }
    }
    if(a.name==='clusters'&&a.sent<a.count){
      if(!g.enemies.some(t=>!t.dead&&t.type==='clusterShell')&&g.enemyShots.filter(s=>s.cluster&&!s.dead).length<=6)repeatWarning(e,g,a);
      return;
    }
    if(a.name==='flak'&&a.waves<a.waveCount){if(!threats(g))repeatWarning(e,g,a);return;}
    if(a.name==='ice'&&a.strikes<a.strikeCount){if(!threats(g))repeatWarning(e,g,a);return;}
    if(a.pendingDart&&a.t>=.45){launchDart(e,g,a.dartLanes.shift());a.pendingDart=false;}
    if(a.name==='broadside'&&a.volleys<5){
      if(a.t>=a.nextWarn){log(g,e,'fire',{attack:a.name,angle:a.angle,mx:a.mx,my:a.my});broadside(e,g,a);a.volleys++;a.t=0;if(a.volleys<5)aimAgain(e,g,a);}
      return;
    }
    if(a.t>.3&&!a.pendingDart&&!threats(g)){a.stage='recover';a.t=0;log(g,e,'recovery');}
  }else if(a.stage==='recover'&&a.t>1.05){e.attack=null;e.open=false;e.idle=REST[e.phase];}
}
function drawGap(a,c,snap){
  c.fillStyle='#e8eee5';for(const y of [a.gap-a.gapSize/2,a.gap+a.gapSize/2])c.fillRect(2,snap(y),Math.max(1,a.wallX-4),.5);
}
export const BREAKWATER={
  boss:true,name:'BREAKWATER',title:'THE COASTBREAKER',hp:250,score:7000,voice:'metal',
  taunt:'I OWN THIS COAST',killLines:['SWEPT ASIDE','UNDER MY BOW','THE COAST IS MINE'],
  stageLines:[null,null,'YOU BROKE MY BOW','I WILL BREAK YOU'],
  init(e,g){Object.assign(e,{w:WIDTH,h:HEIGHT,x:VIEW_W+6,y:g.terrain.floorY-HEIGHT,mode:'enter',timer:0,phase:1,open:false,attack:null,idle:.8,introIndex:0,recent:[],targetX:110,sprayT:0,launcherLift:0,launchFlash:0});},
  update(e,dt,g){
    e.timer+=dt;e.y=g.terrain.floorY-e.h;e.sprayT-=dt;
    if(e.mode==='dying'){
      e.open=false;updateBreakup(e,dt,g);return;
    }
    const a=e.attack,raising=a&&['torpedoes','pursuit'].includes(a.name)&&(a.stage==='warn'||a.stage==='active'&&a.t<.38*(a.count-1)+.55);
    e.launcherLift=clamp((e.launcherLift||0)+(raising?1:-1)*dt/.22,0,1);e.launchFlash=Math.max(0,(e.launchFlash||0)-dt);
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
          for(let i=0;i<a.count;i++)c.fillRect(snap(e.x+28+i*2),snap(e.y+6),1,1);
          // These are tracking weapons, so show launch arrows, not a false
          // promise of a fixed aim line. Each missile has its own hunt lamp.
          const port=launcherPort(e,0,2);
          for(let d=4;d<17;d+=4)c.fillRect(snap(port.x),snap(port.y-d),1,1);
        }
        if(a.name==='flak'||a.name==='rushFlak')for(let y=12;y<129;y+=3)if(Math.abs(y-a.gap)>a.gapSize/2)c.fillRect(snap(a.wallX),y,1,1);
        if(a.name==='clusters'){for(const p of a.path)c.fillRect(snap(p.x),snap(p.y),1,1);drawMortarMark(c,a.tx,a.ty,snap);}
        if(rushing(a))for(let x=a.left;x<e.x;x+=5)c.fillRect(snap(x),e.y+e.h-2,2,.5);
      }
      if((a.name==='ice'&&a.stage==='warn')||(a.iceWarning&&!a.iceDone))for(const x of a.marks){target(c,x,122,snap);for(let y=14;y<119;y+=5)c.fillRect(snap(x),y,.5,2);}
      if((a.name==='flak'||a.name==='rushFlak')&&a.stage!=='recover')drawGap(a,c,snap);
    }
    const p=picture(e);c.drawImage(e.flash>0?p.flash:p,snap(e.x),snap(e.y));
    if(e.launchFlash>0){const port=launcherPort(e,e.launchTube||0,2);c.fillStyle='#f1d69a';c.fillRect(snap(port.x-1),snap(port.y-2),2,2);}
    if(a&&(['warn','turn'].includes(a.stage)||a.name==='broadside'&&a.stage==='active'&&a.volleys<5)&&Math.floor(e.t*14)%2===0){c.fillStyle='#f1d69a';if(a.name==='clusters')c.fillRect(snap(e.x+55),snap(e.y+6),2,2);else{c.fillRect(snap(e.x+18),snap(e.y+10),1,1);c.fillRect(snap(e.x+41),snap(e.y+13),1,2);}}
  }
};
