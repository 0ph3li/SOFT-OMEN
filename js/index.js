/* =========================================================
   SOFT OMEN — index.js (home, v2)
   everything in the footer's language: ascii that blooms under the mouse.
   loader rose · ascii hero · ascii cards that morph · ascii portraits
   · dot-leader menu · terminal booking · the footer roses
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const S = window.SO;
  const { $, $$ } = S;
  const M = S.motion;
  const GL = S.GL;

  /* =====================================================
     the deck: 22 major arcana, read softly
     ===================================================== */
  const ARCANA = S.ARCANA;
  const SLOTS = ["what's gone", "what's here", "what's coming"];
  let allDeath = false, lucky = false;
  document.addEventListener('konami', () => { allDeath = true; });
  document.addEventListener('lucky', () => { lucky = true; });

  /* ---------- ascii card art ---------- */
  const CW = 23, CH = 15, IN = CW - 2;
  const center = (s, w) => { s = s.slice(0, w); const l = Math.floor((w - s.length) / 2); return ' '.repeat(l) + s + ' '.repeat(w - s.length - l); };
  const box = (rows) => ['.' + '-'.repeat(IN) + '.', ...rows.map((r) => '|' + r + '|'), "'" + '-'.repeat(IN) + "'"].join('\n');
  const cardBack = () => {
    const rows = [];
    for (let r = 0; r < CH - 2; r++) {
      let line = '';
      for (let c = 0; c < IN; c++) {
        const cr = Math.abs(r - 6), cc = Math.abs(c - 10);
        if (cr === 0 && cc === 0) line += '✦';
        else if (cr + cc / 2 < 2.2) line += ' ';
        else line += (r + c) % 4 === 0 ? '/' : (c - r + 40) % 4 === 0 ? '\\' : ' ';
      }
      rows.push(line);
    }
    return box(rows);
  };
  const cardFace = (n, rev) => {
    const [num, name, glyph] = ARCANA[n];
    const rows = [' ' + num.padEnd(IN - 1)];
    const halo = ' ·:*';
    for (let r = 1; r < CH - 4; r++) {
      let line = '';
      for (let c = 0; c < IN; c++) {
        const dx = (c - 10) / 2, dy = r - 6;
        const d = Math.hypot(dx, dy);
        const ray = Math.abs(Math.atan2(dy, dx) % (Math.PI / 4)) < .18;
        if (d < .5) line += ' ';
        else if (d < 1.6) line += ' ';
        else if (ray && d < 5.2) line += d < 3 ? '*' : '·';
        else if (Math.abs(d - 3.4) < .45) line += ':';
        else line += ' ';
      }
      rows.push(line);
    }
    rows.push(' '.repeat(IN));
    rows.push(center(name.toLowerCase(), IN));
    let out = box(rows);
    if (rev) out = out.split('\n').reverse().map((l) => [...l].reverse().join('')).join('\n');
    return out;
  };
  // morph one ascii picture into another, char by char, like a card being read
  const morph = (el, to, dur = 900) => {
    const from = el.textContent;
    const a = [...from], b = [...to];
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
          else if (p > at[i] * .8) s += ch === ' ' ? ' ' : S.pick(GL);
          else s += a[i] ?? ' ';
        }
        el.textContent = s;
        if (p < 1) requestAnimationFrame(step); else { el.textContent = to; res(); }
      };
      requestAnimationFrame(step);
    });
  };

  /* =====================================================
     loader: one rose blooms in ascii, the name prints in
     ===================================================== */
  const ld = $('.ld');
  const rose = { x: .5, y: .5, k: 5, r: .02, sp: .25 };
  let ldA = null;
  if (ld) ldA = S.ascii($('.ld__ascii'), { field: S.fields.rosesFrom([rose]), host: ld, fps: 24 });

  /* =====================================================
     hero
     ===================================================== */
  const hero = $('.hero');
  S.ascii($('.hero__ascii'), { avoid: '.hero__script span, .hero__cols p, .hero__mark', field: S.fields.rosesFrom([{ x: .1, y: .82, k: 5, r: .2, sp: .15 }, { x: .5, y: .95, k: 3, r: .15, sp: -.2 }, { x: .42, y: .1, k: 4, r: .12, sp: .25 }]), host: hero, radius: 190 });

  // the moon card: her hero.jpg goes inside the frame, until then the moon is drawn
  const mc = $('.mc'), mcIn = $('.mc__in');
  if (mc) {
    // the card sits to the right of the three big lines, between the wordmark and the info row, never over text
    const fitCard = () => {
      if (innerWidth <= 900) { mc.style.height = mc.style.top = ''; return; }
      const mk = $('.hero__mark'), cols = $('.hero__cols');
      const top = mk.offsetTop + mk.offsetHeight + 24;
      const h = cols.offsetTop + cols.offsetHeight - top - 34;
      mc.style.top = top + 'px';
      mc.style.height = Math.max(220, Math.min(600, h)) + 'px';
    };
    fitCard(); addEventListener('resize', fitCard); document.fonts?.ready.then(fitCard);
    S.photo($('.mc__face'), 'HOME/hero.jpg', 'a woman sitting on a crescent moon', 'mc__img');
    const backRows = 34, backCols = 40;
    let back = '';
    for (let r = 0; r < backRows; r++) {
      let line = '';
      for (let c = 0; c < backCols; c++) {
        const dx = (c - backCols / 2) / 2, dy = r - backRows / 2, d = Math.hypot(dx, dy);
        line += d < 1 ? '✦' : Math.abs(d - 5) < .5 ? ':' : Math.abs(d - 8) < .4 ? '·' : (r + c) % 4 === 0 ? '/' : (c - r + 80) % 4 === 0 ? '\\' : ' ';
      }
      back += line + '\n';
    }
    $('.mc__back').textContent = back;
    // tonight's card, the same for everyone on the same date
    const day = Math.floor(Date.now() / 864e5);
    const daily = ARCANA[(day * 7) % 22];
    $('[data-daily]').textContent = `${daily[0]} · ${daily[1].toLowerCase()}`;
    if (M) {
      // float, tilt to the mouse, flip as you leave the hero
      gsap.to(mc, { y: -14, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      const tilt = { x: 0, y: 0 }, flip = { r: 0 };
      const apply = () => gsap.set(mcIn, { rotateY: flip.r + tilt.y, rotateX: tilt.x });
      hero.addEventListener('mousemove', (e) => {
        const r = mc.getBoundingClientRect();
        gsap.to(tilt, { x: -(e.clientY - r.top - r.height / 2) / 18, y: (e.clientX - r.left - r.width / 2) / 14, duration: .6, onUpdate: apply });
      });
      hero.addEventListener('mouseleave', () => gsap.to(tilt, { x: 0, y: 0, duration: 1.2, ease: 'elastic.out(1, .4)', onUpdate: apply }));
      gsap.to(flip, { r: 180, ease: 'none', onUpdate: apply, scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 20%', scrub: .5 } });
      }
  }

  const heroIntro = () => {
    if (!M) return;
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.hero__script span', { filter: 'blur(24px)', opacity: 0, y: 40, stagger: .25, duration: 1.6 }, 0)
      .from('.hero__mark', { clipPath: 'inset(0 100% 0 0)', duration: 1.6, ease: 'steps(36)' }, .3)
      .from('.hero__cols p', { opacity: 0, y: 14, stagger: .1, duration: .8 }, 1)
      .from('.hdr', { opacity: 0, y: -20, duration: .8 }, .8)
      .from('.mc', { y: 260, rotate: 22, opacity: 0, duration: 1.8, ease: 'expo.out' }, .2);
  };
  const finish = () => {
    window.scrollTo(0, 0); S.lenis && S.lenis.scrollTo(0, { immediate: true, force: true });
    document.body.classList.remove('is-loading'); heroIntro();
    // arriving from another page with index.html#book: go there once everything is laid out
    if (location.hash.length > 1 && $(location.hash)) setTimeout(() => { ScrollTrigger.refresh(); S.scrollTo(location.hash); }, 250);
  };

  if (ld && M) {
    const pct = $('.ld__pct');
    const o = { p: 0 };
    gsap.timeline()
      .from('.ld__script', { opacity: 0, filter: 'blur(16px)', duration: 1 }, 0)
      .to(rose, { r: .34, duration: 2.6, ease: 'power2.out' }, 0)
      .to(o, { p: 100, duration: 2.6, ease: 'power2.inOut', onUpdate: () => (pct.textContent = S.pad(o.p, 3)) }, 0)
      .from('.ld__mark', { clipPath: 'inset(0 100% 0 0)', duration: 1.8, ease: 'steps(40)' }, .5)
      // the whole screen flares into characters, then goes dark
      .to(ldA, { boost: .35, duration: .25, ease: 'power2.in' }, 2.7)
      .to('.ld__mark, .ld__cap, .ld__script', { opacity: 0, duration: .2 }, 2.7)
      .to(ld, { opacity: 0, duration: .7, ease: 'power2.inOut' }, 3)
      .add(() => { ld.remove(); finish(); }, 3.1);
  } else {
    ld && ld.remove();
    finish();
  }
  const open = $('[data-open]');
  if (open) {
    const h = Number(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', timeZone: 'Europe/Rome' }).slice(0, 2));
    open.textContent = h >= 23 || h < 4 ? 'we are reading ✦' : 'we are asleep ☾';
  }
  if (M) {
  }

  /* =====================================================
     marquee: block-ascii words, faster when you scroll
     ===================================================== */
  const mq = $('.marq__track');
  if (mq) {
    mq.textContent = mq.textContent.split('\n').map((l) => l + l).join('\n');
    if (M) {
      const tw = gsap.to(mq, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 });
      ScrollTrigger.create({ onUpdate: (self) => {
        const v = self.getVelocity();
        gsap.to(tw, { timeScale: S.clamp(1 + Math.abs(v) / 250, 1, 8) * (v < 0 ? -1 : 1), duration: .2, overwrite: true });
        gsap.to(tw, { timeScale: 1, duration: 1.4, delay: .3, overwrite: false });
      } });
    }
  }

  /* =====================================================
     01 the pull: pinned. scrolling turns the cards, char by char
     ===================================================== */
  S.ascii($('.pull .sec__ascii'), { avoid: '.pull__head p, .pull__head h2, .read', field: S.fields.rosesFrom([{ x: .08, y: .3, k: 5, r: .16, sp: .2 }, { x: .92, y: .75, k: 4, r: .18, sp: -.2 }]), gain: .75 });
  const spread = $('.spread'), reads = $('.pull__reads'), again = $('[data-again]');
  const pPct = $('.pull__pct'), pBar = $('.pull__bar');
  const draw3 = () => {
    if (allDeath) return [13, 13, 13].map((n) => ({ n, rev: false }));
    if (lucky) { lucky = false; return [17, 19, 21].map((n) => ({ n, rev: false })); }
    return [...ARCANA.keys()].sort(() => Math.random() - .5).slice(0, 3).map((n) => ({ n, rev: Math.random() < .3 }));
  };
  const BACK = cardBack();
  let hand = [], cards = [], prog = [0, 0, 0];
  const paint = (i) => {
    const c = cards[i]; if (!c) return;
    const p = prog[i], a = BACK, b = c.face;
    let s = '';
    for (let k = 0; k < b.length; k++) {
      const ch = b[k];
      if (ch === '\n') { s += ch; continue; }
      const t = c.th[k];
      s += p >= t ? ch : p > t - .12 ? (ch === ' ' && a[k] === ' ' ? ' ' : S.pick(GL)) : a[k];
    }
    c.pre.textContent = s;
    c.g.style.opacity = S.clamp((p - .85) / .15, 0, 1);
    const r = reads.children[i];
    r.style.opacity = S.clamp((p - .8) / .2, 0, 1);
    r.style.transform = `translateY(${(1 - S.clamp((p - .8) / .2, 0, 1)) * 20}px)`;
  };
  const deal = () => {
    hand = draw3();
    spread.innerHTML = ''; reads.innerHTML = '';
    cards = hand.map((h) => {
      const el = document.createElement('div');
      el.className = 'card';
      el.innerHTML = `<pre></pre><span class="card__g"></span>`;
      const g = $('.card__g', el);
      g.textContent = ARCANA[h.n][2] + '︎';
      if (h.rev) g.style.transform = 'translate(-50%, -50%) rotate(180deg)';
      spread.appendChild(el);
      const face = cardFace(h.n, h.rev);
      return { el, pre: $('pre', el), g, face, th: [...face].map(() => Math.random() * .9 + .05) };
    });
    hand.forEach((c, i) => {
      const [num, name, , text] = ARCANA[c.n];
      const r = document.createElement('div');
      r.className = 'read';
      r.innerHTML = `<p class="read__k">${SLOTS[i]} · ${num}${c.rev ? ' · reversed' : ''}</p><p class="read__n">${name.toLowerCase()}</p><p class="read__t">${c.rev ? '<em>reversed:</em> same message, slower delivery. ' : ''}${text}</p>`;
      reads.appendChild(r);
    });
    cards.forEach((c, i) => paint(i));
  };
  const place = (k) => {
    const w = cards[0]?.el.offsetWidth || 200;
    const gap = innerWidth < 700 ? w * .5 : w + 50;
    cards.forEach((c, i) => {
      const e = S.clamp(k, 0, 1);
      gsap.set(c.el, { xPercent: -50, yPercent: -62, x: (i - 1) * gap * e, y: (1 - e) * 260 + Math.abs(i - 1) * 16 * e, rotate: (i - 1) * 5 * e + (1 - e) * (i - 1) * -14, opacity: S.clamp(k * 3, 0, 1) });
    });
  };
  deal();
  let lastP = 0;
  const update = (p) => {
    lastP = p;
    place(p / .2);
    for (let i = 0; i < 3; i++) { prog[i] = S.clamp((p - .2 - i * .22) / .22, 0, 1); paint(i); }
    pBar.style.setProperty('--p', p);
    pPct.textContent = S.pad(p * 100, 3);
  };
  if (M) {
    ScrollTrigger.create({ trigger: '.pull', pin: '.pull__stage', start: 'top top', end: '+=230%', scrub: .6, onUpdate: (s) => update(s.progress) });
    gsap.from('.pull__head .script', { filter: 'blur(22px)', opacity: 0, y: 50, duration: 1.5, ease: 'power3.out', scrollTrigger: { trigger: '.pull', start: 'top 70%' } });
    update(0);
  } else update(1);
  const reshuffle = async () => {
    const was = lastP;
    await Promise.all(cards.map((c) => morph(c.pre, BACK, 500)));
    deal();
    update(was);
    if (was > .85) S.toast('reshuffled ✦ new cards, same you');
  };
  S.pull = reshuffle;
  again.addEventListener('click', reshuffle);
  document.addEventListener('konami', reshuffle);
  document.addEventListener('lucky', reshuffle);
  addEventListener('resize', () => update(lastP));

  /* =====================================================
     02 readers: a horizontal run of ascii portraits
     ===================================================== */
  const READERS = S.READERS;
  const STAT = ['intuition', 'honesty', 'softness', 'texts back'];
  const bar = (v, k) => {
    const n = Math.round(v / 5);
    return `${STAT[k].padEnd(11)}[<b>${'█'.repeat(n)}</b>${'░'.repeat(20 - n)}] ${String(v).padStart(3)}`;
  };
  const track = $('.rd-track');
  if (track) {
    track.innerHTML = READERS.map((r, i) => `
      <article class="rd${r.name === S.reader() ? ' is-picked' : ''}">
        <div class="rd__pic"><span class="rd__num">${S.pad(i + 1)} / 04</span><span class="slot-tag px">img/HOME/reader-${i + 1}.png</span></div>
        <div class="rd__info">
          <p class="rd__name">${r.name.toLowerCase()}</p>
          <pre class="rd__stats">${r.stats.map((v, k) => bar(0, k)).join('\n')}</pre>
          <p class="rd__desc">${r.desc}</p>
          <p class="rd__q">“${r.quote}”</p>
          <button class="btn px" data-cursor="select">${r.name === S.reader() ? '[ ✦ reading you ]' : '[ select her ]'}</button>
        </div>
      </article>`).join('');
    const panels = $$('.rd', track);
    const filled = [];
    const fill = (i) => {
      if (filled[i]) return; filled[i] = true;
      const pre = $('.rd__stats', panels[i]);
      const o = { p: 0 };
      const paintS = () => (pre.innerHTML = READERS[i].stats.map((v, k) => bar(Math.round(v * o.p), k)).join('\n'));
      if (M) gsap.to(o, { p: 1, duration: 1.4, ease: 'power2.out', onUpdate: paintS }); else { o.p = 1; paintS(); }
      S.scramble($('.rd__name', panels[i]), READERS[i].name.toLowerCase(), 600);
    };
    panels.forEach((el, i) => {
      S.photo($('.rd__pic', el), `HOME/reader-${i + 1}.png`, READERS[i].name.toLowerCase(), 'rd__img');
      $('.btn', el).addEventListener('click', () => {
        S.setReader(READERS[i].name);
        panels.forEach((x, k) => {
          x.classList.toggle('is-picked', k === i);
          $('.btn', x).textContent = k === i ? '[ ✦ reading you ]' : '[ select her ]';
        });
        S.toast(`${READERS[i].name.toLowerCase()} is shuffling for you ✦`);
      });
    });
    const count = $('.rd-count');
    let cur = -1;
    const setCur = (i) => { if (i === cur) return; cur = i; count.textContent = `${S.pad(i + 1)} / 04`; fill(i); };
    const dots = $$('.rd-dots span');
    const setDots = (i) => dots.forEach((d, k) => { d.classList.toggle('is-on', k === i); d.textContent = k < i ? '·' : k === i ? '▮' : '▯'; });
    if (M && innerWidth > 900) {
      // a deck of readers: real framed cards in a pile. the top one is tossed off whole, the next one straightens up
      const pile = [[-4, 16], [3.5, 30], [-2.5, 44]];
      panels.forEach((p, i) => gsap.set(p, { zIndex: panels.length - i, xPercent: -50, yPercent: -50 }));
      panels.slice(1).forEach((p, k) => gsap.set(p, { rotate: pile[k][0], y: pile[k][1], scale: 1 - (k + 1) * .03, filter: 'brightness(.55)' }));
      const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: {
        trigger: '.readers', pin: '.rd-pin', start: 'top top', end: '+=' + (panels.length - 1) * 110 + '%', scrub: .8,
        onUpdate: (st) => { const i = Math.min(panels.length - 1, Math.floor(st.progress * (panels.length - 1) + .5)); setCur(i); setDots(i); },
      } });
      panels.slice(0, -1).forEach((p, i) => {
        const dir = i % 2 ? 1 : -1;
        tl.to(p, { x: () => innerWidth * .95 * dir, y: -innerHeight * .25, rotate: 28 * dir, duration: 1, ease: 'power2.in' }, i);
        // everything under it moves one step up the pile
        panels.slice(i + 1).forEach((q, k) => {
          const to = k === 0 ? { rotate: 0, y: 0, scale: 1, filter: 'brightness(1)' } : { rotate: pile[k - 1][0], y: pile[k - 1][1], scale: 1 - k * .03 };
          tl.to(q, { ...to, duration: .8, ease: 'power2.out' }, i + .2);
        });
        tl.fromTo($('.rd__name', panels[i + 1]), { yPercent: 50, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .5, ease: 'power3.out' }, i + .5);
      });
      setCur(0); setDots(0);
    } else panels.forEach((_, i) => fill(i));
  }

  /* =====================================================
     riffle: rows of card backs that shuffle past as you scroll
     ===================================================== */
  const mini = S.mini;
  const miniBack = mini(['/\\/\\/\\/\\/', '\\/\\/\\/\\/\\', '/\\/ ✦ \\/\\', '\\/\\/\\/\\/\\', '/\\/\\/\\/\\/']);
  $$('.riffle').forEach((rf, k) => {
    $$('.riffle__row', rf).forEach((row, j) => {
      row.innerHTML = Array.from({ length: 36 }, (_, i) => `<pre>${(i + j) % 9 === 4 ? mini(['', ARCANA[(i * 5 + k) % 22][0], ARCANA[(i * 5 + k) % 22][2], '', '']) : miniBack}</pre>`).join('');
      if (M) gsap.fromTo(row, { xPercent: j ? -30 : 0 }, { xPercent: j ? 0 : -30, ease: 'none', scrollTrigger: { trigger: rf, start: 'top bottom', end: 'bottom top', scrub: .4 } });
    });
  });

  /* =====================================================
     the deck: 22 major arcana on a wheel. scroll turns it, your birthday finds you
     ===================================================== */
  S.ascii($('.wheel .sec__ascii'), { avoid: '.wheel__head p, .wheel__head h2, .wheel__center > *', field: S.fields.moon(.88, .2, .09), gain: .7 });
  const ring = $('.wheel__ring');
  const STEP = 360 / 22;
  let wActive = -1, wheelST = null, wRot = 0;
  const wNum = $('[data-w-num]'), wName = $('[data-w-name]'), wMean = $('[data-w-mean]');
  const R = () => Math.min(innerWidth * .5, 820);
  const placeRing = () => {
    if (!ring) return;
    $$('.wcard', ring).forEach((c, i) => {
      const a = (i * STEP - 90) * Math.PI / 180;
      c.style.transform = `translate(-50%, -50%) translate(${Math.cos(a) * R()}px, ${Math.sin(a) * R()}px) rotate(${i * STEP}deg)`;
    });
    ring.style.transform = `translateY(${R() * .72}px) rotate(${wRot}deg)`;
  };
  const setActive = (i) => {
    i = ((i % 22) + 22) % 22;
    if (i === wActive) return;
    wActive = i;
    $$('.wcard', ring).forEach((c, k) => c.classList.toggle('is-on', k === i));
    const [num, name, , text] = ARCANA[i];
    wNum.textContent = num;
    S.scramble(wName, name.toLowerCase(), 450);
    S.scramble(wMean, text, 600);
    const more = $('[data-w-more]'); if (more) more.href = 'deck.html#card-' + i;
  };
  if (ring) {
    ring.innerHTML = ARCANA.map(([num, name, glyph], i) => `<div class="wcard" data-i="${i}" data-cursor="${name.toLowerCase()}"><pre>${mini([num, '', glyph, '', name.replace(/^The /, '').toLowerCase().slice(0, 12)], 14)}</pre></div>`).join('');
    placeRing();
    setActive(0);
    const turn = (rot) => { wRot = rot; placeRing(); setActive(Math.round(-rot / STEP)); };
    if (M) {
      wheelST = ScrollTrigger.create({ trigger: '.wheel', pin: '.wheel__pin', start: 'top top', end: '+=260%', scrub: .7,
        onUpdate: (st) => turn(-st.progress * STEP * 21) });
    }
    const goTo = (i) => {
      if (wheelST) S.lenis ? S.lenis.scrollTo(wheelST.start + (i / 21) * (wheelST.end - wheelST.start), { duration: 1.6 }) : scrollTo(0, wheelST.start + (i / 21) * (wheelST.end - wheelST.start));
      else turn(-i * STEP);
    };
    $$('.wcard', ring).forEach((c) => c.addEventListener('click', () => goTo(Number(c.dataset.i))));
    addEventListener('resize', placeRing);
    // birth card: add every digit of your birthday until it's 22 or less
    $('.birth').addEventListener('submit', (e) => {
      e.preventDefault();
      const digits = $('#bday').value.replace(/\D/g, '');
      if (digits.length < 6) { S.toast('dd/mm/yyyy ✦ the cards need a date'); return; }
      let n = [...digits].reduce((a, d) => a + Number(d), 0);
      while (n > 22) n = [...String(n)].reduce((a, d) => a + Number(d), 0);
      if (n === 22) n = 0;
      S.toast(`your birth card is ${ARCANA[n][0]} · ${ARCANA[n][1].toLowerCase()} ✦`, 3600);
      goTo(n);
    });
    $('#bday').addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 8);
      if (v.length > 4) v = v.slice(0, 2) + '/' + v.slice(2, 4) + '/' + v.slice(4);
      else if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
      e.target.value = v;
    });
    if (M) gsap.from('.wheel__head .script', { filter: 'blur(22px)', opacity: 0, y: 50, duration: 1.5, ease: 'power3.out', scrollTrigger: { trigger: '.wheel', start: 'top 70%' } });
  }

  /* =====================================================
     03 readings: the hot-pink screen, black ascii, white under the mouse
     ===================================================== */
  const MENU = S.MENU;
  S.ascii($('.menu .sec__ascii'), { avoid: '.menu .sec__head p, .menu .sec__head h2, .track__n, .track__p', field: S.fields.rosesFrom([{ x: .82, y: .16, k: 6, r: .2, sp: .2 }, { x: .05, y: .7, k: 4, r: .22, sp: -.15 }]), base: '5,3,4', hot: '255,255,255', alpha: .1, gain: .9 });
  const tracks = $('.tracks');
  let chosenReading = 'the 3am';
  const renderTicket = () => {};
  if (tracks) {
    tracks.innerHTML = MENU.map(([n, d, t, p], i) => `
      <li class="track${i === 0 ? ' is-on' : ''}" data-cursor="pin it">
        <span class="track__i">${S.pad(i + 1)}</span>
        <span class="track__n">${n}</span>
        <span class="track__dots">${'·'.repeat(4)} <i>${d}</i> ${'·'.repeat(240)}</span>
        <span class="track__p">${p}<small>${t}</small></span>
      </li>`).join('');
    $$('.track', tracks).forEach((t, i) => t.addEventListener('click', () => {
      chosenReading = MENU[i][0];
      $$('.track', tracks).forEach((x) => x.classList.toggle('is-on', x === t));
      S.scramble($('[data-reading]'), chosenReading, 500);
      document.dispatchEvent(new CustomEvent('ticket'));
      S.toast(`${chosenReading} ✦ pinned to your ticket`);
    }));
    if (M) {
      gsap.from('.track', { opacity: 0, x: -40, stagger: .08, duration: .9, ease: 'expo.out', scrollTrigger: { trigger: tracks, start: 'top 80%' } });
      // the pink floods in from the bottom
      gsap.from('.menu--pink', { clipPath: 'inset(100% 0 0 0)', ease: 'none', scrollTrigger: { trigger: '.menu', start: 'top bottom', end: 'top 30%', scrub: true } });
    }
  }

  /* =====================================================
     04 book: the ticket prints while you type
     ===================================================== */
  S.ascii($('.book .sec__ascii'), { avoid: '.book .sec__head p, .book .sec__head h2, .term__line, .ticket', field: S.fields.rosesFrom([{ x: .93, y: .2, k: 5, r: .15, sp: .18 }]), gain: .6 });
  const nights = $('[data-nights]');
  if (nights) {
    const now = new Date();
    nights.innerHTML = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now); d.setDate(now.getDate() + i);
      const label = i === 0 ? 'tonight' : d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit' }).toLowerCase();
      return `<label><input type="radio" name="night" value="${label}" ${i === 0 ? 'checked' : ''} /><span>${label}</span></label>`;
    }).join('');
  }
  const NOTES = { XS: 'xs: we say it like a horoscope.', S: 's: a little sting, then a compliment.', M: 'm: the truth, with a cookie after.', L: 'l: the truth. no cookie.', XL: 'xl: everything. bring a friend.' };
  $$('input[name="size"]').forEach((r) => r.addEventListener('change', () => S.scramble($('[data-size-note]'), NOTES[r.value], 400)));
  const form = $('.term'), ticket = $('.ticket');
  let booked = false;
  const W = 40;
  const tRow = (k, v) => '|  ' + k.padEnd(10, '.') + ' ' + (v || '_'.repeat(8)).slice(0, W - 15).padEnd(W - 14) + '|';
  const tLine = (t) => '|' + center(t, W - 1) + '|';
  const draw = () => {
    if (!form || !ticket) return;
    const fd = new FormData(form);
    const holes = '|' + ' o'.repeat(Math.floor((W - 1) / 2)).padEnd(W - 1) + '|';
    ticket.textContent = [
      '.' + '-'.repeat(W - 1) + '.',
      tLine('✦  SOFT OMEN  ✦'),
      tLine('admit one, softly'),
      holes,
      tRow('name', (fd.get('name') || '').trim().toLowerCase()),
      tRow('question', (fd.get('q') || '').trim().toLowerCase()),
      tRow('truth', String(fd.get('size') || '').toLowerCase()),
      tRow('night', fd.get('night') ? `${fd.get('night')}, 23:00` : ''),
      tRow('reading', chosenReading),
      tRow('reader', S.reader().toLowerCase()),
      holes,
      tLine(booked ? '✦ ✦  BOOKED  ✦ ✦' : 'not booked yet'),
      tLine("it'll be soft. we promise."),
      "'" + '-'.repeat(W - 1) + "'",
    ].join('\n');
  };
  if (form) {
    form.addEventListener('input', () => { booked = false; ticket.classList.remove('is-booked'); draw(); });
    document.addEventListener('ticket', draw);
    document.addEventListener('reader:change', draw);
    draw();
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = (fd.get('name') || '').trim(), q = (fd.get('q') || '').trim();
      if (!name || !q) {
        const f = !name ? form.elements.name : form.elements.q;
        S.toast(!name ? 'a name, even a fake one ✦' : 'one question. you have one.');
        f.focus();
        if (M) gsap.fromTo(f.closest('.term__line'), { x: -10 }, { x: 0, duration: .6, ease: 'elastic.out(1, .3)' });
        return;
      }
      booked = true;
      S.store.set('booking', JSON.stringify({ name, q, size: fd.get('size'), night: fd.get('night'), reader: S.reader(), reading: chosenReading }));
      const before = ticket.textContent;
      draw();
      const after = ticket.textContent;
      ticket.textContent = before;
      morph(ticket, after, 900).then(() => ticket.classList.add('is-booked'));
      if (M) gsap.fromTo(ticket, { rotate: -3, scale: 1 }, { rotate: 2, scale: 1.04, duration: .25, yoyo: true, repeat: 1, ease: 'power2.out' });
      S.toast('booked ✦ see you after 23:00');
    });
    if (M) gsap.from(ticket, { y: 80, rotate: -14, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.book__grid', start: 'top 80%' } });
  }

  S.heads();
  S.footer();
})();
