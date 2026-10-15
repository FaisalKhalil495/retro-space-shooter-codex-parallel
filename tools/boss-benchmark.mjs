// Deterministic same-browser comparison; cloud samples are not phone FPS.
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {serve} from './serve.mjs';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');
const out=process.argv[2]||'/tmp/ember-boss-benchmark';await mkdir(out,{recursive:true});
const {server,base}=await serve();const browser=await chromium.launch({slowMo:0});
try{
 const p=await browser.newPage({viewport:{width:915,height:412}});await p.goto(base+'demos/glacier-boss/');await p.waitForFunction(()=>window.__boss?.artworkReady);await p.evaluate(()=>window.__boss.frozen=true);
 const metrics=await p.evaluate(async()=>{
  const {BossGame}=await import('/demos/glacier-boss/scene.js?boss=1');const {Game}=await import('/js/game.js?v=0.29.0');const {useDetail}=await import('/js/detail.js?v=0.29.0');
  const fights=[];
  for(const specials of [false,true])for(const type of ['breakwater','warden']){
   const g=type==='breakwater'?new BossGame():new Game({level:3,startAt:'checkpoint'});g.rand=()=>.45;g.weapons.reset();g.health=1000000;g.player.invuln=0;
   const hurt=g.hurtPlayer.bind(g);let damage=0,first=null,opens=0,steps=0,phases=[];
   g.hurtPlayer=(n,...args)=>{const before=g.health;hurt(n,...args);damage+=before-g.health;};
   for(let i=0;i<120*340;i++){
    const b=g.boss;g.player.entering=0;g.player.x=26;
    if(b){const m=g.aimPoint(b);g.player.y=Math.max(11,Math.min(118,m.y-6));if(b.mode==='fight'){if(first===null)first=g.time;steps++;if(b.T.isVulnerable?.(b))opens++;}if(!phases.includes(b.phase))phases.push(b.phase);}
    g.update(1/120,{dx:0,dy:0,fire:true,special:specials&&!!b?.T.isVulnerable?.(b)});if(g.state==='clear')break;
   }
   if(g.state!=='clear')throw new Error(type+' comparison did not finish');
   fights.push({type,specials,totalSeconds:g.time,fightSeconds:g.time-first,damageBlocks:damage,damageBlocksPerMinute:60*damage/(g.time-first),openFraction:opens/steps,phases});
  }
  const g=new BossGame();g.runner={update(){}};Object.assign(g.player,{x:30,y:75,entering:0,invuln:0});const b=g.spawnEnemy('breakwater',214,0);Object.assign(b,{x:130,mode:'fight',phase:3,open:true});
  g.bg=window.__boss.game.bg;if(!g.bg.loaded)throw new Error('Benchmark landscape not ready');
  const c=document.createElement('canvas');c.width=1248;c.height=864;const ctx=useDetail(c.getContext('2d'));ctx.scale(6,6);ctx.imageSmoothingEnabled=false;
  const baseline=Object.assign(Object.create(Object.getPrototypeOf(g)),g,{boss:null,enemies:[],enemyShots:[]});
  const sample=v=>{const t=performance.now();for(let i=0;i<60;i++)v.draw(ctx,x=>Math.round(x*6)/6);ctx.getImageData(0,0,1,1);return performance.now()-t;};
  sample(baseline);sample(g);const a=[],d=[];for(let i=0;i<3;i++){a.push(sample(baseline));d.push(sample(g));}
  const median=v=>v.sort((a,b)=>a-b)[1];return {seed:'constant 0.45 for simulation dice',fights,draw:{frames:60,baselineMedianMs:median(a),bossMedianMs:median(d)}};
 });
 await writeFile(join(out,'metrics.json'),JSON.stringify(metrics,null,2)+'\n');console.log(JSON.stringify(metrics,null,2));
}finally{await browser.close();server.close();}
