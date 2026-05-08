/**
 * MILO Franchise — GHL Page Loader v2
 * Fetches nav, page content, and footer from GitHub via jsDelivr CDN.
 * Nav is transparent → white on scroll (no body padding, no spacer, no gap).
 *
 * Usage: paste per-page snippet into GHL page Header Tracking Code:
 *   <script>var MILO_PAGE='home';</script>
 *   <script src="https://cdn.jsdelivr.net/gh/betterbranding/MILO-Franchise@main/js/loader.js"></script>
 *
 * Repo: https://github.com/betterbranding/MILO-Franchise
 */
(function () {
  'use strict';

  var BASE = 'https://cdn.jsdelivr.net/gh/betterbranding/MILO-Franchise@main';
  var PAGE = window.MILO_PAGE || 'home';

  /* ── STEP 1: Immediately inject CSS to kill GHL's default nav ── */
  var killCSS = document.createElement('style');
  killCSS.id = 'milo-ghl-kill';
  killCSS.textContent = [
    '/* Kill ALL GHL default nav/header elements */',
    'body { padding-top: 0 !important; margin-top: 0 !important; }',
    '#navbar, nav.navbar, #nav-menu-popup, .navbar,',
    'header.header, .hl-page-header, .header-wrapper,',
    '.c-header, #section-header { display: none !important; height: 0 !important; overflow: hidden !important; margin: 0 !important; padding: 0 !important; }',
    '/* Target GHL nav wrapper inside #__nuxt */',
    '#__nuxt > div:first-child { display: none !important; height: 0 !important; }',
    '#__nuxt > .bgCover { display: block !important; height: auto !important; }'
  ].join('\n');
  (document.head || document.documentElement).appendChild(killCSS);

  /* ── Helpers ── */
  function fetchHTML(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('Failed to fetch: ' + url);
      return r.text();
    });
  }

  function injectStyles() {
    if (document.getElementById('milo-styles')) return;
    var link = document.createElement('link');
    link.id = 'milo-styles';
    link.rel = 'stylesheet';
    link.href = BASE + '/css/styles.css';
    document.head.appendChild(link);
  }

  function runInlineScripts(container) {
    var scripts = container.querySelectorAll('script');
    scripts.forEach(function (oldScript) {
      var newScript = document.createElement('script');
      if (oldScript.src) {
        newScript.src = oldScript.src;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      document.body.appendChild(newScript);
      oldScript.remove();
    });
  }

  /* ── STEP 2: Aggressively hide GHL nav elements via JS ── */
  function hideGHLNav() {
    ['#navbar', 'nav.navbar', '#nav-menu-popup', '.navbar', 'header.header', '.hl-page-header'].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el) el.style.cssText = 'display:none!important;height:0!important;margin:0!important;padding:0!important;';
    });
    // Walk #__nuxt children and hide the nav wrapper
    var nuxt = document.getElementById('__nuxt');
    if (nuxt) {
      Array.from(nuxt.children).forEach(function (child) {
        if (child.querySelector && child.querySelector('#nav-menu-popup, nav, .nav-menu')) {
          child.style.cssText = 'display:none!important;height:0!important;';
        }
      });
    }
    // Always reset body padding
    document.body.style.paddingTop = '0';
    document.body.style.marginTop = '0';
  }

  /* ── STEP 3: Scroll listener for transparent → white nav ── */
  function setupScrollNav() {
    var nav = document.getElementById('milo-nav');
    if (!nav) return;
    function check() {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }
    window.addEventListener('scroll', check, { passive: true });
    check(); // set initial state
  }

  /* ── STEP 4: Load & inject everything ── */
  function init() {
    injectStyles();
    hideGHLNav();

    Promise.all([
      fetchHTML(BASE + '/includes/nav.html'),
      fetchHTML(BASE + '/includes/footer.html'),
      fetchHTML(BASE + '/pages/' + PAGE + '.html').catch(function () {
        return fetchHTML(BASE + '/landing-pages/' + PAGE + '.html');
      })
    ]).then(function (results) {
      var navHTML    = results[0];
      var footerHTML = results[1];
      var pageHTML   = results[2];

      // Build single wrapper with nav + page + footer
      var wrapper = document.createElement('div');
      wrapper.id = 'milo-site';
      wrapper.innerHTML = navHTML + pageHTML + footerHTML;
      document.body.insertBefore(wrapper, document.body.firstChild);

      // Run inline scripts from fetched HTML
      runInlineScripts(wrapper);

      // Setup nav scroll effect
      setupScrollNav();

      // Hide GHL nav elements (runs repeatedly to beat Vue hydration)
      hideGHLNav();
      var count = 0;
      var interval = setInterval(function () {
        hideGHLNav();
        if (++count > 20) clearInterval(interval);
      }, 500);

    }).catch(function (err) {
      console.warn('[MILO Loader] Error:', err);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
