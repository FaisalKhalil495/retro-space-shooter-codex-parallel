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
  const {MissionGame}=await import('/demos/glacier-level/scene.js?mission=5');
  const {BossGame}=await import('/demos/glacier-boss/scene.js?boss=7');
  const {MISSION_ART,HERO,picture}=await import('/demos/glacier-level/art.js?mission=5');
  const {ART}=await import('/demos/glacier-combat/art.js?combat=3');
  const {LOCAL_TYPES}=await import('/demos/glacier-combat/enemies.js?combat=3');
  const {useDetail}=await import('/js/detail.js?v=0.29.0');
  const checks=[],record=(name,ok)=>checks.push({name,ok:!!ok}),g=new MissionGame(),old=new BossGame();
  g.runner={update(){}};old.runner={update(){}};
  for(const type of ['shelfSkiff','anchorGun','twinDart','crestBomber','snowRoller','needleWing','wakeHunter']){
   const e=g.spawnEnemy(type,140,32,{missionRegular:true}),prior=old.spawnEnemy(type,140,32),pic=picture(e);
   record(type+': retained reference detail at the compact mission scale',e.w>=prior.w*1.5&&pic.hi.width===e.w*4&&pic.hi.height===e.h*4);
   const detailed=['idle','open'].every(mode=>{const p=MISSION_ART[e.T.art][mode],colors=new Set(),pixels=p.hi.getContext('2d').getImageData(0,0,p.hi.width,p.hi.height).data;
    for(let i=0;i<pixels.length;i+=4)if(pixels[i+3])colors.add(pixels.slice(i,i+3).join(','));return colors.size>200;});
   record(type+': detailed reference artwork replaces legacy art in BOTH weapon states',MISSION_ART[e.T.art].source?.endsWith('.png')&&detailed);
   record(type+': earlier preview retains original art, dimensions and type',prior.T===LOCAL_TYPES[type]&&prior.w===ART[prior.T.art].idle.width&&e.T!==prior.T&&e.T.hp===prior.T.hp&&e.T.score===prior.T.score);
   const muzzle=e.T.muzzle(e);record(type+': warning muzzle follows the compact body',muzzle.x>=e.x&&muzzle.x<=e.x+e.w&&muzzle.y>=e.y&&muzzle.y<=e.y+e.h);
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
   e.mode='enter';e.facingRight=true;const original=picture(e),pixels=original.hi.getContext('2d').getImageData(0,0,original.hi.width,original.hi.height).data;
   const canvas=document.createElement('canvas');canvas.width=e.w*4;canvas.height=e.h*4;const c=useDetail(canvas.getContext('2d'));c.scale(4,4);c.imageSmoothingEnabled=false;
   e.T.draw({...e,x:0,y:0},c,v=>v);const mirrored=c.getImageData(0,0,canvas.width,canvas.height).data;let turn=true,turnHit=true;
   for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++){
    const i=y*canvas.width+x,j=y*canvas.width+canvas.width-1-x;
    for(let k=0;k<4;k++)turn&&=mirrored[i*4+k]===pixels[j*4+k];
    turnHit&&=(e.T.hitTest(e,e.x+(x+.25)/4,e.y+(y+.25)/4,.1,.1)==='hit')===(pixels[j*4+3]===255);
   }
   record(type+': turning preserves every original artwork pixel and mirrors collisions',turn&&turnHit);
   const right=e.T.muzzle(e);e.facingRight=false;const left=e.T.muzzle(e);
   record(type+': turned gun and warning muzzle match the displayed weapon',Math.abs(right.x+left.x-(2*e.x+e.w))<1e-8&&right.y===left.y);
  }
  const skiff=g.enemies.find(e=>e.type==='shelfSkiff');skiff.mode='warn';skiff.timer=0;g.player.x=26;g.player.y=100;g.player.entering=0;g.player.invuln=100;
  const m=skiff.T.muzzle(skiff);skiff.T.update(skiff,0,g);
  record('actual skiff shots originate at the scaled gun, with original count/damage and boosted speed',g.enemyShots.length===3&&g.enemyShots.every(s=>s.x===m.x&&s.y===m.y&&Math.abs(Math.hypot(s.vx,s.vy)-86.4)<.0001&&!s.byBoss));
  const anchor=g.enemies.find(e=>e.type==='anchorGun');anchor.mode='closed';const closed=!anchor.T.isVulnerable(anchor);anchor.mode='warn';record('anchor keeps its opening vulnerability and distinct opening art',closed&&anchor.T.isVulnerable(anchor)&&MISSION_ART.anchor.open!==MISSION_ART.anchor.idle);
  const escort=g.spawnEnemy('twinDart',170,32,{persistentEscort:true,lane:0}),dart=g.enemies.find(e=>e.type==='twinDart');
  record('boss escort uses the same compact detailed Dart and preserves its health',escort.w===20&&escort.h===10&&escort.w===dart.w&&escort.hp===2&&escort.T!==dart.T&&picture(escort)===MISSION_ART.dart.idle);
  const drawCalls=[],mock={drawImage:p=>drawCalls.push(p)};escort.T.draw(escort,mock,v=>v);
  record('boss escort renderer actually draws the new artwork',drawCalls[0]===MISSION_ART.dart.idle);
  escort.mode='warn';dart.mode='warn';escort.T.draw(escort,mock,v=>v);record('boss escort warning also draws the new open weapon state',picture(escort)===MISSION_ART.dart.open&&picture(escort)===picture(dart)&&drawCalls.at(-1)===MISSION_ART.dart.open);
  let escortMask=true;const d=picture(escort).hi.getContext('2d').getImageData(0,0,80,40).data;escort.passive=false;escort.arriving=false;
  for(let y=0;y<40;y++)for(let x=0;x<80;x++)escortMask&&=(escort.T.hitTest(escort,escort.x+(x+.25)/4,escort.y+(y+.25)/4,.1,.1)==='hit')===(d[(y*80+x)*4+3]===255);
  record('boss escort collision uses the new silhouette, including transparent wings',escortMask);
  escort.passive=true;record('passive boss escorts remain harmless with scaled art',escort.T.hitTest(escort,escort.x,escort.y,escort.w,escort.h)===null);
  escort.passive=false;escort.arriving=true;record('arriving boss escorts remain harmless and shootable only once fully visible',escort.T.hitTest(escort,escort.x,escort.y,escort.w,escort.h)===null&&escort.T.shotTest(escort,escort.x,escort.y,escort.w,escort.h)==='hit');
  const anchorArt=MISSION_ART.anchor,grounded=p=>{const data=p.hi.getContext('2d').getImageData(0,0,p.hi.width,p.hi.height).data;for(let x=0;x<p.hi.width;x++)if(data[((p.hi.height-1)*p.hi.width+x)*4+3])return true;return false;};
  record('anchor feet stay on the floor in both armor states',grounded(anchorArt.idle)&&grounded(anchorArt.open));
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
