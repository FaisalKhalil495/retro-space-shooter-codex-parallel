// Approved revision-7 values and randomized, reachable, locked lance gaps.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {serve} from './serve.mjs';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');
const out=process.argv[2]||'/tmp/ember-difficulty';await mkdir(out,{recursive:true});
const {server,base}=await serve();let browser,count=0;
try{
 browser=await chromium.launch({slowMo:0});
 for(const phone of [{name:'android',width:915,height:412,q:''},{name:'iphone',width:874,height:402,q:'?safe=62'}]){
  const page=await browser.newPage({viewport:{width:phone.width,height:phone.height},hasTouch:true,isMobile:true}),errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  if(process.env.OLD_GAPS)await page.route('**/demos/glacier-boss/boss.js?boss=7',async route=>route.fulfill({body:await readFile(process.env.OLD_GAPS,'utf8'),contentType:'text/javascript'}));
  await page.goto(base+'demos/glacier-boss/'+phone.q);await page.waitForFunction(()=>window.__boss?.artworkReady);
  await page.evaluate(()=>window.__boss.frozen=true);
  const results=await page.evaluate(async()=>{
   const {BossGame}=await import('/demos/glacier-boss/scene.js?boss=7');
   const {beginAttack,BREAKWATER}=await import('/demos/glacier-boss/boss.js?boss=7');
   const {FORMATION}=await import('/demos/glacier-boss/escorts.js?boss=7');
   const {useDetail}=await import('/js/detail.js?v=0.29.0');
   const results=[],check=(name,ok,detail)=>results.push({name,ok:!!ok,detail});
   const make=(phase=3,bx=130,y=60,seed=28)=>{
    const g=new BossGame();g.runner={update(){}};let calls=0;
    g.rand=()=>{calls++;seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    Object.assign(g.player,{x:26,y,entering:0,invuln:0});
    const b=g.spawnEnemy('breakwater',214,0);Object.assign(b,{x:bx,phase,mode:'fight',idle:99});
    return {g,b,calls:()=>calls};
   };
   const c=document.createElement('canvas');c.width=832;c.height=576;
   const ctx=useDetail(c.getContext('2d',{willReadFrequently:true}));ctx.scale(4,4);ctx.imageSmoothingEnabled=false;
   const gaps=(seed,draw)=>{
    const {g,b,calls}=make(3,130,60,seed),values=[];
    for(let i=0;i<40;i++){
     b.attack=null;const before=calls();beginAttack(b,g,'flak');values.push(b.attack.gap);
     if(calls()!==before+1)throw new Error('A new gap must use exactly one gameplay dice call');
     if(draw){const random=g.rand;g.rand=()=>{throw new Error('Rendering consumed gameplay dice');};g.draw(ctx,v=>Math.round(v*2)/2);g.rand=random;}
    }
    return values;
   };
   const sequence=gaps(28,false),differences=sequence.slice(1).map((v,i)=>v-sequence[i]);
   check('seeded gaps vary in height, jump distance and direction',new Set(sequence).size>=15&&new Set(differences).size>=10&&differences.some(v=>v>0)&&differences.some(v=>v<0),sequence);
   check('gaps do not simply alternate high and low',differences.some((v,i)=>i>0&&v*differences[i-1]>0),sequence);
   check('same seed reproduces gaps regardless of rendering',JSON.stringify(sequence)===JSON.stringify(gaps(28,true)),sequence);
   const firsts=[];for(let i=1;i<=32;i++)firsts.push(gaps(i*104729,false)[0]);
   check('the first wall is random too, above and below a fixed player',new Set(firsts).size>=15&&firsts.some(v=>v<60)&&firsts.some(v=>v>70),firsts);
   // Exercise real first/repeat warnings and move with the normal controller.
   // No invulnerability, health edits, teleporting or projectile removal.
   for(const phase of [1,2,3])for(const bx of [76,110,144])for(const y of [11,60,119])for(const name of phase===3?['flak','rushFlak']:['flak']){
    let escaped=true,locked=true,warned=true,visible=true,counts=true,overhead=true;
    const failures=[];
    for(const seed of [1,28,782,4567,99991,314159]){
     const {g,b}=make(phase,bx,y,seed);g.player.x=seed%2?2:bx-21;
     for(const [lane,p] of FORMATION.slice(0,phase===1?0:phase===2?3:4).entries())g.spawnEnemy('twinDart',p.x,p.y,{lane,persistentEscort:true,byBoss:true});
     beginAttack(b,g,name);let lastWarning=null,wallGap=b.attack.gap;
     const launches=[],original=g.fireShot.bind(g);
     // The caller adds iceLance after fireShot returns; retain the reference
     // and its launch position, then identify the configured lances afterward.
     g.fireShot=(...args)=>{const s=original(...args);launches.push({s,y:s.y,gap:b.attack.gap,speed:Math.hypot(s.vx,s.vy)});return s;};
     for(let i=0;i<120*15&&b.attack;i++){
      const a=b.attack,events=g.audit.filter(e=>e.kind==='warn'&&e.attack===name),warning=events.at(-1);
      if(warning!==lastWarning){
       lastWarning=warning;wallGap=a.gap;
       ctx.clearRect(0,0,208,144);BREAKWATER.draw(b,ctx,v=>v,g);
       const pixels=ctx.getImageData(0,0,832,576).data;
       for(const edge of [a.gap-a.gapSize/2,a.gap+a.gapSize/2]){
        const light=(Math.floor(edge*4)*832+12)*4,dark=(Math.floor((edge-.5)*4)*832+12)*4;
        visible&&=pixels[light+3]===255&&pixels[dark+3]===255&&pixels[light]-pixels[dark]>120;
       }
      }
      locked&&=a.gap===wallGap;overhead&&=name!=='rushFlak'||a.gap+a.gapSize/2+3<b.y;
      const ty=a.gap-5.5,p=g.player;
      g.update(1/120,{dx:p.x>3?-1:0,dy:Math.abs(p.y-ty)>1?Math.sign(ty-p.y):0,fire:false});
     }
     const warns=g.audit.filter(e=>e.kind==='warn'&&e.attack===name),fires=g.audit.filter(e=>e.kind==='fire'&&e.attack===name);
     const fired=launches.filter(v=>v.s.iceLance);
     warned&&=fires.every((f,i)=>warns[i]?.duration===1.15&&f.time-warns[i].time>=1.15-.01);
     counts&&=fires.length===(name==='rushFlak'?1:phase)&&!b.attack&&fired.length>0;
     // The native 3x3 lance contact squares must stay outside the advertised gap.
     visible&&=fired.every(s=>Math.abs(s.y-s.gap)>[0,28,26,24][phase]/2&&Math.abs(s.speed-[0,132,148,164][phase])<.001);
     if(g.health!==5||g.lives!==3||b.attack){escaped=false;failures.push({seed,health:g.health,lives:g.lives,stage:b.attack?.stage});}
    }
    check('phase '+phase+' '+name+' x='+bx+' y='+y+': six seeded full no-hit routes, marked locked gaps and full warnings',escaped&&locked&&warned&&visible&&counts&&overhead,{escaped,locked,warned,visible,counts,overhead,failures});
   }
   for(const phase of [2,3]){
    const {g,b}=make(phase);g.player.invuln=100;
    for(const [lane,p] of FORMATION.slice(0,phase===2?3:4).entries())g.spawnEnemy('twinDart',p.x,p.y,{lane,persistentEscort:true,byBoss:true});
    const shots=[],fire=g.fireShot.bind(g);g.fireShot=(...args)=>{const s=fire(...args);shots.push(s);return s;};
    for(let i=0;i<120*20;i++)g.update(1/120,{dx:0,dy:0,fire:false});
    const events=g.audit.filter(e=>e.type==='twinDart'&&e.kind==='fire');
    check('phase '+phase+': every fighter fires at the approved higher speed',events.length>=6&&events.every(e=>e.speed===(phase===2?94:104))&&shots.every(s=>Math.abs(Math.hypot(s.vx,s.vy)-(phase===2?94:104))<.001),events);
   }
   return results;
  });
  for(const r of results){assert.ok(r.ok,phone.name+': '+r.name+' '+JSON.stringify(r.detail??''));count++;console.log('PASS '+phone.name+': '+r.name);}
  // Pause the actual UI in the middle of a randomly selected warning.
  await page.locator('#action').tap();await page.evaluate(async()=>{
   const h=window.__boss,g=h.game;h.advance(11);g.speech.reset();
   const {beginAttack,clearThreats}=await import('/demos/glacier-boss/boss.js?boss=7');clearThreats(g);
   Object.assign(g.boss,{mode:'fight',phase:3,x:130,attack:null,idle:99});beginAttack(g.boss,g,'flak');h.advance(.3);
  });
  await page.locator('#pause').tap();const paused=await page.evaluate(()=>JSON.stringify({t:window.__boss.game.time,a:window.__boss.game.boss.attack}));
  await page.evaluate(()=>window.__boss.advance(2));
  assert.equal(await page.evaluate(()=>JSON.stringify({t:window.__boss.game.time,a:window.__boss.game.boss.attack})),paused);count++;
  await page.locator('#action').tap();await page.screenshot({path:join(out,phone.name+'-random-gap.png')});
  await writeFile(join(out,phone.name+'-checks.json'),JSON.stringify(results,null,2)+'\n');
  assert.deepEqual(errors,[]);count++;await page.close();
 }
 console.log('All '+count+' difficulty checks passed (216 seeded complete gap routes per phone)');
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
