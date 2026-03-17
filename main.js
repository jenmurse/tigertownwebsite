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
const strokes = [];
let lastX = null, lastY = null;

// ── TRAIL COLORS (speed-based) ──
// Slow → fast. Add or remove rows to change the palette.
// To switch to HSL sweep instead, see the comment block below.
const TRAIL_COLORS = [
  [174, 255, 208],  // mint (slow)
  [255, 217, 106],  // warm gold (medium)
  [255, 107, 157],  // hot pink (fast)
];
const SPEED_MAX = 50; // pixels/frame — speeds above this get the last color

// Returns blended [r,g,b] for a given speed
function trailColor(speed) {
  const t = Math.min(speed / SPEED_MAX, 1); // 0–1
  const pos = t * (TRAIL_COLORS.length - 1); // position in color array
  const lo = Math.floor(pos);
  const hi = Math.min(lo + 1, TRAIL_COLORS.length - 1);
  const mix = pos - lo;
  return [
    Math.round(TRAIL_COLORS[lo][0] + (TRAIL_COLORS[hi][0] - TRAIL_COLORS[lo][0]) * mix),
    Math.round(TRAIL_COLORS[lo][1] + (TRAIL_COLORS[hi][1] - TRAIL_COLORS[lo][1]) * mix),
    Math.round(TRAIL_COLORS[lo][2] + (TRAIL_COLORS[hi][2] - TRAIL_COLORS[lo][2]) * mix),
  ];
}

// ── HSL SWEEP (alternative — uncomment to use instead) ──
// Replace trailColor() above with this to sweep through a hue range:
//
// const HUE_SLOW = 150;  // mint-green
// const HUE_FAST = 330;  // hot pink
// function trailColor(speed) {
//   const t = Math.min(speed / SPEED_MAX, 1);
//   const h = HUE_SLOW + (HUE_FAST - HUE_SLOW) * t;
//   // convert HSL to RGB (s=100%, l=70%)
//   const s = 1, l = 0.7;
//   const c = (1 - Math.abs(2 * l - 1)) * s;
//   const x = c * (1 - Math.abs((h / 60) % 2 - 1));
//   const m = l - c / 2;
//   let r, g, b;
//   if (h < 60)       { r=c; g=x; b=0; }
//   else if (h < 120) { r=x; g=c; b=0; }
//   else if (h < 180) { r=0; g=c; b=x; }
//   else if (h < 240) { r=0; g=x; b=c; }
//   else if (h < 300) { r=x; g=0; b=c; }
//   else              { r=c; g=0; b=x; }
//   return [Math.round((r+m)*255), Math.round((g+m)*255), Math.round((b+m)*255)];
// }

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function addStroke(x, y) {
  if (lastX !== null) {
    const dist  = Math.hypot(x - lastX, y - lastY);
    const color = trailColor(dist);
    const steps = Math.max(1, Math.floor(dist / 6));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      strokes.push({
        x: lastX + (x - lastX) * t,
        y: lastY + (y - lastY) * t,
        r: 26 * (0.6 + Math.random() * 0.4),
        life: 90, maxLife: 90,
        color: color
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
    ctx.fillStyle = `rgba(${s.color[0]},${s.color[1]},${s.color[2]},${a})`;
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
const MAX_TRAVEL_RIGHT = 2;
const MAX_TRAVEL_LEFT  = 5;

function initEyeTracking(svgEl) {
  const svgW = 103.27;
  let targetTx = 0;
  let currentTx = 0;
  const LERP = 0.04; // lower = smoother/slower such as 0.04, higher = snappier such as 0.15

  document.addEventListener('mousemove', (e) => {
    const rect = svgEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const scaleX = svgW / rect.width;
    const dx = (e.clientX - cx) * scaleX;
    const dist = Math.abs(dx) || 1;
    const maxTravel = dx > 0 ? MAX_TRAVEL_RIGHT : MAX_TRAVEL_LEFT;
    const clamp = Math.min(dist, maxTravel * 10) / (maxTravel * 10);
    targetTx = (dx / dist) * clamp * maxTravel;
  });

  (function animate() {
    currentTx += (targetTx - currentTx) * LERP;
    svgEl.querySelectorAll('#pupil-left, #pupil-right').forEach(p => {
      p.setAttribute('transform', `translate(${currentTx}, 0)`);
    });
    requestAnimationFrame(animate);
  })();
}

// Build the RAWR!!! text element for a logo container
function addRoarText(container) {
  if (container.querySelector('.roar-text')) return;
  const roar = document.createElement('span');
  roar.className = 'roar-text';
  roar.setAttribute('aria-hidden', 'true');
  const letters = 'RAWR!!!'.split('');
  const minSize = 0.45;
  const maxSize = 1.1;
  letters.forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char;
    span.style.fontSize = (minSize + (maxSize - minSize) * (i / (letters.length - 1))) + 'rem';
    roar.appendChild(span);
  });
  container.appendChild(roar);
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
      addRoarText(container);
    });
  });

// ── PROJECTS ──
// Single source of truth for all project links.
// To add, remove, or rename: edit PROJECTS only.
const PROJECTS = {
  studio: [
    { label: 'Bear Car',               href: 'bear-car.html' },
    { label: 'Boombox Suitcases',      href: 'boombox-suitcases.html' },
    { label: 'Coffee Grinder',         href: 'coffee-grinder.html' },
    { label: 'Disco Dance Floor',      href: 'disco-dancefloor.html' },
    { label: 'Photo Booth',            href: 'photo-booth.html', wip: true },
    { label: 'Wedding Save the Date',  href: 'wedding-save-the-date.html' },
  ],
  kitchen: [
    { label: 'Alternative Baking',    href: 'alt-baking.html' },
    { label: 'Coffee Roasting',       href: 'coffee-roasting.html' },
    { label: 'Vegan Ice Cream',       href: 'vegan-ice-cream.html' },
  ],
  hello: [
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
    renderNavCol('Studio', PROJECTS.studio) +
    renderNavCol('Kitchen', PROJECTS.kitchen) +
    renderNavCol('Hello', PROJECTS.hello);
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
    renderGridSection('Studio',  PROJECTS.studio,  '0.28s') +
    renderGridSection('Kitchen', PROJECTS.kitchen,  '0.33s') +
    renderGridSection('Hello',   PROJECTS.hello,    '0.38s');
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
