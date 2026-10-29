/* ==========================================================================
   main.js: interactions and motion (no libraries beyond the local Lenis)
   Everything is visible without this file. It adds:
   hero entrance, one-shot scroll reveals ([data-rv], [data-split]), scrubbed parallax
   ([data-parallax]), menu panel, compact bar, pillars exhibition, closer-looks viewer
   with loupe, scroll-driven process, animated FAQ, work lightbox.
   Reduced motion: final states at once, no hidden start states, no smooth scroll.
   ========================================================================== */
(() => {
  'use strict';
  if (window.__siteBooted) return;
  window.__siteBooted = true;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const root = document.documentElement;
  const reducedMQ = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

  /* ---------- Lenis smooth scroll ---------- */
  let lenis = null;
  if (typeof Lenis !== 'undefined' && !reducedMQ.matches) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.3,
      infinite: false,
    });
    window.__lenis = lenis; // room.js scrolls to a control through it
    const raf = (time) => { if (lenis) lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href === '#' || href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: href === '#top' ? 0 : -8, duration: 1.4 });
    else target.scrollIntoView({ behavior: reducedMQ.matches ? 'auto' : 'smooth', block: 'start' });
    if (history.pushState) history.pushState(null, null, href);
  });

  /* ---------- Hero entrance ---------- */
  const heroAnims = [];
  (function heroEntrance() {
    const play = (el, keyframes, delay, duration = 820) => {
      if (!el.animate) return;
      heroAnims.push(el.animate(keyframes, { duration, delay, easing: EASE, fill: 'backwards' }));
    };
    root.classList.remove('hero-intro');
    if (reducedMQ.matches) return;
    $$('[data-hero="fade"]').forEach((el, i) => play(el, [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], 520 + i * 90, 900));
    $$('[data-hero="line"]').forEach((el, i) => play(el, [{ transform: 'translateY(115%)' }, { transform: 'none' }], 60 + i * 110, 1100));
    $$('.sp').forEach((el, i) => {
      play(el, [
        { opacity: 0, transform: 'translateY(40px)', clipPath: 'inset(20% 0 0 0 round 16px 16px 0 0)' },
        { opacity: 1, transform: 'translateY(0)', clipPath: 'inset(0% 0 0 0 round 0 0 0 0)' }
      ], 260 + i * 110, 1200);
      const img = $('img', el);
      if (img) play(img, [{ transform: 'scale(1.12)' }, { transform: 'scale(1)' }], 280 + i * 110, 1600);
    });
  })();
  reducedMQ.addEventListener('change', () => {
    if (!reducedMQ.matches) return;
    heroAnims.forEach(a => a.cancel());
    if (lenis) { lenis.destroy(); lenis = null; }
  });

  /* ---------- Scroll dispatcher: progress, hero parallax, minibar, scrubbed parallax, process ---------- */
  const hero = $('.hero');
  const heroAmbient = $('.hero__ambient', hero);
  const progress = $('#scroll-progress');
  const mini = $('.minibar');
  const callbar = $('.callbar');
  const enquireEl = $('#enquire');
  const parallax = $$('[data-parallax]').map(el => ({ el, f: parseFloat(el.dataset.parallax) || 0, y: 0 }));
  const canParallax = () => !reducedMQ.matches && innerWidth > 760;
  const hooks = [];

  let cachedDocHeight = root.scrollHeight - innerHeight;
  let cachedHeroHeight = hero ? hero.offsetHeight : 800;
  const measure = () => {
    cachedDocHeight = root.scrollHeight - innerHeight;
    if (hero) cachedHeroHeight = hero.offsetHeight;
  };
  addEventListener('resize', () => { measure(); onScroll(window.scrollY); }, { passive: true });
  addEventListener('load', measure);

  if (hero && heroAmbient && fine) {
    let tx = innerWidth / 2, ty = innerHeight * 0.4, cx = tx, cy = ty, ticking = false;
    const step = () => {
      cx += (tx - cx) * 0.1; cy += (ty - cy) * 0.1;
      hero.style.setProperty('--hero-mouse-x', cx.toFixed(1) + 'px');
      hero.style.setProperty('--hero-mouse-y', cy.toFixed(1) + 'px');
      if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) requestAnimationFrame(step); else ticking = false;
    };
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      tx = e.clientX - r.left; ty = e.clientY - r.top;
      if (!ticking) { ticking = true; requestAnimationFrame(step); }
    }, { passive: true });
  }

  let lastY = window.scrollY;
  function onScroll(y) {
    if (progress && cachedDocHeight > 0) progress.style.transform = 'scaleX(' + clamp(y / cachedDocHeight, 0, 1).toFixed(4) + ')';
    if (hero && canParallax() && y < cachedHeroHeight + 100) hero.style.setProperty('--hero-scroll', y.toFixed(1) + 'px');
    if (mini) {
      const past = y > cachedHeroHeight * 0.85;
      if (!past || y > lastY + 3) mini.classList.remove('is-shown');
      else if (y < lastY - 3) mini.classList.add('is-shown');
    }
    lastY = y;
    if (callbar) {
      const enq = enquireEl ? enquireEl.getBoundingClientRect() : null;
      const show = y > cachedHeroHeight * 0.7 && !(enq && enq.top < innerHeight * 0.6) && !root.classList.contains('menu-open') && !root.classList.contains('has-lightbox');
      callbar.classList.toggle('is-shown', show);
      callbar.tabIndex = show ? 0 : -1;
    }
    if (canParallax()) {
      for (const p of parallax) {
        const r = p.el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > innerHeight + 200) continue;
        const center = r.top + r.height / 2 - p.y - innerHeight / 2;
        p.y = -center * p.f;
        p.el.style.transform = 'translate3d(0,' + p.y.toFixed(1) + 'px,0)';
      }
    } else {
      for (const p of parallax) if (p.y) { p.y = 0; p.el.style.transform = ''; }
    }
    for (const h of hooks) h();
  }
  if (lenis) lenis.on('scroll', (e) => onScroll(e.scroll));
  else {
    let tick = false;
    addEventListener('scroll', () => {
      if (tick) return;
      tick = true;
      requestAnimationFrame(() => { onScroll(window.scrollY); tick = false; });
    }, { passive: true });
  }

  /* ---------- Magnetic primary actions ---------- */
  if (fine && !reducedMQ.matches) {
    $$('[data-magnetic]').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = clamp((e.clientX - (r.left + r.width / 2)) * 0.18, -5, 5);
        const y = clamp((e.clientY - (r.top + r.height / 2)) * 0.18, -4, 4);
        btn.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate3d(0,0,0)'; });
    });
  }

  /* ---------- Split headings into masked words ---------- */
  function splitWords(h) {
    const text = h.textContent.replace(/\s+/g, ' ').trim();
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'w';
            const inner = document.createElement('span'); inner.className = 'w__i';
            inner.style.setProperty('--i', i++);
            inner.textContent = part; w.appendChild(inner); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    const clone = document.createElement('span');
    clone.setAttribute('aria-hidden', 'true');
    while (h.firstChild) clone.appendChild(h.firstChild);
    h.appendChild(clone);
    walk(clone);
    const sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = text;
    h.appendChild(sr);
  }
  const splits = $$('[data-split]');
  splits.forEach(splitWords);
  const scrubEl = $('[data-scrub]');
  if (scrubEl) splitWords(scrubEl);

  /* ---------- One-shot scroll reveals ---------- */
  (function reveals() {
    const items = [...$$('[data-rv]'), ...splits];
    if (reducedMQ.matches || typeof IntersectionObserver !== 'function') return; // everything stays visible
    const seen = (el) => el.classList.add('is-in');
    // A clip-path'd target never reports as intersecting, so wipe elements are watched through their parent.
    const watched = new Map();
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        // Entries already scrolled past (anchor jumps, restored scroll) settle without waiting.
        if (en.isIntersecting || en.boundingClientRect.bottom < 0) {
          (watched.get(en.target) || []).forEach(seen);
          io.unobserve(en.target);
        }
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
    items.forEach(el => {
      const d = Math.min(480, Number(el.dataset.delay || 0));
      if (d) el.style.setProperty('--rv-d', d + 'ms');
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight * 0.92 && r.bottom > 0) { seen(el); return; } // already on screen: never hide
      const target = el.dataset.rv === 'wipe' ? el.parentElement : el;
      if (!watched.has(target)) { watched.set(target, []); io.observe(target); }
      watched.get(target).push(el);
    });
    root.classList.add('rv-on');
  })();

  /* ---------- Statement: words warm from dim to lit, in reading order, as it scrolls up ---------- */
  (function statement() {
    if (!scrubEl) return;
    const words = $$('.w__i', scrubEl);
    if (!words.length) return;
    if (reducedMQ.matches) { words.forEach(w => w.classList.add('is-lit')); return; }
    let lit = -1;
    const update = () => {
      const r = scrubEl.getBoundingClientRect();
      if (r.bottom < -100 || r.top > innerHeight + 100) return;
      // The line fills as the heading rises from the bottom of the screen, and is complete
      // by the time it sits comfortably above centre, so it is never read half lit.
      const from = innerHeight * 0.92, to = innerHeight * 0.45;
      const n = Math.round(clamp((from - r.top) / (from - to), 0, 1) * words.length);
      if (n === lit) return;
      for (let i = 0; i < words.length; i++) words[i].classList.toggle('is-lit', i < n);
      lit = n;
    };
    hooks.push(update);
    update();
  })();

  /* ---------- Menu panel ---------- */
  const menu = $('#menu');
  const openers = $$('[data-menu-open]');
  let closeTimer = 0;
  const focusables = () => $$('a[href], button:not([disabled])', menu).filter(el => el.offsetParent !== null);
  function openMenu() {
    if (lenis) lenis.stop();
    clearTimeout(closeTimer);
    menu.hidden = false;
    openers.forEach(o => o.setAttribute('aria-expanded', 'true'));
    root.classList.add('menu-open');
    requestAnimationFrame(() => { menu.classList.add('is-open'); $('.menu__close', menu).focus(); });
  }
  function closeMenu() {
    if (lenis) lenis.start();
    menu.classList.remove('is-open');
    openers.forEach(o => o.setAttribute('aria-expanded', 'false'));
    root.classList.remove('menu-open');
    closeTimer = setTimeout(() => { menu.hidden = true; }, reducedMQ.matches ? 0 : 480);
  }
  openers.forEach(b => b.addEventListener('click', openMenu));
  $$('[data-menu-close]', menu).forEach(b => b.addEventListener('click', closeMenu));
  $$('[data-menu-link], .menu__foot a', menu).forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => {
    if (menu.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return; }
    if (e.key !== 'Tab') return;
    const f = focusables(); if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ---------- Current-section marker (menu and compact bar) ---------- */
  (function spy() {
    if (!('IntersectionObserver' in window)) return;
    const links = [...$$('.menu__list a'), ...$$('.minibar__links a')];
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        links.forEach(a => a.removeAttribute('aria-current'));
        links.filter(a => a.getAttribute('href') === '#' + en.target.id).forEach(a => a.setAttribute('aria-current', 'true'));
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    ['studio', 'work', 'themes', 'details', 'design', 'process', 'faq', 'enquire'].forEach(id => { const s = document.getElementById(id); if (s) io.observe(s); });
  })();

  /* ---------- Four pillars: wipe exhibition ---------- */
  (function pillars() {
    const btns = $$('.theme__btn');
    const imgs = $$('.themes__photo-wrap img');
    const capTag = $('#themes-cap-tag'), capCount = $('#themes-cap-count'), capText = $('#themes-cap-text'), cap = $('.themes__caption');
    if (!btns.length || !imgs.length) return;
    const data = [
      { tag: 'Form', text: 'Cream fluted wardrobes with arched grooves framing a walnut-finish TV panel.' },
      { tag: 'Material', text: 'A veined stone-look panel set between fluted panels, beside a pale sectional.' },
      { tag: 'Light', text: 'A backlit amber stone-look wall and counter over a white fluted cabinet.' },
      { tag: 'Detail', text: 'Grey wardrobe shutters with inlaid concentric lines and long black handles.' }
    ];
    let idx = 0, hoverT = 0, capT = 0, wasT = 0;
    imgs[0].classList.add('is-first');
    function activate(i) {
      if (i === idx || i < 0 || i >= btns.length) return;
      const prev = imgs[idx];
      idx = i;
      btns.forEach((b, n) => { b.classList.toggle('is-active', n === i); b.setAttribute('aria-selected', String(n === i)); b.tabIndex = n === i ? 0 : -1; });
      imgs.forEach(im => im.classList.remove('was-on', 'is-first'));
      prev.classList.remove('is-on'); prev.classList.add('was-on');
      void imgs[i].offsetWidth; // restart the wipe from its closed state
      imgs[i].classList.add('is-on');
      clearTimeout(wasT);
      wasT = setTimeout(() => prev.classList.remove('was-on'), reducedMQ.matches ? 0 : 1100);
      cap.style.opacity = '0'; cap.style.transform = 'translateY(6px)';
      clearTimeout(capT);
      capT = setTimeout(() => {
        capTag.textContent = data[i].tag; capText.textContent = data[i].text; capCount.textContent = (i + 1) + ' / 4';
        cap.style.opacity = ''; cap.style.transform = '';
      }, reducedMQ.matches ? 0 : 220);
    }
    btns.forEach((b, i) => {
      b.tabIndex = i === 0 ? 0 : -1;
      b.addEventListener('click', () => activate(i));
      b.addEventListener('focus', () => activate(i));
      if (fine) b.addEventListener('mouseenter', () => { clearTimeout(hoverT); hoverT = setTimeout(() => activate(i), 90); });
      if (fine) b.addEventListener('mouseleave', () => clearTimeout(hoverT));
      b.addEventListener('keydown', (e) => {
        const fwd = e.key === 'ArrowDown' || e.key === 'ArrowRight', back = e.key === 'ArrowUp' || e.key === 'ArrowLeft';
        if (!fwd && !back) return;
        e.preventDefault();
        const n = (idx + (fwd ? 1 : -1) + btns.length) % btns.length;
        btns[n].focus();
      });
    });
  })();

  /* ---------- Closer looks: viewer with loupe ---------- */
  (function looks() {
    const wrap = $('[data-looks]');
    if (!wrap) return;
    const slides = $$('.look', wrap), tabs = $$('.looks-nav__btn', wrap);
    const prev = $('.looks__prev', wrap), next = $('.looks__next', wrap), counter = $('#looks-counter');
    const viewer = $('.looks', wrap);
    let i = 0;
    function go(k) {
      i = clamp(k, 0, slides.length - 1);
      slides.forEach((s, n) => { s.classList.toggle('is-on', n === i); s.setAttribute('aria-hidden', String(n !== i)); s.inert = n !== i; });
      tabs.forEach((t, n) => { t.classList.toggle('is-active', n === i); t.setAttribute('aria-selected', String(n === i)); });
      counter.textContent = '0' + (i + 1) + ' / 0' + slides.length;
      prev.disabled = i === 0; next.disabled = i === slides.length - 1;
    }
    prev.addEventListener('click', () => go(i - 1));
    next.addEventListener('click', () => go(i + 1));
    tabs.forEach((t, k) => t.addEventListener('click', () => go(k)));
    wrap.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') go(i + 1);
      if (e.key === 'ArrowLeft') go(i - 1);
    });

    // swipe between looks on touch
    let x0 = null;
    viewer.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') x0 = e.clientX; });
    viewer.addEventListener('pointerup', e => {
      if (x0 === null) return;
      const dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
    });
    viewer.addEventListener('pointercancel', () => { x0 = null; });

    // loupe: a circular magnifier that follows the pointer (fine pointers only)
    if (fine) {
      const Z = 2.6;
      slides.forEach(s => {
        const frame = $('.look__frame', s), img = $('.look__img', s), loupe = $('.loupe', s);
        const posParts = (getComputedStyle(s).getPropertyValue('--pos').trim() || '50% 50%').split(/\s+/).map(v => parseFloat(v) / 100);
        const px = posParts[0], py = posParts[1] ?? 0.5;
        let src = null, tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
        const size = () => loupe.offsetWidth;
        const paint = () => {
          raf = 0;
          cx += (tx - cx) * 0.28; cy += (ty - cy) * 0.28;
          const W = frame.clientWidth, H = frame.clientHeight, iw = img.naturalWidth || 1, ih = img.naturalHeight || 1;
          const sc = Math.max(W / iw, H / ih), ox = (W - iw * sc) * px, oy = (H - ih * sc) * py, R = size() / 2;
          loupe.style.backgroundSize = (iw * sc * Z).toFixed(1) + 'px ' + (ih * sc * Z).toFixed(1) + 'px';
          loupe.style.backgroundPosition = (R - (cx - ox) * Z).toFixed(1) + 'px ' + (R - (cy - oy) * Z).toFixed(1) + 'px';
          loupe.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0) scale(1)';
          if (Math.abs(tx - cx) > 0.3 || Math.abs(ty - cy) > 0.3) raf = requestAnimationFrame(paint);
        };
        frame.addEventListener('pointerenter', e => {
          if (e.pointerType !== 'mouse') return;
          if (!src) { src = img.currentSrc || img.src; loupe.style.backgroundImage = 'url("' + src + '")'; }
          const r = frame.getBoundingClientRect(); cx = tx = e.clientX - r.left; cy = ty = e.clientY - r.top;
          loupe.classList.add('is-live'); frame.classList.add('is-looking');
          if (!raf) raf = requestAnimationFrame(paint);
        });
        frame.addEventListener('pointermove', e => {
          if (e.pointerType !== 'mouse') return;
          const r = frame.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top;
          if (!raf) raf = requestAnimationFrame(paint);
        }, { passive: true });
        frame.addEventListener('pointerleave', () => {
          loupe.classList.remove('is-live'); frame.classList.remove('is-looking');
          loupe.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0) scale(.7)';
        });
      });
    }
    go(0);
  })();

  /* ---------- Process: scroll-driven line, active stage, stepper ---------- */
  (function process() {
    const stagesEl = $('.proc__stages'), fill = $('#proc-line-fill');
    const stages = $$('.proc__stage'), navBtns = $$('.proc__nav-btn');
    if (!stagesEl || !stages.length) return;
    let active = 0;
    const setActive = (n) => {
      active = n;
      stages.forEach((s, k) => s.classList.toggle('is-active', k === n));
      navBtns.forEach((b, k) => { b.classList.toggle('is-active', k === n); b.setAttribute('aria-current', k === n ? 'step' : 'false'); });
    };
    navBtns.forEach((b, k) => b.addEventListener('click', () => {
      const t = stages[k];
      if (lenis) lenis.scrollTo(t, { offset: -innerHeight * 0.3, duration: 1.3 });
      else t.scrollIntoView({ behavior: reducedMQ.matches ? 'auto' : 'smooth', block: 'center' });
    }));
    const update = () => {
      const r = stagesEl.getBoundingClientRect();
      if (r.bottom < -100 || r.top > innerHeight + 100) return;
      const first = stages[0].getBoundingClientRect(), last = stages[stages.length - 1].getBoundingClientRect();
      const a = first.top + 12, b = last.top + 12;
      const p = clamp((innerHeight * 0.55 - a) / Math.max(1, b - a + last.height * 0.6), 0, 1);
      if (fill) fill.style.transform = 'scaleY(' + p.toFixed(4) + ')';
      let n = 0;
      stages.forEach((s, k) => { if (s.getBoundingClientRect().top < innerHeight * 0.55) n = k; });
      if (n !== active) setActive(n);
    };
    hooks.push(update);
    update();
  })();

  /* ---------- FAQ: animated height ---------- */
  (function faq() {
    const items = $$('.faq details');
    items.forEach(d => {
      const sum = $('summary', d);
      let anim = null;
      sum.addEventListener('click', (e) => {
        if (reducedMQ.matches || !d.animate) return;
        e.preventDefault();
        const start = d.offsetHeight;
        if (anim) anim.cancel();
        if (d.open) {
          const end = sum.offsetHeight;
          anim = d.animate({ height: [start + 'px', end + 'px'] }, { duration: 420, easing: EASE });
          d.style.overflow = 'hidden';
          anim.onfinish = () => { d.open = false; d.style.overflow = ''; anim = null; };
        } else {
          d.open = true;
          const end = d.offsetHeight;
          d.style.overflow = 'hidden';
          anim = d.animate({ height: [start + 'px', end + 'px'] }, { duration: 520, easing: EASE });
          anim.onfinish = () => { d.style.overflow = ''; anim = null; };
        }
      });
    });
  })();

  /* ---------- Work lightbox ---------- */
  (function lightbox() {
    const dlg = $('.lightbox');
    if (!dlg || typeof dlg.showModal !== 'function') return;
    const plates = $$('.plate');
    const img = $('.lightbox__img', dlg), title = $('#lightbox-title', dlg), num = $('.lightbox__num', dlg), type = $('.lightbox__type', dlg);
    const prev = $('.lightbox__prev', dlg), next = $('.lightbox__next', dlg);
    let i = 0, opener = null;
    function show(k, dir = 0) {
      i = clamp(k, 0, plates.length - 1);
      const p = plates[i], w = p.closest('.wk'), im = $('img', p);
      img.src = im.dataset.full || im.currentSrc || im.src;
      img.alt = im.alt;
      title.textContent = w.dataset.room;
      num.textContent = w.dataset.num;
      type.textContent = w.dataset.tags;
      prev.disabled = i === 0; next.disabled = i === plates.length - 1;
      if (dir && !reducedMQ.matches) {
        img.style.setProperty('--dir', (dir * 24) + 'px');
        img.classList.remove('is-swap'); void img.offsetWidth; img.classList.add('is-swap');
      }
    }
    plates.forEach((p, k) => p.addEventListener('click', () => { opener = p; show(k); dlg.showModal(); root.classList.add('has-lightbox'); if (lenis) lenis.stop(); }));
    prev.addEventListener('click', () => show(i - 1, -1));
    next.addEventListener('click', () => show(i + 1, 1));
    $('.lightbox__close', dlg).addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('keydown', e => { if (e.key === 'ArrowRight') show(i + 1, 1); if (e.key === 'ArrowLeft') show(i - 1, -1); });
    dlg.addEventListener('close', () => { root.classList.remove('has-lightbox'); if (lenis) lenis.start(); opener && opener.focus(); });
  })();

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      root.dataset.fonts = ['300 16px Fraunces', 'italic 300 16px Fraunces', '400 16px Geist', '600 16px Geist'].every(f => document.fonts.check(f)) ? 'loaded' : 'fallback';
      measure(); onScroll(window.scrollY);
    });
  }
  onScroll(window.scrollY);
})();
