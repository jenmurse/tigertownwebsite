document.addEventListener('DOMContentLoaded', () => {

// ── FONT ──
// To swap fonts: change the family name in both the URL and font-family below.
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Funnel+Display:wght@400;700;800&display=swap';
document.head.appendChild(fontLink);

// ── CURSOR ──
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
  addStroke(e.clientX, e.clientY);
});

// ── CANVAS PAINT ──
const canvas = document.getElementById('paint-canvas');
const ctx    = canvas.getContext('2d');
const ACCENT = [174, 255, 208]; // matches --accent: #aeffd0
const strokes = [];
let lastX = null, lastY = null;

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function addStroke(x, y) {
  if (lastX !== null) {
    const dist  = Math.hypot(x - lastX, y - lastY);
    const steps = Math.max(1, Math.floor(dist / 6));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      strokes.push({
        x: lastX + (x - lastX) * t,
        y: lastY + (y - lastY) * t,
        r: 26 * (0.6 + Math.random() * 0.4),
        life: 90, maxLife: 90
      });
    }
  }
  lastX = x; lastY = y;
}

document.addEventListener('mouseleave', () => { lastX = null; lastY = null; });

(function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = strokes.length - 1; i >= 0; i--) {
    const s = strokes[i];
    s.life--;
    if (s.life <= 0) { strokes.splice(i, 1); continue; }
    const a = (s.life / s.maxLife) * 0.16;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},${a})`;
    ctx.fill();
  }
  requestAnimationFrame(draw);
})();

// ── FAVICON ──
const link = document.createElement('link');
link.rel = 'icon';
link.type = 'image/svg+xml';
link.href = 'favicon.svg';
document.head.appendChild(link);

// ── LOGO ──
// Fetches SVG and inlines it so JS can manipulate the pupils for eye tracking.
const MAX_TRAVEL_RIGHT = 4;
const MAX_TRAVEL_LEFT  = 5;

function initEyeTracking(svgEl) {
  const svgW = 103.27;
  const svgH = 101.08;

  document.addEventListener('mousemove', (e) => {
    const rect = svgEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const scaleX = svgW / rect.width;
    const dx = (e.clientX - cx) * scaleX;
    const dist = Math.abs(dx) || 1;
    const maxTravel = dx > 0 ? MAX_TRAVEL_RIGHT : MAX_TRAVEL_LEFT;
    const clamp = Math.min(dist, maxTravel * 10) / (maxTravel * 10);
    const tx = (dx / dist) * clamp * maxTravel;

    svgEl.querySelectorAll('#pupil-left, #pupil-right').forEach(p => {
      p.setAttribute('transform', `translate(${tx}, 0)`);
    });
  });
}

fetch('tiger-town-animated-mark.svg')
  .then(r => r.text())
  .then(svgText => {
    document.querySelectorAll('.logo, .nav .logo').forEach(container => {
      // Remove existing img if present
      const existing = container.querySelector('img');
      if (existing) existing.remove();

      const wrapper = document.createElement('div');
      wrapper.innerHTML = svgText;
      const svgEl = wrapper.firstElementChild;
      svgEl.style.height = '56px';
      svgEl.style.width = 'auto';
      svgEl.style.display = 'block';
      container.appendChild(svgEl);

      initEyeTracking(svgEl);
    });
  });

// ── PROJECTS ──
// Single source of truth for all project links.
// To add, remove, or rename: edit PROJECTS only.
const PROJECTS = {
  technical: [
    { label: 'Bear Car',          href: 'bear-car.html' },
    { label: 'Boombox Suitcases', href: 'boombox-suitcases.html' },
    { label: 'Coffee Grinder',    href: 'coffee-grinder.html' },
    { label: 'Disco Dance Floor', href: 'disco-dancefloor.html' },
    { label: 'Photo Booth',       href: 'photo-booth.html', wip: true },
  ],
  nonTechnical: [
    { label: 'Alternative Baking',    href: 'alt-baking.html' },
    { label: 'Coffee Roasting',       href: 'coffee-roasting.html' },
    { label: 'Vegan Ice Cream',       href: 'vegan-ice-cream.html' },
    { label: 'Wedding Save the Date', href: 'wedding-save-the-date.html' },
  ],
  findUs: [
    { label: 'About Us',  href: 'about.html' },
    { label: 'Jen',       href: 'https://jenmurse.com',  external: true },
    { label: 'Garth',     href: 'https://garth.app',     external: true },
  ],
};

// ── BOTTOM NAV (interior pages) ──
const navEl = document.querySelector('.bottom-nav');
if (navEl) {
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  function renderNavCol(label, items) {
    const lis = items.map(p => {
      const isCurrent = p.href === currentFile;
      const wip = p.wip ? ' <span class="wip-tag">WIP</span>' : '';
      const external = p.external ? ' target="_blank" rel="noopener"' : '';
      return `<li><a href="${p.href}"${external}${isCurrent ? ' class="current"' : ''}>${p.label}</a>${wip}</li>`;
    }).join('\n          ');
    return `<div>
        <div class="bottom-nav-label">${label}</div>
        <ul class="bottom-nav-list">
          ${lis}
        </ul>
      </div>`;
  }
  navEl.innerHTML =
    renderNavCol('Technical', PROJECTS.technical) +
    renderNavCol('Non-technical', PROJECTS.nonTechnical) +
    renderNavCol('Find Us', PROJECTS.findUs);
}

// ── HOMEPAGE LINK GRID ──
const gridEl = document.querySelector('.link-grid');
if (gridEl) {
  function renderGridSection(label, items, delay) {
    const lis = items.map(p => {
      const wip = p.wip ? `\n            <span class="wip-tag">WIP</span>` : '';
      const external = p.external ? ' target="_blank" rel="noopener"' : '';
      return `<li><a href="${p.href}"${external}>${p.label}</a>${wip}</li>`;
    }).join('\n          ');
    return `<div class="link-section" style="animation-delay:${delay}">
        <div class="section-label">${label}</div>
        <ul class="link-list">
          ${lis}
        </ul>
      </div>`;
  }
  gridEl.innerHTML =
    renderGridSection('Technical',     PROJECTS.technical,    '0.28s') +
    renderGridSection('Non-technical', PROJECTS.nonTechnical, '0.33s') +
    renderGridSection('Find Us',       PROJECTS.findUs,       '0.38s');
}

// ── MODAL SHELL ──
if (!document.getElementById('modal')) {
  const div = document.createElement('div');
  div.innerHTML = `<div class="modal-overlay" id="modal">
    <div class="modal-img-wrap">
      <img class="modal-img" id="modal-img" src="" alt="">
    </div>
    <button class="modal-close" id="modal-close" aria-label="Close">
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
        <line x1="4" y1="4" x2="16" y2="16"/>
        <line x1="16" y1="4" x2="4" y2="16"/>
      </svg>
    </button>
    <button class="modal-prev hidden" id="modal-prev" aria-label="Previous">
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><polyline points="13,3 7,10 13,17"/></svg>
    </button>
    <button class="modal-next" id="modal-next" aria-label="Next">
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><polyline points="7,3 13,10 7,17"/></svg>
    </button>
  </div>`;
  document.body.appendChild(div.firstElementChild);
}

}); // end DOMContentLoaded
