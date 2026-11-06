/* =========================================================
   SOFT OMEN — readers.js (readers)
   the line-up: four photo cards, hover opens one →
   one chapter each (sticky photo, her rules, her card) →
   the quiz: who should read you
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const S = window.SO;
  const { $, $$ } = S;
  const M = S.motion;
  const A = S.ARCANA;
  const R = S.READERS;
  const ROMAN = ['I', 'II', 'III', 'IV'];
  const STAT = ['intuition', 'honesty', 'softness', 'texts back'];
  const bar = (v, k) => { const n = Math.round(v / 5); return `${STAT[k].padEnd(11)}[<b>${'█'.repeat(n)}</b>${'░'.repeat(20 - n)}] ${String(v).padStart(3)}`; };

  /* =====================================================
     00 the line-up
     ===================================================== */
  const row = $('[data-lineup]');
  row.innerHTML = R.map((r, i) => `
    <a class="lu" href="#${r.name.toLowerCase()}" data-cursor="meet ${r.name.toLowerCase()}">
      <span class="lu__frame"><span class="lu__pic" data-pic="${i}"><span class="slot-tag px">img/HOME/reader-${i + 1}.png</span></span></span>
      <span class="lu__num px">${ROMAN[i]}</span>
      <span class="lu__name script">${r.name.toLowerCase()}</span>
      <span class="lu__q px">“${r.quote}”</span>
    </a>`).join('');
  const lus = $$('.lu', row);
  lus.forEach((el, i) => {
    S.photo($('.lu__pic', el), `HOME/reader-${i + 1}.png`, R[i].name.toLowerCase(), 'lu__img');
    el.addEventListener('mouseenter', () => lus.forEach((x) => x.classList.toggle('is-open', x === el)));
    el.addEventListener('click', (e) => { e.preventDefault(); S.scrollTo('#' + R[i].name.toLowerCase()); });
  });
  row.addEventListener('mouseleave', () => lus.forEach((x) => x.classList.remove('is-open')));
  const mark = () => lus.forEach((x, i) => x.classList.toggle('is-picked', R[i].name === S.reader()));
  mark();

  /* =====================================================
     01-04 chapters: sticky photo, everything else scrolls past it
     ===================================================== */
  const ch = $('[data-chapters]');
  ch.innerHTML = R.map((r, i) => {
    const c = A[r.card];
    return `
    <section class="chap${i % 2 ? ' chap--flip' : ''}" id="${r.name.toLowerCase()}">
      <div class="chap__pin">
        <div class="chap__card">
          <span class="chap__pic" data-cpic="${i}"><span class="slot-tag px">img/HOME/reader-${i + 1}.png</span></span>
          <span class="chap__num px">${ROMAN[i]} · since ${r.since}</span>
          <span class="chap__cardname script">${r.name.toLowerCase()}</span>
        </div>
      </div>
      <div class="chap__body">
        <p class="px chap__k">0${i + 1} ✦ reader ${ROMAN[i].toLowerCase()} of iv</p>
        <h2 class="chap__name script">${r.name.toLowerCase()}</h2>
        <p class="chap__quote">“${r.quote}”</p>
        <p class="chap__desc">${r.desc}</p>
        <pre class="chap__stats" data-stats="${i}">${r.stats.map((v, k) => bar(0, k)).join('\n')}</pre>
        <div class="chap__rules">
          <p class="px">her rules</p>
          <ol>${r.rules.map((x) => `<li>${x}</li>`).join('')}</ol>
        </div>
        <div class="chap__two">
          <a class="chap__mine" href="deck.html#card-${r.card}" data-cursor="her card">
            <pre>${S.mini([c[0], '', c[2], '', c[1].replace(/^The /, '').toLowerCase()], 15)}</pre>
            <span class="px">her card ✦ ${c[1].toLowerCase()}</span>
          </a>
          <dl class="chap__facts px">
            <dt>texts back</dt><dd>${r.reply}</dd>
            <dt>reading since</dt><dd>${r.since}</dd>
            <dt>best at</dt><dd>${r.a[2]}</dd>
          </dl>
        </div>
        <div class="chap__btns">
          <button class="btn px" type="button" data-pick="${i}" data-cursor="select">[ select her ]</button>
          <a class="btn px" href="book.html?reader=${r.name}" data-cursor="book">[ book a night with her → ]</a>
        </div>
      </div>
    </section>`;
  }).join('');
  $$('.chap').forEach((sec, i) => {
    S.photo($('.chap__pic', sec), `HOME/reader-${i + 1}.png`, R[i].name.toLowerCase(), 'chap__img');
    const pre = $('[data-stats]', sec);
    const o = { p: 0 };
    const paint = () => (pre.innerHTML = R[i].stats.map((v, k) => bar(Math.round(v * o.p), k)).join('\n'));
    if (M) {
      gsap.to(o, { p: 1, duration: 1.6, ease: 'power2.out', onUpdate: paint, scrollTrigger: { trigger: pre, start: 'top 85%' } });
      gsap.from($('.chap__name', sec), { yPercent: 60, opacity: 0, filter: 'blur(20px)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: sec, start: 'top 70%' } });
      gsap.from($$('.chap__rules li', sec), { x: -30, opacity: 0, stagger: .12, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: $('.chap__rules', sec), start: 'top 85%' } });
      // the photo card tilts a little as her chapter scrolls by
      gsap.fromTo($('.chap__card', sec), { rotate: i % 2 ? 4 : -4 }, { rotate: i % 2 ? -3 : 3, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } });
    } else { o.p = 1; paint(); }
  });
  const syncPick = () => {
    $$('[data-pick]').forEach((b) => {
      const on = R[Number(b.dataset.pick)].name === S.reader();
      b.textContent = on ? '[ ✦ reading you ]' : '[ select her ]';
      b.classList.toggle('is-on', on);
    });
    mark();
  };
  $$('[data-pick]').forEach((b) => b.addEventListener('click', () => {
    const r = R[Number(b.dataset.pick)];
    S.setReader(r.name); syncPick();
    S.toast(`${r.name.toLowerCase()} is shuffling for you ✦`);
  }));
  syncPick();

  /* =====================================================
     05 the quiz: four questions, one at a time
     ===================================================== */
  S.ascii($('.quiz .sec__ascii'), { avoid: '.quiz .sec__head p, .quiz .sec__head h2, .quiz__box', field: S.fields.rosesFrom([{ x: .9, y: .25, k: 6, r: .18, sp: .2 }, { x: .06, y: .8, k: 4, r: .15, sp: -.2 }]), gain: .7 });
  const QS = ['you want someone who is…', 'the best time to know something is…', 'tell it to me…', 'the card that scares you least…'];
  const qbar = $('[data-qbar]'), qq = $('[data-qq]'), qa = $('[data-qa]'), qres = $('[data-qres]');
  let step = 0, score = [0, 0, 0, 0];
  const ask = () => {
    qres.hidden = true; qq.hidden = false; qa.hidden = false;
    qbar.textContent = `question ${step + 1} / 4  [${'█'.repeat((step + 1) * 5)}${'░'.repeat(20 - (step + 1) * 5)}]`;
    S.scramble(qq, QS[step], 500);
    const order = [0, 1, 2, 3].sort(() => Math.random() - .5);
    qa.innerHTML = order.map((i) => `<button type="button" class="quiz__opt" data-r="${i}" data-cursor="this one">${R[i].a[step]}</button>`).join('');
    if (M) gsap.from($$('.quiz__opt', qa), { y: 20, opacity: 0, stagger: .07, duration: .6, ease: 'power3.out' });
    $$('.quiz__opt', qa).forEach((b) => b.addEventListener('click', () => {
      score[Number(b.dataset.r)]++;
      b.classList.add('is-on');
      setTimeout(() => { step++; step < 4 ? ask() : result(); }, 320);
    }));
  };
  const result = () => {
    const best = score.indexOf(Math.max(...score));
    const r = R[best];
    qbar.textContent = 'question 4 / 4  [████████████████████] ✦';
    qq.hidden = true; qa.hidden = true; qres.hidden = false;
    qres.innerHTML = `
      <span class="quiz__pic" data-qpic></span>
      <div>
        <p class="px">the cards say</p>
        <p class="quiz__name script">${r.name.toLowerCase()}</p>
        <p class="quiz__why">${r.desc}</p>
        <button class="btn px" type="button" data-qpick data-cursor="select">[ select her ]</button>
        <button class="btn px" type="button" data-qagain data-cursor="again">[ ask again ]</button>
      </div>`;
    S.photo($('[data-qpic]', qres), `HOME/reader-${best + 1}.png`, r.name.toLowerCase(), 'quiz__img');
    if (M) gsap.from(qres, { y: 40, opacity: 0, filter: 'blur(12px)', duration: 1, ease: 'expo.out' });
    $('[data-qpick]', qres).addEventListener('click', () => { S.setReader(r.name); syncPick(); S.toast(`${r.name.toLowerCase()} it is ✦`); });
    $('[data-qagain]', qres).addEventListener('click', () => { step = 0; score = [0, 0, 0, 0]; ask(); });
  };
  ask();

  /* ---------- riffle ---------- */
  S.riffle();

  /* ---------- start ---------- */
  S.pageLoader('readers', () => S.ready(() => {
    S.bigIn($('.lineup__title'));
    if (M) gsap.from(lus, { y: 200, rotate: (i) => (i - 1.5) * 8, opacity: 0, stagger: .1, duration: 1.4, ease: 'expo.out', delay: .2 });
  }));
  S.heads(); S.footer();
})();
