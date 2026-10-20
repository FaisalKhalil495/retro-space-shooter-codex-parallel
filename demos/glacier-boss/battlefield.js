import { detailCanvas } from '../../js/detail.js?v=0.29.0';
import { GROUND_SPEED } from '../../js/terrain.js?v=0.29.0';

// The owner's finished photograph is displayed intact, including its smoke.
// Moving baked smoke independently would also distort the wrecks/cliff behind
// it. No generated replacement, artificial plumes, flashes or aircraft.
const W=208, H=119, Y=11, FLOOR=130, TILE=416;
const artwork=new Image(),snowfield=new Image();
function ready(image){return new Promise((resolve,reject)=>{
  image.onload=resolve;image.onerror=()=>reject(new Error('Icy battlefield could not load'));
});}
export const battleReady=Promise.all([ready(artwork),ready(snowfield)]);
artwork.src=globalThis.__battleEmbeddedArt||new URL('assets/icy-battlefield.jpg?battle=3',document.baseURI).href;
snowfield.src=globalThis.__battleEmbeddedGround||new URL('assets/icy-snowfield.jpg?battle=3',document.baseURI).href;
function paint(w,h,fn){const {canvas,ctx}=detailCanvas(w,h);fn(ctx);return canvas;}
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
  const snow=paint(TILE,14,c=>{
    c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
    // Use the clean snowfield's bottom strip at its original aspect ratio.
    const sh=14*snowfield.naturalWidth/TILE;
    c.drawImage(snowfield,0,snowfield.naturalHeight-sh,snowfield.naturalWidth,sh,0,0,TILE,14);
  });
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
