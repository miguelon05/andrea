const chase=document.getElementById('chase');
const chaseStatus=document.getElementById('chase-status');
const escapeRounds=[2,3,4,5];
let round=0,escapes=0,lastEscape=0,finished=false,beating=false;
function syncChase(){chase.dataset.round=String(round+1);chase.dataset.escapes=String(escapes);openButton.classList.toggle('catchable',escapes>=escapeRounds[round]);}
function centerChase(){openButton.style.left='50%';openButton.style.top='50%';}
function dodge(x,y){
  if(finished||beating||escapes>=escapeRounds[round]||performance.now()-lastEscape<350)return false;
  const box=openButton.getBoundingClientRect(),pad=24;
  const minX=box.width/2+pad,maxX=Math.max(minX,innerWidth-minX);
  const minY=box.height/2+70,maxY=Math.max(minY,innerHeight-minY);
  let best={x:innerWidth/2,y:innerHeight/2,d:-1};
  for(let i=0;i<16;i++){const nx=minX+Math.random()*(maxX-minX),ny=minY+Math.random()*(maxY-minY),d=Math.hypot(nx-x,ny-y);if(d>best.d)best={x:nx,y:ny,d};}
  openButton.style.left=best.x+'px';openButton.style.top=best.y+'px';escapes++;lastEscape=performance.now();syncChase();
  chaseStatus.textContent=escapes===escapeRounds[round]?'Ahora sí, atrápame.':'';
  return true;
}
chase.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const b=openButton.getBoundingClientRect();if(e.clientX>b.left-45&&e.clientX<b.right+45&&e.clientY>b.top-45&&e.clientY<b.bottom+45)dodge(e.clientX,e.clientY);});
openButton.addEventListener('pointerdown',e=>{if(escapes<escapeRounds[round]){e.preventDefault();dodge(e.clientX,e.clientY);}});
function coffeeBurst(x,y){
  // Animación solicitada expresamente y activada por cada pulsación.
  openButton.animate([
    {transform:'translate(-50%,-50%) scale(1)',filter:'brightness(1)',offset:0},
    {transform:'translate(-50%,-50%) scale(1.24)',filter:'brightness(1.45)',offset:.18},
    {transform:'translate(-50%,-50%) scale(.93)',filter:'brightness(1)',offset:.35},
    {transform:'translate(-50%,-50%) scale(1.15)',filter:'brightness(1.25)',offset:.55},
    {transform:'translate(-50%,-50%) scale(1)',filter:'brightness(1)',offset:1}
  ],{duration:850,easing:'ease-in-out'});
  for(let ring=0;ring<2;ring++){
    const glow=document.createElement('span');glow.className='coffee-wave';glow.style.left=x+'px';glow.style.top=y+'px';document.body.append(glow);
    glow.animate([{transform:'translate(-50%,-50%) scale(.35)',opacity:.7},{transform:'translate(-50%,-50%) scale(3.5)',opacity:0}],{duration:1100,delay:ring*300,easing:'ease-out',fill:'both'}).onfinish=()=>glow.remove();
  }
  const count=innerWidth<600?48:66;
  for(let i=0;i<count;i++){
    const image=document.createElement('img');image.src='assets/nescafe.png';image.alt='';image.className='coffee-spark';
    const depth=Math.random(),size=18+depth*25;image.style.width=size+'px';image.style.height=(size*2.36)+'px';image.style.left=x+'px';image.style.top=y+'px';image.style.zIndex=String(30+Math.round(depth*10));document.body.append(image);
    const targetX=24+Math.random()*Math.max(1,innerWidth-48),drift=targetX-x,rise=130+Math.random()*Math.min(260,innerHeight*.4),fall=innerHeight-y+160,spin=(Math.random()-.5)*900,phase=Math.random()*Math.PI*2;
    const frames=Array.from({length:41},(_,n)=>{const t=n/40,spread=Math.min(1,t*2.3),sway=Math.sin(t*9+phase)*24*t;return {offset:t,transform:`translate(calc(-50% + ${drift*spread+sway}px),calc(-50% + ${-4*rise*t*(1-t)+fall*t*t}px)) rotate(${spin*t+Math.sin(t*12)*12}deg) scale(${.2+.8*Math.min(t*7,1)})`,opacity:t<.85?1:Math.max(0,(1-t)/.15)};});
    image.animate(frames,{duration:2600+Math.random()*1000,delay:Math.floor(i/(count/3))*230+Math.random()*120,easing:'linear',fill:'both'}).onfinish=()=>image.remove();
  }
}
openButton.addEventListener('click',e=>{
  if(finished||beating)return;
  // Las activaciones por teclado siempre funcionan sin perseguir el cursor.
  if(e.detail!==0&&escapes<escapeRounds[round]){dodge(e.clientX,e.clientY);return;}
  beating=true;const b=openButton.getBoundingClientRect();coffeeBurst(b.left+b.width/2,b.top+b.height/2);
  round++;
  if(round===escapeRounds.length){finished=true;openButton.disabled=true;chaseStatus.textContent='Esta sorpresa es para ti, mi papita.';setTimeout(revealGift,2700);return;}
  escapes=0;syncChase();chaseStatus.textContent=['','Un cafecito de cariño.','Ya casi, mi papita.','Una última vez.'][round];
  setTimeout(()=>{centerChase();lastEscape=performance.now();beating=false;},900);
});
window.addEventListener('resize',centerChase);
syncChase();

