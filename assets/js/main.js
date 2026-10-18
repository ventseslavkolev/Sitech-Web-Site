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
