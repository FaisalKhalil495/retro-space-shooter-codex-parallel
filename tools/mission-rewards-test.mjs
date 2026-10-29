// Real kill-to-loot, collection and shooting checks, with the delivered Preview
// 5 as a regression control. Cosmetic buffers are cleared only in bulk samples.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {serve} from './serve.mjs';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');
const out=process.argv[2]||'/tmp/ember-mission-rewards';await mkdir(out,{recursive:true});
const baseline='01608d089f94f389565e6ecec3be8e560c8f14b6';
const {server,base}=await serve();let browser,count=0;
try{
 browser=await chromium.launch({slowMo:0});
 for(const phone of [{name:'android',width:915,height:412,q:''},{name:'iphone',width:874,height:402,q:'?safe=62'}]){
  const page=await browser.newPage({viewport:{width:phone.width,height:phone.height},isMobile:true,hasTouch:true}),errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  await page.route('**/demos/glacier-level/*.js?mission=baseline5',route=>{
   const file=new URL(route.request().url()).pathname.split('/').pop(),body=execFileSync('git',['show',baseline+':demos/glacier-level/'+file],{encoding:'utf8'}).replaceAll('mission=5','mission=baseline5');
   return route.fulfill({body,contentType:'text/javascript'});
  });
  if(process.env.NO_KILL_LOOT)await page.route('**/demos/glacier-level/enemies.js?mission=6',async route=>{
   const body=(await readFile(new URL('../demos/glacier-level/enemies.js',import.meta.url),'utf8')).replace('dropChance:loot[key]','dropChance:0');
   return route.fulfill({body,contentType:'text/javascript'});
  });
  await page.goto(base+'demos/glacier-level/'+phone.q);await page.waitForFunction(()=>window.__mission?.artworkReady);await page.evaluate(()=>window.__mission.frozen=true);
  const result=await page.evaluate(async old=>{
   const now=await import('/demos/glacier-level/scene.js?mission=6'),prior=await import('/demos/glacier-level/scene.js?mission=baseline5');await prior.battleReady;
   const {Game}=await import('/js/game.js?v=0.29.0'),{SPECIALS}=await import('/js/weapons.js?v=0.29.0');
   const G=old?prior.MissionGame:now.MissionGame,Before=prior.MissionGame,checks=[],record=(name,ok,detail)=>checks.push({name,ok:!!ok,detail});
   const spec={shelfSkiff:[18,7,.3],anchorGun:[17,10,.15],twinDart:[14,7,.2],crestBomber:[20,6,.35],snowRoller:[18,8,.35],needleWing:[20,7,.15],wakeHunter:[19,8,.1]};
   const make=(C=G,hp=5)=>{const g=new C();g.runner={t:30,update(){}};g.health=hp;Object.assign(g.player,{x:26,y:65,entering:0,invuln:0});return g;};
   const seed=g=>{let n=28;g.rand=()=>{n=(n*1664525+1013904223)>>>0;return n/4294967296;};};
   const sample=(C,type,n,hp=5)=>{
    const g=make(C,hp);seed(g);const kinds={},prefix=[];
    for(let i=0;i<n;i++){
     const e=g.spawnEnemy(type,120,40,{missionRegular:true});e.mode='warn';g.damage(e,e.hp);
     for(const p of g.pickups)kinds[p.kind]=(kinds[p.kind]||0)+1;
     g.pickups=[];g.particles=[];g.blasts.reset();g.gore.reset();g.popups=[];prefix.push(Object.values(kinds).reduce((a,b)=>a+b,0));
    }
    return {kinds,total:prefix.at(-1),prefix};
   };
   const distribution=[];
   for(const [type,[w,h,chance]]of Object.entries(spec)){
    const g=make(),b=make(Before),e=g.spawnEnemy(type,120,40),before=b.spawnEnemy(type,120,40);
    record(type+': another 26–30% narrower, original toughness and properly scaled body',e.w===w&&e.h===h&&e.w/before.w>=.69&&e.w/before.w<=.75&&e.hp===before.hp);
    const full=sample(G,type,600),hurt=sample(G,type,600,2),previous=sample(Before,type,40);
    distribution.push({type,chance,full:{kinds:full.kinds,total:full.total},hurt:{kinds:hurt.kinds,total:hurt.total}});
    record(type+': actual kills now yield ammo/shooting rewards; Preview 5 yielded none',full.total>600*(chance-.08)&&full.total<600*(chance+.08)&&full.kinds.ammo>0&&full.kinds.spread>0&&full.kinds.rapid>0&&previous.total===0,{full:full.total,previous:previous.total});
    record(type+': native low-health help and full-health repair redistribution',!full.kinds.repair&&hurt.total>full.total&&hurt.kinds.repair>=hurt.total*.5,{full:full.kinds,hurt:hurt.kinds});
   }
   record('native kill-loot, collection and item placement rules are reused',G.prototype.maybeDrop===Game.prototype.maybeDrop&&G.prototype.collectPickup===Game.prototype.collectPickup&&G.prototype.spawnPickup===Game.prototype.spawnPickup);
   const more=sample(G,'twinDart',200);
   record('more successful kills produce more actual rewards, without a new currency',more.total>more.prefix[39]*3&&more.prefix[39]>0, {kills40:more.prefix[39],kills200:more.total});
   {
    const g=make();g.rand=()=>0;const e=g.spawnEnemy('twinDart',120,40);e.mode='warn';g.damage(e,2);const drops=g.pickups.length,score=g.score;g.damage(e,99);
    record('a dead enemy cannot award a second item or score',drops===1&&g.pickups.length===drops&&g.score===score&&!g.enemies.includes(e));
    for(const type of ['coastBomb','rollingCharge']){const h=make();h.rand=()=>0;const bomb=h.spawnEnemy(type,120,60,{tx:30,ty:80});h.damage(bomb,1);record(type+': shootdown keeps its original points without loot farming',h.pickups.length===0&&bomb.dead);}
    const escort=make();escort.rand=()=>0;const fighter=escort.spawnEnemy('twinDart',160,32,{persistentEscort:true,byBoss:true,lane:0});fighter.passive=false;fighter.arriving=false;escort.damage(fighter,2);
    record('boss escorts retain native no-random-loot policy and supply system',fighter.dead&&escort.pickups.length===0);
   }
   for(const kind of ['bomb','rockets','laser']){
    const g=make();g.weapons.collect(kind);const ammo=g.weapons.ammo;g.weapons.ammo=1;g.collectPickup(g.resolvePickup('ammo'));
    record(kind+': ammo refills the carried special without swapping it',g.weapons.kind===kind&&g.weapons.ammo===Math.min(SPECIALS[kind].max,1+ammo));
    g.weapons.ammo=SPECIALS[kind].max;const gift=g.resolvePickup('ammo');g.spawnPickup('ammo',g.player.x+4,g.player.y+1);g.collide();
    record(kind+': full ammo visibly resolves to a useful shooting power-up on collection',gift==='rapid'&&g.powerups.has('rapid')&&g.weapons.kind===kind&&g.weapons.ammo===SPECIALS[kind].max);
    record(kind+': spending ammo before grabbing it restores an ammo reward',(()=>{g.weapons.ammo--;return g.resolvePickup('ammo')==='ammo';})());
   }
   for(const type of ['shelfSkiff','anchorGun','snowRoller']){
    const g=make();g.player.y=118;g.rand=()=>.99;const e=g.spawnEnemy(type,160,0);let deadAt=null;
    for(let i=0;i<120*5&&!e.dead;i++){g.update(1/120,{dx:0,dy:0,fire:true});if(e.dead)deadAt=g.time;}
    record(type+': the smaller ground machine remains killable with the normal gun from legal flight height',e.dead&&deadAt<4&&g.health===5,{deadAt,health:g.health});
   }
   const encounters=[];
   for(const [gift,rolls]of [['ammo',[.01,.1]],['spread',[.01,.9,.4]],['rapid',[.01,.9,.7]]]){
    const g=make();g.player.y=32;g.rand=()=>.9;const e=g.spawnEnemy('twinDart',213,32),drop=g.maybeDrop.bind(g);
    g.maybeDrop=enemy=>{const rand=g.rand;let i=0;g.rand=()=>rolls[i++]??.9;try{drop(enemy);}finally{g.rand=rand;}};
    let born=false,collected=false;
    for(let i=0;i<120*8&&!collected;i++){
     const p=g.player,item=g.pickups[0];born||=!!item;const x=item?item.x-4:p.x,y=item?item.y:p.y;
     g.update(1/120,{dx:item&&Math.abs(x-p.x)>1?Math.sign(x-p.x):0,dy:item&&Math.abs(y-p.y)>1?Math.sign(y-p.y):0,fire:!e.dead});
     collected=gift==='ammo'?!!g.weapons.kind:g.powerups.has(gift);
    }
    record(gift+': real normal-gun kill, native movement to the drop and native collection',e.dead&&g.score===30&&born&&collected&&g.health===5&&g.lives===3,{dead:e.dead,born,collected,health:g.health,weapon:g.weapons.kind});
    if(gift!=='ammo'){
     g.bullets=[];g.player.cooldown=0;g.updatePlayer(0,{dx:0,dy:0,fire:true});
     record(gift+': earned shooting power actually changes native firing',gift==='spread'?g.bullets.length===3:g.bullets.length===1&&g.powerups.fireInterval()===.065);
    }
    encounters.push({gift,health:g.health,lives:g.lives,weapon:g.weapons.kind,powers:{...g.powerups.timers}});
   }
   return {checks,distribution,more:{kills40:more.prefix[39],kills200:more.total},encounters};
  },!!process.env.OLD_REWARDS);
  await writeFile(join(out,phone.name+'-review.json'),JSON.stringify(result,null,2)+'\n');
  for(const r of result.checks){assert.ok(r.ok,phone.name+': '+r.name+' '+JSON.stringify(r.detail??''));count++;console.log('PASS '+phone.name+': '+r.name);}
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('All '+count+' mission reward checks passed');
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
