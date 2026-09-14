import { createStage } from './stage.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)');
let paused = reduce.matches;
document.documentElement.classList.toggle('js-motion', !paused);
const stages = [...document.querySelectorAll('[data-scene]')].map(canvas => createStage(canvas));
const projects = [
 {title:'Lanka Agri-Direct',type:'GROUP PROJECT / TEAM MEMBER',stack:'Spring Boot · React · React Native · MongoDB · Docker',description:'A group project developed by our team: a direct-to-consumer digital marketplace connecting Sri Lankan agricultural producers with consumers. I contributed as a team member. The platform supports produce distribution and order management, helping reduce intermediary costs.',link:'https://github.com/dragon-udfly/LankaAgriDirect',label:'View repository',bg:'radial-gradient(ellipse at 50% 80%, #39573c, #11291f 75%)',art:'<div class="mini-content"><span class="mini-brand">LANKA AGRI-DIRECT</span><h4>Closer to the grower.<br>Better for everyone.</h4><div class="mini-tags"><span>LOCAL PRODUCE</span><span>DIRECT CONNECTIONS</span><span>SRI LANKA</span></div></div>'},
 {title:'University Gateway',type:'CAMPUS ACCESS / WEB & MOBILE',stack:'React Native · Expo · Express · MongoDB',description:'A campus vehicle-access and equipment gate-pass application for the University of Vavuniya. A shared React Native and Expo interface supports web, Android, and iOS, with an Express and MongoDB API. Gate officers record arrivals and departures, faculty administrators approve equipment requests, and campus administrators manage access. Includes QR staff passes, searchable vehicle history, PDF reports, and audit history.',link:'https://github.com/vishnu-tharan/GATEWAY-UniversityOfVavuniya',label:'View repository',bg:'radial-gradient(ellipse at 50% 80%, #314655, #17212a 80%)',art:'<div class="code-window"><b>GET</b> /api/gateway<br><span class="green">200</span> OK<br><br>{<br>&nbsp; <b>"campus"</b>: "Vavuniya",<br>&nbsp; <b>"access"</b>: "connected"<br>}</div>'},
 {title:'cashManage',type:'PERSONAL FINANCE APPLICATION',stack:'React · JavaScript · Express · SQLite · PWA',description:'Private cashbooks for web and mobile, with encrypted offline storage and an Express/SQLite account server. Track income and expenses across currency-specific books, plan budgets and savings, record debts and repayments, and import bank statements with CSV preview. Includes PDF/CSV reports and shared cashbooks with owner, editor, and viewer roles. An installable PWA for recording and planning finances; it does not execute bank transactions or payments.',link:'https://github.com/vishnu-tharan/cashManage',label:'View repository',bg:'radial-gradient(ellipse at 50% 80%, #344d5c, #17232c 80%)',art:'<div class="ledger"><h4>cashManage / OVERVIEW</h4><strong>Make every<br>entry count.</strong><p>INCOME &nbsp; + &nbsp; EXPENSES &nbsp; → &nbsp; CLARITY</p></div>'},
 {title:'CEB-Management',type:'HOUSEHOLD ENERGY PLANNER',stack:'JavaScript · HTML · CSS · Express · SQLite',description:'An independent household electricity planner for Sri Lanka. Track appliances and meter readings, set energy targets and budgets, compare recorded bills with estimates, and explore appliance, solar, and EV charging scenarios. Includes saved weekly usage plans, forecasts, and CSV export. A self-hosted planning tool, not an official CEB service or a connected smart-meter controller.',link:'https://github.com/vishnu-tharan/CEB-Management',label:'View repository',bg:'radial-gradient(ellipse at 50% 80%, #54472c, #241f16 80%)',art:'<div class="ledger"><h4>CEB Energy Saver / HOUSEHOLD</h4><strong>Understand usage.<br>Plan your energy.</strong><p>APPLIANCES &nbsp; + &nbsp; METER READINGS &nbsp; → &nbsp; INSIGHT</p></div>'},
 {title:'CinemaStream',type:'MOVIE DISCOVERY / MOBILE APP',stack:'TypeScript · React Native · Expo · Firebase',description:'A movie-browsing application built with React Native, Expo, and TypeScript. Explore a local movie catalog, search by title or genre, and open individual movie detail screens through Expo Router. The project includes login, registration, and profile screens with Firebase integration, plus animated movie cards and a responsive two-column catalog.',link:'https://github.com/vishnu-tharan/CinemaStream',label:'View repository',bg:'radial-gradient(ellipse at 50% 80%, #533343, #241821 80%)',art:'<div class="ledger"><h4>CinemaStream / DISCOVER</h4><strong>Find your<br>next favorite.</strong><p>EXPLORE &nbsp; → &nbsp; SEARCH &nbsp; → &nbsp; DISCOVER</p></div>'}
];
const projectIdentities = {
 'Lanka Agri-Direct': {mark:'ag<span>↗</span>',name:'Lanka Agri-Direct',detail:'GROWERS &nbsp; / &nbsp; PEOPLE &nbsp; / &nbsp; CONNECTION',tone:'agri',word:'GROW'},
 'University Gateway': {mark:'G<span>↗</span>',name:'University Gateway',detail:'ONE CAMPUS. THREE GATES.',tone:'gateway',word:'ACCESS'},
 'cashManage': {mark:'c<span>M</span>',name:'cashManage',detail:'YOUR MONEY. A CLEARER PICTURE.',tone:'cash',word:'BALANCE'},
 'CEB-Management': {mark:'k<span>Wh</span>',name:'CEB Energy Saver',detail:'UNDERSTAND USAGE. PLAN YOUR ENERGY.',tone:'energy',word:'ENERGY'},
 'CinemaStream': {mark:'C<span>▶</span>',name:'CinemaStream',detail:'FIND YOUR NEXT FAVORITE.',tone:'cinema',word:'DISCOVER'}
};
const grid = document.querySelector('.project-grid');
projects.forEach((p,i) => {
 const button = document.createElement('button'); button.className='project-card reveal'; button.style.setProperty('--art-bg',p.bg);
 const identity=projectIdentities[p.title];
 button.innerHTML=`<div class="project-art identity-art ${identity.tone}" aria-hidden="true"><span class="project-number">0${i+1} / PROJECT STUDY</span><span class="identity-backdrop">${identity.word}</span><div class="project-identity"><div class="identity-mark">${identity.mark}</div><strong>${identity.name}</strong><span class="identity-detail">${identity.detail}</span></div></div><div class="project-caption"><div><h3>${p.title}</h3><p>${p.stack}</p></div><span>${p.type}</span></div>`;
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
