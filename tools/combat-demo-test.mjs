import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { serve } from './serve.mjs';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');
const out=process.argv[2]||'/tmp/ember-combat-checks';await mkdir(out,{recursive:true});
const {server,base}=await serve();let browser,checks=0;
const check=(name,ok)=>{assert.ok(ok,name);checks++;console.log('PASS '+name);};
const fixture=JSON.stringify({reached:3,lastName:'TEST',scores:[{name:'TEST',score:7654,level:3}],settings:{music:2,sound:3,vibrate:false,blood:false}});
try{
  browser=await chromium.launch({slowMo:0});
  for(const phone of [{name:'android',width:915,height:412,dpr:2.625,query:''},{name:'iphone',width:874,height:402,dpr:3,query:'?safe=62'}]){
    const context=await browser.newContext({viewport:{width:phone.width,height:phone.height},deviceScaleFactor:phone.dpr,isMobile:true,hasTouch:true});
    await context.addInitScript(fixture=>{
      localStorage.setItem('emberDrift.save.v1',fixture);const set=Storage.prototype.setItem;
      window.__writes=[];Storage.prototype.setItem=function(k,v){window.__writes.push(k);return set.call(this,k,v);};
    },fixture);
    const page=await context.newPage(),errors=[],music=[];
    page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
    page.on('request',r=>{if(/\/music\/.*\.mp3/.test(r.url()))music.push(r.url());});
    await page.goto(base+'demos/glacier-combat/'+phone.query);
    await page.waitForFunction(()=>window.__combat?.artworkReady);
    await page.evaluate(()=>window.__combat.frozen=true);
    const tap=async selector=>{const box=await page.locator(selector).boundingBox();assert.ok(box,selector+' visible');await page.touchscreen.tap(box.x+box.width/2,box.y+box.height/2);};
    check(phone.name+': both flight choices ready',await page.evaluate(()=>window.__combat.mode==='select'&&!document.getElementById('flight1').disabled&&!document.getElementById('flight2').disabled));
    await tap('#flight1');await page.waitForFunction(()=>window.__combat.mode==='playing');
    await page.evaluate(()=>window.__combat.advance(.8));
    const layout=await page.evaluate(()=>window.__combat.layout),fire=await page.evaluate(()=>window.__combat.controls.buttons.fire);
    check(phone.name+': original safe areas',layout.game.x>=(phone.query?62:0)&&layout.rightZone.x+layout.rightZone.w<=phone.width-(phone.query?62:0));
    const cdp=await context.newCDPSession(page),pad=[layout.leftZone.x+layout.leftZone.w/2,layout.leftZone.y+layout.leftZone.h*.6];
    const touch=(type,points)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:points.map(([x,y,id])=>({x,y,id}))});
    const before=await page.evaluate(()=>({...window.__combat.game.player}));
    await touch('touchStart',[[...pad,1],[fire.x,fire.y,2]]);await touch('touchMove',[[pad[0]+32,pad[1]-32,1],[fire.x,fire.y,2]]);
    const after=await page.evaluate(()=>{const h=window.__combat;h.advance(.3);return {p:h.game.player,bullets:h.game.bullets.length,dir:h.controls.pad.dir};});
    check(phone.name+': actual simultaneous thumbs steer and fire',after.p.x>before.x+5&&after.p.y<before.y-5&&after.bullets>0&&after.dir===7);
    await touch('touchEnd',[]);check(phone.name+': releasing clears both thumbs',await page.evaluate(()=>!window.__combat.controls.pad.active&&!window.__combat.controls.buttons.fire.held));
    await tap('#pause');const paused=await page.evaluate(()=>window.__combat.game.time);
    await page.evaluate(()=>window.__combat.advance(2));
    check(phone.name+': pause freezes combat and scenery',await page.evaluate(t=>window.__combat.mode==='paused'&&window.__combat.game.time===t&&window.__combat.game.bg.t===t,paused));
    await tap('#action');await page.setViewportSize({width:412,height:915});
    await page.waitForFunction(()=>!document.getElementById('rotate').hidden);
    check(phone.name+': portrait interrupts combat',await page.evaluate(()=>window.__combat.mode==='paused'&&!window.__combat.controls.enabled));
    await page.setViewportSize({width:phone.width,height:phone.height});await page.waitForFunction(()=>document.getElementById('rotate').hidden);
    await tap('#action');await page.evaluate(()=>window.dispatchEvent(new Event('blur')));
    check(phone.name+': app interruption pauses',await page.evaluate(()=>window.__combat.mode==='paused'));
    await tap('#choose');
    for(const flight of [1,2]){
      await tap('#flight'+flight);await page.waitForFunction(()=>window.__combat.mode==='playing');
      const sim=await page.evaluate(flight=>{
        const h=window.__combat,g=h.game;let groundErrors=0,overlaps=0;
        const snapshots={};
        for(let i=0;i<3600;i++){
          g.player.invuln=100;h.advance(1/120,{dx:0,dy:0,fire:false});
          for(const e of g.enemies){
            if(['shelfSkiff','anchorGun','snowRoller','rollingCharge'].includes(e.type)&&Math.abs(e.y+e.h-g.terrain.floorY)>.01)groundErrors++;
            if(e.type==='twinDart')for(const o of g.enemies)if(o.id>e.id&&o.type===e.type&&e.x<o.x+o.w&&e.x+e.w>o.x&&e.y<o.y+o.h&&e.y+e.h>o.y)overlaps++;
            if(!snapshots[e.type]&&e.x+e.w<205)snapshots[e.type]={w:e.w,h:e.h};
          }
        }
        const warns=new Map();let warningErrors=0;
        for(const e of g.audit){
          if(e.kind==='warn')warns.set(e.id,e);
          if(e.kind==='fire'||e.kind==='dash'){
            const w=warns.get(e.id);if(!w||e.time-w.time<w.duration-.02)warningErrors++;
            if(e.x!==undefined&&e.x>208)warningErrors++;
          }
          if(e.kind==='burst'&&e.type==='rollingCharge'){
            const w=warns.get(e.id);if(!w||e.time-w.time<.63)warningErrors++;
          }
        }
        return {mode:h.mode,time:g.time,bg:g.bg.t,groundErrors,overlaps,warningErrors,snapshots,audit:g.audit,boss:g.boss};
      },flight);
      check(phone.name+': flight '+flight+' lasts exactly 30 seconds',sim.mode==='done'&&sim.time===30&&sim.bg===30);
      check(phone.name+': flight '+flight+' keeps machines grounded',sim.groundErrors===0);
      check(phone.name+': flight '+flight+' preserves separate dart lanes',sim.overlaps===0);
      check(phone.name+': flight '+flight+' warns before every shot, charge and dash',sim.warningErrors===0);
      const wanted=flight===1?['shelfSkiff','anchorGun','twinDart']:['crestBomber','snowRoller','needleWing','wakeHunter'];
      check(phone.name+': flight '+flight+' demonstrates every intended attack',wanted.every(t=>sim.audit.some(e=>e.type===t&&['fire','dash'].includes(e.kind)))&&!sim.boss);
      await page.evaluate(()=>window.__combat.advance(5));
      check(phone.name+': flight '+flight+' stays frozen when complete',await page.evaluate(()=>window.__combat.game.time===30));
      await tap('#action');check(phone.name+': flight '+flight+' replay resets hazards, health and score',await page.evaluate(()=>{const g=window.__combat.game;return g.time===0&&g.bg.t===0&&g.audit.length===0&&g.enemies.length===0&&g.enemyShots.length===0&&g.score===0&&g.health===5&&g.lives===3;}));
      await page.evaluate(()=>{const h=window.__combat;h.game.player.invuln=100;h.advance(h.game.flight===1?19.2:15.5);});
      await page.waitForTimeout(100);await page.screenshot({path:join(out,phone.name+'-flight'+flight+'.png')});
      await tap('#pause');await tap('#choose');
    }
    // Independent reference rendering: same fixed state, plain background,
    // original prototype methods pinned so demo overrides cannot become expected.
    const original=await page.evaluate(async()=>{
      const {Game}=await import('/js/game.js?v=0.29.0');const {useDetail}=await import('/js/detail.js?v=0.29.0');
      const live=window.__combat.game;
      const make=proto=>{
        const g=Object.assign(Object.create(proto),live);
        g.player={...live.player,x:36,y:64,entering:0,invuln:0,cooldown:0,moveX:1};g.enemies=[];g.enemyShots=[];g.bullets=[];g.time=5;
        g.bg={draw(c){c.fillStyle='#0b0f1c';c.fillRect(0,0,208,144);}};g.terrain=Object.assign(Object.create(Object.getPrototypeOf(live.terrain)),live.terrain,{draw(){}});g.drawHud=()=>{};return g;
      };
      const demo=make(Object.getPrototypeOf(live)),ref=make(Game.prototype);ref.draw=Game.prototype.draw;ref.drawPlayer=Game.prototype.drawPlayer;
      for(let i=0;i<72;i++){demo.updatePlayer(1/120,{dx:0,dy:0,fire:true});Game.prototype.updatePlayer.call(ref,1/120,{dx:0,dy:0,fire:true});}
      const firing=JSON.stringify(demo.bullets)===JSON.stringify(ref.bullets)&&demo.bullets.length>2;
      demo.bullets=ref.bullets=[{x:76,y:69,vy:0},{x:112,y:69,vy:0}];
      const pixels=g=>{const c=document.createElement('canvas');c.width=416;c.height=288;const ctx=useDetail(c.getContext('2d'));ctx.scale(2,2);g.draw(ctx,x=>Math.round(x*2)/2);return ctx.getImageData(0,0,416,288).data;};
      const a=pixels(demo),b=pixels(ref);return {firing,same:a.every((v,i)=>v===b[i])};
    });
    check(phone.name+': hero, flame and bullets match original pixels',original.same);
    check(phone.name+': original firing rate and emission',original.firing);
    // Direct behavior checks isolate dodging, armor, damage and hazards from
    // the flight schedule; production update/collision methods still execute.
    const behavior=await page.evaluate(async()=>{
      const {CombatGame}=await import('/demos/glacier-combat/scene.js?combat=1');
      const {ART}=await import('/demos/glacier-combat/art.js?combat=1');
      const {ENEMY_TYPES}=await import('/js/enemies.js?v=0.29.0');const {LEVELS}=await import('/js/levels.js?v=0.29.0');
      const make=()=>{const g=new CombatGame();g.runner={update(){}};Object.assign(g.player,{x:35,y:80,entering:0,invuln:100});return g;};
      const tick=(g,t)=>{for(let i=0;i<Math.round(t*120);i++)g.update(1/120,{dx:0,dy:0,fire:false});};
      const g=make();const anchor=g.spawnEnemy('anchorGun',150,0);g.damage(anchor,1);const closed=anchor.hp===4;
      tick(g,1.5);const wasOpen=anchor.T.isVulnerable(anchor);g.damage(anchor,1);const open=anchor.hp===3;
      anchor.mode='closed';g.weapons.collect('bomb');g.weapons.fire();tick(g,.6);const bombBlocked=anchor.hp===3;
      anchor.mode='vent';anchor.timer=5;g.player.y=anchor.y+8-g.player.h/2;
      g.weapons.collect('laser');g.weapons.fire();tick(g,.4);const laserKilled=anchor.dead;
      const ordinaryKills=['shelfSkiff','anchorGun','snowRoller'].every(type=>{
        const target=make(),e=target.spawnEnemy(type,130,0);
        e.mode=type==='anchorGun'?'vent':'leave';e.timer=5;
        target.player.y=e.T.muzzle(e).y-target.player.h/2;
        for(let i=0;i<168;i++)target.update(1/120,{dx:0,dy:0,fire:true});
        return e.dead;
      });
      const h=make(),needle=h.spawnEnemy('needleWing',145,55);tick(h,.6);const locked=needle.angle;
      h.player.y=15;tick(h,.7);const nshot=h.audit.find(e=>e.type==='needleWing'&&e.kind==='fire');
      const needleLocked=!!nshot&&Math.abs(nshot.angle-locked)<1e-6;
      const w=make(),hunter=w.spawnEnemy('wakeHunter',145,45);tick(w,.1);const angle=hunter.angle;w.player.y=100;tick(w,.9);
      const dash=w.audit.find(e=>e.kind==='dash');const hunterLocked=!!dash&&Math.abs(dash.angle-angle)<1e-6;
      const c=make(),charge=c.spawnEnemy('rollingCharge',110,122,{life:1.5});c.strike(charge,110,122,8,8,1);tick(c,2);
      const shotCharge=charge.dead&&!c.audit.some(e=>e.kind==='burst');
      const b=make();b.spawnEnemy('coastBomb',140,40,{tx:45,ty:80});b.spawnEnemy('rollingCharge',120,122);tick(b,2);
      const hazardsEnd=b.enemies.every(e=>!['coastBomb','rollingCharge'].includes(e.type));
      const visibleBurst=b.enemyShots.some(s=>s.y<115&&s.y>10);
      const r=make();r.spawnEnemy('rollingCharge',70,122);r.spawnEnemy('coastBomb',100,40,{tx:50,ty:80});
      const rocketIgnores=r.nearestEnemy(10,80)===null;
      const d=make();d.player.invuln=0;d.enemyShots.push({x:44,y:85,vx:0,vy:0,t:0});d.collide();const damage=d.health===4;
      d.hurtPlayer(99);tick(d,1.5);const respawn=d.state==='playing'&&d.lives===2&&d.health===5;
      const shared=LEVELS.length===3&&!Object.hasOwn(ENEMY_TYPES,'shelfSkiff');
      const sharp=Object.values(ART).every(a=>Object.values(a).every(p=>p.hi.width===p.width*2&&p.hi.height===p.height*2&&p.mask.some(Boolean)));
      return {closed,wasOpen,open,bombBlocked,laserKilled,ordinaryKills,needleLocked,hunterLocked,shotCharge,hazardsEnd,visibleBurst,rocketIgnores,damage,respawn,shared,sharp};
    });
    for(const [name,ok] of Object.entries(behavior))check(phone.name+': '+name,ok);
    // Exhaust lives through the real game state, then exercise actual UI replay.
    await tap('#flight2');
    await page.evaluate(()=>{const h=window.__combat;h.game.lives=1;h.game.hurtPlayer(99);h.advance(1.5);});
    check(phone.name+': losing all lives offers replay',await page.evaluate(()=>window.__combat.mode==='lost'&&!document.getElementById('action').hidden));
    await tap('#action');check(phone.name+': game-over replay restores the chosen flight',await page.evaluate(()=>window.__combat.mode==='playing'&&window.__combat.game.flight===2&&window.__combat.game.health===5&&window.__combat.game.lives===3));
    await page.evaluate(()=>{const h=window.__combat;h.game.player.invuln=100;h.advance(29.9);h.game.lives=1;h.game.hurtPlayer(99);h.advance(.2);});
    check(phone.name+': final-life death at the deadline offers replay',await page.evaluate(()=>window.__combat.mode==='lost'&&window.__combat.game.time===30));
    await tap('#action');
    await tap('#pause');await tap('#choose');
    const preserved=await page.evaluate(()=>({raw:localStorage.getItem('emberDrift.save.v1'),writes:window.__writes}));
    check(phone.name+': zero save writes and no music requests',preserved.raw===fixture&&preserved.writes.length===0&&music.length===0);
    check(phone.name+': no browser or script errors',errors.length===0);
    await context.close();
  }
  const context=await browser.newContext({viewport:{width:915,height:412}}),page=await context.newPage();
  await page.goto(base+'demos/glacier-combat/');await page.waitForFunction(()=>window.__combat?.artworkReady);
  await page.locator('#flight1').click();await page.evaluate(()=>window.__combat.game.player.invuln=100);
  const start=Date.now();await page.waitForFunction(()=>window.__combat.mode==='done',null,{timeout:38000});
  const elapsed=(Date.now()-start)/1000;check('real animation clock completes a 30-second flight',elapsed>=28&&elapsed<35);
  await context.close();console.log('\nAll '+checks+' combat preview checks passed');
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
