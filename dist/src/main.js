import { createStage } from './stage.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)');
let paused = reduce.matches;
document.documentElement.classList.toggle('js-motion', !paused);
const stages = [...document.querySelectorAll('[data-scene]')].map(canvas => createStage(canvas));
const projects = [
 {title:'Lanka Agri-Direct',type:'FULL-STACK / WEB & MOBILE',stack:'Spring Boot · React · React Native · MongoDB · Docker',description:'A direct-to-consumer digital marketplace connecting Sri Lankan agricultural producers with consumers. The platform supports produce distribution and order management, helping reduce intermediary costs.',link:'https://github.com/dragon-udfly/LankaAgriDirect',label:'View repository',bg:'radial-gradient(ellipse at 50% 80%, #39573c, #11291f 75%)',art:'<div class="mini-content"><span class="mini-brand">LANKA AGRI-DIRECT</span><h4>Closer to the grower.<br>Better for everyone.</h4><div class="mini-tags"><span>LOCAL PRODUCE</span><span>DIRECT CONNECTIONS</span><span>SRI LANKA</span></div></div>'},
 {title:'University Gateway',type:'BACKEND / REST API',stack:'Node.js · Express.js · Vercel',description:'Server-side infrastructure developed for campus access and gateway operations at the University of Vavuniya, configured for automated deployment on Vercel. My group also developed a Security Gate Pass Management System.',bg:'radial-gradient(ellipse at 50% 80%, #314655, #17212a 80%)',art:'<div class="code-window"><b>GET</b> /api/gateway<br><span class="green">200</span> OK<br><br>{<br>&nbsp; <b>"campus"</b>: "Vavuniya",<br>&nbsp; <b>"access"</b>: "connected"<br>}</div>'},
 {title:'Autonomous Auction Agents',type:'MULTI-AGENT SYSTEM',stack:'Java · JADE · FIPA communication protocols',description:'Cooperating and competing BuyerAgent and SellerAgent software agents negotiate smartphone transactions autonomously. The system uses iterative bidding, price thresholds, and budget constraints to reach an agreement.',link:'https://drive.google.com/file/d/1Td48CWaDOlmClI4yTJ7wwBk2HJylCyiR/view',label:'View execution log',bg:'radial-gradient(ellipse at 50% 80%, #533343, #241821 80%)',art:'<div class="diagram"><span>BUYER<br><br>Propose</span><i>⇄</i><span>JADE<br><br>Negotiate</span><i>⇄</i><span>SELLER<br><br>Respond</span></div>'},
 {title:'Parallel Computing Benchmarks',type:'HIGH-PERFORMANCE COMPUTING',stack:'C/C++ · MPI · OpenMP · CUDA',description:'Comparative performance evaluations across distributed memory, shared memory, and GPU execution. The work explores execution timing, algorithmic speedup, and the tradeoffs between MPI, OpenMP, and CUDA. The cover is a conceptual illustration, not measured benchmark data.',bg:'radial-gradient(ellipse at 50% 80%, #54472c, #241f16 80%)',art:'<div class="bar-chart"><div style="--h:60%"><span>MPI</span></div><div style="--h:80%"><span>OPENMP</span></div><div style="--h:100%"><span>CUDA</span></div></div>'},
 {title:'cashManage',type:'PERSONAL FINANCE APPLICATION',stack:'Java / JavaScript · Git',description:'A personal finance and cash tracking application, maintained on GitHub. An exploration of making everyday money management clearer through a focused digital tool. The cover is an illustrative interface concept.',bg:'radial-gradient(ellipse at 50% 80%, #344d5c, #17232c 80%)',art:'<div class="ledger"><h4>cashManage / OVERVIEW</h4><strong>Make every<br>entry count.</strong><p>INCOME &nbsp; + &nbsp; EXPENSES &nbsp; → &nbsp; CLARITY</p></div>'}
];
const grid = document.querySelector('.project-grid');
projects.forEach((p,i) => {
 const button = document.createElement('button'); button.className='project-card reveal'; button.style.setProperty('--art-bg',p.bg);
 button.innerHTML=`<div class="project-art" aria-hidden="true"><span class="project-number">0${i+1} / PROJECT STUDY</span><div class="project-visual"><div class="mini-bar"><i></i><i></i><i></i></div>${p.art}</div></div><div class="project-caption"><div><h3>${p.title}</h3><p>${p.stack}</p></div><span>${p.type}</span></div>`;
 button.setAttribute('aria-label',`Read about ${p.title}`); button.addEventListener('click',()=>openProject(p)); grid.append(button);
});
const dialog=document.querySelector('.project-dialog');
function openProject(p){
 document.querySelector('.dialog-content').innerHTML=`<span class="eyebrow accent">${p.type}</span><h2 id="dialog-title">${p.title}</h2><p class="dialog-tech">${p.stack}</p><p>${p.description}</p><a href="${p.link || 'https://github.com/vishnu-tharan'}" target="_blank" rel="noopener noreferrer">${p.label || 'Explore my GitHub'} ↗</a>`;
 dialog.showModal();
}
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});

const years = [
 {year:2021,label:'THE EARLY CHAPTERS',title:'Before the university chapter.',body:'My documented journey here begins in 2023. Explore the later years for education, projects, and community milestones.'},
 {year:2022,label:'ROOM FOR THE STORY',title:'Every journey has a beginning.',body:'This chapter is intentionally open. Continue to 2023 to explore my time at the University of Vavuniya.'},
 {year:2023,label:'A NEW FOUNDATION',title:'An undergraduate. A builder.',body:'Began my B.Sc. (Hons) in Information Technology at the Faculty of Applied Science, University of Vavuniya.'},
 {year:2024,label:'BEYOND THE CLASSROOM',title:'Challenge. Community. Perspective.',body:'Competed in IEEEXtreme 18.0 with TheChiefs. Joined Vanni Vogue Camera Club and attended AIESEC Trailblazers ’24 at the University of Peradeniya.'},
 {year:2025,label:'STEPPING FORWARD',title:'Learning to bring people together.',body:'Served as an Organizing Committee Member for Marketing at NORX 2025, through AIESEC in Sri Lanka.'},
 {year:2026,label:'THE CHAPTER IN PROGRESS',title:'Still learning. Still building.',body:'Continuing my IT degree and exploring full-stack development, distributed systems, and autonomous agents. The next chapter is open.'}
];
const rail=document.querySelector('.year-rail');const story=document.querySelector('.year-story');let active=-1;let targetU=5;let locked=false;
years.forEach((y,i)=>{const b=document.createElement('button');b.className='year-button';b.textContent=y.year;b.setAttribute('aria-pressed','false');b.setAttribute('aria-label',`Explore ${y.year}`);b.addEventListener('click',()=>{locked=true;selectYear(i);});b.addEventListener('focus',()=>selectYear(i));b.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight'||e.key==='ArrowDown')n=(i+1)%6;if(e.key==='ArrowLeft'||e.key==='ArrowUp')n=(i+5)%6;if(e.key==='Home')n=0;if(e.key==='End')n=5;if(n!==undefined){e.preventDefault();rail.children[n].focus();}});rail.append(b);});
function selectYear(u){targetU=Math.max(0,Math.min(5,u));document.querySelector('.clock-hand').style.transform=`rotate(${-56.75+targetU*22.7}deg)`;const i=Math.round(targetU);if(i===active)return;active=i;[...rail.children].forEach((b,k)=>b.setAttribute('aria-pressed',String(k===i)));const y=years[i];story.innerHTML=`<span class="eyebrow">${y.year} / ${y.label}</span><h3>${y.title}</h3><p>${y.body}</p>`;document.querySelector('.clock-number').textContent=String(y.year).slice(-2);}
export function timeAt(point,centres){let best=Infinity,out=0;for(let i=0;i<centres.length-1;i++){const a=centres[i],b=centres[i+1],dx=b.x-a.x,dy=b.y-a.y;const u=Math.max(0,Math.min(1,((point.x-a.x)*dx+(point.y-a.y)*dy)/(dx*dx+dy*dy||1)));const d=(point.x-a.x-u*dx)**2+(point.y-a.y-u*dy)**2;if(d<best){best=d;out=i+u;}}return out;}
document.querySelector('.time-machine').addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||locked)return;const centres=[...rail.children].map(b=>{const r=b.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2};});selectYear(timeAt({x:e.clientX,y:e.clientY},centres));});
document.querySelector('.time-machine').addEventListener('pointerleave',()=>{locked=false;});selectYear(5);
window.__chrono={get targetU(){return targetU},set targetU(u){selectYear(u)}};

const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target);}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
const visible=new Set();const sceneObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{const s=stages.find(s=>s.canvas===e.target);if(e.isIntersecting)visible.add(s);else visible.delete(s);});schedule();},{threshold:0});stages.forEach(s=>sceneObserver.observe(s.canvas));
let frame=0;let last=0;let time=0;
function schedule(){if(!frame&&!document.hidden)frame=requestAnimationFrame(render);}
function render(now){frame=0;const dt=Math.min((now-last)/1000||0,.05);last=now;if(!paused)time+=dt;visible.forEach(s=>s.draw(time));if(!paused&&visible.size&&!document.hidden)schedule();}
const toggle=document.querySelector('.motion-toggle');
function syncMotion(){document.documentElement.classList.toggle('motion-paused',paused);toggle.setAttribute('aria-pressed',String(paused));toggle.setAttribute('aria-label',paused?'Resume animations':'Pause animations');toggle.textContent=paused?'▶':'Ⅱ';schedule();}
toggle.addEventListener('click',()=>{paused=!paused;syncMotion();});reduce.addEventListener('change',e=>{paused=e.matches;syncMotion();});document.addEventListener('visibilitychange',()=>{last=performance.now();if(document.hidden){cancelAnimationFrame(frame);frame=0;}else schedule();});window.addEventListener('resize',schedule);syncMotion();
document.querySelector('#copyright-year').textContent=new Date().getFullYear();
window.__shot=(name='vishnu')=>{const s=[...visible][0]||stages[0];s.draw(time);const a=document.createElement('a');a.download=`${name}.png`;a.href=s.canvas.toDataURL('image/png');a.click();};
const debugTime=new URLSearchParams(location.search).get('t');if(debugTime){time=debugTime==='end'?12:Math.max(0,Number(debugTime)||0);document.documentElement.classList.add('motion-paused');paused=true;schedule();}
