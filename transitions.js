(function () {
  var NAV_PAGES = ['/', '/index.html', '/work.html', '/bts.html', '/about.html', '/contact.html'];

  function isNavPage(href) {
    try {
      var url = new URL(href, window.location.href);
      var path = url.pathname.replace(/\/+$/, '') || '/';
      return NAV_PAGES.some(function (p) { return path === p || path === p.replace('.html', ''); });
    } catch (e) { return false; }
  }

  function isHomePage(href) {
    try {
      var url = new URL(href || window.location.href, window.location.href);
      var path = url.pathname.replace(/\/+$/, '') || '/';
      return path === '/' || path === '/index' || path === '/index.html';
    } catch (e) { return false; }
  }

  var ease = 'cubic-bezier(0.76,0,0.24,1)';

  var panel = document.createElement('div');
  panel.style.cssText = [
    'position:fixed;inset:0;z-index:9999;background:#f7efdb',
    'pointer-events:none;will-change:transform',
    'transform:translate(0,0)'
  ].join(';');

  var wm = document.createElement('div');
  wm.textContent = 'DAKE VISUALS';
  wm.style.cssText = [
    'position:fixed;top:50%;left:50%;z-index:10000',
    'font-family:Inter,sans-serif;font-weight:900;font-style:italic',
    'font-size:clamp(1.2rem,3.5vw,2.8rem)',
    'letter-spacing:0.08em;text-transform:uppercase;color:#000',
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

  if (isHomePage()) {
    requestAnimationFrame(function () { requestAnimationFrame(function () {
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

      if (iframe) {
        iframe.contentWindow.postMessage(JSON.stringify({ method: 'addEventListener', value: 'ready' }), '*');
        iframe.addEventListener('load', function () {
          iframe.contentWindow.postMessage(JSON.stringify({ method: 'addEventListener', value: 'ready' }), '*');
        });
      }

      setTimeout(doExit, 3000);
    }); });
  } else {
    panel.style.transition = 'none';
    panel.style.transform = 'translate(101%,0)';
  }

  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { resetAll(); }
  });
})();
