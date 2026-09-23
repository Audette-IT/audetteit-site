// Cookie consent for Google Tag Manager and the tags it loads (Google Analytics,
// Microsoft Clarity). Must stay the first script in <head>, before Google's GTM
// snippet, so consent defaults exist before anything runs.
//
// GTM loads on every page (Consent Mode "advanced"), but nothing sets analytics
// cookies until the visitor clicks Accept: Google gets analytics_storage
// "denied", and Clarity gets consentv2 "denied" (one ID per page view, no cookies).
// The choice is kept in localStorage (not a cookie); the footer's
// "cookie settings" button reopens the banner to change it.
(function () {
  var KEY = 'audetteit-consent';

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });

  // Clarity (loaded by GTM) reads consent through its own API. Calls made before
  // it loads wait in this queue; they are sent again on window load in case the
  // GTM template replaced the queue.
  window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
  function clarityConsent(value) {
    window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: value });
  }

  function readChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function saveChoice(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* storage blocked: ask again next page */ }
  }

  function currentChoice() { return readChoice() === 'granted' ? 'granted' : 'denied'; }
  if (currentChoice() === 'granted') gtag('consent', 'update', { analytics_storage: 'granted' });
  clarityConsent(currentChoice());
  window.addEventListener('load', function () { clarityConsent(currentChoice()); });

  // Google Analytics cookies are _ga/_ga_<id>; Clarity's are _clck/_clsk.
  function clearAnalyticsCookies() {
    var host = location.hostname;
    var domains = ['', host, '.' + host, '.' + host.split('.').slice(-2).join('.')];
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (!/^(_ga|_gid|_clck|_clsk)/.test(name)) return;
      domains.forEach(function (d) {
        document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
      });
    });
  }

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
        'Can this site use analytics cookies (Google Analytics, Microsoft Clarity) to see how it\'s used? ' +
        'None are set unless you say yes. <a href="/privacy" class="inline-link">Details</a>.</p>' +
        '<div class="consent-actions">' +
          '<button type="button" class="btn btn-ghost" data-consent="denied">Decline</button>' +
          '<button type="button" class="btn btn-ghost" data-consent="granted">Accept</button>' +
        '</div>' +
      '</div>';
    el.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-consent]');
      if (!btn) return;
      var value = btn.getAttribute('data-consent');
      saveChoice(value);
      el.hidden = true;
      reserveSpace(el);
      gtag('consent', 'update', { analytics_storage: value });
      clarityConsent(value);
      if (value === 'denied') clearAnalyticsCookies();
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
