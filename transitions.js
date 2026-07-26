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

  // Black background panel — starts covering screen so no flash on nav pages
  var panel = document.createElement('div');
  panel.style.cssText = [
    'position:fixed;inset:0;z-index:9999;background:#000',
    'pointer-events:none;will-change:transform',
    'transform:translate(0,0)'
  ].join(';');

  // Wordmark — separate fixed element, moves independently of panel
  var wm = document.createElement('div');
  wm.textContent = 'DAKE VISUALS';
  wm.style.cssText = [
    'position:fixed;top:50%;left:50%;z-index:10000',
    'font-family:Inter,sans-serif;font-weight:900;font-style:italic',
    'font-size:clamp(1.2rem,3.5vw,2.8rem)',
    'letter-spacing:0.08em;text-transform:uppercase;color:#fff',
    'pointer-events:none;will-change:transform,opacity',
    'transform:translate(calc(-50% + 80px),-50%);opacity:0'
  ].join(';');

  document.body.appendChild(panel);
  document.body.appendChild(wm);

  function resetAll() {
    panel.style.transition = 'none';
    panel.style.transform = 'translate(101%,0)';
    wm.style.transition = 'none';
    wm.style.transform = 'translate(calc(-50% + 80px),-50%)';
    wm.style.opacity = '0';
    panel.style.pointerEvents = 'none';
  }

  var isCurrentNav = isNavPage(window.location.href);

  if (!isCurrentNav) {
    // Not a nav page — hide panel immediately, no transition
    panel.style.transition = 'none';
    panel.style.transform = 'translate(101%,0)';
  } else {
    // Panel already covers screen from initial CSS — go straight to animation
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      // Wordmark appears instantly — no re-entrance, just hold then exit
      wm.style.transition = 'none';
      wm.style.transform = 'translate(-50%,-50%)';
      wm.style.opacity = '1';

      // Hold, then wordmark snaps right + panel lifts simultaneously
      setTimeout(function () {
        wm.style.transition = 'transform 0.28s ' + ease + ', opacity 0.25s ease';
        wm.style.transform = 'translate(calc(-50% + 220px),-50%)';
        wm.style.opacity = '0';

        panel.style.transition = 'transform 0.65s ' + ease;
        panel.style.transform = 'translate(0,-101%)';

        setTimeout(resetAll, 700);
      }, 1500);
    }); });
  }

  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { resetAll(); }
  });

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;
    if (!isNavPage(href) || !isNavPage(window.location.href)) return;
    e.preventDefault();

    // Panel sweeps in from right
    panel.style.pointerEvents = 'all';
    panel.style.transition = 'transform 0.38s ' + ease;
    panel.style.transform = 'translate(0,0)';

    // Wordmark glides in shortly after
    setTimeout(function () {
      wm.style.transition = 'transform 0.3s ' + ease + ', opacity 0.25s ease';
      wm.style.transform = 'translate(-50%,-50%)';
      wm.style.opacity = '1';
    }, 150);

    // Navigate once fully covered
    setTimeout(function () { window.location.href = href; }, 500);
  });
})();
