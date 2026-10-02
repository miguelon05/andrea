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
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduced)openButton.animate([
    {transform:'translate(-50%,-50%) scale(1)',offset:0},
    {transform:'translate(-50%,-50%) scale(1.2)',offset:.16},
    {transform:'translate(-50%,-50%) scale(.96)',offset:.32},
    {transform:'translate(-50%,-50%) scale(1.14)',offset:.5},
    {transform:'translate(-50%,-50%) scale(1)',offset:1}
  ],{duration:650,easing:'ease-in-out'});
  for(let i=0;i<(reduced?6:42);i++){
    const image=document.createElement('img');image.src='assets/nescafe.png';image.alt='';image.className='coffee-spark';
    const size=16+Math.random()*19;image.style.width=size+'px';image.style.height=(size*2.36)+'px';image.style.left=x+'px';image.style.top=y+'px';document.body.append(image);
    const drift=(Math.random()-.5)*Math.min(innerWidth*1.3,850),rise=100+Math.random()*170,fall=innerHeight-y+150,spin=(Math.random()-.5)*700;
    if(reduced){image.style.transform=`translate(${(i-2.5)*25}px,55px)`;setTimeout(()=>image.remove(),650);continue;}
    const frames=Array.from({length:21},(_,n)=>{const t=n/20;return {offset:t,transform:`translate(calc(-50% + ${drift*t}px),calc(-50% + ${-4*rise*t*(1-t)+fall*t*t}px)) rotate(${spin*t}deg) scale(${.4+.6*Math.min(t*5,1)})`,opacity:t<.8?1:Math.max(0,(1-t)*5)};});
    image.animate(frames,{duration:2100+Math.random()*850,delay:(i<21?0:260)+Math.random()*90,easing:'linear',fill:'both'}).onfinish=()=>image.remove();
  }
}
openButton.addEventListener('click',e=>{
  if(finished||beating)return;
  // Las activaciones por teclado siempre funcionan sin perseguir el cursor.
  if(e.detail!==0&&escapes<escapeRounds[round]){dodge(e.clientX,e.clientY);return;}
  beating=true;const b=openButton.getBoundingClientRect();coffeeBurst(b.left+b.width/2,b.top+b.height/2);
  round++;
  if(round===escapeRounds.length){finished=true;openButton.disabled=true;chaseStatus.textContent='Esta sorpresa es para ti, mi papita.';setTimeout(revealGift,1800);return;}
  escapes=0;syncChase();chaseStatus.textContent=['','Un cafecito de cariño.','Ya casi, mi papita.','Una última vez.'][round];
  setTimeout(()=>{centerChase();lastEscape=performance.now();beating=false;},650);
});
window.addEventListener('resize',centerChase);
syncChase();
