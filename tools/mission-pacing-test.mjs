// Actual movement and five-drop bomber sequences versus delivered Preview 6.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {serve} from './serve.mjs';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');
const out=process.argv[2]||'/tmp/ember-mission-pacing';await mkdir(out,{recursive:true});
const baseline='de14968ee094a15443f1dd9d2a98aceda7e99101';
const {server,base}=await serve();let browser,count=0;
try{
 browser=await chromium.launch({slowMo:0});
 for(const phone of [{name:'android',width:915,height:412,q:''},{name:'iphone',width:874,height:402,q:'?safe=62'}]){
  const page=await browser.newPage({viewport:{width:phone.width,height:phone.height},isMobile:true,hasTouch:true}),errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  await page.route('**/demos/glacier-level/*.js?mission=baseline6',route=>{
   const file=new URL(route.request().url()).pathname.split('/').pop(),body=execFileSync('git',['show',baseline+':demos/glacier-level/'+file],{encoding:'utf8'}).replaceAll('mission=6','mission=baseline6');
   return route.fulfill({body,contentType:'text/javascript'});
  });
  await page.goto(base+'demos/glacier-level/'+phone.q);await page.waitForFunction(()=>window.__mission?.artworkReady);await page.evaluate(()=>window.__mission.frozen=true);
  const result=await page.evaluate(async old=>{
   const now=await import('/demos/glacier-level/scene.js?mission=7'),prior=await import('/demos/glacier-level/scene.js?mission=baseline6');await prior.battleReady;
   const G=old?prior.MissionGame:now.MissionGame,Before=prior.MissionGame,checks=[],record=(name,ok,detail)=>checks.push({name,ok:!!ok,detail});
   const roster=['shelfSkiff','anchorGun','twinDart','crestBomber','snowRoller','needleWing','wakeHunter'];
   const make=(C=G)=>{const g=new C();g.runner={t:30,update(){}};g.rand=()=>.45;Object.assign(g.player,{x:26,y:65,entering:0,invuln:100});return g;};
   for(const type of roster){
    const measure=(C,mode)=>{const g=make(C),e=g.spawnEnemy(type,mode==='enter'?213:160,32,{missionRegular:true});e.mode=mode;const x=e.x;for(let i=0;i<30;i++)g.update(1/120,{dx:0,dy:0,fire:false});return (x-e.x)/.25;};
    const before=measure(Before,'enter'),after=measure(G,'enter'),leavingBefore=measure(Before,'leave'),leavingAfter=measure(G,'leave');
    record(type+': entry is 15% slower, with anchored guns following the ground',Math.abs(after-before*(type==='anchorGun'?1:.85))<1e-7,{before,after});
    record(type+': passing/exit movement is 15% slower',Math.abs(leavingAfter-leavingBefore*.85)<1e-7,{before:leavingBefore,after:leavingAfter});
   }
   for(const mode of ['enter','wait','warn','leave']){
    const g=make(),e=g.spawnEnemy('twinDart',170,32,{missionRegular:true,flow:true});e.mode=mode;e.timer=10;const x=e.x;
    for(let i=0;i<12;i++)g.update(1/120,{dx:0,dy:0,fire:false});
    record('group Dart '+mode+': one shared 40.8 px/s speed keeps formation spacing',Math.abs((x-e.x)/.1-40.8)<1e-7);
   }
   {
    const rows=[];for(const C of [Before,G]){const g=make(C),e=g.spawnEnemy('wakeHunter',213,32,{missionRegular:true});for(let i=0;i<120*5&&e.mode!=='dash';i++)g.update(1/120,{dx:0,dy:0,fire:false});const w=g.audit.find(a=>a.id===e.id&&a.kind==='warn'),d=g.audit.find(a=>a.id===e.id&&a.kind==='dash');rows.push({speed:Math.hypot(e.vx,e.vy),warn:d?.time-w?.time});}
    record('hunter dive is 15% slower and keeps its full 0.8-second warning',Math.abs(rows[1].speed-123.25)<1e-7&&Math.abs(rows[1].speed/rows[0].speed-.85)<1e-7&&rows[1].warn>=.8-1e-7,rows);
   }
   const bombers=[];
   for(const C of [Before,G]){
    const g=make(C),e=g.spawnEnemy('crestBomber',213,32,{missionRegular:true});let dir=1,retired=null;
    for(let i=0;i<120*22;i++){
     if(g.player.y>=114)dir=-1;if(g.player.y<=15)dir=1;
     g.update(1/120,{dx:0,dy:dir,fire:false});if(retired===null&&!g.enemies.includes(e))retired=g.time;
    }
    const events=g.audit.filter(a=>a.id===e.id),warns=events.filter(a=>a.kind==='warn'),fires=events.filter(a=>a.kind==='fire');
    bombers.push({retired,warns,fires,remaining:g.enemies.length,shots:g.enemyShots.length});
   }
   const before=bombers[0],after=bombers[1];
   record('surviving bombers release five bombs instead of two and remain longer',before.fires.length===2&&after.fires.length===5&&after.retired>before.retired+4&&after.retired<20,{before:{drops:before.fires.length,retired:before.retired},after:{drops:after.fires.length,retired:after.retired}});
   record('every bomb gets a full warning and locks its newly acquired target',after.warns.length===5&&after.fires.every((f,i)=>f.time-after.warns[i].time>=.8-1e-7&&f.targetX===after.warns[i].targetX&&f.targetY===after.warns[i].targetY));
   record('bombers re-aim between drops, preserve rests and clear all threats after departing',new Set(after.fires.map(e=>e.targetY)).size>=3&&after.fires.every((f,i)=>!i||f.time-after.fires[i-1].time>=1.9-1e-7)&&after.remaining===0&&after.shots===0);
   {
    const g=make(),e=g.spawnEnemy('crestBomber',213,32,{missionRegular:true});
    for(let i=0;i<120*10&&e.drops<2;i++)g.update(1/120,{dx:0,dy:0,fire:false});g.damage(e,e.hp);
    for(let i=0;i<120*16;i++)g.update(1/120,{dx:0,dy:0,fire:false});
    record('destroying a bomber after two drops cancels the three remaining bombs',e.dead&&!g.enemies.includes(e)&&g.audit.filter(a=>a.id===e.id&&a.kind==='fire').length===2);
   }
   record('all 54 formations, 214 scheduled craft and ten supply pods are preserved',JSON.stringify(now.ARRIVALS)===JSON.stringify(prior.ARRIVALS)&&JSON.stringify(now.SUPPLIES)===JSON.stringify(prior.SUPPLIES)&&now.FORMATIONS.length===54);
   const g=make(),b=make(Before);
   for(const boss of [false,true]){
    const a=g.fireShot(120,60,Math.PI,100,'shell',boss),old=b.fireShot(120,60,Math.PI,100,'shell',boss);
    record((boss?'boss':'ordinary')+' projectile speed and ownership are unchanged',a.vx===old.vx&&a.vy===old.vy&&a.byBoss===old.byBoss);
   }
   return {checks,bombers};
  },!!process.env.OLD_PACING);
  await writeFile(join(out,phone.name+'-review.json'),JSON.stringify(result,null,2)+'\n');
  for(const r of result.checks){assert.ok(r.ok,phone.name+': '+r.name+' '+JSON.stringify(r.detail??''));count++;console.log('PASS '+phone.name+': '+r.name);}
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('All '+count+' mission pacing checks passed');
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
