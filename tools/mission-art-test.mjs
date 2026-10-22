// Reference-derived cutouts, real collision masks and preview isolation.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {serve} from './serve.mjs';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');
const out=process.argv[2]||'/tmp/ember-mission-art';await mkdir(out,{recursive:true});
const {server,base}=await serve();let browser;
try{
 browser=await chromium.launch({slowMo:0});const page=await browser.newPage({viewport:{width:915,height:412},deviceScaleFactor:2.625});
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto(base+'demos/glacier-level/');await page.waitForFunction(()=>window.__mission?.artworkReady);await page.evaluate(()=>window.__mission.frozen=true);
 const results=await page.evaluate(async()=>{
  const {MissionGame}=await import('/demos/glacier-level/scene.js?mission=2');
  const {BossGame}=await import('/demos/glacier-boss/scene.js?boss=7');
  const {MISSION_ART,HERO,picture}=await import('/demos/glacier-level/art.js?mission=2');
  const {ART}=await import('/demos/glacier-combat/art.js?combat=3');
  const {LOCAL_TYPES}=await import('/demos/glacier-combat/enemies.js?combat=3');
  const checks=[],record=(name,ok)=>checks.push({name,ok:!!ok}),g=new MissionGame(),old=new BossGame();
  g.runner={update(){}};old.runner={update(){}};
  for(const type of ['shelfSkiff','anchorGun','twinDart','crestBomber','snowRoller','needleWing','wakeHunter']){
   const e=g.spawnEnemy(type,140,32,{missionRegular:true}),prior=old.spawnEnemy(type,140,32),pic=picture(e);
   record(type+': visibly larger with quarter-pixel source detail',e.w>=prior.w*1.5&&pic.hi.width===e.w*4&&pic.hi.height===e.h*4);
   record(type+': earlier preview retains original art, dimensions and type',prior.T===LOCAL_TYPES[type]&&prior.w===ART[prior.T.art].idle.width&&e.T!==prior.T&&e.T.hp===prior.T.hp&&e.T.score===prior.T.score);
   const muzzle=e.T.muzzle(e);record(type+': warning muzzle follows enlarged body',muzzle.x>=e.x&&muzzle.x<=e.x+e.w&&muzzle.y>=e.y&&muzzle.y<=e.y+e.h);
   let mask=true,hit=true,flash=true,transparent=0;
   for(const mode of ['enter','warn']){
    e.mode=mode;const p=picture(e),d=p.hi.getContext('2d').getImageData(0,0,p.hi.width,p.hi.height).data,f=p.flash.hi.getContext('2d').getImageData(0,0,p.hi.width,p.hi.height).data;
    for(let y=0;y<p.hi.height;y++)for(let x=0;x<p.hi.width;x++){
     const i=y*p.hi.width+x,solid=d[i*4+3]===255;mask&&=!!p.mask[i]===solid;flash&&=f[i*4+3]===d[i*4+3];if(!solid)transparent++;
     hit&&=(e.T.hitTest(e,e.x+(x+.25)/4,e.y+(y+.25)/4,.1,.1)==='hit')===solid;
    }
   }
   record(type+': every opaque and transparent quarter pixel matches collisions',mask&&hit&&transparent>10);
   record(type+': hit flash preserves both collision silhouettes',flash);
  }
  const skiff=g.enemies.find(e=>e.type==='shelfSkiff');skiff.mode='warn';skiff.timer=0;g.player.x=26;g.player.y=100;g.player.entering=0;g.player.invuln=100;
  const m=skiff.T.muzzle(skiff);skiff.T.update(skiff,0,g);
  record('actual skiff shots originate at enlarged gun, with original count/speed/damage',g.enemyShots.length===3&&g.enemyShots.every(s=>s.x===m.x&&s.y===m.y&&Math.abs(Math.hypot(s.vx,s.vy)-72)<.0001&&!s.byBoss));
  const anchor=g.enemies.find(e=>e.type==='anchorGun');anchor.mode='closed';const closed=!anchor.T.isVulnerable(anchor);anchor.mode='warn';record('anchor keeps its opening vulnerability and distinct opening art',closed&&anchor.T.isVulnerable(anchor)&&MISSION_ART.anchor.open!==MISSION_ART.anchor.idle);
  const escort=g.spawnEnemy('twinDart',170,32,{persistentEscort:true,slot:0});record('boss escort keeps compact original dimensions and health',escort.w===11&&escort.h===8&&escort.hp===2&&escort.T!==g.enemies.find(e=>e.type==='twinDart').T);
  record('player keeps original 18 by 11 footprint at quarter-pixel detail',HERO.width===18&&HERO.height===11&&HERO.hi.width===72&&HERO.hi.height===44);
  let randomCalls=0;g.rand=()=>{randomCalls++;return .5;};for(let i=0;i<20;i++)for(const e of g.enemies.filter(e=>e.missionRegular)){
   const c=document.createElement('canvas').getContext('2d');e.T.draw(e,c,v=>v);
  }
  record('rendering consumes no simulation randomness',randomCalls===0);
  return checks;
 });
 for(const r of results){assert.ok(r.ok,r.name);console.log('PASS '+r.name);}
 assert.deepEqual(errors,[]);await writeFile(join(out,'checks.json'),JSON.stringify(results,null,2)+'\n');
 console.log('All '+results.length+' mission art checks passed');
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
