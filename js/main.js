/* =========================================================
   SOFT OMEN — main.js (shared engine, every page)
   a tarot house in milano. bad news, delivered softly.
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const S = (window.SO = {});
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  S.$ = $; S.$$ = $$;
  S.page = document.body.dataset.page || 'home';
  S.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  S.fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  S.hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  S.motion = S.hasGsap && !S.reduced;
  S.rand = (a, b) => a + Math.random() * (b - a);
  S.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  S.pad = (n, l = 2) => String(Math.max(0, Math.floor(n))).padStart(l, '0');
  S.clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  S.dpr = () => Math.min(2, devicePixelRatio || 1);

  // storage that never throws
  S.store = {
    get(k) { try { return localStorage.getItem('so-' + k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem('so-' + k, v); } catch (e) {} },
  };

  if (S.hasGsap) gsap.registerPlugin(ScrollTrigger);
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  // with a #hash in the url the page script scrolls there itself, after its loader
addEventListener('load', () => { if (location.hash.length > 1) return; window.scrollTo(0, 0); S.lenis && S.lenis.scrollTo(0, { immediate: true }); });

  /* ---------- smooth scroll ---------- */
  if (window.Lenis && !S.reduced) {
    S.lenis = new Lenis({ lerp: .1, smoothWheel: true });
    if (S.hasGsap) {
      S.lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => S.lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { S.lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  S.scrollTo = (target) => {
    const el = typeof target === 'string' ? $(target) : target;
    if (!el) return;
    if (S.lenis) S.lenis.scrollTo(el, { offset: 0, duration: 1.4 });
    else el.scrollIntoView({ behavior: S.reduced ? 'auto' : 'smooth' });
  };
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length > 1 && $(id)) { e.preventDefault(); S.scrollTo(id); }
  }));

  /* ---------- image slots: drop a file in img/, it shows up ---------- */
  $$('.slot[data-img]').forEach((slot) => {
    const img = new Image();
    img.alt = slot.dataset.desc || '';
    img.decoding = 'async';
    img.onload = () => { slot.prepend(img); slot.classList.add('has-img'); };
    img.src = 'img/' + slot.dataset.img;
  });

  /* ---------- split letters ---------- */
  S.split = (el) => {
    if (el.dataset.splitDone) return $$('.c', el);
    const text = el.textContent;
    el.textContent = '';
    [...text].forEach((ch) => {
      const s = document.createElement('span');
      s.className = 'c';
      s.textContent = ch === ' ' ? ' ' : ch;
      el.appendChild(s);
    });
    el.dataset.splitDone = '1';
    return $$('.c', el);
  };

  /* ---------- scramble: letters reshuffle like a deck ---------- */
  const GLYPHS = '✦☾♡†✧*+§xviI0123456789';
  S.scramble = (el, to, dur = 600) => {
    const final = to ?? el.dataset.text ?? el.textContent;
    el.dataset.text = final;
    if (S.reduced) { el.textContent = final; return; }
    const start = performance.now();
    cancelAnimationFrame(el._scr);
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const keep = Math.floor(final.length * p);
      el.textContent = final.slice(0, keep) + [...final.slice(keep)].map((c) => (c === ' ' ? ' ' : S.pick(GLYPHS))).join('');
      if (p < 1) el._scr = requestAnimationFrame(step);
    };
    el._scr = requestAnimationFrame(step);
  };
  $$('[data-scramble]').forEach((el) => el.addEventListener('mouseenter', () => S.scramble(el, null, 450)));

  /* ---------- toast ---------- */
  const toast = $('.toast');
  S.toast = (msg, ms = 2600) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-on');
    clearTimeout(S._t);
    S._t = setTimeout(() => toast.classList.remove('is-on'), ms);
  };

  /* ---------- cursor: a four-point star with a label ---------- */
  const cur = $('.cur');
  if (cur && S.fine) {
    document.documentElement.classList.add('has-cursor');
    const label = $('.cur__label', cur);
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
    addEventListener('mousedown', () => cur.classList.add('is-down'));
    addEventListener('mouseup', () => cur.classList.remove('is-down'));
    const loop = () => {
      cx += (x - cx) * .28; cy += (y - cy) * .28;
      cur.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.addEventListener('mouseover', (e) => {
      const t = e.target.closest('a, button, label, input, textarea, [data-cursor], [role="button"]');
      cur.classList.toggle('is-hover', !!t);
      const l = t && t.dataset.cursor;
      cur.classList.toggle('has-label', !!l);
      if (l) label.textContent = l;
    });
    document.addEventListener('mouseleave', () => cur.style.opacity = 0);
    document.addEventListener('mouseenter', () => cur.style.opacity = 1);
  }

  /* ---------- a trail of ascii sparkles behind the cursor ---------- */
  if (S.fine && !S.reduced) {
    let lx = 0, ly = 0;
    addEventListener('mousemove', (e) => {
      if (Math.hypot(e.clientX - lx, e.clientY - ly) < 28) return;
      lx = e.clientX; ly = e.clientY;
      const s = document.createElement('span');
      s.className = 'trail';
      s.textContent = S.pick(['✦', '·', '*', '+', '✧', '.']);
      s.style.left = lx + 'px'; s.style.top = ly + 'px';
      s.style.setProperty('--dx', S.rand(-20, 20) + 'px');
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 900);
    }, { passive: true });
  }

  /* ---------- magnetic buttons ---------- */
  if (S.fine && S.hasGsap) {
    $$('.btn').forEach((b) => {
      b.addEventListener('mousemove', (e) => {
        const r = b.getBoundingClientRect();
        gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .25, duration: .4, ease: 'power3.out' });
      });
      b.addEventListener('mouseleave', () => gsap.to(b, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1, .4)' }));
    });
  }

  /* ---------- header: hides going down, solid after the hero ---------- */
  const hdr = $('.hdr');
  let lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    if (hdr) {
      hdr.classList.toggle('is-hidden', y > lastY && y > 300);
      hdr.classList.toggle('is-solid', y > 200);
    }
    lastY = y;
  }, { passive: true });

  /* ---------- the moon: real phase, computed tonight ---------- */
  S.moon = () => {
    const syn = 29.530588853;
    const ref = Date.UTC(2000, 0, 6, 18, 14);
    const age = (((Date.now() - ref) / 864e5) % syn + syn) % syn;
    const lit = Math.round((1 - Math.cos((2 * Math.PI * age) / syn)) / 2 * 100);
    const name = age < 1.8 ? 'new' : age < 7.4 ? 'waxing crescent' : age < 9.2 ? 'first quarter' : age < 14 ? 'waxing gibbous' : age < 15.8 ? 'full' : age < 22.1 ? 'waning gibbous' : age < 23.9 ? 'last quarter' : age < 27.7 ? 'waning crescent' : 'new';
    return { age, lit, name, waxing: age < syn / 2 };
  };
  $$('[data-moon]').forEach((el) => {
    const m = S.moon();
    el.textContent = `moon ${m.waxing ? '☽' : '☾'} ${m.lit}% · ${m.name}`;
  });

  /* ---------- milano clock ---------- */
  const clocks = $$('[data-clock]');
  const tick = () => {
    const t = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Rome' });
    const open = (() => { const [h] = t.split(':').map(Number); return h >= 23 || h < 4; })();
    clocks.forEach((c) => (c.textContent = `milano ${t} · ${open ? 'we are reading' : 'we are asleep'}`));
  };
  if (clocks.length) { tick(); setInterval(tick, 20000); }

  /* ---------- the chosen reader, shared across pages ---------- */
  S.readers = ['NOX', 'LACE', 'DREAD', 'BLUSH'];
  S.reader = () => S.store.get('reader') || 'NOX';
  S.setReader = (name) => {
    S.store.set('reader', name);
    $$('[data-reader-name]').forEach((el) => S.scramble(el, name, 500));
    document.dispatchEvent(new CustomEvent('reader:change', { detail: name }));
  };
  $$('[data-reader-name]').forEach((el) => (el.textContent = S.reader()));

  /* ---------- tab title ---------- */
  const title = document.title;
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? '✦ the cards are still warm ✦' : title;
  });

  /* ---------- konami: everything is death. it's fine. ---------- */
  const K = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let ki = 0;
  addEventListener('keydown', (e) => {
    ki = e.key === K[ki] ? ki + 1 : (e.key === K[0] ? 1 : 0);
    if (ki === K.length) {
      ki = 0;
      document.dispatchEvent(new CustomEvent('konami'));
      S.toast('XIII ✦ every card is death now. relax. it means change.', 4200);
    }
  });

  /* =====================================================
     the ascii engine: every picture on the site is read as characters
     (the footer roses were the first; now everything speaks like them)
     S.ascii(canvas, { src, field, cell, ramp, alpha })
     - src: an image in img/. when it loads, it is drawn as ascii.
     - field(u, v, t, ar): a procedural picture used until the photo exists.
     ===================================================== */
  /* ---------- her photos: plain images, no ascii. they blur into focus when they scroll in ---------- */
  S.photo = (host, src, alt, cls) => {
    if (!host) return;
    const im = new Image();
    im.className = 'photo ' + (cls || ''); im.alt = alt || ''; im.decoding = 'async';
    im.onload = () => {
      host.classList.add('has-img');
      new IntersectionObserver(([e], ob) => { if (e.isIntersecting) { im.classList.add('is-in'); ob.disconnect(); } }, { threshold: .15 }).observe(im);
    };
    im.src = 'img/' + src;
    host.prepend(im);
    return im;
  };
  S.RAMP = ' .·:-=+*✿#%@';
  S.ascii = (canvas, o = {}) => {
    const g = canvas.getContext('2d');
    const ramp = o.ramp || S.RAMP;
    const host = o.host || canvas.parentElement;
    let W = 0, H = 0, cols = 0, rows = 0, cell = 13, cw = 8, vis = false, mx = -1e4, my = -1e4;
    let lum = null, img = null, last = 0;
    const st = { boost: 0, gain: o.gain ?? 1 };
    const sample = () => {
      if (!img || !cols) return;
      const off = document.createElement('canvas');
      off.width = cols; off.height = rows;
      const oc = off.getContext('2d');
      // cover-fit, with the cell aspect taken into account
      const ir = img.width / img.height, cr = (cols * cw) / (rows * cell);
      let sw = img.width, sh = img.height, sx = 0, sy = 0;
      if (ir > cr) { sw = img.height * cr; sx = (img.width - sw) / 2; } else { sh = img.width / cr; sy = (img.height - sh) / 2; }
      oc.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);
      const d = oc.getImageData(0, 0, cols, rows).data;
      lum = new Float32Array(cols * rows);
      for (let i = 0; i < cols * rows; i++) lum[i] = Math.max(o.floor || 0, Math.pow((d[i * 4] * .3 + d[i * 4 + 1] * .59 + d[i * 4 + 2] * .11) / 255, 1.35)) * (d[i * 4 + 3] / 255); // cut-out pngs: transparent = empty, floor keeps dark hair visible
    };
    const size = () => {
      const dpr = S.dpr();
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      if (!W || !H) return;
      canvas.width = W * dpr; canvas.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0);
      cell = typeof o.cell === 'function' ? o.cell() : (o.cell || (innerWidth < 700 ? 10 : 13));
      cw = cell * .62;
      cols = Math.ceil(W / cw); rows = Math.ceil(H / cell);
      g.font = `${cell}px ui-monospace, Menlo, monospace`;
      g.textBaseline = 'top';
      sample();
    };
    if (o.src) {
      const im = new Image();
      im.onload = () => {
        img = im; sample(); host.classList.add('has-img');
      };
      im.src = 'img/' + o.src;
    }
    size();
    addEventListener('resize', size);
    new ResizeObserver(size).observe(canvas);
    new IntersectionObserver(([e]) => (vis = e.isIntersecting)).observe(canvas);
    host.addEventListener('mousemove', (e) => { const r = canvas.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
    host.addEventListener('mouseleave', () => { mx = my = -1e4; });
    const R = o.radius || 160;
    const BASE = o.base || '244,169,207', HOT = o.hot || '255,46,154';
    // keep the characters away from text: every line box of these elements becomes a quiet zone
    const avoidEls = o.avoid ? (typeof o.avoid === 'string' ? $$(o.avoid) : o.avoid) : [];
    const PAD = o.avoidPad ?? 26, FADE = 46;
    let zones = [];
    const measure = () => {
      if (!avoidEls.length) return;
      const cr = canvas.getBoundingClientRect();
      zones = [];
      const rg = document.createRange();
      avoidEls.forEach((el) => {
        rg.selectNodeContents(el);
        [...rg.getClientRects()].forEach((r) => {
          if (r.width < 2 || r.height < 2) return;
          zones.push([r.left - cr.left - PAD, r.top - cr.top - PAD, r.right - cr.left + PAD, r.bottom - cr.top + PAD]);
        });
      });
    };
    const quiet = (px, py) => {
      let f = 1;
      for (const z of zones) {
        const dx = Math.max(z[0] - px, 0, px - z[2]), dy = Math.max(z[1] - py, 0, py - z[3]);
        const d = Math.hypot(dx, dy);
        if (d < FADE) f = Math.min(f, d / FADE);
        if (!f) break;
      }
      return f;
    };
    const frame = (t) => {
      requestAnimationFrame(frame);
      if (!vis || !cols || t - last < (o.fps ? 1000 / o.fps : 60)) return;
      last = t;
      const time = S.reduced ? 0 : t / 1000;
      g.clearRect(0, 0, W, H);
      const ar = W / H;
      measure();
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = x * cw, py = y * cell, u = px / W, v = py / H;
          let val = lum ? lum[y * cols + x] * (.85 + .15 * Math.sin(time * 1.3 + x * .3 + y * .2)) : (o.field ? o.field(u, v, time, ar, x, y) : 0);
          val *= st.gain;
          const md = Math.hypot(px - mx, py - my);
          const near = md < R ? 1 - md / R : 0;
          const hs = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
          const dust = o.dust === false ? 0 : (hs - Math.floor(hs)) > .975 ? .25 + .2 * Math.sin(time * 2 + x) : 0;
          val = Math.max(val, near * .9, dust, st.boost);
          if (zones.length) { const q = quiet(px, py); if (q < 1) val *= q * q; }
          if (val < .08) continue;
          const ch = ramp[Math.min(ramp.length - 1, Math.floor(val * ramp.length))];
          g.fillStyle = near > .1 ? `rgba(${HOT},${.3 + near * .7})` : `rgba(${BASE},${(o.alpha || .14) + val * .55})`;
          g.fillText(ch, px, py);
        }
      }
    };
    requestAnimationFrame(frame);
    return st;
  };

  /* procedural pictures, used until her photos are in img/ */
  S.fields = {
    // the footer roses
    roses(n = 6) {
      const roses = Array.from({ length: n }, (_, i) => ({ x: (i + .5) / n + S.rand(-.06, .06), y: S.rand(.15, .85), k: S.pick([3, 4, 5, 6]), r: S.rand(.16, .3), sp: S.rand(.1, .3) * (Math.random() < .5 ? -1 : 1) }));
      return S.fields.rosesFrom(roses);
    },
    rosesFrom(roses) {
      return (u, v, time, ar) => {
        let val = 0;
        for (const r of roses) {
          const dx = (u - r.x) * ar, dy = v - r.y;
          const dist = Math.hypot(dx, dy);
          if (dist > r.r * 1.3) continue;
          const th = Math.atan2(dy, dx) + time * r.sp;
          const petal = Math.abs(Math.cos(r.k * th)) * r.r;
          const ring = Math.sin(dist * 90 - time * 1.5) * .5 + .5;
          val = Math.max(val, S.clamp(1 - Math.abs(dist - petal * .9) / (r.r * .35), 0, 1) * (.55 + ring * .45));
        }
        return val;
      };
    },
    // a crescent moon with a halo
    moon(cx = .5, cy = .45, rad = .22) {
      return (u, v, time, ar) => {
        const dx = (u - cx) * ar, dy = v - cy, d = Math.hypot(dx, dy);
        const dx2 = (u - cx - .09 / ar * ar * .5) * ar, d2 = Math.hypot(dx2 - rad * .45, dy + rad * .12);
        let val = 0;
        if (d < rad && d2 > rad * .86) val = .75 + .25 * Math.sin(d * 60 - time);
        const halo = S.clamp(1 - Math.abs(d - rad * 1.45) / (rad * .08), 0, 1) * (.35 + .25 * Math.sin(Math.atan2(dy, dx) * 12 + time));
        return Math.max(val, halo);
      };
    },
    // XVIII the moon, as a tarot card: moon with rays, falling dew, two towers, a path, the pool
    moonCard() {
      return (u, v, time, ar) => {
        const x = (u - .5) * ar, y = v;
        const dm = Math.hypot(x, y - .27), r = .15;
        let val = 0;
        if (dm < r) val = .38 + .1 * Math.sin(dm * 80 - time);
        if (dm < r && Math.hypot(x + .055, y - .255) > r * .82) val = .95;
        const th = Math.atan2(y - .27, x);
        if (dm > r * 1.15 && dm < r * 1.75 && Math.abs(Math.sin(th * 16 + time * .4)) > .82) val = Math.max(val, .55);
        // dew drops falling
        for (let k = 0; k < 7; k++) {
          const dx = -.12 + k * .04, dy = .48 + ((time * .05 + k * .13) % .14);
          if (Math.abs(x - dx) < .006 && Math.abs(y - dy) < .01) val = Math.max(val, .8);
        }
        // two towers
        for (const sx of [-.2, .2]) {
          const tx = Math.abs(x - sx);
          if (tx < .03 && y > .6 && y < .86) {
            val = Math.max(val, .62);
            if (y < .62 && Math.floor((x - sx + .03) / .015) % 2) val = 0;
            if (Math.abs(y - .68) < .012 && tx < .008) val = .1;
          }
        }
        // the path, winding to the horizon
        const pw = .008 + (y - .55) * .1, px = .03 * Math.sin(y * 28);
        if (y > .55 && y < .86 && Math.abs(x - px) < pw) val = Math.max(val, .5);
        // the pool
        if (y > .86) val = Math.max(val, .3 + .18 * Math.sin(x * 70 + time * 2) * Math.cos(y * 50));
        // horizon
        if (Math.abs(y - .55) < .006) val = Math.max(val, .45);
        return val;
      };
    },
    // head + shoulders, the shape of a portrait (long hair, a bit of light on the face)
    bust(seed = 0) {
      return (u, v, time, ar) => {
        const x = (u - .5) * ar, y = v;
        const face = (x / .1) ** 2 + ((y - .37) / .135) ** 2;
        const hair = (x / .165) ** 2 + ((y - .4) / .25) ** 2 < 1 && y > .17;
        const neck = Math.abs(x) < .045 && y > .48 && y < .64;
        const sh = Math.abs(x) < .34 && y > .63 + Math.max(0, Math.abs(x) - .07) ** 2 * 2.6;
        let val = 0;
        if (sh) val = .32 + .1 * Math.sin(x * 90 + seed) + (y - .63) * .3;
        if (hair) val = Math.max(val, .42 + .22 * Math.sin(x * 140 + seed + Math.sin(y * 20 + time * .6)));
        if (neck) val = Math.max(val, .6);
        if (face < 1) {
          val = .95 - face * .35 + .05 * Math.sin(time + y * 30);
          // eyes, closed: two short dark lines; a little mouth
          if (Math.abs(y - .36) < .008 && Math.abs(Math.abs(x) - .042) < .022) val = .12;
          if (Math.abs(y - .445) < .007 && Math.abs(x) < .018) val = .3;
        }
        return val;
      };
    },
  };

  /* =====================================================
     the deck: 22 major arcana, read softly. every page uses it.
     [num, name, glyph, soft, what they say, reversed, how scary it sounds 0-10, how scary it is 0-10]
     ===================================================== */
  S.ARCANA = [
    ['0', 'The Fool', '✧', 'jump. you were going to anyway.', 'a reckless leap into the unknown.', "you're about to jump without looking. look once.", 3, 1],
    ['I', 'The Magician', '∞', 'you have everything you need. stop ordering more.', 'trickery. smoke and mirrors.', "you're performing. drop the trick, keep the talent.", 4, 1],
    ['II', 'The High Priestess', '☾', "you already know. that's the annoying part.", 'secrets. hidden enemies. things kept from you.', "you're ignoring your gut because it's inconvenient.", 5, 1],
    ['III', 'The Empress', '♀', 'water yourself. literally, drink something.', 'smothering. dependence. too much.', "you've been mothering everyone but you.", 2, 0],
    ['IV', 'The Emperor', '♔', 'someone wants control. it might be you.', 'domination. rigidity. a cold father.', 'the rules you made are starting to make you.', 5, 2],
    ['V', 'The Hierophant', '†', 'do it the boring way once. just once.', 'conformity. dogma. do as you are told.', "the boring way didn't work. now try yours.", 3, 1],
    ['VI', 'The Lovers', '♡', "it's a choice, not a sign. sorry.", 'temptation. a choice that will cost you.', "you know which one. you're just stalling.", 4, 2],
    ['VII', 'The Chariot', '➵', 'move. the vibe follows the body.', 'a war of wills. losing control.', "you're steering with your eyes closed. open one.", 4, 1],
    ['VIII', 'Strength', '∽', 'soft hands, steel nerves. you have both.', 'a beast you will have to tame.', "you don't have to be strong today. sit down.", 3, 0],
    ['IX', 'The Hermit', '✶', 'mute the group chat. go inward.', 'isolation. loneliness. withdrawal.', 'alone was nice. now text someone back.', 5, 1],
    ['X', 'Wheel of Fortune', '❂', 'it turns. it always turns. hold the rail.', 'fate. out of your hands. the fall after the rise.', 'a bad streak is a streak, not a personality.', 6, 2],
    ['XI', 'Justice', '⚖', 'the receipts are coming out.', 'judgement. consequences. the bill comes due.', "something isn't fair. you're allowed to say it.", 6, 2],
    ['XII', 'The Hanged Man', '⧖', 'stuck is a position too. look around from there.', 'sacrifice. suspension. martyrdom.', "you're waiting for permission. you have it.", 7, 1],
    ['XIII', 'Death', '✝', 'something ends. good. it was taking up room.', 'the end. of everything.', "it's over and you keep visiting it. stop.", 10, 2],
    ['XIV', 'Temperance', '≈', 'half and half. not all or nothing.', 'excess. imbalance. something has to give.', "you're doing too much. do half.", 2, 0],
    ['XV', 'The Devil', '⛓', 'you like the chain. we see you.', 'addiction. bondage. your worst instincts.', 'the chain was never locked. you can go.', 9, 3],
    ['XVI', 'The Tower', 'ϟ', 'it falls. you never really lived there.', 'sudden disaster. ruin. collapse.', "it's cracking slowly. leave before it falls.", 10, 3],
    ['XVII', 'The Star', '✦', 'this is the soft one. let it be soft.', 'hope, after the storm.', 'you stopped wishing. start again, small.', 1, 0],
    ['XVIII', 'The Moon', '☽', 'not everything you see is true. especially at 3am.', 'illusion. deception. madness.', 'the fog is lifting. it was smaller than it looked.', 8, 2],
    ['XIX', 'The Sun', '☼', 'yes. obviously yes.', "joy. success. even they can't make this scary.", "it's still sunny. you're wearing sunglasses inside.", 0, 0],
    ['XX', 'Judgement', '♪', 'someone calls your name. answer this time.', 'a final reckoning. being judged.', "you're judging yourself harder than anyone is.", 7, 1],
    ['XXI', 'The World', '◯', 'a full circle. you get to start again, smarter.', 'an ending. a cycle closed.', "almost done. don't quit at 95%.", 2, 0],
  ];
  S.GL = '✦✧·:*+=%#@/\\|';
  S.center = (s, w) => { s = s.slice(0, w); const l = Math.floor((w - s.length) / 2); return ' '.repeat(l) + s + ' '.repeat(w - s.length - l); };
  // a tiny ascii card: rows of text in a frame
  S.mini = (txt, w = 11) => ['.' + '-'.repeat(w - 2) + '.', ...txt.map((t) => '|' + S.center(t, w - 2) + '|'), "'" + '-'.repeat(w - 2) + "'"].join('\n');
  // morph one ascii picture into another, char by char, like a card being read
  S.morph = (el, to, dur = 900) => {
    const a = [...el.textContent], b = [...to];
    const len = Math.max(a.length, b.length);
    const at = Array.from({ length: len }, () => Math.random());
    if (S.reduced) { el.textContent = to; return Promise.resolve(); }
    return new Promise((res) => {
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        let s = '';
        for (let i = 0; i < len; i++) {
          const ch = b[i] ?? '';
          if (ch === '\n' || a[i] === '\n') { s += ch; continue; }
          if (p > at[i] * .8 + .2) s += ch;
          else if (p > at[i] * .8) s += ch === ' ' ? ' ' : S.pick(S.GL);
          else s += a[i] ?? ' ';
        }
        el.textContent = s;
        if (p < 1) requestAnimationFrame(step); else { el.textContent = to; res(); }
      };
      requestAnimationFrame(step);
    });
  };

  /* ---------- every page: section heads blur into focus, labels scramble ---------- */
  S.heads = () => {
    if (!S.motion) return;
    $$('.sec__head').forEach((h) => {
      const label = $('.px', h), script = $('.script', h);
      if (script) gsap.from(script, { filter: 'blur(22px)', opacity: 0, y: 50, duration: 1.5, ease: 'power3.out', scrollTrigger: { trigger: h, start: 'top 80%' } });
      if (label) ScrollTrigger.create({ trigger: h, start: 'top 85%', once: true, onEnter: () => S.scramble(label, label.textContent, 900) });
    });
  };

  /* ---------- every page: the footer roses (her favourite) ---------- */
  S.footer = () => {
    const ac = $('.ft__ascii');
    if (ac) S.ascii(ac, { avoid: '.ft__script, .ft__cols p', field: S.fields.roses(6) });
    if (S.motion && $('.ft')) {
      gsap.from('.ft__script', { y: 80, opacity: 0, filter: 'blur(20px)', duration: 1.6, scrollTrigger: { trigger: '.ft', start: 'top 70%' } });
      gsap.from('.ft__sig', { clipPath: 'inset(0 100% 0 0)', duration: 2, ease: 'steps(40)', scrollTrigger: { trigger: '.ft__sig', start: 'top 95%' } });
    }
  };

  /* =====================================================
     the house: readers and readings, shared by every page
     ===================================================== */
  S.READERS = [
    { name: 'NOX', stats: [92, 70, 40, 10], quote: 'lights off', card: 18, since: 2019, reply: 'by morning, maybe',
      desc: 'reads in the dark, literally. turns the lamp off and the cards still land face up. will tell you the tower is coming, then hug you.',
      rules: ['the lamp stays off.', 'no phones on the table. not even face down.', "if you cry, she pretends she didn't see. that's love."],
      a: ['the honest one', 'midnight', 'say it straight', 'the moon'] },
    { name: 'LACE', stats: [78, 55, 98, 60], quote: 'angel…', card: 17, since: 2021, reply: 'in an hour, with a voice note',
      desc: "the soft one. reads with lace gloves on and calls everybody 'angel'. has never once said a bad card out loud. she just looks at you.",
      rules: ['tea first. always tea first.', 'bad cards are read in a whisper.', 'you leave with a compliment, even if it was the tower.'],
      a: ['the gentle one', 'sunset', 'say it softly', 'the star'] },
    { name: 'DREAD', stats: [85, 100, 12, 5], quote: 'next.', card: 13, since: 2016, reply: 'never. she will see you next week',
      desc: 'no small talk. one card, one sentence. people cry in the hallway, then book again. wears the same black dress every night (she owns seven).',
      rules: ['one question. she means it.', 'she will not repeat the card.', "don't ask if it's good. it's what it is."],
      a: ['the blunt one', '3am', 'just say it', 'death'] },
    { name: 'BLUSH', stats: [66, 80, 75, 100], quote: 'u up?', card: 6, since: 2023, reply: 'four seconds',
      desc: "texts back in four seconds. reads your cards and your ex's instagram at the same time. very serious about compatibility charts.",
      rules: ['bring his birthday. and his rising.', "screenshots are allowed. she'll take some too.", 'the follow-up texts are free.'],
      a: ['the bestie', 'after the party', 'say it with emojis', 'the lovers'] },
  ];
  // [name, line, minutes, price, cards, the spread as an ascii layout, what you leave with]
  S.MENU = [
    ['the 3am', 'one card. no follow-up questions.', '7 min', '€7', 1,
      ['    .---.    ', '    | 1 |    ', "    '---'    "], 'one sentence you will think about all week.'],
    ['the situationship', "five cards. he's in all of them.", '20 min', '€22', 5,
      ['      .---.      ', '      | 2 |      ', ".---. '---' .---.", '| 4 | .---. | 5 |', "'---' | 1 | '---'", "      '---'      ", '      .---.      ', '      | 3 |      ', "      '---'      "], 'a clear answer to "what are we". you might not like it.'],
    ['the exit interview', 'why it ended. for real this time.', '30 min', '€33', 3,
      ['.---. .---. .---.', '| 1 | | 2 | | 3 |', "'---' '---' '---'", ' why   you   next'], 'closure, in writing. we print it for you.'],
    ['the full moon', "for when you're about to do something.", '45 min', '€44', 7,
      ['    .---. .---.    ', '    | 1 | | 2 |    ', ".---.---' '---.---.", '| 3 |   ✦   | 4 |', "'---'---. .---'---'", '    | 5 | | 6 |    ', "    '---' '---'    ", '      .---.        ', "      | 7 |        ", "      '---'        "], 'permission. or a very good reason to wait.'],
    ['the 777', 'the lucky one. only on the 7th.', '77 min', '€77', 7,
      ['.---. .---. .---.', '| 7 | | 7 | | 7 |', "'---' '---' '---'", '   + four more   ', '   face down     '], 'a lucky number, a lucky colour, a lucky week.'],
    ['the soft no', 'we read his cards. we tell you nothing.', '0 min', 'free', 0,
      ['.---.', '| ? |', "'---'", ' shh '], 'peace. you did not need to know.'],
  ];

  /* ---------- every new page: a small card is cut, flickers, and turns into the page ---------- */
  S.pageLoader = (word, done) => {
    const pl = $('.pl');
    if (!pl || !S.motion) { pl && pl.remove(); requestAnimationFrame(done); return; }
    const pre = $('.pl__card', pl), n = $('.pl__n', pl);
    const W = 19;
    const back = S.mini(['/\\/\\/\\/\\/\\/\\/\\/\\', '\\/\\/\\/\\/\\/\\/\\/\\/', '/\\/\\/\\/\\/\\/\\/\\/\\', '\\/\\/\\/ ✦ /\\/\\/\\/', '/\\/\\/\\/\\/\\/\\/\\/\\', '\\/\\/\\/\\/\\/\\/\\/\\/', '/\\/\\/\\/\\/\\/\\/\\/\\'], W);
    const face = (i) => S.mini([S.ARCANA[i][0], '', '', S.ARCANA[i][2], '', '', S.ARCANA[i][1].toLowerCase()], W);
    const last = S.mini(['✦', '', '', word, '', '', 'soft omen'], W);
    pre.textContent = back;
    const o = { v: 0 };
    gsap.to(o, { v: 100, duration: 1.5, ease: 'power2.inOut', onUpdate: () => (n.textContent = S.pad(o.v, 3)) });
    (async () => {
      for (let i = 0; i < 3; i++) await S.morph(pre, face((Math.random() * 22) | 0), 240);
      await S.morph(pre, last, 520);
      gsap.timeline()
        .to(pre, { scale: 1.08, duration: .25, ease: 'power2.out' })
        .to(pl, { clipPath: 'inset(0 0 100% 0)', duration: .85, ease: 'expo.inOut' }, '+=.2')
        .add(() => { pl.remove(); done(); }, '-=.35');
    })();
  };
  S.ready = (fn) => {
    window.scrollTo(0, 0); S.lenis && S.lenis.scrollTo(0, { immediate: true, force: true });
    document.body.classList.remove('is-loading');
    fn && fn();
    if (location.hash.length > 1 && $(location.hash)) setTimeout(() => { ScrollTrigger.refresh(); S.scrollTo(location.hash); }, 200);
  };
  // letters of a big title fall in, blurred
  S.bigIn = (el, delay = 0) => {
    if (!el || !S.motion) return;
    const cs = S.split(el);
    gsap.from(cs, { yPercent: 90, opacity: 0, filter: 'blur(14px)', rotate: () => S.rand(-12, 12), stagger: .035, duration: 1.3, ease: 'expo.out', delay });
  };

  /* ---------- every page: rows of card backs that shuffle past as you scroll ---------- */
  S.riffle = () => {
    const back = S.mini(['/\\/\\/\\/\\/', '\\/\\/\\/\\/\\', '/\\/ ✦ \\/\\', '\\/\\/\\/\\/\\', '/\\/\\/\\/\\/']);
    $$('.riffle').forEach((rf, k) => {
      $$('.riffle__row', rf).forEach((row, j) => {
        row.innerHTML = Array.from({ length: 36 }, (_, i) => { const c = S.ARCANA[(i * 5 + k) % 22]; return `<pre>${(i + j) % 9 === 4 ? S.mini(['', c[0], c[2], '', '']) : back}</pre>`; }).join('');
        if (S.motion) gsap.fromTo(row, { xPercent: j ? -30 : 0 }, { xPercent: j ? 0 : -30, ease: 'none', scrollTrigger: { trigger: rf, start: 'top bottom', end: 'bottom top', scrub: .4 } });
      });
    });
  };

  /* ---------- typed secrets ---------- */
  let typed = '';
  addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea')) return;
    typed = (typed + e.key).slice(-12).toLowerCase();
    if (typed.endsWith('ghostly')) S.toast('concept, design & code by ghostly.grl ♥');
    if (typed.endsWith('777')) { S.toast('777 ✦ you are locked in.'); document.dispatchEvent(new CustomEvent('lucky')); }
  });

  /* ---------- console ---------- */
  S.help = () => console.log('%cSO.pull() · SO.setReader("LACE") · SO.moon() · SO.toast("hi")', 'color:#ff2e9a;font-family:monospace');
  console.log(`%c
   *    /\\_/\\      ✦
       ( o.o )   <3  ghostly.grl
   ✦    > ^ <   ☾     *

  SOFT OMEN — bad news, delivered softly.
  type SO.help() for the reading-room notes`, 'color:#f4a9cf;font-family:monospace');
})();
