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
  await tap('#restart');check(phone.name+': restart clears the whole encounter',await page.evaluate(()=>{const g=window.__boss.game;return g.time===0&&g.bg.t===0&&!g.boss&&g.enemies.length===0&&g.enemyShots.length===0&&g.pickups.length===0&&g.health===5&&g.lives===3&&g.weapons.kind===null&&g.audit.length===0&&g.wreck===null;}));
  const result=await page.evaluate(async()=>{
   const {BossGame}=await import('/demos/glacier-boss/scene.js?boss=4');
   const {BREAKWATER,beginAttack,clearThreats,MOVES,chooseAttack,REST}=await import('/demos/glacier-boss/boss.js?boss=4');
   const {HULLS}=await import('/demos/glacier-boss/art.js?boss=4');
   const {HUNTER_TORPEDO,TORPEDO_ART}=await import('/demos/glacier-boss/torpedo.js?boss=4');
   const {useDetail}=await import('/js/detail.js?v=0.29.0');
   const {BREAKUP_SECONDS}=await import('/demos/glacier-boss/wreck.js?boss=4');
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
   expose(phase.b);phase.g.damage(phase.b,85);const p2=phase.b.phase===2&&phase.b.mode==='transition'&&!phase.b.open&&phase.g.isSpeaking(phase.b)&&phase.g.enemyShots.length===0;
   tick(phase.g,2.4);expose(phase.b);phase.g.damage(phase.b,84);const p3=phase.b.phase===3&&phase.b.mode==='transition'&&bonuses.join(',')==='2,3'&&phase.g.score===3000&&phase.g.pickups.filter(p=>p.magnet).length>0;
   const talk=make();talk.g.say(talk.b,'HOLD YOUR FIRE', 'talk',2);talk.b.idle=0;const blockedStart=!beginAttack(talk.b,talk.g,'broadside');tick(talk.g,1.5);const noTalkShots=!talk.g.audit.some(a=>a.kind==='fire');
   const attacks=[];
   for(const name of ['broadside','skip','darts','ice','rush','flak','torpedoes','pursuit','rushFlak']){
    const {g,b}=make();b.phase=3;b.moveIndex=0;beginAttack(b,g,name);const angle=b.attack.angle,marks=JSON.stringify(b.attack.marks),path=JSON.stringify(b.attack.path);g.player.y=25;
    let maxDarts=0,maxTorps=0,maxShots=0,maxEscortShots=0,minY=130,maxX=0,minX=208,overlap=false;
    for(let i=0;i<12*120;i++){
     g.update(1/120,{dx:0,dy:0,fire:false});maxDarts=Math.max(maxDarts,g.enemies.filter(e=>e.type==='twinDart').length);maxTorps=Math.max(maxTorps,g.enemies.filter(e=>e.type==='hunterTorpedo').length);maxShots=Math.max(maxShots,g.enemyShots.filter(s=>!s.escort).length);maxEscortShots=Math.max(maxEscortShots,g.enemyShots.filter(s=>s.escort).length);
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
    attacks.push({name,warned:!!fire&&fire.time-warn.time>=warn.duration-.01&&allWarnings&&volleyCount===(name==='broadside'?5:name==='pursuit'?2:1),locked:!!fire&&Math.abs(fire.angle-angle)<1e-8,maxDarts,maxTorps,maxShots,maxEscortShots,ground:Math.abs(b.y+b.h-130)<.01,onscreen:minX>=29.9&&maxX<=208,overlap,clean:!b.attack&&!g.enemies.some(e=>['skipShell','hunterTorpedo'].includes(e.type))&&(name!=='darts'||g.enemies.filter(e=>e.persistentEscort&&!e.dead).length===2),marks,path});
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
   for(const name of ['rush','ice','skip','flak','rushFlak']){
    const {g,b}=make();g.health=10000;g.player.invuln=0;b.phase=3;if(name==='skip')g.player.y=97;beginAttack(b,g,name);
    const start=g.time;
    for(let i=0;i<12*120;i++){
      const elapsed=g.time-start;
      const goal=name==='ice'?(b.attack?.marks?.[0]+b.attack?.marks?.[1])/2-9:26;
      const dx=name==='ice'&&Number.isFinite(goal)&&Math.abs(g.player.x-goal)>1?Math.sign(goal-g.player.x):0;
      const goalY=['flak','rushFlak'].includes(name)?b.attack?.gap-5.5:null;
      const dy=Number.isFinite(goalY)?Math.abs(g.player.y-goalY)>1?Math.sign(goalY-g.player.y):0:name==='ice'?0:elapsed<1?-1:0;
      g.update(1/120,{dx,dy,fire:false});
      if(!b.attack)break;
    }
    dodges&&=g.health===10000;
   }
   // Repeated volleys must lock to each new position, then retain that
   // warning's angle while the player moves before the next shot.
   const tracking=make();tracking.b.phase=3;beginAttack(tracking.b,tracking.g,'broadside');
   let lastVolley=0;
   for(let i=0;i<10*120&&tracking.b.attack;i++){
     const a=tracking.b.attack;
     const count=a.volleys||0;
     if(count!==lastVolley){lastVolley=count;tracking.g.player.y=[25,65,115][count%3];}
     tracking.g.update(1/120,{dx:0,dy:0,fire:false});
   }
   const tw=tracking.g.audit.filter(a=>a.kind==='warn'),tf=tracking.g.audit.filter(a=>a.kind==='fire');
   const retargeted=tf.length===5&&new Set(tf.map(a=>a.angle.toFixed(3))).size>=3;
   const eachVolleyLocked=tf.every((f,i)=>Math.abs(f.angle-tw[i].angle)<1e-9&&f.time-tw[i].time>=tw[i].duration-.01);
   let volleyEscape=true;
   // Concrete no-hit flights using ordinary movement, including the closest
   // and furthest patrol positions. These cover complete five-volley attacks.
   for(const [name,bx,left,right,top,bottom]of [
    ['broadside',90,2,65,25,118],['broadside',110,26,85,12,108],
    ['broadside',130,26,85,12,108],['broadside',144,26,85,12,108]]){
    const {g,b}=make();b.x=bx;b.phase=3;g.player.invuln=0;beginAttack(b,g,name);
    const route=[[right,bottom],[right,top],[left,top],[left,bottom]];let k=0;
    for(let i=0;i<12*120&&b.attack;i++){
     const [x,y]=route[k%4],p=g.player;
     if(Math.abs(p.x-x)<2&&Math.abs(p.y-y)<2)k++;
     g.update(1/120,{dx:Math.abs(p.x-x)>1?Math.sign(x-p.x):0,dy:Math.abs(p.y-y)>1?Math.sign(y-p.y):0,fire:false});
    }
    volleyEscape&&=g.health===5;
   }
   const removedBeam=make();const noBossLaser=MOVES.slice(1).every(m=>!m.includes('beam'))&&!beginAttack(removedBeam.b,removedBeam.g,'beam');
   const capResults=[];
   for(const phase of [1,2,3]){
    const {g,b}=make();b.phase=phase;beginAttack(b,g,'torpedoes');tick(g,7);
    capResults.push(g.audit.filter(a=>a.kind==='torpedoLaunch').length===phase+1);
   }
   const salvoSizes=capResults.every(Boolean);
   const missile=make(),t=missile.g.spawnEnemy('hunterTorpedo',115,70,{angle:-2.8,phase:2,byBoss:true});
   missile.g.player.y=65;const initialAngle=t.angle;tick(missile.g,.5);
   const limitedHoming=t.mode==='hunt'&&Math.abs(t.angle-initialAngle)>0&&Math.abs(t.angle-initialAngle)<=2.9*(.5-.22)+.02;
   tick(missile.g,1.15);const locked=t.mode==='locked',lockedAngle=t.angle;
   missile.g.player.y=20;tick(missile.g,.15);const commitsStraight=locked&&t.angle===lockedAngle;
   const shoot=make(),st=shoot.g.spawnEnemy('hunterTorpedo',110,60,{angle:Math.PI,phase:1,byBoss:true});
   const earlyShot=st.T.shotTest(st,st.x+2,st.y+1,2,2)==='hit'&&!st.T.hitTest(st,st.x+2,st.y+1,2,2);
   shoot.g.strike(st,st.x+2,st.y+1,2,2,1);const twoHits=st.hp===1&&!st.dead;shoot.g.strike(st,st.x+2,st.y+1,2,2,1);tick(shoot.g,4);
   const shootable=twoHits&&st.dead&&!shoot.g.audit.some(a=>a.kind==='torpedoLock');
   const expiry=make(),et=expiry.g.spawnEnemy('hunterTorpedo',110,65,{angle:Math.PI,phase:1,byBoss:true});et.t=3.59;tick(expiry.g,.025);
   const missileExpires=et.dead;
   const priorities=make();priorities.b.phase=2;priorities.b.introIndex=2;priorities.g.player.y=20;
   const huntsHigh=chooseAttack(priorities.b,priorities.g)==='darts';priorities.g.player.y=115;
   const flushesLow=chooseAttack(priorities.b,priorities.g)==='ice';priorities.b.recent=['ice'];
   const noImmediateRepeat=chooseAttack(priorities.b,priorities.g)!=='ice';
   const selection=make();selection.b.phase=3;selection.b.idle=0;selection.g.health=10000;tick(selection.g,100);
   const choices=selection.g.audit.filter(a=>a.kind==='chosen').map(a=>a.attack);
   const combo=n=>['rushFlak','pursuit'].includes(n);
   const escalation=choices[0]==='rushFlak'&&choices[1]==='pursuit'&&choices.length>=10;
   const cooldowns=choices.every((n,i)=>i===0||n!==choices[i-1])&&choices.every((n,i)=>i<2||!combo(n)||!choices.slice(Math.max(0,i-3),i).some(combo));
   const combosRecur=choices.every((n,i)=>i<6||choices.slice(i-4,i+1).some(combo));
   let restEscalates=true;
   for(const phase of [1,2,3]){
    const {g,b}=make();b.phase=phase;beginAttack(b,g,'skip');
    for(let i=0;i<120*10&&b.attack;i++)g.update(1/120,{dx:0,dy:0,fire:false});
    const ended=g.time;for(let i=0;i<120&&!b.attack;i++)g.update(1/120,{dx:0,dy:0,fire:false});
    restEscalates&&=Math.abs(g.time-ended-[0,.45,.30,.18][phase])<.02;
   }
   const missileArt=TORPEDO_ART.width===7&&TORPEDO_ART.height===4&&TORPEDO_ART.hi.width===14&&TORPEDO_ART.hi.height===8;
   let newEscapes=true,iceAfterCommit=true;
   // Ordinary no-fire movement with both persistent fighters alive, including
   // two seconds of their follow-up shots after the complete boss pattern.
   const routes=[
    {"bx":76,"name":"torpedoes","right":90,"top":65,"bottom":95,"reverse":false,"offset":2},
    {"bx":76,"name":"pursuit","right":90,"top":12,"bottom":95,"reverse":false,"offset":1},
    {"bx":76,"name":"rushFlak","right":45,"top":12,"bottom":115,"reverse":false,"offset":3},
    {"bx":76,"name":"broadside","right":45,"top":45,"bottom":115,"reverse":false,"offset":0},
    {"bx":110,"name":"torpedoes","right":65,"top":12,"bottom":115,"reverse":false,"offset":0},
    {"bx":110,"name":"pursuit","right":45,"top":12,"bottom":95,"reverse":false,"offset":3},
    {"bx":110,"name":"rushFlak","right":45,"top":25,"bottom":115,"reverse":false,"offset":2},
    {"bx":110,"name":"broadside","right":45,"top":12,"bottom":95,"reverse":false,"offset":0},
    {"bx":144,"name":"torpedoes","right":45,"top":12,"bottom":95,"reverse":true,"offset":1},
    {"bx":144,"name":"pursuit","right":45,"top":12,"bottom":95,"reverse":false,"offset":3},
    {"bx":144,"name":"rushFlak","right":45,"top":12,"bottom":95,"reverse":false,"offset":2},
    {"bx":144,"name":"broadside","right":45,"top":12,"bottom":95,"reverse":true,"offset":0}
   ];
   for(const r of routes){
    const {g,b}=make();b.x=r.bx;b.phase=3;g.player.invuln=0;
    for(const lane of [0,1])g.spawnEnemy('twinDart',lane?176:148,lane?52:80,{lane,byBoss:true,persistentEscort:true});
    beginAttack(b,g,r.name);let k=r.offset,ended=null;
    const route=r.reverse?[[2,r.top],[r.right,r.top],[r.right,r.bottom],[2,r.bottom]]:[[r.right,r.bottom],[r.right,r.top],[2,r.top],[2,r.bottom]];
    for(let i=0;i<15*120;i++){
     const a=b.attack;
     if(a?.iceWarnAt!==undefined)iceAfterCommit&&=!g.enemies.some(t=>t.type==='hunterTorpedo'&&!t.dead&&t.mode==='hunt');
     const [x,y]=route[k%4],p=g.player;if(Math.abs(p.x-x)<2&&Math.abs(p.y-y)<2)k++;
     g.update(1/120,{dx:Math.abs(p.x-x)>1?Math.sign(x-p.x):0,dy:Math.abs(p.y-y)>1?Math.sign(y-p.y):0,fire:false});
     if(!b.attack){if(ended===null)ended=g.time;b.idle=99;}
     if(ended!==null&&g.time>ended+2)break;
    }
    newEscapes&&=g.health===5&&g.lives===3&&!b.attack&&g.enemies.filter(e=>e.persistentEscort&&!e.dead).length===2&&g.audit.some(a=>a.type==='twinDart'&&a.kind==='fire');
   }
   const realGun=make(),rg=realGun.g.spawnEnemy('hunterTorpedo',110,119,{angle:Math.PI,phase:1,byBoss:true});tick(realGun.g,1,{dx:0,dy:0,fire:true});
   const normalGunCountersMissile=rg.dead&&realGun.g.score>=15;
   const phaseCancel=make();beginAttack(phaseCancel.b,phaseCancel.g,'torpedoes');tick(phaseCancel.g,1.25);
   const pending=phaseCancel.g.enemies.filter(t=>t.type==='hunterTorpedo');phaseCancel.g.damage(phaseCancel.b,85);
   const pcTime=phaseCancel.g.time;
   const phaseClearsMissiles=phaseCancel.b.phase===2&&pending.length>0&&pending.every(t=>t.dead)&&!phaseCancel.b.attack;
   tick(phaseCancel.g,2);const noQueuedLaunchAfterPhase=!phaseCancel.g.audit.some(a=>a.kind==='torpedoLaunch'&&a.time>pcTime);
   const deathCancel=make();deathCancel.b.phase=3;beginAttack(deathCancel.b,deathCancel.g,'torpedoes');tick(deathCancel.g,.95);
   deathCancel.g.damage(deathCancel.b,deathCancel.b.hp);const dcTime=deathCancel.g.time;tick(deathCancel.g,1.6);
   const deathClearsSalvo=deathCancel.b.mode==='dying'&&!deathCancel.g.enemies.some(t=>t.type==='hunterTorpedo')&&!deathCancel.g.audit.some(a=>a.kind==='torpedoLaunch'&&a.time>dcTime);
   const lossCancel=make();beginAttack(lossCancel.b,lossCancel.g,'torpedoes');tick(lossCancel.g,1.25);
   const sourceMissile=lossCancel.g.enemies.find(t=>t.type==='hunterTorpedo');lossCancel.g.hurtPlayer(99,sourceMissile);
   const missileKillSafe=lossCancel.g.isSpeaking(lossCancel.b)&&!lossCancel.b.attack&&!lossCancel.g.enemies.some(t=>t.type==='hunterTorpedo')&&lossCancel.g.enemyShots.length===0;
   // Missile hit circle stays inside the displayed opaque body at every turn.
   const mc=document.createElement('canvas');mc.width=64;mc.height=64;const mx=useDetail(mc.getContext('2d'));mx.scale(4,4);mx.imageSmoothingEnabled=false;
   let missileContactVisible=true;
   for(let i=0;i<32;i++){
    mx.clearRect(0,0,16,16);HUNTER_TORPEDO.draw({x:4.5,y:6,t:1,angle:i*Math.PI/16,mode:'locked',flash:0},mx,v=>v);
    const pixels=mx.getImageData(0,0,64,64).data;
    for(let y=-1.4;y<=1.4;y+=.2)for(let x=-1.4;x<=1.4;x+=.2)if(x*x+y*y<1.96)missileContactVisible&&=pixels[(Math.floor((8+y)*4)*64+Math.floor((8+x)*4))*4+3]>0;
   }
   // Revision 4: timing, predictive guidance, roof origins and cached masks.
   const {LAUNCHER_HULLS,picture,launcherPort}=await import('/demos/glacier-boss/art.js?boss=4');
   let longerTracking=true,tighterTurns=true,predictsMovement=true,roofOrigins=true,roofRaises=true,raisedMasks=true,raisedBreakup=true,broadsidePreserved=true;
   for(const phase of [1,2,3]){
    const {g,b}=make();b.phase=phase;
    Object.assign(g.player,{x:26,y:50});
    const t=g.spawnEnemy('hunterTorpedo',200,55,{angle:Math.PI,phase,byBoss:true});
    const hunt=[0,1.2,1.4,1.6][phase];tick(g,hunt+.20);longerTracking&&=t.mode==='hunt'&&!t.dead;
    tick(g,.04);longerTracking&&=t.mode==='locked'&&!t.dead&&Math.abs(t.lockAt-hunt-.22)<.02;
    const turn=make(),u=turn.g.spawnEnemy('hunterTorpedo',100,80,{angle:-Math.PI/2,phase,byBoss:true});let maxTurn=0,turnBound=true;
    for(let i=0;i<95&&!u.dead;i++){const angle=u.angle;tick(turn.g,1/120);const delta=Math.abs(Math.atan2(Math.sin(u.angle-angle),Math.cos(u.angle-angle)));maxTurn=Math.max(maxTurn,delta*120);turnBound&&=delta<=[0,2.6,2.9,3.2][phase]/120+.00001;}
    tighterTurns&&=turnBound&&maxTurn>1.81;
    const lead=make(),v=lead.g.spawnEnemy('hunterTorpedo',170,60,{angle:Math.PI,phase,byBoss:true});lead.g.player.y=35;
    tick(lead.g,.5,{dx:1,dy:1,fire:false});const center=lead.g.playerCenter();
    predictsMovement&&=v.aimX>center.x+3&&v.aimY>center.y+3&&v.aimX-center.x<15&&v.aimY-center.y<15;
    const salvo=make();salvo.b.phase=phase;beginAttack(salvo.b,salvo.g,'torpedoes');tick(salvo.g,.25);
    roofRaises&&=salvo.b.launcherLift===1;tick(salvo.g,4);
    const launches=salvo.g.audit.filter(a=>a.kind==='torpedoLaunch');
    roofOrigins&&=launches.length===phase+1&&launches.every((a,i)=>{const m=launcherPort(salvo.b,i%2,2);return Math.abs(a.x-m.x)<.001&&Math.abs(a.y-m.y)<.001&&a.angle===-Math.PI/2;});
    // Independent golden values for the approved broadside's actual shots.
    const broad=make();broad.b.phase=phase;const shots=[],fire=broad.g.fireShot.bind(broad.g);
    broad.g.fireShot=(...args)=>{const s=fire(...args);shots.push(s);return s;};
    beginAttack(broad.b,broad.g,'broadside');for(let i=0;i<120*10&&broad.b.attack;i++)tick(broad.g,1/120);
    const warns=broad.g.audit.filter(a=>a.kind==='warn');
    broadsidePreserved&&=shots.length===25&&warns.length===5&&Math.abs(warns[0].duration-[0,.95,.85,.75][phase])<1e-8&&warns.slice(1).every(w=>w.duration===[0,1.1,1,.95][phase])&&shots.every((s,i)=>Math.abs(Math.hypot(s.vx,s.vy)-(89+phase*9))<1e-7&&(s.dmg||1)===(i%5===2?2:1));
   }
   for(let stage=0;stage<3;stage++)for(let phase=1;phase<=3;phase++)for(const open of [false,true]){
    const p=LAUNCHER_HULLS[stage][phase-1][open?'open':'closed'],e={x:0,y:0,phase,open,launcherLift:stage/2,mode:'fight'};
    raisedMasks&&=p.mask.every((v,i)=>Boolean(v)===Boolean(BREAKWATER.hitTest(e,(i%116)/2+.1,Math.floor(i/116)/2+.1,.2,.2)));
    const {g,b}=make();Object.assign(b,e,{x:130,mode:'fight'});g.startBossDeath(b);
    const c=document.createElement('canvas');c.width=116;c.height=48;const x=useDetail(c.getContext('2d'));x.scale(2,2);
    for(const q of b.wreck.pieces)x.drawImage(q.img,q.sx,q.sy,q.sw,q.sh,q.sx,q.sy,q.sw,q.sh);
    const restored=x.getImageData(0,0,116,48).data,source=p.hi.getContext('2d').getImageData(0,0,116,48).data;
    raisedBreakup&&=b.wreck.pieces.length===10&&restored.every((v,i)=>v===source[i]);
   }
   const formation=make(),fg=formation.g,fb=formation.b;fb.phase=2;
   const fighters=[0,1].map(lane=>fg.spawnEnemy('twinDart',lane?176:148,lane?52:80,{lane,byBoss:true,persistentEscort:true}));
   let separated=true,visible=true,shotCap=true;
   for(let i=0;i<60*120;i++){
    fb.idle=99;tick(fg,1/120);const [a,b]=fighters;
    separated&&=!(a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y);
    visible&&=fighters.every(d=>d.x>=2&&d.x+d.w<=206&&d.y>=11&&d.y+d.h<106);
    shotCap&&=fg.enemyShots.filter(s=>s.escort).length<=2;
   }
   const persistentFighters=fighters.every(d=>!d.dead&&fg.enemies.includes(d)&&d.w===11&&d.h===8&&d.hp===2&&d.shots>2)&&separated&&visible&&shotCap;
   const escortEvents=fg.audit.filter(a=>a.type==='twinDart'),shotEvents=escortEvents.filter(a=>a.kind==='fire');
   const warnedFighters=shotEvents.length>6&&shotEvents.every((f,i)=>{const w=escortEvents.filter(a=>a.kind==='warn'&&a.id===f.id&&a.time<f.time).at(-1);return w&&f.time-w.time>=.45-.01&&Math.abs(f.angle-w.angle)<1e-8&&(!i||f.time-shotEvents[i-1].time>=1.09);});
   const fullSlots=chooseAttack(fb,fg)!=='darts'&&!beginAttack(fb,fg,'darts');
   fb.idle=0;tick(fg,20);const bossContinues=fg.audit.filter(a=>a.kind==='chosen').length>=3&&fighters.every(d=>!d.dead);
   const transitions=make(),tg=transitions.g,tb=transitions.b;
   const kept=[0,1].map(lane=>tg.spawnEnemy('twinDart',lane?176:148,lane?52:80,{lane,byBoss:true,persistentEscort:true}));tg.damage(kept[0],1);
   expose(tb);tg.damage(tb,85);const phaseTwoKeeps=tb.phase===2&&kept.every(d=>!d.dead&&tg.enemies.includes(d)&&d.passive)&&kept[0].hp===1;
   const quietAt=tg.time;tick(tg,1.5);const phaseQuiet=!tg.audit.some(a=>a.type==='twinDart'&&a.kind==='fire'&&a.time>quietAt)&&kept.every(d=>!d.T.hitTest(d,d.x,d.y,11,8));
   tick(tg,1);expose(tb);tg.damage(tb,84);const phaseThreeKeeps=tb.phase===3&&kept.every(d=>!d.dead&&tg.enemies.includes(d))&&kept[0].hp===1;
   tick(tg,2.4);clearThreats(tg,true);tb.mode='fight';tb.attack=null;tb.idle=99;tg.speech.reset();tg.damage(kept[1],2);tick(tg,.02);
   const survivingId=kept[0].id;beginAttack(tb,tg,'darts');tick(tg,2.5);
   const replacements=tg.enemies.filter(e=>e.persistentEscort&&!e.dead);
   const missingOnly=replacements.length===2&&replacements.some(d=>d.id===survivingId&&d.hp===1)&&replacements.filter(d=>d.lane===0).length===1&&replacements.filter(d=>d.lane===1).length===1&&tg.score===3030;
   tg.killPlayer(replacements[1]);const lossAt=tg.time;tick(tg,1.5);
   const respawnKeeps=replacements.every(d=>!d.dead&&tg.enemies.includes(d))&&tg.state==='playing'&&tg.player.entering>0&&!tg.audit.some(a=>a.type==='twinDart'&&a.kind==='fire'&&a.time>lossAt);
   const hpBefore=replacements.map(d=>d.hp);tick(tg,.3);const enteringQuiet=replacements.every((d,i)=>d.hp===hpBefore[i]&&d.passive);
   tg.startBossDeath(tb);tick(tg,.1);const deathClearsFighters=!tg.enemies.some(d=>d.persistentEscort)&&replacements.every(d=>d.dead);
   const emergence=make();emergence.b.phase=2;beginAttack(emergence.b,emergence.g,'darts');tick(emergence.g,.9);
   const emerging=emergence.g.enemies.find(e=>e.persistentEscort),hiddenLaunch=!!emerging?.launch&&!emerging.T.shotTest(emerging,emerging.x,emerging.y,11,8)&&!emerging.T.hitTest(emerging,emerging.x,emerging.y,11,8);
   expose(emergence.b);emergence.g.damage(emergence.b,170);tick(emergence.g,1);
   const pendingFighterSafe=emergence.g.enemies.filter(e=>e.persistentEscort).length===1&&emerging&&!emerging.dead&&!!emerging.launch;
   // Actual destruction: all pixels partitioned, staged launch, angular and
   // ballistic motion, floor impacts, harmless finale, one score award.
   const death=make();expose(death.b);death.g.player.invuln=0;
   const original=HULLS[0].open;death.g.damage(death.b,death.b.hp);
   const d=death.b,w=d.wreck;
   const canvas=document.createElement('canvas');canvas.width=116;canvas.height=48;
   const ctx=useDetail(canvas.getContext('2d'));ctx.scale(2,2);
   for(const p of w.pieces)ctx.drawImage(p.img,p.sx,p.sy,p.sw,p.sh,p.sx,p.sy,p.sw,p.sh);
   const restored=ctx.getImageData(0,0,116,48).data;
   const source=original.hi.getContext('2d').getImageData(0,0,116,48).data;
   const exactBreakup=restored.every((v,i)=>v===source[i]);
   const deathSafe=death.g.enemyShots.length===0&&!d.T.hitTest(d,d.x,d.y,58,24)&&!d.attack;
   tick(death.g,.3);const heldInitially=w.released===0;
   tick(death.g,.7);const stagedBreakup=w.released>0&&w.released<10;
   tick(death.g,2);const allLaunched=w.released===10&&w.core&&w.pieces.every(p=>p.launched&&Math.abs(p.angle)>.1);
   const beforeFinish=!d.dead&&death.g.boss===d;
   tick(death.g,BREAKUP_SECONDS+.1-death.g.time);
   const oneAward=d.dead&&death.g.boss===null&&death.g.score===7000&&w.finished;
   const fallingParts=w.impacts>0&&w.pieces.every(p=>Number.isFinite(p.x+p.y+p.angle)&&p.y<=130);
   const harmlessWreck=death.g.health===5&&death.g.lives===3&&death.g.enemyShots.length===0;
   tick(death.g,2);const persistentWreck=death.g.wreck===d&&w.pieces.length===10&&death.g.score===7000;
   death.g.reset();const resetWreck=death.g.wreck===null&&!death.g.boss&&death.g.score===0;
   const noSafePockets=pockets.every(p=>p.hurt>0);
   const art=HULLS.every(a=>Object.values(a).every(p=>p.width===58&&p.height===24&&p.hi.width===116&&p.hi.height===48&&p.mask.some(Boolean)&&p.flash.hi.width===116));
   const masks=HULLS.every((a,index)=>Object.entries(a).every(([state,p])=>{const e={x:0,y:0,phase:index+1,open:state==='open',mode:'fight'};return p.mask.every((v,i)=>Boolean(v)===Boolean(BREAKWATER.hitTest(e,(i%116)/2+.1,Math.floor(i/116)/2+.1,.2,.2)));}));
   return {longerTracking,tighterTurns,predictsMovement,roofOrigins,roofRaises,raisedMasks,raisedBreakup,broadsidePreserved,persistentFighters,warnedFighters,fullSlots,bossContinues,phaseTwoKeeps,phaseQuiet,phaseThreeKeeps,missingOnly,respawnKeeps,enteringQuiet,deathClearsFighters,hiddenLaunch,pendingFighterSafe,closed,frontPath,hullBlocks,ordinaryHits,...weapon,p2,p3,blockedStart,noTalkShots,iceMarksSeparate,shellSafe,lateShellSafe,retargetAfterCleanup,bossDartOwnership,killedClear,respawn,knockback:pushes.every(Boolean),nativeDamage,retargeted,eachVolleyLocked,volleyEscape,noBossLaser,salvoSizes,limitedHoming,commitsStraight,earlyShot,shootable,missileExpires,huntsHigh,flushesLow,noImmediateRepeat,escalation,cooldowns,combosRecur,restEscalates,missileArt,newEscapes,iceAfterCommit,normalGunCountersMissile,phaseClearsMissiles,noQueuedLaunchAfterPhase,deathClearsSalvo,missileKillSafe,missileContactVisible,exactBreakup,deathSafe,heldInitially,stagedBreakup,allLaunched,beforeFinish,oneAward,fallingParts,harmlessWreck,persistentWreck,resetWreck,noSafePockets,dodges,art,masks,isolated:LEVELS.length===3&&!ENEMY_TYPES.breakwater,attacks};
  });
  for(const [key,value]of Object.entries(result))if(key!=='attacks')check(phone.name+': '+key,value,result);
  for(const a of result.attacks){check(phone.name+': '+a.name+' warned and locked',a.warned&&a.locked,a);check(phone.name+': '+a.name+' bounded, grounded and clears',a.maxDarts<=2&&a.maxTorps<=4&&a.maxShots<=20&&a.maxEscortShots<=2&&a.ground&&a.onscreen&&!a.overlap&&a.clean,a);}
  // Real encounter starts empty: no test laser or supply bypass. Ordinary
  // simulation runs to victory with original weapons, phase rewards and pods.
  const run=await page.evaluate(()=>{
   const h=window.__boss;h.game.reset();const g=h.game;g.rand=()=>.45;let maxDarts=0,maxTorps=0,maxShots=0,maxEscortShots=0,ground=true,pausedAttack=false,phases=[],first=null,lastB=null;
   for(let i=0;i<120*190&&h.mode==='playing';i++){
    const b=g.boss;if(b){lastB=b;if(!phases.includes(b.phase))phases.push(b.phase);if(b.mode==='fight'&&first===null)first=g.time;
      g.player.x=26;g.player.y=b.y+9;if(g.isSpeaking(b)&&b.attack)pausedAttack=true;ground&&=Math.abs(b.y+b.h-130)<.01;}
    g.player.invuln=100;h.advance(1/120,{dx:0,dy:0,fire:true,special:!!b?.T.isVulnerable(b)});
    maxDarts=Math.max(maxDarts,g.enemies.filter(e=>e.type==='twinDart').length);maxTorps=Math.max(maxTorps,g.enemies.filter(e=>e.type==='hunterTorpedo').length);maxShots=Math.max(maxShots,g.enemyShots.filter(s=>!s.escort).length);maxEscortShots=Math.max(maxEscortShots,g.enemyShots.filter(s=>s.escort).length);
   }
   return {mode:h.mode,time:g.time,fighting:g.time-first,phases,ground,pausedAttack,maxDarts,maxTorps,maxShots,maxEscortShots,audit:g.audit,score:g.score,boss:g.boss,weapon:g.weapons.kind,remaining:g.enemies.length};
  });
  check(phone.name+': complete victory through original weapons and rewards',run.mode==='won'&&run.phases.join(',')==='1,2,3'&&run.score>=10000&&!run.boss,run);
  check(phone.name+': about 90–120 seconds with phase rewards',run.time>=85&&run.time<=125,run.time);
  check(phone.name+': new torpedo and phase-three tactics occur in complete fight',['torpedoes','ice','darts','rushFlak'].every(n=>run.audit.some(a=>a.attack===n&&a.kind==='fire')),run.audit.filter(a=>a.kind==='fire').map(a=>[a.phase,a.attack]));
  check(phone.name+': full encounter keeps threats bounded and speech safe',run.maxDarts<=2&&run.maxTorps<=4&&run.maxShots<=20&&run.maxEscortShots<=2&&run.ground&&!run.pausedAttack,run);
  const supplies=run.audit.filter(a=>a.kind==='supply').map(a=>a.drop);check(phone.name+': actual survival and weapon supplies alternate',supplies.length>=3&&supplies.every((s,i)=>s===(i%2?'weapon':'smart')),supplies);
  const done=await page.evaluate(()=>window.__boss.game.time);await page.evaluate(()=>window.__boss.advance(4));check(phone.name+': victory freezes until replay',await page.evaluate(t=>window.__boss.game.time===t,done));
  await tap('#action');await page.evaluate(()=>{const h=window.__boss;h.game.player.invuln=100;h.advance(30);});
  check(phone.name+': fight continues beyond the old 30-second limit',await page.evaluate(()=>window.__boss.mode==='playing'&&window.__boss.game.time>29.9&&window.__boss.game.boss?.hp>0));
  await page.screenshot({path:join(out,phone.name+'-fight.png')});
  await page.evaluate(()=>{const g=window.__boss.game;g.spawnEnemy('skipShell',130,123,{sx:133,tx:40,amp:50});g.weapons.collect('laser');g.weapons.fire();g.boss.open=true;g.damage(g.boss,g.boss.hp);window.__boss.advance(1.2);});
  await tap('#pause');
  const deathFrozen=await page.evaluate(()=>JSON.stringify(window.__boss.game.wreck.wreck));await page.evaluate(()=>window.__boss.advance(3));
  check(phone.name+': pause freezes flying wreckage',await page.evaluate(before=>JSON.stringify(window.__boss.game.wreck.wreck)===before,deathFrozen));
  await tap('#restart');
  check(phone.name+': restart clears boss hazards, speech, weapons and rewards',await page.evaluate(()=>{const g=window.__boss.game;return !g.boss&&g.enemies.length===0&&g.enemyShots.length===0&&g.pickups.length===0&&g.timers.length===0&&!g.speech.bubble&&!g.weapons.laser&&g.weapons.kind===null&&g.supplyCount===0&&g.score===0&&g.wreck===null;}));
  await page.evaluate(()=>{const h=window.__boss;h.game.player.invuln=100;h.advance(11);const b=h.game.boss;b.open=true;h.game.damage(b,85);h.game.lives=1;h.game.hurtPlayer(99,b);h.advance(1.6);});
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
