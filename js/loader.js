/**
 * MILO Franchise — GHL Page Loader
 * Fetches page content, nav, and footer from GitHub via jsDelivr CDN
 * and injects them into the GHL page.
 *
 * Usage: paste the per-page embed snippet into GHL page header.
 * Any updates pushed to GitHub are live automatically (CDN cache: ~10 min).
 *
 * Repo: https://github.com/betterbranding/MILO-Franchise
 */
(function () {
  'use strict';

  var BASE = 'https://cdn.jsdelivr.net/gh/betterbranding/MILO-Franchise@main';
  var PAGE = window.MILO_PAGE || 'home'; // set by per-page snippet
  var NAV_HEIGHT = 72; // px — matches --nav-h CSS variable

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

  function injectHTML(id, html, position) {
    var el = document.getElementById(id);
    if (el) { el.innerHTML = html; return; }
    var wrapper = document.createElement('div');
    wrapper.id = id + '-wrapper';
    wrapper.innerHTML = html;
    if (position === 'prepend') {
      document.body.insertBefore(wrapper, document.body.firstChild);
    } else {
      document.body.appendChild(wrapper);
    }
  }

  function addBodyPadding() {
    // Offset page content so fixed nav doesn't overlap it
    var existing = parseInt(document.body.style.paddingTop || '0', 10);
    if (existing < NAV_HEIGHT) {
      document.body.style.paddingTop = NAV_HEIGHT + 'px';
    }
  }

  function runInlineScripts(wrapper) {
    // Re-execute any <script> tags inside injected HTML
    var scripts = wrapper.querySelectorAll('script');
    scripts.forEach(function (s) {
      var script = document.createElement('script');
      script.textContent = s.textContent;
      document.body.appendChild(script);
    });
  }

  function init() {
    injectStyles();

    var navUrl    = BASE + '/includes/nav.html';
    var footerUrl = BASE + '/includes/footer.html';
    var pageUrl   = BASE + '/pages/' + PAGE + '.html';

    Promise.all([
      fetchHTML(navUrl),
      fetchHTML(footerUrl),
      fetchHTML(pageUrl).catch(function () {
        return fetchHTML(BASE + '/landing-pages/' + PAGE + '.html');
      })
    ]).then(function (results) {
      var navHTML    = results[0];
      var footerHTML = results[1];
      var pageHTML   = results[2];

      injectHTML('milo-nav',     navHTML,    'prepend');
      injectHTML('milo-content', pageHTML,   'append');
      injectHTML('milo-footer',  footerHTML, 'append');

      // Add body padding to clear the fixed nav
      addBodyPadding();

      // Re-run inline scripts from fetched HTML
      ['milo-nav-wrapper', 'milo-content-wrapper', 'milo-footer-wrapper'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) runInlineScripts(el);
      });

    }).catch(function (err) {
      console.warn('[MILO Loader] Error loading content:', err);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
