// Cookie consent + Google Tag Manager. Loaded as the first script in <head>
// (external, not inline, so the CSP can keep script-src free of 'unsafe-inline').
//
// Nothing from Google loads until the visitor clicks "Accept": Consent Mode
// defaults everything to denied, and GTM itself is only injected after consent.
// The choice is kept in localStorage (not a cookie), and the footer's
// "cookie settings" button reopens the banner to change it.
(function () {
  var GTM_ID = 'GTM-TKBJX8F5';
  var KEY = 'audetteit-consent';

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });

  function readChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function saveChoice(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* storage blocked: ask again next page */ }
  }

  var gtmLoaded = false;
  function loadGtm() {
    if (gtmLoaded) return;
    gtmLoaded = true;
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    document.head.appendChild(s);
  }

  function grant() {
    gtag('consent', 'update', { analytics_storage: 'granted' });
    loadGtm();
  }

  // Google Analytics cookies are _ga and _ga_<id>, set on the parent domain.
  function clearAnalyticsCookies() {
    var host = location.hostname;
    var domains = ['', host, '.' + host, '.' + host.split('.').slice(-2).join('.')];
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name.indexOf('_ga') !== 0 && name.indexOf('_gid') !== 0) return;
      domains.forEach(function (d) {
        document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
      });
    });
  }

  if (readChoice() === 'granted') grant();

  // Keep the fixed banner from covering the footer while it's open.
  function reserveSpace(el) {
    document.body.style.paddingBottom = el.hidden ? '' : el.offsetHeight + 'px';
  }

  function buildBanner() {
    var el = document.createElement('section');
    el.className = 'consent';
    el.setAttribute('aria-label', 'Cookie consent');
    el.setAttribute('tabindex', '-1');
    el.innerHTML =
      '<div class="consent-inner">' +
        '<p class="consent-text"><span class="consent-tag">cookies</span> ' +
        'Can this site use Google Analytics cookies to count visits? ' +
        'Nothing loads unless you say yes. <a href="/privacy" class="inline-link">Details</a>.</p>' +
        '<div class="consent-actions">' +
          '<button type="button" class="btn btn-ghost" data-consent="denied">Decline</button>' +
          '<button type="button" class="btn btn-ghost" data-consent="granted">Accept</button>' +
        '</div>' +
      '</div>';
    el.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-consent]');
      if (!btn) return;
      var value = btn.getAttribute('data-consent');
      var previous = readChoice();
      saveChoice(value);
      el.hidden = true;
      reserveSpace(el);
      if (value === 'granted') return grant();
      if (previous === 'granted' || gtmLoaded) {
        // GTM can't be unloaded from a running page: withdraw consent, clear
        // its cookies, and reload so nothing from Google is left running.
        gtag('consent', 'update', { analytics_storage: 'denied' });
        clearAnalyticsCookies();
        location.reload();
      }
    });
    document.body.appendChild(el);
    reserveSpace(el);
    return el;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var banner = null;
    if (!readChoice()) banner = buildBanner();

    document.querySelectorAll('[data-cookie-settings]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        banner = banner || buildBanner();
        banner.hidden = false;
        reserveSpace(banner);
        banner.focus();
      });
    });
  });
})();
