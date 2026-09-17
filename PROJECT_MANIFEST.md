# LabelMetric Launch Manifest

## Launch calculators

1. Labels Remaining on Roll Calculator
2. Labels Per Roll Calculator
3. Label Roll Diameter Calculator
4. Label Roll Length Calculator
5. Label Linear Run Calculator
6. Label Web Width Calculator
7. Thermal Ribbon Calculator
8. ZPL Label Size Calculator
9. Labels Per Sheet Calculator

## Topical architecture

- Label roll geometry
- Label production / converting
- Thermal printing and ZPL
- Sheet label layout
- Supporting measurement guides

## SEO foundations included

- Static semantic HTML from Astro
- Unique page titles and descriptions
- Self-referencing canonical URLs based on `SITE_URL`
- Crawlable category and related-tool internal links
- Breadcrumb navigation + BreadcrumbList JSON-LD
- WebApplication JSON-LD for calculators
- Organization + WebSite JSON-LD on homepage
- Open Graph and Twitter metadata
- 1200×630 PNG social preview
- XML sitemap generation
- robots.txt with sitemap reference
- No legacy meta-keywords tag
- noindex 404 page
- Descriptive URLs and heading hierarchy
- Methodology/About/Contact/Privacy/Terms pages
- Focused supporting guides rather than unrelated blog content
- Automated post-build SEO audit in CI

## Technical foundations included

- Astro + TypeScript
- Static output
- No database
- No paid API
- Client-side calculation engine
- Mixed-unit conversion
- localStorage for last-used inputs
- Responsive/mobile-first CSS
- Inline SVG measurement diagrams
- Formula unit tests
- GitHub Actions workflow
- Vercel configuration and deployment instructions

## Before public launch

- Choose and verify the final brand/domain.
- Replace placeholder email in `src/config/site.ts`.
- Set Vercel `SITE_URL` to the exact primary production origin.
- Review final Privacy/Terms wording for the site owner and any analytics/ads actually added.
- After deployment, submit the sitemap to Google Search Console and Bing Webmaster Tools.
