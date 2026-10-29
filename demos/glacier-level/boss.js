import { BREAKWATER, chooseAttack, beginAttack } from '../glacier-boss/boss.js?boss=7';

const combo=name=>name==='rushFlak'||name==='pursuit';
export function chooseMissionAttack(e,g){
 if(e.phase===1||(e.introIndex||0)<2)return chooseAttack(e,g);
 const recent=e.recent||[];
 // Two other attacks maximum between broadsides. In phase 3, two ordinary
 // attacks between combinations keep both deadlines compatible.
 if(!recent.slice(-2).includes('broadside'))return 'broadside';
 if(e.phase===3&&!recent.slice(-2).some(combo))return g.playerCenter().y<62?'pursuit':'rushFlak';
 return chooseAttack(e,g);
}
const transient=g=>g.enemyShots.some(s=>!s.escort)||g.enemies.some(e=>!e.dead&&!e.persistentEscort&&['twinDart','clusterShell','clusterBurst','glacierRupture','hunterTorpedo'].includes(e.type));
export const MISSION_BOSS={...BREAKWATER,
 update(e,dt,g){
  if(e.phase>=2&&e.mode==='fight'&&!e.attack&&e.idle<=dt&&g.state==='playing'&&g.bossMayAttack(e)){
   // Let the original patrol, launcher and spray update normally, then select
   // at the native time. Starting before update would shorten the warning.
   const idle=e.idle;e.idle=Infinity;BREAKWATER.update(e,dt,g);e.idle=idle-dt;
   if(!transient(g))beginAttack(e,g,chooseMissionAttack(e,g));
  }else BREAKWATER.update(e,dt,g);
 }
};
