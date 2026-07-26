(function () {
  var NAV_PAGES = ['/', '/index.html', '/work.html', '/bts.html', '/about.html', '/contact.html'];

  function isNavPage(href) {
    try {
      var url = new URL(href, window.location.href);
      var path = url.pathname.replace(/\/+$/, '') || '/';
      return NAV_PAGES.some(function (p) { return path === p || path === p.replace('.html', ''); });
    } catch (e) { return false; }
  }

  var overlay = document.createElement('div');
  overlay.style.cssText = [
    'position:fixed;inset:0;z-index:9999;background:#000',
    'display:flex;align-items:center;justify-content:center',
    'transform:translateX(0);transition:none;pointer-events:all'
  ].join(';');

  var wordmark = document.createElement('div');
  wordmark.textContent = 'DAKE VISUALS';
  wordmark.style.cssText = [
    'font-family:Inter,sans-serif;font-weight:900;font-style:italic',
    'font-size:clamp(1.2rem,3.5vw,2.8rem)',
    'letter-spacing:0.08em;text-transform:uppercase;color:#fff'
  ].join(';');

  overlay.appendChild(wordmark);
  document.body.appendChild(overlay);

  // ── ENTRANCE: slide overlay out to the left ──
  var isHome = (window.location.pathname === '/' || window.location.pathname === '/index.html');
  var holdDelay = isHome ? 1400 : 600;

  setTimeout(function () {
    overlay.style.transition = 'transform 0.65s cubic-bezier(0.76,0,0.24,1)';
    overlay.style.transform = 'translateX(-101%)';
    setTimeout(function () { overlay.style.pointerEvents = 'none'; }, 700);
  }, holdDelay);

  // Handle back/forward cache
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      overlay.style.transition = 'none';
      overlay.style.transform = 'translateX(101%)';
      overlay.style.pointerEvents = 'none';
    }
  });

  // ── EXIT: slide in from right, then navigate ──
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;
    if (!isNavPage(href)) return;
    if (!isNavPage(window.location.href)) return;
    e.preventDefault();

    overlay.style.transition = 'none';
    overlay.style.transform = 'translateX(101%)';
    overlay.style.pointerEvents = 'all';

    requestAnimationFrame(function () { requestAnimationFrame(function () {
      overlay.style.transition = 'transform 0.6s cubic-bezier(0.76,0,0.24,1)';
      overlay.style.transform = 'translateX(0)';
      setTimeout(function () { window.location.href = href; }, 620);
    }); });
  });
})();
