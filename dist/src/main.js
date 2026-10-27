import { renderProjectGallery, projectDetails, mountProjectScreenshots } from './projects.js?v=20261027-simplified-v1';
import { projects } from './project-data.js?v=20261027-simplified-v1';

// Keep decorative elements still; interactions remain available without continuous animation.
document.documentElement.classList.add('motion-paused');
renderProjectGallery(document.querySelector('.project-grid'), projects, openProject);
const dialog=document.querySelector('.project-dialog');
let projectFocus;
export function openProject(p, updateURL = true, source = null){
 projectFocus = source || document.activeElement;
 document.querySelector('.dialog-content').innerHTML = projectDetails(p);
 mountProjectScreenshots(dialog, p);
 if(!dialog.open)dialog.showModal();
 dialog.scrollTop = 0;
 document.body.classList.add('dialog-open');
 if(updateURL)history.replaceState(null,'',`${location.pathname}${location.search}#project=${projectSlug(p)}`);
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

const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target);}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
document.querySelector('#copyright-year').textContent=new Date().getFullYear();
