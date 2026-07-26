(function () {
  var NAV_PAGES = ['/', '/index.html', '/work.html', '/bts.html', '/about.html', '/contact.html'];

  function isNavPage(href) {
    try {
      var url = new URL(href, window.location.href);
      var path = url.pathname.replace(/\/+$/, '') || '/';
      return NAV_PAGES.some(function (p) { return path === p || path === p.replace('.html', ''); });
    } catch (e) { return false; }
  }

  // Build overlay panel
  var overlay = document.createElement('div');
  overlay.style.cssText = [
    'position:fixed;inset:0;z-index:9999',
    'background:#000000',
    'transform:translateX(0)',
    'transition:none',
    'display:flex;align-items:center;justify-content:center',
    'pointer-events:all'
  ].join(';');

  var wordmark = document.createElement('div');
  wordmark.textContent = 'DAKE VISUALS';
  wordmark.style.cssText = [
    'font-family:Inter,sans-serif;font-weight:900;font-style:italic',
    'font-size:clamp(1.2rem,3.5vw,2.8rem)',
    'letter-spacing:0.08em;text-transform:uppercase',
    'color:#ffffff',
    'opacity:1'
  ].join(';');

  overlay.appendChild(wordmark);
  document.body.appendChild(overlay);

  // Entrance: slide overlay out to the left after delay
  var isHome = ['/', '/index.html'].some(function (p) {
    return window.location.pathname === p || window.location.pathname === p.replace('.html', '');
  });
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

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;
    if (!isNavPage(href)) return;
    if (!isNavPage(window.location.href)) return;
    e.preventDefault();
    overlay.style.pointerEvents = 'all';
    overlay.style.transform = 'translateX(101%)';
    overlay.style.transition = 'none';
    wordmark.style.transition = 'opacity 0.35s ease 0.25s';
    wordmark.style.opacity = '0';
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      overlay.style.transition = 'transform 0.6s cubic-bezier(0.76,0,0.24,1)';
      overlay.style.transform = 'translateX(0)';
      wordmark.style.opacity = '1';
    }); });
    setTimeout(function () { window.location.href = href; }, 620);
  });
})();
