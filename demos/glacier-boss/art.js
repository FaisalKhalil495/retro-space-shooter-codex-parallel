import { detailCanvas, grit } from '../../js/detail.js?v=0.29.0';
export const WIDTH=58,HEIGHT=24;
const P={ink:'#18242c',dark:'#354144',steel:'#657274',olive:'#6c7050',green:'#96977b',cream:'#c9c5ac',light:'#e0dcc1',snow:'#e8eee5',copper:'#9b7953',amber:'#d99b43'};
function rect(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(x,y,w,h);}
function poly(c,points,color){
  for(let y=Math.floor(Math.min(...points.map(p=>p[1]))*2)/2;y<Math.max(...points.map(p=>p[1]));y+=.5){
    const xs=[];for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length],cy=y+.25;
      if((a[1]<=cy&&b[1]>cy)||(b[1]<=cy&&a[1]>cy))xs.push(a[0]+(cy-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
    xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2){const x=Math.round(xs[i]*2)/2;rect(c,x,y,Math.round(xs[i+1]*2)/2-x,.5,color);}
  }
}
function panel(c,x,y,w,h,color=P.olive){rect(c,x,y,w,h,P.ink);rect(c,x+.5,y+.5,w-1,h-1,color);rect(c,x+1,y+.5,w-2,.5,P.light);rect(c,x+1,y+h-1,w-2,.5,P.dark);for(const dx of [1,w-1.5])for(const dy of [1,h-1.5])rect(c,x+dx,y+dy,.5,.5,P.steel);}
function vent(c,x,y,w,h){panel(c,x,y,w,h,P.dark);for(let yy=1;yy<h-1;yy+=1)rect(c,x+1,y+yy,w-2,.5,P.steel);}
function paint(phase,open){
  const {canvas,ctx:c}=detailCanvas(WIDTH,HEIGHT);
  // Sharp naval icebreaker: swept armored prow, recessed reactor spine,
  // slab-sided drive pods and a split siege cannon. All within the old box.
  for(const [x,w]of [[0,19],[20,19],[40,18]]){
    poly(c,[[x,22],[x+4,20],[x+w-2,21],[x+w,23],[x+w-3,24],[x,24]],P.ink);
    rect(c,x+2,22.5,w-4,.5,P.light);rect(c,x+2,23.5,w-4,.5,P.steel);
    poly(c,[[x+7,18],[x+10,18],[x+12,22],[x+8,22]],P.dark);
  }
  poly(c,[[1,12],[14,7],[31,5],[49,6],[58,12],[56,19],[45,22],[15,21],[0,18]],P.ink);
  poly(c,[[3,12],[15,8],[31,6],[48,7],[56,12],[54,18],[44,20],[16,19.5],[2,17]],P.olive);
  // Swept command citadel; no row of boxy cabins or smokestacks.
  poly(c,[[23,7],[30,2],[44,1],[50,7],[43,10],[29,10]],P.ink);
  poly(c,[[26,6.5],[31,3],[43,2],[47,6.5],[41,8],[30,8]],P.cream);
  poly(c,[[30,4],[43,3],[46,6],[29,7]],P.dark);
  for(let x=32;x<44;x+=2.5)rect(c,x,4,1.5,1,P.amber);
  poly(c,[[43,1],[46,0],[48,1],[47,6],[45,6]],P.ink);
  rect(c,45.5,1,1,.5,P.light);
  // Layered diagonal cheek armor over the reactor and drive train.
  for(const [x,y,w]of [[19,9,11],[29,8,11],[39,9,12]]){
    poly(c,[[x,y],[x+w,y-1],[x+w-2,y+7],[x+2,y+8]],P.ink);
    poly(c,[[x+1,y+.5],[x+w-1,y],[x+w-3,y+6],[x+2.5,y+6.5]],P.cream);
    rect(c,x+2,y+1,w-5,.5,P.light);
    for(let k=0;k<3;k++)rect(c,x+3+k,y+3+k*.5,2,.5,P.steel);
    rect(c,x+2,y+5,.5,.5,P.copper);
  }
  // Low stern gun and sloping twin propulsion nacelles.
  poly(c,[[48,8],[53,6],[57,7],[58,10],[52,12]],P.ink);
  rect(c,53,7,5,1.5,P.steel);rect(c,56,8,2,1,P.ink);
  for(const [x,y]of [[43,14],[49,15]]){
    poly(c,[[x,y],[x+6,y-2],[x+8,y],[x+5,y+5],[x,y+4]],P.ink);
    poly(c,[[x+1,y+.5],[x+5,y-1],[x+6,y+.5],[x+4,y+3],[x+1,y+2.5]],P.steel);
    for(let k=0;k<3;k++)rect(c,x+2+k,y+k*.5,1,2,P.dark);
    rect(c,x+4,y+2,.5,1,P.amber);
  }
  panel(c,37,12,5,6,phase>1?P.dark:P.olive);
  if(phase>1){rect(c,38,13,3,1,P.copper);rect(c,38,15,3,.5,P.steel);}
  // Huge split bow: the cannon opens towards the incoming bullet/rocket path.
  if(open){
    c.clearRect(0,0,12,9);
    poly(c,[[10,8],[15,3],[27,7],[23,11],[14,10]],P.ink);
    poly(c,[[12,8],[16,4],[25,7],[22,9.5],[15,9]],P.cream);
    poly(c,[[2,20],[14,17],[25,19],[20,23],[7,22]],P.ink);
    poly(c,[[4,20],[14,18],[23,19.5],[19,21.5],[8,21]],P.cream);
    // Clear 15x11 forward corridor, with an octagonal breech at the rear.
    poly(c,[[0,11],[12,9],[18,11],[18,18],[12,21],[0,19]],P.ink);
    rect(c,0,12,14,6,P.dark);rect(c,0,13,14,4,P.copper);
    rect(c,0,14,12,2,P.amber);rect(c,1,14.5,10,1,P.light);
    for(let x=2;x<13;x+=3)rect(c,x,12,1,.5,P.steel);
    rect(c,14,12,2,6,P.steel);rect(c,14.5,13,1,4,P.dark);
  }else{
    poly(c,[[0,12],[12,6],[28,8],[23,14],[11,16],[0,15]],P.ink);
    poly(c,[[1,12],[12,7],[26,8.5],[22,12.5],[11,14],[1,14]],P.cream);
    poly(c,[[1,17],[12,14],[24,15],[22,19],[14,22],[0,20]],P.ink);
    poly(c,[[2,17.5],[12,15],[22,15.5],[20,18.5],[14,20.5],[1,19.5]],P.cream);
    rect(c,0,14.5,15,1,P.dark);rect(c,2,13,8,.5,P.light);
    for(let x=6;x<18;x+=4)rect(c,x,17,2,.5,P.steel);
  }
  // Frost seams, bolts, cable runs and progressively exposed machinery.
  for(const [x,y]of [[14,9],[21,12],[31,10],[44,8],[53,12]]){
    rect(c,x,y,1,1,P.ink);rect(c,x,y,.5,.5,P.light);
  }
  rect(c,25,18,12,.5,P.ink);rect(c,27,18.5,9,.5,P.steel);
  if(phase>1){
    for(const [x,y]of [[17,9],[27,13],[43,17]]){
      poly(c,[[x,y],[x+5,y+1],[x+2,y+3],[x+4,y+5],[x,y+3]],P.ink);
      rect(c,x+1,y+1,2,1,P.copper);rect(c,x+2,y+2,.5,1,P.amber);
    }
  }
  if(phase===3){
    poly(c,[[32,2],[38,2],[41,6],[36,8],[31,5]],P.dark);
    rect(c,34,4,4,1,P.copper);rect(c,35,4,2,.5,P.amber);
    poly(c,[[5,10],[12,7],[17,8],[11,11]],P.steel);
    rect(c,45,2,2,3,P.dark);
  }
  // Fine wear is deterministic and only prepainted once.
  const im=canvas.hi.getContext('2d').getImageData(0,0,WIDTH*2,HEIGHT*2),b=im.data;
  for(let y=0;y<HEIGHT*2;y++)for(let x=0;x<WIDTH*2;x++){const i=(y*WIDTH*2+x)*4;if(!b[i+3])continue;
    if((b[i]===108||b[i]===201)&&grit(x,y,400+phase)>.95){b[i]=155;b[i+1]=160;b[i+2]=143;}}
  canvas.hi.getContext('2d').putImageData(im,0,0);
  canvas.mask=Uint8Array.from({length:WIDTH*HEIGHT*4},(_,i)=>b[i*4+3]?1:0);
  const flash=detailCanvas(WIDTH,HEIGHT).canvas;for(let i=0;i<b.length;i+=4)if(b[i+3]){b[i]=232;b[i+1]=229;b[i+2]=204;}
  flash.hi.getContext('2d').putImageData(im,0,0);canvas.flash=flash;return canvas;
}
export const HULLS=[1,2,3].map(p=>({closed:paint(p,false),open:paint(p,true)}));
export function picture(e){return HULLS[e.phase-1][e.open?'open':'closed'];}
export function hullContact(e,x,y,w,h){
  if(e.mode==='enter'||e.mode==='dying')return null;
  const p=picture(e),x0=Math.max(0,Math.floor((x-e.x)*2)),x1=Math.min(WIDTH*2,Math.ceil((x+w-e.x)*2));
  const y0=Math.max(0,Math.floor((y-e.y)*2)),y1=Math.min(HEIGHT*2,Math.ceil((y+h-e.y)*2));
  for(let yy=y0;yy<y1;yy++)for(let xx=x0;xx<x1;xx++)if(p.mask[yy*WIDTH*2+xx])return 'hit';return null;
}
export const SHELL=(()=>{const {canvas,ctx:c}=detailCanvas(6,6);poly(c,[[2,0],[4,0],[6,2],[6,4],[4,6],[2,6],[0,4],[0,2]],P.ink);panel(c,1,1,4,4,P.copper);rect(c,2,1.5,2,.5,P.light);return canvas;})();
