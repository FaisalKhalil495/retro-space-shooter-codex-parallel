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
  // Three smooth runners, supports and a long naval hull; no walking parts.
  for(const [x,w]of [[1,19],[23,15],[42,16]]){
    poly(c,[[x,22],[x+2,20.5],[x+5,22],[x+w,22],[x+w-1,24],[x+1,24]],P.ink);
    rect(c,x+2,22.5,w-3,.5,P.snow);rect(c,x+3,23.5,w-4,.5,P.steel);
    panel(c,x+5,18,2,4,P.steel);
  }
  poly(c,[[0,9],[7,7],[39,7],[56,10],[58,16],[55,20],[14,21],[4,18]],P.ink);
  poly(c,[[2,9.5],[9,8],[39,8],[54,10.5],[55,17],[52,19],[15,19.5],[5,17]],P.olive);
  // Deck, armored bridge and two leaning exhaust stacks at the stern.
  panel(c,23,3.5,18,5,P.olive);rect(c,25,3,13,.5,P.light);
  for(let x=25;x<39;x+=2)rect(c,x,5,1,1,P.amber);
  rect(c,32,0,1,4,P.ink);rect(c,31,.5,3,.5,P.steel);
  for(const x of [46,51]){poly(c,[[x,7],[x+1,0],[x+4,.5],[x+3,8]],P.ink);panel(c,x+1,1,2,5,P.dark);rect(c,x+1,1,2,.5,P.steel);}
  panel(c,18,8,16,4);vent(c,36,8,8,4);panel(c,44,10,11,7,P.cream);
  // A small stern deck gun supplies the rear/overhead broadside origin.
  panel(c,53,7,4,3,P.steel);rect(c,55,7.5,3,1.5,P.ink);rect(c,55,7.5,2,.5,P.steel);
  vent(c,51,11,4,5);panel(c,21,13,17,6,P.cream);vent(c,32,14,5,4);
  // Side launch door becomes visibly exposed after the first armor break.
  panel(c,39,12,5,6,phase>1?P.dark:P.olive);
  if(phase>1){rect(c,40,13,3,1,P.copper);rect(c,40,15,3,.5,P.steel);rect(c,40,17,2,.5,P.amber);}
  // The bow's upper/lower plates fold back far enough for incoming rockets
  // to curve into the chamber; the hatch opening is a real visible corridor.
  if(open){
    c.clearRect(0,0,12,9);
    poly(c,[[10,9],[13,4],[23,7],[20,10]],P.ink);
    poly(c,[[12,8.5],[14,5],[21,7.5],[19,9]],phase===1?P.cream:P.steel);
    poly(c,[[7,19],[17,18],[23,21],[12,22],[4,21]],P.ink);
    poly(c,[[9,19.5],[17,19],[21,21],[12,21]],phase===1?P.cream:P.olive);
    panel(c,0,9,17,12,P.dark);rect(c,0,10,14,10,P.ink);
    rect(c,2,11,12,.5,P.steel);rect(c,2,19,12,.5,P.steel);
    rect(c,1,13,13,4,P.copper);rect(c,2,14,9,2,P.amber);
    rect(c,3,14.5,7,1,P.light);rect(c,12,14,2,2,P.steel);
  }else{
    poly(c,[[0,9],[10,7],[21,10],[18,14],[4,14]],P.ink);
    poly(c,[[1,9.5],[10,8],[19,10.5],[16,12.5],[4,12.5]],phase===1?P.cream:P.steel);
    poly(c,[[3,18],[12,16],[20,17],[16,21],[1,20]],P.ink);
    poly(c,[[4,18.5],[12,17],[18,17.5],[15,20],[2,19.5]],phase===1?P.cream:P.olive);
    panel(c,0,12,17,6,P.dark);panel(c,1,12,13,6,P.cream);
    rect(c,4,14.5,9,.5,P.dark);rect(c,2,13,1,1,P.copper);
  }
  for(const [x,y]of [[18,11],[28,9],[49,9]]){rect(c,x,y,1,1,P.ink);rect(c,x,y,.5,.5,P.amber);}
  if(phase>1){for(const [x,y]of [[17,9],[26,14],[46,17]]){rect(c,x,y,3,.5,P.ink);rect(c,x+1,y+.5,.5,1.5,P.ink);}}
  if(phase===3){poly(c,[[25,3.5],[28,4],[30,6],[27,7],[24,6]],P.dark);rect(c,27,5,1,1,P.copper);rect(c,47,2,2,3,P.ink);}
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
