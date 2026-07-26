(function () {
  var NAV_PAGES = ['/', '/index.html', '/work.html', '/bts.html', '/about.html', '/contact.html'];

  function isNavPage(href) {
    try {
      var url = new URL(href, window.location.href);
      var path = url.pathname.replace(/\/+$/, '') || '/';
      return NAV_PAGES.some(function (p) { return path === p || path === p.replace('.html', ''); });
    } catch (e) { return false; }
  }

  // Inject keyframes
  var style = document.createElement('style');
  style.textContent = [
    '@keyframes tx-line { from { transform:scaleX(0) } to { transform:scaleX(1) } }',
    '.tx-letter { display:inline-block; transform:translateY(115%); opacity:0; transition:transform 0.55s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease; }'
  ].join('');
  document.head.appendChild(style);

  // Build overlay
  var overlay = document.createElement('div');
  overlay.style.cssText = [
    'position:fixed;inset:0;z-index:9999;background:#000',
    'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.5rem',
    'transform:translateX(0);transition:none;pointer-events:all'
  ].join(';');

  function makeWordRow(word, baseDelay) {
    var row = document.createElement('div');
    row.style.cssText = 'overflow:hidden;display:flex';
    word.split('').forEach(function (ch, i) {
      var span = document.createElement('span');
      span.className = 'tx-letter';
      span.textContent = ch === ' ' ? ' ' : ch;
      span.style.transitionDelay = (baseDelay + i * 0.055) + 's';
      row.appendChild(span);
    });
    return row;
  }

  var line1 = makeWordRow('DAKE', 0);
  var line2 = makeWordRow('VISUALS', 0.08);

  var textWrap = document.createElement('div');
  textWrap.style.cssText = [
    'font-family:Inter,sans-serif;font-weight:900;font-style:italic',
    'font-size:clamp(2.2rem,8vw,6rem);letter-spacing:0.04em;text-transform:uppercase;color:#fff',
    'display:flex;flex-direction:column;align-items:center;gap:0'
  ].join(';');
  textWrap.appendChild(line1);
  textWrap.appendChild(line2);

  var divider = document.createElement('div');
  divider.style.cssText = [
    'width:clamp(120px,18vw,260px);height:1px;background:#fff',
    'transform:scaleX(0);transform-origin:left;margin-top:0.6rem',
    'opacity:0'
  ].join(';');

  overlay.appendChild(textWrap);
  overlay.appendChild(divider);
  document.body.appendChild(overlay);

  function animateIn(delay) {
    delay = delay || 0;
    overlay.querySelectorAll('.tx-letter').forEach(function (el) {
      el.style.transform = 'translateY(115%)';
      el.style.opacity = '0';
    });
    divider.style.transform = 'scaleX(0)';
    divider.style.opacity = '0';
    divider.style.transition = 'none';

    setTimeout(function () {
      overlay.querySelectorAll('.tx-letter').forEach(function (el) {
        el.style.transform = 'translateY(0)';
        el.style.opacity = '1';
      });
      setTimeout(function () {
        divider.style.transition = 'transform 0.6s cubic-bezier(0.22,1,0.36,1), opacity 0.1s';
        divider.style.opacity = '1';
        divider.style.transform = 'scaleX(1)';
      }, delay + 380);
    }, delay);
  }

  // ── ENTRANCE: overlay covers screen on load, then slides away ──
  var isHome = ['/', '/index.html'].some(function (p) {
    var path = window.location.pathname;
    return path === p || path === p.replace('.html', '');
  });

  animateIn(80);

  var holdDelay = isHome ? 1600 : 800;
  setTimeout(function () {
    overlay.style.transition = 'transform 0.65s cubic-bezier(0.76,0,0.24,1)';
    overlay.style.transform = 'translateX(-101%)';
    setTimeout(function () { overlay.style.pointerEvents = 'none'; }, 700);
  }, holdDelay);

  // ── EXIT: slide in from right, animate text, navigate ──
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      overlay.style.transition = 'none';
      overlay.style.transform = 'translateX(101%)';
      overlay.style.pointerEvents = 'none';
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

    // Reset letters before sliding in
    overlay.querySelectorAll('.tx-letter').forEach(function (el) {
      el.style.transitionDuration = '0s';
      el.style.transform = 'translateY(115%)';
      el.style.opacity = '0';
    });
    divider.style.transition = 'none';
    divider.style.transform = 'scaleX(0)';
    divider.style.opacity = '0';

    overlay.style.transition = 'none';
    overlay.style.transform = 'translateX(101%)';
    overlay.style.pointerEvents = 'all';

    requestAnimationFrame(function () { requestAnimationFrame(function () {
      overlay.style.transition = 'transform 0.55s cubic-bezier(0.76,0,0.24,1)';
      overlay.style.transform = 'translateX(0)';
      animateIn(200);
      setTimeout(function () { window.location.href = href; }, 950);
    }); });
  });
})();
