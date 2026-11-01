/* ==========================================================================
   NS SMART — showreel.js
   This is the hero showreel on the home page: a window that steps through
   our work one photo at a time, with a timer bar underneath.

   - Each photo shows for REEL_TIME, then the next one wipes in.
   - The timer has one segment per photo; the current one fills as it plays.
     Click or tap a segment to jump to that photo.
   - Pause/Play button. It also pauses while you hover the window, while
     keyboard focus is inside it, and while the browser tab is hidden.
   - Visitors who ask for reduced motion start paused (no auto-advance).
   - The timing comes from the CSS animation on the active segment, so
     pausing simply pauses that animation.
   ========================================================================== */
(() => {
  const REEL_TIME = 3900; // milliseconds per photo (change this to speed up or slow down)

  const reel = document.querySelector('[data-showreel]');
  if (!reel) return;

  const slides = Array.from(reel.querySelectorAll('.showreel__slide'));
  const timer = reel.querySelector('[data-showreel-timer]');
  const title = reel.querySelector('[data-showreel-title]');
  const toggle = reel.querySelector('[data-showreel-toggle]');
  const windowEl = reel.querySelector('.showreel__window');
  if (slides.length < 2 || !timer) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  reel.style.setProperty('--reel-time', REEL_TIME + 'ms');

  let current = 0;
  let pausedByUser = reduceMotion;
  let pausedByHover = false;

  // Build one timer segment per photo
  const segments = slides.map((slide, index) => {
    const seg = document.createElement('button');
    seg.type = 'button';
    seg.className = 'showreel__seg';
    // The caption comes from data-title; if a photo has none, its alt text is used
    if (!slide.dataset.title) slide.dataset.title = slide.alt;
    seg.setAttribute('aria-label', `Photo ${index + 1} of ${slides.length}: ${slide.dataset.title}`);
    seg.appendChild(document.createElement('span'));
    seg.addEventListener('click', () => show(index));
    // When the active segment's fill finishes, move to the next photo
    seg.querySelector('span').addEventListener('animationend', () => {
      if (index === current) show((current + 1) % slides.length);
    });
    timer.appendChild(seg);
    return seg;
  });

  function show(index) {
    const previous = current;
    current = index;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === current);
      slide.classList.toggle('is-leaving', i === previous && i !== current);
    });
    segments.forEach((seg, i) => {
      seg.classList.toggle('is-done', i < current);
      seg.classList.remove('is-active');
      seg.removeAttribute('aria-current');
    });
    // Restart the fill animation on the new active segment
    void segments[current].offsetWidth;
    segments[current].classList.add('is-active');
    segments[current].setAttribute('aria-current', 'true');
    if (title) title.textContent = slides[current].dataset.title;
  }

  function updatePaused() {
    const paused = pausedByUser || pausedByHover || document.hidden;
    reel.classList.toggle('is-paused', paused);
    toggle.textContent = pausedByUser ? 'Play' : 'Pause';
    toggle.setAttribute('aria-pressed', String(pausedByUser));
  }

  // Pressing Play/Pause is an explicit choice, so it overrides the
  // hover/focus pause (the button itself has focus right after a click)
  toggle.addEventListener('click', () => {
    pausedByUser = !pausedByUser;
    pausedByHover = false;
    updatePaused();
  });
  windowEl.addEventListener('mouseenter', () => { pausedByHover = true; updatePaused(); });
  windowEl.addEventListener('mouseleave', () => { pausedByHover = false; updatePaused(); });
  // Keyboard focus inside the showreel pauses it (mouse clicks do not)
  reel.addEventListener('focusin', event => {
    if (!event.target.matches(':focus-visible')) return;
    pausedByHover = true;
    updatePaused();
  });
  reel.addEventListener('focusout', () => { pausedByHover = false; updatePaused(); });
  document.addEventListener('visibilitychange', updatePaused);

  // Start. If the opening moment is playing, wait for it to clear first.
  function start() {
    reel.classList.add('is-ready', 'is-running');
    updatePaused();
    show(0);
  }
  if (document.documentElement.classList.contains('has-intro')) {
    reel.classList.add('is-ready', 'is-paused');
    setTimeout(start, 2400);
  } else {
    start();
  }
})();
