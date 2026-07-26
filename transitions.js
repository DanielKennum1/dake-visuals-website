(function () {
  var NAV_PAGES = ['/', '/index.html', '/work.html', '/bts.html', '/about.html', '/contact.html'];

  function isNavPage(href) {
    try {
      var url = new URL(href, window.location.href);
      var path = url.pathname.replace(/\/+$/, '') || '/';
      return NAV_PAGES.some(function (p) { return path === p || path === p.replace('.html', ''); });
    } catch (e) { return false; }
  }

  function makePanel() {
    var el = document.createElement('div');
    el.style.cssText = [
      'position:fixed;inset:0;z-index:9999;background:#000',
      'display:flex;align-items:center;justify-content:center',
      'pointer-events:none;overflow:hidden'
    ].join(';');
    var wm = document.createElement('div');
    wm.textContent = 'DAKE VISUALS';
    wm.style.cssText = [
      'font-family:Inter,sans-serif;font-weight:900;font-style:italic',
      'font-size:clamp(1.2rem,3.5vw,2.8rem)',
      'letter-spacing:0.08em;text-transform:uppercase;color:#fff',
      'transform:translateX(120%)',
      'transition:transform 0.55s cubic-bezier(0.76,0,0.24,1)'
    ].join(';');
    el.appendChild(wm);
    document.body.appendChild(el);
    return { panel: el, wordmark: wm };
  }

  var isCurrentNav = isNavPage(window.location.href);
  var isHome = (window.location.pathname === '/' || window.location.pathname === '/index.html');

  // ── ENTRANCE: panel covers screen on arrival, then rises up ──
  var ent = makePanel();
  if (isCurrentNav) {
    ent.panel.style.transform = 'translateY(0)';
    ent.panel.style.transition = 'none';
    // Text slides in from right shortly after load
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      ent.wordmark.style.transform = 'translateX(0)';
    }); });
    setTimeout(function () {
      ent.panel.style.transition = 'transform 0.65s cubic-bezier(0.76,0,0.24,1)';
      ent.panel.style.transform = 'translateY(-101%)';
    }, isHome ? 1400 : 700);
  } else {
    ent.panel.style.transform = 'translateY(-101%)';
    ent.panel.style.transition = 'none';
  }

  // ── EXIT: parked below screen, rises up on click ──
  var ext = makePanel();
  ext.panel.style.transform = 'translateY(101%)';
  ext.panel.style.transition = 'transform 0.6s cubic-bezier(0.76,0,0.24,1)';

  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      ent.panel.style.transition = 'none';
      ent.panel.style.transform = 'translateY(-101%)';
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
    ext.panel.style.pointerEvents = 'all';
    ext.panel.style.transform = 'translateY(0)';
    // Text swipes in from the right as the panel rises
    setTimeout(function () {
      ext.wordmark.style.transform = 'translateX(0)';
    }, 120);
    setTimeout(function () { window.location.href = href; }, 640);
  });
})();
