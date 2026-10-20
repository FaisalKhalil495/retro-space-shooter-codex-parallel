// Scenery isolation, animation lifecycle, draw order and two-phone review.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {serve} from './serve.mjs';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');
const out=process.argv[2]||'/tmp/ember-battlefield';await mkdir(out,{recursive:true});
const {server,base}=await serve();let browser,checks=0;
function check(name,ok,detail){assert.ok(ok,name+' '+JSON.stringify(detail??''));checks++;console.log('PASS '+name);}
try{
 for(const [name,sha] of [['icy-battlefield.jpg','cbb6d87aa95f04d556dc2591878b6ece9def01d44b85e275cf504265ecf17630'],['icy-snowfield.jpg','6fae3b133c7db43ff95946e940da341023d6c917090f10a851dc336d59c2862f'],['icy-wrecks-greenscreen-reference.jpg','ff8c05d5eb67254b0841959c5fcd26ff893f567722b49163a94566433ff665de']]){
  const bytes=await readFile(new URL('../demos/glacier-boss/assets/'+name,import.meta.url));
  check('supplied image bytes preserved: '+name,createHash('sha256').update(bytes).digest('hex')===sha);
 }
 browser=await chromium.launch({slowMo:0});
 for(const phone of [{name:'android',width:915,height:412,dpr:2.625,q:''},{name:'iphone',width:874,height:402,dpr:3,q:'?safe=62'}]){
  const context=await browser.newContext({viewport:{width:phone.width,height:phone.height},deviceScaleFactor:phone.dpr,isMobile:true,hasTouch:true});
  await context.addInitScript(()=>{window.__writes=[];const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){window.__writes.push(k);return original.call(this,k,v);};});
  const page=await context.newPage(),errors=[],external=[],music=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('request',r=>{if(!r.url().startsWith(base)&&/^https?:/.test(r.url()))external.push(r.url());if(/\/music\/.*\.mp3/.test(r.url()))music.push(r.url());});
  await page.goto(base+'demos/glacier-boss/'+phone.q);await page.waitForFunction(()=>window.__boss?.artworkReady);await page.evaluate(()=>window.__boss.frozen=true);
  check(phone.name+': supplied artwork loaded',await page.evaluate(()=>window.__boss.game.bg.loaded&&document.querySelector('.eyebrow').textContent.endsWith(' 6.4')));
  await page.locator('#action').tap();await page.evaluate(()=>window.__boss.advance(1));
  const result=await page.evaluate(async()=>{
   const {BattlefieldBackground}=await import('/demos/glacier-boss/battlefield.js?battle=4');
   const {BossGame}=await import('/demos/glacier-boss/scene.js?boss=6.4');
   const {useDetail}=await import('/js/detail.js?v=0.29.0');
   const g=window.__boss.game,bg=g.bg;
   const canvas=document.createElement('canvas');canvas.width=832;canvas.height=576;
   const c=useDetail(canvas.getContext('2d',{willReadFrequently:true}));c.scale(4,4);
   const pixels=()=>{c.clearRect(0,0,208,144);bg.draw(c,v=>Math.round(v*2)/2);return c.getImageData(0,0,832,576).data;};
   const eq=(a,b)=>a.every((v,i)=>v===b[i]);
   const before=pixels(),again=pixels();bg.update(1);const moving=pixels();
   const stationary=eq(before,again);
   let groundChanges=0;for(let i=520*832*4;i<before.length;i++)if(before[i]!==moving[i])groundChanges++;
   const groundScrolls=groundChanges>20;
   let hudClear=true;for(let y=0;y<44;y++)for(let x=0;x<832;x++)hudClear&&=moving[(y*832+x)*4+3]===0;
   const transform=c.getTransform().toString(),alpha=c.globalAlpha,width=c.lineWidth;
   bg.draw(c,v=>v);
   const stateRestored=c.getTransform().toString()===transform&&c.globalAlpha===alpha&&c.lineWidth===width;
   // No RNG, new canvases or canvas readbacks may occur in live scenery.
   const random=Math.random,create=document.createElement,read=CanvasRenderingContext2D.prototype.getImageData;
   let noLivePainting=true;
   try{
    Math.random=()=>{throw new Error('drawing consumed simulation randomness');};
    document.createElement=function(tag,...args){if(tag==='canvas')throw new Error('painting in live draw');return create.call(this,tag,...args);};
    CanvasRenderingContext2D.prototype.getImageData=()=>{throw new Error('live readback');};
    for(let i=0;i<120;i++){bg.update(1/120);bg.draw(c,v=>Math.round(v*2)/2);}
   }catch{noLivePainting=false;}finally{Math.random=random;document.createElement=create;CanvasRenderingContext2D.prototype.getImageData=read;}
   // The entire supplied backdrop, including its smoke, stays fixed. Only
   // the native foreground rock/ice shelf may scroll; no added plumes/flares.
   let staticBackdrop=true,noGreenScreen=true;
   for(const time of [0,2,7,14.1,18.1,90]){
    bg.t=time;const frame=pixels();
    for(let y=44;y<520;y++)for(let x=0;x<832;x++){
     const i=(y*832+x)*4;
     if(before[i]!==frame[i]||before[i+1]!==frame[i+1]||before[i+2]!==frame[i+2])staticBackdrop=false;
     if(frame[i+1]>190&&frame[i]<80&&frame[i+2]<80)noGreenScreen=false;
    }
   }
   // Independent source-to-render comparison: all 1280x720 source pixels are
   // represented by the same aspect-preserving 416x234 resampling, with no
   // redraw, crop, warping, tint or artificial smoke placed over the artwork.
   const reference=new Image();await new Promise((resolve,reject)=>{reference.onload=resolve;reference.onerror=reject;reference.src='/demos/glacier-boss/assets/icy-battlefield.jpg';});
   const expected=document.createElement('canvas');expected.width=416;expected.height=234;
   const ec=expected.getContext('2d');ec.imageSmoothingEnabled=true;ec.imageSmoothingQuality='high';ec.drawImage(reference,0,0,416,234);
   const artworkMatch=eq(ec.getImageData(0,0,416,234).data,bg.world.hi.getContext('2d').getImageData(0,0,416,234).data);
   const other=new BattlefieldBackground();await Promise.resolve();
   const sharedArtwork=other.loaded&&other.world===bg.world&&other.snow===bg.snow;
   // Opaque hero / gun / engine pixels always win over the background.
   const originalHud=g.drawHud;
   g.runner={update(){}};g.enemies=[];g.boss=null;g.enemyShots=[];g.shake=0;g.flash=0;g.darken=0;g.banner=null;g.title=null;g.speech.reset();g.drawHud=()=>{};
   Object.assign(g.player,{x:37,y:34,entering:0,invuln:0,moveX:1});
   const draw=()=>{c.clearRect(0,0,208,144);g.draw(c,v=>Math.round(v*2)/2);return c.getImageData(0,0,832,576).data;};
   const full=draw(),scenery=g.bg;g.bg={draw(){}};const front=draw();g.bg=scenery;
   let opaque=0,over=0;for(let i=0;i<front.length;i+=4)if(front[i+3]===255){opaque++;if(front[i]!==full[i]||front[i+1]!==full[i+1]||front[i+2]!==full[i+2])over++;}
   g.drawHud=originalHud;
   // Same deterministic fight with active scenery vs inert scenery. The active
   // game is rendered repeatedly, exposing any draw-dependent RNG/attack bug.
   const make=()=>{
    let seed=782;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    Math.random=rand;const game=new BossGame();Math.random=random;game.rand=rand;return game;
   };
   const a=make(),b=make();await Promise.resolve();
   b.bg={t:0,update(dt){this.t+=dt;},draw(){}};
   const snapshot=g=>JSON.stringify({time:g.time,state:g.state,score:g.score,health:g.health,lives:g.lives,player:g.player,
    enemies:g.enemies.map(({T,...e})=>e),enemyShots:g.enemyShots,bullets:g.bullets,pickups:g.pickups,audit:g.audit,
    weapon:g.weapons.kind,ammo:g.weapons.ammo,clearPending:g.clearPending},(k,v)=>k==='T'?undefined:v);
   let isolated=true,phases=new Set();
   for(let i=0;i<120*140;i++){
    for(const game of [a,b]){
     game.player.invuln=100;const boss=game.boss;if(boss){game.player.x=26;game.player.y=boss.y+9;}
     game.update(1/120,{dx:0,dy:0,fire:true,special:!!boss?.open});
    }
    if(i%30===0)a.draw(c,v=>Math.round(v*2)/2);
    if(a.boss)phases.add(a.boss.phase);
    if(i%120===0||a.state==='clear')isolated&&=snapshot(a)===snapshot(b);
    if(a.state==='clear')break;
   }
   const sameFight={isolated,won:a.state==='clear'&&b.state==='clear',phases:[...phases]};
   // Compare cached scenery in one browser with the previous coast painter.
   globalThis.__coastEmbeddedArt=new URL('../glacier-coast/assets/glacier-world.png',document.baseURI).href;
   const {CoastBackground,coastReady}=await import('/demos/glacier-coast/coast.js?demo=2');
   const old=new CoastBackground();await coastReady;await Promise.resolve();
   const sample=back=>{const start=performance.now();for(let i=0;i<120;i++){back.t=i*.05;back.draw(c,v=>Math.round(v*2)/2);}c.getImageData(0,0,1,1);return performance.now()-start;};
   sample(old);sample(bg);const oldMs=[],newMs=[];
   for(let i=0;i<5;i++){oldMs.push(sample(old));newMs.push(sample(bg));}
   const median=v=>v.sort((a,b)=>a-b)[2];
   return {stationary,groundScrolls,hudClear,stateRestored,noLivePainting,staticBackdrop,artworkMatch,noGreenScreen,sharedArtwork,
    heroOnTop:opaque>50&&over===0,opaquePixels:opaque,sameFight,
    timings:{frames:120,previousMedianMs:median(oldMs),invasionMedianMs:median(newMs),note:'same-browser drawing samples; not physical phone FPS'}};
  });
  for(const name of ['stationary','groundScrolls','hudClear','stateRestored','noLivePainting','staticBackdrop','artworkMatch','noGreenScreen','sharedArtwork','heroOnTop'])check(phone.name+': '+name,result[name],result);
  check(phone.name+': full three-phase fight identical with scenery active',result.sameFight.isolated&&result.sameFight.won&&result.sameFight.phases.join(',')==='1,2,3',result.sameFight);
  // Reset the UI's own game after the isolation fixtures before testing pause.
  await page.evaluate(()=>{const h=window.__boss;h.game.reset();h.advance(2);});
  await page.locator('#pause').tap();const paused=await page.evaluate(()=>window.__boss.game.bg.t);
  await page.evaluate(()=>window.__boss.advance(2));await page.waitForTimeout(100);
  check(phone.name+': pause freezes background and battle clock',await page.evaluate(t=>window.__boss.game.time===t&&window.__boss.game.bg.t===t&&window.__boss.mode==='paused',paused));
  await page.locator('#action').tap();await page.evaluate(()=>window.__boss.advance(.5));
  check(phone.name+': resume continues from frozen time',await page.evaluate(t=>Math.abs(window.__boss.game.bg.t-t-.5)<1e-6,paused));
  await page.locator('#pause').tap();await page.evaluate(()=>window.__cachedWorld=window.__boss.game.bg.world);
  await page.locator('#restart').tap();
  check(phone.name+': restart resets animation without repainting world',await page.evaluate(()=>window.__boss.game.bg.t===0&&window.__boss.game.bg.world===window.__cachedWorld));
  await page.evaluate(()=>{const h=window.__boss;h.advance(11);h.game.speech.reset();h.game.player.invuln=0;});
  await page.screenshot({path:join(out,phone.name+'-invasion.png')});
  check(phone.name+': no browser errors, external calls, music loads or save writes',errors.length===0&&external.length===0&&music.length===0&&await page.evaluate(()=>window.__writes.length===0),{errors,external,music});
  await writeFile(join(out,phone.name+'-metrics.json'),JSON.stringify(result,null,2)+'\n');
  await context.close();
 }
 console.log('PASS '+checks+' battlefield checks');
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
