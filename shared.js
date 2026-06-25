/* shared.js — included in every page */

const NAV_PAGES = [
  {id:'home',      label:'🏠 Home',           href:'index.html'},
  {id:'java',      label:'☕ Java',            href:'java.html'},
  {id:'spring',    label:'🍃 Spring Boot',     href:'spring.html'},
  {id:'sql',       label:'🗄️ SQL',             href:'sql.html'},
  {id:'node',      label:'🟢 Node.js',         href:'node.html'},
  {id:'go',        label:'🔵 Go',              href:'go.html'},
  {id:'python',    label:'🐍 Python',          href:'python.html'},
  {id:'angular',   label:'🔺 Angular',         href:'angular.html'},
  {id:'mongo',     label:'🍃 MongoDB',         href:'mongodb.html'},
  {id:'docker',    label:'🐳 Docker',          href:'docker.html'},
  {id:'k8s',       label:'☸ Kubernetes',      href:'kubernetes.html'},
  {id:'cicd',      label:'🔄 CI/CD',           href:'cicd.html'},
  {id:'auth',      label:'🔐 Auth',            href:'auth.html'},
  {id:'redis',     label:'🔴 Redis',           href:'redis.html'},
  {id:'kafka',     label:'📨 Kafka',           href:'kafka.html'},
  {id:'behavioral',label:'🎙️ Behavioral',      href:'behavioral.html'},
  {id:'plat',      label:'⚙ Platform',        href:'platform.html'},
  {id:'sys',       label:'🏗 System Design',  href:'sysdesign.html'},
  {id:'dsa',       label:'⌨ DSA',             href:'dsa.html'},
];

function buildNav(active){
  const el = document.getElementById('topnav');
  if(!el) return;
  el.innerHTML = `
    <div class="nav-brand">Prep<span>Kit</span></div>
    <div class="nav-links">
      ${NAV_PAGES.map(p=>`<a href="${p.href}" class="nav-link${p.id===active?' active':''}">${p.label}</a>`).join('')}
    </div>
    <div class="nav-cd" id="cd">...</div>
  `;
  updateCd(); setInterval(updateCd, 60000);
}

function updateCd(){
  const el=document.getElementById('cd'); if(!el)return;
  const diff=new Date('2026-07-09T09:00:00')-new Date();
  if(diff<=0){el.textContent='🎯 Today!';return;}
  const d=Math.floor(diff/864e5),h=Math.floor((diff%864e5)/36e5);
  el.textContent=`${d}d ${h}h`;
}

function toggleSec(hd){
  const body=hd.nextElementSibling;
  const chev=hd.querySelector('.chev');
  body.classList.toggle('open');
  if(chev)chev.classList.toggle('open');
}

function switchTab(groupId,tab){
  document.querySelectorAll(`[data-group="${groupId}"].tab`).forEach(t=>t.classList.remove('active'));
  document.querySelectorAll(`[data-group="${groupId}"].tab-panel`).forEach(p=>p.classList.remove('active'));
  const t=document.getElementById(`tab-${groupId}-${tab}`);
  const p=document.getElementById(`panel-${groupId}-${tab}`);
  if(t)t.classList.add('active');
  if(p)p.classList.add('active');
}

let _activeLevel='all';
function setLevel(level,btn){
  _activeLevel=level;
  document.querySelectorAll('.level-pill').forEach(b=>b.classList.remove('selected'));
  if(btn)btn.classList.add('selected');
  // Support both .section[data-level] and .pattern-header[data-level]
  document.querySelectorAll('.section[data-level],.pattern-header[data-level]').forEach(s=>{
    if(level==='all'||s.dataset.level===level) s.classList.remove('hidden');
    else s.classList.add('hidden');
  });
}

function initChecks(key,total,statId,pctId,fillId){
  const done=new Set(JSON.parse(localStorage.getItem(key)||'[]'));
  done.forEach(id=>{
    const chk=document.getElementById('chk-'+id);
    const txt=document.getElementById('txt-'+id);
    if(chk){chk.classList.add('done');if(txt)txt.classList.add('done');}
  });
  _updateProg(done,total,statId,pctId,fillId);
  return done;
}

function toggleCheck(id,done,key,total,statId,pctId,fillId){
  if(done.has(id))done.delete(id);else done.add(id);
  localStorage.setItem(key,JSON.stringify([...done]));
  const chk=document.getElementById('chk-'+id);
  const txt=document.getElementById('txt-'+id);
  if(chk)chk.classList.toggle('done',done.has(id));
  if(txt)txt.classList.toggle('done',done.has(id));
  _updateProg(done,total,statId,pctId,fillId);
}

function _updateProg(done,total,statId,pctId,fillId){
  const n=done.size;
  if(statId){const el=document.getElementById(statId);if(el)el.textContent=n;}
  if(pctId){const el=document.getElementById(pctId);if(el)el.textContent=`${n} / ${total}`;}
  if(fillId){const el=document.getElementById(fillId);if(el)el.style.width=total?Math.round(n/total*100)+'%':'0%';}
}
