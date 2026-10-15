// Boss-only persistent fighters. The two regular-enemy review flights retain
// their original short attack runs and original artwork.
import { LOCAL_TYPES } from '../glacier-combat/enemies.js?combat=3';
import { sfx } from '../../js/audio.js?v=0.29.0';
import { clamp } from '../../js/util.js?v=0.29.0';
const base=LOCAL_TYPES.twinDart;
export const escorts=g=>g.enemies.filter(e=>!e.dead&&e.persistentEscort);
export const escortAwake=g=>g.state==='playing'&&g.player.entering<=0&&g.boss?.mode==='fight'&&g.bossMayAttack(g.boss);
const safeWindow=g=>{const a=g.boss?.attack;return escortAwake(g)&&(!a||a.stage==='recover'||a.name==='darts');};
const log=(e,g,kind,extra={})=>g.audit.push({time:g.time,id:e.id,type:e.type,kind,...extra});
export const ESCORT={...base,
  init(e,g){e.lane=e.lane||0;e.mode='wait';e.timer=.55+e.lane*.5;e.charge=0;e.passive=!escortAwake(g);},
  // During dialogue/respawn the visible fighters remain harmless. Player
  // shots can still destroy them; their health never resets between phases.
  hitTest(e,...r){return e.passive?null:base.hitTest(e,...r);},
  shotTest:base.hitTest,
  update(e,dt,g){
    if(e.dead)return;
    e.passive=!escortAwake(g);
    if(e.passive){e.mode='wait';e.timer=.6+e.lane*.4;e.charge=0;return;}
    const x=(e.lane?176:148)+Math.sin(e.t*.8+e.lane)*6;
    const y=(e.lane?52:80)+Math.sin(e.t*1.1+e.lane)*4;
    e.x+=clamp(x-e.x,-24*dt,24*dt);e.y+=clamp(y-e.y,-24*dt,24*dt);
    // A full new warning follows every interruption. Do not queue a hidden
    // shot through a broadside, rush, flak wall or tracking-missile sequence.
    if(!safeWindow(g)||e.x<g.player.x+g.player.w+5){
      if(e.mode==='warn'){e.mode='wait';e.timer=.25;e.charge=0;}
      return;
    }
    e.timer-=dt;
    if(e.mode==='wait'){
      if(e.timer>0||g.time-(g.escortShotAt??-10)<.65||g.enemyShots.filter(s=>s.escort&&!s.dead).length>=2||escorts(g).some(o=>o!==e&&o.mode==='warn'))return;
      e.mode='warn';e.timer=.45;e.charge=1;
      const m=e.T.muzzle(e),p=g.playerCenter();e.angle=Math.atan2(p.y-m.y,p.x-m.x);
      log(e,g,'warn',{duration:.45,angle:e.angle,x:m.x,y:m.y});sfx.tick();
    }else if(e.timer<=0){
      const m=e.T.muzzle(e),s=g.fireShot(m.x,m.y,e.angle,82,'orb',true);
      s.escort=true;g.escortShotAt=g.time;
      log(e,g,'fire',{angle:e.angle,speed:82,x:m.x,y:m.y});sfx.tick();
      e.shots=(e.shots||0)+1;e.mode='wait';e.timer=1.15;e.charge=0;
    }
  }
};
