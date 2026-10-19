/* Sensor Network site script: navigation, contact form, small helpers. No dependencies. */
(function () {
  'use strict';

  var topbar = document.querySelector('.topbar');
  var toggle = document.querySelector('.menu-toggle');
  if (toggle && topbar) {
    toggle.addEventListener('click', function () {
      var open = topbar.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.querySelector('.menu-toggle-text').textContent = open ? 'Close' : 'Menu';
    });
  }

  // Product sub-menu: click toggles (touch and keyboard); hover handled in CSS.
  document.querySelectorAll('.has-sub > .nav-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var li = btn.parentElement;
      var open = li.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.has-sub.open').forEach(function (li) {
      if (!li.contains(e.target)) {
        li.classList.remove('open');
        li.querySelector('.nav-btn').setAttribute('aria-expanded', 'false');
      }
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.has-sub.open').forEach(function (li) { li.classList.remove('open'); });
      if (topbar && topbar.classList.contains('open')) { topbar.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    }
  });

  // Mark the current page in the navigation.
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a[href]').forEach(function (a) {
    var href = a.getAttribute('href').split('#')[0];
    if (href === here) { a.setAttribute('aria-current', 'page'); }
  });

  // Contact form: composes an e-mail in the visitor's mail client (no server needed).
  // To use a form service instead, set the form's action attribute and remove this handler.
  var form = document.querySelector('form.contact');
  if (form && !form.getAttribute('action')) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var get = function (id) { var el = form.querySelector('#' + id); return el ? el.value.trim() : ''; };
      var subject = 'Website enquiry: ' + (get('cf-topic') || 'Sensor Network');
      var body = [
        'Name: ' + get('cf-name'),
        'Company: ' + get('cf-company'),
        'E-mail: ' + get('cf-email'),
        'Phone: ' + get('cf-phone'),
        'Topic: ' + get('cf-topic'),
        '',
        get('cf-message')
      ].join('\n');
      var href = 'mailto:info@sitech.consulting?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      var status = form.querySelector('.form-status');
      if (status) { status.textContent = 'Your mail program should now open with the message. If it does not, write to info@sitech.consulting.'; }
      window.location.href = href;
    });
  }

  // Footer year
  var y = document.querySelector('[data-year]');
  if (y) { y.textContent = new Date().getFullYear(); }

  // Lightbox: click a photo, render or screenshot to see it at full size.
  var zoomSel = '.photo img, .shot img, .hero-photos img, .report-stack img, .places .ph img, .render-box img, .page-hero .figure img, .product-row .fig img';
  var zoomables = document.querySelectorAll(zoomSel);
  if (zoomables.length && typeof HTMLDialogElement === 'function') {
    var dlg = document.createElement('dialog');
    dlg.className = 'lightbox';
    dlg.innerHTML = '<div class="lb-inner"><img alt=""><figcaption></figcaption></div><button type="button" class="lb-close">Close</button>';
    document.body.appendChild(dlg);
    var lbImg = dlg.querySelector('img'), lbCap = dlg.querySelector('figcaption');
    var openLightbox = function (img) {
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt || '';
      var fig = img.closest('figure');
      var cap = fig ? fig.querySelector('figcaption') : null;
      lbCap.textContent = cap ? cap.textContent : (img.alt || '');
      dlg.showModal();
    };
    zoomables.forEach(function (img) {
      img.classList.add('zoomable');
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', (img.alt || 'Image') + ' (open full size)');
      img.addEventListener('click', function () { openLightbox(img); });
      img.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(img); } });
    });
    dlg.addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('close', function () { lbImg.removeAttribute('src'); });
  }
})();

/* ---- Prices behind a 5-digit access code -------------------------------------------
   Every price is stored encrypted in a <button class="price locked" data-c="..."> chip.
   The code is never stored in the page; its SHA-256 hash sits on <main data-pc>. A valid
   code is kept in localStorage so all pages show prices until "Hide prices" is clicked. */
(function () {
  'use strict';
  var main = document.getElementById('main');
  if (!main || !main.dataset.pc) { return; }
  var chips = Array.prototype.slice.call(document.querySelectorAll('.price.locked'));
  var page = (location.pathname.split('/').pop() || 'index.html');
  var STORE = 'snPriceCode';

  function sha256(text) {
    var data = new TextEncoder().encode(text);
    return crypto.subtle.digest('SHA-256', data);
  }
  function hex(buf) { return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join(''); }
  function b64bytes(s) { var bin = atob(s), out = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) { out[i] = bin.charCodeAt(i); } return out; }

  function verify(code) {
    if (!/^\d{5}$/.test(code)) { return Promise.resolve(false); }
    return sha256('sensor-network:' + code).then(function (h) { return hex(h) === main.dataset.pc; });
  }
  function reveal(code) {
    return Promise.all(chips.map(function (chip) {
      return sha256(code + ':' + page + ':' + chip.dataset.i).then(function (keyBuf) {
        var key = new Uint8Array(keyBuf), ct = b64bytes(chip.dataset.c), pt = new Uint8Array(ct.length);
        for (var i = 0; i < ct.length; i++) { pt[i] = ct[i] ^ key[i % key.length]; }
        var span = document.createElement('span');
        span.className = 'price unlocked';
        span.textContent = new TextDecoder().decode(pt);
        chip.replaceWith(span);
      });
    })).then(function () {
      document.documentElement.classList.add('prices-unlocked');
      var hide = document.querySelector('.price-hide');
      if (hide) { hide.hidden = false; }
    });
  }

  // dialog
  var dlg = document.createElement('dialog');
  dlg.className = 'price-dialog';
  dlg.innerHTML = '<form method="dialog" class="price-form">' +
    '<h3>Prices are shown with an access code</h3>' +
    '<p>Customers and partners receive a 5-digit code with their quotation. If you do not have one yet, write to <a href="mailto:info@sitech.consulting">info@sitech.consulting</a>.</p>' +
    '<label for="price-code">Access code<input id="price-code" name="code" type="text" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{5}" maxlength="5" placeholder="5 digits" required></label>' +
    '<p class="price-error" aria-live="polite"></p>' +
    '<div class="actions"><button type="submit" class="btn btn-primary" value="ok">Show prices</button><button type="button" class="btn btn-ghost price-cancel">Cancel</button></div>' +
    '</form>';
  document.body.appendChild(dlg);
  var input = dlg.querySelector('#price-code'), err = dlg.querySelector('.price-error');
  dlg.querySelector('.price-cancel').addEventListener('click', function () { dlg.close(); });
  dlg.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
    var code = input.value.trim();
    verify(code).then(function (ok) {
      if (!ok) { err.textContent = 'This code is not valid. Check the digits or ask us for a code.'; input.select(); return; }
      try { localStorage.setItem(STORE, code); } catch (_) {}
      err.textContent = '';
      dlg.close();
      reveal(code);
    });
  });
  function open() { err.textContent = ''; input.value = ''; dlg.showModal(); input.focus(); }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('.price.locked, .price-unlock-btn');
    if (t) { e.preventDefault(); open(); }
  });

  // footer link to hide prices again
  var legal = document.querySelector('.footer .legal');
  if (legal) {
    var hideWrap = document.createElement('span');
    hideWrap.className = 'price-hide'; hideWrap.hidden = true;
    hideWrap.innerHTML = '<a href="#" class="price-hide-link">Hide prices</a>';
    legal.appendChild(hideWrap);
    hideWrap.querySelector('a').addEventListener('click', function (e) { e.preventDefault(); try { localStorage.removeItem(STORE); } catch (_) {} location.reload(); });
  }

  // already unlocked on an earlier page?
  var saved = null;
  try { saved = localStorage.getItem(STORE); } catch (_) {}
  if (saved && window.crypto && crypto.subtle) {
    verify(saved).then(function (ok) { if (ok) { reveal(saved); } else { try { localStorage.removeItem(STORE); } catch (_) {} } });
  }
})();
