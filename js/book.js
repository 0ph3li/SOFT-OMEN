/* =========================================================
   SOFT OMEN — book.js (book)
   sleep on it (a countdown to 23:00) → a moon calendar, closed on
   full moons → the form, the ticket prints while you type → house rules
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const S = window.SO;
  const { $, $$ } = S;
  const M = S.motion;
  const MENU = S.MENU, R = S.READERS;
  const qs = new URLSearchParams(location.search);

  /* =====================================================
     00 the doors open at 23:00, milano time
     ===================================================== */
  S.ascii($('.bk-hero .sec__ascii'), { avoid: '.bk-hero > .px, .bk-hero .ph__title > span, .bk-hero__row', field: S.fields.moon(.5, .35, .2), host: $('.bk-hero'), gain: .7, radius: 180 });
  const cnt = $('[data-count]'), cntK = $('[data-count-k]');
  const rome = () => {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Rome', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
    return Number(p.hour) * 3600 + Number(p.minute) * 60 + Number(p.second);
  };
  const hms = (s) => [s / 3600, (s % 3600) / 60, s % 60].map((v) => S.pad(v)).join(':');
  const tick = () => {
    const t = rome(), open = 23 * 3600, close = 3 * 3600 + 33 * 60;
    if (t >= open || t < close) { cntK.textContent = 'we are reading. the doors close in'; cnt.textContent = hms(((close - t) + 86400) % 86400); }
    else { cntK.textContent = 'the doors open in'; cnt.textContent = hms(open - t); }
  };
  tick(); setInterval(tick, 1000);

  /* =====================================================
     01 the next 28 nights, by the moon
     ===================================================== */
  S.ascii($('.nights .sec__ascii'), { avoid: '.nights .sec__head p, .nights .sec__head h2, .cal', field: S.fields.rosesFrom([{ x: .9, y: .15, k: 5, r: .14, sp: .2 }]), gain: .6 });
  const SYN = 29.530588853, REF = Date.UTC(2000, 0, 6, 18, 14);
  const moonAt = (d) => {
    const age = (((d.getTime() - REF) / 864e5) % SYN + SYN) % SYN;
    const lit = Math.round((1 - Math.cos((2 * Math.PI * age) / SYN)) / 2 * 100);
    return { age, lit };
  };
  // a little ascii moon: lit columns fill from the right while waxing, from the left while waning
  const moonArt = (age, lit) => {
    const rows = 5, cols = 9, out = [];
    for (let r = 0; r < rows; r++) {
      let l = '';
      for (let c = 0; c < cols; c++) {
        const x = (c - 4) / 4, y = (r - 2) / 2;
        if (x * x + y * y > 1.05) { l += ' '; continue; }
        const w = Math.sqrt(Math.max(0, 1 - y * y));
        const t = age < SYN / 2 ? 1 - 2 * (lit / 100) : -1 + 2 * (lit / 100);
        const on = age < SYN / 2 ? x > t * w : x < t * w;
        l += on ? '@' : '·';
      }
      out.push(l);
    }
    return out.join('\n');
  };
  const cal = $('[data-cal]');
  const today = new Date();
  const NIGHTS = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() + i); d.setHours(23, 0, 0, 0);
    const m = moonAt(d);
    return { d, ...m, full: Math.abs(m.age - SYN / 2) < .8 };
  });
  let night = NIGHTS.findIndex((n) => !n.full);
  cal.innerHTML = NIGHTS.map((n, i) => `
    <button type="button" class="night${n.full ? ' is-full' : ''}${i === night ? ' is-on' : ''}" role="radio" aria-checked="${i === night}" data-n="${i}" ${n.full ? 'aria-disabled="true"' : ''} data-cursor="${n.full ? "we're busy" : 'this night'}">
      <span class="night__d px">${i === 0 ? 'tonight' : n.d.toLocaleDateString('en-GB', { weekday: 'short' }).toLowerCase()}</span>
      <span class="night__n">${n.d.getDate()}</span>
      <pre class="night__m">${moonArt(n.age, n.lit)}</pre>
      <span class="night__p px">${n.full ? "full · we're busy" : n.lit + '%'}</span>
    </button>`).join('');
  $$('.night', cal).forEach((b) => b.addEventListener('click', () => {
    const i = Number(b.dataset.n);
    if (NIGHTS[i].full) { S.toast('full moon ✦ closed. we are busy.'); if (M) gsap.fromTo(b, { x: -8 }, { x: 0, duration: .6, ease: 'elastic.out(1, .3)' }); return; }
    night = i;
    $$('.night', cal).forEach((x) => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-checked', x === b); });
    draw();
  }));
  if (M) gsap.from($$('.night', cal), { y: 40, opacity: 0, stagger: { each: .025, from: 'start' }, duration: .8, ease: 'expo.out', scrollTrigger: { trigger: cal, start: 'top 80%' } });
  const nightLabel = () => { const n = NIGHTS[night]; return (night === 0 ? 'tonight' : n.d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' }).toLowerCase()) + ', 23:00'; };

  /* =====================================================
     02 the form + the ticket
     ===================================================== */
  let reading = Math.min(MENU.length - 1, Math.max(0, Number(qs.get('r')) || 0));
  let reader = R.find((r) => r.name === (qs.get('reader') || '').toUpperCase()) ? qs.get('reader').toUpperCase() : S.reader();
  const chips = $('[data-readings]');
  chips.innerHTML = MENU.map(([n, , t, p], i) => `<button type="button" class="chip${i === reading ? ' is-on' : ''}" data-r="${i}" data-cursor="${p}"><span>${n}</span><small>${p} · ${t}</small></button>`).join('');
  $$('.chip', chips).forEach((b) => b.addEventListener('click', () => { reading = Number(b.dataset.r); $$('.chip', chips).forEach((x) => x.classList.toggle('is-on', x === b)); draw(); }));
  const whos = $('[data-whos]');
  whos.innerHTML = R.map((r, i) => `<button type="button" class="who${r.name === reader ? ' is-on' : ''}" data-who="${r.name}" data-cursor="${r.quote}"><span class="who__pic" data-wp="${i}"></span><span class="who__n">${r.name.toLowerCase()}</span></button>`).join('');
  $$('.who', whos).forEach((b, i) => {
    S.photo($('.who__pic', b), `HOME/reader-${i + 1}.png`, R[i].name.toLowerCase(), 'who__img');
    b.addEventListener('click', () => { reader = b.dataset.who; S.setReader(reader); $$('.who', whos).forEach((x) => x.classList.toggle('is-on', x === b)); draw(); });
  });
  const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
  const NOTES = ['xs: we say it like a horoscope.', 's: a little sting, then a compliment.', 'm: the truth, with a cookie after.', 'l: the truth. no cookie.', 'xl: everything. bring a friend.'];
  const truth = $('#truth');
  truth.addEventListener('input', () => {
    const v = Number(truth.value);
    $('[data-truth-v]').textContent = SIZES[v].toLowerCase();
    S.scramble($('[data-truth-n]'), NOTES[v], 400);
    truth.style.setProperty('--v', v / 4);
    draw();
  });
  const form = $('.bk__form'), ticket = $('[data-ticket]'), ics = $('[data-ics]');
  let booked = false;
  const W = 42;
  const tRow = (k, v) => '|  ' + k.padEnd(10, '.') + ' ' + (v || '_'.repeat(8)).slice(0, W - 15).padEnd(W - 14) + '|';
  const tLine = (t) => '|' + S.center(t, W - 1) + '|';
  const draw = () => {
    const fd = new FormData(form);
    const holes = '|' + ' o'.repeat(Math.floor((W - 1) / 2)).padEnd(W - 1) + '|';
    const n = NIGHTS[night];
    ticket.textContent = [
      '.' + '-'.repeat(W - 1) + '.',
      tLine('✦  SOFT OMEN  ✦'),
      tLine('admit one, softly'),
      holes,
      tRow('name', (fd.get('name') || '').trim().toLowerCase()),
      tRow('question', (fd.get('q') || '').trim().toLowerCase()),
      tRow('night', nightLabel()),
      tRow('moon', `${n.lit}% lit`),
      tRow('reading', MENU[reading][0]),
      tRow('price', MENU[reading][3]),
      tRow('reader', reader.toLowerCase()),
      tRow('truth', SIZES[truth.value].toLowerCase()),
      holes,
      tLine(booked ? '✦ ✦  BOOKED  ✦ ✦' : 'not booked yet'),
      tLine("it'll be soft. we promise."),
      "'" + '-'.repeat(W - 1) + "'",
    ].join('\n');
  };
  form.addEventListener('input', () => { if (booked) { booked = false; ticket.classList.remove('is-booked'); ics.hidden = true; } draw(); });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get('name') || '').trim(), q = (fd.get('q') || '').trim();
    if (!name || !q) {
      const f = !name ? form.elements.name : form.elements.q;
      S.toast(!name ? 'a name, even a fake one ✦' : 'one question. you have one.');
      f.focus();
      if (M) gsap.fromTo(f.closest('.bk__f'), { x: -10 }, { x: 0, duration: .6, ease: 'elastic.out(1, .3)' });
      return;
    }
    booked = true;
    S.store.set('booking', JSON.stringify({ name, q, size: SIZES[truth.value], night: nightLabel(), reader, reading: MENU[reading][0] }));
    const before = ticket.textContent; draw(); const after = ticket.textContent; ticket.textContent = before;
    S.morph(ticket, after, 900).then(() => ticket.classList.add('is-booked'));
    if (M) gsap.fromTo(ticket, { rotate: -3, scale: 1 }, { rotate: 2, scale: 1.04, duration: .25, yoyo: true, repeat: 1, ease: 'power2.out' });
    // a calendar file, made right here. nothing leaves the page
    const n = NIGHTS[night].d, pad = (v) => String(v).padStart(2, '0');
    const dt = (d, h, m) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(h)}${pad(m)}00`;
    const end = new Date(n); end.setMinutes(23 * 60 + Math.max(15, parseInt(MENU[reading][2], 10) || 15));
    const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//SOFT OMEN//EN', 'BEGIN:VEVENT', `UID:${Date.now()}@softomen`, `DTSTART;TZID=Europe/Rome:${dt(n, 23, 0)}`, `DTEND;TZID=Europe/Rome:${dt(end, end.getHours(), end.getMinutes())}`,
      `SUMMARY:SOFT OMEN · ${MENU[reading][0]} with ${reader.toLowerCase()}`, 'LOCATION:via dei cappellari 7\\, milano', `DESCRIPTION:${q.replace(/[,;\\]/g, ' ')}. it'll be soft. we promise.`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    ics.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar' }));
    ics.download = 'soft-omen.ics';
    ics.hidden = false;
    S.toast(`booked ✦ see you ${nightLabel()}`);
  });
  ics.addEventListener('click', (e) => { if (ics.getAttribute('href') === '#') e.preventDefault(); });
  // she comes back: her last booking is filled in
  try {
    const last = JSON.parse(S.store.get('booking') || 'null');
    if (last && !qs.get('r')) { form.elements.name.value = last.name || ''; }
  } catch (e) {}
  draw();
  if (M) gsap.from(ticket, { y: 80, rotate: -14, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.bk__grid', start: 'top 80%' } });

  /* =====================================================
     03 house rules: one per line, each one struck through and corrected
     ===================================================== */
  const RULES = [
    ['be on time.', 'be on time-ish. the cards wait.'],
    ['no phones on the table.', 'no phones on the table. not even face down.'],
    ['one question.', 'one question. the real one, not the one you typed.'],
    ['no recording.', "no recording. you'll remember the part that matters."],
    ['bring cash.', 'bring cash, or vibes on the 7th.'],
    ["don't bring him.", "don't bring him. he's already in the cards."],
  ];
  const rl = $('[data-rules]');
  rl.innerHTML = RULES.map(([a, b], i) => `<li class="rule"><span class="px">${S.pad(i + 1)}</span><span class="rule__t"><s>${a}</s><b>${b}</b></span></li>`).join('');
  if (M) $$('.rule', rl).forEach((li) => {
    gsap.timeline({ scrollTrigger: { trigger: li, start: 'top 80%' } })
      .from(li, { y: 40, opacity: 0, duration: .8, ease: 'power3.out' })
      .from($('s', li), { '--s': 0, duration: .5, ease: 'power2.inOut' }, '-=.2')
      .from($('b', li), { opacity: 0, filter: 'blur(12px)', x: -20, duration: .8, ease: 'power3.out' }, '-=.1');
  });

  /* ---------- riffle ---------- */
  S.riffle();

  /* ---------- start ---------- */
  S.pageLoader('book a night', () => S.ready(() => {
    $$('.bk-hero .ph__title > span').forEach((s, i) => S.bigIn(s, i * .25));
    if (M) gsap.from('.bk-hero__row > *', { y: 60, opacity: 0, stagger: .15, duration: 1.2, ease: 'expo.out', delay: .4 });
    if (qs.get('r') || qs.get('reader')) setTimeout(() => S.scrollTo('#book'), 300);
  }));
  S.heads(); S.footer();
})();
