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

// Sliding nav pill — glides between items instead of fading in/out
(function () {
  var nav = document.querySelector('.nav-center');
  if (!nav || getComputedStyle(nav).display === 'none') return;

  // Suppress individual link borders so the pill is the only indicator
  var s = document.createElement('style');
  s.textContent = '.nav-center a:hover{border-color:transparent!important}.nav-center a.active{border-color:transparent!important}.nav-pill{position:absolute;top:0;bottom:0;border-radius:999px;border:1.5px solid;pointer-events:none;transition:left .28s cubic-bezier(.25,.46,.45,.94),width .28s cubic-bezier(.25,.46,.45,.94),opacity .2s ease;opacity:0}';
  document.head.appendChild(s);

  var pill = document.createElement('span');
  pill.className = 'nav-pill';
  nav.style.position = 'relative';
  nav.appendChild(pill);

  // Pick border colour based on whether navbar has a solid background
  var navbar = document.getElementById('navbar');
  var bg = navbar ? getComputedStyle(navbar).backgroundColor : '';
  var isLight = bg && bg !== 'rgba(0, 0, 0, 0)';
  pill.style.borderColor = isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.5)';

  var active = nav.querySelector('a.active');

  function movePill(el, instant) {
    var r = el.getBoundingClientRect();
    var p = nav.getBoundingClientRect();
    if (instant) { pill.style.transition = 'none'; }
    pill.style.left  = (r.left - p.left) + 'px';
    pill.style.width = r.width + 'px';
    pill.style.opacity = '1';
    if (instant) { requestAnimationFrame(function () { pill.style.transition = ''; }); }
  }

  // Set initial position on the active link without animation
  if (active) movePill(active, true);

  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('mouseenter', function () { movePill(a); });
  });

  nav.addEventListener('mouseleave', function () {
    if (active) movePill(active);
    else pill.style.opacity = '0';
  });
})();
