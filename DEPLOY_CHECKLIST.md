# Ants Website Go-Live Checklist

## Pre-Deploy

- [ ] Confirm the latest commit on `main` is deployed.
- [ ] Confirm hosting is set to static site mode.
- [ ] Confirm build command is empty.
- [ ] Confirm output directory is `.`.
- [ ] Confirm no environment variables are required.

## Domain Cutover

- [ ] Attach `antnest.ai`.
- [ ] Attach or redirect `www.antnest.ai`.
- [ ] Confirm SSL is active.
- [ ] Confirm Cloudflare cache is purged after the domain switch.

## Post-Deploy Smoke Test

- [ ] `https://antnest.ai/` opens the new Ants website.
- [ ] Login opens `https://antnest.ai/login.html` and does not loop back to the homepage.
- [ ] `https://antnest.ai/pricing.html` opens and shows THB pricing.
- [ ] `https://antnest.ai/about.html` opens and shows the updated About headline.
- [ ] `https://antnest.ai/resources.html` opens and shows `ANT Contact Center 24 Hrs.`
- [ ] `https://antnest.ai/integrations.html` opens and shows the updated integration headline.
- [ ] `https://antnest.ai/features.html` opens and shows the restored feature visual.
- [ ] EN/TH switch works.
- [ ] Intro skip button works.
- [ ] Mobile viewport works.

## Rollback

If anything fails, switch the custom domain back to the previous hosting deployment or previous Cloudflare Pages deployment.
