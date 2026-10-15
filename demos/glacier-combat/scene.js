import { Game } from '../../js/game.js?v=0.29.0';
import { Terrain } from '../../js/terrain.js?v=0.29.0';
import { VIEW_W, PAL } from '../../js/config.js?v=0.29.0';
import { drawText } from '../../js/font.js?v=0.29.0';
import { CoastBackground, COAST_FLOOR, coastReady } from '../glacier-coast/coast.js?demo=2';
import { LOCAL_TYPES, spawnLocal } from './enemies.js?combat=1';

export { coastReady };
export const DURATION=30;
const SCENE={number:4,name:'GLACIER COAST',floor:COAST_FLOOR,
  background:{sun:false,dust:false},events:[[Number.MAX_SAFE_INTEGER,'end']]};
// All arrivals and definitions belong to this preview, never shared LEVELS.
export const FLIGHTS={
  1:{name:'COAST PATROL',events:[
    [3,'shelfSkiff',0],[10,'anchorGun',0],
    [17,'twinDart',35,{lane:0}],[17.4,'twinDart',66,{lane:1}],
    [23,'shelfSkiff',0],[23.7,'twinDart',40,{lane:0}],
    [24.2,'twinDart',76,{lane:1}],[24.8,'anchorGun',0]
  ]},
  2:{name:'COAST ASSAULT',events:[
    [3,'crestBomber',24],[8,'snowRoller',0],[13,'needleWing',52],
    [18,'wakeHunter',44],[23,'crestBomber',27],[24,'wakeHunter',70]
  ]}
};
export class CombatGame extends Game {
  get level(){return SCENE;}
  reset(){
    super.reset();
    this.flight=this.flight||1;
    this.bg=this.coast||(this.coast=new CoastBackground());this.bg.t=0;
    this.terrain=new Terrain(COAST_FLOOR);this.terrain.draw=()=>{};
    this.banner=null;this.nextId=0;this.audit=[];this.nextArrival=0;
    this.runner={update:()=>{
      const events=FLIGHTS[this.flight].events;
      while(this.nextArrival<events.length&&events[this.nextArrival][0]<=this.time){
        const [,type,y,opts]=events[this.nextArrival++];this.spawnEnemy(type,VIEW_W+5,y,opts);
      }
    }};
  }
  select(flight){if(!FLIGHTS[flight])throw new Error('Unknown combat flight');this.flight=flight;this.reset();}
  spawnEnemy(type,x,y,opts={}){
    return LOCAL_TYPES[type]?spawnLocal(this,type,x,y,opts):super.spawnEnemy(type,x,y,opts);
  }
  drawHud(ctx){
    ctx.fillStyle=PAL.void;ctx.fillRect(0,0,VIEW_W,10);
    super.drawHud(ctx); // Original health blocks, life icons, score and weapons.
    drawText(ctx,'F'+this.flight+' '+String(Math.ceil(Math.max(0,DURATION-this.time))).padStart(2,'0')+'S',107,2,PAL.amberLight);
  }
}
