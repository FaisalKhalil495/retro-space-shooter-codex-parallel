import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {serve} from './serve.mjs';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');
const out=process.argv[2]||'/tmp/ember-boss-checks';await mkdir(out,{recursive:true});
const {server,base}=await serve();let browser,checks=0;
const check=(name,ok,detail)=>{assert.ok(ok,name+' '+JSON.stringify(detail??''));checks++;console.log('PASS '+name);};
const fixture=JSON.stringify({reached:3,lastName:'TEST',scores:[{name:'TEST',score:7654,level:3}],settings:{music:2,sound:3,vibrate:false,blood:false}});
try{
 browser=await chromium.launch({slowMo:0});
 for(const phone of [{name:'android',width:915,height:412,dpr:2.625,q:''},{name:'iphone',width:874,height:402,dpr:3,q:'?safe=62'}]){
  const context=await browser.newContext({viewport:{width:phone.width,height:phone.height},deviceScaleFactor:phone.dpr,isMobile:true,hasTouch:true});
  await context.addInitScript(fixture=>{localStorage.setItem('emberDrift.save.v1',fixture);const set=Storage.prototype.setItem;window.__writes=[];Storage.prototype.setItem=function(k,v){window.__writes.push(k);return set.call(this,k,v);};},fixture);
  const page=await context.newPage(),errors=[],music=[];
  page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('request',r=>{if(/\/music\/.*\.mp3/.test(r.url()))music.push(r.url());});
  await page.goto(base+'demos/glacier-boss/'+phone.q);await page.waitForFunction(()=>window.__boss?.artworkReady);await page.evaluate(()=>window.__boss.frozen=true);
  const tap=async s=>{const box=await page.locator(s).boundingBox();assert.ok(box,s);await page.touchscreen.tap(box.x+box.width/2,box.y+box.height/2);};
  check(phone.name+': ready to start',await page.evaluate(()=>window.__boss.mode==='ready'&&!document.getElementById('action').disabled));
  await tap('#action');await page.evaluate(()=>window.__boss.advance(.8));
  const layout=await page.evaluate(()=>window.__boss.layout),fire=await page.evaluate(()=>window.__boss.controls.buttons.fire);
  check(phone.name+': original safe areas',layout.game.x>=(phone.q?62:0)&&layout.rightZone.x+layout.rightZone.w<=phone.width-(phone.q?62:0));
  const cdp=await context.newCDPSession(page),pad=[layout.leftZone.x+layout.leftZone.w/2,layout.leftZone.y+layout.leftZone.h*.6];
  const touch=(type,points)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:points.map(([x,y,id])=>({x,y,id}))});
  const before=await page.evaluate(()=>({...window.__boss.game.player}));
  await touch('touchStart',[[...pad,1],[fire.x,fire.y,2]]);await touch('touchMove',[[pad[0]+32,pad[1]-32,1],[fire.x,fire.y,2]]);
  const after=await page.evaluate(()=>{const h=window.__boss;h.advance(.3);return {p:h.game.player,bullets:h.game.bullets.length,dir:h.controls.pad.dir};});
  check(phone.name+': real simultaneous thumbs steer and fire',after.p.x>before.x+5&&after.p.y<before.y-5&&after.bullets>0&&after.dir===7);
  await touch('touchEnd',[]);check(phone.name+': releasing clears thumbs',await page.evaluate(()=>!window.__boss.controls.pad.active&&!window.__boss.controls.buttons.fire.held));
  await tap('#pause');const t=await page.evaluate(()=>window.__boss.game.time);await page.evaluate(()=>window.__boss.advance(2));
  check(phone.name+': pause freezes fight and coast',await page.evaluate(t=>window.__boss.mode==='paused'&&window.__boss.game.time===t&&window.__boss.game.bg.t===t,t));
  await tap('#action');await page.setViewportSize({width:412,height:915});await page.waitForFunction(()=>!document.getElementById('rotate').hidden);
  check(phone.name+': portrait pauses',await page.evaluate(()=>window.__boss.mode==='paused'&&!window.__boss.controls.enabled));
  await page.setViewportSize({width:phone.width,height:phone.height});await page.waitForFunction(()=>document.getElementById('rotate').hidden);await tap('#action');await page.evaluate(()=>window.dispatchEvent(new Event('blur')));
  check(phone.name+': app interruption pauses',await page.evaluate(()=>window.__boss.mode==='paused'));
  await tap('#restart');check(phone.name+': restart clears the whole encounter',await page.evaluate(()=>{const g=window.__boss.game;return g.time===0&&g.bg.t===0&&!g.boss&&g.enemies.length===0&&g.enemyShots.length===0&&g.pickups.length===0&&g.health===5&&g.lives===3&&g.weapons.kind===null&&g.audit.length===0;}));
  const result=await page.evaluate(async()=>{
   const {BossGame}=await import('/demos/glacier-boss/scene.js?boss=1');
   const {BREAKWATER,beginAttack,clearThreats,MOVES}=await import('/demos/glacier-boss/boss.js?boss=1');
   const {HULLS}=await import('/demos/glacier-boss/art.js?boss=1');
   const {Game}=await import('/js/game.js?v=0.29.0');const {ENEMY_TYPES}=await import('/js/enemies.js?v=0.29.0');const {LEVELS}=await import('/js/levels.js?v=0.29.0');
   const make=()=>{const g=new BossGame();g.runner={update(){}};g.rand=()=>.45;Object.assign(g.player,{x:26,y:115,entering:0,invuln:100});const b=g.spawnEnemy('breakwater',214,0);Object.assign(b,{x:130,mode:'fight',idle:99});return {g,b};};
   const tick=(g,s,input={dx:0,dy:0,fire:false})=>{for(let i=0;i<Math.round(s*120);i++)g.update(1/120,input);};
   const expose=b=>{b.open=true;b.attack={name:'broadside',stage:'recover',t:0};};
   const armor=make();armor.b.open=false;const hp=armor.b.hp;armor.g.strike(armor.b,armor.b.x,armor.b.y+14,7,2,1);
   const closed=armor.b.hp===hp;expose(armor.b);armor.g.strike(armor.b,armor.b.x-6,armor.b.y+14,7,2,1);const frontPath=armor.b.hp===hp-1;
   armor.g.strike(armor.b,armor.b.x+28,armor.b.y+12,7,2,10);const hullBlocks=armor.b.hp===hp-1;
   const ordinary=make();expose(ordinary.b);ordinary.g.player.y=ordinary.b.y+9;tick(ordinary.g,1,{dx:0,dy:0,fire:true});const ordinaryHits=ordinary.b.hp<hp;
   const weapon={};
   for(const kind of ['bomb','rockets','laser'])for(const open of [false,true]){
    const {g,b}=make();g.player.y=b.y+9;if(open)expose(b);g.weapons.collect(kind);g.weapons.fire();tick(g,1.05);weapon[kind+(open?'Open':'Shut')]=open?b.hp<hp:b.hp===hp;
   }
   const phase=make();let bonuses=[];phase.g.stageBonus=(b,n)=>{bonuses.push(n);Game.prototype.stageBonus.call(phase.g,b,n);};
   expose(phase.b);phase.g.damage(phase.b,84);const p2=phase.b.phase===2&&phase.b.mode==='transition'&&!phase.b.open&&phase.g.isSpeaking(phase.b)&&phase.g.enemyShots.length===0;
   tick(phase.g,2.4);expose(phase.b);phase.g.damage(phase.b,80);const p3=phase.b.phase===3&&phase.b.mode==='transition'&&bonuses.join(',')==='2,3'&&phase.g.score===3000&&phase.g.pickups.filter(p=>p.magnet).length>0;
   const talk=make();talk.g.say(talk.b,'HOLD YOUR FIRE', 'talk',2);talk.b.idle=0;const blockedStart=!beginAttack(talk.b,talk.g,'broadside');tick(talk.g,1.5);const noTalkShots=!talk.g.audit.some(a=>a.kind==='fire');
   const attacks=[];
   for(const name of ['broadside','skip','darts','ice','rush']){
    const {g,b}=make();b.phase=3;b.moveIndex=0;beginAttack(b,g,name);const angle=b.attack.angle,marks=JSON.stringify(b.attack.marks),path=JSON.stringify(b.attack.path);g.player.y=25;
    let maxDarts=0,maxShots=0,minY=130,maxX=0,minX=208,overlap=false;
    for(let i=0;i<12*120;i++){
     g.update(1/120,{dx:0,dy:0,fire:false});maxDarts=Math.max(maxDarts,g.enemies.filter(e=>e.type==='twinDart').length);maxShots=Math.max(maxShots,g.enemyShots.length);
     minY=Math.min(minY,b.y);minX=Math.min(minX,b.x);maxX=Math.max(maxX,b.x+b.w);
     const darts=g.enemies.filter(e=>e.type==='twinDart');if(darts.length===2){const [a,c]=darts;overlap ||= a.x<c.x+c.w&&a.x+a.w>c.x&&a.y<c.y+c.h&&a.y+a.h>c.y;}
     if(!b.attack)break;
    }
    let lastWarning=null,allWarnings=true,volleyCount=0;
    for(const ev of g.audit.filter(ev=>ev.id===b.id)){
      if(ev.kind==='warn')lastWarning=ev;
      if(ev.kind==='fire'){volleyCount++;allWarnings&&=!!lastWarning&&ev.time-lastWarning.time>=lastWarning.duration-.01;}
    }
    const fire=g.audit.find(a=>a.id===b.id&&a.kind==='fire'),warn=g.audit.find(a=>a.id===b.id&&a.kind==='warn');
    attacks.push({name,warned:!!fire&&fire.time-warn.time>=warn.duration-.01&&allWarnings&&volleyCount===(name==='broadside'?3:1),locked:!!fire&&Math.abs(fire.angle-angle)<1e-8,maxDarts,maxShots,ground:Math.abs(b.y+b.h-130)<.01,onscreen:minX>=29.9&&maxX<=208,overlap,clean:!b.attack&&!g.enemies.some(e=>['skipShell','twinDart'].includes(e.type)),marks,path});
   }
   let iceMarksSeparate=true;
   for(const x of [30,64,104,130,144])for(const px of [2,26,100,170,188]){
    const {g,b}=make();b.x=x;b.phase=3;g.player.x=px;beginAttack(b,g,'ice');const marks=b.attack.marks;
    iceMarksSeparate&&=marks.length===2&&marks.every(m=>Number.isFinite(m)&&m>=14&&m<=190&&(m<=b.x-9||m>=b.x+b.w+9))&&Math.abs(marks[0]-marks[1])>=44;
   }
   const shell=make();const s=shell.g.spawnEnemy('skipShell',110,123,{sx:113,tx:34,amp:64,byBoss:true});shell.g.damage(s,1);tick(shell.g,3);const shellSafe=!shell.g.audit.some(a=>a.kind==='shellBurst')&&s.dead;
   const owned=make();owned.g.spawnEnemy('twinDart',145,55,{byBoss:true});tick(owned.g,1.3);const ownedShot=owned.g.enemyShots[0];
   const tagged=!!ownedShot?.byBoss;if(ownedShot)owned.g.hurtPlayer(99,ownedShot);
   const bossDartOwnership=tagged&&owned.g.isSpeaking(owned.b)&&owned.b.T.killLines.includes(owned.g.quip)&&owned.g.enemyShots.length===0;
   const cleaned=make();expose(cleaned.b);const removed=cleaned.g.spawnEnemy('twinDart',160,60);
   const carrier=cleaned.g.spawnEnemy('carrier',190,24,{drop:'smart'});cleaned.g.weapons.collect('rockets');cleaned.g.weapons.fire();const guided=cleaned.g.weapons.rockets[0];guided.target=removed;
   clearThreats(cleaned.g);tick(cleaned.g,.025);
   const retargetAfterCleanup=removed.dead&&!cleaned.g.enemies.includes(removed)&&cleaned.g.enemies.includes(carrier)&&!carrier.dead&&guided.target===cleaned.b;
   const expired=make(),late=expired.g.spawnEnemy('skipShell',90,123,{sx:93,tx:35,amp:40,byBoss:true});late.t=2.09;expired.g.damage(late,1);tick(expired.g,.05);
   const lateShellSafe=!expired.g.audit.some(a=>a.kind==='shellBurst');
   const rush=make();rush.b.phase=3;beginAttack(rush.b,rush.g,'rush');tick(rush.g,1.4);rush.g.player.invuln=0;rush.g.health=5;rush.g.killPlayer(rush.b);
   const killedClear=rush.g.enemyShots.length===0&&!rush.b.attack&&!rush.b.open&&rush.g.isSpeaking(rush.b);tick(rush.g,1.6);const respawn=rush.g.state==='playing'&&rush.g.lives===2&&rush.g.health===5;
   const pushes=[];for(const x of [30,104,144])for(const side of ['front','rear','top','rush']){
    const {g,b}=make();b.x=x;if(side==='rush')b.attack={stage:'dash'};
    Object.assign(g.player,{x:side==='front'?x-5:side==='rear'?Math.min(188,x+54):x+25,y:side==='top'?b.y-4:b.y+10});b.T.knockback(b,g.player);
    const p=g.playerHitbox();pushes.push(!g.contact(b,p.x,p.y,p.w,p.h)&&g.player.x>=2&&g.player.x<=188&&g.player.y>=11);
   }
   const damage=make();damage.g.player.invuln=0;damage.g.enemyShots.push({x:34,y:120,vx:0,vy:0,t:0,byBoss:true});damage.g.collide();const nativeDamage=damage.g.health===4;
   const pockets=[];
   for(const [x,y]of [[26,20],[26,115],[180,20],[180,115],[130,65]]){
    const {g,b}=make();g.health=10000;g.player.invuln=0;b.phase=3;b.idle=0;
    for(let i=0;i<60*120;i++){g.player.x=x;g.player.y=y;g.update(1/120,{dx:0,dy:0,fire:false});}
    pockets.push({x,y,hurt:10000-g.health});
   }
   let dodges=true;
   for(const name of ['broadside','rush','ice','skip']){
    const {g,b}=make();g.health=10000;g.player.invuln=0;b.phase=3;if(name==='skip')g.player.y=97;beginAttack(b,g,name);
    const start=g.time;
    for(let i=0;i<12*120;i++){
      const elapsed=g.time-start;
      const goal=name==='ice'?(b.attack?.marks?.[0]+b.attack?.marks?.[1])/2-9:26;
      const dx=name==='ice'&&Number.isFinite(goal)&&Math.abs(g.player.x-goal)>1?Math.sign(goal-g.player.x):0;
      g.update(1/120,{dx,dy:name==='ice'?0:elapsed<1?-1:0,fire:false});
      if(!b.attack)break;
    }
    dodges&&=g.health===10000;
   }
   const noSafePockets=pockets.every(p=>p.hurt>0);
   const art=HULLS.every(a=>Object.values(a).every(p=>p.width===58&&p.height===24&&p.hi.width===116&&p.hi.height===48&&p.mask.some(Boolean)&&p.flash.hi.width===116));
   const masks=HULLS.every((a,index)=>Object.entries(a).every(([state,p])=>{const e={x:0,y:0,phase:index+1,open:state==='open',mode:'fight'};return p.mask.every((v,i)=>Boolean(v)===Boolean(BREAKWATER.hitTest(e,(i%116)/2+.1,Math.floor(i/116)/2+.1,.2,.2)));}));
   return {closed,frontPath,hullBlocks,ordinaryHits,...weapon,p2,p3,blockedStart,noTalkShots,iceMarksSeparate,shellSafe,lateShellSafe,retargetAfterCleanup,bossDartOwnership,killedClear,respawn,knockback:pushes.every(Boolean),nativeDamage,noSafePockets,dodges,art,masks,isolated:LEVELS.length===3&&!ENEMY_TYPES.breakwater,attacks};
  });
  for(const [key,value]of Object.entries(result))if(key!=='attacks')check(phone.name+': '+key,value,result);
  for(const a of result.attacks){check(phone.name+': '+a.name+' warned and locked',a.warned&&a.locked,a);check(phone.name+': '+a.name+' bounded, grounded and clears',a.maxDarts<=2&&a.maxShots<=10&&a.ground&&a.onscreen&&!a.overlap&&a.clean,a);}
  // Real encounter starts empty: no test laser or supply bypass. Ordinary
  // simulation runs to victory with original weapons, phase rewards and pods.
  const run=await page.evaluate(()=>{
   const h=window.__boss;h.game.reset();const g=h.game;g.rand=()=>.45;let maxDarts=0,maxShots=0,ground=true,pausedAttack=false,phases=[],first=null,lastB=null;
   for(let i=0;i<120*190&&h.mode==='playing';i++){
    const b=g.boss;if(b){lastB=b;if(!phases.includes(b.phase))phases.push(b.phase);if(b.mode==='fight'&&first===null)first=g.time;
      g.player.x=26;g.player.y=b.y+9;if(g.isSpeaking(b)&&b.attack)pausedAttack=true;ground&&=Math.abs(b.y+b.h-130)<.01;}
    g.player.invuln=100;h.advance(1/120,{dx:0,dy:0,fire:true,special:!!b?.T.isVulnerable(b)});
    maxDarts=Math.max(maxDarts,g.enemies.filter(e=>e.type==='twinDart').length);maxShots=Math.max(maxShots,g.enemyShots.length);
   }
   return {mode:h.mode,time:g.time,fighting:g.time-first,phases,ground,pausedAttack,maxDarts,maxShots,audit:g.audit,score:g.score,boss:g.boss,weapon:g.weapons.kind,remaining:g.enemies.length};
  });
  check(phone.name+': complete victory through original weapons and rewards',run.mode==='won'&&run.phases.join(',')==='1,2,3'&&run.score>=10000&&!run.boss,run);
  check(phone.name+': about 90–120 seconds with phase rewards',run.time>=85&&run.time<=125,run.time);
  check(phone.name+': all five attacks occur in complete fight',['broadside','skip','darts','ice','rush'].every(n=>run.audit.some(a=>a.attack===n&&a.kind==='fire')));
  check(phone.name+': full encounter keeps threats bounded and speech safe',run.maxDarts<=2&&run.maxShots<=10&&run.ground&&!run.pausedAttack,run);
  const supplies=run.audit.filter(a=>a.kind==='supply').map(a=>a.drop);check(phone.name+': actual survival and weapon supplies alternate',supplies.length>=3&&supplies.every((s,i)=>s===(i%2?'weapon':'smart')),supplies);
  const done=await page.evaluate(()=>window.__boss.game.time);await page.evaluate(()=>window.__boss.advance(4));check(phone.name+': victory freezes until replay',await page.evaluate(t=>window.__boss.game.time===t,done));
  await tap('#action');await page.evaluate(()=>{const h=window.__boss;h.game.player.invuln=100;h.advance(30);});
  check(phone.name+': fight continues beyond the old 30-second limit',await page.evaluate(()=>window.__boss.mode==='playing'&&window.__boss.game.time>29.9&&window.__boss.game.boss?.hp>0));
  await page.screenshot({path:join(out,phone.name+'-fight.png')});
  await page.evaluate(()=>{const g=window.__boss.game;g.spawnEnemy('skipShell',130,123,{sx:133,tx:40,amp:50});g.weapons.collect('laser');g.weapons.fire();});
  await tap('#pause');await tap('#restart');
  check(phone.name+': restart clears boss hazards, speech, weapons and rewards',await page.evaluate(()=>{const g=window.__boss.game;return !g.boss&&g.enemies.length===0&&g.enemyShots.length===0&&g.pickups.length===0&&g.timers.length===0&&!g.speech.bubble&&!g.weapons.laser&&g.weapons.kind===null&&g.supplyCount===0&&g.score===0;}));
  await page.evaluate(()=>{const h=window.__boss;h.game.player.invuln=100;h.advance(11);const b=h.game.boss;b.open=true;h.game.damage(b,84);h.game.lives=1;h.game.hurtPlayer(99,b);h.advance(1.6);});
  check(phone.name+': last-life death during a phase change remains a loss',await page.evaluate(()=>window.__boss.mode==='lost'));
  await tap('#action');
  await page.evaluate(()=>{const h=window.__boss;h.game.player.invuln=100;h.advance(11);const b=h.game.boss;b.hp=1;b.open=true;h.game.damage(b,1);h.game.lives=1;h.game.hurtPlayer(99,b);h.advance(2);});
  check(phone.name+': simultaneous boss and last-life deaths remain a loss',await page.evaluate(()=>window.__boss.mode==='lost'));
  await tap('#action');await page.evaluate(()=>{const h=window.__boss;h.game.lives=1;h.game.hurtPlayer(99);h.advance(1.6);});check(phone.name+': real last-life loss offers replay',await page.evaluate(()=>window.__boss.mode==='lost'));
  await tap('#action');check(phone.name+': loss replay restores full health and empty weapons',await page.evaluate(()=>window.__boss.game.health===5&&window.__boss.game.lives===3&&window.__boss.game.weapons.kind===null&&!window.__boss.game.boss));
  const original=await page.evaluate(async()=>{
   const {Game}=await import('/js/game.js?v=0.29.0');const {useDetail}=await import('/js/detail.js?v=0.29.0');const live=window.__boss.game;
   const make=proto=>{const g=Object.assign(Object.create(proto),live);g.player={...live.player,x:36,y:64,entering:0,invuln:0,cooldown:0,moveX:1};g.enemies=[];g.enemyShots=[];g.bullets=[];g.time=5;g.bg={draw(c){c.fillStyle='#0b0f1c';c.fillRect(0,0,208,144);}};g.terrain=Object.assign(Object.create(Object.getPrototypeOf(live.terrain)),live.terrain,{draw(){}});g.drawHud=()=>{};return g;};
   const demo=make(Object.getPrototypeOf(live)),ref=make(Game.prototype);ref.draw=Game.prototype.draw;ref.drawPlayer=Game.prototype.drawPlayer;
   for(let i=0;i<72;i++){demo.updatePlayer(1/120,{dx:0,dy:0,fire:true});Game.prototype.updatePlayer.call(ref,1/120,{dx:0,dy:0,fire:true});}
   const firing=JSON.stringify(demo.bullets)===JSON.stringify(ref.bullets)&&demo.bullets.length>2;demo.bullets=ref.bullets=[{x:76,y:69,vy:0},{x:112,y:69,vy:0}];
   const pixels=g=>{const c=document.createElement('canvas');c.width=416;c.height=288;const ctx=useDetail(c.getContext('2d'));ctx.scale(2,2);g.draw(ctx,x=>Math.round(x*2)/2);return ctx.getImageData(0,0,416,288).data;};const a=pixels(demo),b=pixels(ref);return {firing,same:a.every((v,i)=>v===b[i])};
  });check(phone.name+': exact hero, flame, bullets and firing',original.firing&&original.same);
  const saved=await page.evaluate(()=>({raw:localStorage.getItem('emberDrift.save.v1'),writes:window.__writes}));check(phone.name+': saves untouched and no recorded music requested',saved.raw===fixture&&saved.writes.length===0&&music.length===0);check(phone.name+': no browser errors',errors.length===0,errors);
  await context.close();
 }
 console.log('\nAll '+checks+' boss preview checks passed');
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
