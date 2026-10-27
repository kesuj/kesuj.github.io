/* Keshav Jha — site behaviour
   hero load sequence, name fitting, portrait colour, nav, filters,
   accordion rows, reveal on scroll */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Footer year
$('#year').textContent = new Date().getFullYear();

/* ---------- hero name: split into letters, fit to width ---------- */
const name = $('#name');
(function splitName() {
  let i = 0;
  $$('.word', name).forEach(word => {
    const text = word.textContent;
    word.textContent = '';
    for (const ch of text) {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = ch;
      s.style.transitionDelay = (0.05 * i++) + 's';
      word.appendChild(s);
    }
  });
})();

function fitName() {
  if (window.innerWidth <= 860) { name.style.fontSize = ''; return; }
  const avail = name.clientWidth;
  if (!avail) return;
  name.style.fontSize = '100px';
  const w = name.scrollWidth;
  if (!w) { name.style.fontSize = ''; return; }
  const size = Math.max(40, Math.min(240, (avail / w) * 100 * 0.985));
  name.style.fontSize = size + 'px';
}

/* ---------- load sequence ---------- */
function markLoaded() { document.body.classList.add('loaded'); }
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => { fitName(); setTimeout(markLoaded, 120); });
} else {
  window.addEventListener('load', () => { fitName(); markLoaded(); });
}
setTimeout(() => { if (!document.body.classList.contains('loaded')) { fitName(); markLoaded(); } }, 2500);
window.addEventListener('resize', fitName);
window.addEventListener('load', fitName);

/* ---------- portrait: colour on hover or tap ---------- */
const portrait = $('#portrait');
const face = $('#face');
if (portrait && face) {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (fine) {
    face.addEventListener('mouseenter', () => portrait.classList.add('on'));
    face.addEventListener('mouseleave', () => portrait.classList.remove('on'));
  } else {
    portrait.addEventListener('click', () => portrait.classList.toggle('on'));
  }
}

/* ---------- nav ---------- */
const nav = $('#nav');
const menuToggle = $('#menuToggle');
function setMenu(open) {
  nav.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.textContent = open ? 'Close' : 'Menu';
}
menuToggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
$$('.nav-links a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ---------- work filters ---------- */
const tabs = $('#tabs');
const cards = $$('#cards .card');
tabs.addEventListener('click', e => {
  const btn = e.target.closest('button[data-filter]');
  if (!btn) return;
  $$('button', tabs).forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
  const f = btn.dataset.filter;
  cards.forEach(c => {
    const show = f === 'all' || c.dataset.cat.split(' ').includes(f);
    c.hidden = !show;
    if (show) c.classList.add('in');
  });
});

/* ---------- what I do: accordion rows ---------- */
const svcs = $$('.svc');
function setSvc(el, open) {
  el.classList.toggle('open', open);
  $('.svc-row', el).setAttribute('aria-expanded', String(open));
}
const hoverOpen = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
svcs.forEach(el => {
  const row = $('.svc-row', el);
  row.addEventListener('click', () => {
    const open = !el.classList.contains('open');
    svcs.forEach(o => { if (o !== el) setSvc(o, false); });
    setSvc(el, open);
  });
  if (hoverOpen) {
    el.addEventListener('mouseenter', () => { svcs.forEach(o => setSvc(o, o === el)); });
    el.addEventListener('mouseleave', () => setSvc(el, false));
  }
});

/* ---------- experience: accordion rows ---------- */
$$('.job').forEach(el => {
  const row = $('.job-row', el);
  row.addEventListener('click', () => {
    const open = !el.classList.contains('open');
    el.classList.toggle('open', open);
    row.setAttribute('aria-expanded', String(open));
  });
});

/* ---------- reveal on scroll ---------- */
const revealEls = $$('.rv');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach(el => el.classList.add('in'));
} else {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  revealEls.forEach(el => io.observe(el));
}

/* stagger cards and rows a little */
$$('#cards .card').forEach((c, i) => { c.style.transitionDelay = (i % 2) * 0.1 + 's'; });
$$('.svc, .job').forEach((r, i) => { r.style.transitionDelay = Math.min(i * 0.06, 0.4) + 's'; });
