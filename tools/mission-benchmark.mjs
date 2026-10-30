// Cached native-grid drawing samples; these are not physical-phone FPS.
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {serve} from './serve.mjs';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');
const out=process.argv[2]||'/tmp/ember-mission-benchmark';await mkdir(out,{recursive:true});
const {server,base}=await serve(),browser=await chromium.launch({slowMo:0});
try{
 const page=await browser.newPage();await page.goto(base+'demos/glacier-level/');await page.waitForFunction(()=>window.__mission?.artworkReady);await page.evaluate(()=>window.__mission.frozen=true);
 const result=await page.evaluate(async()=>{
  const {MissionGame}=await import('/demos/glacier-level/scene.js?mission=7'),{useDetail}=await import('/js/detail.js?v=0.29.0');
  const g=new MissionGame();await Promise.resolve();Object.assign(g.player,{x:26,y:65,entering:0,invuln:0});
  g.spawnEnemy('shelfSkiff',75,0,{missionRegular:true});g.spawnEnemy('snowRoller',150,0,{missionRegular:true});
  g.spawnEnemy('twinDart',148,32,{missionRegular:true});g.spawnEnemy('needleWing',177,94,{missionRegular:true});
  for(const [x,y]of [[70,20],[100,58],[130,20],[100,96]])g.spawnEnemy('twinDart',x,y,{missionRegular:true});
  g.spawnEnemy('rollingCharge',90,0);for(let i=0;i<24;i++)g.fireShot(45+i*11,35+i%4*22,Math.PI,82);
  const baseline=Object.assign(Object.create(Object.getPrototypeOf(g)),g,{enemies:[],enemyShots:[]});
  const canvas=document.createElement('canvas');canvas.width=1248;canvas.height=864;
  const c=useDetail(canvas.getContext('2d'));c.scale(6,6);c.imageSmoothingEnabled=false;
  let calls=0;for(const name of ['drawImage','fillRect','fill','stroke','clearRect','save','restore','translate','scale','rotate','beginPath','moveTo','lineTo']){
   const fn=c[name];c[name]=function(...args){calls++;return fn.apply(this,args);};
  }
  const sample=scene=>{calls=0;const start=performance.now();for(let i=0;i<120;i++)scene.draw(c,v=>Math.round(v*6)/6);c.getImageData(0,0,1,1);return {ms:performance.now()-start,callsPerFrame:calls/120};};
  sample(g);sample(baseline);const empty=[],busy=[];
  for(let i=0;i<5;i++){empty.push(sample(baseline));busy.push(sample(g));}
  for(const e of g.enemies)if(e.missionRegular)e.facingRight=true;
  const turned=[];for(let i=0;i<5;i++)turned.push(sample(g));
  const median=a=>a.map(v=>v.ms).sort((a,b)=>a-b)[2];
  return {fixture:'eight regular actors, one rolling charge and twenty-four rounds; same cached scene without threats as baseline; second busy sample turns all eight actors',frames:120,sceneryMedianMs:median(empty),busyMedianMs:median(busy),turnedMedianMs:median(turned),sceneryCalls:empty[0].callsPerFrame,busyCalls:busy[0].callsPerFrame,turnedCalls:turned[0].callsPerFrame,note:'same-browser cloud drawing sample, not phone FPS'};
 });
 await writeFile(join(out,'metrics.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}finally{await browser.close();await new Promise(r=>server.close(r));}
