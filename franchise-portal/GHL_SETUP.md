# MILO Franchisee Portal — GHL Website Setup (v6 loader)

Regular GHL website. No Courses. Memberships for login. GitHub for the design.

Repo folder: `franchise-portal/` in `betterbranding/MILO-Franchise`

## What you are building

| GHL page name | Path | GitHub page |
|---|---|---|
| Login | `/login` | `pages/login.html` |
| Dashboard | `/dashboard` | `pages/dashboard.html` |
| Module 1 Welcome | `/module-1` | `pages/module-1-welcome.html` |
| Module 2 Legal | `/module-2` | `pages/module-2-legal.html` |
| Module 3 Vendors | `/module-3` | `pages/module-3-vendors.html` |
| Module 4 Equipment | `/module-4` | `pages/module-4-equipment.html` |
| Module 5 Production | `/module-5` | `pages/module-5-production.html` |
| Module 6 Sales | `/module-6` | `pages/module-6-sales.html` |
| Module 7 CRM | `/module-7` | `pages/module-7-crm.html` |
| Module 8 Marketing | `/module-8` | `pages/module-8-marketing.html` |
| Module 9 Launch | `/module-9` | `pages/module-9-launch.html` |
| Supply Hub | `/supply-hub` | `pages/supply-hub.html` |
| Admin | `/admin` | `pages/admin.html` |

Recommended domain: `portal.miloinsulation.com` (or a folder on the franchise site). Login stays public. Every other page is Memberships-only.

## Paste format (new header / body)

Do not use the old fetch snippets or iframes.

**A. Header tracking code (meta only)**  
Page Settings > Tracking Code > Header  
Paste from `franchise-portal/ghl-headers-meta-only/{slug}.html`  
No loader. No `<style>`. Only metas.

**B. Body Custom HTML/JS element**  
Add a blank section > Custom HTML/JS  
Paste from `franchise-portal/ghl/element-v6/{slug}.html`  
That file is:

1. `window.MILO_PORTAL` with GHL merge fields (progress + email)
2. The v6 in-place-swap loader that fetches the GitHub page

After the first paste, GitHub edits go live on the next load (jsDelivr cache can lag; bump `?v=` in the loader if you need an instant refresh).

## Memberships (the login)

1. Sites > Memberships > create product **MILO Franchisee Portal**
2. Offer: invite only. Do not put a public buy button on the franchise marketing site.
3. Attach all portal pages except Login
4. Invite franchisee contacts only. Prefer `@miloinsulation.com`. GHL cannot natively lock a domain suffix, so the invite list is the lock.
5. After login, redirect to `/dashboard`

## Custom fields (Franchising location `862EsIISRtzQUOq3B1vZ`)

Created as TEXT fields. Workflows write `true` when a module is completed.

| Field | Merge key |
|---|---|
| Portal M1 Complete | `{{contact.portal_m1_complete}}` |
| Portal M2 Complete | `{{contact.portal_m2_complete}}` |
| ... through M9 | `{{contact.portal_m9_complete}}` |
| Portal Role | `{{contact.portal_role}}` |
| Portal Territory | `{{contact.portal_territory}}` |

Set `portal_role` to `admin` on corporate contacts so `/admin` stays visible.

## Progress webhook (do this once)

1. Settings > Integrations > Inbound Webhook (or a Workflow with Inbound Webhook trigger)
2. Trigger: receives JSON `{ email, firstName, module, event: "module_complete" }`
3. Find/create contact by email
4. If `module` is 1, set Portal M1 Complete = `true` (same for 2–9)
5. Copy the webhook URL
6. Replace `PASTE_GHL_INBOUND_WEBHOOK_URL` in every `ghl/element-v6/*.html` body paste (all pages except Login)

Mark Complete on a module POSTs to that webhook. No PIT token in the frontend.

## Admin visibility

Progress lives on the contact. Create a Smart List **Franchisee Onboarding** showing name, email, territory, and the nine complete fields. That is the admin roster.

`/admin` is a branded reminder page, not a live database.

## Sequential modules

The sidebar greys out later modules until the previous complete field is `true`. Memberships still allow a logged-in user to open the URL if they type it. That is the GHL-website limit. Real vaulting needs Vercel/Supabase.

## Click-by-click in the GHL builder

1. Create a new Website (not a funnel, not a Course)
2. Add the 13 pages with the paths above
3. On each page: wait for the builder, close Ask AI, add Blank Section, add Custom HTML/JS, paste the matching `element-v6` file, Save, then paste the matching header file, Save, Publish
4. Protect every page except Login with the membership product
5. Test in an incognito window: Login should load. `/dashboard` should bounce to login until invited.

## Files

```
franchise-portal/pages/                 full HTML (source of truth)
franchise-portal/loader-v6/             loader only
franchise-portal/ghl-headers-meta-only/ header paste
franchise-portal/ghl/element-v6/        body paste (config + loader)
franchise-portal/config.json            reserved webhook config
```
