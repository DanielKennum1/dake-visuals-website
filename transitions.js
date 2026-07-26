(function () {
  var NAV_PAGES = ['/', '/index.html', '/work.html', '/bts.html', '/about.html', '/contact.html'];

  function isNavPage(href) {
    try {
      var url = new URL(href, window.location.href);
      var path = url.pathname.replace(/\/+$/, '') || '/';
      return NAV_PAGES.some(function (p) { return path === p || path === p.replace('.html', ''); });
    } catch (e) { return false; }
  }

  var easing = 'cubic-bezier(0.76,0,0.24,1)';

  var panel = document.createElement('div');
  panel.style.cssText = [
    'position:fixed;inset:0;z-index:9999;background:#000',
    'display:flex;align-items:center;justify-content:center',
    'pointer-events:none',
    'transform:translateX(101%)',
    'will-change:transform'
  ].join(';');

  var wordmark = document.createElement('div');
  wordmark.textContent = 'DAKE VISUALS';
  wordmark.style.cssText = [
    'font-family:Inter,sans-serif;font-weight:900;font-style:italic',
    'font-size:clamp(1.2rem,3.5vw,2.8rem)',
    'letter-spacing:0.08em;text-transform:uppercase;color:#fff',
    'transform:translateX(60px);opacity:0',
    'will-change:transform,opacity'
  ].join(';');

  panel.appendChild(wordmark);
  document.body.appendChild(panel);

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;
    if (!isNavPage(href) || !isNavPage(window.location.href)) return;
    e.preventDefault();

    panel.style.pointerEvents = 'all';

    // Glide in from right
    panel.style.transition = 'transform 0.45s ' + easing;
    panel.style.transform = 'translateX(0)';

    // Wordmark fades + slides in shortly after
    setTimeout(function () {
      wordmark.style.transition = 'transform 0.35s ' + easing + ', opacity 0.3s ease';
      wordmark.style.transform = 'translateX(0)';
      wordmark.style.opacity = '1';
    }, 200);

    // Glide out to the left after hold
    setTimeout(function () {
      panel.style.transition = 'transform 0.45s ' + easing;
      panel.style.transform = 'translateX(-101%)';
    }, 750);

    // Navigate as the panel finishes sliding out
    setTimeout(function () {
      window.location.href = href;
      // Reset for potential bfcache restore
      panel.style.transition = 'none';
      panel.style.transform = 'translateX(101%)';
      wordmark.style.transition = 'none';
      wordmark.style.transform = 'translateX(60px)';
      wordmark.style.opacity = '0';
      panel.style.pointerEvents = 'none';
    }, 1220);
  });
})();
