// redpebble-shared.js
// Single source of shared RedPebble functionality used by BOTH the desktop and
// mobile views (mounted via the router in "RedPebble Site.dc.html").
// Loaded as a plain <script src="./redpebble-shared.js"> inside each view's
// <helmet>, so it is reliably inlined when the site is bundled for go-live.
// Everything is exposed on window.RedPebbleShared.
// Add any new cross-platform behaviour here so it is written/maintained once.
(function (root) {
  var CONTACT_EMAIL = 'ag@redpebble.ai';

  // Lightweight, backend-free event counter. Pings a sentinel same-origin path
  // on a successful contact submit. The request is logged by Cloudflare's HTTP
  // traffic analytics (the dashboard you already have) — filter Path equals
  // "/__event/contact-submit" and the request count = number of form fills.
  // The path is a static 404 (no route exists); that's intentional and still
  // counted. Uses sendBeacon so it survives the mailto navigation fallback.
  function track(name) {
    try {
      var url = '/__event/' + name;
      if (navigator && navigator.sendBeacon) { navigator.sendBeacon(url); }
      else { fetch(url, { method: 'POST', keepalive: true, mode: 'no-cors' }); }
    } catch (e) { /* analytics must never break submit */ }
  }

  var FOUNDER = {
    name: 'Ashish Gupta',
    role: 'Founder, RedPebble.ai',
    linkedin: 'https://www.linkedin.com/in/ashishgupta97065/',
  };

  // Submit a contact enquiry. This is the ONE place to change the mail / CRM
  // backend. Tries the AJAX endpoint first, falls back to the user's mail
  // client. Always resolves once the message has been handed off.
  function sendContact(data) {
    var payload = Object.assign({}, data, {
      _subject: 'RedPebble enquiry from ' + (data && data.name ? data.name : 'website'),
    });
    return fetch('https://formsubmit.co/ajax/' + CONTACT_EMAIL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (r) {
        if (!r.ok) throw new Error('bad status ' + r.status);
        return r.json();
      })
      .then(function () {
        track('contact-submit');
        return { ok: true, method: 'ajax' };
      })
      .catch(function () {
        // Graceful fallback: open the mail client pre-filled.
        var body = encodeURIComponent(
          'Name: ' + ((data && data.name) || '') +
          '\nEmail: ' + ((data && data.email) || '') +
          '\nPhone: ' + ((data && data.phone) || '') +
          '\nCompany: ' + ((data && data.company) || '') +
          '\n\n' + ((data && data.comment) || '')
        );
        track('contact-submit');
        window.location.href = 'mailto:' + CONTACT_EMAIL +
          '?subject=' + encodeURIComponent(payload._subject) + '&body=' + body;
        return { ok: true, method: 'mailto' };
      });
  }

  root.RedPebbleShared = { CONTACT_EMAIL: CONTACT_EMAIL, FOUNDER: FOUNDER, sendContact: sendContact, track: track };
})(window);
