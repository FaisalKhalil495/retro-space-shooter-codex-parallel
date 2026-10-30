// Compare actual waves with Preview 4 and all three shipped worlds. Then
// exercise selected formations with real admission, health and normal input.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {serve} from './serve.mjs';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');
const out=process.argv[2]||'/tmp/ember-mission-formations';await mkdir(out,{recursive:true});
const routes=JSON.parse(await readFile(new URL('./fixtures/mission-formation-routes.json',import.meta.url),'utf8'));
const baseline='c7665728140a91f1f61b17b59dc28afa2ec046b0';
const {server,base}=await serve();let browser,count=0;
try{
 browser=await chromium.launch({slowMo:0});
 for(const phone of [{name:'android',width:915,height:412,q:''},{name:'iphone',width:874,height:402,q:'?safe=62'}]){
  const page=await browser.newPage({viewport:{width:phone.width,height:phone.height},isMobile:true,hasTouch:true}),errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  await page.route('**/demos/glacier-level/*.js?mission=baseline4',route=>{
   const file=new URL(route.request().url()).pathname.split('/').pop();
   const body=execFileSync('git',['show',baseline+':demos/glacier-level/'+file],{encoding:'utf8'}).replaceAll('mission=4','mission=baseline4');
   return route.fulfill({body,contentType:'text/javascript'});
  });
  await page.goto(base+'demos/glacier-level/'+phone.q);await page.waitForFunction(()=>window.__mission?.artworkReady);await page.evaluate(()=>window.__mission.frozen=true);
  const result=await page.evaluate(async({routes,old})=>{
   const now=await import('/demos/glacier-level/scene.js?mission=7'),before=await import('/demos/glacier-level/scene.js?mission=baseline4');await before.battleReady;
   const {Game}=await import('/js/game.js?v=0.29.0');
   const {MissionGame:G,FORMATIONS,ARRIVALS}=now,C=old?before.MissionGame:G;
   const checks=[],record=(name,ok,detail)=>checks.push({name,ok:!!ok,detail});
   const expected={shelfSkiff:[18,7],anchorGun:[17,10],twinDart:[14,7],crestBomber:[20,6],snowRoller:[18,8],needleWing:[20,7],wakeHunter:[19,8]};
   for(const [type,[w,h]]of Object.entries(expected)){
    const g=new C(),b=new before.MissionGame(),e=g.spawnEnemy(type,160,32),prior=b.spawnEnemy(type,160,32);
    record(type+': modestly smaller original design, matching body and unchanged toughness',e.w===w&&e.h===h&&e.w/prior.w>=.55&&e.w/prior.w<=.62&&e.hp===prior.hp&&e.T.score===prior.T.score);
   }
   record('54 real formations of 3–5 craft, with 54/72/88 machines over three minutes',!old&&FORMATIONS.length===54&&FORMATIONS.every(w=>w.members.length>=3&&w.members.length<=5)&&ARRIVALS.length===214&&[1,2,3].every((s,i)=>ARRIVALS.filter(e=>e.section===s).length===[54,72,88][i]));
   {
    const g=new C();g.player.entering=0;g.runner.t=25;g.runner.next=ARRIVALS.length;g.runner.pod=10;
    const dart=ARRIVALS.find(e=>e.type==='twinDart'),hunter=ARRIVALS.find(e=>e.type==='wakeHunter');
    g.runner.pending=[{...dart,time:25,y:60},{...hunter,time:25}];g.runner.update(1/120);
    const e=g.enemies.find(e=>e.missionRegular);
    record('admission keeps its selected row when removing it exposes a waiting hunter',e?.type==='twinDart'&&e.baseY===60&&e.y===60,{type:e?.type,y:e?.y});
   }
   const excluded=new Set(['carrier','rockSmall','rockBig','mortarShell','frostMine','coastBomb','rollingCharge']);
   const craft=e=>!e.dead&&!e.T.boss&&!excluded.has(e.type);
   const seed=g=>{let n=28;g.rand=()=>{n=(n*1664525+1013904223)>>>0;return n/4294967296;};};
   const inventories=[];
   for(const [name,make]of [['outerBelt',()=>new Game({level:1})],['rustMoon',()=>new Game({level:2})],['frostring',()=>new Game({level:3})],['preview4',()=>new before.MissionGame()],['preview6',()=>new C()]]){
    const g=make();seed(g);let spawned=0,shots=0,peak=0,sum=0,frames=0,groupPeak=0,visibleFire=0,warningVisible=true;
    const spawn=g.spawnEnemy.bind(g);g.spawnEnemy=(...a)=>{const e=spawn(...a);if(craft(e))spawned++;return e;};
    const fire=g.fireShot.bind(g);g.fireShot=(...a)=>{shots++;return fire(...a);};
    const previousWarns=new Set();
    for(let i=0;i<120*180&&!g.boss;i++){
     g.player.invuln=100;g.update(1/120,{dx:0,dy:0,fire:false});
     const live=g.enemies.filter(e=>craft(e)&&e.x<208&&e.x+e.w>0&&e.y<130&&e.y+e.h>11),groups={};
     peak=Math.max(peak,live.length);sum+=live.length;frames++;
     for(const e of live)if(e.formation!==undefined)groups[e.formation]=(groups[e.formation]||0)+1;
     groupPeak=Math.max(groupPeak,0,...Object.values(groups));
     for(const e of g.enemies)if(e.missionRegular&&e.mode==='warn'&&!previousWarns.has(e.id)){
      previousWarns.add(e.id);warningVisible&&=e.x>=8&&e.x+e.w<=206.001;visibleFire++;
     }
    }
    inventories.push({name,craft:spawned,shots,meanVisible:sum/frames,peak,groupPeak,warningVisible,visibleWarnings:visibleFire,arrivals:g.audit?.filter(e=>e.kind==='arrival')});
   }
   const prior=inventories[3],current=inventories[4],frost=inventories[2];
   // Slower survivors and five-drop bombers occupy lanes longer. No-fire
   // traffic is a crowding audit; the mission suite separately requires all
   // 214 entries in armed progression, without loosening caps or queue limits.
   record('uncleared slow traffic still admits twice Preview 4 craft with the full 214-entry schedule',current.craft>prior.craft*2&&now.ARRIVALS.length===214,{before:prior.craft,after:current.craft,frostring:frost.craft});
   record('average visible group pressure more than doubles, with at least four formation members together',current.meanVisible>prior.meanVisible*2&&current.meanVisible>=5&&current.groupPeak>=4,current);
   record('real gunfire reaches the previous world’s range, with full-body visible warnings',current.shots>=frost.shots*.8&&current.warningVisible&&current.visibleWarnings>100,{shots:current.shots,frost:frost.shots,warnings:current.visibleWarnings});
   for(const profile of ['vertical','rectangle','rightEdge']){
    const g=new C();seed(g);let dir=-1,k=0,overlap=false,cap=0,sky=true;const route=[[120,16],[2,112],[120,112],[2,16]];
    for(let i=0;i<120*210&&!g.boss;i++){
     g.player.invuln=100;const p=g.player;let x,y;
     if(profile==='rightEdge'){x=188;y=65;}
     else if(profile==='vertical'){if(p.y<=15)dir=1;if(p.y>=114)dir=-1;x=26;y=dir<0?14:115;}
     else{[x,y]=route[k%4];if(Math.abs(p.x-x)<2&&Math.abs(p.y-y)<2)k++;}
     g.update(1/120,{dx:Math.abs(p.x-x)>1?Math.sign(x-p.x):0,dy:Math.abs(p.y-y)>1?Math.sign(y-p.y):0,fire:false});
     const actors=g.enemies.filter(e=>e.missionRegular&&!e.dead&&e.x<208&&e.x+e.w>0);cap=Math.max(cap,actors.length);sky&&=actors.filter(e=>e.T.flies).every(e=>e.y>=14&&e.y+e.h<=111);
     overlap||=actors.some((a,i)=>actors.slice(i+1).some(b=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y));
    }
    record(profile+': full crowded timeline stays bounded and physically separated while the player moves',!overlap&&sky&&cap<=8&&!!g.boss&&!g.audit.some(e=>e.kind==='approachFallback'),{overlap,sky,cap,time:g.time});
   }
   const pilots=[];
   for(const profile of ['vertical','rectangle','figure8'])for(const [name,make]of [['outerBelt',()=>new Game({level:1})],['rustMoon',()=>new Game({level:2})],['frostring',()=>new Game({level:3})],['preview4',()=>new before.MissionGame()],['preview6',()=>new C()]]){
    const g=make();seed(g);let k=0,dir=-1,first=null,damage=0;
    const hurt=g.hurtPlayer.bind(g);g.hurtPlayer=(...a)=>{const hp=g.health;hurt(...a);if(g.health<hp){first??=g.time;damage+=hp-g.health;}};
    const route=profile==='figure8'?[[100,16],[2,112],[100,112],[2,16]]:[[65,112],[65,16],[2,16],[2,112]];
    for(let i=0;i<120*180&&!['gameover','clear'].includes(g.state);i++){
     const p=g.player;let x,y;if(profile==='vertical'){if(p.y<=15)dir=1;if(p.y>=114)dir=-1;x=26;y=dir<0?14:115;}
     else{[x,y]=route[k%4];if(Math.abs(p.x-x)<2&&Math.abs(p.y-y)<2)k++;}
     g.update(1/120,{dx:Math.abs(p.x-x)>1?Math.sign(x-p.x):0,dy:Math.abs(p.y-y)>1?Math.sign(y-p.y):0,fire:true,special:false});
    }
    pilots.push({profile,name,time:g.time,state:g.state,health:g.health,lives:g.lives,firstDamage:first,damage});
   }
   record('normal-health moving pilots still encounter damage; earned loot may extend survival',pilots.filter(p=>p.name==='preview6').every(p=>p.firstDamage!==null&&p.damage>=5),pilots);
   for(const r of routes){
    const wave=FORMATIONS.find(w=>w.section===r.minute+1&&w.recipe===r.recipe),g=new C();seed(g);
    Object.assign(g.player,{x:26,y:115,entering:0,invuln:0});
    // Select ONE real wave; native admission, safety gates and combat still
    // run. Suppress unrelated future waves/pods in this bounded dodge fixture.
    g.runner.t=wave.time-1/120;g.runner.next=ARRIVALS.findIndex(e=>e.group===wave.id);g.runner.pod=10;
    const end=g.runner.next+wave.members.length,update=g.runner.update.bind(g.runner);
    g.runner.update=dt=>{update(dt);if(g.runner.next===end)g.runner.next=ARRIVALS.length;};
    const route=r.reverse?[[2,r.top],[r.right,r.top],[r.right,r.bottom],[2,r.bottom]]:[[r.right,r.bottom],[r.right,r.top],[2,r.top],[2,r.bottom]];let k=r.offset;
    for(let i=0;i<120*20;i++){
     const [x,y]=route[k%4],p=g.player;if(Math.abs(p.x-x)<2&&Math.abs(p.y-y)<2)k++;
     g.update(1/120,{dx:Math.abs(p.x-x)>1?Math.sign(x-p.x):0,dy:Math.abs(p.y-y)>1?Math.sign(y-p.y):0,fire:false,special:false});
    }
    const arrivals=g.audit.filter(e=>e.kind==='arrival'),counts=arrivals.map(e=>g.audit.filter(a=>a.id===e.id&&['fire','dash'].includes(a.kind)).length);
    record('minute '+(r.minute+1)+' '+r.recipe+': all machines attack, complete no-hit escape with native movement',g.health===5&&g.lives===3&&g.enemies.length===0&&g.enemyShots.length===0&&arrivals.length===wave.members.length&&JSON.stringify(counts)===JSON.stringify(r.counts),{counts,health:g.health,lives:g.lives,remaining:g.enemies.length});
   }
   return {checks,inventories,pilots};
  },{routes,old:!!process.env.OLD_FORMATIONS});
  await writeFile(join(out,phone.name+'-review.json'),JSON.stringify(result,null,2)+'\n');
  for(const r of result.checks){assert.ok(r.ok,phone.name+': '+r.name+' '+JSON.stringify(r.detail??''));count++;console.log('PASS '+phone.name+': '+r.name);}
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('All '+count+' mission formation checks passed');
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
