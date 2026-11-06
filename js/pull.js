/* =========================================================
   SOFT OMEN — pull.js (the pull)
   ask it out loud (your question becomes the giant line) →
   the table: pick a spread, turn the cards yourself, your reader
   answers in her own voice → the receipt → the drawer
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const S = window.SO;
  const { $, $$ } = S;
  const M = S.motion;
  const A = S.ARCANA;
  let allDeath = false, lucky = false;
  document.addEventListener('konami', () => { allDeath = true; deal(); });
  document.addEventListener('lucky', () => { lucky = true; deal(); });

  /* ---------- the cards on the table ---------- */
  const W = 15;
  const back = () => S.mini(['/\\/\\/\\/\\/\\/\\/', '\\/\\/\\/\\/\\/\\/\\', '/\\/\\/\\/\\/\\/\\/', '\\/\\/\\ ✦ \\/\\/\\', '/\\/\\/\\/\\/\\/\\/', '\\/\\/\\/\\/\\/\\/\\', '/\\/\\/\\/\\/\\/\\/'], W);
  const face = (n) => {
    const [num, name, glyph] = A[n];
    return S.mini([num, '·  ·  ·', ':     :', glyph, ':     :', '·  ·  ·', name.replace(/^The /, '').toLowerCase().slice(0, 13)], W);
  };
  const SPREADS = {
    1: { slots: ['the answer'], pos: [[0, 0]] },
    3: { slots: ["what's gone", "what's here", "what's coming"], pos: [[-1, 0], [0, 0], [1, 0]] },
    5: { slots: ['you', 'what crosses you', 'the root', 'the past', 'what comes'], pos: [[0, -.4], [.28, -.22, 90], [0, .8], [-1.15, -.4], [1.15, -.4]] },
  };
  // how each reader says it
  const VOICE = {
    NOX: (t, rev) => `${rev ? 'upside down. ' : ''}${t} (she turns the lamp back on.)`,
    LACE: (t, rev) => `angel… ${rev ? "it came out upside down, that's okay. " : ''}${t} ♡`,
    DREAD: (t) => t.split('. ')[0].replace(/\.$/, '') + '. next.',
    BLUSH: (t, rev) => `ok so ${rev ? "it's reversed which is SO you, " : ''}${t} screenshotting this`,
  };

  /* =====================================================
     00 ask: your question becomes the giant line
     ===================================================== */
  const ask = $('.ask'), echo = $('[data-echo]'), input = $('#q');
  S.ascii($('.ask .sec__ascii'), { avoid: '.ask > .px, .ask__echo, .ask__form, .ask__hint', field: S.fields.rosesFrom([{ x: .86, y: .3, k: 5, r: .2, sp: .18 }, { x: .1, y: .9, k: 4, r: .16, sp: -.2 }]), host: ask, radius: 180 });
  let question = '';
  const fitEcho = () => {
    const len = Math.max(6, echo.textContent.length);
    echo.style.fontSize = `clamp(64px, ${Math.min(16, 150 / len)}vw, 290px)`;
  };
  const setEcho = (t) => { echo.textContent = t || 'ask it.'; fitEcho(); };
  input.addEventListener('input', () => {
    question = input.value.trim();
    setEcho(question ? question.toLowerCase().replace(/\??$/, '?') : '');
    if (M) gsap.fromTo(echo, { filter: 'blur(6px)' }, { filter: 'blur(0px)', duration: .4 });
  });
  $$('[data-ex]').forEach((b) => b.addEventListener('click', () => { input.value = b.textContent; input.dispatchEvent(new Event('input')); input.focus(); }));
  $('.ask__form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!question) { S.toast('one question. out loud.'); input.focus(); return; }
    deal();
    S.scrollTo('#table');
  });
  fitEcho();

  /* =====================================================
     01 the table: deal face down, turn them yourself
     ===================================================== */
  S.ascii($('.table .sec__ascii'), { avoid: '.table .sec__head p, .table .sec__head h2, .table__spreads, .chat, .felt', field: S.fields.moon(.5, .55, .3), gain: .5 });
  const felt = $('[data-felt]'), log = $('[data-log]'), hint = $('[data-hint]');
  let spread = 1, hand = [], turned = 0;
  const pickCards = (k) => {
    if (allDeath) return Array.from({ length: k }, () => ({ n: 13, rev: false }));
    if (lucky) { lucky = false; return [17, 19, 21, 3, 14].slice(0, k).map((n) => ({ n, rev: false })); }
    return [...A.keys()].sort(() => Math.random() - .5).slice(0, k).map((n) => ({ n, rev: Math.random() < .3 }));
  };
  const say = (who, html, cls = '') => {
    const p = document.createElement('p');
    p.className = 'chat__msg ' + cls;
    p.innerHTML = who ? `<b>${who.toLowerCase()}</b> ${html}` : html;
    log.appendChild(p);
    if (M) gsap.from(p, { y: 16, opacity: 0, filter: 'blur(8px)', duration: .6, ease: 'power3.out' });
    log.scrollTop = log.scrollHeight;
  };
  const deal = () => {
    const sp = SPREADS[spread];
    hand = pickCards(sp.slots.length);
    turned = 0;
    felt.innerHTML = ''; log.innerHTML = '';
    felt.dataset.n = spread;
    say('', `<i>${question ? `“${question.toLowerCase()}”` : 'no question. the cards will pick one.'}</i>`, 'chat__msg--you');
    hand.forEach((h, i) => {
      const [x, y, rot = 0] = sp.pos[i];
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'tcard';
      el.dataset.cursor = 'turn it';
      el.style.setProperty('--x', x); el.style.setProperty('--y', y); el.style.setProperty('--r', rot + 'deg');
      el.innerHTML = `<pre>${back()}</pre><span class="tcard__k px">${S.pad(i + 1)} · ${sp.slots[i]}</span>`;
      el.addEventListener('click', () => turn(i, el), { once: true });
      felt.appendChild(el);
      if (M) gsap.from(el, { x: () => -felt.offsetWidth * .6, y: -120, rotate: -40 + i * 9, opacity: 0, duration: 1, delay: .12 * i, ease: 'expo.out' });
    });
    hint.textContent = 'click a card to turn it ✦';
    paper.textContent = 'turn all the cards first.';
  };
  const turn = async (i, el) => {
    const h = hand[i], [num, name, , soft, , reversed] = A[h.n];
    el.classList.add('is-turning');
    const pre = $('pre', el);
    if (M) gsap.to(el, { scale: 1.08, duration: .2, yoyo: true, repeat: 1 });
    await S.morph(pre, face(h.n), 700);
    el.classList.add('is-up'); el.classList.toggle('is-rev', h.rev);
    el.dataset.cursor = name.toLowerCase();
    turned++;
    const r = S.reader();
    say('', `${S.pad(i + 1)} · ${SPREADS[spread].slots[i]} → <em>${num} · ${name.toLowerCase()}${h.rev ? ' (reversed)' : ''}</em>`, 'chat__msg--card');
    setTimeout(() => say(r, VOICE[r](h.rev ? reversed : soft, h.rev)), 450);
    if (turned === hand.length) {
      hint.textContent = 'all turned ✦ your receipt is printing ↓';
      setTimeout(finish, 900);
    } else hint.textContent = `${hand.length - turned} to go ✦`;
  };
  $$('[data-spread]').forEach((b) => b.addEventListener('click', () => {
    spread = Number(b.dataset.spread);
    $$('[data-spread]').forEach((x) => x.classList.toggle('is-on', x === b));
    deal();
  }));
  document.addEventListener('reader:change', () => {});

  /* =====================================================
     02 the receipt: printed line by line
     ===================================================== */
  const paper = $('[data-paper]');
  const RW = 38;
  const row = (k, v) => (k.padEnd(14, '.') + ' ' + v).slice(0, RW).padEnd(RW);
  const wrap = (t) => { const out = []; let l = ''; t.split(' ').forEach((w) => { if ((l + ' ' + w).trim().length > RW) { out.push(l.trim()); l = w; } else l += ' ' + w; }); out.push(l.trim()); return out.map((x) => x.padEnd(RW)); };
  let receipt = '';
  const finish = () => {
    const now = new Date();
    const lines = [
      S.center('✦ SOFT OMEN ✦', RW), S.center('via dei cappellari 7, milano', RW), S.center(now.toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }), RW), '-'.repeat(RW),
      row('reader', S.reader().toLowerCase()), ...wrap('question: ' + (question || '(none, the cards chose)').toLowerCase()), '-'.repeat(RW),
      ...hand.flatMap((h, i) => [row(SPREADS[spread].slots[i], `${A[h.n][0]} ${A[h.n][1].toLowerCase()}${h.rev ? ' ↓' : ''}`), ...wrap('  ' + (h.rev ? A[h.n][5] : A[h.n][3])), '']),
      '-'.repeat(RW), row('fear level', '█'.repeat(Math.max(...hand.map((h) => A[h.n][7]))) + '░'.repeat(3 - Math.max(...hand.map((h) => A[h.n][7]))) + ' / 3'), row('total', '€0.00'), S.center("this one's on the house.", RW), S.center('* * * * * * * * *', RW),
    ];
    receipt = lines.join('\n');
    paper.textContent = '';
    if (M) {
      let k = 0;
      const tick = () => { paper.textContent = lines.slice(0, ++k).join('\n'); if (k < lines.length) setTimeout(tick, 45); };
      tick();
    } else paper.textContent = receipt;
    // into the drawer
    const past = JSON.parse(S.store.get('pulls') || '[]');
    past.unshift({ q: question, r: S.reader(), c: hand.map((h) => [h.n, h.rev ? 1 : 0]), t: now.getTime() });
    S.store.set('pulls', JSON.stringify(past.slice(0, 6)));
    drawer();
  };
  $('[data-copy]').addEventListener('click', async () => {
    if (!receipt) { S.toast('turn the cards first ✦'); return; }
    try { await navigator.clipboard.writeText(receipt); S.toast('copied ✦ paste it somewhere safe'); } catch (e) { S.toast("couldn't copy. take a screenshot ✦"); }
  });
  $('[data-again]').addEventListener('click', () => { deal(); S.scrollTo('#top'); setTimeout(() => input.focus(), 900); });

  /* =====================================================
     03 the drawer: your last six pulls
     ===================================================== */
  const list = $('[data-past]');
  const drawer = () => {
    const past = JSON.parse(S.store.get('pulls') || '[]');
    if (!past.length) { list.innerHTML = '<li class="past__empty">nothing yet. the deck is patient.</li>'; return; }
    list.innerHTML = past.map((p) => `
      <li class="past__item">
        <p class="past__d px">${new Date(p.t).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toLowerCase()} · ${p.r.toLowerCase()}</p>
        <p class="past__q">${p.q ? '“' + p.q.toLowerCase().replace(/[<>]/g, '') + '”' : '<i>no question</i>'}</p>
        <div class="past__cards">${p.c.map(([n, rev]) => `<a href="deck.html#card-${n}" class="${rev ? 'is-rev' : ''}" data-cursor="${A[n][1].toLowerCase()}"><pre>${S.mini([A[n][0], A[n][2], ''], 7)}</pre></a>`).join('')}</div>
      </li>`).join('');
    if (M) gsap.from($$('.past__item', list), { y: 30, opacity: 0, stagger: .08, duration: .8, ease: 'expo.out', scrollTrigger: { trigger: list, start: 'top 85%' } });
  };
  $('[data-clear]').addEventListener('click', () => { S.store.set('pulls', '[]'); drawer(); S.toast('forgotten ✦ the cards never tell'); });
  drawer();

  /* ---------- riffle ---------- */
  S.riffle();

  /* ---------- start ---------- */
  deal();
  S.pageLoader('the pull', () => S.ready(() => {
    S.bigIn(echo);
    if (M) gsap.from('.ask__form, .ask__hint, .ask > .px', { y: 24, opacity: 0, stagger: .1, duration: .9, ease: 'power3.out', delay: .4 });
  }));
  S.heads(); S.footer();
})();
