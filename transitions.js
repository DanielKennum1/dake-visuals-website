(function () {
  var NAV_PAGES = ['/', '/index.html', '/work.html', '/bts.html', '/about.html', '/contact.html'];

  function isNavPage(href) {
    try {
      var url = new URL(href, window.location.href);
      var path = url.pathname.replace(/\/+$/, '') || '/';
      return NAV_PAGES.some(function (p) { return path === p || path === p.replace('.html', ''); });
    } catch (e) { return false; }
  }

  function isHomePage() {
    var path = window.location.pathname.replace(/\/+$/, '') || '/';
    return path === '/' || path === '/index' || path === '/index.html';
  }

  var ease = 'cubic-bezier(0.76,0,0.24,1)';

  var panel = document.createElement('div');
  panel.style.cssText = [
    'position:fixed;inset:0;z-index:9999;background:#000',
    'pointer-events:none;will-change:transform',
    'transform:translate(0,0)'
  ].join(';');

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

  function exitPanel() {
    wm.style.transition = 'transform 0.22s ' + ease + ', opacity 0.2s ease';
    wm.style.transform = 'translate(calc(-50% + 220px),-50%)';
    wm.style.opacity = '0';

    panel.style.transition = 'transform 0.5s ' + ease;
    panel.style.transform = 'translate(0,-101%)';

    setTimeout(resetAll, 550);
  }

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
    panel.style.transition = 'none';
    panel.style.transform = 'translate(101%,0)';
  } else {
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      if (isHomePage()) {
        // Show wordmark — exit when Vimeo starts playing
        wm.style.transition = 'none';
        wm.style.transform = 'translate(-50%,-50%)';
        wm.style.opacity = '1';

        var iframe = document.querySelector('iframe[src*="vimeo.com"]');
        var exited = false;

        function doExit() {
          if (exited) return;
          exited = true;
          window.removeEventListener('message', onVimeoMsg);
          exitPanel();
        }

        function onVimeoMsg(e) {
          if (!String(e.origin).includes('vimeo.com')) return;
          try {
            var data = JSON.parse(e.data);
            if (data.event === 'ready' && iframe) {
              iframe.contentWindow.postMessage(JSON.stringify({ method: 'addEventListener', value: 'play' }), '*');
            } else if (data.event === 'play') {
              doExit();
            }
          } catch (_) {}
        }

        window.addEventListener('message', onVimeoMsg);

        // Subscribe to Vimeo ready event
        if (iframe) {
          iframe.contentWindow.postMessage(JSON.stringify({ method: 'addEventListener', value: 'ready' }), '*');
          iframe.addEventListener('load', function () {
            iframe.contentWindow.postMessage(JSON.stringify({ method: 'addEventListener', value: 'ready' }), '*');
          });
        }

        // Fallback: exit after 3s if Vimeo never responds
        setTimeout(doExit, 3000);
      } else {
        // All other nav pages — no wordmark, just lift panel
        panel.style.transition = 'transform 0.5s ' + ease;
        panel.style.transform = 'translate(0,-101%)';
        setTimeout(resetAll, 550);
      }
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

    panel.style.pointerEvents = 'all';
    panel.style.transition = 'transform 0.14s ' + ease;
    panel.style.transform = 'translate(0,0)';

    setTimeout(function () { window.location.href = href; }, 180);
  });
})();
