// Review helper: original movement/fire inputs only; no health or position edits.
export function makePilot(){
 let specialAt=-10;
 return g=>{
  const p=g.player,b=g.boss,a=b?.attack;let tx=26,ty=b?Math.max(11,Math.min(118,g.aimPoint(b).y-6)):115;
  const cx=p.x+9.5;
  const bands=[];
  if(a?.name==='flak')ty=a.gap-5.5;
  if(a?.name==='rush'&&a.stage!=='recover')ty=b.y-p.h-8;
  else if(a?.name==='ice'&&a.stage==='warn')tx=(a.marks[0]+a.marks[1])/2-9.5;
  if(a?.name==='broadside'&&(a.stage==='warn'||a.stage==='active'&&a.volleys<5)){
   for(let i=0;i<5;i++){
    const angle=a.angle+(i-2)*.22,dx=Math.cos(angle);
    if(Math.abs(dx)>.1){const t=(cx-a.mx)/dx;if(t>0){const y=a.my+Math.sin(angle)*t;const pad=i===2?7.5:6;bands.push([y-pad,y+pad]);}}
   }
  }
  if(a?.name==='beam'&&a.arc){
   const ys=[a.arc.from,a.arc.to].map(angle=>{
    const dx=Math.cos(angle),d=(cx-(a.mx??g.aimPoint(b).x))/dx;
    return d>0?(a.my??g.aimPoint(b).y)+Math.sin(angle)*d:null;
   }).filter(y=>y!==null);
   if(ys.length===2)bands.push([Math.min(...ys)-7,Math.max(...ys)+7]);
  }
  for(const s of g.enemyShots){
   const eta=Math.abs(s.vx)>1?(cx-s.x)/s.vx:Infinity;
   if(eta>=0&&eta<.9){const y=s.y+s.vy*eta,pad=s.kind==='shell'?7.5:6;bands.push([y-pad,y+pad]);}
  }
  if(bands.length&&a?.name!=='rush'){
   bands.sort((a,b)=>a[0]-b[0]);let edge=16;const spaces=[];
   for(const [lo,hi]of bands){if(lo-edge>=5)spaces.push([edge,Math.min(123,lo)]);edge=Math.max(edge,hi);}
   if(123-edge>=5)spaces.push([edge,123]);
   const options=spaces.filter(([lo,hi])=>hi-lo>=5).map(([lo,hi])=>({center:Math.max(lo+2.5,Math.min(hi-2.5,ty+5.5)),lo,hi}));
   options.sort((a,b)=>Math.abs(a.center-(p.y+5.5))-Math.abs(b.center-(p.y+5.5)));
   if(options.length)ty=options[0].center-5.5;
  }
  const special=!!b?.T.isVulnerable?.(b)&&Math.abs(p.y+5.5-(b.y+15))<5&&!!g.weapons.kind&&g.time-specialAt>.95;
  if(special)specialAt=g.time;
  return {dx:Math.abs(tx-p.x)>1.2?Math.sign(tx-p.x):0,dy:Math.abs(ty-p.y)>1.2?Math.sign(ty-p.y):0,fire:true,special};
 };
};
