# MILO Franchise — Website Code Repository

Custom HTML/CSS/JS code for [franchise.miloinsulation.com](https://franchise.miloinsulation.com), served via GitHub and embedded into GoHighLevel pages.

---

## Repository Structure

```
milo-franchise/
├── css/
│   └── styles.css          ← Global stylesheet (Montserrat, all components)
├── js/
│   └── loader.js           ← GHL embed loader (fetches nav, page, footer)
├── includes/
│   ├── nav.html            ← Global navigation (update once, applies everywhere)
│   └── footer.html         ← Global footer (update once, applies everywhere)
├── pages/
│   ├── home.html           ← Home page content
│   ├── about.html          ← About page content
│   ├── opportunity.html    ← Opportunity page content
│   ├── support.html        ← Support page content
│   ├── faq.html            ← FAQ page content
│   └── contact.html        ← Contact page content
├── landing-pages/
│   ├── midland-odessa.html ← Midland-Odessa territory landing page
│   ├── tulsa.html          ← Tulsa territory landing page
│   └── fayetteville.html   ← Fayetteville (NW Arkansas) territory landing page
└── embed/
    └── snippets.html       ← GHL embed code snippets for each page
```

---

## How It Works

1. **Content lives in this repo** — Edit any `.html` file, push to `main`
2. **jsDelivr CDN serves the files** — Available at `https://cdn.jsdelivr.net/gh/YOUR_USERNAME/milo-franchise@main/`
3. **loader.js is injected once per GHL page** — It fetches nav, page content, and footer automatically
4. **No iframe** — Content renders natively in the GHL page DOM

CDN cache refreshes within ~10 minutes of a push to `main`.

---

## Making Updates

### Update Navigation or Footer (affects ALL pages instantly)
```bash
# Edit includes/nav.html or includes/footer.html
git add includes/nav.html
git commit -m "Update nav — added new market link"
git push
```

### Update a Specific Page
```bash
# Edit pages/home.html
git add pages/home.html
git commit -m "Update home hero headline"
git push
```

### Add a New Landing Page
1. Create `landing-pages/your-city.html`
2. Create GHL page at `franchise.miloinsulation.com/your-city`
3. Paste the embed snippet (from `embed/snippets.html`) into GHL page header, changing `MILO_PAGE` to `'your-city'`

---

## GHL Embed Snippets

See `embed/snippets.html` for ready-to-paste code for each page.

---

## CDN URLs (after repo is public)

| File | CDN URL |
|------|---------|
| Styles | `https://cdn.jsdelivr.net/gh/YOUR_USERNAME/milo-franchise@main/css/styles.css` |
| Loader | `https://cdn.jsdelivr.net/gh/YOUR_USERNAME/milo-franchise@main/js/loader.js` |
| Nav | `https://cdn.jsdelivr.net/gh/YOUR_USERNAME/milo-franchise@main/includes/nav.html` |
| Footer | `https://cdn.jsdelivr.net/gh/YOUR_USERNAME/milo-franchise@main/includes/footer.html` |

---

© 2026 MILO Franchising, LLC
