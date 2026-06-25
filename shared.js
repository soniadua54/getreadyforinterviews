function buildTopNav(active) {
  const pages = [
    { id: 'dsa', label: '⌨ DSA & Coding', href: 'index.html' },
    { id: 'platform', label: '⚙ Platform Round', href: 'platform.html' },
    { id: 'sysdesign', label: '🏗 System Design', href: 'sysdesign.html' }
  ];
  const nav = document.getElementById('topnav');
  nav.innerHTML = `
    <div class="nav-brand">Agoda Prep<span>.</span></div>
    <div class="nav-links">
      ${pages.map(p => `<a href="${p.href}" class="nav-link${p.id === active ? ' active' : ''}">${p.label}</a>`).join('')}
    </div>
    <div class="nav-right">
      <div class="countdown-pill" id="countdown-pill">Loading...</div>
    </div>
  `;
  updateCountdownPill();
  setInterval(updateCountdownPill, 60000);
}

function updateCountdownPill() {
  const target = new Date('2026-07-09T09:00:00');
  const diff = target - new Date();
  const el = document.getElementById('countdown-pill');
  if (!el) return;
  if (diff <= 0) { el.textContent = '🎯 Interview day!'; return; }
  const days = Math.floor(diff / 864e5);
  const hrs = Math.floor((diff % 864e5) / 36e5);
  el.textContent = `${days}d ${hrs}h to Agoda`;
}

function toggleSec(hd) {
  const body = hd.nextElementSibling;
  const chev = hd.querySelector('.sec-chevron');
  body.classList.toggle('open');
  chev.classList.toggle('open');
}

function toggleCheck(id, storageKey) {
  const store = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const idx = store.indexOf(id);
  if (idx === -1) store.push(id); else store.splice(idx, 1);
  localStorage.setItem(storageKey, JSON.stringify(store));
  const chk = document.getElementById('chk-' + id);
  const txt = document.getElementById('txt-' + id);
  const isDone = idx === -1;
  if (chk) chk.classList.toggle('done', isDone);
  if (txt) txt.classList.toggle('done', isDone);
  return store;
}

function loadChecks(storageKey) {
  return new Set(JSON.parse(localStorage.getItem(storageKey) || '[]'));
}
