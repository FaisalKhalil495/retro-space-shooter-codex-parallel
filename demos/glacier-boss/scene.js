import { Game } from '../../js/game.js?v=0.29.0';
import { Terrain } from '../../js/terrain.js?v=0.29.0';
import { PAL } from '../../js/config.js?v=0.29.0';
import { drawText } from '../../js/font.js?v=0.29.0';
import { BattlefieldBackground, battleReady } from './battlefield.js?battle=4';
import { LOCAL_TYPES, spawnLocal } from '../glacier-combat/enemies.js?combat=3';
import { BREAKWATER, clearThreats, log } from './boss.js?boss=7';
import { beginBreakup, updateBreakup, drawBreakup } from './wreck.js?boss=6';
import { HUNTER_TORPEDO } from './torpedo.js?boss=7';
import { ESCORT } from './escorts.js?boss=7';
import { CLUSTER_SHELL, CLUSTER_BURST, GLACIER_RUPTURE, drawLances } from './hazards.js?boss=6';
export { battleReady };
const COAST_FLOOR=14;
const SCENE={number:4,name:'BREAKWATER PREVIEW',floor:COAST_FLOOR,background:{sun:false,dust:false},events:[[Number.MAX_SAFE_INTEGER,'end']]};
export class BossGame extends Game{
  get level(){return SCENE;}
  reset(){
    super.reset();this.bg=this.battlefield||(this.battlefield=new BattlefieldBackground());this.bg.t=0;
    this.terrain=new Terrain(COAST_FLOOR);this.terrain.draw=()=>{};
    this.banner=null;this.wreck=null;this.audit=[];this.nextId=0;this.started=false;this.escortShotAt=-10;
    this.runner={update:()=>{if(!this.started&&this.time>=2.5){this.started=true;this.spawnEnemy('breakwater',214,0);}}};
  }
  spawnEnemy(type,x,y,opts={}){
    if(LOCAL_TYPES[type]){
      const e=spawnLocal(this,type,x,y,opts);
      if(opts.persistentEscort){e.T=ESCORT;ESCORT.init(e,this);}
      return e;
    }
    const T=type==='breakwater'?BREAKWATER:type==='clusterShell'?CLUSTER_SHELL:type==='clusterBurst'?CLUSTER_BURST:type==='glacierRupture'?GLACIER_RUPTURE:type==='hunterTorpedo'?HUNTER_TORPEDO:null;
    if(!T){const e=super.spawnEnemy(type,x,y,opts);
      if(type==='carrier')this.audit.push({time:this.time,kind:'supply',drop:opts.drop});return e;}
    const e={type,T,x,y,hp:T.hp,maxHp:T.hp,t:0,flash:0,id:++this.nextId,...opts};
    T.init(e,this);this.enemies.push(e);if(T.boss)this.boss=e;return e;
  }
  fireShot(x,y,angle,speed,kind='orb',byBoss=true){return super.fireShot(x,y,angle,speed,kind,byBoss);}
  killPlayer(source){super.killPlayer(source);if(this.boss&&this.boss.mode!=='dying'){
    clearThreats(this,true);this.boss.attack=null;this.boss.open=false;this.boss.idle=1;
  }}
  startBossDeath(e){super.startBossDeath(e);clearThreats(this);beginBreakup(e,this);e.open=false;log(this,e,'death');}
  update(dt,input){super.update(dt,input);if(this.wreck?.dead){this.wreck.timer+=dt;updateBreakup(this.wreck,dt,this);}}
  // This native hook runs inside the world's camera, before the original
  // ship, bullets and screen effects. Post-frame overlays would bypass shake
  // and paint over the hero during close dodges or the victory fly-out.
  drawPlayer(c,snap){
    if(this.wreck?.dead){c.save();c.beginPath();c.rect(0,11,208,119);c.clip();drawBreakup(this.wreck,c,snap);c.restore();}
    drawLances(this,c,snap);super.drawPlayer(c,snap);
  }
  drawHud(c){c.fillStyle=PAL.void;c.fillRect(0,0,208,10);super.drawHud(c);if(this.boss)drawText(c,'P'+this.boss.phase,145,2,PAL.amberLight);}
}
