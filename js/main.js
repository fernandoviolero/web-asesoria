/* AGEgrupo Asesor — comportamiento general de la web */
(function () {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Barra de progreso + nav compacta + volver arriba ── */
  const progress = $('.scroll-progress');
  const nav = $('#nav');
  const backTop = $('#back-top');
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    nav.classList.toggle('is-scrolled', y > 40);
    if (backTop) backTop.classList.toggle('is-visible', y > 500);
    updateActiveLink();
    parallax(y);
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });

  /* ── Enlace activo según sección ── */
  const links = $$('.nav__links a[href^="#"]');
  const sections = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  function updateActiveLink() {
    const pos = window.scrollY + 120;
    let current = null;
    sections.forEach(sec => { if (sec.offsetTop <= pos) current = sec.id; });
    links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + current));
  }

  /* ── Menú móvil ── */
  const burger = $('#nav-burger');
  const navLinks = $('#nav-links');
  function closeMenu() {
    navLinks.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menú');
  }
  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  navLinks.addEventListener('click', e => { if (e.target.tagName === 'A') closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ── Parallax suave de los anillos del hero ── */
  const parallaxEls = $$('[data-parallax]');
  function parallax(y) {
    if (reduceMotion) return;
    const vh = window.innerHeight;
    parallaxEls.forEach(el => {
      const f = parseFloat(el.dataset.parallax) || 0.2;
      const parent = el.closest('section') || el.parentElement;
      const r = parent.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) return;
      const offset = (r.top - vh / 2) * -f;
      el.style.transform = `translateY(${offset}px)`;
    });
  }

  /* ── Títulos palabra a palabra ── */
  $$('.section__title').forEach(t => {
    const words = t.textContent.trim().split(/\s+/);
    t.innerHTML = words.map(w => `<span class="w"><span>${w}</span></span>`).join(' ');
  });

  /* ── Revelado al hacer scroll ── */
  const revealEls = $$('.reveal, .reveal-group');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ── Contadores ── */
  const counters = $$('[data-count]');
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = prefix + target + suffix; return; }
    el.textContent = prefix + '0' + suffix;
    const dur = 1400, start = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  const stats = $$('.stat');
  if ('IntersectionObserver' in window) {
    const io2 = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { animateCount(en.target); io2.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(el => io2.observe(el));
    const io3 = new IntersectionObserver(entries => {
      entries.forEach((en, i) => { if (en.isIntersecting) { setTimeout(() => en.target.classList.add('is-ringed'), i * 150); io3.unobserve(en.target); } });
    }, { threshold: 0.5 });
    stats.forEach(el => io3.observe(el));
  } else {
    counters.forEach(animateCount);
    stats.forEach(s => s.classList.add('is-ringed'));
  }

  /* ── Luz que sigue al ratón en las tarjetas de servicio ── */
  if (window.matchMedia('(hover: hover)').matches && !reduceMotion) {
    $$('[data-tilt]').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        card.style.setProperty('--mx', x + 'px');
        card.style.setProperty('--my', y + 'px');
        const rx = ((y / r.height) - .5) * -4;
        const ry = ((x / r.width) - .5) * 4;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  /* ── Estado abierto / cerrado (hora de Madrid) ── */
  const HOURS = { open1: 9 * 60, close1: 14 * 60, open2: 16 * 60, close2: 19 * 60 };
  function madridNow() {
    const parts = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: 'numeric', minute: 'numeric', weekday: 'short', hour12: false })
      .formatToParts(new Date());
    const get = t => parts.find(p => p.type === t)?.value;
    const day = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'].indexOf((get('weekday') || '').replace('.', '').toLowerCase());
    return { day, mins: parseInt(get('hour'), 10) % 24 * 60 + parseInt(get('minute'), 10) };
  }
  function officeStatus() {
    const { day, mins } = madridNow();
    const weekday = day >= 1 && day <= 5;
    const inMorning = mins >= HOURS.open1 && mins < HOURS.close1;
    const inAfternoon = mins >= HOURS.open2 && mins < HOURS.close2;
    if (weekday && (inMorning || inAfternoon)) {
      const closesAt = inMorning ? '14:00' : '19:00';
      return { open: true, text: `Abierto ahora · cierra a las ${closesAt}` };
    }
    if (weekday && mins >= HOURS.close1 && mins < HOURS.open2) return { open: false, text: 'Cerrado · abre a las 16:00' };
    if (weekday && mins < HOURS.open1) return { open: false, text: 'Cerrado · abre hoy a las 09:00' };
    if (weekday && day < 5) return { open: false, text: 'Cerrado · abre mañana a las 09:00' };
    return { open: false, text: 'Cerrado · abre el lunes a las 09:00' };
  }
  window.AGE_officeStatus = officeStatus; // lo usa el asistente
  const statusEl = $('#open-status');
  function paintStatus() {
    if (!statusEl) return;
    const s = officeStatus();
    statusEl.classList.toggle('is-open', s.open);
    statusEl.classList.toggle('is-closed', !s.open);
    $('.txt', statusEl).textContent = s.text;
  }
  paintStatus();
  setInterval(paintStatus, 60 * 1000);

  /* ── Cortina de apertura ── */
  const intro = $('#intro');
  let seen = false;
  try { seen = sessionStorage.getItem('age-intro') === '1'; } catch (e) {}
  if (intro && !reduceMotion && !seen) {
    document.body.classList.add('intro-wait');
    setTimeout(() => { intro.classList.add('is-done'); document.body.classList.remove('intro-wait'); }, 1500);
    setTimeout(() => intro.remove(), 2500);
    try { sessionStorage.setItem('age-intro', '1'); } catch (e) {}
  } else if (intro) { intro.remove(); }

  /* ── Halo que sigue al cursor ── */
  const glow = $('#cursor-glow');
  if (glow && window.matchMedia('(hover: hover)').matches && !reduceMotion) {
    let tx = innerWidth / 2, ty = innerHeight / 2, gx = tx, gy = ty, on = false;
    document.addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; if (!on) { on = true; glow.classList.add('is-on'); } });
    document.addEventListener('pointerleave', () => { on = false; glow.classList.remove('is-on'); });
    (function tick() { gx += (tx - gx) * .12; gy += (ty - gy) * .12; glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%,-50%)`; requestAnimationFrame(tick); })();
  }

  /* ── Mapa bajo demanda (sin cookies de Google hasta que el usuario lo pide) ── */
  const mapBtn = $('#map-load');
  if (mapBtn) {
    mapBtn.addEventListener('click', () => {
      const box = $('#map-box');
      const f = document.createElement('iframe');
      f.title = 'Mapa: AGEgrupo Asesor, Calle Paloma 29, Campo de Criptana';
      f.src = mapBtn.dataset.src; f.width = '100%'; f.height = '380'; f.style.border = '0'; f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade'; f.allowFullscreen = true;
      box.querySelector('.where__map-fallback').replaceWith(f);
    });
  }

  /* ── Reloj de la oficina ── */
  const clockTxt = $('#clock-txt');
  const hH = $('.clock__h'), hM = $('.clock__m'), hS = $('.clock__s');
  function tickClock() {
    if (!clockTxt) return;
    const parts = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).formatToParts(new Date());
    const g = t => parseInt(parts.find(p => p.type === t).value, 10);
    const h = g('hour') % 24, m = g('minute'), sec = g('second');
    clockTxt.textContent = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
    if (hH) hH.style.transform = `rotate(${(h % 12) * 30 + m * .5}deg)`;
    if (hM) hM.style.transform = `rotate(${m * 6}deg)`;
    if (hS) hS.style.transform = `rotate(${sec * 6}deg)`;
  }
  tickClock(); setInterval(tickClock, 1000);

  /* ── Polvo dorado en el hero (canvas) ── */
  const canvas = $('#hero-dust');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let W, H, parts = [], raf;
    const N = 70;
    function resize() {
      W = canvas.width = canvas.offsetWidth * devicePixelRatio;
      H = canvas.height = canvas.offsetHeight * devicePixelRatio;
    }
    function spawn(i) {
      return { x: Math.random() * W, y: Math.random() * H, r: (Math.random() * 1.6 + .6) * devicePixelRatio,
        vy: -(Math.random() * .25 + .08) * devicePixelRatio, vx: (Math.random() - .5) * .12 * devicePixelRatio,
        a: Math.random() * .6 + .2, t: Math.random() * Math.PI * 2 };
    }
    function loop() {
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        p.t += .02; p.y += p.vy; p.x += p.vx + Math.sin(p.t) * .15;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        const alpha = p.a * (0.55 + 0.45 * Math.sin(p.t));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,201,122,${alpha.toFixed(3)})`; ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    }
    resize(); parts = Array.from({ length: N }, spawn); loop();
    window.addEventListener('resize', () => { resize(); });
    document.addEventListener('visibilitychange', () => { document.hidden ? cancelAnimationFrame(raf) : loop(); });
  }

  /* ── La tarjeta del hero sigue al ratón ── */
  const heroCard = $('#hero-card');
  const hero = $('.hero');
  if (heroCard && hero && window.matchMedia('(hover: hover)').matches && !reduceMotion) {
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      heroCard.style.transform = `perspective(1200px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
      $$('.hero__ring').forEach((el, i) => { el.style.translate = `${x * (i ? 18 : 30)}px ${y * (i ? 18 : 30)}px`; });
    });
    hero.addEventListener('pointerleave', () => { heroCard.style.transform = ''; $$('.hero__ring').forEach(el => el.style.translate = ''); });
  }

  onScroll();
})();
