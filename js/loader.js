/**
 * MILO Franchise — GHL Page Loader
 * Fetches page content, nav, and footer from GitHub via jsDelivr CDN
 * and injects them into the GHL page.
 *
 * Usage: paste the per-page embed snippet into GHL page header.
 * Any updates pushed to GitHub are live automatically (CDN cache: ~10 min).
 *
 * Repo: https://github.com/GITHUB_USERNAME/milo-franchise
 */
(function () {
  'use strict';

  var BASE = 'https://cdn.jsdelivr.net/gh/GITHUB_USERNAME/milo-franchise@main';
  var PAGE = window.MILO_PAGE || 'home'; // set by per-page snippet

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

  function init() {
    injectStyles();

    var navUrl     = BASE + '/includes/nav.html';
    var footerUrl  = BASE + '/includes/footer.html';
    var pageUrl    = BASE + '/pages/' + PAGE + '.html';

    // Try landing-pages if not found in pages
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

      injectHTML('milo-nav-wrapper',     navHTML,    'prepend');
      injectHTML('milo-page-content',    pageHTML,   'append');
      injectHTML('milo-footer-wrapper',  footerHTML, 'append');

      // Re-run any inline scripts from fetched HTML
      document.querySelectorAll('#milo-nav-wrapper script, #milo-page-content script, #milo-footer-wrapper script').forEach(function (s) {
        var script = document.createElement('script');
        script.textContent = s.textContent;
        document.body.appendChild(script);
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
