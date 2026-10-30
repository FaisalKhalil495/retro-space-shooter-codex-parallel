// Exercise the real mission spawn path, not only a sprite drawn in isolation.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {serve} from './serve.mjs';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright');
// Same independent no-hit routes used to review Breakwater 7 before this art
// correction. Scaled bodies/muzzles must still allow complete native dodges.
const routes=JSON.parse(await readFile(new URL('./fixtures/mission-escort-routes.json',import.meta.url),'utf8'));
const out=process.argv[2]||'/tmp/ember-mission-escorts';await mkdir(out,{recursive:true});
const {server,base}=await serve();let browser,count=0;
try{
 browser=await chromium.launch({slowMo:0});
 for(const phone of [{name:'android',width:915,height:412,q:''},{name:'iphone',width:874,height:402,q:'?safe=62'}]){
  const page=await browser.newPage({viewport:{width:phone.width,height:phone.height},isMobile:true,hasTouch:true}),errors=[];
  page.on('pageerror',e=>errors.push(String(e)));await page.goto(base+'demos/glacier-level/'+phone.q);await page.waitForFunction(()=>window.__mission?.artworkReady);await page.evaluate(()=>window.__mission.frozen=true);
  const results=await page.evaluate(async routes=>{
   const {MissionGame}=await import('/demos/glacier-level/scene.js?mission=7');
   const {beginAttack,clearThreats}=await import('/demos/glacier-boss/boss.js?boss=7');
   const {FORMATION}=await import('/demos/glacier-boss/escorts.js?boss=7');
   const {picture,MISSION_ART}=await import('/demos/glacier-level/art.js?mission=7');
   const checks=[],record=(name,ok,detail)=>checks.push({name,ok:!!ok,detail});
   const make=(phase=3,bx=144)=>{
    const g=new MissionGame();g.runner={update(){}};g.rand=()=>.45;
    Object.assign(g.player,{x:26,y:115,entering:0,invuln:0});
    const b=g.spawnEnemy('breakwater',214,0);Object.assign(b,{x:bx,phase,mode:'fight',idle:99});return {g,b};
   };
   const tick=(g,n)=>{for(let i=0;i<Math.round(n*120);i++)g.update(1/120,{dx:0,dy:0,fire:false});};
   const fighters=g=>g.enemies.filter(e=>e.persistentEscort&&!e.dead);
   for(const phase of [2,3]){
    const {g,b}=make(phase,110);g.player.invuln=100;beginAttack(b,g,'darts');let arrived=false,clear=true,separate=true,art=true,visible=true;
    for(let i=0;i<120*12&&b.attack;i++){
     tick(g,1/120);const ds=fighters(g);arrived||=ds.some(e=>e.arriving);
     clear&&=ds.every(e=>e.y+e.h<=b.y);
     separate&&=ds.every((e,i)=>ds.slice(i+1).every(o=>!(e.x<o.x+o.w&&e.x+e.w>o.x&&e.y<o.y+o.h&&e.y+e.h>o.y)));
     art&&=ds.every(e=>e.w===14&&e.h===7&&[MISSION_ART.dart.idle,MISSION_ART.dart.open].includes(picture(e)));
     visible&&=ds.filter(e=>!e.arriving).every(e=>e.x>=2&&e.x+e.w<=206&&e.y>=11&&e.y+e.h<=106);
    }
    const group=fighters(g),audit=g.audit.filter(e=>e.kind==='reinforcement');
    record('phase '+phase+': actual boss launches compact detailed fighters from behind after retreat',arrived&&art&&group.length===(phase===2?3:4)&&audit.every(e=>e.x===216&&e.bossX===170)&&!b.attack);
    record('phase '+phase+': full group stays separated, visible and above the boss hull',clear&&separate&&visible);
    let bounded=true;for(let i=0;i<120*60;i++){b.idle=99;tick(g,1/120);bounded&&=g.enemyShots.filter(s=>s.escort).length<=2&&fighters(g).every(e=>e.x+e.w<=206&&e.y+e.h<=106);}
    record('phase '+phase+': every compact fighter gets firing turns with original speed and cap',bounded&&group.every(e=>e.shots>5)&&g.audit.filter(e=>e.type==='twinDart'&&e.kind==='fire').every(e=>e.speed===(phase===2?94:104)));
    g.damage(group[0],1);g.damage(group[1],2);tick(g,.02);b.attack=null;const at=g.time;beginAttack(b,g,'darts');tick(g,8);
    record('phase '+phase+': replacement fills one vacancy and retains survivor health',fighters(g).length===group.length&&fighters(g).includes(group[0])&&group[0].hp===1&&g.audit.filter(e=>e.kind==='reinforcement'&&e.time>at).length===1);
    clearThreats(g,true);const frozen=JSON.stringify(fighters(g).map(e=>[e.id,e.x,e.y,e.hp]));g.killPlayer(b);tick(g,.8);
    record('phase '+phase+': life loss freezes retained fighters without resetting health',g.state==='dying'&&JSON.stringify(fighters(g).map(e=>[e.id,e.x,e.y,e.hp]))===frozen);
   }
   for(const r of routes){
    const {g,b}=make(3,r.bx);for(const [lane,p]of FORMATION.slice(0,r.initialFighters??4).entries())g.spawnEnemy('twinDart',p.x,p.y,{lane,byBoss:true,persistentEscort:true});
    beginAttack(b,g,r.name);let k=r.offset,ended=null;
    const route=r.reverse?[[2,r.top],[r.right,r.top],[r.right,r.bottom],[2,r.bottom]]:[[r.right,r.bottom],[r.right,r.top],[2,r.top],[2,r.bottom]];
    for(let i=0;i<120*15;i++){
     const a=b.attack,[x,y]=route[k%4],p=g.player;if(Math.abs(p.x-x)<2&&Math.abs(p.y-y)<2)k++;
     let tx=x,ty=y;if(a){
      if(['flak','rushFlak'].includes(r.name)&&a.stage!=='recover'){tx=2;ty=a.gap-5.5;}
      if(r.name==='ice'&&a.stage==='warn'||r.name==='pursuit'&&a.iceWarning){tx=a.marks[0]<35?45:2;ty=p.y;}
     }
     g.update(1/120,{dx:Math.abs(p.x-tx)>1?Math.sign(tx-p.x):0,dy:Math.abs(p.y-ty)>1?Math.sign(ty-p.y):0,fire:false});
     if(!b.attack){ended??=g.time;b.idle=99;}if(ended!==null&&g.time>ended+2)break;
    }
    record(r.name+' x='+r.bx+' initial='+ (r.initialFighters??4)+': complete no-hit route with compact escorts and follow-up fire',g.health===5&&g.lives===3&&!b.attack&&fighters(g).length===4&&g.audit.some(e=>e.type==='twinDart'&&e.kind==='fire'),{health:g.health,lives:g.lives,attack:b.attack?.stage,fighters:fighters(g).length});
   }
   return checks;
  },routes);
  for(const r of results){assert.ok(r.ok,phone.name+': '+r.name+' '+JSON.stringify(r.detail??''));count++;console.log('PASS '+phone.name+': '+r.name);}
  assert.deepEqual(errors,[]);await writeFile(join(out,phone.name+'-checks.json'),JSON.stringify(results,null,2)+'\n');await page.close();
 }
 console.log('All '+count+' mission escort checks passed');
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
