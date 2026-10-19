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
      // Fade the wordmark up onto the cream panel rather than snapping it in
      var FADE_MS = 1300;
      wm.style.transition = 'none';
      wm.style.transform = 'translate(calc(-50% + 26px),-50%)';
      wm.style.opacity = '0';
      requestAnimationFrame(function () {
        wm.style.transition = 'transform ' + (FADE_MS / 1000) + 's ' + ease +
                              ', opacity ' + (FADE_MS / 1000) + 's cubic-bezier(0.4,0,0.6,1)';
        wm.style.transform = 'translate(-50%,-50%)';
        wm.style.opacity = '1';
      });

      var shownAt = Date.now();
      var iframe = document.querySelector('iframe[src*="vimeo.com"]');
      var exited = false;

      function doExit() {
        if (exited) return;
        // Let the fade-in finish before the panel leaves
        var waited = Date.now() - shownAt;
        if (waited < FADE_MS + 150) {
          setTimeout(doExit, FADE_MS + 150 - waited);
          return;
        }
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

// ── Page transition: a cream panel carrying the destination name ──
// Leaves by sweeping in from the right, arrives by sweeping off to the left,
// and holds on the new page until its content has actually loaded.
(function () {
  var NAMES = {
    '/work': 'Work', '/bts': 'BTS', '/about': 'About', '/contact': 'Contact'
  };
  var ease = 'cubic-bezier(0.76,0,0.24,1)';
  var MIN_COVER = 260;     // never flash away instantly
  var MAX_COVER = 4500;    // never trap the visitor behind a stalled asset

  function pathOf(href) {
    try {
      var u = new URL(href, location.href);
      if (u.origin !== location.origin) return null;
      return u.pathname.replace(/\/+$/, '').replace(/\.html$/, '') || '/';
    } catch (e) { return null; }
  }

  var style = document.createElement('style');
  style.textContent =
    '.pt-panel{position:fixed;inset:0;z-index:99999;background:#f7efdb;' +
    'display:flex;align-items:center;justify-content:center;pointer-events:none;' +
    'transform:translateX(100%);will-change:transform}' +
    '.pt-panel b{font-family:Inter,sans-serif;font-weight:900;font-style:italic;' +
    'text-transform:uppercase;font-size:clamp(1.6rem,7vw,4.5rem);letter-spacing:-0.02em;' +
    'color:#000;line-height:1}';
  document.head.appendChild(style);

  function panelWith(name) {
    var p = document.createElement('div');
    p.className = 'pt-panel';
    var b = document.createElement('b');
    b.textContent = name;
    p.appendChild(b);
    document.body.appendChild(p);
    return p;
  }

  // ---------- arriving ----------
  var incoming = null;
  try { incoming = sessionStorage.getItem('pt-to'); sessionStorage.removeItem('pt-to'); } catch (e) {}

  var here = pathOf(location.href);
  if (incoming && here !== '/' && here !== '/index') {
    var panel = panelWith(incoming);
    panel.style.transform = 'translateX(0)';           // already covering
    document.documentElement.className =
      document.documentElement.className.replace(/\s*pt-arrive/, '');

    var started = Date.now(), lifted = false;
    function lift() {
      if (lifted) return;
      lifted = true;
      var wait = Math.max(0, MIN_COVER - (Date.now() - started));
      setTimeout(function () {
        panel.style.transition = 'transform 0.42s ' + ease;
        panel.style.transform = 'translateX(-100%)';
        setTimeout(function () { if (panel.parentNode) panel.parentNode.removeChild(panel); }, 480);
      }, wait);
    }

    // wait for the images this page has actually put in the DOM
    var pending = [].slice.call(document.images).filter(function (i) { return !i.complete; });
    var left = pending.length;
    if (!left) {
      if (document.readyState === 'complete') lift();
      else window.addEventListener('load', lift);
    } else {
      pending.forEach(function (img) {
        function tick() { if (--left <= 0) lift(); }
        img.addEventListener('load', tick);
        img.addEventListener('error', tick);
      });
    }
    setTimeout(lift, MAX_COVER);
  } else if (document.documentElement.className.indexOf('pt-arrive') > -1) {
    document.documentElement.className =
      document.documentElement.className.replace(/\s*pt-arrive/, '');
  }

  // ---------- leaving ----------
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest ? e.target.closest('a') : null;
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;

    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || /^(mailto|tel):/i.test(href)) return;

    var dest = pathOf(a.href);
    if (!dest || dest === here) return;
    var name = NAMES[dest];
    if (!name) return;                                  // only the named nav pages

    e.preventDefault();
    try { sessionStorage.setItem('pt-to', name); } catch (err) {}

    var out = panelWith(name);
    requestAnimationFrame(function () {
      out.style.transition = 'transform 0.42s ' + ease;
      out.style.transform = 'translateX(0)';
    });
    setTimeout(function () { location.href = a.href; }, 440);
  });
})();
