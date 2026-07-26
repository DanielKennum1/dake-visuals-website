(function () {
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:#0d1520;z-index:9999;opacity:0;pointer-events:none;transition:opacity 0.45s cubic-bezier(0.4,0,0.2,1)';
  document.body.appendChild(overlay);

  // Fade in on page enter
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      overlay.style.opacity = '0';
    });
  });

  // Handle back/forward cache
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      overlay.style.transition = 'none';
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
    }
  });

  // Intercept internal link clicks
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;
    if (/^https?:\/\//.test(href) && !href.includes('dakevisuals.com')) return;
    e.preventDefault();
    overlay.style.transition = 'opacity 0.45s cubic-bezier(0.4,0,0.2,1)';
    overlay.style.pointerEvents = 'all';
    overlay.style.opacity = '1';
    setTimeout(function () { window.location.href = href; }, 460);
  });
})();
