/* ==========================================================================
   NS SMART — main.js
   Small site-wide helpers:
     1. The year in the footer
     2. The floating contact button
     3. Gallery filters on Our Work
     4. The image viewer (lightbox) on Our Work
   ========================================================================== */
(() => {
  /* --- 1. Footer year ------------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* --- 2. Floating contact button ---------------------------------------
     Shows after you scroll past most of the first screen, and hides again
     whenever the footer or a contact section is visible (no doubling up). */
  const floatButton = document.querySelector('[data-float-contact]');
  if (floatButton) {
    const blockers = document.querySelectorAll('.site-footer, .cta-split, .cta-band');
    let blockersVisible = 0;

    // On phones it also tucks away while you scroll down to read,
    // and comes back as soon as you scroll up.
    const narrow = window.matchMedia('(max-width: 700px)');
    let lastY = window.scrollY;
    let scrollingDown = false;

    const update = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) > 4) { scrollingDown = y > lastY; lastY = y; }
      const pastFirstScreen = y > window.innerHeight * 0.6;
      const tucked = narrow.matches && scrollingDown;
      floatButton.classList.toggle('is-visible', pastFirstScreen && blockersVisible === 0 && !tucked);
    };

    if ('IntersectionObserver' in window) {
      const visible = new Set();
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));
        blockersVisible = visible.size;
        update();
      });
      blockers.forEach(el => observer.observe(el));
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* --- 3. Gallery filters (Our Work) -------------------------------------
     The chips above the gallery show one project's photos at a time.
     Each photo's data-project must match a chip's data-filter.
     "See all photos" links on the project rows (data-filter-link) pick
     that project's chip and scroll down to the gallery. */
  const gallery = document.querySelector('[data-gallery]');
  const chips = document.querySelectorAll('[data-gallery-filters] [data-filter]');
  const galleryItems = gallery ? Array.from(gallery.querySelectorAll('.gallery__item')) : [];

  function filterGallery(project) {
    chips.forEach(chip => chip.setAttribute('aria-pressed', String(chip.dataset.filter === project)));
    galleryItems.forEach(item => {
      const show = project === 'all' || item.dataset.project === project;
      item.hidden = !show;
      item.classList.toggle('is-shown', show);
    });
  }
  chips.forEach(chip => chip.addEventListener('click', () => filterGallery(chip.dataset.filter)));
  document.querySelectorAll('[data-filter-link]').forEach(link => {
    link.addEventListener('click', () => filterGallery(link.dataset.filterLink));
  });

  /* --- 4. Image viewer (lightbox) ------------------------------------------
     Click a gallery photo to see it large. Move with the arrow buttons,
     the left/right keys, or a swipe on a phone. Only the photos the filter
     is showing are included. Close with the button, Escape, or a click on
     the background. */
  const lightbox = document.querySelector('[data-lightbox-modal]');
  if (lightbox && galleryItems.length) {
    const image = lightbox.querySelector('[data-lightbox-image]');
    const caption = lightbox.querySelector('[data-lightbox-caption]');
    const closeButton = lightbox.querySelector('[data-lightbox-close]');
    const prevButton = lightbox.querySelector('[data-lightbox-prev]');
    const nextButton = lightbox.querySelector('[data-lightbox-next]');
    const controls = [closeButton, prevButton, nextButton].filter(Boolean);
    let visible = [];
    let index = 0;
    let lastTrigger = null;

    const showPhoto = i => {
      index = (i + visible.length) % visible.length;
      const photo = visible[index].querySelector('img');
      image.src = photo.currentSrc || photo.src;
      image.alt = photo.alt;
      if (caption) caption.textContent = photo.alt + '  ·  ' + (index + 1) + ' of ' + visible.length;
    };
    const open = item => {
      visible = galleryItems.filter(el => !el.hidden);
      lastTrigger = item;
      showPhoto(visible.indexOf(item));
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
      closeButton?.focus();
    };
    const close = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
      lastTrigger?.focus();
    };

    galleryItems.forEach(item => item.addEventListener('click', () => open(item)));
    closeButton?.addEventListener('click', close);
    prevButton?.addEventListener('click', () => showPhoto(index - 1));
    nextButton?.addEventListener('click', () => showPhoto(index + 1));
    lightbox.addEventListener('click', event => { if (event.target === lightbox) close(); });

    document.addEventListener('keydown', event => {
      if (!lightbox.classList.contains('is-open')) return;
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') showPhoto(index - 1);
      if (event.key === 'ArrowRight') showPhoto(index + 1);
      if (event.key === 'Tab') {                        // keep focus inside the viewer
        event.preventDefault();
        const at = controls.indexOf(document.activeElement);
        controls[(at + (event.shiftKey ? -1 : 1) + controls.length) % controls.length].focus();
      }
    });

    // Swipe left/right on phones
    let startX = null;
    lightbox.addEventListener('pointerdown', event => { if (event.pointerType === 'touch') startX = event.clientX; });
    lightbox.addEventListener('pointerup', event => {
      if (startX === null) return;
      const dx = event.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 50) showPhoto(index + (dx < 0 ? 1 : -1));
    });
  }
})();
