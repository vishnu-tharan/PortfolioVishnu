import { createStage } from './stage.js?v=20261006-effects-v1';
import { renderProjectGallery, projectDetails } from './projects.js?v=20261006-effects-v1';
import { projects } from './project-data.js?v=20261006-effects-v1';
import { motionAllowed, viewTransition } from './transitions.js?v=20261006-effects-v1';

const reduce = matchMedia('(prefers-reduced-motion: reduce)');
let paused = reduce.matches;
document.documentElement.classList.toggle('js-motion', !paused);
const stages = [...document.querySelectorAll('[data-scene]')].map(canvas => createStage(canvas));
renderProjectGallery(document.querySelector('.project-grid'), projects, openProject);
const dialog=document.querySelector('.project-dialog');
let projectFocus;
export function openProject(p, updateURL = true, source = null){
 projectFocus = source || document.activeElement;
 const image = source?.closest('.project-card')?.querySelector('.project-preview img');
 const rect = image?.getBoundingClientRect();
 const shared = image?.complete && image.naturalWidth > 0 && rect.bottom > 0 && rect.top < innerHeight;
 let detailImage;
 const show = () => {
  document.querySelector('#app-dialog')?.close();
  document.querySelector('.dialog-content').innerHTML = projectDetails(p);
  if(!dialog.open)dialog.showModal();
  dialog.scrollTop = 0;
  document.body.classList.add('dialog-open');
  if(updateURL)history.replaceState(null,'',`${location.pathname}${location.search}#project=${projectSlug(p)}`);
  if (shared) {
   image.style.viewTransitionName = '';
   detailImage = dialog.querySelector('.project-detail-image img');
   if (detailImage) detailImage.style.viewTransitionName = 'project-image';
  }
  if ((!shared || !document.startViewTransition) && motionAllowed()) dialog.animate?.([{opacity:0,transform:'translateY(12px) scale(.985)'},{opacity:1,transform:'none'}],{duration:230,easing:'cubic-bezier(.2,.7,.2,1)'});
 };
 if (shared) viewTransition(show, {kind:'project',prepare:()=>{image.style.viewTransitionName='project-image';},cleanup:()=>{image.style.viewTransitionName='';if(detailImage)detailImage.style.viewTransitionName='';}});
 else show();
}
const projectSlug = p => p.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function openSharedProject(){
 if(!location.hash.startsWith('#project='))return;
 const p=projects.find(p=>projectSlug(p)===location.hash.slice(9));
 if(p)openProject(p,false);
}
window.addEventListener('hashchange',openSharedProject);
openSharedProject();
dialog.addEventListener('close',()=>{
 if(dialog.open)return;
 document.body.classList.remove('dialog-open');
 if(location.hash.startsWith('#project='))history.replaceState(null,'',`${location.pathname}${location.search}#work`);
 if (!document.querySelector('dialog[open]') && projectFocus?.isConnected && projectFocus.getClientRects().length) projectFocus.focus({preventScroll:true});
});
dialog.addEventListener('click',async event=>{
 const button=event.target.closest('[data-copy-project]');
 if(!button)return;
 const status=dialog.querySelector('.copy-status');
 try{
  await navigator.clipboard.writeText(location.href);
  if (!button.isConnected) return;
  button.textContent='✓ Link copied';button.classList.add('copy-confirmed');
  status.textContent='Project link copied. You can paste it to share this case study.';
  setTimeout(()=>{if(button.isConnected){button.textContent='Copy project link';button.classList.remove('copy-confirmed');}},2500);
 }
 catch{if(status.isConnected)status.textContent='Copy the link from the address bar to share this project.';}
});
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});

const years = [
 {year:2021,label:'SCHOOL & UNIVERSITY SELECTION',title:'Learning to lead.',body:'Studied for my A/Ls at J/Uduppiddy American Mission College and served as Head Prefect. Selected for the B.Sc. in Information Technology at the University of Vavuniya.',skills:['A/L studies','Head Prefect','B.Sc. IT selection']},
 {year:2023,label:'2023–2024 / YEAR 1',title:'IT foundations.',body:'University of Vavuniya — studied programming fundamentals, computer architecture, mathematics for computing, and an introduction to web technologies.',skills:['Programming with Java','Computer Systems','Web Development Basics']},
 {year:2024,label:'2024–2025 / YEAR 2',title:'Software & databases.',body:'University of Vavuniya — focused on object-oriented programming, database management systems, data structures, and frontend development with modern tools.',skills:['MySQL database systems','Data Structures & Algorithms','React & JavaScript']},
 {year:2025,label:'2024–2025 / APPLIED LEARNING',title:'Putting knowledge into practice.',body:'Applied my Year 2 software and database studies through a Mini LMS project, alongside academic coursework and student activities at the University of Vavuniya.',skills:['Mini LMS Project','Object-oriented programming','Frontend development']},
 {year:2026,label:'HONOURS PROGRAMME SELECTION',title:'The next academic chapter.',body:'Selected for the B.Sc. in Information Technology Honours degree programme at the University of Vavuniya. Continuing to develop my skills in software development and computing.',skills:['B.Sc. IT Honours','University of Vavuniya']}
];
const rail=document.querySelector('.year-rail');const story=document.querySelector('.year-story');let active=-1;let targetU=years.length-1;let handAngle=null;
years.forEach((y,i)=>{const b=document.createElement('button');b.className='year-button';b.textContent=y.year;b.setAttribute('aria-pressed','false');b.setAttribute('aria-label',`Explore ${y.year}`);b.addEventListener('click',()=>{selectYear(i);});b.addEventListener('focus',()=>selectYear(i));b.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight'||e.key==='ArrowDown')n=(i+1)%years.length;if(e.key==='ArrowLeft'||e.key==='ArrowUp')n=(i+years.length-1)%years.length;if(e.key==='Home')n=0;if(e.key==='End')n=years.length-1;if(n!==undefined){e.preventDefault();rail.children[n].focus();}});rail.append(b);});
// The hand points down at zero degrees; calculate its bearing from real layout positions.
export function yearHandAngle(origin, target){return Math.atan2(origin.x-target.x,target.y-origin.y)*180/Math.PI;}
function aimClockAtYear(){
 const selected=rail.children[Math.round(targetU)];
 if(!selected)return;
 const hub=document.querySelector('.clock-face b').getBoundingClientRect();
 const label=selected.getBoundingClientRect();
 let angle=yearHandAngle({x:hub.left+hub.width/2,y:hub.top+hub.height/2},{x:label.left+label.width/2,y:label.top+label.height/2});
 if(handAngle!==null)angle=handAngle+((angle-handAngle+540)%360+360)%360-180;
 handAngle=angle;
 document.querySelector('.clock-hand').style.transform=`rotate(${angle}deg)`;
}
function selectYear(u){targetU=Math.round(Math.max(0,Math.min(years.length-1,u)));aimClockAtYear();const i=Math.round(targetU);if(i===active)return;active=i;[...rail.children].forEach((b,k)=>b.setAttribute('aria-pressed',String(k===i)));const y=years[i];story.innerHTML=`<span class="eyebrow">${y.year} / ${y.label}</span><h3>${y.title}</h3><p>${y.body}</p><ul class="year-skills">${y.skills.map(skill=>`<li>${skill}</li>`).join('')}</ul>`;document.querySelector('.clock-number').textContent=String(y.year).slice(-2);}
export function timeAt(point,centres){let best=Infinity,out=0;for(let i=0;i<centres.length-1;i++){const a=centres[i],b=centres[i+1],dx=b.x-a.x,dy=b.y-a.y;const u=Math.max(0,Math.min(1,((point.x-a.x)*dx+(point.y-a.y)*dy)/(dx*dx+dy*dy||1)));const d=(point.x-a.x-u*dx)**2+(point.y-a.y-u*dy)**2;if(d<best){best=d;out=i+u;}}return out;}
rail.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const centres=[...rail.children].map(b=>{const r=b.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2};});selectYear(timeAt({x:e.clientX,y:e.clientY},centres));});
selectYear(years.length-1);
const clockLayout=new ResizeObserver(()=>requestAnimationFrame(aimClockAtYear));
clockLayout.observe(rail);clockLayout.observe(document.querySelector('.clock-face'));
window.addEventListener('resize',aimClockAtYear);
document.fonts.ready.then(aimClockAtYear);
window.__chrono={get targetU(){return targetU},set targetU(u){selectYear(u)}};

const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target);}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
const visible=new Set();const sceneObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{const s=stages.find(s=>s.canvas===e.target);if(e.isIntersecting)visible.add(s);else visible.delete(s);});schedule();},{threshold:0});stages.forEach(s=>sceneObserver.observe(s.canvas));
let frame=0;let last=0;let time=0;
function schedule(){if(!frame&&!document.hidden)frame=requestAnimationFrame(render);}
// A paused scene still repaints once when its palette changes.
document.addEventListener('portfolio:themechange',()=>{visible.forEach(s=>s.draw(time));schedule();});
function render(now){frame=0;const dt=Math.min((now-last)/1000||0,.05);last=now;if(!paused)time+=dt;visible.forEach(s=>s.draw(time));if(!paused&&visible.size&&!document.hidden)schedule();}
const toggle=document.querySelector('.motion-toggle');
function syncMotion(){document.documentElement.classList.toggle('motion-paused',paused);toggle.setAttribute('aria-pressed',String(paused));toggle.setAttribute('aria-label',paused?'Resume animations':'Pause animations');toggle.textContent=paused?'▶':'Ⅱ';schedule();}
toggle.addEventListener('click',()=>{paused=!paused;syncMotion();});reduce.addEventListener('change',e=>{paused=e.matches;syncMotion();});document.addEventListener('visibilitychange',()=>{last=performance.now();if(document.hidden){cancelAnimationFrame(frame);frame=0;}else schedule();});window.addEventListener('resize',schedule);syncMotion();
document.querySelector('#copyright-year').textContent=new Date().getFullYear();
window.__shot=(name='vishnu')=>{const s=[...visible][0]||stages[0];s.draw(time);const a=document.createElement('a');a.download=`${name}.png`;a.href=s.canvas.toDataURL('image/png');a.click();};
const debugTime=new URLSearchParams(location.search).get('t');if(debugTime){time=debugTime==='end'?12:Math.max(0,Number(debugTime)||0);document.documentElement.classList.add('motion-paused');paused=true;schedule();}
