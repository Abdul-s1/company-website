/* ==========================================================================
   NS SMART — reveal.js
   How the site moves while you scroll.

   1. Entrances: any element marked data-reveal has its parts (its direct
      children) rise in one after another as it comes on screen.
      Only parts that start below the first screen are hidden, so nothing
      you can already see ever waits to appear. If this file fails to load,
      everything simply shows.
   2. Zoom: the close-up section on the home page (data-zoom) switches
      between three distances of one photograph as you scroll through it.

   Both are switched off for visitors who ask for reduced motion.
   ========================================================================== */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  /* --- 1. Entrances ---------------------------------------------------- */
  const STAGGER_MS = 80;
  const groups = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window && groups.length) {
    const reveal = part => {
      part.classList.add('reveal-in');
      part.classList.remove('reveal-pending');
      observer.unobserve(part);
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) reveal(entry.target); });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });

    // Safety net for very fast flings: anything already scrolled past is
    // shown, even if the observer never saw it on screen.
    let sweeping = false;
    window.addEventListener('scroll', () => {
      if (sweeping) return;
      sweeping = true;
      requestAnimationFrame(() => {
        sweeping = false;
        document.querySelectorAll('.reveal-pending').forEach(part => {
          if (part.getBoundingClientRect().top < window.innerHeight) reveal(part);
        });
      });
    }, { passive: true });

    groups.forEach(group => {
      const parts = group.children.length && group.tagName !== 'IMG' ? Array.from(group.children) : [group];
      parts.forEach((part, index) => {
        // Already on screen at load? Leave it alone.
        if (part.getBoundingClientRect().top < window.innerHeight) return;
        part.style.setProperty('--reveal-delay', index * STAGGER_MS + 'ms');
        part.classList.add('reveal-pending');
        observer.observe(part);
      });
    });

    // Printing or saving as PDF: show everything
    window.addEventListener('beforeprint', () => {
      document.querySelectorAll('.reveal-pending').forEach(part => part.classList.replace('reveal-pending', 'reveal-in'));
    });
  }

  /* --- 2. Zoom (home page close-up) ------------------------------------- */
  const zooms = document.querySelectorAll('[data-zoom]');
  if (!zooms.length) return;

  let ticking = false;
  function updateZooms() {
    ticking = false;
    zooms.forEach(zoom => {
      const box = zoom.getBoundingClientRect();
      const travel = box.height - window.innerHeight;
      if (travel <= 0) return;
      const progress = Math.min(1, Math.max(0, -box.top / travel));
      const stage = progress < 0.34 ? 0 : progress < 0.67 ? 1 : 2;
      if (zoom.dataset.stage !== String(stage)) zoom.dataset.stage = stage;
    });
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(updateZooms); }
  }, { passive: true });
  window.addEventListener('resize', updateZooms);
  updateZooms();
})();
