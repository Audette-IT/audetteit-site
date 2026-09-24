# Components

Every component below is styled by `assets/room-guide.css` (a copy of the live
site's `public/css/site.css`). The markup is copied from the live pages, so use
the class names exactly as written. Wrap page content in `.wrap` for the max
width and side padding.

Contents: page skeleton · header/nav · buttons · hero with `mark` · Fig. 1 floor
plan · page intro · band and band-head · parts (lists and tables) · steps band ·
notes · split + prose · FAQ · support box · contact form · footer · behavior (JS)

---

## Page skeleton

```html
<body>
<a class="skip-link" href="#main-content">Skip to content</a>
<header class="site">...</header>
<main id="main-content">
  <div class="wrap hero">...</div>          <!-- or .page-intro on inner pages -->
  <section class="band"><div class="wrap">...</div></section>
  <section class="band">...</section>
</main>
<footer class="site">...</footer>
<script src="/js/site.js" defer></script>
</body>
```

Sections are separated by the band's 3px top rule. Don't add extra dividers,
cards or background stripes between them.

## Header and nav

The brand (logo + name + one-line descriptor), plain text links, and **one**
solid pill for the main action. Mark the current page with
`aria-current="page"` (a yellow underline).

```html
<header class="site">
  <div class="wrap nav">
    <a class="brand" href="/">
      <img src="/assets/logo.svg" alt="" width="40" height="44">
      <span><b>Audette IT</b><small>Home tech help · Las Vegas</small></span>
    </a>
    <button class="menu-toggle" type="button" aria-label="Menu" aria-expanded="false" aria-controls="primary-nav">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
    </button>
    <nav class="nav-links" id="primary-nav" aria-label="Main">
      <a href="/services">Services</a>
      <a href="/how-it-works" aria-current="page">How it works</a>
      <a href="/about">About</a>
      <a class="btn btn-solid" href="/contact">Get in touch</a>
    </nav>
  </div>
</header>
```

At 860px and below, `.nav-links` hides and `.menu-toggle` shows. The JS below
toggles `header.site.menu-open`.

## Buttons

```html
<a class="btn btn-solid" href="/contact">Get in touch</a>   <!-- main action: solid ink, blue on hover -->
<a class="btn" href="/services">What I help with</a>        <!-- secondary: outlined -->
<button class="btn btn-ghost" type="button">Decline</button> <!-- outlined on paper, e.g. cookie banner -->
```

Group them in `<div class="actions">`. One solid button per group.

## Hero with `mark` (homepage)

A two-column grid: the words on the left, Fig. 1 on the right. A **single**
yellow `<mark>` goes in the h1, on the words that matter most.

```html
<div class="wrap hero">
  <div>
    <h1>Tech help for <mark>every room</mark> in your house.</h1>
    <p class="lede">I'm Michael. I help with the everyday stuff, from wifi to printers to TVs, and the bigger jobs like building a proper home network.</p>
    <div class="actions">
      <a class="btn btn-solid" href="/contact">Get in touch</a>
      <a class="btn" href="/services">What I help with</a>
    </div>
    <p class="where">In person around Las Vegas, or remotely from anywhere. Quote before any work.</p>
  </div>
  <figure class="figure">...Fig. 1...</figure>
</div>
```

## Fig. 1: floor plan with room pins

A black-line SVG floor plan inside `.figure`, with yellow lettered `.room-pin`
buttons positioned in % over it. Clicking a pin updates the `.room-info`
caption. SVG stroke classes: `pl` (walls, `--draw`), `pd` (furniture/doors,
`--draw-soft`), `pw` (wifi rings, `--blue`, dashed), `pt` (uppercase room
labels, `--ink-soft`).

```html
<figure class="figure">
  <div class="plan-stage">
    <svg viewBox="0 0 520 400" role="img" aria-label="Floor plan of a house with rooms lettered A to F for the kinds of help I offer">
      <g class="pl" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <rect x="14" y="14" width="492" height="372" stroke-width="5"/>
        <path d="M300 14 V120 M300 150 V290 M300 160 H506 M14 200 H150 M180 200 H300 M200 200 V250 M200 280 V386 M300 290 H380 M410 290 H506 M300 320 V386" stroke-width="3.5"/>
        <!-- furniture: rects at stroke-width 1.6–2, rx 3–8 -->
      </g>
      <g class="pd" fill="none" stroke-width="1.4" stroke-linecap="round">
        <path d="M150 200 A30 30 0 0 1 180 230 M300 120 A30 30 0 0 1 330 150"/>  <!-- door swings -->
      </g>
      <g class="pw" fill="none" stroke-width="1.4" stroke-dasharray="3 6">
        <circle cx="250" cy="244" r="50"/><circle cx="250" cy="244" r="100" opacity="0.7"/>
      </g>
      <g class="pt" font-size="11.5" letter-spacing="0.08em">
        <text x="30" y="46">LIVING ROOM</text><text x="320" y="146">KITCHEN</text>
      </g>
    </svg>
    <button class="room-pin" type="button" style="left:25%;top:22%" data-room="living" aria-pressed="false" aria-label="A: Living room">A</button>
    <button class="room-pin" type="button" style="left:48%;top:52%" data-room="hall" aria-pressed="true" aria-label="E: Hall closet">E</button>
  </div>
  <div class="room-info" aria-live="polite">
    <span class="callout" id="room-letter">E</span>
    <div><h2 id="room-name">Hall closet: the router</h2><p id="room-text">Wifi that reaches the back bedroom, a network that doesn't drop during calls, and a router that's actually set up securely.</p></div>
  </div>
  <figcaption class="fig-cap"><span>Fig. 1: every room I can help with. Tap a letter.</span><span>Illustration</span></figcaption>
</figure>
```

The site's six rooms: A living room (TV and streaming), B kitchen (smart home),
C office (computer and printer), D kids' room (parental controls), E hall
closet (the router, pressed by default), F garage (the deeper stuff). The full
SVG is in `public/index.html` of the audetteit.com repo.

Reuse the *idea* elsewhere: any diagram (a network map, a rack, a single room)
drawn in the same line style, with yellow lettered callouts and a "Fig. N:"
caption. It must stay an illustration, not a fake live dashboard.

## Page intro (inner pages)

```html
<div class="wrap page-intro">
  <h1>How it works</h1>
  <p class="lede">No tickets and no call center. You talk to me from the first email to the fix.</p>
</div>
```

## Band and band-head

```html
<section class="band">
  <div class="wrap">
    <div class="band-head">
      <h2>What I help with</h2>
      <p>The everyday list covers most calls. The second list is for when you want something built properly.</p>
    </div>
    ...
    <p class="more"><a href="/services">More about each of these</a></p>
  </div>
</section>
```

## Parts: lists and tables

Two columns. Each group heading is uppercase with a 3px rule under it, and the
rows have hairlines between them.

```html
<div class="parts">
  <div>
    <h3>Everyday</h3>
    <ul><li>Wifi and devices</li><li>Slow computers</li><li>Printers</li></ul>
  </div>
  <div>
    <h3>Bigger jobs</h3>
    <ul><li>Network design</li><li>Active Directory</li></ul>
  </div>
</div>
```

Table version (item + description):

```html
<div class="parts">
  <div>
    <h2>Everyday</h2>
    <table>
      <tr><th scope="row">Wifi and devices</th><td>Dead spots, dropped connections, and things that won't connect.</td></tr>
      <tr><th scope="row">Slow computers</th><td>Finding what's actually slowing it down, then fixing that.</td></tr>
    </table>
  </div>
  <div>...</div>
</div>
```

## Steps band (the one blue band)

Use it only for a real sequence. At most one per page.

```html
<section class="band steps-field">
  <div class="wrap">
    <div class="band-head">
      <h2>How it works</h2>
      <p>Three steps, and you're dealing with me the whole way.</p>
    </div>
    <ol class="steps">
      <li><div class="n">1</div><h3>Tell me what's going on</h3><p>Send a quick email or use the contact form.</p></li>
      <li><div class="n">2</div><h3>I figure out the fix</h3><p>I'll reply with what I think is wrong and a quote.</p></li>
      <li><div class="n">3</div><h3>It works, and you know why</h3><p>I fix it and explain what I did in plain English.</p></li>
    </ol>
    <p class="more"><a href="/how-it-works">Questions people ask</a></p>
  </div>
</section>
```

## Notes (Where / Devices / Cost)

Three short facts, each under a 3px rule, with a 22px stroke icon.

```html
<div class="notes">
  <div class="note"><h3><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>Where</h3><p>In person around Las Vegas, or remotely from anywhere.</p></div>
  <div class="note"><h3><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="13" height="10" rx="1.5"/><path d="M1.5 18h16"/><rect x="18" y="8" width="4.5" height="10" rx="1"/></svg>Devices</h3><p>Computers and laptops, inside and out. Phones and tablets for setup, settings and parental controls, but no physical repairs.</p></div>
  <div class="note"><h3><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h10l6 6v10H4z"/><path d="M14 4v6h6M8 14h8M8 17.5h5"/></svg>Cost</h3><p>Every job is different, so you get a quote before I start.</p></div>
</div>
```

## Split + prose

A big statement heading on the left and short paragraphs on the right.
`.prose` alone is the long-form reading column (68ch), as on the privacy page.

```html
<section class="band">
  <div class="wrap split">
    <h2>Not a company, not a call center.</h2>
    <div class="prose">
      <p>When you email, you're talking to the person who'll actually do the work, and I'll explain what I did in plain English.</p>
      <p>Most of what I do is everyday help: wifi, slow computers, printers, TVs, backups and parental controls.</p>
    </div>
  </div>
</section>
```

## FAQ

Native `<details>`, with no JS. The yellow circle shows + when closed and − when open.

```html
<div class="faq">
  <details><summary>Do you fix phones and tablets?</summary><p>I help with setup, settings, apps and parental controls on them. I don't do physical repairs like screens or batteries.</p></details>
  <details><summary>How much does it cost?</summary><p>It depends on the job, so I'll give you a quote before I start anything.</p></details>
</div>
```

## Support box (the closing call to action)

```html
<section class="band">
  <div class="wrap">
    <div class="support">
      <div>
        <h2>Need a hand?</h2>
        <p>Send me an email with what's going on. I'll reply with what I think it is and a quote.</p>
      </div>
      <div class="addr-row">
        <a class="addr" href="mailto:michael.audette@audetteit.com">michael.audette@audetteit.com</a>
        <a class="btn btn-solid" href="/contact">Or use the contact form</a>
      </div>
    </div>
  </div>
</section>
```

## Contact form

A label on every field, a honeypot, a consent checkbox and one error line with
`role="alert"`. The error messages speak in Michael's voice.

```html
<form class="contact-form" id="contact-form" novalidate>
  <div class="field"><label for="name">Name</label><input id="name" name="name" type="text" placeholder="Jane Smith" autocomplete="name" required></div>
  <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" placeholder="jane@example.com" autocomplete="email" required></div>
  <div class="field"><label for="message">What's going on?</label><textarea id="message" name="message" rows="5" placeholder="What's broken, or what you want set up." required></textarea></div>
  <div class="hp-field" aria-hidden="true">
    <label for="website">Leave this empty</label>
    <input id="website" name="website" type="text" tabindex="-1" autocomplete="off">
  </div>
  <label class="consent-row" for="consent">
    <input id="consent" name="consent" type="checkbox" required>
    <span>I'm okay with this info being used to follow up with me. See the <a href="/privacy" class="inline-link">privacy note</a>.</span>
  </label>
  <p class="form-error" id="form-error" role="alert" hidden></p>
  <button class="btn btn-solid" type="submit">Send message</button>
  <span class="form-note">This opens your email app with the message filled in. Nothing is sent until you hit send there.</span>
</form>
```

Error copy used on the site: "Add your name so I know who this is from." / "Add
a valid email so I can reply." / "Tell me a bit about what's going on." / "Tick
the checkbox so I can use this info to follow up."

Put it in `.contact-grid` with a `.stack` of notes on the left.

## Footer

```html
<footer class="site">
  <div class="wrap">
    <span>Audette IT · Home tech help in Las Vegas</span>
    <div class="footer-links">
      <a href="mailto:michael.audette@audetteit.com">michael.audette@audetteit.com</a>
      <a href="/privacy">Privacy</a>
      <button type="button" class="linklike" data-cookie-settings>Cookie settings</button>
    </div>
  </div>
</footer>
```

(`.linklike` and the cookie settings button come from `consent.css` on the
site. Outside audetteit.com, drop the cookie button unless the project has a
consent banner.)

## Behavior (JS)

The site's JS is small, dependency-free and **always in an external file**.
Mobile menu:

```js
(function mobileMenu() {
  var header = document.querySelector('header.site');
  var toggle = header && header.querySelector('.menu-toggle');
  if (!toggle) return;
  toggle.addEventListener('click', function () {
    var open = header.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();
```

Room pins: on click, set `aria-pressed="true"` on the clicked pin and `"false"`
on the others, then write the letter, name and text into `#room-letter`,
`#room-name` and `#room-text`. The site's `public/js/site.js` has the full
version, plus the contact form validation that opens a `mailto:`.
