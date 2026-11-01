/* ==========================================================================
   NS SMART — slider.js
   This is the before/after comparison slider.

   HTML it looks for (see index.html and projects.html):
     <div data-compare>                    the photo pair
       ...after photo...
       <div class="compare__before">...before photo...</div>
       <div data-compare-handle role="slider" tabindex="0">...</div>
     </div>

   How you can move it:
     - Mouse: press anywhere on the photo and drag (a click jumps there).
     - Touch: drag sideways. Swiping up or down still scrolls the page,
       which is what used to go wrong on phones.
     - Keyboard: Tab to the handle, then Left/Right arrows (Shift for
       bigger steps), Page Up/Down, Home and End.
   Add data-compare-intro to play a short "before → after" wipe on load.
   ========================================================================== */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-compare]').forEach(setUpSlider);

  function setUpSlider(compare) {
    const handle = compare.querySelector('[data-compare-handle]');
    if (!handle) return;

    let position = 50;
    let introFrame = null;

    // Move the divider to a percentage (0 = all "after", 100 = all "before")
    function setPosition(percent) {
      position = Math.min(100, Math.max(0, percent));
      compare.style.setProperty('--pos', position + '%');
      const rounded = Math.round(position);
      handle.setAttribute('aria-valuenow', rounded);
      handle.setAttribute('aria-valuetext', rounded + '% before, ' + (100 - rounded) + '% after');
      compare.dataset.near = position < 8 ? 'start' : position > 92 ? 'end' : '';
    }

    function percentFromPointer(clientX) {
      const box = compare.getBoundingClientRect();
      return ((clientX - box.left) / box.width) * 100;
    }

    function stopIntro() {
      if (introFrame) cancelAnimationFrame(introFrame);
      introFrame = null;
    }

    /* --- Mouse, pen and touch --------------------------------------------
       Mouse/pen follow straight away. Touch waits until the finger has
       clearly moved sideways, so a vertical swipe is left to the browser. */
    let pointerId = null;
    let startX = 0;
    let startY = 0;
    let dragging = false;

    compare.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      if (event.target.closest('a, button:not([data-compare-handle])')) return;
      stopIntro();
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      dragging = event.pointerType !== 'touch';
      if (dragging) {
        compare.setPointerCapture(pointerId);
        compare.classList.add('is-dragging');
        setPosition(percentFromPointer(event.clientX));
        handle.focus({ preventScroll: true });
      }
    });

    compare.addEventListener('pointermove', event => {
      if (event.pointerId !== pointerId) return;
      if (!dragging) {
        const dx = Math.abs(event.clientX - startX);
        const dy = Math.abs(event.clientY - startY);
        if (dx > 6 && dx > dy) {
          dragging = true;
          compare.setPointerCapture(pointerId);
          compare.classList.add('is-dragging');
        } else {
          return;
        }
      }
      setPosition(percentFromPointer(event.clientX));
    });

    const endDrag = event => {
      if (event.pointerId !== pointerId) return;
      // A quick tap on a phone (no drag) jumps the divider to that spot
      if (!dragging && event.type === 'pointerup' && event.pointerType === 'touch') {
        setPosition(percentFromPointer(event.clientX));
      }
      pointerId = null;
      dragging = false;
      compare.classList.remove('is-dragging');
    };
    compare.addEventListener('pointerup', endDrag);
    compare.addEventListener('pointercancel', endDrag);

    // Stop the browser's own image drag from getting in the way
    compare.addEventListener('dragstart', event => event.preventDefault());

    /* --- Keyboard -------------------------------------------------------- */
    handle.addEventListener('keydown', event => {
      const step = event.shiftKey ? 10 : 2;
      const moves = {
        ArrowLeft: position - step,
        ArrowDown: position - step,
        ArrowRight: position + step,
        ArrowUp: position + step,
        PageDown: position - 10,
        PageUp: position + 10,
        Home: 0,
        End: 100,
      };
      if (!(event.key in moves)) return;
      event.preventDefault();
      stopIntro();
      setPosition(moves[event.key]);
    });

    setPosition(50);

    /* --- Intro wipe (hero only) -------------------------------------------
       Starts showing almost all of the "before" photo, then glides back to
       the middle once the photos have loaded. Skipped for reduced motion. */
    if (compare.hasAttribute('data-compare-intro') && !reduceMotion) {
      setPosition(96);
      const images = Array.from(compare.querySelectorAll('img'));
      const ready = images.map(img => img.decode ? img.decode().catch(() => {}) : Promise.resolve());
      Promise.all(ready).then(() => {
        const from = 96;
        const to = 50;
        const duration = 1500;
        let startTime = null;
        const tick = now => {
          if (startTime === null) startTime = now;
          const t = Math.min(1, (now - startTime) / duration);
          const eased = 1 - Math.pow(1 - t, 4);     // fast start, gentle stop
          setPosition(from + (to - from) * eased);
          introFrame = t < 1 ? requestAnimationFrame(tick) : null;
        };
        setTimeout(() => { introFrame = requestAnimationFrame(tick); }, 350);
      });
    }
  }
})();
