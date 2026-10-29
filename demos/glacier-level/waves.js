// Private Glacier Coast formations. Counts mean individual machines, not waves.
// Earlier worlds use rows/convoys of 3–8 craft; do the same with this roster.
const recipes=['flight','skirmish','precision','bombing','convoy','hunt','pincer'];
const air=(type,y,extra={})=>({type,y,...extra});
function members(recipe,n){
 const lanes=[22,60,98,22,98];
 const darts=(count,ys=lanes)=>Array.from({length:count},(_,i)=>air('twinDart',ys[i%ys.length],{flow:true}));
 if(recipe==='flight'||recipe==='pincer')return darts(n,recipe==='pincer'?[22,98,60,22,98]:lanes);
 if(recipe==='skirmish')return [air('shelfSkiff',0),...darts(n-1,[22,60,98,22])];
 if(recipe==='precision')return n===3?[air('needleWing',22),...darts(2,[60,98])]:[air('needleWing',22),air('needleWing',94),...darts(n-2,[58,58,58])];
 if(recipe==='bombing')return [air('crestBomber',20),...darts(n-1,[58,96,58,96])];
 if(recipe==='convoy')return [air('snowRoller',0),air('anchorGun',0),...darts(n-2,[22,60,98])];
 return [air('wakeHunter',25),air('wakeHunter',88),air('shelfSkiff',0),...(n>3?[air('anchorGun',0)]:[])];
}
export const FORMATIONS=Object.freeze(Array.from({length:3},(_,minute)=>Array.from({length:18},(_,i)=>{
 const id=minute*18+i,recipe=recipes[id%recipes.length],time=minute*60+2+i*3.2;
 return Object.freeze({id,time,recipe,section:minute+1,members:Object.freeze(members(recipe,minute+3).map((e,slot)=>Object.freeze({...e,slot,holdX:132+(slot%2)*26})))});
})).flat());
export const ARRIVALS=Object.freeze(FORMATIONS.flatMap(w=>w.members.map((e,i)=>Object.freeze({...e,time:w.time+i*.42,group:w.id,recipe:w.recipe,section:w.section}))));
