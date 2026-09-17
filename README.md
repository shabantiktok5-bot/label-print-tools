# Label Print Tools

A production-ready Astro + TypeScript website for label-roll, label-production and thermal-printing calculators.

## What is included

- Static-first Astro site with client-side TypeScript calculators
- Labels Remaining on Roll Calculator
- Labels Per Roll Calculator
- Label Roll Diameter Calculator
- Label Roll Length Calculator
- Label Linear Run Calculator
- Label Web Width Calculator
- Thermal Ribbon Calculator
- ZPL Label Size / Printer Dots Calculator
- Labels Per Sheet Calculator
- Mixed unit support (mm, cm, m, inches, feet, micrometres and mil where relevant)
- Local browser memory for recent calculator inputs
- SEO category hubs and tightly related guides
- Unique title tags and meta descriptions
- Self-referencing canonical URLs through Astro's configured `site`
- Open Graph and Twitter card metadata
- WebApplication and BreadcrumbList JSON-LD on calculator pages
- Organization and WebSite JSON-LD on the homepage
- XML sitemap generated at build time
- Dynamic robots.txt pointing to the sitemap
- Semantic headings, crawlable internal links and mobile-first responsive UI
- Methodology, About, Contact, Privacy, Terms and 404 pages
- Formula unit tests and GitHub Actions CI
- Vercel-ready static deployment

## 1. Install and run locally

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

Astro will print the local URL, normally `http://localhost:4321`.

Run tests:

```bash
npm test
```

Run the production validation/build:

```bash
SITE_URL=https://www.yourdomain.com npm run build
```

On Windows PowerShell:

```powershell
$env:SITE_URL="https://www.yourdomain.com"
npm run build
```

## 2. Brand and canonical domain

The project is configured for **Label Print Tools** and the planned public domain **https://www.labelprinttools.com**.

Brand/contact settings live in `src/config/site.ts`. The production canonical origin can be overridden with the `SITE_URL` environment variable. Before the custom domain is connected, the Vercel preview can still be used for testing; do not submit the preview URL to search engines.

## 3. Put the project on GitHub

Create a new empty GitHub repository, then from this project folder run:

```bash
git init
git add .
git commit -m "Initial Label Print Tools launch"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

You can also upload the extracted project folder through GitHub's web interface, but normal Git is easier for future updates.

## 4. Deploy to Vercel

1. Sign in to Vercel and choose **Add New → Project**.
2. Import the GitHub repository.
3. Vercel should detect **Astro** automatically.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add an environment variable named `SITE_URL` with the final canonical origin, use `https://www.labelprinttools.com` once the custom domain is connected.
7. Deploy.

The site uses static output, so no database, paid API or server runtime is required for the calculators.

## 5. Connect a custom domain

In Vercel open the project and go to **Settings → Domains**. Add both your root domain and the `www` version if you plan to use both. Vercel will show the DNS records required for your exact configuration. Add those records at your domain registrar.

Choose one public version as the primary domain (for example `https://www.labelprinttools.com`) and set `SITE_URL` to that exact origin. Redeploy after changing `SITE_URL` so canonicals, sitemap URLs, robots.txt and structured-data URLs use the final domain.

Do not hard-code an old Vercel DNS IP from a tutorial; use the DNS values Vercel displays for your project at deployment time.

## 6. Search-engine launch checklist

After the custom domain is live:

- Open `/robots.txt` and confirm it points to the correct domain's `/sitemap-index.xml`.
- Open `/sitemap-index.xml` and confirm canonical production URLs are present.
- Verify the domain in Google Search Console.
- Submit the sitemap.
- Inspect the homepage and the main calculator pages.
- Add the site in Bing Webmaster Tools and submit the sitemap.
- Validate calculator structured data and breadcrumbs with Google's Rich Results Test / Schema.org validator as appropriate.
- Test Core Web Vitals with PageSpeed Insights after the site is on the final domain.

## 7. Important launch edits

Before public launch, replace:

- Confirm the contact email in `src/config/site.ts` can receive mail
- Privacy/Terms wording with the final operator/contact details and any analytics or advertising disclosures you actually use

If you add Google Analytics, AdSense, affiliate tracking, cookie tools or other third-party scripts later, update the privacy policy and consent behavior to match the jurisdictions and services involved.

## Architecture

```text
src/
  components/       reusable UI and diagrams
  config/           centralized brand/site config
  layouts/          SEO-aware base HTML layout
  lib/              formulas, units, UI helpers, schema builders
  pages/
    label-roll/
    production/
    thermal-printing/
    sheet-labels/
    guides/
  styles/
public/              favicon and social image
tests/               formula unit tests
```

## Accuracy note

The roll calculations are geometric estimates. Actual production can differ because of material-caliper tolerance, adhesive/liner variation, winding compression, air, splices, setup waste, printer behavior, die requirements and measurement error. The site intentionally surfaces these limitations on relevant pages.
