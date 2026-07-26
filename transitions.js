(function () {
  var NAV_PAGES = ['/', '/index.html', '/work.html', '/bts.html', '/about.html', '/contact.html'];

  function isNavPage(href) {
    try {
      var url = new URL(href, window.location.href);
      var path = url.pathname.replace(/\/+$/, '') || '/';
      return NAV_PAGES.some(function (p) { return path === p || path === p.replace('.html', ''); });
    } catch (e) { return false; }
  }

  // Single panel — no stacking conflict
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

  if (isCurrentNav) {
    // Cover screen on arrival, text swipes in, then panel lifts
    panel.style.transform = 'translateY(0)';
    panel.style.transition = 'none';
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      wordmark.style.transition = 'transform 0.55s cubic-bezier(0.76,0,0.24,1)';
      wordmark.style.transform = 'translateX(0)';
    }); });
    setTimeout(function () {
      panel.style.transition = 'transform 0.65s cubic-bezier(0.76,0,0.24,1)';
      panel.style.transform = 'translateY(-101%)';
    }, isHome ? 1400 : 700);
  } else {
    panel.style.transform = 'translateY(-101%)';
    panel.style.transition = 'none';
  }

  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      panel.style.transition = 'none';
      panel.style.transform = 'translateY(-101%)';
      wordmark.style.transition = 'none';
      wordmark.style.transform = 'translateX(120%)';
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

    // Park panel below screen with no transition, then let browser paint one frame
    // before animating up — eliminates any flash from repositioning
    panel.style.transition = 'none';
    panel.style.transform = 'translateY(101%)';
    wordmark.style.transition = 'none';
    wordmark.style.transform = 'translateX(120%)';
    panel.style.pointerEvents = 'all';

    requestAnimationFrame(function () { requestAnimationFrame(function () {
      panel.style.transition = 'transform 0.6s cubic-bezier(0.76,0,0.24,1)';
      panel.style.transform = 'translateY(0)';
      setTimeout(function () {
        wordmark.style.transition = 'transform 0.55s cubic-bezier(0.76,0,0.24,1)';
        wordmark.style.transform = 'translateX(0)';
      }, 120);
      setTimeout(function () { window.location.href = href; }, 640);
    }); });
  });
})();
