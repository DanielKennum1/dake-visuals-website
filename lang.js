// ── Language switch: Eng / Dan ──
//
// Translation is opt-in. An element is translated only if it carries a
// data-da attribute; everything else is left exactly as written.
//
// NEVER TRANSLATED (deliberately — do not add data-da to these):
//   · DAKE Visuals          · BTS
//   · Direct / Create / Share
//   · client names and logo labels
//
// Supported attributes:
//   data-da="…"              swaps the element's text
//   data-da-placeholder="…"  swaps an input/textarea placeholder
//   data-da-aria="…"         swaps aria-label
//   data-da-html="…"         swaps innerHTML (for copy containing <em>, <br> …)
(function () {
  var KEY = 'dv-lang';
  var DEFAULT = 'en';

  function saved() {
    try { var v = localStorage.getItem(KEY); return v === 'da' ? 'da' : DEFAULT; }
    catch (e) { return DEFAULT; }
  }
  function remember(lang) {
    try { localStorage.setItem(KEY, lang); } catch (e) {}
  }

  // Stash the English original the first time we translate an element, so
  // switching back is exact rather than re-derived.
  function swap(el, attr, apply, read) {
    var da = el.getAttribute(attr);
    if (da === null) return;
    var stash = 'dvEn' + attr.replace(/[^a-z]/g, '');
    if (el.dataset[stash] === undefined) el.dataset[stash] = read(el);
    apply(el, da);
  }
  function restore(el, attr, apply) {
    var stash = 'dvEn' + attr.replace(/[^a-z]/g, '');
    if (el.dataset[stash] !== undefined) apply(el, el.dataset[stash]);
  }

  var FIELDS = [
    ['data-da',
      function (el, v) { el.textContent = v; },
      function (el) { return el.textContent; }],
    ['data-da-html',
      function (el, v) { el.innerHTML = v; },
      function (el) { return el.innerHTML; }],
    ['data-da-placeholder',
      function (el, v) { el.placeholder = v; },
      function (el) { return el.placeholder; }],
    ['data-da-aria',
      function (el, v) { el.setAttribute('aria-label', v); },
      function (el) { return el.getAttribute('aria-label') || ''; }]
  ];

  function apply(lang) {
    FIELDS.forEach(function (f) {
      var attr = f[0], set = f[1], get = f[2];
      document.querySelectorAll('[' + attr + ']').forEach(function (el) {
        if (lang === 'da') swap(el, attr, set, get);
        else restore(el, attr, set);
      });
    });
    document.documentElement.lang = lang === 'da' ? 'da' : 'en';

    document.querySelectorAll('.lang-switch').forEach(function (sw) {
      sw.setAttribute('data-lang', lang);
      sw.querySelectorAll('.lang-opt').forEach(function (b) {
        var on = b.getAttribute('data-lang') === lang;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    });
  }

  function init() {
    apply(saved());
    document.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('.lang-opt') : null;
      if (!btn) return;
      e.preventDefault();
      var lang = btn.getAttribute('data-lang') === 'da' ? 'da' : 'en';
      remember(lang);
      apply(lang);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
