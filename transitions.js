(function () {
  var NAV_PAGES = ['/', '/index.html', '/work.html', '/bts.html', '/about.html', '/contact.html'];

  function isNavPage(href) {
    try {
      var url = new URL(href, window.location.href);
      var path = url.pathname.replace(/\/+$/, '') || '/';
      return NAV_PAGES.some(function (p) { return path === p || path === p.replace('.html', ''); });
    } catch (e) { return false; }
  }

  function makePanel(text) {
    var el = document.createElement('div');
    el.style.cssText = [
      'position:fixed;inset:0;z-index:9999;background:#000',
      'display:flex;align-items:center;justify-content:center',
      'pointer-events:none'
    ].join(';');
    var wm = document.createElement('div');
    wm.textContent = text;
    wm.style.cssText = [
      'font-family:Inter,sans-serif;font-weight:900;font-style:italic',
      'font-size:clamp(1.2rem,3.5vw,2.8rem)',
      'letter-spacing:0.08em;text-transform:uppercase;color:#fff'
    ].join(';');
    el.appendChild(wm);
    document.body.appendChild(el);
    return el;
  }

  var isCurrentNav = isNavPage(window.location.href);

  // ── ENTRANCE panel: only animates on nav pages ──
  var entrance = makePanel('DAKE VISUALS');
  if (isCurrentNav) {
    entrance.style.transform = 'translateX(0)';
    entrance.style.transition = 'none';
    var isHome = (window.location.pathname === '/' || window.location.pathname === '/index.html');
    setTimeout(function () {
      entrance.style.transition = 'transform 0.65s cubic-bezier(0.76,0,0.24,1)';
      entrance.style.transform = 'translateX(-101%)';
    }, isHome ? 1400 : 600);
  } else {
    entrance.style.transform = 'translateX(-101%)';
    entrance.style.transition = 'none';
  }

  // ── EXIT panel: always off-screen right, slides in on click ──
  var exit = makePanel('DAKE VISUALS');
  exit.style.transform = 'translateX(101%)';
  exit.style.transition = 'transform 0.6s cubic-bezier(0.76,0,0.24,1)';

  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      entrance.style.transition = 'none';
      entrance.style.transform = 'translateX(-101%)';
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
    exit.style.pointerEvents = 'all';
    exit.style.transform = 'translateX(0)';
    setTimeout(function () { window.location.href = href; }, 620);
  });
})();
