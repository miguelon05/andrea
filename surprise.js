const chase=document.getElementById('chase');
const chaseStatus=document.getElementById('chase-status');
const escapeRounds=[2,3,4,5];
let round=0,escapes=0,lastEscape=0,finished=false;
function syncChase(){chase.dataset.round=String(round+1);chase.dataset.escapes=String(escapes);openButton.classList.toggle('catchable',escapes>=escapeRounds[round]);}
function centerChase(){openButton.style.left='50%';openButton.style.top='50%';}
function dodge(x,y){
  if(finished||escapes>=escapeRounds[round]||performance.now()-lastEscape<350)return false;
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
  for(let i=0;i<18;i++){const a=i/18*Math.PI*2;const image=document.createElement('img');image.src='assets/nescafe.png';image.alt='';image.className='coffee-spark';image.style.left=x+'px';image.style.top=y+'px';image.style.setProperty('--dx',(16*Math.pow(Math.sin(a),3)*9)+'px');image.style.setProperty('--dy',(-(13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a))*9)+'px');image.style.setProperty('--spin',(Math.random()*50-25)+'deg');document.body.append(image);if(reduced){image.classList.add('still');setTimeout(()=>image.remove(),800);}else image.addEventListener('animationend',()=>image.remove(),{once:true});}
}
openButton.addEventListener('click',e=>{
  if(finished)return;
  // Las activaciones por teclado siempre funcionan sin perseguir el cursor.
  if(e.detail!==0&&escapes<escapeRounds[round]){dodge(e.clientX,e.clientY);return;}
  const b=openButton.getBoundingClientRect();coffeeBurst(b.left+b.width/2,b.top+b.height/2);
  round++;
  if(round===escapeRounds.length){finished=true;openButton.disabled=true;chaseStatus.textContent='Esta sorpresa es para ti, mi papita.';setTimeout(revealGift,850);return;}
  escapes=0;lastEscape=performance.now();centerChase();syncChase();chaseStatus.textContent=['','Un cafecito de cariño.','Ya casi, mi papita.','Una última vez.'][round];
});
window.addEventListener('resize',centerChase);
syncChase();
