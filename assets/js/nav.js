/* ==========================================================================
   NS SMART — nav.js
   This is the phone menu: the "Menu" button opens and closes the links.
   Closes on a link click, on Escape, and when the screen gets wide again.
   ========================================================================== */
(() => {
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-main-nav]');
  if (!toggle || !nav) return;

  const label = toggle.querySelector('.nav-toggle__label');

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (label) label.textContent = open ? 'Close' : 'Menu';
  }

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    setOpen(open);
    if (open) nav.querySelector('a')?.focus();
  });

  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  window.matchMedia('(min-width: 901px)').addEventListener('change', event => {
    if (event.matches) setOpen(false);
  });
})();
