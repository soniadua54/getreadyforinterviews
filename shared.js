/* shared.js — PrepKit Phase 1 */
'use strict';

// ── NAV DATA ────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    label: 'Languages',
    pages: [
      {id:'java',    emoji:'☕', label:'Java',       href:'java.html',     desc:'OOP · Collections · JVM · Concurrency'},
      {id:'spring',  emoji:'🍃', label:'Spring Boot',href:'spring.html',   desc:'REST · JPA · Security · Kafka'},
      {id:'node',    emoji:'🟢', label:'Node.js',    href:'node.html',     desc:'Event loop · Express · async/await'},
      {id:'go',      emoji:'🔵', label:'Go',         href:'go.html',       desc:'Goroutines · Channels · Context'},
      {id:'python',  emoji:'🐍', label:'Python',     href:'python.html',   desc:'asyncio · Generators · Decorators'},
      {id:'angular', emoji:'🔺', label:'Angular',    href:'angular.html',  desc:'Components · RxJS · Forms'},
    ]
  },
  {
    label: 'Databases',
    pages: [
      {id:'sql',   emoji:'🗄️', label:'SQL & RDBMS', href:'sql.html',     desc:'Locking · Isolation · N+1 · EXPLAIN'},
      {id:'mongo', emoji:'🍃', label:'MongoDB',      href:'mongodb.html', desc:'Schema · Aggregation · Indexing'},
      {id:'redis', emoji:'🔴', label:'Redis',        href:'redis.html',   desc:'Locks · Pub/sub · Streams'},
    ]
  },
  {
    label: 'Infrastructure',
    pages: [
      {id:'docker',emoji:'🐳', label:'Docker',       href:'docker.html',     desc:'Multi-stage · Compose · Security'},
      {id:'k8s',   emoji:'☸️', label:'Kubernetes',   href:'kubernetes.html', desc:'Pods · HPA · Observability'},
      {id:'cicd',  emoji:'🔄', label:'CI/CD',        href:'cicd.html',       desc:'GitHub Actions · ArgoCD · GitOps'},
      {id:'kafka', emoji:'📨', label:'Kafka',        href:'kafka.html',      desc:'Partitions · Consumer groups'},
      {id:'auth',  emoji:'🔐', label:'Auth & Security',href:'auth.html',    desc:'OAuth2 · JWT · RBAC'},
    ]
  },
  {
    label: 'Interview',
    pages: [
      {id:'dsa',      emoji:'⌨️', label:'DSA',           href:'dsa.html',        desc:'18 patterns · 170 problems'},
      {id:'sys',      emoji:'🏗️', label:'System Design',  href:'sysdesign.html',  desc:'Booking · Payments · Kafka'},
      {id:'plat',     emoji:'⚙️', label:'Platform Round', href:'platform.html',   desc:'LLD · Code review · Scenarios'},
      {id:'behavioral',emoji:'🎙️',label:'Behavioral',     href:'behavioral.html', desc:'STAR · Influence · Incidents'},
    ]
  },
];

// Flat list for search
const NAV_PAGES = NAV_GROUPS.flatMap(g => g.pages);

// ── THEME ────────────────────────────────────────────────────────
function getTheme(){ return localStorage.getItem('pk-theme') || 'dark'; }
function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('pk-theme', t);
  const btn = document.getElementById('theme-btn');
  if(btn) btn.textContent = t === 'dark' ? '☀️' : '🌙';
}
function toggleTheme(){
  applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
}
// Apply immediately to avoid flash
(function(){ applyTheme(getTheme()); })();

// ── BUILD NAV ─────────────────────────────────────────────────────
function buildNav(activeId) {
  const el = document.getElementById('topnav');
  if (!el) return;

  // Find active page label for crumb
  const activePage = NAV_PAGES.find(p => p.id === activeId);
  const isHome = activeId === 'home';

  // Crumb text in centre of nav
  const crumbHTML = isHome
    ? `<a href="index.html" class="nav-link active">🏠 Home</a>`
    : `
      <a href="index.html" class="nav-link" style="flex-shrink:0">🏠 Home</a>
      <span style="color:var(--text3);font-size:12px;flex-shrink:0">/</span>
      <div class="nav-active-crumb">
        ${activePage ? (activePage.emoji || '') + ' ' + activePage.label : activeId}
      </div>
    `;

  el.innerHTML = `
    <div class="nav-inner">
      <a href="index.html" class="nav-brand">
        <div class="nav-brand-icon">⚡</div>
        <div class="nav-brand-text">Prep<span>Kit</span></div>
      </a>

      <div class="nav-links">${crumbHTML}</div>

      <div class="nav-right">
        <button class="nav-menu-btn" id="nav-menu-btn" title="All topics">
          <span class="nav-menu-icon">☰</span> All Topics
        </button>
        <button class="nav-search-btn" id="search-open-btn" title="Search (/)">🔍</button>
        <button class="theme-btn" id="theme-btn" onclick="toggleTheme()" title="Toggle theme"></button>
        <button class="nav-hamburger" id="nav-hamburger" title="Menu">☰</button>
      </div>
    </div>
  `;

  // ── Build dropdown panel ─────────────────────────────────────────
  const dropdown = document.createElement('div');
  dropdown.className = 'nav-dropdown';
  dropdown.id = 'nav-dropdown';
  dropdown.innerHTML = `
    <div class="nav-dropdown-inner">
      ${NAV_GROUPS.map(g => `
        <div class="nav-group">
          <div class="nav-group-title">${g.label}</div>
          <div class="nav-group-links">
            ${g.pages.map(p => `
              <a href="${p.href}" class="nav-dropdown-link${p.id === activeId ? ' active' : ''}">
                <span class="nav-dropdown-link-icon">${p.emoji || '📄'}</span>
                <div class="nav-dropdown-link-text">
                  <div class="nav-dropdown-link-name">${p.label}</div>
                  ${p.desc ? `<div class="nav-dropdown-link-desc">${p.desc}</div>` : ''}
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
  document.body.insertAdjacentElement('afterbegin', dropdown);

  // Transparent overlay to close dropdown when clicking outside
  const ddOverlay = document.createElement('div');
  ddOverlay.className = 'nav-dropdown-overlay';
  ddOverlay.id = 'nav-dropdown-overlay';
  document.body.insertAdjacentElement('afterbegin', ddOverlay);

  // ── Build mobile full-screen drawer ──────────────────────────────
  const drawerGroups = NAV_GROUPS.map(g => `
    <div class="drawer-section-label">${g.label}</div>
    ${g.pages.map(p => `
      <a href="${p.href}" class="drawer-link${p.id === activeId ? ' active' : ''}">
        <span style="width:22px;text-align:center;font-size:16px">${p.emoji || ''}</span>
        <div>
          <div style="font-size:13px;font-weight:500">${p.label}</div>
          ${p.desc ? `<div style="font-size:11px;color:var(--text3);margin-top:1px">${p.desc}</div>` : ''}
        </div>
      </a>
    `).join('')}
  `).join('');

  const drawer = document.createElement('div');
  drawer.className = 'nav-drawer';
  drawer.id = 'nav-drawer';
  drawer.innerHTML = `
    <a href="index.html" class="drawer-link${isHome ? ' active' : ''}">
      <span style="width:22px;text-align:center;font-size:16px">🏠</span>
      <div><div style="font-size:13px;font-weight:500">Home</div></div>
    </a>
    ${drawerGroups}
  `;
  document.body.insertAdjacentElement('afterbegin', drawer);

  // ── Wire up interactions ─────────────────────────────────────────
  const menuBtn = document.getElementById('nav-menu-btn');
  const hamburger = document.getElementById('nav-hamburger');

  function openDropdown() {
    dropdown.classList.add('open');
    ddOverlay.classList.add('open');
    menuBtn.classList.add('open');
  }
  function closeDropdown() {
    dropdown.classList.remove('open');
    ddOverlay.classList.remove('open');
    if (menuBtn) menuBtn.classList.remove('open');
  }
  function toggleDropdown() {
    dropdown.classList.contains('open') ? closeDropdown() : openDropdown();
  }

  if (menuBtn) menuBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleDropdown(); });
  ddOverlay.addEventListener('click', closeDropdown);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeDropdown(); closeDrawer(); } });

  function closeDrawer() { drawer.classList.remove('open'); }
  function toggleDrawer() { drawer.classList.toggle('open'); closeDropdown(); }
  if (hamburger) hamburger.addEventListener('click', toggleDrawer);

  // Close dropdown if a link inside it is clicked (navigation)
  dropdown.querySelectorAll('.nav-dropdown-link').forEach(link => {
    link.addEventListener('click', closeDropdown);
  });

  // Apply theme icon
  applyTheme(getTheme());
  updateCd();
  setInterval(updateCd, 60000);

  // Init search
  initSearch();
}

// ── COUNTDOWN ────────────────────────────────────────────────────
function updateCd() {
  const el = document.getElementById('cd'); if (!el) return;
  const diff = new Date('2026-07-09T09:00:00') - new Date();
  if (diff <= 0) { el.textContent = '🎯 July 9'; return; }
  const d = Math.floor(diff / 864e5), h = Math.floor((diff % 864e5) / 36e5);
  el.textContent = `${d}d ${h}h`;
}

// ── SEARCH ───────────────────────────────────────────────────────
function initSearch() {
  // Build overlay
  const overlay = document.createElement('div');
  overlay.className = 'search-overlay';
  overlay.id = 'search-overlay';
  overlay.innerHTML = `
    <div class="search-box" role="dialog" aria-modal="true" aria-label="Search topics">
      <div class="search-input-wrap">
        <span class="search-icon">🔍</span>
        <input type="text" class="search-input" id="search-input" placeholder="Search topics, languages, patterns…" autocomplete="off" spellcheck="false">
        <span class="search-esc">ESC</span>
      </div>
      <div class="search-results" id="search-results"></div>
      <div class="search-hint">
        <span><kbd>↑↓</kbd> Navigate</span>
        <span><kbd>↵</kbd> Open</span>
        <span><kbd>ESC</kbd> Close</span>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const openBtn = document.getElementById('search-open-btn');
  const input   = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  let focusIdx  = -1;

  function openSearch() {
    overlay.classList.add('open');
    setTimeout(() => input.focus(), 50);
    renderResults('');
  }
  function closeSearch() {
    overlay.classList.remove('open');
    input.value = '';
    focusIdx = -1;
  }

  if (openBtn) openBtn.addEventListener('click', openSearch);

  // Keyboard shortcut /
  document.addEventListener('keydown', e => {
    if (e.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault(); openSearch();
    }
    if (e.key === 'Escape') closeSearch();
    if (overlay.classList.contains('open')) {
      const items = results.querySelectorAll('.search-result');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        focusIdx = Math.min(focusIdx + 1, items.length - 1);
        items.forEach((el, i) => el.classList.toggle('focused', i === focusIdx));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        focusIdx = Math.max(focusIdx - 1, 0);
        items.forEach((el, i) => el.classList.toggle('focused', i === focusIdx));
      }
      if (e.key === 'Enter' && focusIdx >= 0 && items[focusIdx]) {
        items[focusIdx].click();
      }
    }
  });
  overlay.addEventListener('click', e => { if (e.target === overlay) closeSearch(); });
  input.addEventListener('input', () => renderResults(input.value));

  function renderResults(q) {
    const query = q.trim().toLowerCase();
    const matched = query
      ? NAV_PAGES.filter(p =>
          p.label.toLowerCase().includes(query) ||
          (p.desc || '').toLowerCase().includes(query)
        )
      : NAV_PAGES;

    focusIdx = -1;
    if (!matched.length) {
      results.innerHTML = `<div class="search-empty">No results for "<strong>${q}</strong>"</div>`;
      return;
    }
    results.innerHTML = matched.map(p => `
      <a href="${p.href}" class="search-result">
        <span class="sr-icon">${p.emoji || '📄'}</span>
        <div>
          <div class="sr-name">${p.label}</div>
          ${p.desc ? `<div class="sr-desc">${p.desc}</div>` : ''}
        </div>
      </a>
    `).join('');
  }
}

// ── COLLAPSIBLE SECTIONS ─────────────────────────────────────────
function toggleSec(hd) {
  const body = hd.nextElementSibling;
  const chev = hd.querySelector('.chev');
  body.classList.toggle('open');
  if (chev) chev.classList.toggle('open');
}

// ── TABS ─────────────────────────────────────────────────────────
function switchTab(groupId, tab) {
  document.querySelectorAll(`[data-group="${groupId}"].tab`).forEach(t => t.classList.remove('active'));
  document.querySelectorAll(`[data-group="${groupId}"].tab-panel`).forEach(p => p.classList.remove('active'));
  const t = document.getElementById(`tab-${groupId}-${tab}`);
  const p = document.getElementById(`panel-${groupId}-${tab}`);
  if (t) t.classList.add('active');
  if (p) p.classList.add('active');
}

// ── LEVEL FILTER ─────────────────────────────────────────────────
let _activeLevel = 'all';
function setLevel(level, btn) {
  _activeLevel = level;
  document.querySelectorAll('.level-pill').forEach(b => b.classList.remove('selected'));
  if (btn) btn.classList.add('selected');
  document.querySelectorAll('.section[data-level],.pattern-header[data-level]').forEach(s => {
    if (level === 'all' || s.dataset.level === level) s.classList.remove('hidden');
    else s.classList.add('hidden');
  });
}

// ── PROGRESS / CHECKLIST ─────────────────────────────────────────
function initChecks(key, total, statId, pctId, fillId) {
  const done = new Set(JSON.parse(localStorage.getItem(key) || '[]'));
  done.forEach(id => {
    const chk = document.getElementById('chk-' + id);
    const txt = document.getElementById('txt-' + id);
    if (chk) { chk.classList.add('done'); if (txt) txt.classList.add('done'); }
  });
  _updateProg(done, total, statId, pctId, fillId);
  return done;
}

function toggleCheck(id, done, key, total, statId, pctId, fillId) {
  if (done.has(id)) done.delete(id); else done.add(id);
  localStorage.setItem(key, JSON.stringify([...done]));
  const chk = document.getElementById('chk-' + id);
  const txt = document.getElementById('txt-' + id);
  if (chk) chk.classList.toggle('done', done.has(id));
  if (txt) txt.classList.toggle('done', done.has(id));
  _updateProg(done, total, statId, pctId, fillId);
}

function _updateProg(done, total, statId, pctId, fillId) {
  const n = done.size;
  const el_s = document.getElementById(statId); if (el_s) el_s.textContent = n;
  const el_p = document.getElementById(pctId);  if (el_p) el_p.textContent = `${n} / ${total}`;
  const el_f = document.getElementById(fillId); if (el_f) el_f.style.width = total ? Math.round(n / total * 100) + '%' : '0%';
}
