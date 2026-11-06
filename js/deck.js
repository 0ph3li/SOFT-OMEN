/* =========================================================
   SOFT OMEN — deck.js (the deck: 22 major arcana)
   a hand of 22 → the reading room (every card turns into the next,
   char by char, as you scroll) → the fear index → draw one
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const S = window.SO;
  const { $, $$ } = S;
  const M = S.motion;
  const A = S.ARCANA;
  const GL = S.GL;
  let allDeath = false, lucky = false;
  document.addEventListener('konami', () => { allDeath = true; });
  document.addEventListener('lucky', () => { lucky = true; });

  /* =====================================================
     big ascii cards: every arcana gets its own pattern
     (rays, rings and hatching change with the number)
     ===================================================== */
  const BW = 29, BH = 21, IW = BW - 2;
  const frame = (rows) => ['.' + '-'.repeat(IW) + '.', ...rows.map((r) => '|' + r + '|'), "'" + '-'.repeat(IW) + "'"].join('\n');
  const outside = (n, r, c) => {
    const h = n % 3;
    if (h === 0) return (r + c) % 4 === 0 ? '/' : (c - r + 40) % 4 === 0 ? '\\' : ' ';
    if (h === 1) return (r * 3 + c) % 6 === 0 ? '.' : (r * 3 + c) % 6 === 3 && r % 2 ? ':' : ' ';
    return (c + (r % 2) * 3) % 6 === 0 ? '~' : ' ';
  };
  const bigFace = (n) => {
    const [num, name] = A[n];
    const k = 4 + (n % 5), r1 = 3.2 + (n % 3) * .8, r2 = r1 + 2.4;
    const rows = [' ' + num + ' '.repeat(IW - 2 - num.length * 2) + num + ' ', ' '.repeat(IW)];
    for (let r = 0; r < 15; r++) {
      let line = '';
      for (let c = 0; c < IW; c++) {
        const dx = (c - 13) / 2.05, dy = r - 7, d = Math.hypot(dx, dy);
        const t = (((Math.atan2(dy, dx) / (Math.PI * 2)) * k) % 1 + 1) % 1;
        if (d < 2.3) line += ' ';
        else if (Math.abs(d - r1) < .42) line += ':';
        else if (Math.abs(d - r2) < .34) line += '·';
        else if (d < r2 && (t < .09 || t > .91)) line += d < r1 ? '*' : '+';
        else if (d > r2 + .9) line += outside(n, r, c);
        else line += ' ';
      }
      rows.push(line);
    }
    rows.push(' '.repeat(IW));
    rows.push(S.center(name.toLowerCase(), IW));
    return frame(rows);
  };
  const bigBack = () => {
    const rows = [];
    for (let r = 0; r < BH - 2; r++) {
      let line = '';
      for (let c = 0; c < IW; c++) {
        const d = Math.abs(r - 9) + Math.abs(c - 13) / 2;
        line += d < 1.1 ? '+' : Math.abs(d - 3) < .5 ? ':' : Math.abs(d - 6) < .5 ? '·' : (r + c) % 4 === 0 ? '/' : (c - r + 40) % 4 === 0 ? '\\' : ' ';
      }
      rows.push(line);
    }
    return frame(rows);
  };
  const FACES = A.map((_, i) => [...bigFace(i)]);
  const BACK = bigBack();
  const TH = FACES[0].map(() => .12 + Math.random() * .88);
  // a scrubbed morph: m = 0 shows a, m = 1 shows b, in between it's being read
  const between = (a, b, m) => {
    let s = '';
    for (let k = 0; k < b.length; k++) {
      const ch = b[k];
      if (ch === '\n') { s += ch; continue; }
      const t = TH[k] ?? .5;
      s += m >= t ? ch : m > t - .12 ? (ch === ' ' && a[k] === ' ' ? ' ' : S.pick(GL)) : a[k];
    }
    return s;
  };

  /* =====================================================
     loader: the deck is cut, cards flicker, the fool turns up
     ===================================================== */
  const dl = $('.dl');
  const intros = [];
  let jumpTo = () => {};
  const finish = () => {
    window.scrollTo(0, 0); S.lenis && S.lenis.scrollTo(0, { immediate: true, force: true });
    document.body.classList.remove('is-loading');
    intros.forEach((f) => f());
    // deck.html#card-13 lands on that card
    const m = location.hash.match(/^#card-(\d+)$/);
    if (m) setTimeout(() => jumpTo(Math.min(21, Number(m[1])), true), 120);
    else if (location.hash.length > 1 && $(location.hash)) setTimeout(() => S.scrollTo(location.hash), 120);
  };
  if (dl && M) {
    const pre = $('.dl__card'), n = $('.dl__n');
    pre.textContent = BACK;
    const o = { v: 0 };
    gsap.to(o, { v: 22, duration: 1.6, ease: 'power2.inOut', onUpdate: () => (n.textContent = S.pad(o.v)) });
    (async () => {
      for (let i = 0; i < 4; i++) await S.morph(pre, FACES[(Math.random() * 22) | 0].join(''), 220);
      await S.morph(pre, FACES[0].join(''), 520);
      gsap.timeline()
        .to(pre, { scale: 1.06, duration: .25, ease: 'power2.out' })
        .to(dl, { clipPath: 'inset(0 0 100% 0)', duration: .85, ease: 'expo.inOut' }, '+=.15')
        .add(() => { dl.remove(); finish(); }, '-=.35');
    })();
  } else {
    dl && dl.remove();
    requestAnimationFrame(finish);
  }

  /* =====================================================
     00 the fan: all 22 in one hand, spread open
     ===================================================== */
  const fan = $('.fan'), hand = $('.fan__hand'), peek = $('[data-peek]');
  S.ascii($('.fan .sec__ascii'), { avoid: '.fan__head p, .fan__title span, .fan__peek, .fan__hint', field: S.fields.rosesFrom([{ x: .12, y: .3, k: 5, r: .18, sp: .15 }, { x: .88, y: .25, k: 4, r: .15, sp: -.2 }, { x: .5, y: .9, k: 6, r: .2, sp: .1 }]), host: fan, gain: .8, radius: 180 });
  hand.innerHTML = A.map(([num, name, glyph], i) => `<div class="fcard" data-i="${i}" data-cursor="${name.toLowerCase()}"><pre>${S.mini([num, '', glyph, '', name.replace(/^The /, '').toLowerCase().slice(0, 11)], 13)}</pre></div>`).join('');
  const fcards = $$('.fcard', hand);
  const spread = { intro: M ? 0 : 1, scroll: 1 };
  let angles = [];
  const layoutFan = () => {
    const W = innerWidth;
    const R = Math.max(1100, W * 1.25);
    const half = Math.asin(Math.min(.9, (W * (W < 900 ? .46 : .4)) / R)) * 180 / Math.PI;
    hand.style.setProperty('--R', R + 'px');
    angles = fcards.map((_, i) => -half + (2 * half * i) / (fcards.length - 1));
    applyFan();
  };
  const applyFan = () => {
    const s = spread.intro * spread.scroll;
    fcards.forEach((c, i) => gsap.set(c, { rotate: angles[i] * s, y: (1 - spread.intro) * 260, opacity: spread.intro ? 1 : 0 }));
  };
  layoutFan();
  addEventListener('resize', layoutFan);
  fcards.forEach((c) => {
    const [num, name, , soft] = A[c.dataset.i];
    c.addEventListener('mouseenter', () => { peek.innerHTML = `<b>${name.toLowerCase()}</b>${num} ✦ ${soft}`; c.classList.add('is-hot'); c.style.zIndex = 30; });
    c.addEventListener('mouseleave', () => { c.classList.remove('is-hot'); c.style.zIndex = ''; });
    c.addEventListener('click', () => jumpTo(Number(c.dataset.i)));
  });
  if (M) {
    intros.push(() => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.fan__title span', { filter: 'blur(26px)', opacity: 0, y: 60, stagger: .18, duration: 1.5 }, 0)
        .from('.fan__head .px, .fan__lede, .fan__peek', { opacity: 0, y: 16, stagger: .1, duration: .8 }, .4)
        .from('.hdr', { opacity: 0, y: -20, duration: .8 }, .6)
        .to(spread, { intro: 1, duration: 1.8, ease: 'expo.out', onUpdate: applyFan }, .2);
    });
    // scrolling away closes the hand back into a pile
    gsap.to(spread, { scroll: 0, ease: 'none', onUpdate: applyFan, scrollTrigger: { trigger: fan, start: 'top top', end: 'bottom top', scrub: .5 } });
    gsap.to('.fan__hint', { opacity: .3, duration: .9, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }

  /* =====================================================
     01 the reading room: pinned. scroll, and each card
     is read into the next one, char by char
     ===================================================== */
  const stage = $('.stage');
  const pre = $('.big__pre'), bigIn = $('.big__in'), glyph = $('[data-glyph]');
  const el = {
    count: $('[data-count]'), num: $('[data-num]'), name: $('[data-name]'), they: $('[data-they]'), strike: $('.info__strike'),
    we: $('[data-we]'), weK: $('[data-we-k]'), meter: $('[data-meter]'), rev: $('[data-rev]'), ghost: $('[data-ghost]'),
  };
  S.ascii($('.stage .sec__ascii'), { avoid: '.info p, .info h2, .stage__label, .rail', field: S.fields.rosesFrom([{ x: .05, y: .2, k: 5, r: .14, sp: .2 }, { x: .95, y: .85, k: 4, r: .16, sp: -.15 }]), gain: .55 });
  const rail = $('.rail');
  rail.innerHTML = A.map(([num, name], i) => `<button type="button" data-i="${i}" data-cursor="${name.toLowerCase()}">${num}</button>`).join('');
  const railBtns = $$('button', rail);
  let cur = -1, rev = false, x = 0, lastKey = '';
  const bar = (v, ch) => ch.repeat(v) + '░'.repeat(10 - v);
  const drawMeter = (s, v) => {
    el.meter.innerHTML = `how it sounds  <i>[${bar(s, '▓')}]</i> ${S.pad(s)}/10\nhow it is      <b>[${bar(v, '█')}]</b> ${S.pad(v)}/10`;
  };
  const setText = (i) => {
    cur = i;
    const a = A[i];
    el.count.textContent = S.pad(i + 1);
    el.num.textContent = `${a[0]} · ${rev ? 'reversed' : 'upright'}`;
    el.name.textContent = a[1].toLowerCase();
    el.they.textContent = a[4];
    el.we.textContent = rev ? a[5] : a[3];
    el.weK.textContent = rev ? 'what we say, reversed' : 'what we say';
    el.ghost.textContent = a[0];
    railBtns.forEach((b, k) => b.classList.toggle('is-on', k === i));
    if (!M) { drawMeter(a[6], a[7]); return; }
    gsap.killTweensOf([el.name, el.we, el.strike, el.ghost]);
    gsap.fromTo(el.name, { filter: 'blur(14px)', opacity: 0, y: 26 }, { filter: 'blur(0px)', opacity: 1, y: 0, duration: .7, ease: 'power3.out' });
    gsap.fromTo(el.strike, { scaleX: 0 }, { scaleX: 1, duration: .55, delay: .3, ease: 'power2.inOut' });
    gsap.fromTo(el.we, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .6, delay: .45, ease: 'power3.out' });
    gsap.fromTo(el.ghost, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: .9, ease: 'expo.out' });
    const m = { s: 0, v: 0 };
    gsap.to(m, { s: a[6], v: a[7], duration: .7, delay: .2, ease: 'power2.out', onUpdate: () => drawMeter(Math.round(m.s), Math.round(m.v)) });
  };
  const render = (nx) => {
    x = S.clamp(nx, 0, 21);
    const i = Math.min(20, Math.floor(x)), f = x - i;
    const m = x >= 21 ? 1 : S.clamp((f - .45) / .4, 0, 1);
    const key = i + ':' + m.toFixed(2);
    if (key !== lastKey) {
      lastKey = key;
      pre.textContent = m <= 0 ? FACES[i].join('') : m >= 1 ? FACES[i + 1].join('') : between(FACES[i], FACES[i + 1], m);
      glyph.textContent = A[m < .5 ? i : i + 1][2];
      glyph.style.opacity = Math.abs(Math.cos(m * Math.PI));
    }
    const ti = x >= 21 ? 21 : f > .66 ? i + 1 : i;
    if (ti !== cur) setText(ti);
    rail.style.setProperty('--p', x / 21);
  };
  let st = null;
  if (M) {
    st = ScrollTrigger.create({
      trigger: stage, pin: '.stage__pin', start: 'top top', end: () => '+=' + innerHeight * 21 * .55, scrub: true,
      onUpdate: (self) => render(self.progress * 21),
    });
  }
  jumpTo = (i, instant) => {
    if (!st) { render(i); return; }
    const y = st.start + (i / 21) * (st.end - st.start) + 2;
    if (S.lenis) S.lenis.scrollTo(y, instant ? { immediate: true, force: true } : { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: instant ? 'auto' : 'smooth' });
  };
  railBtns.forEach((b) => b.addEventListener('click', () => jumpTo(Number(b.dataset.i))));
  // reverse it: the card turns upside down, the reading changes
  let toldRev = false;
  const flip = () => {
    rev = !rev;
    stage.classList.toggle('is-rev', rev);
    el.rev.textContent = rev ? '[ ↻ turn it back ]' : '[ ↻ reverse it ]';
    if (M) gsap.to(bigIn, { rotate: rev ? 180 : 0, duration: 1.1, ease: 'expo.inOut' });
    else bigIn.style.transform = rev ? 'rotate(180deg)' : '';
    const a = A[cur];
    el.num.textContent = `${a[0]} · ${rev ? 'reversed' : 'upright'}`;
    el.weK.textContent = rev ? 'what we say, reversed' : 'what we say';
    S.scramble(el.we, rev ? a[5] : a[3], 700);
    if (rev && !toldRev) { toldRev = true; S.toast('reversed ✦ same card, more honest.'); }
  };
  el.rev.addEventListener('click', flip);
  $('.big').addEventListener('click', flip);
  render(0);

  /* =====================================================
     riffle: card backs shuffling past
     ===================================================== */
  const miniBack = S.mini(['/\\/\\/\\/\\/', '\\/\\/\\/\\/\\', '/\\/ ✦ \\/\\', '\\/\\/\\/\\/\\', '/\\/\\/\\/\\/']);
  $$('.riffle').forEach((rf) => {
    $$('.riffle__row', rf).forEach((row, j) => {
      row.innerHTML = Array.from({ length: 36 }, (_, i) => `<pre>${(i + j) % 7 === 3 ? S.mini(['', A[(i * 3 + j) % 22][0], A[(i * 3 + j) % 22][2], '', '']) : miniBack}</pre>`).join('');
      if (M) gsap.fromTo(row, { xPercent: j ? -30 : 0 }, { xPercent: j ? 0 : -30, ease: 'none', scrollTrigger: { trigger: rf, start: 'top bottom', end: 'bottom top', scrub: .4 } });
    });
  });

  /* =====================================================
     02 the fear index: how it sounds vs how it is. re-sort it.
     ===================================================== */
  S.ascii($('.fear .sec__ascii'), { avoid: '.fear .sec__head p, .fear .sec__head h2, .fear__bar, .fear__note', field: S.fields.roses(4), gain: .45 });
  const list = $('.fear__list');
  const W30 = 30;
  const barTxt = (v, ch, p = 1) => ch.repeat(Math.round(v * 3 * p)).padEnd(W30, '·');
  list.innerHTML = A.map((a, i) => `<li class="frow" data-i="${i}" data-cursor="read it">
      <span class="frow__n">${a[0]}</span>
      <span class="frow__name">${a[1].toLowerCase()}</span>
      <span class="frow__bars"><span class="frow__s" data-s>${barTxt(a[6], '▓', M ? 0 : 1)}</span><span class="frow__said">“${a[4]}”</span>
<span class="frow__i" data-v>${barTxt(a[7], '█', M ? 0 : 1)}</span> <span class="frow__i">${a[7]}/10</span></span>
    </li>`).join('');
  const rows = $$('.frow', list);
  rows.forEach((r) => r.addEventListener('click', () => jumpTo(Number(r.dataset.i))));
  if (M) {
    ScrollTrigger.batch(rows, {
      start: 'top 92%', once: true,
      onEnter: (batch) => batch.forEach((r, k) => {
        if (r.dataset.done) return; r.dataset.done = '1';
        const a = A[r.dataset.i], s = $('[data-s]', r), v = $('[data-v]', r), o = { p: 0 };
        gsap.from(r, { opacity: 0, x: -30, duration: .6, delay: k * .05, ease: 'power3.out' });
        gsap.to(o, { p: 1, duration: .9, delay: .15 + k * .05, ease: 'power2.out', onUpdate: () => { s.textContent = barTxt(a[6], '▓', o.p); v.textContent = barTxt(a[7], '█', o.p); } });
      }),
    });
  }
  const sorts = {
    deck: (a, b) => a - b,
    sounds: (a, b) => A[b][6] - A[a][6] || A[b][7] - A[a][7],
    is: (a, b) => A[b][7] - A[a][7] || A[b][6] - A[a][6],
  };
  $$('[data-sort]').forEach((btn) => btn.addEventListener('click', () => {
    $$('[data-sort]').forEach((b) => b.classList.toggle('is-on', b === btn));
    const order = [...rows].sort((r1, r2) => sorts[btn.dataset.sort](Number(r1.dataset.i), Number(r2.dataset.i)));
    // every bar is filled before the rows move, so nothing arrives empty
    rows.forEach((r) => { const v = A[r.dataset.i]; $('[data-s]', r).textContent = barTxt(v[6], '▓'); $('[data-v]', r).textContent = barTxt(v[7], '█'); gsap.set(r, { opacity: 1, x: 0 }); r.dataset.done = '1'; });
    const state = M && window.Flip ? Flip.getState(rows) : null;
    order.forEach((r) => list.appendChild(r));
    if (state) Flip.from(state, { duration: .9, ease: 'expo.inOut', stagger: .012, onComplete: () => ScrollTrigger.refresh() });
    if (btn.dataset.sort === 'is') S.toast('see? nothing above a 3.');
    if (btn.dataset.sort === 'sounds') S.toast('death and the tower, tied. classic.');
  }));

  /* =====================================================
     03 draw one: the card shakes, riffles, lands
     ===================================================== */
  const dSec = $('.draw'), dCard = $('.draw__card'), dPre = $('.draw__pre'), dG = $('[data-d-glyph]');
  const out = { num: $('[data-d-num]'), name: $('[data-d-name]'), we: $('[data-d-we]'), last: $('[data-d-last]') };
  S.ascii($('.draw .sec__ascii'), { avoid: '.draw__head p, .draw__head h2, .draw__out p, .draw__last, .draw__btn', field: S.fields.moon(.5, .5, .3), gain: .6, host: dSec });
  dPre.textContent = BACK;
  try {
    const last = JSON.parse(S.store.get('drawn') || 'null');
    if (last && A[last.n]) out.last.textContent = `last time you drew ${A[last.n][1].toLowerCase()}${last.r ? ', reversed' : ''}. you survived.`;
  } catch (e) {}
  let drawing = false, draws = 0;
  const draw = async () => {
    if (drawing) return;
    drawing = true;
    draws++;
    let n = Math.floor(Math.random() * 22), r = Math.random() < .3;
    if (allDeath) { n = 13; r = false; }
    if (lucky) { lucky = false; n = 17; r = false; }
    dSec.classList.remove('is-drawn');
    gsap.to(dG, { opacity: 0, duration: .2 });
    gsap.to([out.num, out.name, out.we], { opacity: 0, duration: .25 });
    if (M) {
      gsap.to(dCard, { rotate: 0, duration: .4, ease: 'power2.out' });
      gsap.fromTo(dCard, { x: -6 }, { x: 6, duration: .06, repeat: 7, yoyo: true, ease: 'none', clearProps: 'x' });
      if (dPre.textContent !== BACK) await S.morph(dPre, BACK, 300);
      for (let k = 0; k < 4; k++) await S.morph(dPre, FACES[(Math.random() * 22) | 0].join(''), 130);
      await S.morph(dPre, FACES[n].join(''), 650);
      if (r) await gsap.to(dCard, { rotate: 180, duration: .9, ease: 'expo.inOut' });
    } else {
      dPre.textContent = FACES[n].join('');
      dCard.style.transform = r ? 'rotate(180deg)' : '';
    }
    const a = A[n];
    dG.textContent = a[2];
    out.num.textContent = `${a[0]} · ${r ? 'reversed' : 'upright'}`;
    out.name.textContent = a[1].toLowerCase();
    out.we.textContent = r ? a[5] : a[3];
    gsap.to(dG, { opacity: 1, duration: .5 });
    if (M) {
      gsap.fromTo(out.name, { opacity: 0, filter: 'blur(16px)', y: 30 }, { opacity: 1, filter: 'blur(0px)', y: 0, duration: .9, ease: 'power3.out' });
      gsap.fromTo([out.num, out.we], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .6, stagger: .15, delay: .2 });
    } else gsap.set([out.num, out.name, out.we], { opacity: 1 });
    dSec.classList.add('is-drawn');
    $('[data-draw]').textContent = '[ draw again ]';
    if (draws === 2) S.toast('no take-backs. but ok, one more.');
    if (draws === 4) S.toast("the card isn't going to change its mind ✦");
    S.store.set('drawn', JSON.stringify({ n, r, t: Date.now() }));
    drawing = false;
  };
  $('[data-draw]').addEventListener('click', draw);
  dCard.addEventListener('click', draw);
  if (M) gsap.from(dCard, { y: 120, rotate: -10, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: dSec, start: 'top 65%' } });

  S.heads();
  S.footer();
  // console helper for this page
  S.card = (i) => jumpTo(S.clamp(Number(i) || 0, 0, 21));
})();
