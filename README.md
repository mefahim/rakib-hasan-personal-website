# Rakib Hasan — Personal Website

A static, multi-page portfolio built with semantic HTML, CSS, and vanilla JavaScript. No framework, package install, CMS, backend, or external font request is required.

## Preview locally

From the repository root, regenerate the static route pages and start any static HTTP server:

```sh
node scripts/build.js
python3 -m http.server 8080
```

Open `http://localhost:8080`. Directly opening files with `file://` is not recommended because nested routes and relative assets are designed for an HTTP origin.

## Project structure

- `index.html` — home page.
- `about/index.html` and `about-rakib-hasan/index.html` — About page and legacy URL alias.
- `portfolio/index.html` — complete project index with category filters.
- `portfolio/<slug>/index.html` — static detail page for each of the 25 projects.
- `portfolio-categories/<slug>/index.html` — static category archive pages preserving existing URL paths.
- `assets/css/site.css` — responsive Technical Dossier design system.
- `assets/js/site.js` — mobile navigation and portfolio filters.
- `assets/images/` — locally stored, resized WebP assets copied from the current public portfolio pages.
- `data/projects.json` — project titles, years/categories, source-matched copy, external URLs, and image source records.
- `scripts/build.js` — dependency-free Node script that generates the static route pages, sitemap, robots file, and `.nojekyll`.

## Content and evidence notes

Project titles, categories, years, summaries, preview links, and media were collected from the supplied primary domain, `https://rakibhasaan.com/`. No information from similarly named people was imported. Client names, testimonials, outcome metrics, and credentials are intentionally not repeated.

Some original project pages reuse text that appears to describe a different project. In particular, multiple unrelated entries repeat copy mentioning Tatiana Megard, while several others repeat a generic commercial-space description. Those repeated or mismatched overview/role blocks were excluded from generated public pages; the affected entries show a concise note rather than an invented replacement. Review `data/projects.json` entries with `copyStatus: "needs-owner-confirmation"` and update the source copy before adding more detail.

The About copy does not repeat the unconfirmed “since 2020” claim. The CGP Construction page's source preview points to a different branded subdomain, so no external preview button is shown for that entry. At the time of the build, links returning a server error, unresolved domain, or expired TLS certificate were also omitted from the public button while their original URL was retained in the data file for owner review. Verify those URLs and all media-use permissions before public deployment.

## Brand and accessibility

- Signature accent: `#009587`.
- `#006A60` is used for small text on the light canvas because it has stronger contrast.
- System fonts avoid font licensing and external network dependencies.
- Responsive layout, keyboard focus indicators, skip link, mobile navigation, descriptive image alternatives, semantic headings, and `prefers-reduced-motion` behavior are included.

## Deployment boundary

This repository is a code handoff only. It does not configure GitHub Pages, replace the live WordPress site, or change DNS. The generated canonical URLs and sitemap target `https://rakibhasaan.com/` and should be rechecked before any production launch. Keep this repository private until image and project-content permissions have been confirmed.
