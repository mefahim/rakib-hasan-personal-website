const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/projects.json'), 'utf8'));
const projects = data.projects;
const categories = [
  ['business-coach', 'Business Coach'],
  ['cleaning-service', 'Cleaning Service'],
  ['construction-company', 'Construction Company'],
  ['custom-glass-works', 'Custom Glass Works'],
  ['electrician', 'Electrician'],
  ['fashion-designer-portfolio', 'Fashion Designer Portfolio'],
  ['graphic-designer-portfolio', 'Graphic Designer Portfolio'],
  ['lawer', 'Law'],
  ['logistics-transport', 'Logistics & Transport'],
  ['restaurant', 'Restaurant'],
  ['single-villa-rental', 'Single Villa Rental'],
  ['sterilization-service', 'Sterilization Service'],
  ['tiles-business', 'Tile Business'],
  ['vacation-rental', 'Vacation Rental'],
  ['vehicles-wrapping-company', 'Vehicle Wraps'],
  ['villa-rental', 'Villa Rental'],
  ['yoga-and-spa', 'Yoga & Spa'],
];
const primaryOrigin = 'https://rakibhasaan.com';
const today = new Date().toISOString().slice(0, 10);
const generatedRoutes = [];

function esc(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}
function slugify(value = '') {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/['’]/g, '').replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function categoryLabel(project) { return project.displayCategory || categories.find(([slug]) => slug === slugify(project.category))?.[1] || project.category; }
function excerpt(value = '', limit = 440) {
  const text = String(value).replace(/\s+/g, ' ').trim();
  if (text.length <= limit) return text;
  const clipped = text.slice(0, limit);
  return `${clipped.slice(0, clipped.lastIndexOf(' ')).replace(/[,. ;:]+$/, '')}…`;
}
function rel(level, target) {
  return `${'../'.repeat(level)}${target}`;
}
function makeDir(file) { fs.mkdirSync(path.dirname(file), { recursive: true }); }
function writeRoute(route, html) {
  const file = path.join(ROOT, route.replace(/^\//, ''), 'index.html');
  makeDir(file);
  fs.writeFileSync(file, html, 'utf8');
  generatedRoutes.push(route);
}
function nav(level, active) {
  const root = rel(level, '');
  return `<a class="skip-link" href="#main-content">Skip to content</a>
<header class="site-header">
  <a class="brand" href="${root}" aria-label="Rakib Hasan home">
    <span class="brand__mark" aria-hidden="true">RH</span>
    <span class="brand__text"><strong>Rakib Hasan</strong><small>Design · Development</small></span>
  </a>
  <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-navigation" aria-label="Open navigation"><span></span><span></span></button>
  <nav class="site-nav" id="site-navigation" aria-label="Main navigation">
    <a${active === 'home' ? ' aria-current="page"' : ''} href="${root}">Home</a>
    <a${active === 'work' ? ' aria-current="page"' : ''} href="${rel(level, 'portfolio/')}">Work <span class="nav-count">25</span></a>
    <a${active === 'about' ? ' aria-current="page"' : ''} href="${rel(level, 'about/')}">About</a>
    <a class="nav-contact" href="https://www.fiverr.com/rakib_64" target="_blank" rel="noopener noreferrer">Let’s talk <span aria-hidden="true">↗</span></a>
  </nav>
</header>`;
}
function footer(level) {
  return `<footer class="site-footer">
  <div class="footer__top"><p class="eyebrow">Have a project in mind?</p><a class="footer__cta" href="https://www.fiverr.com/rakib_64" target="_blank" rel="noopener noreferrer">Start a conversation <span aria-hidden="true">↗</span></a></div>
  <div class="footer__bottom"><a class="footer__brand" href="${rel(level, '')}">Rakib Hasan <span>· Designer &amp; Developer</span></a><p>© ${new Date().getFullYear()} Rakib Hasan</p><a href="${rel(level, 'portfolio/')}">Project index <span aria-hidden="true">↑</span></a></div>
</footer>`;
}
function shell({ title, description, route, level = 0, active = '', content, image = '', noindex = false }) {
  const canonicalRoute = route === '/about-rakib-hasan/' ? '/about/' : route;
  const imageUrl = image ? `${primaryOrigin}${image}` : `${primaryOrigin}/wp-content/uploads/2024/09/Rakib-hasan-logo-e1726952149161.webp`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f4f6f4">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${primaryOrigin}${canonicalRoute}">
  ${noindex ? '<meta name="robots" content="noindex,follow">' : ''}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Rakib Hasan">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${primaryOrigin}${canonicalRoute}">
  <meta property="og:image" content="${esc(imageUrl)}">
  <link rel="icon" href="${rel(level, 'assets/mark.svg')}" type="image/svg+xml">
  <link rel="stylesheet" href="${rel(level, 'assets/css/site.css')}">
  <script src="${rel(level, 'assets/js/site.js')}" defer></script>
</head>
<body>
  ${nav(level, active)}
  <main id="main-content">${content}</main>
  ${footer(level)}
</body>
</html>`;
}
function projectCard(project, index, level = 0) {
  const href = rel(level, `portfolio/${project.slug}/`);
  const category = slugify(project.category);
  const meta = [categoryLabel(project), project.year].filter(Boolean).join(' · ');
  const blurb = project.summary ? excerpt(project.summary, 190) : 'A selected project from the portfolio. Project-specific notes are being verified before more detail is published.';
  return `<article class="project-row" data-category="${esc(category)}">
  <span class="project-row__number" aria-label="Project ${String(index + 1).padStart(2, '0')}">${String(index + 1).padStart(2, '0')}</span>
  <a class="project-row__image" href="${href}" aria-label="Open ${esc(project.title)} project details">
    ${project.image ? `<img src="${rel(level, project.image.replace(/^\//, ''))}" alt="${esc(project.title)} website project preview" width="${project.imageMeta?.width || 1600}" height="${project.imageMeta?.height || 1200}" loading="lazy" decoding="async">` : '<span class="image-placeholder" aria-hidden="true">RH</span>'}
  </a>
  <div class="project-row__body">
    <p class="project-meta">${esc(meta)}</p>
    <h3><a href="${href}">${esc(project.title)}</a></h3>
    <p class="project-row__summary">${esc(blurb)}</p>
    <div class="project-row__actions">
      <a class="text-link" href="${href}">Read project notes <span aria-hidden="true">↗</span></a>
      ${project.preview ? `<a class="subtle-link" href="${esc(project.preview)}" target="_blank" rel="noopener noreferrer">Live site <span aria-hidden="true">↗</span></a>` : ''}
    </div>
  </div>
</article>`;
}
function projectList(items, level = 0, startIndex = 0) {
  return `<div class="project-list">${items.map((project, i) => projectCard(project, startIndex + i, level)).join('\n')}</div>`;
}

// Home page
const featuredSlugs = ['rtj-rentals', 'villa-lapierrot', 'cgp-construction-corp', 'la-cote-de-beaune'];
const featured = featuredSlugs.map((slug) => projects.find((project) => project.slug === slug)).filter(Boolean);
const home = `<section class="hero section-wrap">
  <div class="hero__copy">
    <p class="eyebrow"><span class="eyebrow__dot"></span> Independent designer &amp; developer</p>
    <h1>Design-led websites, built from first layout to final page.</h1>
    <p class="hero__intro">I’m Rakib Hasan. I work across design and development to shape clear, useful websites for businesses and the people they serve.</p>
    <div class="hero__actions"><a class="button button--dark" href="portfolio/">Explore selected work <span aria-hidden="true">↓</span></a><a class="text-link" href="https://www.fiverr.com/rakib_64" target="_blank" rel="noopener noreferrer">Discuss a project <span aria-hidden="true">↗</span></a></div>
    <div class="hero__index"><span>01 / PROFILE</span><span>Design · Build · Refine</span></div>
  </div>
  <figure class="hero__portrait">
    <img src="assets/images/rakib-portrait.webp" alt="Rakib Hasan working at a laptop" width="1100" height="561" fetchpriority="high">
    <figcaption><span>Rakib Hasan</span><span>Designer &amp; Developer</span></figcaption>
  </figure>
</section>
<section class="section-wrap section-work" aria-labelledby="work-heading">
  <div class="section-heading"><div><p class="eyebrow">02 / Selected work</p><h2 id="work-heading">A closer look at the work.</h2></div><a class="text-link" href="portfolio/">Open all 25 projects <span aria-hidden="true">↗</span></a></div>
  ${projectList(featured, 0)}
</section>
<section class="band-section">
  <div class="section-wrap band-section__inner"><div><p class="eyebrow">03 / Approach</p><h2>Design decisions and development belong in the same conversation.</h2></div><p>I work from page structure and visual direction through to the finished website. The aim is a clear experience that makes sense for the business and the person using it.</p><a class="text-link" href="about/">More about my approach <span aria-hidden="true">↗</span></a></div>
</section>
<section class="section-wrap end-note"><p class="eyebrow">04 / Next step</p><h2>Have a website project to discuss?</h2><a class="button button--accent" href="https://www.fiverr.com/rakib_64" target="_blank" rel="noopener noreferrer">Start a conversation <span aria-hidden="true">↗</span></a></section>`;
writeRoute('/', shell({title:'Rakib Hasan — Designer & Developer',description:'Selected website design and development work by Rakib Hasan.',route:'/',active:'home',content:home,image:'/assets/images/rakib-portrait.webp'}));

// About page and legacy About URL alias
const about = `<section class="page-intro section-wrap">
  <p class="eyebrow">About / Rakib Hasan</p><h1>Design, development, and the details between.</h1>
  <p class="lede">I work across the visual and technical sides of a website, from the first layout decisions to the pages and interactions people use.</p>
  <div class="about-photo"><img src="../assets/images/rakib-portrait.webp" alt="Rakib Hasan at work" width="1100" height="561" loading="eager"><span class="image-caption">A little about the person behind the projects.</span></div>
</section>
<section class="section-wrap about-grid"><div class="about-grid__label"><p class="eyebrow">01 / What I do</p></div><div class="about-grid__content"><p class="about-lead">My current portfolio brings together website design and development for a range of businesses and independent professionals.</p><div class="service-list">
  <article><span>01</span><div><h2>Design</h2><p>Page structure, visual direction, and interface details shaped around the people who will use the site.</p></div></article>
  <article><span>02</span><div><h2>Development</h2><p>Responsive pages and interactions built to carry the design through to a working website.</p></div></article>
  <article><span>03</span><div><h2>End-to-end websites</h2><p>Design and development considered together, from a first page outline to a complete site.</p></div></article>
</div></div></section>
<section class="section-wrap about-grid about-grid--border"><div class="about-grid__label"><p class="eyebrow">02 / Selected experience</p></div><div class="about-grid__content"><h2>Work across different businesses and needs.</h2><p>The portfolio includes work in hospitality, property, construction, logistics, professional services, retail, and more. Each project page links to the public project website where available.</p><a class="text-link" href="../portfolio/">Browse the project index <span aria-hidden="true">↗</span></a></div></section>
<section class="section-wrap about-contact"><p class="eyebrow">03 / Contact</p><h2>Tell me what you’re looking to build.</h2><a class="button button--dark" href="https://www.fiverr.com/rakib_64" target="_blank" rel="noopener noreferrer">Message me on Fiverr <span aria-hidden="true">↗</span></a></section>`;
writeRoute('/about/', shell({title:'About Rakib Hasan — Designer & Developer',description:'Learn about Rakib Hasan’s approach to website design and development.',route:'/about/',level:1,active:'about',content:about,image:'/assets/images/rakib-portrait.webp'}));
writeRoute('/about-rakib-hasan/', shell({title:'About Rakib Hasan — Designer & Developer',description:'Learn about Rakib Hasan’s approach to website design and development.',route:'/about-rakib-hasan/',level:1,active:'about',content:about.replaceAll('../portfolio/','../portfolio/'),image:'/assets/images/rakib-portrait.webp',noindex:true}));

// Portfolio listing with accessible category filters
const categoryButtons = [...new Set(projects.map((p) => slugify(p.category)))].map((slug) => {
  const item = projects.find((p) => slugify(p.category) === slug);
  const label = item ? categoryLabel(item) : slug;
  return `<button class="filter-chip" type="button" data-filter="${esc(slug)}" aria-pressed="false">${esc(label)}</button>`;
}).join('\n');
const portfolio = `<section class="page-intro section-wrap page-intro--compact"><p class="eyebrow">Work / Project index</p><h1>Projects, with their context.</h1><p class="lede">A collection of website projects from the current portfolio. Browse the full index or narrow it by type of work.</p><p class="project-total"><strong>25</strong><span>project entries</span></p></section>
<section class="section-wrap portfolio-index" aria-labelledby="project-index-heading"><div class="portfolio-toolbar"><div><p class="eyebrow">Filter by category</p><div class="filter-list" role="group" aria-label="Filter projects by category"><button class="filter-chip is-active" type="button" data-filter="all" aria-pressed="true">All projects</button>${categoryButtons}</div></div><p class="filter-status" aria-live="polite">Showing 25 projects</p></div><h2 id="project-index-heading" class="sr-only">All portfolio projects</h2>${projectList(projects,1)}<p class="empty-state" hidden>No projects are listed in this category yet.</p></section>`;
writeRoute('/portfolio/', shell({title:'Portfolio — Rakib Hasan',description:'Browse 25 website design and development projects by Rakib Hasan.',route:'/portfolio/',level:1,active:'work',content:portfolio}));

// Project detail pages, with only source-matched copy blocks carried forward.
projects.forEach((project, i) => {
  const route=`/portfolio/${project.slug}/`;
  const image=project.image ? `<figure class="project-hero-image"><img src="${rel(2,project.image.replace(/^\//,''))}" alt="${esc(project.title)} project website preview" width="${project.imageMeta?.width || 1600}" height="${project.imageMeta?.height || 1200}" fetchpriority="high"><figcaption>Project preview from the existing portfolio</figcaption></figure>` : '';
  const overview=project.summary ? `<section class="case-copy"><p class="eyebrow">Project overview</p><p class="case-copy__lead">${esc(excerpt(project.summary))}</p></section>` : `<section class="case-copy case-copy--quiet"><p class="eyebrow">Project notes</p><p class="case-copy__lead">Project-specific notes are being checked before additional details are published.</p></section>`;
  const role=project.role ? `<section class="case-copy case-copy--border"><p class="eyebrow">Role on the project</p><p>${esc(excerpt(project.role, 520))}</p></section>` : '';
  const live=project.preview ? `<a class="button button--dark" href="${esc(project.preview)}" target="_blank" rel="noopener noreferrer">Visit the live project <span aria-hidden="true">↗</span></a>` : '';
  const previous=projects[(i-1+projects.length)%projects.length];
  const next=projects[(i+1)%projects.length];
  const content=`<section class="case-header section-wrap"><a class="back-link" href="${rel(2,'portfolio/')}">← Back to all projects</a><div class="case-title"><p class="eyebrow">Project ${String(i+1).padStart(2,'0')} / ${esc(categoryLabel(project))}</p><h1>${esc(project.title)}</h1><p class="case-deck">Website design &amp; development</p></div><dl class="case-facts"><div><dt>Year</dt><dd>${esc(project.year || 'Needs confirmation')}</dd></div><div><dt>Category</dt><dd>${esc(categoryLabel(project) || 'Needs confirmation')}</dd></div></dl>${live}</section>
  <section class="section-wrap case-body">${image}<div class="case-story">${overview}${role}</div></section>
  <nav class="case-pagination section-wrap" aria-label="Other projects"><a href="${rel(2,`portfolio/${previous.slug}/`)}"><span>Previous project</span><strong>${esc(previous.title)}</strong></a><a href="${rel(2,`portfolio/${next.slug}/`)}"><span>Next project</span><strong>${esc(next.title)}</strong></a></nav>`;
  writeRoute(route,shell({title:`${project.title} — Rakib Hasan`,description:project.summary || `${project.title}, a website project in Rakib Hasan’s portfolio.`,route,level:2,active:'work',content,image:project.image}));
});

// Preserve the current 17 category archive URLs as useful filtered project indexes.
function displayCategory(slug, fallback) { return categories.find(([key])=>key===slug)?.[1] || fallback; }
for (const [slug, label] of categories) {
  const matches=projects.filter((project)=>slugify(project.category)===slug);
  const items=matches.map((project,i)=>projectCard(project,i,2)).join('\n');
  const content=`<section class="page-intro section-wrap page-intro--compact"><a class="back-link" href="../../portfolio/">← All projects</a><p class="eyebrow">Portfolio / Category index</p><h1>${esc(displayCategory(slug,label))}</h1><p class="lede">Projects currently listed in this portfolio category.</p><p class="project-total"><strong>${matches.length}</strong><span>${matches.length===1?'project':'projects'}</span></p></section>
<section class="section-wrap portfolio-index"><div class="project-list">${items}</div>${matches.length ? '' : '<p class="empty-state">No project is currently assigned to this category.</p>'}</section>`;
  const route=`/portfolio-categories/${slug}/`;
  writeRoute(route,shell({title:`${label} Projects — Rakib Hasan`,description:`Browse website projects listed under ${label} in Rakib Hasan’s portfolio.`,route,level:2,active:'work',content,noindex:matches.length===0}));
}

const canonicalRoutes=[...new Set(generatedRoutes.filter((route)=>route!=='/about-rakib-hasan/'))];
const sitemap=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${canonicalRoutes.map((route)=>`  <url><loc>${primaryOrigin}${route}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(ROOT,'sitemap.xml'),sitemap,'utf8');
fs.writeFileSync(path.join(ROOT,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${primaryOrigin}/sitemap.xml\n`,'utf8');
fs.writeFileSync(path.join(ROOT,'.nojekyll'),'','utf8');
console.log(`Generated ${generatedRoutes.length} static pages (${canonicalRoutes.length} canonical sitemap routes).`);
