# Ants Website Deployment Handoff

This repository is a static HTML/CSS/JS website for `antnest.ai`.

## Repository

- GitHub: https://github.com/Miti2549/antnest-web
- Branch: `main`
- Site type: Static HTML website
- Entry file: `index.html`
- Build command: none
- Output directory: `.`
- Backend required: no
- Environment variables required: no
- Database required: no
- API keys required: no

## Recommended Hosting

Cloudflare Pages is recommended because `antnest.ai` already sits behind Cloudflare.

Cloudflare Pages settings:

```text
Framework preset: None
Build command: empty
Build output directory: .
Root directory: /
Production branch: main
```

## Custom Domains

Attach these domains to the same Pages project:

```text
antnest.ai
www.antnest.ai
```

Preferred behavior:

- `https://antnest.ai` serves the site.
- `https://www.antnest.ai` redirects to `https://antnest.ai`.

The repository includes `_redirects` for the `www` redirect when supported by the host.

## Route Checklist

The website uses direct static HTML routes. Confirm these URLs work after deploy:

```text
/
/index.html
/solutions.html
/features.html
/integrations.html
/resources.html
/pricing.html
/about.html
/login.html
/feature-ai-document-reading.html
/feature-hs-code-tax-check.html
/feature-job-order-automation.html
/feature-customs-oga-workflow.html
/feature-cost-vendor-management.html
/feature-billing-collection.html
/feature-analytics-reporting.html
```

## Important Assets

Do not move or rename these without updating HTML/CSS/JS references:

```text
assets/ant-logo-master.png
intro.css
intro.js
assets/intro-desktop.mp4
assets/intro-desktop.webm
assets/intro-mobile.mp4
assets/intro-mobile.webm
assets/intro-poster-desktop.jpg
assets/intro-poster-mobile.jpg
assets/qr-web-card-official.png
assets/qr-ios-card-official.png
assets/qr-android-card-official.png
assets/qr-ant-care-card-official.png
```

## Validation Before Switching Domain

1. Open the temporary Pages URL.
2. Confirm the intro appears and Skip intro works.
3. Confirm the Login button opens `/login.html` and does not loop back to the homepage.
4. Confirm TH/EN switch works on Home, Pricing, Solutions, and About.
5. Confirm Pricing shows:
   - `฿999 /เดือน`
   - `฿2,990 /เดือน`
   - `฿5,990 /เดือน`
6. Confirm mobile layout loads and intro does not block the page.
7. Confirm all route checklist URLs return `200`.

## Notes

- This deployment does not call paid APIs.
- This deployment does not publish, broadcast, or mutate ads.
- This deployment is frontend-only and can be rolled back by switching the hosting project back to the previous deployment.
- App Login is not live yet. `/login.html` is a temporary bridge page. When the real app URL is ready, update `APP_LOGIN_URL` inside `login.html`.
