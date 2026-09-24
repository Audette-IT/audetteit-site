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

(function floorPlan() {
  var pins = document.querySelectorAll('.pin[data-room]');
  if (!pins.length) return;
  var rooms = {
    living: ['Living room: TV and streaming', 'Smart TVs, streaming boxes, sound bars, and getting everything onto the right input without three remotes.'],
    kitchen: ['Kitchen: smart home', 'Smart speakers, doorbells, cameras, and the plugs and lights that stopped responding.'],
    office: ['Office: the computer and printer', 'Slow computers, new computer setup, backups, and printers that won\'t print.'],
    kids: ['Kids\' room: parental controls', 'Screen time and content filtering on their devices, plus filtering at the router that covers the whole house.'],
    hall: ['Hall closet: the router', 'Wifi that reaches the back bedroom, a network that doesn\'t drop during calls, and a router that\'s actually set up securely.'],
    garage: ['Garage: the deeper stuff', 'Network design, a small server or home lab, self-hosted services, and Active Directory when you need it.']
  };
  var nameEl = document.getElementById('room-name');
  var textEl = document.getElementById('room-text');
  pins.forEach(function (pin) {
    pin.addEventListener('click', function () {
      pins.forEach(function (p) { p.setAttribute('aria-pressed', p === pin ? 'true' : 'false'); });
      var room = rooms[pin.getAttribute('data-room')];
      nameEl.textContent = room[0];
      textEl.textContent = room[1];
    });
  });
})();
