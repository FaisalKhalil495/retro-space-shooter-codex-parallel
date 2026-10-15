// Local mechanical destruction. Cached hull fragments, no new hitboxes or blood.
import { picture } from './art.js?boss=3';
import { METAL } from '../../js/gore.js?v=0.29.0';
import { sfx } from '../../js/audio.js?v=0.29.0';
export const BREAKUP_SECONDS=6.4;
// Partition the actual drawing: bridge, engines, bow, hull and three runners.
const CUTS=[[18,0,23,9,.4],[41,0,17,9,.75],[0,0,18,9,1.05],
  [0,9,17,11,1.35],[17,9,14,11,1.65],[31,9,13,11,1.95],[44,9,14,11,2.25],
  [0,20,19,4,2.5],[19,20,20,4,2.65],[39,20,19,4,2.8]];
export function beginBreakup(e,g){
  const img=picture(e);
  e.wreck={core:false,beat:0,trail:0,finished:false,impacts:0,released:0,
    pieces:CUTS.map(([sx,sy,sw,sh,at],i)=>({img,sx,sy,sw,sh,at,
      x:e.x+sx+sw/2,y:e.y+sy+sh/2,vx:(i%2?-1:1)*(28+i*5),vy:-58-i%4*13,
      spin:(i%2?-1:1)*(3.5+i*.42),angle:0,launched:false,bounces:0}))};
  g.wreck=e;g.shake=5;sfx.crack();
}
export function updateBreakup(e,dt,g){
  const w=e.wreck;if(!w)return;
  if(e.timer>=w.beat&&e.timer<3.1){
    w.beat+=.22;
    const x=e.x+7+g.rand()*44,y=e.y+6+g.rand()*13;
    g.blasts.blast(x,y,.5+e.timer*.15);g.gore.chunks(x,y,4,METAL,65,false);sfx.explode(.35);
  }
  if(!w.core&&e.timer>=2.8){
    w.core=true;g.blasts.blast(e.x+29,e.y+12,2.6);g.gore.chunks(e.x+29,e.y+12,36,METAL,125,false);
    g.burst(e.x+29,e.y+12,36,110,['#e0dcc1','#d99b43','#9b7953']);g.shake=9;g.flash=.09;sfx.explode(2);sfx.crack();
  }
  const trail=(w.trail-=dt)<=0;if(trail)w.trail=.12;
  for(const p of w.pieces){
    if(e.timer<p.at)continue;
    if(!p.launched){p.launched=true;w.released++;g.blasts.blast(p.x,p.y,.65);sfx.crack();}
    if(p.bounces<2){
      p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=56*dt;p.angle+=p.spin*dt;
      if(p.x<5||p.x>203){p.x=Math.max(5,Math.min(203,p.x));p.vx*=-.5;}
      const radius=(Math.abs(Math.sin(p.angle))*p.sw+Math.abs(Math.cos(p.angle))*p.sh)/2;
      if(p.vy>0&&p.y+radius>=130){
        p.y=130-radius;p.vy*=-.27;p.vx*=.5;p.spin*=.4;p.bounces++;w.impacts++;
        if(p.bounces===2){p.angle=Math.round(p.angle/Math.PI)*Math.PI;p.y=130-p.sh/2;}
        g.blasts.dust(p.x,128,.6);g.burst(p.x,127,6,30,['#e8eee5','#a6c9d3']);sfx.explode(.25);
      }
    }
    if(trail&&p.launched&&e.timer<5.6){
      g.blasts.fire(p.x,p.y,1.5+(p.sw>15?1:0),.24,0);
      if(p.bounces<2)g.burst(p.x,p.y,1,8,['#9b7953','#d99b43']);
    }
  }
  if(e.timer>=BREAKUP_SECONDS&&!w.finished){w.finished=true;g.finishBoss(e);}
}
export function drawBreakup(e,c,snap){
  const w=e.wreck;if(!w)return;
  for(const p of w.pieces){
    c.save();c.translate(snap(p.x),snap(p.y));if(p.launched)c.rotate(p.angle);
    c.drawImage(p.img,p.sx,p.sy,p.sw,p.sh,-p.sw/2,-p.sh/2,p.sw,p.sh);c.restore();
  }
}
