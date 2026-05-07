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

  function hideGHLDefaultNav() {
    // GHL injects its own built-in nav wrapper (contains #nav-menu-popup)
    // which creates a gap above our content. Find it and hide it.
    var ghlNavPopup = document.getElementById('nav-menu-popup');
    if (ghlNavPopup) {
      var wrapper = ghlNavPopup;
      // Walk up to the direct child of #__nuxt
      while (wrapper.parentElement && wrapper.parentElement.id !== '__nuxt') {
        wrapper = wrapper.parentElement;
      }
      if (wrapper && wrapper.parentElement && wrapper.parentElement.id === '__nuxt') {
        wrapper.style.cssText = 'display:none!important;height:0!important;overflow:hidden!important;';
      }
    }
    // Also target via class in case structure changes
    var bgCoverSibling = document.querySelector('#__nuxt > div:not([id]):not(.bgCover)');
    if (bgCoverSibling && bgCoverSibling.querySelector('#nav-menu-popup, .nav-menu')) {
      bgCoverSibling.style.cssText = 'display:none!important;height:0!important;overflow:hidden!important;';
    }
  }

  function addBodyPadding() {
    // Measure actual nav height after injection and pad body accordingly
    var nav = document.getElementById('milo-nav');
    var navHeight = nav ? nav.offsetHeight : 75;
    document.body.style.paddingTop = navHeight + 'px';
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

      // Hide GHL's built-in nav that creates a gap above our content
      hideGHLDefaultNav();

      // Add body padding to clear the fixed nav (measured after injection)
      // Use requestAnimationFrame to ensure nav has rendered and has a height
      requestAnimationFrame(function () {
        addBodyPadding();
      });

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
