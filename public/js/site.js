// Shared page behavior. Loaded as an external file (not inline) so the
// Content-Security-Policy can use script-src 'self' without 'unsafe-inline'.

(function mobileMenu() {
  var header = document.querySelector('header.site');
  var toggle = header && header.querySelector('.menu-toggle');
  if (!toggle) return;
  toggle.addEventListener('click', function () {
    var open = header.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();

(function contactForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;
  var errorEl = document.getElementById('form-error');
  var TO = 'michael.audette@audetteit.com';

  function showError(msg, field) {
    errorEl.textContent = msg;
    errorEl.hidden = false;
    if (field) field.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    errorEl.hidden = true;

    // Honeypot: hidden from real visitors; bots that fill every field get dropped.
    if (form.website.value) return;

    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var message = form.message.value.trim();

    if (!name) return showError('Add your name so I know who this is from.', form.name);
    if (!email || !form.email.checkValidity()) return showError('Add a valid email so I can reply.', form.email);
    if (!message) return showError("Tell me a bit about what's going on.", form.message);
    if (!form.consent.checked) return showError('Tick the checkbox so I can use this info to follow up.', form.consent);

    var subject = 'Audette IT request from ' + name;
    var body = message + '\n\n—\n' + name + '\n' + email;
    window.location.href = 'mailto:' + TO +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  });
})();
