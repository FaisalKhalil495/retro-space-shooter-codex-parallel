// Complete separate Level 4 preview; progression fixtures are invulnerable.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {serve} from './serve.mjs';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');
const out=process.argv[2]||'/tmp/ember-mission';await mkdir(out,{recursive:true});
const {server,base}=await serve();let browser,count=0;
const check=(name,ok,detail)=>{assert.ok(ok,name+' '+JSON.stringify(detail??''));count++;console.log('PASS '+name);};
try{
 browser=await chromium.launch({slowMo:0});
 for(const phone of [{name:'android',width:915,height:412,dpr:2.625,q:''},{name:'iphone',width:874,height:402,dpr:3,q:'?safe=62'}]){
  const context=await browser.newContext({viewport:{width:phone.width,height:phone.height},deviceScaleFactor:phone.dpr,isMobile:true,hasTouch:true});
  await context.addInitScript(()=>{window.__writes=[];const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){window.__writes.push(k);return set.call(this,k,v);};});
  const page=await context.newPage(),errors=[],external=[],music=[];
  page.on('pageerror',e=>errors.push(String(e)));page.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith(base))external.push(r.url());if(/\/music\/.*\.mp3/.test(r.url()))music.push(r.url());});
  await page.goto(base+'demos/glacier-level/'+phone.q);await page.waitForFunction(()=>window.__mission?.artworkReady);await page.evaluate(()=>window.__mission.frozen=true);
  check(phone.name+': ready with original health, lives and ordinary gun',await page.evaluate(()=>{const h=window.__mission,g=h.game;return h.mode==='ready'&&g.health===5&&g.lives===3&&!g.weapons.kind&&!g.boss&&g.enemies.length===0&&g.bg.loaded&&!g.reachedBoss;}));
  await page.locator('#action').tap();await page.evaluate(()=>window.__mission.advance(.8));
  const {layout,fire}=await page.evaluate(()=>({layout:window.__mission.layout,fire:window.__mission.controls.buttons.fire}));
  check(phone.name+': original safe-area layout',layout.game.x>=(phone.q?62:0)&&layout.rightZone.x+layout.rightZone.w<=phone.width-(phone.q?62:0));
  const cdp=await context.newCDPSession(page),pad=[layout.leftZone.x+layout.leftZone.w/2,layout.leftZone.y+layout.leftZone.h*.6];
  const touch=(type,points)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:points.map(([x,y,id])=>({x,y,id}))});
  const before=await page.evaluate(()=>({...window.__mission.game.player}));
  await touch('touchStart',[[...pad,1],[fire.x,fire.y,2]]);await touch('touchMove',[[pad[0]+32,pad[1]-32,1],[fire.x,fire.y,2]]);
  const moved=await page.evaluate(()=>{const h=window.__mission;h.advance(.3);return {p:h.game.player,shots:h.game.bullets.length};});
  check(phone.name+': real simultaneous thumbs move and fire',moved.p.x>before.x+5&&moved.p.y<before.y-5&&moved.shots>0);await touch('touchEnd',[]);
  await page.locator('#pause').tap();const frozen=await page.evaluate(()=>JSON.stringify({t:window.__mission.game.time,r:window.__mission.game.runner.t,b:window.__mission.game.bg.t}));await page.evaluate(()=>window.__mission.advance(3));
  check(phone.name+': pause freezes scenery, wave clock and game',await page.evaluate(v=>JSON.stringify({t:window.__mission.game.time,r:window.__mission.game.runner.t,b:window.__mission.game.bg.t})===v,frozen));
  await page.locator('#action').tap();await page.setViewportSize({width:412,height:915});await page.waitForFunction(()=>!document.querySelector('#rotate').hidden);
  check(phone.name+': portrait pauses',await page.evaluate(()=>window.__mission.mode==='paused'));
  await page.setViewportSize({width:phone.width,height:phone.height});await page.waitForFunction(()=>document.querySelector('#rotate').hidden);await page.locator('#action').tap();await page.evaluate(()=>window.dispatchEvent(new Event('blur')));
  check(phone.name+': app interruption pauses',await page.evaluate(()=>window.__mission.mode==='paused'));await page.locator('#restart').tap();
  const results=await page.evaluate(async()=>{
   const {MissionGame,ARRIVALS,SUPPLIES,regulars}=await import('/demos/glacier-level/scene.js?mission=3');
   const {Game}=await import('/js/game.js?v=0.29.0');const {LEVELS}=await import('/js/levels.js?v=0.29.0');
   const {useDetail}=await import('/js/detail.js?v=0.29.0');const {BossGame}=await import('/demos/glacier-boss/scene.js?boss=7');
   const checks=[],record=(name,ok,detail)=>checks.push({name,ok:!!ok,detail});
   const roster=['shelfSkiff','anchorGun','twinDart','crestBomber','snowRoller','needleWing','wakeHunter'];
   record('80 scheduled regular craft in three escalating sections',ARRIVALS.length===80&&[1,2,3].every((n,i)=>ARRIVALS.filter(e=>e.section===n).length===[20,26,34][i])&&roster.every(t=>ARRIVALS.some(e=>e.type===t)));
   record('original ten supply pods and their contents',JSON.stringify(SUPPLIES)===JSON.stringify([['rockets',20],['shield',36],['bomb',49],['spread',64],['life',77],['repair',90],['rapid',110],['laser',126],['repair',140],['wingman',154]].map(([drop,time])=>({time,drop}))));
   const other=new MissionGame(),bossPreview=new BossGame();await Promise.resolve();
   record('campaign remains three levels; approved scenery is reused',LEVELS.length===3&&other.bg.world===window.__mission.game.bg.world&&bossPreview.bg.world===window.__mission.game.bg.world);
   const metrics=[];
   for(const fire of [false,true])for(const seed0 of [28,782,4567]){
    const g=new MissionGame();let seed=seed0;g.rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    let cap=0,maxObjects=0,maxShots=0,minSpace=119,overlap=false,onGround=true,transitionSafe=true,bossAt=null;const phases=[];
    for(let i=0;i<120*380;i++){
     g.player.invuln=100;
     if(fire){const target=g.boss||g.enemies.filter(e=>!e.dead&&(e.type==='carrier'||e.missionRegular)).sort((a,b)=>a.x-b.x)[0];g.player.x=26;if(target)g.player.y=Math.max(11,Math.min(118,g.boss?target.y+9:target.y+target.h/2-5));}
     g.update(1/120,{dx:0,dy:0,fire,special:fire&&!!g.boss?.open});
     if(g.boss){if(bossAt===null){bossAt=g.time;transitionSafe=regulars(g).length===0&&!g.enemies.some(e=>['coastBomb','rollingCharge'].includes(e.type))&&g.enemyShots.length===0;}if(!phases.includes(g.boss.phase))phases.push(g.boss.phase);if(!fire)break;}
     if(!g.boss){
      const actors=regulars(g);cap=Math.max(cap,actors.length);onGround&&=actors.filter(e=>['shelfSkiff','anchorGun','snowRoller'].includes(e.type)).every(e=>e.y+e.h===130);
      const visible=g.enemies.filter(e=>!e.dead&&e.x<208&&e.x+e.w>0&&(e.missionRegular||['coastBomb','rollingCharge'].includes(e.type)));
      const machines=visible.filter(e=>e.missionRegular);
      overlap||=machines.some((a,i)=>machines.slice(i+1).some(b=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y));
      maxObjects=Math.max(maxObjects,visible.length);maxShots=Math.max(maxShots,g.enemyShots.length);
      for(let x=0;x<208;x+=24){const bands=visible.filter(e=>e.x<x+24&&e.x+e.w>x).map(e=>[Math.max(11,e.y-4),Math.min(130,e.y+e.h+4)]).sort((a,b)=>a[0]-b[0]);let edge=11,gap=0;for(const [lo,hi]of bands){gap=Math.max(gap,lo-edge);edge=Math.max(edge,hi);}minSpace=Math.min(minSpace,Math.max(gap,130-edge));}
     }
     if(g.state==='clear')break;
    }
    const arrivals=g.audit.filter(e=>e.kind==='arrival'),counts={};for(const e of arrivals)counts[e.type]=(counts[e.type]||0)+1;
    const m={fire,seed:seed0,counts,total:arrivals.length,skipped:g.audit.filter(e=>e.kind==='waveSkipped').length,cap,maxObjects,maxShots,minSpace,overlap,onGround,bossAt,totalTime:g.time,phases,maxDelay:Math.max(...arrivals.map(e=>e.delay))};metrics.push(m);
    record('seed '+seed0+' '+(fire?'armed progression':'no-fire crowding')+': bounded lanes, visible separation and clear flight space',cap<=4&&!overlap&&onGround&&minSpace>=33,m);
    record('seed '+seed0+': all seven types, finite delays and safe boss handoff',roster.every(t=>counts[t]>0)&&m.maxDelay<=12.01&&bossAt>=183&&bossAt<215&&transitionSafe&&!g.audit.some(e=>e.kind==='approachFallback'),m);
    record('seed '+seed0+': pods and wave bookkeeping',g.audit.filter(e=>e.kind==='missionSupply').length===10&&arrivals.length+m.skipped===80&&arrivals.every((e,i)=>!i||e.at-arrivals[i-1].at>=.89),m);
    if(fire)record('seed '+seed0+': full 80-enemy victory through all boss phases',g.state==='clear'&&m.total===80&&phases.join(',')==='1,2,3'&&g.score>10000&&g.audit.filter(e=>e.kind==='chosen'&&e.phase===3).length>0,m);
   }
   const carry=new MissionGame();carry.runner.phase='warning';carry.runner.timer=2.995;carry.reachedBoss=true;carry.player.entering=0;
   carry.health=3;carry.lives=2;carry.score=4321;carry.weapons.kind='rockets';carry.weapons.ammo=2;carry.powerups.collect('rapid');
   const weapons=carry.weapons,powers=carry.powerups,rapid=powers.timers.rapid;carry.update(1/120,{dx:0,dy:0,fire:false});
   record('boss transition preserves health, lives, score, weapons and remaining power-up time',!!carry.boss&&carry.health===3&&carry.lives===2&&carry.score===4321&&carry.weapons===weapons&&carry.weapons.kind==='rockets'&&carry.weapons.ammo===2&&carry.powerups===powers&&Math.abs(powers.timers.rapid-rapid+1/120)<.00001);
   record('checkpoint retry is unavailable before the boss warning',!new MissionGame().retryBoss());
   const ordinary=new MissionGame();ordinary.runner={update(){}};Object.assign(ordinary.player,{x:26,y:100,entering:0,invuln:100});
   const skiff=ordinary.spawnEnemy('shelfSkiff',100,0,{missionRegular:true});skiff.mode='warn';skiff.timer=0;
   ordinary.update(1/120,{dx:0,dy:0,fire:false});
   record('regular gunfire retains native ownership rather than being tagged as boss fire',ordinary.enemyShots.length===3&&ordinary.enemyShots.every(s=>!s.byBoss));
   carry.retryBoss();record('boss retry resets score and supplies using native fresh-start values',carry.score===0&&carry.health===5&&carry.lives===3&&!carry.weapons.kind&&Object.keys(carry.powerups.timers).length===0&&carry.runner.phase==='approach'&&carry.reachedBoss&&carry.runner.pending.length===0&&carry.enemies.length===0&&carry.supplyCount===0);
   for(let i=0;i<120*5;i++)carry.update(1/120,{dx:0,dy:0,fire:false});record('boss retry brings in Breakwater without regular waves',!!carry.boss&&!carry.audit.some(e=>e.kind==='arrival'));
   carry.reset();record('full replay clears boss checkpoint, clocks, hazards and reward state',!carry.reachedBoss&&carry.time===0&&carry.bg.t===0&&carry.runner.t===0&&carry.runner.phase==='waves'&&!carry.enemies.length&&!carry.pickups.length&&!carry.enemyShots.length&&carry.score===0&&carry.audit.length===0);
   const stuck=new MissionGame();stuck.player.entering=0;stuck.runner.phase='approach';const bomb=stuck.spawnEnemy('coastBomb',100,60,{tx:30,ty:90});bomb.T={...bomb.T,update(){}};
   for(let i=0;i<120*28;i++){stuck.player.invuln=100;stuck.update(1/120,{dx:0,dy:0,fire:false});}
   record('unexpected stuck hazards cannot deadlock approach or fire after retirement',stuck.reachedBoss&&!!stuck.boss&&bomb.dead&&!stuck.enemies.includes(bomb)&&!stuck.enemyShots.length&&!stuck.audit.some(e=>e.kind==='burst'));
   for(const type of ['coastBomb','rollingCharge']){
    const g=new MissionGame();g.runner={update(){}};g.player.invuln=100;
    const e=g.spawnEnemy(type,120,60,{tx:30,ty:80});e.t=type==='coastBomb'?1.095:1.495;g.damage(e,1);
    for(let i=0;i<5;i++)g.update(1/120,{dx:0,dy:0,fire:false});
    record('shooting a '+type+' down immediately before bursting cancels its fragments',e.dead&&!g.audit.some(a=>a.kind==='burst')&&g.enemyShots.length===0);
   }
   // Independent original player renderer/firing comparison, with scenery off.
   const live=new MissionGame(),make=proto=>{const g=Object.assign(Object.create(proto),live);g.player={...live.player,x:36,y:64,entering:0,invuln:0,cooldown:0,moveX:1};g.enemies=[];g.enemyShots=[];g.bullets=[];g.runner={update(){}};g.bg={draw(c){c.fillStyle='#0b0f1c';c.fillRect(0,0,208,144);}};g.drawHud=()=>{};return g;};
   const demo=make(MissionGame.prototype),ref=make(Game.prototype);ref.draw=Game.prototype.draw;ref.drawPlayer=Game.prototype.drawPlayer;
   for(let i=0;i<72;i++){demo.updatePlayer(1/120,{dx:0,dy:0,fire:true});Game.prototype.updatePlayer.call(ref,1/120,{dx:0,dy:0,fire:true});}
   const firing=JSON.stringify(demo.bullets)===JSON.stringify(ref.bullets)&&demo.bullets.length>2;
   const pixels=g=>{const c=document.createElement('canvas');c.width=416;c.height=288;const ctx=useDetail(c.getContext('2d'));ctx.scale(2,2);g.draw(ctx,v=>v);return ctx.getImageData(0,0,416,288).data;};const a=pixels(demo),b=pixels(ref);
   // Only the requested ship's interior colors may differ. Everything
   // outside its original body (flame, bullets, world effects) stays exact.
   const {HERO}=await import('/demos/glacier-level/art.js?mission=3');
   const {SPRITES}=await import('/js/sprites.js?v=0.29.0');
   const old=SPRITES.player.hi.getContext('2d').getImageData(0,0,36,22).data;
   const fine=HERO.hi.getContext('2d').getImageData(0,0,72,44).data;
   let silhouette=true,changed=0,outside=true;
   for(let y=0;y<44;y++)for(let x=0;x<72;x++)if((fine[(y*72+x)*4+3]>0)!==(old[(Math.floor(y/2)*36+Math.floor(x/2))*4+3]>0))silhouette=false;
   for(let y=0;y<288;y++)for(let x=0;x<416;x++)for(let k=0;k<4;k++)if(a[(y*416+x)*4+k]!==b[(y*416+x)*4+k]){
    const px=Math.floor(x/2-demo.player.x),py=Math.floor(y/2-demo.player.y);
    if(px<0||py<0||px>=18||py>=11)outside=false;else changed++;
   }
   record('sharper ship preserves original silhouette, flame, bullets, geometry and firing',firing&&silhouette&&changed>20&&outside&&demo.player.w===ref.player.w&&demo.player.h===ref.player.h);
   return {checks,metrics};
  });
  for(const r of results.checks)check(phone.name+': '+r.name,r.ok,r.detail);
  await writeFile(join(out,phone.name+'-metrics.json'),JSON.stringify(results.metrics,null,2)+'\n');
  await page.evaluate(()=>{const h=window.__mission;h.game.lives=1;h.game.hurtPlayer(99);h.advance(1.6);});
  check(phone.name+': wave defeat offers whole-mission replay without boss retry',await page.evaluate(()=>window.__mission.mode==='lost'&&document.querySelector('#checkpoint').hidden));await page.locator('#action').tap();
  await page.evaluate(()=>{const h=window.__mission,g=h.game;g.reachedBoss=true;g.lives=1;g.hurtPlayer(99);h.advance(1.6);});
  check(phone.name+': reached-boss defeat exposes the zero-score retry',await page.evaluate(()=>window.__mission.mode==='lost'&&!document.querySelector('#checkpoint').hidden));await page.locator('#checkpoint').tap();
  check(phone.name+': real retry tap restores native fresh boss attempt',await page.evaluate(()=>{const g=window.__mission.game;return g.score===0&&g.health===5&&g.lives===3&&!g.weapons.kind&&g.runner.phase==='approach'&&window.__mission.mode==='playing';}));
  await page.evaluate(()=>{const h=window.__mission;h.game.player.invuln=100;h.advance(11);});await page.screenshot({path:join(out,phone.name+'-boss.png')});
  await page.locator('#pause').tap();await page.locator('#restart').tap();await page.evaluate(()=>{const h=window.__mission;h.game.player.invuln=100;h.advance(110);});await page.screenshot({path:join(out,phone.name+'-waves.png')});
  check(phone.name+': no save writes, music requests, external calls or script errors',await page.evaluate(()=>window.__writes.length===0)&&music.length===0&&external.length===0&&errors.length===0,{music,external,errors});
  await context.close();
 }
 console.log('All '+count+' mission checks passed');
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
