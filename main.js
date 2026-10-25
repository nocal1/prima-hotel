document.documentElement.classList.add('js');
document.getElementById('yr').textContent = new Date().getFullYear();

// Nav: solid background after scrolling past the hero top
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const closeMenu = () => {
  nav.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', false);
};
menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
document.querySelectorAll('#menu a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('click', e => { if (!nav.contains(e.target)) closeMenu(); });

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add('in'));
}

// Gallery lightbox
const imgs = [...document.querySelectorAll('#gGrid img')];
const lb = document.getElementById('lb'), lbImg = document.getElementById('lbImg');
const lbClose = document.getElementById('lbClose');
let idx = 0, opener = null;
const show = i => { idx = (i + imgs.length) % imgs.length; lbImg.src = imgs[idx].src; lbImg.alt = imgs[idx].alt; };
imgs.forEach((img, i) => img.parentElement.addEventListener('click', () => {
  opener = img.parentElement;
  show(i);
  lb.classList.add('open');
  document.body.classList.add('lb-lock');
  lbClose.focus();
}));
const close = () => {
  lb.classList.remove('open');
  document.body.classList.remove('lb-lock');
  if (opener) opener.focus();
};
lbClose.onclick = close;
document.getElementById('lbPrev').onclick = () => show(idx - 1);
document.getElementById('lbNext').onclick = () => show(idx + 1);
lb.addEventListener('click', e => { if (e.target === lb) close(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menuBtn.focus(); }
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') close();
  if (e.key === 'ArrowLeft') show(idx - 1);
  if (e.key === 'ArrowRight') show(idx + 1);
});

// Floating call button: show only after the hero call button leaves the screen
const fab = document.querySelector('.call-fab');
const heroCall = document.querySelector('.hero .btn-gold');
if (fab && heroCall && 'IntersectionObserver' in window) {
  new IntersectionObserver(([e]) => fab.classList.toggle('show', !e.isIntersecting)).observe(heroCall);
} else if (fab) {
  fab.classList.add('show');
}
