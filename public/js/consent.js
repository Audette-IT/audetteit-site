// Cookie consent for Google Tag Manager. Must stay the first script in <head>,
// before Google's GTM snippet, so Consent Mode defaults exist before GTM runs.
//
// GTM loads on every page (Consent Mode "advanced"), but analytics_storage stays
// "denied" until the visitor clicks Accept, so GA sets no cookies before that.
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

  function readChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function saveChoice(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* storage blocked: ask again next page */ }
  }

  if (readChoice() === 'granted') gtag('consent', 'update', { analytics_storage: 'granted' });

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
        'No analytics cookies are set unless you say yes. <a href="/privacy" class="inline-link">Details</a>.</p>' +
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
