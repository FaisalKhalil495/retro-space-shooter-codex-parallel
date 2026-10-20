// Revision 6 checks: actual guidance, rear arrivals, larger groups and cleanup.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {serve} from './serve.mjs';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');
const out=process.argv[2]||'/tmp/ember-reinforcement-checks';await mkdir(out,{recursive:true});
const {server,base}=await serve();const browser=await chromium.launch({slowMo:0});let count=0;
try{
 for(const phone of [{width:915,height:412,q:''},{width:874,height:402,q:'?safe=62'}]){
  const page=await browser.newPage({viewport:{width:phone.width,height:phone.height},isMobile:true,hasTouch:true}),errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  // Optional source replacement proves a golden check rejects old behavior.
  if(process.env.OLD_TORPEDO)await page.route('**/demos/glacier-boss/torpedo.js?boss=7',async route=>route.fulfill({body:await readFile(process.env.OLD_TORPEDO,'utf8'),contentType:'text/javascript'}));
  await page.goto(base+'demos/glacier-boss/'+phone.q);await page.waitForFunction(()=>window.__boss?.artworkReady);
  await page.evaluate(()=>window.__boss.frozen=true);
  const results=await page.evaluate(async()=>{
   const {BossGame}=await import('/demos/glacier-boss/scene.js?boss=7');
   const {beginAttack,chooseAttack,BREAKWATER}=await import('/demos/glacier-boss/boss.js?boss=7');
   const {useDetail}=await import('/js/detail.js?v=0.29.0');
   const positions=[{x:148,y:80},{x:176,y:52},{x:146,y:26},{x:176,y:94}],results=[];
   const check=(name,ok,detail)=>results.push({name,ok:!!ok,detail});
   const make=(phase=3,x=144)=>{
    const g=new BossGame();g.runner={update(){}};g.rand=()=>.45;
    Object.assign(g.player,{x:26,y:115,entering:0,invuln:100});
    const b=g.spawnEnemy('breakwater',214,0);Object.assign(b,{x,phase,mode:'fight',idle:99});return {g,b};
   };
   const tick=(g,s,input={dx:0,dy:0,fire:false})=>{for(let i=0;i<Math.round(s*120);i++)g.update(1/120,input);};
   const fighters=g=>g.enemies.filter(e=>e.persistentEscort&&!e.dead);
   for(const phase of [1,2,3]){
    const {g}=make(phase);Object.assign(g.player,{x:90,y:60});
    const t=g.spawnEnemy('hunterTorpedo',150,65,{angle:Math.PI,phase,byBoss:true});
    tick(g,.1);check('phase '+phase+': fast initial flight',Math.abs(Math.hypot(t.vx,t.vy)-[0,132,152,172][phase])<.001);
    const a=t.angle;tick(g,.05);check('phase '+phase+': guidance starts after short roof clearance',t.angle!==a&&t.T.hitTest(t,t.x+3,t.y+1,1,1)==='hit');
    tick(g,.25,{dx:1,dy:1,fire:false});const p=g.playerCenter(),lead=[0,.14,.17,.20][phase],v=80/Math.SQRT2;
    check('phase '+phase+': precise motion prediction',Math.abs(t.aimX-p.x-v*lead)<.01&&Math.abs(t.aimY-p.y-v*lead)<.01,{target:[t.aimX,t.aimY],player:p});
    t.mode='locked';t.angle=.4;tick(g,1/120);check('phase '+phase+': fast straight commitment',Math.abs(Math.hypot(t.vx,t.vy)-[0,148,166,184][phase])<.001&&t.angle===.4);
   }
   for(const [phase,bx] of [[2,90],[2,130],[2,144],[3,76],[3,110],[3,144]]){
    const {g,b}=make(phase,bx),limit=phase===2?3:4;beginAttack(b,g,'darts');
    const canvas=document.createElement('canvas');canvas.width=832;canvas.height=576;
    const c=useDetail(canvas.getContext('2d'));c.scale(4,4);BREAKWATER.draw(b,c,v=>v,g);
    const pixels=c.getImageData(0,0,832,576).data;
    check('phase '+phase+' x='+bx+': each rear entry is marked',positions.slice(0,limit).every(p=>pixels[((p.y+4)*4*832+202*4)*4+3]>0));
    tick(g,.83);check('phase '+phase+' x='+bx+': full warning before retreat',b.x===bx&&fighters(g).length===0);
    let reversed=true,ground=true,separate=true,clearHull=true,cap=true,hadArrival=false,lastX=b.x;
    for(let i=0;i<12*120&&b.attack;i++){
     const stage=b.attack.stage;tick(g,1/120);
     if(stage==='withdraw')reversed&&=b.x>=lastX&&b.x<=170.001;
     ground&&=b.y+b.h===130;lastX=b.x;const ds=fighters(g);cap&&=ds.length<=limit;
     for(const d of ds){
      clearHull&&=d.y+d.h<=b.y;hadArrival||=!!d.arriving;
      if(d.arriving)clearHull&&=d.x>=positions[d.lane].x&&d.y===positions[d.lane].y;
     }
     separate&&=ds.every((d,i)=>ds.slice(i+1).every(o=>!(d.x<o.x+o.w&&d.x+d.w>o.x&&d.y<o.y+o.h&&d.y+d.h>o.y)));
    }
    const arrivals=g.audit.filter(a=>a.kind==='reinforcement'),back=g.audit.find(a=>a.kind==='withdraw');
    check('phase '+phase+' x='+bx+': retreats then calls one rear group',reversed&&ground&&arrivals.length===limit&&arrivals.every(a=>a.x===216&&a.bossX===170&&a.time>back.time)&&new Set(arrivals.map(a=>a.time)).size===1,arrivals);
    check('phase '+phase+' x='+bx+': compact separated fighters clear the hull',hadArrival&&clearHull&&separate&&cap&&fighters(g).length===limit&&fighters(g).every(d=>d.w===11&&d.h===8&&!d.arriving));
    check('phase '+phase+' x='+bx+': returns and completes the maneuver',!b.attack&&Math.abs(b.x-Math.max(phase===2?90:76,Math.min(144,bx)))<.1);
   }
   const steady=make(),sg=steady.g,sb=steady.b;
   const ds=positions.map((p,lane)=>sg.spawnEnemy('twinDart',p.x,p.y,{lane,byBoss:true,persistentEscort:true}));
   let shotCap=true,visible=true;
   for(let i=0;i<60*120;i++){sb.idle=99;tick(sg,1/120);shotCap&&=sg.enemyShots.filter(s=>s.escort).length<=2;visible&&=ds.every(d=>d.x>=2&&d.x+d.w<=206&&d.y>=11&&d.y+d.h<=106);}
   check('all four fighters persist, remain visible and get firing turns',shotCap&&visible&&ds.every(d=>!d.dead&&d.shots>5),ds.map(d=>({lane:d.lane,shots:d.shots})));
   check('full formation refuses another reinforcement call',!beginAttack(sb,sg,'darts'));
   sg.damage(ds[0],1);sg.damage(ds[1],2);sg.damage(ds[3],2);tick(sg,.02);sb.attack=null;
   const at=sg.time;beginAttack(sb,sg,'darts');tick(sg,8);
   const replacement=sg.audit.filter(a=>a.kind==='reinforcement'&&a.time>at);
   check('replacement call fills only the two missing rear positions',replacement.length===2&&replacement.map(a=>a.lane).sort().join(',')==='1,3'&&fighters(sg).length===4&&fighters(sg).includes(ds[0])&&ds[0].hp===1&&fighters(sg).includes(ds[2]));
   const gun=make();Object.assign(gun.g.player,{y:50,invuln:0});beginAttack(gun.b,gun.g,'darts');tick(gun.g,1.35);
   const entrant=fighters(gun.g).find(d=>d.lane===1);
   check('off-screen arrivals cannot ram or be hit invisibly',entrant?.arriving&&entrant.x>208&&!entrant.T.hitTest(entrant,entrant.x,entrant.y,11,8)&&!entrant.T.shotTest(entrant,entrant.x,entrant.y,11,8));
   tick(gun.g,2.2,{dx:0,dy:0,fire:true});
   check('the ordinary gun destroys an arriving fighter without a phantom replacement',entrant.dead&&gun.g.score===30&&gun.g.health===5&&fighters(gun.g).length===3&&gun.g.audit.filter(a=>a.kind==='reinforcement').length===4);
   for(const stage of ['withdraw','arrival','regroup','advance']){
    const {g,b}=make();beginAttack(b,g,'darts');
    for(let i=0;i<12*120&&b.attack?.stage!==stage;i++)tick(g,1/120);
    const reached=b.attack?.stage===stage,kept=fighters(g),before=kept.map(d=>[d.id,d.hp,d.x,d.y]),stoppedAt=g.time;
    g.killPlayer(b);tick(g,.8);
    check(stage+': life loss cancels pending arrivals and freezes survivors',reached&&!b.attack&&g.state==='dying'&&g.lives===2&&JSON.stringify(fighters(g).map(d=>[d.id,d.hp,d.x,d.y]))===JSON.stringify(before)&&!g.audit.some(a=>a.time>stoppedAt&&['reinforcement','fire'].includes(a.kind)));
    tick(g,1.4);check(stage+': survivors resume after safe respawn',g.state==='playing'&&g.health===5&&kept.every(d=>!d.dead&&fighters(g).includes(d)));
   }
   const loss=make();beginAttack(loss.b,loss.g,'darts');tick(loss.g,1.35);const incoming=fighters(loss.g);
   loss.g.startBossDeath(loss.b);const deathAt=loss.g.time;tick(loss.g,3);
   check('boss defeat cancels the rear wave and any later launches',incoming.length===4&&incoming.every(d=>d.dead)&&fighters(loss.g).length===0&&!loss.g.audit.some(a=>a.kind==='reinforcement'&&a.time>deathAt));
   for(const phase of [1,2,3]){
    let broadside=true,combos=true,repeats=true;
    for(const dice of [.01,.25,.45,.75,.99])for(const y of [20,115]){
     const {g,b}=make(phase);g.rand=()=>dice;g.player.y=y;const names=[];
     for(let i=0;i<100;i++){
      const name=chooseAttack(b,g);if(!beginAttack(b,g,name))throw new Error('Selection rejected '+name);
      names.push(name);b.attack=null;
      if(i>=7)broadside&&=names.slice(-4).includes('broadside');
      if(phase===3&&i>=6)combos&&=names.slice(-5).some(n=>['pursuit','rushFlak'].includes(n));
      if(i>0)repeats&&=names[i]!==names[i-1];
     }
    }
    check('phase '+phase+': broadside frequency, varied attacks and combinations remain bounded',broadside&&combos&&repeats);
   }
   return results;
  });
  for(const r of results){assert.ok(r.ok,phone.width+': '+r.name+' '+JSON.stringify(r.detail??''));count++;console.log('PASS '+phone.width+': '+r.name);}
  // Use the actual UI to freeze a wave in flight and restart it cleanly.
  await page.locator('#action').click();await page.evaluate(async()=>{
   const h=window.__boss,g=h.game;h.advance(11);g.speech.reset();
   const {beginAttack,clearThreats}=await import('/demos/glacier-boss/boss.js?boss=7');clearThreats(g);
   Object.assign(g.boss,{mode:'fight',phase:3,x:144,attack:null,idle:99});beginAttack(g.boss,g,'darts');h.advance(1.4);
  });
  await page.locator('#pause').click();const paused=await page.evaluate(()=>JSON.stringify({b:window.__boss.game.boss.x,ds:window.__boss.game.enemies.map(d=>[d.id,d.x,d.y])}));
  await page.evaluate(()=>window.__boss.advance(2));
  assert.equal(await page.evaluate(()=>JSON.stringify({b:window.__boss.game.boss.x,ds:window.__boss.game.enemies.map(d=>[d.id,d.x,d.y])})),paused);count++;console.log('PASS '+phone.width+': pause freezes an actual incoming wave');
  await page.locator('#action').click();await page.screenshot({path:join(out,phone.width+'-rear-arrivals.png')});
  await page.locator('#pause').click();await page.locator('#restart').click();
  assert.ok(await page.evaluate(()=>!window.__boss.game.boss&&window.__boss.game.enemies.length===0));count++;
  assert.deepEqual(errors,[]);count++;await page.close();
 }
 console.log('All '+count+' reinforcement checks passed');
}finally{await browser.close();await new Promise(r=>server.close(r));}
