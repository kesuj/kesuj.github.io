// Menu, year, active nav link, gentle reveal on scroll.
(function () {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const menu = document.getElementById('menu');
  const links = document.getElementById('links');
  if (menu && links) {
    menu.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
      menu.textContent = open ? 'Close' : 'Menu';
    });
    links.addEventListener('click', (e) => {
      if (e.target.closest('a')) { links.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.textContent = 'Menu'; }
    });
  }

  if (!('IntersectionObserver' in window)) return;

  // highlight the section in view
  const navLinks = [...document.querySelectorAll('.links a')];
  const map = new Map(navLinks.map((a) => [a.getAttribute('href').slice(1), a]));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach((a) => a.classList.remove('on'));
      const a = map.get(e.target.id);
      if (a) a.classList.add('on');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  map.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });

  // reveal, only below the first screen so nothing above the fold waits
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('js');
  const items = document.querySelectorAll('.head, .cell, .row, .feature, .about-grid > *, .acc, .ventures, .contact h2');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  items.forEach((el) => {
    if (el.getBoundingClientRect().top < innerHeight) return;
    el.classList.add('rv');
    io.observe(el);
  });
})();
