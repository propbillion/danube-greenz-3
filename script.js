// Google Ads Conversion Tracking - Greenz by Danube
document.addEventListener('click', function(e) {
  var el = e.target.closest('a[href*="wa.me"]');
  if (el && typeof gtag === 'function') {
    gtag('event', 'conversion', {
      'send_to': 'AW-17833027272/GyWTC26yyJAcEMjNubdC'
    });
  }
});
/* ============================================
   AUTO IMAGE RESIZE - PROPBILLION STANDARD MODULE
   Problem: source images uploaded to GitHub are often 2000-3000px+,
   heavy, uncompressed. This runs on every page load and rewrites
   every lazy-loaded <img> to pull a mobile-right-sized, compressed
   WEBP through a free resizing proxy (images.weserv.nl) - no build
   step, no manual compression needed before upload.
   - Quality is fixed at 82 (visually lossless for photos, not soft).
   - Widths are picked per section so nothing is ever served larger
     than it will actually render at, especially on mobile.
   - hero-1.webp is deliberately EXCLUDED (it is fetchpriority=high,
     not lazy - it is the first paint the visitor sees, so it must
     start downloading the instant the browser sees the tag, not
     after this script runs at the bottom of the page). Pre-compress
     that one file yourself before upload (target ~200-400KB, max
     ~2200px wide) - everything else below is fully automatic.
   Reusable on every future PROPBILLION landing page as-is.
   ============================================ */
(function () {
  'use strict';

  var PROXY = 'https://images.weserv.nl/';
  var QUALITY = 82;

  function proxied(absoluteUrl, width) {
    return PROXY + '?url=' + encodeURIComponent(absoluteUrl) +
      '&w=' + width + '&q=' + QUALITY + '&output=webp&we=1';
  }

  // Per-section width ladders + rendered sizes, so mobile never
  // downloads a desktop-sized file.
  var RULES = [
    { sel: '.hero2-img',                         widths: [480, 768, 1200, 1920], sizes: '100vw' },
    { sel: '.ag-slide img',                       widths: [320, 480, 640, 900],   sizes: '(max-width: 640px) 88vw, 420px' },
    { sel: '.plan-card .gated img, .plan-card img', widths: [320, 480, 640, 800], sizes: '(max-width: 640px) 92vw, 380px' },
    { sel: '.rera-qr img',                        widths: [140, 280],             sizes: '140px' }
  ];
  var DEFAULT_RULE = { widths: [320, 480, 640, 900], sizes: '(max-width: 640px) 92vw, 420px' };

  function ruleFor(img) {
    for (var i = 0; i < RULES.length; i++) {
      if (img.matches(RULES[i].sel)) return RULES[i];
    }
    return DEFAULT_RULE;
  }

  function autoResize() {
    var imgs = document.querySelectorAll('img[loading="lazy"]');
    imgs.forEach(function (img) {
      if (img.dataset.autoResized) return;
      var raw = img.getAttribute('src');
      if (!raw || /^https?:\/\//i.test(raw) || /^data:/i.test(raw)) return; // external/data URLs untouched

      var abs;
      try { abs = new URL(raw, document.baseURI).href; } catch (e) { return; }

      var rule = ruleFor(img);
      var srcset = rule.widths.map(function (w) {
        return proxied(abs, w) + ' ' + w + 'w';
      }).join(', ');

      img.setAttribute('srcset', srcset);
      img.setAttribute('sizes', rule.sizes);
      img.setAttribute('src', proxied(abs, rule.widths[Math.min(1, rule.widths.length - 1)]));
      img.dataset.autoResized = '1';
    });
  }

  autoResize();

  // Gallery slides swap in dynamically in some builds; re-run cheaply
  // if new lazy images ever get added to the DOM after load.
  if ('MutationObserver' in window) {
    var mo = new MutationObserver(function () { autoResize(); });
    mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('load', function () { setTimeout(function () { mo.disconnect(); }, 4000); });
  }
})();

/* ============================================
   GREENZ BY DANUBE - Production JS
   Performance-optimized, no framework dependencies
   ============================================ */

(function () {
  'use strict';

  // ---------- Reveal on Scroll (lightweight) ----------
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  // ---------- Header elevation on scroll ----------
  const header = document.querySelector('.header');
  const heroBg = document.querySelector('.hero-bg');
  let ticking = false;

  if (header || heroBg) {
    // Activate parallax class once (avoids transition on initial paint)
    if (heroBg) {
      requestAnimationFrame(() => heroBg.classList.add('parallax-on'));
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;

          if (header) {
            if (y > 24) {
              header.style.boxShadow = '0 2px 18px -8px rgba(0,0,0,0.08)';
            } else {
              header.style.boxShadow = 'none';
            }
          }

          // Cinematic hero parallax: image rises slowly as user scrolls
          // Only active while hero is in view (first 100vh)
          if (heroBg && y < window.innerHeight) {
            // Image translates up at 0.35x scroll speed - subtle, premium
            const translateY = -y * 0.35;
            // Slight scale to prevent edge gaps from showing
            const scale = 1 + (y / window.innerHeight) * 0.06;
            heroBg.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
          }

          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---------- Smooth Scroll for Hash Links ----------
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 116; // header + action bar
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ---------- Pre-Register Form (bottom) ----------
  const form = document.getElementById('preForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameEl = document.getElementById('f_name');
      const mobEl = document.getElementById('f_mob');

      const name = (nameEl.value || '').trim();
      const mob = (mobEl.value || '').trim().replace(/\D/g, '');

      let ok = true;
      if (!name) {
        nameEl.style.borderBottomColor = '#a8444a';
        nameEl.focus();
        ok = false;
      } else {
        nameEl.style.borderBottomColor = '';
      }

      if (mob.length < 10) {
        mobEl.style.borderBottomColor = '#a8444a';
        if (ok) mobEl.focus();
        ok = false;
      } else {
        mobEl.style.borderBottomColor = '';
      }

      if (!ok) return;

      const message =
        'Hi%2C+I+want+Priority+Allocation+for+GREENZ+BY+DANUBE+and+the+Deal+of+the+Decade+pricing.%0A%0A' +
        'Name%3A+' + encodeURIComponent(name) + '%0A' +
        'Mobile%3A+%2B91+' + encodeURIComponent(mob);

      window.open('https://wa.me/918857090799?text=' + message, '_blank');

      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        const original = btn.innerHTML;
        btn.innerHTML = 'Redirecting to WhatsApp...';
        btn.disabled = true;
        setTimeout(() => {
          btn.innerHTML = original;
          btn.disabled = false;
          form.reset();
        }, 2400);
      }
    });
  }

  // ---------- Hero Form (above the fold) ----------
  const heroForm = document.getElementById('heroForm');
  if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameEl = document.getElementById('hf_name');
      const mobEl = document.getElementById('hf_mob');

      const name = (nameEl.value || '').trim();
      const mob = (mobEl.value || '').trim().replace(/\D/g, '');

      let ok = true;
      if (!name) {
        nameEl.classList.add('hf-error');
        nameEl.focus();
        ok = false;
      } else {
        nameEl.classList.remove('hf-error');
      }

      if (mob.length < 10) {
        mobEl.classList.add('hf-error');
        if (ok) mobEl.focus();
        ok = false;
      } else {
        mobEl.classList.remove('hf-error');
      }

      if (!ok) return;

      const message =
        'Hi%2C+I+want+the+GREENZ+BY+DANUBE+Deal+of+the+Decade+price+and+Priority+Allocation.%0A%0A' +
        'Name%3A+' + encodeURIComponent(name) + '%0A' +
        'Mobile%3A+%2B91+' + encodeURIComponent(mob);

      window.open('https://wa.me/918857090799?text=' + message, '_blank');

      const btn = heroForm.querySelector('button[type="submit"]');
      if (btn) {
        const original = btn.innerHTML;
        btn.innerHTML = 'Redirecting to WhatsApp...';
        btn.disabled = true;
        setTimeout(() => {
          btn.innerHTML = original;
          btn.disabled = false;
          heroForm.reset();
        }, 2400);
      }
    });
  }

  // ---------- Lazy image fallback for older browsers ----------
  if (!('loading' in HTMLImageElement.prototype)) {
    const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
      const imgIO = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) img.src = img.dataset.src;
            imgIO.unobserve(img);
          }
        });
      });
      lazyImgs.forEach((img) => imgIO.observe(img));
    }
  }

})();

/* ============================================
   V5 - Auto-sliding galleries (gentle, pauses on interaction)
   ============================================ */
(function () {
  'use strict';

  const galleries = document.querySelectorAll('[data-autoslide="true"]');
  if (!galleries.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  galleries.forEach((gallery) => {
    const track = gallery.querySelector('[data-track]');
    if (!track) return;

    let paused = false;
    let resumeTimer = null;
    const SLIDE_INTERVAL = 4500; // 4.5s per advance - slow, premium

    const advance = () => {
      if (paused) return;
      const slide = track.querySelector('.ag-slide');
      if (!slide) return;
      const slideWidth = slide.getBoundingClientRect().width + 16; // approx gap
      const maxScroll = track.scrollWidth - track.clientWidth;

      // If we're near the end, loop back to start
      if (track.scrollLeft + slideWidth > maxScroll - 4) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: slideWidth, behavior: 'smooth' });
      }
    };

    const pause = (durationMs = 7000) => {
      paused = true;
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => { paused = false; }, durationMs);
    };

    // Pause on user interaction
    track.addEventListener('touchstart', () => pause(8000), { passive: true });
    track.addEventListener('mousedown', () => pause(8000));
    track.addEventListener('wheel', () => pause(4000), { passive: true });
    gallery.addEventListener('mouseenter', () => { paused = true; });
    gallery.addEventListener('mouseleave', () => {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => { paused = false; }, 600);
    });

    // Only auto-advance when in view
    let inView = false;
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { inView = e.isIntersecting; });
      }, { threshold: 0.3 });
      io.observe(gallery);
    } else {
      inView = true;
    }

    setInterval(() => {
      if (inView && !paused && document.visibilityState === 'visible') {
        advance();
      }
    }, SLIDE_INTERVAL);
  });
})();

/* ============================================
   V7 - Smooth lazy image fade-in
   Adds .img-loaded class to lazy imgs once they decode,
   preventing the "pop" of late images.
   ============================================ */
(function () {
  'use strict';

  const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
  if (!lazyImgs.length) return;

  const markLoaded = (img) => {
    img.classList.add('img-loaded');
  };

  lazyImgs.forEach((img) => {
    if (img.complete && img.naturalWidth > 0) {
      // Already cached
      markLoaded(img);
    } else {
      img.addEventListener('load', () => markLoaded(img), { once: true });
      img.addEventListener('error', () => markLoaded(img), { once: true });
    }
  });
})();

/* ============================================
   V10 - Synced gallery captions
   Reads data-caption per slide, mirrors it into the rail
   beneath the gallery, animates in/out with slide changes.
   ============================================ */
(function () {
  'use strict';

  const galleries = document.querySelectorAll('.auto-gallery');
  if (!galleries.length) return;

  galleries.forEach((gallery) => {
    const track = gallery.querySelector('[data-track]');
    const rail = gallery.querySelector('[data-caption-rail]');
    if (!track || !rail) return;

    const slides = Array.from(track.querySelectorAll('.ag-slide'));
    const captions = slides.map((s) => s.getAttribute('data-caption') || '');
    if (!captions.some(Boolean)) return;

    // Build caption elements once
    captions.forEach((text, idx) => {
      const el = document.createElement('span');
      el.className = 'ag-caption';
      el.textContent = text;
      if (idx === 0) el.classList.add('is-active');
      rail.appendChild(el);
    });
    const captionEls = rail.querySelectorAll('.ag-caption');

    let activeIdx = 0;
    let frame = 0;

    const setActive = (idx) => {
      if (idx === activeIdx) return;
      captionEls[activeIdx]?.classList.remove('is-active');
      captionEls[idx]?.classList.add('is-active');
      activeIdx = idx;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const trackRect = track.getBoundingClientRect();
        const center = trackRect.left + trackRect.width / 2;
        let best = 0;
        let bestDist = Infinity;
        slides.forEach((slide, i) => {
          const r = slide.getBoundingClientRect();
          const slideCenter = r.left + r.width / 2;
          const d = Math.abs(slideCenter - center);
          if (d < bestDist) { bestDist = d; best = i; }
        });
        setActive(best);
      });
    };

    track.addEventListener('scroll', onScroll, { passive: true });
    // Re-sync on resize
    window.addEventListener('resize', onScroll, { passive: true });
  });
})();
/* ---------- Privacy Modal ---------- */
(function () {
  'use strict';
  const pm = document.getElementById('privacyModal');
  if (!pm) return;
  const openLinks = document.querySelectorAll('[data-open-privacy]');
  const closeBtn = pm.querySelector('[data-close-privacy]');
  const open = () => { pm.classList.add('open'); pm.setAttribute('aria-hidden','false'); document.body.style.overflow = 'hidden'; };
  const close = () => { pm.classList.remove('open'); pm.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; };
  openLinks.forEach((l) => l.addEventListener('click', (e) => { e.preventDefault(); open(); }));
  if (closeBtn) closeBtn.addEventListener('click', close);
  pm.addEventListener('click', (e) => { if (e.target === pm) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();
