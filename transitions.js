(function () {
  var NAV_PAGES = ['/', '/index.html', '/work.html', '/bts.html', '/about.html', '/contact.html'];

  function isNavPage(href) {
    try {
      var url = new URL(href, window.location.href);
      var path = url.pathname.replace(/\/+$/, '') || '/';
      return NAV_PAGES.some(function (p) { return path === p || path === p.replace('.html', ''); });
    } catch (e) { return false; }
  }

  var panel = document.createElement('div');
  panel.style.cssText = [
    'position:fixed;inset:0;z-index:9999;background:#000',
    'display:flex;align-items:center;justify-content:center',
    'pointer-events:none;overflow:hidden'
  ].join(';');

  var wordmark = document.createElement('div');
  wordmark.textContent = 'DAKE VISUALS';
  wordmark.style.cssText = [
    'font-family:Inter,sans-serif;font-weight:900;font-style:italic',
    'font-size:clamp(1.2rem,3.5vw,2.8rem)',
    'letter-spacing:0.08em;text-transform:uppercase;color:#fff',
    'transform:translateX(120%);transition:none'
  ].join(';');

  panel.appendChild(wordmark);
  document.body.appendChild(panel);

  var isCurrentNav = isNavPage(window.location.href);
  var isHome = (window.location.pathname === '/' || window.location.pathname === '/index.html');
  var holdDelay = isHome ? 1400 : 700;
  var liftDuration = 650;

  function parkBelow() {
    panel.style.transition = 'none';
    panel.style.transform = 'translateY(101%)';
    wordmark.style.transition = 'none';
    wordmark.style.transform = 'translateX(120%)';
  }

  if (isCurrentNav) {
    // Cover screen, text swipes in, panel lifts off — then silently park below
    panel.style.transition = 'none';
    panel.style.transform = 'translateY(0)';

    requestAnimationFrame(function () { requestAnimationFrame(function () {
      wordmark.style.transition = 'transform 0.55s cubic-bezier(0.76,0,0.24,1)';
      wordmark.style.transform = 'translateX(0)';
    }); });

    setTimeout(function () {
      panel.style.transition = 'transform ' + (liftDuration / 1000) + 's cubic-bezier(0.76,0,0.24,1)';
      panel.style.transform = 'translateY(-101%)';
      // Once fully off-screen above, quietly move to below — no reset flash possible
      setTimeout(parkBelow, liftDuration + 50);
    }, holdDelay);
  } else {
    parkBelow();
  }

  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { parkBelow(); }
  });

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;
    if (!isNavPage(href)) return;
    if (!isNavPage(window.location.href)) return;
    e.preventDefault();

    // Panel is already parked at translateY(101%) — rise straight up, no reset needed
    panel.style.pointerEvents = 'all';
    panel.style.transition = 'transform 0.6s cubic-bezier(0.76,0,0.24,1)';
    panel.style.transform = 'translateY(0)';
    setTimeout(function () {
      wordmark.style.transition = 'transform 0.55s cubic-bezier(0.76,0,0.24,1)';
      wordmark.style.transform = 'translateX(0)';
    }, 120);
    setTimeout(function () { window.location.href = href; }, 640);
  });
})();
