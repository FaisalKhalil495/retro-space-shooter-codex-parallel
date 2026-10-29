// Approved mission pressure pass: independent before/after rules and real dodges.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {serve} from './serve.mjs';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');
const out=process.argv[2]||'/tmp/ember-mission-pressure';await mkdir(out,{recursive:true});
const routes=JSON.parse(await readFile(new URL('./fixtures/mission-pressure-routes.json',import.meta.url),'utf8'));
// Pin the owner's last delivered Preview 3. Use its actual runner/behaviors,
// sharing identical art with the candidate. No live or unrelated repository.
const baseline='8357620ff413a3fb5e0e3cd004aa0f897d7bb1a9';
const source=name=>execFileSync('git',['show',baseline+':demos/glacier-level/'+name],{encoding:'utf8'});
const oldScene=source('scene.js').replace('./art.js?mission=3','./art.js?mission=4').replace('./enemies.js?mission=3','./enemies.js?mission=baseline');
const oldEnemies=source('enemies.js').replace('./art.js?mission=3','./art.js?mission=4');
const {server,base}=await serve();let browser,count=0;
try{
 browser=await chromium.launch({slowMo:0});
 for(const phone of [{name:'android',width:915,height:412,q:''},{name:'iphone',width:874,height:402,q:'?safe=62'}]){
  const page=await browser.newPage({viewport:{width:phone.width,height:phone.height},isMobile:true,hasTouch:true}),errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  await page.route('**/demos/glacier-level/scene.js?mission=baseline',r=>r.fulfill({body:oldScene,contentType:'text/javascript'}));
  await page.route('**/demos/glacier-level/enemies.js?mission=baseline',r=>r.fulfill({body:oldEnemies,contentType:'text/javascript'}));
  await page.goto(base+'demos/glacier-level/'+phone.q);await page.waitForFunction(()=>window.__mission?.artworkReady);await page.evaluate(()=>window.__mission.frozen=true);
  const result=await page.evaluate(async({routes,old})=>{
   const current=await import('/demos/glacier-level/scene.js?mission=4'),prior=await import('/demos/glacier-level/scene.js?mission=baseline');
   const {MissionGame:G,ARRIVALS}=old?prior:current,{MissionGame:Before}=prior;
   const {Game}=await import('/js/game.js?v=0.29.0');
   const {sfx}=await import('/js/audio.js?v=0.29.0');
   const {chooseMissionAttack}=await import('/demos/glacier-level/boss.js?mission=4');
   const {chooseAttack,beginAttack}=await import('/demos/glacier-boss/boss.js?boss=7');
   const checks=[],record=(name,ok,detail)=>checks.push({name,ok:!!ok,detail});
   const roster=['shelfSkiff','anchorGun','twinDart','crestBomber','snowRoller','needleWing','wakeHunter'];
   record('all seven types are scheduled during the first minute',roster.every(t=>ARRIVALS.some(e=>e.type===t&&e.time<60)));
   const make=(C=G,minute=0)=>{const g=new C();g.runner={t:minute*60,update(){}};g.rand=()=>.45;Object.assign(g.player,{x:26,y:65,entering:0,invuln:0});return g;};
   for(const [minute,multiplier]of [[0,1.2],[1,1.25],[2,1.3]]){
    const g=make(G,minute),s=g.fireShot(100,60,Math.PI,100),boss=g.fireShot(100,60,Math.PI,130,'shell',true);
    record('minute '+(minute+1)+': ordinary speed boost is '+multiplier+' without changing boss speeds or ownership',Math.abs(Math.hypot(s.vx,s.vy)-100*multiplier)<1e-8&&!s.byBoss&&Math.abs(Math.hypot(boss.vx,boss.vy)-130)<1e-8&&boss.byBoss);
   }
   const firstWarnings=[];
   for(const type of roster){
    const times=[];for(const C of [Before,G]){
     const g=make(C),e=g.spawnEnemy(type,213,32,{missionRegular:true,lane:0});g.player.invuln=100;
     let warned=null;for(let i=0;i<120*6&&!warned;i++){
      g.update(1/120,{dx:0,dy:0,fire:false});const a=g.audit.find(a=>a.id===e.id&&a.kind==='warn');if(a)warned={time:a.time,x:e.x,w:e.w};
     }
     times.push(warned);
    }
    firstWarnings.push({type,before:times[0],after:times[1]});
    record(type+': earlier first warning, only once fully visible and before parking',times.every(Boolean)&&times[1].time<times[0].time-.1&&times[1].x+times[1].w<=206.001&&times[1].x>148, times);
   }
   for(const [type,expected,duration]of [['shelfSkiff',3,.6],['twinDart',4,.45]]){
    const g=make(),e=g.spawnEnemy(type,213,32,{missionRegular:true});g.player.invuln=100;
    let ticks=0;const tick=sfx.tick;sfx.tick=()=>{ticks++;};
    try{for(let i=0;i<120*12;i++)g.update(1/120,{dx:0,dy:0,fire:false});}finally{sfx.tick=tick;}
    const events=g.audit.filter(a=>a.id===e.id),fires=events.filter(a=>a.kind==='fire'),warns=events.filter(a=>a.kind==='warn');
    record(type+': actual attack count increases with full warnings and native shot sounds',fires.length===expected&&ticks===expected*(type==='shelfSkiff'?3:1)&&fires.every((a,i)=>a.time-warns[i].time>=duration-1e-6),{fires: fires.length,warnings:warns.length,ticks});
   }
   for(const type of roster){
    const g=make(),e=g.spawnEnemy(type,213,32,{missionRegular:true});Object.assign(g.player,{x:188,y:65,invuln:100});let w=null,right=false,full=false,motion=false,exitDirection=null,exitX=null,exitStable=true;
    const fire=g.fireShot.bind(g);g.fireShot=(...a)=>{if(e.mode==='warn')motion||=Math.cos(a[2])>0;return fire(...a);};
    for(let i=0;i<120*8;i++){
     g.update(1/120,{dx:0,dy:0,fire:false});const event=g.audit.find(a=>a.id===e.id&&a.kind==='warn');
     if(event&&!w){w=event;right=e.facingRight;full=e.x+e.w<=206&&e.x+e.w<=g.player.x-5;}
     if(type==='snowRoller')motion||=g.enemies.some(a=>a.type==='rollingCharge'&&a.direction===1&&a.x>e.x+e.w-2);
     if(type==='crestBomber')motion||=g.enemies.some(a=>a.type==='coastBomb'&&a.x>a.sx);
     if(type==='wakeHunter')motion||=e.mode==='dash'&&e.vx>0;
     if(type==='wakeHunter'&&e.mode==='leave'){
      exitDirection??=e.facingRight?1:-1;if(exitX!==null)exitStable&&=(e.x-exitX)*exitDirection>=-1e-8;
      exitStable&&=(e.facingRight?1:-1)===exitDirection;exitX=e.x;
     }
    }
    const event=g.audit.find(a=>a.id===e.id&&['fire','dash'].includes(a.kind));
    record(type+': right-edge camping gets a visible turn, full warning and correctly directed attack',right&&full&&motion&&exitStable&&(type!=='wakeHunter'||exitDirection!==null)&&event?.time-w?.time>=w?.duration-1e-6,{right,full,motion,exitStable,warn:w?.time,fire:event?.time});
   }
   {
    const g=make(),charge=g.spawnEnemy('rollingCharge',170,122,{direction:1,life:1.5}),shots=[];let visible=true,rightward=true,previousX=charge.x,maxX=charge.x;
    const fire=g.fireShot.bind(g);g.fireShot=(...a)=>{shots.push(a);return fire(...a);};
    for(let i=0;i<120*2;i++){g.update(1/120,{dx:0,dy:0,fire:false});visible&&=charge.x>=0&&charge.x+charge.w<=208;rightward&&=charge.x>=previousX-1e-8;previousX=charge.x;maxX=Math.max(maxX,charge.x);}
    const warn=g.audit.find(a=>a.kind==='warn'&&a.id===charge.id),burst=g.audit.find(a=>a.kind==='burst'&&a.id===charge.id);
    record('rightward charges brake on-screen for the full fuse warning before five visible-origin fragments',visible&&rightward&&maxX===200&&burst?.time-warn?.time>=.65-1e-6&&shots.length===5&&shots.every(a=>a[0]>=0&&a[0]<=208));
    const killed=make(),e=killed.spawnEnemy('rollingCharge',170,122,{direction:1,life:1.5});e.t=1.495;killed.damage(e,1);
    for(let i=0;i<10;i++)killed.update(1/120,{dx:0,dy:0,fire:false});
    record('shooting a rightward charge on its last fuse frame cancels the burst',e.dead&&!killed.enemies.includes(e)&&killed.enemyShots.length===0&&!killed.audit.some(a=>a.kind==='burst'));
   }
   const wave=new G();wave.player.invuln=100;let supportedBomber=false,supportedHunter=false,clear=true;
   for(let i=0;i<120*61;i++){
    wave.update(1/120,{dx:0,dy:0,fire:false});const ds=wave.enemies.filter(e=>e.missionRegular&&!e.dead);
    supportedBomber||=ds.some(e=>e.type==='crestBomber'&&e.x+e.w<=208)&&ds.some(e=>e.type==='twinDart'&&e.x+e.w<=208);
    supportedHunter||=ds.some(e=>e.type==='wakeHunter'&&e.x+e.w<=208)&&ds.some(e=>['shelfSkiff','anchorGun','snowRoller'].includes(e.type)&&e.x+e.w<=208);
    clear&&=!ds.some(e=>e.type==='wakeHunter')||ds.filter(e=>e.T.flies).length===1;
   }
   record('all seven types actually enter before wave second 60',roster.every(t=>wave.audit.some(e=>e.kind==='arrival'&&e.type===t&&e.at<60)));
   record('actual first-minute waves pair a bomber with a Dart and a hunter with ground support',supportedBomber&&supportedHunter&&clear,{supportedBomber,supportedHunter,clear});
   // Complete native-input escape routes: normal 5 health / 3 lives, no
   // firing, invulnerability, position edits or removal of any live threat.
   for(const r of routes){
    const g=make(G,r.minute);Object.assign(g.player,{x:r.startX??26,y:r.startY??115});
    const a=g.spawnEnemy(r.first,213,r.firstY,{missionRegular:true}),b=g.spawnEnemy(r.second,213,r.secondY,{missionRegular:true,lane:1});
    const left=r.left??2,route=r.reverse?[[left,r.top],[r.right,r.top],[r.right,r.bottom],[left,r.bottom]]:[[r.right,r.bottom],[r.right,r.top],[left,r.top],[left,r.bottom]];let k=r.offset,lastWarning=-10,staggered=true,turnedAt=null,retreated=!r.retreat;
    for(let i=0;i<120*14;i++){
     const p=g.player;let [x,y]=route[k%4];
     if(r.retreat){
      if(turnedAt===null&&[a,b].some(e=>e.mode==='warn'&&e.facingRight))turnedAt=g.time;
      if(turnedAt===null||g.time<turnedAt+.15){x=p.x;y=p.y;}
      else if(!retreated){[x,y]=r.retreat;if(Math.abs(p.x-x)<2&&Math.abs(p.y-y)<2)retreated=true;}
      else if(Math.abs(p.x-x)<2&&Math.abs(p.y-y)<2)k++;
     }else if(Math.abs(p.x-x)<2&&Math.abs(p.y-y)<2)k++;
     const prior=g.audit.length;g.update(1/120,{dx:Math.abs(p.x-x)>1?Math.sign(x-p.x):0,dy:Math.abs(p.y-y)>1?Math.sign(y-p.y):0,fire:false});
     for(const event of g.audit.slice(prior))if(event.kind==='warn'&&event.type){staggered&&=event.time-lastWarning>=.28-1e-8;lastWarning=event.time;}
    }
    const counts=[a,b].map(e=>g.audit.filter(v=>v.id===e.id&&v.kind==='fire').length),dashes=g.audit.filter(v=>v.kind==='dash').length;
    record('minute '+(r.minute+1)+' '+r.first+' + '+r.second+(r.retreat?' turned corner escape':'')+': complete no-hit route, all expected attacks and staggered warnings',g.health===5&&g.lives===3&&g.enemyShots.length===0&&staggered&&retreated&&(!r.retreat||turnedAt!==null)&&JSON.stringify(counts)===JSON.stringify(r.counts)&&dashes===r.dashes,{counts,dashes,health:g.health,lives:g.lives,staggered});
   }
   for(const phase of [1,2,3]){
    let broad=true,combos=true,phaseOne=true;
    for(const dice of [.1,.45,.9])for(const y of [25,115]){
     const g=make(),b=g.spawnEnemy('breakwater',214,0);Object.assign(b,{x:130,mode:'fight',phase,idle:99});g.player.y=y;g.rand=()=>dice;const names=[];
     for(let i=0;i<100;i++){
      const name=chooseMissionAttack(b,g),native=phase===1?chooseAttack(b,g):null;if(phase===1)phaseOne&&=name===native;
      if(!beginAttack(b,g,name))throw new Error('Chosen attack could not start');names.push(name);b.attack=null;
      if(phase>=2&&i>=4)broad&&=names.slice(-3).includes('broadside');
      if(phase===3&&i>=4)combos&&=names.slice(-3).some(n=>n==='rushFlak'||n==='pursuit');
     }
    }
    record('phase '+phase+': live selector respects broadside/combination deadlines and preserves phase one',broad&&combos&&phaseOne);
   }
   const g=make(),boss=g.spawnEnemy('breakwater',214,0);Object.assign(boss,{x:130,mode:'fight',phase:3,introIndex:99,recent:['broadside','torpedoes'],idle:0});
   g.update(1/120,{dx:0,dy:0,fire:false});
   record('real boss update uses the new selector at the native warning start',boss.attack?.name==='rushFlak'&&boss.attack.t===0&&boss.hp===250);
   const warnAt=g.audit.find(a=>a.kind==='warn');g.player.invuln=100;
   for(let i=0;i<120*2&&!g.audit.some(a=>a.kind==='fire');i++)g.update(1/120,{dx:0,dy:0,fire:false});
   record('the real boss keeps the full 1.15-second lance/rush warning',g.audit.find(a=>a.kind==='fire')?.time-warnAt.time>=1.15-1e-6);
   // Controlled normal-health comparisons, including the previous world.
   // These are review indicators, not a substitute for the owner's phone play.
   const pressure=[];
   for(const x of [26,188])for(const target of (x===26?[14,65,115,'patrol']:[14,65,115]))for(const [name,C]of [['preview3',Before],['preview4',G],['frostring',Game]]){
    const g=C===Game?new C({level:3}):new C();let seed=28,dir=-1,first=null,shots=0;
    g.rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    const hurt=g.hurtPlayer.bind(g);g.hurtPlayer=(...a)=>{const hp=g.health;hurt(...a);if(g.health<hp)first??=g.time;};
    const fire=g.fireShot.bind(g);g.fireShot=(...a)=>{shots++;return fire(...a);};
    for(let i=0;i<120*180&&!['clear','gameover'].includes(g.state);i++){
     const p=g.player;if(p.y<=15)dir=1;if(p.y>=114)dir=-1;const ty=target==='patrol'?(dir<0?14:115):target;
     g.update(1/120,{dx:Math.abs(p.x-x)>1?Math.sign(x-p.x):0,dy:Math.abs(p.y-ty)>1?Math.sign(ty-p.y):0,fire:true,special:false});
    }
    pressure.push({name,x,target,time:g.time,state:g.state,lives:g.lives,health:g.health,firstDamage:first,shots});
   }
   const camps=[14,65,115].map(target=>pressure.filter(r=>r.target===target&&r.x===26));
   record('normal-health camping shooters face more pressure than delivered Preview 3',camps.every(rows=>rows[1].time<rows[0].time&&rows[1].firstDamage<rows[0].firstDamage),camps);
   const edge=pressure.filter(r=>r.x===188&&r.name==='preview4');
   record('far-right camping no longer bypasses the level unharmed',edge.every(r=>r.state==='gameover'&&r.firstDamage!==null&&r.shots>0),edge);
   return {checks,firstWarnings,pressure};
  },{routes,old:!!process.env.OLD_PRESSURE});
  for(const r of result.checks){assert.ok(r.ok,phone.name+': '+r.name+' '+JSON.stringify(r.detail??''));count++;console.log('PASS '+phone.name+': '+r.name);}
  assert.deepEqual(errors,[]);await writeFile(join(out,phone.name+'-review.json'),JSON.stringify(result,null,2)+'\n');await page.close();
 }
 console.log('All '+count+' mission pressure checks passed');
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
