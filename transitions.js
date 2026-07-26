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
    'letter-spacing:0.08em;text-transform:uppercase;color:#fff',
    'transform:translateX(60px);opacity:0;will-change:transform,opacity'
  ].join(';');

  panel.appendChild(wordmark);
  document.body.appendChild(panel);

  var isCurrentNav = isNavPage(window.location.href);

  if (isCurrentNav) {
    // New page: panel covers screen, hold, then exit upward
    panel.style.transform = 'translate(0,0)';
    panel.style.transition = 'none';

    requestAnimationFrame(function () { requestAnimationFrame(function () {
      // Wordmark slides in
      wordmark.style.transition = 'transform 0.4s ' + ease + ', opacity 0.3s ease';
      wordmark.style.transform = 'translateX(0)';
      wordmark.style.opacity = '1';

      // Panel exits upward — reveals new page from bottom to top
      setTimeout(function () {
        panel.style.transition = 'transform 0.6s ' + ease;
        panel.style.transform = 'translate(0,-101%)';

        // Once off screen, park at right for next exit — both off-screen, jump is invisible
        setTimeout(function () {
          panel.style.transition = 'none';
          panel.style.transform = 'translate(101%,0)';
          wordmark.style.transition = 'none';
          wordmark.style.transform = 'translateX(60px)';
          wordmark.style.opacity = '0';
        }, 650);
      }, 600);
    }); });
  } else {
    panel.style.transform = 'translate(101%,0)';
    panel.style.transition = 'none';
  }

  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      panel.style.transition = 'none';
      panel.style.transform = 'translate(101%,0)';
      wordmark.style.transition = 'none';
      wordmark.style.transform = 'translateX(60px)';
      wordmark.style.opacity = '0';
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

    // Slide panel in from right
    panel.style.pointerEvents = 'all';
    panel.style.transition = 'transform 0.45s ' + ease;
    panel.style.transform = 'translate(0,0)';

    // Wordmark fades in shortly after
    setTimeout(function () {
      wordmark.style.transition = 'transform 0.35s ' + ease + ', opacity 0.25s ease';
      wordmark.style.transform = 'translateX(0)';
      wordmark.style.opacity = '1';
    }, 150);

    // Navigate fast — panel is still sweeping in, new page gets the full exit animation
    setTimeout(function () { window.location.href = href; }, 250);
  });
})();
