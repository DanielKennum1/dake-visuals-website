(function () {
  var NAV_PAGES = ['/', '/index.html', '/work.html', '/bts.html', '/about.html', '/contact.html'];

  function isNavPage(href) {
    try {
      var url = new URL(href, window.location.href);
      var path = url.pathname.replace(/\/+$/, '') || '/';
      return NAV_PAGES.some(function (p) { return path === p || path === p.replace('.html', ''); });
    } catch (e) { return false; }
  }

  var ease = 'cubic-bezier(0.76,0,0.24,1)';

  var panel = document.createElement('div');
  panel.style.cssText = [
    'position:fixed;inset:0;z-index:9999;background:#000',
    'display:flex;align-items:center;justify-content:center',
    'pointer-events:none;will-change:transform'
  ].join(';');

  var wordmark = document.createElement('div');
  wordmark.textContent = 'DAKE VISUALS';
  wordmark.style.cssText = [
    'font-family:Inter,sans-serif;font-weight:900;font-style:italic',
    'font-size:clamp(1.2rem,3.5vw,2.8rem)',
    'letter-spacing:0.08em;text-transform:uppercase;color:#fff'
  ].join(';');

  panel.appendChild(wordmark);
  document.body.appendChild(panel);

  var isCurrentNav = isNavPage(window.location.href);

  if (isCurrentNav) {
    // Entrance: panel covers screen on arrival, slides out to the left
    panel.style.transform = 'translateX(0)';
    panel.style.transition = 'none';

    requestAnimationFrame(function () { requestAnimationFrame(function () {
      panel.style.transition = 'transform 0.5s ' + ease;
      panel.style.transform = 'translateX(-101%)';
      // Once off-screen, park it on the right ready for the next exit
      setTimeout(function () {
        panel.style.transition = 'none';
        panel.style.transform = 'translateX(101%)';
      }, 550);
    }); });
  } else {
    panel.style.transform = 'translateX(101%)';
    panel.style.transition = 'none';
  }

  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      panel.style.transition = 'none';
      panel.style.transform = 'translateX(101%)';
      panel.style.pointerEvents = 'none';
    }
  });

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;
    if (!isNavPage(href) || !isNavPage(window.location.href)) return;
    e.preventDefault();

    // Panel is parked at translateX(101%) — slide it in cleanly
    panel.style.pointerEvents = 'all';
    panel.style.transition = 'transform 0.5s ' + ease;
    panel.style.transform = 'translateX(0)';

    // Navigate while the panel is covering the screen
    setTimeout(function () { window.location.href = href; }, 520);
  });
})();
