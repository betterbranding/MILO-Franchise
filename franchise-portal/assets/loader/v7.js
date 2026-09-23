/* MILO Franchisee Portal GHL loader engine v7 (in-place swap, third-party safe).
   Loaded by the small bootstrap inside each page's body Custom Code element.
   Source: /tasklet/drive/ghl-fast-loader/templates/loader-v7-engine.js */
(function () {
  var boot = window.__drBoot;
  if (!boot || boot.done) return;
  boot.done = true;
  var GTM_RE = /googletagmanager\.com/;
  var GHL_STYLE_RE = /hl_main_popup|hl_page|\bhl-[a-z]|--color-[0-9a-f]{24}|\.c-(?:row|column|section|wrapper)\b|drop-zone-draggable|custom-code-[A-Za-z0-9]{6,}|#section-[A-Za-z0-9]{6,}|progressbarOffset|empty-component-min-height|animate__|testimonial-modal|leadconnectorhq|\.bg-fixed\b|#hl_|hvr-/;
  var GHL_HOST_RE = /leadconnectorhq\.com|msgsndr\.com|filesafe\.space|gohighlevel\.com|funnel-preview|stcdn\./;

  function isGtm(el) {
    return GTM_RE.test((el.getAttribute('src') || '') + (el.textContent || ''));
  }
  function fresh(old) {
    var s = document.createElement('script');
    for (var i = 0; i < old.attributes.length; i++) s.setAttribute(old.attributes[i].name, old.attributes[i].value);
    s.textContent = old.textContent;
    s.setAttribute('data-dr', '');
    return s;
  }
  function dropSplash() {
    var sp = boot.splash;
    if (sp && sp.parentNode) sp.parentNode.removeChild(sp);
  }
  function isGhlBodyNode(n) {
    if (n.nodeType !== 1) return true;
    var id = n.id || '';
    if (id === '__nuxt' || id === 'teleports' || id === '__NUXT_DATA__') return true;
    if (n.tagName === 'SCRIPT' && !n.getAttribute('src') && /__NUXT__|__NUXT_DATA__|__unctx__|nuxt/i.test(n.textContent || '')) return true;
    if (n.tagName === 'SCRIPT' && GHL_HOST_RE.test(n.getAttribute('src') || '')) return true;
    if (n.tagName === 'STYLE' && GHL_STYLE_RE.test(n.textContent || '')) return true;
    return false;
  }

  function swap(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var head = document.head, i, el;
    var nativeGtm = !!document.querySelector('script[src*="googletagmanager.com/gtm.js"]') ||
      (window.dataLayer || []).some(function (e) { return e && e['gtm.start']; });
    var skipGtm = function (node) { return nativeGtm && isGtm(node); };

    var gtmInline = (boot.gtmInline || []).filter(function (s) { return s && s.parentNode; });
    var gtmNoscript = [];
    var allNs = document.body.querySelectorAll('noscript');
    for (i = 0; i < allNs.length; i++) if (GTM_RE.test(allNs[i].textContent || allNs[i].innerHTML || '')) gtmNoscript.push(allNs[i]);

    var ssr = boot.ssrHead || [];
    for (i = ssr.length - 1; i >= 0; i--) {
      el = ssr[i];
      if (!el || el.parentNode !== head) continue;
      var t = el.tagName;
      if (t === 'SCRIPT' && el.type !== 'application/ld+json') continue;
      if (t === 'NOSCRIPT' || el === boot.splash) continue;
      if (t === 'META' && el.hasAttribute('charset')) continue;
      head.removeChild(el);
    }
    var nh = doc.head;
    while (nh.firstChild) {
      el = nh.firstChild;
      if (el.nodeType !== 1) { nh.removeChild(el); continue; }
      if (el.tagName === 'META' && el.hasAttribute('charset')) { nh.removeChild(el); continue; }
      if (el.tagName === 'SCRIPT') {
        var g = skipGtm(el); nh.removeChild(el);
        if (!g) head.appendChild(fresh(el));
        continue;
      }
      el.setAttribute('data-dr', '');
      head.appendChild(document.adoptNode(el));
    }
    var charset = head.querySelector('meta[charset]');
    var anchor = charset ? charset.nextSibling : head.firstChild;
    for (i = 0; i < gtmInline.length; i++) {
      var sc = gtmInline[i];
      var before = sc.previousSibling, after = sc.nextSibling;
      head.insertBefore(sc, anchor);
      if (before && before.nodeType === 8 && /Google Tag Manager/i.test(before.data)) head.insertBefore(before, sc);
      if (after && after.nodeType === 8 && /End Google Tag Manager/i.test(after.data)) head.insertBefore(after, sc.nextSibling);
    }

    var de = document.documentElement, sh = doc.documentElement;
    for (i = de.attributes.length - 1; i >= 0; i--) de.removeAttribute(de.attributes[i].name);
    for (i = 0; i < sh.attributes.length; i++) de.setAttribute(sh.attributes[i].name, sh.attributes[i].value);
    var b = document.body, nb = doc.body;
    for (i = b.attributes.length - 1; i >= 0; i--) b.removeAttribute(b.attributes[i].name);
    for (i = 0; i < nb.attributes.length; i++) b.setAttribute(nb.attributes[i].name, nb.attributes[i].value);

    var kids = Array.prototype.slice.call(b.childNodes);
    for (i = 0; i < kids.length; i++) if (isGhlBodyNode(kids[i])) b.removeChild(kids[i]);
    var firstForeign = b.firstChild;
    var frag = document.createDocumentFragment();
    while (nb.firstChild) frag.appendChild(document.adoptNode(nb.firstChild));
    b.insertBefore(frag, firstForeign);
    var ns = b.querySelectorAll('noscript');
    for (i = 0; i < ns.length; i++) {
      if (nativeGtm && GTM_RE.test(ns[i].textContent || ns[i].innerHTML || '') && gtmNoscript.indexOf(ns[i]) < 0) ns[i].parentNode.removeChild(ns[i]);
    }
    for (i = gtmNoscript.length - 1; i >= 0; i--) b.insertBefore(gtmNoscript[i], b.firstChild);
    var scripts = b.querySelectorAll('script');
    for (i = 0; i < scripts.length; i++) {
      el = scripts[i];
      if (el.hasAttribute('data-dr') || gtmInline.indexOf(el) >= 0) continue;
      if (el.getAttribute('src') && GTM_RE.test(el.getAttribute('src'))) continue;
      if (skipGtm(el)) { el.parentNode.removeChild(el); continue; }
      if (el.type === 'application/ld+json') continue;
      el.parentNode.replaceChild(fresh(el), el);
    }

    try {
      var mo = new MutationObserver(function (muts) {
        muts.forEach(function (m) {
          m.addedNodes.forEach(function (n) {
            if (n.nodeType !== 1 || n.hasAttribute('data-dr')) return;
            var tn = n.tagName, kill = false;
            if (tn === 'TITLE') kill = true;
            else if (tn === 'LINK' && /stylesheet|preload/i.test(n.rel || '') && GHL_HOST_RE.test(n.href || '')) kill = true;
            else if (tn === 'STYLE' && GHL_STYLE_RE.test(n.textContent || '')) kill = true;
            if (kill && n.parentNode) n.parentNode.removeChild(n);
          });
        });
      });
      mo.observe(head, { childList: true });
      setTimeout(function () { mo.disconnect(); }, 15000);
    } catch (e) {}

    dropSplash();
    if (location.hash) {
      try { var tg = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (tg) tg.scrollIntoView(); } catch (e) {}
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'milo_portal_ready', page_title: document.title, page_path: location.pathname });
    boot.swapped = true;
  }

  function ready() {
    return new Promise(function (res) {
      if (document.readyState !== 'loading') return res();
      document.addEventListener('DOMContentLoaded', function () { res(); }, { once: true });
    });
  }

  Promise.all([boot.html, ready()])
    .then(function (a) { swap(a[0]); })
    .catch(function () { dropSplash(); });
})();
