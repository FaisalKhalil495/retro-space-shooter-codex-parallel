import { detailCanvas, grit } from '../../js/detail.js?v=0.29.0';
import { GROUND_SPEED } from '../../js/terrain.js?v=0.29.0';

// The owner's finished photograph is displayed intact, including its smoke.
// Moving baked smoke independently would also distort the wrecks/cliff behind
// it. No generated replacement, artificial plumes, flashes or aircraft.
const W=208, H=119, Y=11, FLOOR=130, TILE=416;
const artwork=new Image();
function ready(image){return new Promise((resolve,reject)=>{
  image.onload=resolve;image.onerror=()=>reject(new Error('Icy battlefield could not load'));
});}
export const battleReady=ready(artwork);
artwork.src=globalThis.__battleEmbeddedArt||new URL('assets/icy-battlefield.jpg?battle=3',document.baseURI).href;
function paint(w,h,fn){const {canvas,ctx}=detailCanvas(w,h);fn(ctx);return canvas;}
// Original foreground art, wholly below the unchanged flat collision surface.
// Paint once: no combat randomness, new obstacles or per-frame geometry.
function shelf(c){
  const shape=(color,points)=>{
    c.fillStyle=color;c.beginPath();c.moveTo(...points[0]);
    for(const p of points.slice(1))c.lineTo(...p);c.closePath();c.fill();
  };
  c.fillStyle='#35556a';c.fillRect(0,0,TILE,14);
  c.fillStyle='#527c91';c.fillRect(0,3,TILE,4);
  c.fillStyle='#43687c';c.fillRect(0,9,TILE,1);
  // Broad compressed ice plates, alternating with exposed slate. End margins
  // share continuous strata so the scrolling tile has no vertical join.
  for(let x=4,i=0;x<TILE-20;i++){
    const w=12+Math.floor(grit(i,0,64)*14),tip=8+Math.floor(grit(i,1,64)*6);
    shape('#78a7bc',[[x,2],[x+w,2.5],[x+w-2,8],[x+w*.45,tip],[x+1,10]]);
    shape('#a9ceda',[[x,2],[x+w*.6,3],[x+w*.3,tip-1],[x+2,8]]);
    shape('#5b899f',[[x+w*.6,3],[x+w,2.5],[x+w-2,8],[x+w*.45,tip]]);
    shape('#c6e0e6',[[x+1,2],[x+3,2],[x+2,7],[x+1,9]]);
    c.strokeStyle='#31556d';c.lineWidth=.5;c.beginPath();
    c.moveTo(x+w*.6,4);c.lineTo(x+w*.4,6);c.lineTo(x+w*.5,8.5);c.lineTo(x+w*.3,11);c.stroke();
    x+=w+2+Math.floor(grit(i,2,64)*6);
  }
  // Snow-capped angular rocks embedded in the ledge, rather than floating
  // boulders that would imply new hazards in the player's flight space.
  for(const [x,y,w,h] of [[13,3,13,8],[49,7,19,7],[83,2.5,11,7],[121,5,18,9],
    [161,3,16,9],[201,7,21,7],[242,2.5,13,8],[281,6,19,8],[323,3,15,10],[367,6,20,8]]){
    shape('#2d424c',[[x,y+2],[x+w*.3,y],[x+w*.75,y+.5],[x+w,y+h*.65],[x+w-2,y+h],[x+2,y+h]]);
    shape('#61737a',[[x,y+2],[x+w*.3,y],[x+w*.65,y+1.5],[x+w*.55,y+h*.65],[x+2,y+h-1]]);
    shape('#829198',[[x,y+2],[x+w*.3,y],[x+w*.55,y+1],[x+w*.3,y+3.5]]);
    shape('#44565f',[[x+w*.65,y+1.5],[x+w*.75,y+.5],[x+w,y+h*.65],[x+w*.55,y+h*.65]]);
    shape('#e1e8e9',[[x,y+2],[x+w*.3,y],[x+w*.75,y+.5],[x+w*.8,y+2],[x+w*.4,y+1.5],[x+2,y+3]]);
    c.fillStyle='#abb8ba';c.fillRect(x+3,y+4,2,.5);
    c.fillStyle='#253c49';c.fillRect(x+w*.5,y+h-2,3,.5);
  }
  // Small mineral grains and ice inclusions, fixed on the half-pixel grid.
  for(let y=3;y<14;y+=.5)for(let x=0;x<TILE;x+=.5){
    const n=grit(x*2,y*2,95);
    if(n>.975){c.fillStyle='#a9c4cb';c.fillRect(x,y,.5,.5);}
    else if(n<.022){c.fillStyle='#334b5a';c.fillRect(x,y,.5,.5);}
  }
  // A level snow cap makes the actual safe floor unambiguous. Its overhang,
  // dark undercut and short icy teeth separate this shelf from the photo.
  for(let x=0;x<TILE;x+=2){
    const d=1.5+Math.floor(grit(x,0,83)*3)*.5;
    c.fillStyle='#d1e0e5';c.fillRect(x,0,2,d);
    c.fillStyle='#eaf0ef';c.fillRect(x,0,2,1);
    c.fillStyle='#304f62';c.fillRect(x,d,2,.5);
    if(grit(x,1,83)>.67)shape('#bedce4',[[x,d+.5],[x+1.5,d+.5],[x+.5,d+3.5]]);
  }
  // Thin cracks in the snow, safely inside the floor, with no warning colors.
  for(const x of [32,105,186,262,350,397]){
    c.fillStyle='#7696a6';c.fillRect(x,.5,4,.5);c.fillRect(x+3,1,2,.5);
  }
}
let cached;
function prepare(){
  if(cached)return cached;
  const imageHeight=W*artwork.naturalHeight/artwork.naturalWidth;
  const world=paint(W,H,c=>{
    c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
    // 1280x720 -> 208x117: no stretching or cropping of the finished picture.
    c.drawImage(artwork,0,0,W,imageHeight);
    // Extend the last snow row into the two-pixel gap above the native floor.
    c.drawImage(artwork,0,artwork.naturalHeight-1,artwork.naturalWidth,1,0,imageHeight,W,H-imageHeight);
  });
  const snow=paint(TILE,14,shelf);
  return cached={world,snow};
}
export class BattlefieldBackground{
  constructor(){
    this.t=0;this.loaded=false;
    battleReady.then(()=>{Object.assign(this,prepare());this.loaded=true;}).catch(()=>{});
  }
  update(dt){this.t+=dt;}
  draw(c,snap){
    c.save();c.beginPath();c.rect(0,Y,W,144-Y);c.clip();
    c.fillStyle='#cfdae6';c.fillRect(0,Y,W,144-Y);
    if(this.loaded){
      c.drawImage(this.world,0,Y);
      const x=-snap(((this.t*GROUND_SPEED)%TILE+TILE)%TILE);
      c.drawImage(this.snow,x,FLOOR);
      if(x+TILE<W)c.drawImage(this.snow,x+TILE,FLOOR);
    }
    c.restore();
  }
}
