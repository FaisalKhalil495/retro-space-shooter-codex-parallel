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
  const {makePilot}=await import('/tools/boss-review-pilot.js');
  const {BossGame}=await import('/demos/glacier-boss/scene.js?boss=2');const {Game}=await import('/js/game.js?v=0.29.0');const {useDetail}=await import('/js/detail.js?v=0.29.0');
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
  const reactive=[];
  for(const dice of [.25,.45,.75])for(const type of ['breakwater','warden']){
   if(type==='breakwater'&&dice!==.45)continue; // This boss's attacks use no dice.
   const g=type==='breakwater'?new BossGame():new Game({level:3,startAt:'checkpoint'});
   g.rand=()=>dice;g.weapons.reset();const pilot=makePilot();let lastBoss=null,losses=[];
   const hurt=g.hurtPlayer.bind(g);let damage=0;
   g.hurtPlayer=(n,...args)=>{const before=g.health;hurt(n,...args);damage+=Math.max(0,before-g.health);};
   let lives=g.lives;
   for(let i=0;i<120*300;i++){
    if(g.boss)lastBoss=g.boss;g.update(1/120,pilot(g));
    if(lives!==g.lives){losses.push(g.time);lives=g.lives;}
    if(['clear','gameover'].includes(g.state))break;
   }
   reactive.push({type,dice,state:g.state,seconds:g.time,lives:g.lives,health:g.health,
    bossHp:lastBoss?.hp,phase:lastBoss?.phase,damageBlocks:damage,lifeLossAt:losses});
  }
  const g=new BossGame();g.runner={update(){}};Object.assign(g.player,{x:30,y:75,entering:0,invuln:0});const b=g.spawnEnemy('breakwater',214,0);Object.assign(b,{x:130,mode:'fight',phase:3,open:true});
  g.bg=window.__boss.game.bg;if(!g.bg.loaded)throw new Error('Benchmark landscape not ready');
  const c=document.createElement('canvas');c.width=1248;c.height=864;const ctx=useDetail(c.getContext('2d'));ctx.scale(6,6);ctx.imageSmoothingEnabled=false;
  const baseline=Object.assign(Object.create(Object.getPrototypeOf(g)),g,{boss:null,enemies:[],enemyShots:[]});
  const sample=v=>{const t=performance.now();for(let i=0;i<60;i++)v.draw(ctx,x=>Math.round(x*6)/6);ctx.getImageData(0,0,1,1);return performance.now()-t;};
  sample(baseline);sample(g);const a=[],d=[];for(let i=0;i<3;i++){a.push(sample(baseline));d.push(sample(g));}
  const median=v=>v.sort((a,b)=>a-b)[1];
  g.startBossDeath(b);for(let i=0;i<340;i++)g.update(1/120,{dx:0,dy:0,fire:false});
  const deathDraw=[sample(g),sample(g),sample(g)];
  const deathFx={parts:b.wreck.pieces.length,fires:g.blasts.fires.length,puffs:g.blasts.puffs.length,gibs:g.gore.gibs.length};
  return {seed:'constant simulation dice; reactive pilots use .25, .45, .75',fights,reactive,draw:{frames:60,baselineMedianMs:median(a),bossMedianMs:median(d),deathMedianMs:median(deathDraw),deathFx}};
 });
 await writeFile(join(out,'metrics.json'),JSON.stringify(metrics,null,2)+'\n');console.log(JSON.stringify(metrics,null,2));
}finally{await browser.close();server.close();}
