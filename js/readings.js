/* =========================================================
   SOFT OMEN — readings.js (readings)
   hot pink: cash or vibes → the menu (open a reading, its spread
   draws itself) → the fine print → asked at 3am
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const S = window.SO;
  const { $, $$ } = S;
  const M = S.motion;
  const MENU = S.MENU;

  /* =====================================================
     00 hot pink hero + a price ticker
     ===================================================== */
  S.ascii($('.rg-hero .sec__ascii'), { avoid: '.rg-hero > .px, .rg-hero .ph__title > span, .ph__lede, .rg-hero__slot', field: S.fields.rosesFrom([{ x: .8, y: .2, k: 6, r: .22, sp: .2 }, { x: .05, y: .75, k: 4, r: .2, sp: -.15 }]), host: $('.rg-hero'), base: '5,3,4', hot: '255,255,255', alpha: .1, gain: .9 });
  const ticker = $('[data-ticker]');
  const tline = MENU.map(([n, , , p]) => ` ${n.toUpperCase()} ${p} ✦`).join('') + ' VIBES ACCEPTED ON THE 7TH ✦';
  ticker.textContent = (tline + tline + tline + tline);
  if (M) gsap.to(ticker, { xPercent: -50, duration: 30, ease: 'none', repeat: -1 });

  /* =====================================================
     01 the menu: rows that open. the spread draws itself
     ===================================================== */
  S.ascii($('.rg-menu .sec__ascii'), { avoid: '.rg-menu .sec__head p, .rg-menu .sec__head h2, .rg-list', field: S.fields.moon(.86, .2, .1), gain: .6 });
  const list = $('[data-list]');
  list.innerHTML = MENU.map(([n, d, t, p, k, lay, leave], i) => `
    <li class="rg" data-i="${i}">
      <button class="rg__top" type="button" aria-expanded="false" data-cursor="open it">
        <span class="rg__i px">${S.pad(i + 1)}</span>
        <span class="rg__n script">${n}</span>
        <span class="rg__d">${d}</span>
        <span class="rg__p">${p}<small>${t}</small></span>
        <span class="rg__plus" aria-hidden="true">+</span>
      </button>
      <div class="rg__body"><div class="rg__in">
        <pre class="rg__lay" data-lay></pre>
        <dl class="rg__facts">
          <dt class="px">cards</dt><dd>${k || 'none. we keep them.'}</dd>
          <dt class="px">time</dt><dd>${t}</dd>
          <dt class="px">price</dt><dd>${p}</dd>
          <dt class="px">you leave with</dt><dd>${leave}</dd>
        </dl>
        <a class="btn px rg__book" href="book.html?r=${i}" data-cursor="book">[ book ${n} → ]</a>
      </div></div>
    </li>`).join('');
  const rows = $$('.rg', list);
  const drawLay = (el, lines) => {
    // the spread is dealt: blank, then each card's box is filled in, char by char
    const to = lines.join('\n');
    el.textContent = to.replace(/[^\n]/g, ' ');
    S.morph(el, to, 1100);
  };
  const open = (row, on) => {
    const body = $('.rg__body', row), btn = $('.rg__top', row);
    row.classList.toggle('is-open', on);
    btn.setAttribute('aria-expanded', on);
    if (M) gsap.to(body, { height: on ? 'auto' : 0, duration: on ? .8 : .5, ease: 'expo.inOut', onComplete: () => ScrollTrigger.refresh() });
    else body.style.height = on ? 'auto' : '0px';
    if (on) drawLay($('[data-lay]', row), MENU[Number(row.dataset.i)][5]);
  };
  rows.forEach((row) => $('.rg__top', row).addEventListener('click', () => {
    const on = !row.classList.contains('is-open');
    rows.forEach((r) => r !== row && r.classList.contains('is-open') && open(r, false));
    open(row, on);
  }));
  if (M) gsap.from(rows, { x: -60, opacity: 0, stagger: .08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: list, start: 'top 80%' } });
  // readings.html#r-2 opens that one
  const m = location.hash.match(/^#r-(\d)$/);

  /* =====================================================
     02 the fine print: an ascii table, a row lights up under the mouse
     ===================================================== */
  const COLS = [['reading', 20], ['cards', 7], ['minutes', 9], ['crying ok', 11], ['follow-up', 13], ['he comes up*', 13]];
  const DATA = [
    ['the 3am', '1', '7', 'a little', 'no', 'yes'],
    ['the situationship', '5', '20', 'yes', 'one text', 'yes, a lot'],
    ['the exit interview', '3', '30', 'encouraged', 'a letter', 'by name'],
    ['the full moon', '7', '45', 'yes', 'yes', 'yes'],
    ['the 777', '7', '77', 'happy tears', 'a lucky week', 'only if lucky'],
    ['the soft no', '0', '0', 'no need', 'never', 'we know.'],
  ];
  const line = (ch = '-', j = '+') => j + COLS.map(([, w]) => ch.repeat(w + 2)).join(j) + j;
  const cells = (vals) => '|' + vals.map((v, k) => ' ' + String(v).slice(0, COLS[k][1]).padEnd(COLS[k][1]) + ' ').join('|') + '|';
  const fine = $('[data-fine]');
  fine.innerHTML = [line('='), cells(COLS.map(([h]) => h)), line('='), ...DATA.map((r, i) => `<span class="fine__row" data-cursor="${r[0]}">${cells(r)}</span>`), line('-')].join('\n');
  if (M) {
    const fr = $$('.fine__row', fine);
    gsap.from(fr, { opacity: 0, x: -20, stagger: .08, duration: .6, scrollTrigger: { trigger: fine, start: 'top 80%' } });
  }

  /* =====================================================
     03 asked at 3am: an accordion, answers are typed in
     ===================================================== */
  const FAQ = [
    ['what if i pull death?', "then something ends. usually a habit. once, a lease. nobody has ever died of death."],
    ['can you read for him?', 'we read for you. he is in the cards anyway. he always is.'],
    ['do i need to believe in it?', "no. you need to sit down and listen for twenty minutes. that's already a lot, these days."],
    ['why are you only open at night?', "because nobody asks the real question at 4pm. and the lamp looks better."],
    ['can i pay in vibes?', 'on the 7th of every month, yes. the 777 only. bring good ones.'],
    ['what do i bring?', 'one question. a name, even a fake one. no phone on the table.'],
    ["what if i don't like the answer?", 'book the soft no next time. we tell you nothing. it helps.'],
  ];
  S.ascii($('.faq .sec__ascii'), { avoid: '.faq .sec__head p, .faq .sec__head h2, .faq__list', field: S.fields.rosesFrom([{ x: .92, y: .4, k: 5, r: .18, sp: .2 }]), gain: .6 });
  const fq = $('[data-faq]');
  fq.innerHTML = FAQ.map(([q], i) => `
    <div class="fq">
      <button class="fq__q" type="button" aria-expanded="false" data-cursor="ask"><span class="px">${S.pad(i + 1)}</span><span class="fq__t">${q}</span><span class="fq__plus" aria-hidden="true">+</span></button>
      <p class="fq__a" data-a="${i}"></p>
    </div>`).join('');
  $$('.fq', fq).forEach((el, i) => $('.fq__q', el).addEventListener('click', () => {
    const on = !el.classList.contains('is-open');
    $$('.fq', fq).forEach((x) => { x.classList.remove('is-open'); $('.fq__q', x).setAttribute('aria-expanded', false); });
    if (on) {
      el.classList.add('is-open'); $('.fq__q', el).setAttribute('aria-expanded', true);
      S.scramble($('.fq__a', el), FAQ[i][1], 700);
    }
    setTimeout(() => ScrollTrigger.refresh(), 50);
  }));

  /* ---------- riffle ---------- */
  S.riffle();

  /* ---------- start ---------- */
  S.pageLoader('readings', () => S.ready(() => {
    $$('.rg-hero .ph__title > span').forEach((s, i) => S.bigIn(s, i * .25));
    if (M) gsap.from('.rg-hero__slot', { y: 120, rotate: 8, opacity: 0, duration: 1.6, ease: 'expo.out', delay: .3 });
    if (m && rows[m[1]]) setTimeout(() => { S.scrollTo(rows[m[1]]); open(rows[m[1]], true); }, 300);
  }));
  S.heads(); S.footer();
})();
