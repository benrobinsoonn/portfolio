  /* ════════════════════════════════════════════════════════════════════
     TASTEFUL MOTION ENHANCEMENTS  (added — does not alter page content)
     ════════════════════════════════════════════════════════════════════ */
  (function () {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine   = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* ── Nav: solidify on scroll ─────────────────────────────────────── */
    const navEl = document.getElementById('main-nav');
    const onNavScroll = () => {
      if (!navEl) return;
      navEl.classList.toggle('scrolled', window.scrollY > 30);
    };
    window.addEventListener('scroll', onNavScroll, { passive: true });
    onNavScroll();

    if (reduce) return;   // honour reduced-motion: skip the rest

    /* ── Trailing cursor ring (decorative, lags the dot) ─────────────── */
    if (fine) {
      const ring = document.createElement('div');
      ring.id = 'cursor-ring';
      document.body.appendChild(ring);
      let mx = window.innerWidth / 2, my = window.innerHeight / 2;
      let rx = mx, ry = my, shown = false;
      document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        if (!shown) { shown = true; ring.style.opacity = '1'; }
      });
      const loopRing = () => {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        requestAnimationFrame(loopRing);
      };
      requestAnimationFrame(loopRing);
      document.querySelectorAll('a, button, .skill-card, .project-card, .ach-card, .cca-card')
        .forEach(el => {
          el.addEventListener('mouseenter', () => ring.classList.add('hover'));
          el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
        });
    }

    /* ── Hero glow follows the pointer ───────────────────────────────── */
    const home = document.getElementById('home');
    if (home && fine) {
      home.addEventListener('mousemove', e => {
        const r = home.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        home.style.setProperty('--glow-x', x + '%');
        home.style.setProperty('--glow-y', y + '%');
      });
    }

    /* ── 3D tilt + glare on cards ────────────────────────────────────── */
    if (fine) {
      const tiltCards = document.querySelectorAll('.ach-card, .cca-card, .project-card');
      tiltCards.forEach(card => {
        const MAX = 6; // degrees — kept subtle
        card.addEventListener('mousemove', e => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          const rotY = (px - 0.5) * MAX * 2;
          const rotX = (0.5 - py) * MAX * 2;
          card.style.transform =
            `translateY(-4px) perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
          card.style.setProperty('--mx', (px * 100) + '%');
          card.style.setProperty('--my', (py * 100) + '%');
        });
        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
        });
      });
    }

    /* ── Magnetic buttons & social icons ─────────────────────────────── */
    if (fine) {
      document.querySelectorAll('.btn, .social-btn').forEach(btn => {
        const STR = 0.28;
        btn.addEventListener('mousemove', e => {
          const r = btn.getBoundingClientRect();
          const x = (e.clientX - (r.left + r.width / 2)) * STR;
          const y = (e.clientY - (r.top + r.height / 2)) * STR;
          btn.style.transform = `translate(${x}px, ${y}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
      });
    }

    /* ── Animated count-up for hero stats ────────────────────────────── */
    const statNums = document.querySelectorAll('.stat-num');
    const animateStat = el => {
      const original = el.textContent;
      const m = original.match(/^(\D*)(\d[\d,]*)(.*)$/s);   // prefix · number · suffix
      if (!m) return;
      const prefix = m[1], suffix = m[3];
      const target = parseInt(m[2].replace(/,/g, ''), 10);
      if (!isFinite(target)) return;
      const dur = 1100, t0 = performance.now();
      const ease = t => 1 - Math.pow(1 - t, 3);
      const step = now => {
        const p = Math.min((now - t0) / dur, 1);
        const val = Math.round(ease(p) * target);
        el.textContent = prefix + val.toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = original;   // restore EXACT original text
      };
      requestAnimationFrame(step);
    };
    const statObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) { animateStat(en.target); obs.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    statNums.forEach(el => statObs.observe(el));

    /* ── Auto-stagger reveals inside grids (no markup change) ────────── */
    document.querySelectorAll('.ach-grid, .cca-grid, .projects-grid, .skills-grid')
      .forEach(grid => {
        Array.from(grid.children).forEach((child, i) => {
          if (child.classList.contains('reveal')) {
            child.style.transitionDelay = (0.06 * i) + 's';
          }
        });
      });
  })();
