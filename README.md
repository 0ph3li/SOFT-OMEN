<div align="center">

# SOFT OMEN

**bad news, delivered softly.**

*a tarot house in milano. four readers, twenty-two cards, one question. open every night from 23:00 to 03:33, closed on full moons (we're busy).*

`HTML` · `CSS` · `vanilla JS` · `GSAP` · `Lenis` · `Canvas` · `ASCII`

</div>

---

**SOFT OMEN** is a concept website for a tarot house that doesn't exist. It sits at **via dei cappellari 7, milano**, behind a door you'd walk past, and it only opens after 23:00, because nobody asks the real question at 4pm. Every card in the deck sounds terrifying, and the house's whole job is to translate it: *the tower* means you never really lived there, *death* means something ends (good, it was taking up room).

The whole idea is **soft → sharp**. Things arrive blurred and come into focus, like a reading: words blur in, ASCII cards morph into each other character by character, and everything scary gets said gently.

Almost every picture on the site is **drawn in characters**. The moon card in the hero, the deck of 22 arcana, the spreads on the menu, the roses in the footer and the wordmark itself are all ASCII, rendered live on canvas or in `<pre>` blocks. The only real photos are the readers, the reading table and the door.

The look comes from a moodboard of gothic-pink references: velvet black, poster pink, a loud misery pink, block ASCII, hang tags and tracklists. The type is a soft italic serif (Fraunces with its SOFT axis at 100) over mono and pixel labels.

> Personal portfolio project · concept, design & code by **ghostly.grl** ♥

---

## ✦ The palette

| colour | hex | where |
|---|---|---|
| black | `#050304` | the background of every page, the footer black |
| ink | `#0b0709` | velvet, the dark panels |
| ink 2 | `#19121a` | raised surfaces, card frames |
| pink | `#f4a9cf` | the soft pink: the big italic lines, the ASCII |
| hot | `#ff2e9a` | the loud pink: the inverted readings screen, highlights, the cursor sparkles |
| blush | `#fbe3ef` | soft panels, toasts |
| bone | `#f3eef0` | card stock, the tickets and receipts |
| grey | `#bdb6ba` | small print |
| lavender | `#dde0f6` | the slim tag |

**Type:** Fraunces italic, `SOFT 100` · `opsz 144` (the big pink lines) · IBM Plex Mono (everything else, and every ASCII drawing) · Silkscreen (tiny pixel labels).

---

## ✦ The pages

Every page shares the same header, cursor and footer: the nav (*the pull · readers · the deck · readings · book*), tonight's **real moon phase**, and the footer with the ASCII roses and the house details.

### 00 · Loaders
- **Home**: one ASCII rose blooms on a black canvas while *shuffling the deck 000%* counts up, the block-letter wordmark types itself in, and *shh…* fades.
- **Every other page**: a small ASCII card is cut from the deck, flickers through three random arcana, lands on the page's name, then the curtain lifts.
- **The deck**: *cutting the deck 00/22*.

### 01 · Home: *bad news, delivered softly*

| # | screen | what happens |
|---|---|---|
| 00 | **hero** | the block-ASCII wordmark, *bad news, / delivered / softly.* in three big lines under it, and on the right a giant ASCII **XVIII · The Moon** card that floats, tilts and flips as you scroll. There's a **card of the day** too, the same for everyone, different every day |
| — | **marquee** | block-ASCII letters sliding past, faster when you scroll faster |
| 01 | **the pull** | *me locking in.* The section is pinned: scrolling **deals three cards**, then turns them over, morphing char by char from the back to the face. *what's gone · what's here · what's coming*. About one in three comes up reversed |
| 02 | **readers** | a pile of four framed portrait cards. Scroll tosses the top one off with a spin to reveal the next reader. Pick one and she stays with you on every page |
| — | **the wheel** | *twenty-two ways to be told.* All 22 major arcana on a pinned wheel that scroll turns. Type your birthday and it finds your **birth card**; every card links to its page in the deck |
| 03 | **readings** | *tonight is a reading.* The one inverted screen: hot pink, with black ASCII. A dot-leader menu, each reading with its spread drawn in characters |
| 04 | **book** | *sleep on it.* Split screen: a terminal-style form on one side and an ASCII ticket that prints itself while you type on the other |
| — | **footer** | her favourite: near-black ASCII roses that bloom hot pink under the mouse, *see you in your dreams*, the address, the hours, and the signature in block ASCII |

### 02 · The deck: *22 major arcana, read softly*
- **The fan**: all 22 cards fanned in one hand, pivoting from far below the screen. Hover one to lift it, click to jump to it, or scroll and the deck deals them all.
- **The reading room**: a pinned stage with one big ASCII card (29 × 21 characters, a different pattern of rays, rings and hatching for every number). As you scroll, each card is **read char by char into the next**. Next to it:
  - ~~*what they say*~~: the scary textbook meaning, struck through
  - *what we say*: the soft translation
  - two meters: how scary it **sounds** and how scary it **is** (0–10)
  - *↻ reverse it*: flips the card upside down and gives you the reversed reading. *"same card, more honest."*
  - a numeral rail 0–XXI on the side
- **The fear index**: *scary, ranked.* Two ASCII bars per card, ▓▓ how it sounds and ██ how it is. Sort by deck order, scariest sounding or actually scary, and the rows re-sort themselves with GSAP Flip. *Nothing in the deck goes above a 3. we checked.*
- **Draw one**: one card, no take-backs (it remembers what you drew).
- **Deep links**: `deck.html#card-13` opens straight on Death.

| | card | what we say | sounds | is |
|---|---|---|---|---|
| 0 | The Fool | jump. you were going to anyway. | 3 | 1 |
| I | The Magician | you have everything you need. stop ordering more. | 4 | 1 |
| II | The High Priestess | you already know. that's the annoying part. | 5 | 1 |
| III | The Empress | water yourself. literally, drink something. | 2 | 0 |
| IV | The Emperor | someone wants control. it might be you. | 5 | 2 |
| V | The Hierophant | do it the boring way once. just once. | 3 | 1 |
| VI | The Lovers | it's a choice, not a sign. sorry. | 4 | 2 |
| VII | The Chariot | move. the vibe follows the body. | 4 | 1 |
| VIII | Strength | soft hands, steel nerves. you have both. | 3 | 0 |
| IX | The Hermit | mute the group chat. go inward. | 5 | 1 |
| X | Wheel of Fortune | it turns. it always turns. hold the rail. | 6 | 2 |
| XI | Justice | the receipts are coming out. | 6 | 2 |
| XII | The Hanged Man | stuck is a position too. look around from there. | 7 | 1 |
| XIII | Death | something ends. good. it was taking up room. | 10 | 2 |
| XIV | Temperance | half and half. not all or nothing. | 2 | 0 |
| XV | The Devil | you like the chain. we see you. | 9 | 3 |
| XVI | The Tower | it falls. you never really lived there. | 10 | 3 |
| XVII | The Star | this is the soft one. let it be soft. | 1 | 0 |
| XVIII | The Moon | not everything you see is true. especially at 3am. | 8 | 2 |
| XIX | The Sun | yes. obviously yes. | 0 | 0 |
| XX | Judgement | someone calls your name. answer this time. | 7 | 1 |
| XXI | The World | a full circle. you get to start again, smarter. | 2 | 0 |

### 03 · The pull: *ask it.*
- **Ask**: type your question and it becomes the giant title of the page, letter by letter. *Should i move · is it him · do i quit.*
- **The table**: an oval reading table. Pick a spread:
  - **one card**: the answer
  - **gone · here · coming**: three in a row
  - **the cross**: five cards (you, what crosses you, the root, the past, what comes)

  The cards land face down and **you turn them yourself**, one click each. Your chosen reader answers in her own voice: NOX is honest, LACE whispers, DREAD says one sentence, BLUSH uses emojis.
- **The receipt**: *in writing.* Every pull prints a receipt with your question, the cards, and what they mean. Copy it, take it to a booking, or pull again.
- **The drawer**: *you asked.* Your last six pulls, kept on this device only. *Forget them all* empties it (*"the cards never tell"*).

### 04 · Readers: *who reads you*
- **The line-up**: four photo cards side by side, an accordion where hover opens one.
- **One chapter each**: a sticky photo with the reader's chapter scrolling next to it. Her quote, the year she started, her card, how fast she replies, a description, ASCII stat bars that fill up (*intuition · honesty · softness · texts back*) and **her three rules**.
- **The quiz**: *who should read you.* Four questions, and you get a reader, who becomes yours for the whole site.

| reader | card | says | replies | is |
|---|---|---|---|---|
| **NOX** | XVIII the moon | *lights off* | by morning, maybe | reads in the dark, literally. will tell you the tower is coming, then hug you |
| **LACE** | XVII the star | *angel…* | in an hour, with a voice note | lace gloves, tea first, has never once said a bad card out loud |
| **DREAD** | XIII death | *next.* | never. she will see you next week | one card, one sentence. people cry in the hallway, then book again |
| **BLUSH** | VI the lovers | *u up?* | four seconds | reads your cards and your ex's instagram at the same time |

### 05 · Readings: *cash or vibes*
- **The hot pink hero**: *cash or vibes*, with the photo of the reading table. Prices are in euro; vibes are accepted on the 7th.
- **The menu**: *tonight is a reading.* Open a row and its spread is drawn, card by card, in ASCII.
- **The fine print**: *what you get*, all six side by side in an ASCII table. *\* he is always mentioned. we don't bring him up. you do.*
- **Asked at 3am**: the FAQ (*what if i pull death? · can you read for him? · do i need to believe in it?*…).

| reading | | time | price | cards | you leave with |
|---|---|---|---|---|---|
| **the 3am** | one card. no follow-up questions. | 7 min | €7 | 1 | one sentence you will think about all week |
| **the situationship** | five cards. he's in all of them. | 20 min | €22 | 5 | a clear answer to "what are we". you might not like it |
| **the exit interview** | why it ended. for real this time. | 30 min | €33 | 3 | closure, in writing. we print it for you |
| **the full moon** | for when you're about to do something. | 45 min | €44 | 7 | permission. or a very good reason to wait |
| **the 777** | the lucky one. only on the 7th. | 77 min | €77 | 7 | a lucky number, a lucky colour, a lucky week |
| **the soft no** | we read his cards. we tell you nothing. | 0 min | free | 0 | peace. you did not need to know |

### 06 · Book: *sleep on it*
- **The door**: a live countdown, *the doors open in 00:00:00*, to 23:00 milano time, next to the photo of the door on via dei cappellari.
- **The nights**: the next 28 nights as a **moon calendar**, each with its real phase. Full moons are closed (*"we are busy"*).
- **Your ticket**: pick the reading, the reader and **how much truth** you want:

  | size | |
  |---|---|
  | xs | we say it like a horoscope |
  | s | a little sting, then a compliment |
  | m | the truth, with a cookie after |
  | l | the truth. no cookie |
  | xl | everything. bring a friend |

  Add a name (even a fake one) and one question, and the ticket prints next to the form while you type. *Book the omen* saves it, and *add it to your calendar* downloads a real `.ics` file.
- **The house rules**: *a few things*, each one written, struck through and corrected. ~~be on time.~~ *be on time-ish. the cards wait.* ~~don't bring him.~~ *don't bring him. he's already in the cards.*

---

## ✦ Easter eggs

| | how | what |
|---|---|---|
| ✝ | the **konami code** ↑ ↑ ↓ ↓ ← → ← → B A | *XIII ✦ every card is death now. relax. it means change.* Every pull deals only Death |
| 🎰 | type **`777`** | *777 ✦ you are locked in.* The next pull is lucky |
| ♥ | type **`ghostly`** | the signature |
| ☾ | leave the tab | *✦ the cards are still warm ✦* |
| 🌕 | try to book a full moon | *full moon ✦ closed. we are busy.* |
| 🔁 | reverse a card in the deck | *same card, more honest.* |
| 🕐 | the clock in the header | milano time, *we are reading* between 23:00 and 04:00, *we are asleep* otherwise |
| ⌨️ | open the **console** | the cat, and `SO.help()`: `SO.pull()`, `SO.setReader("LACE")`, `SO.moon()`, `SO.toast("hi")` |

---

## ✦ How it works

- **One small engine.** `js/main.js` exposes `window.SO`. It handles smooth scrolling, the cursor and its sparkle trail, split text, scramble labels, the toast, the moon, the milano clock, the chosen reader, the loaders, the footer and the ASCII engine. Each page adds its own small file on top.
- **The ASCII engine.** `SO.ascii(canvas, { field, ramp, base, hot, avoid })` draws a picture as characters from the ramp ` .·:-=+*✿#%@`. The pictures are **procedural fields** (`SO.fields`: roses, the moon, the moon card…), functions of position and time, so they move. Characters near the cursor glow hot pink. `avoid` takes a CSS selector and fades the characters around each line of text it matches (measured with `Range.getClientRects`), so the words never get lost in the drawing.
- **Cards that read into each other.** `SO.morph(el, to)` turns one ASCII drawing into another: every character gets a random moment to flicker through glyphs (`✦✧·:*+=%#@/\|`) and settle on its new value. The loaders, the pull, the deck and the wheel all use it. `SO.mini()` builds a small framed card from rows of text.
- **The deck as data.** `SO.ARCANA` holds the 22 cards: number, name, glyph, the soft reading, what they say, the reversed reading, and the two fear scores. `SO.READERS` and `SO.MENU` hold the readers and the six readings. Every page reads from them, so a card or a price only changes in one place.
- **The real moon.** `SO.moon()` works out tonight's lunar age from a known new moon (6 january 2000) and the synodic month (29.53 days): the % lit, waxing or waning, and its name. The header, the book calendar and the full-moon closures all use it.
- **The birth card.** Add up every digit of your birthday until the number is 22 or less.
- **The ticket.** The booking form writes into an ASCII ticket on every keystroke. *Add it to your calendar* builds an `.ics` file in the browser and downloads it, with no server involved.
- **Her photos.** The readers, the table and the door are plain images that blur into focus as they scroll in (`SO.photo`). The four readers are transparent cut-outs.
- **Pins.** The pinned sections use `overflow: clip` rather than `hidden`, so a link or `scrollIntoView` can't scroll the inside of a pin by mistake.

## ✦ Images

| file | where |
|---|---|
| `img/HOME/hero.jpg` | the hero |
| `img/HOME/reader-1.png` … `reader-4.png` | NOX, LACE, DREAD, BLUSH (transparent cut-outs, used on every page) |
| `img/READINGS/table.jpg` | the reading table, readings hero |
| `img/BOOK/door.jpg` | the door on via dei cappellari, book hero |

## ✦ Privacy

Nothing leaves the browser. There is no server, no analytics and no tracking. Your reader, your last six pulls, the card you drew and your booking are kept on your device in `localStorage` (keys start with `so-`). The booking form isn't sent anywhere: it only prints a ticket and, if you want, a calendar file.

## ✦ Run it locally

There is no build step. Serve the folder with any static server:

```bash
python3 -m http.server 5720
```

then open <http://localhost:5720>.

Open it through a server, not by double-clicking the file: from `file://` the browser won't let the canvas read the pixels it needs.

## ✦ Structure

```
index.html · deck.html · pull.html · readers.html · readings.html · book.html

css/   style.css (shared: header, cursor, loaders, sections, riffle, footer)
       + one file per page
js/    main.js  (shared: the SO engine, the ASCII engine, the arcana,
                 the readers, the menu, easter eggs)
       + one file per page
img/   HOME · READINGS · BOOK
VIBES/ the moodboard
reel/  the case-study reel (softomen-reel.mp4)
```

## ✦ Built with

- Plain **HTML, CSS and JavaScript**: no framework, no build step
- [GSAP 3](https://gsap.com/) + ScrollTrigger + Flip · [Lenis](https://github.com/darkroomengineering/lenis) for smooth scrolling
- Canvas 2D for the ASCII roses, the moon and the moon card
- Google Fonts: Fraunces, IBM Plex Mono, Silkscreen

Designed for desktop and mobile. Respects `prefers-reduced-motion`: the animations are skipped, cards appear already turned, and every page shows its finished state.

## ✦ Credits

Concept, design & code: **ghostly.grl** ♥
Photos in `img/` and `VIBES/` are stock images and moodboard references and belong to their authors. They're used here for a non-commercial portfolio project. Tarot is for fun; please don't quit your job because of a card.

---

<div align="center">

✦ every night ✦ 23:00 — 03:33 ✦ closed on full moons ✦

```
   *    /\_/\      ✦
       ( o.o )   <3  ghostly.grl
   ✦    > ^ <   ☾     *
```

</div>
