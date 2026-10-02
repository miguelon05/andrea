const more=document.getElementById('more');
more.textContent='Un poquito de amor';
let growth=1;
more.addEventListener('click',()=>{growth=Math.min(1.55,growth+.15);const art=document.getElementById('art');art.style.setProperty('--growth',growth);art.classList.add('growing');});
const actions=document.createElement('div');actions.className='actions';more.before(actions);actions.append(more);
const coffeeButton=document.createElement('button');coffeeButton.textContent='Tomar un café';coffeeButton.className='secondary';actions.append(coffeeButton);
const booking=document.getElementById('booking'),ticketDialog=document.getElementById('ticket-dialog');
const limaToday=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Lima',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const parts=limaToday.split('-').map(Number),today=new Date(parts[0],parts[1]-1,parts[2]);
let month=new Date(today.getFullYear(),today.getMonth(),1),selected=null;
const formatDate=date=>new Intl.DateTimeFormat('es-PE',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(date);
function allowed(date){return date>=today&&![2,3].includes(date.getDay())&&slots(date).length>0;}
function renderCalendar(){document.getElementById('month-label').textContent=new Intl.DateTimeFormat('es-PE',{month:'long',year:'numeric'}).format(month);document.getElementById('prev-month').disabled=month.getFullYear()===today.getFullYear()&&month.getMonth()===today.getMonth();const calendar=document.getElementById('calendar');calendar.replaceChildren();for(let i=0;i<(month.getDay()+6)%7;i++)calendar.append(document.createElement('span'));const total=new Date(month.getFullYear(),month.getMonth()+1,0).getDate();for(let day=1;day<=total;day++){const date=new Date(month.getFullYear(),month.getMonth(),day),b=document.createElement('button');b.type='button';b.textContent=day;b.disabled=!allowed(date);b.setAttribute('aria-label',formatDate(date)+(b.disabled?' — no disponible':date.getDay()===4?' — solo mañana':''));b.setAttribute('aria-pressed',String(selected?.getTime()===date.getTime()));if(selected?.getTime()===date.getTime())b.classList.add('selected');if(date.getTime()===today.getTime())b.classList.add('today');b.addEventListener('click',()=>choose(date));calendar.append(b);}}
function slots(date){const times=date.getDay()===4?['08:00','09:00','10:00','11:00']:['08:00','09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00','18:00','19:00'];if(date.getTime()!==today.getTime())return times;const now=new Intl.DateTimeFormat('en-GB',{timeZone:'America/Lima',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date());return times.filter(t=>t>now);}
function choose(date){if(!allowed(date))return;selected=date;document.getElementById('chosen-date').textContent=formatDate(date)+(date.getDay()===4?' · Solo en la mañana':'');const time=document.getElementById('time');time.replaceChildren();for(const slot of slots(date)){const option=document.createElement('option');option.value=slot;option.textContent=slot;time.append(option);}time.disabled=false;document.getElementById('make-ticket').disabled=false;renderCalendar();}
coffeeButton.addEventListener('click',()=>{renderCalendar();booking.showModal();});
document.getElementById('close-booking').addEventListener('click',()=>booking.close());
document.getElementById('prev-month').addEventListener('click',()=>{const prev=new Date(month.getFullYear(),month.getMonth()-1,1);if(prev>=new Date(today.getFullYear(),today.getMonth(),1)){month=prev;renderCalendar();}});
document.getElementById('next-month').addEventListener('click',()=>{month=new Date(month.getFullYear(),month.getMonth()+1,1);renderCalendar();});
document.getElementById('booking-form').addEventListener('submit',e=>{e.preventDefault();const time=document.getElementById('time').value;if(!selected||!allowed(selected)||!slots(selected).includes(time))return;document.getElementById('ticket-date').textContent=formatDate(selected);document.getElementById('ticket-time').textContent=time;booking.close();ticketDialog.showModal();});
document.getElementById('close-ticket').addEventListener('click',()=>ticketDialog.close());
document.getElementById('print-ticket').addEventListener('click',()=>window.print());
document.getElementById('change-date').addEventListener('click',()=>{ticketDialog.close();renderCalendar();booking.showModal();});
