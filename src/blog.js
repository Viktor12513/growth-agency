import { blogPosts, getPostBySlug } from './data/blogPosts.js';

const app = document.getElementById('blog-app');
const pageTitle = document.querySelector('title');
const descriptionMeta = document.querySelector('meta[name="description"]');
const canonicalLink = document.querySelector('link[rel="canonical"]');
const origin = window.location.origin;
let cleanupArticleEvents = () => {};

const icons = {
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
  chart: '<svg viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>',
  pulse: '<svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
  screen: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
  star: '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
  chat: '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  file: '<svg viewBox="0 0 24 24"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>',
};

function decodeHtml(value) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = value;
  return textarea.value;
}

function toIsoDate(value) {
  const months = {
    jan: '01', feb: '02', mar: '03', apr: '04', maj: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', okt: '10', nov: '11', dec: '12',
  };
  const [day, month, year] = value.trim().split(/\s+/);
  return `${year}-${months[month]}-${day.padStart(2, '0')}`;
}

function setMeta({ title, description, canonical }) {
  pageTitle.textContent = decodeHtml(title);
  descriptionMeta?.setAttribute('content', decodeHtml(description));
  canonicalLink?.setAttribute('href', canonical);
}

function setArticleStructuredData(post) {
  let script = document.getElementById('articleStructuredData');
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'articleStructuredData';
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: decodeHtml(post.title),
    description: decodeHtml(post.excerpt),
    datePublished: toIsoDate(post.date),
    author: {
      '@type': 'Person',
      name: decodeHtml(authorLabel(post)),
      affiliation: {
        '@type': 'Organization',
        name: 'Plasma MEDIA AB',
        url: origin,
      },
    },
    dateModified: toIsoDate(post.date),
    publisher: {
      '@type': 'Organization',
      name: 'Plasma MEDIA AB',
      url: origin,
    },
    mainEntityOfPage: `${origin}${postUrl(post)}`,
  });
}

function clearArticleStructuredData() {
  document.getElementById('articleStructuredData')?.remove();
}

function getSlugFromPath(pathname = window.location.pathname) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] === 'blog') {
    window.location.replace('/blogg/' + parts.slice(1).join('/'));
    return null;
  }
  if (parts[0] !== 'blogg') return '';

  const querySlug = new URLSearchParams(window.location.search).get('post');
  return parts[1] || querySlug || '';
}

function arrowIcon() {
  return '<svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
}

function postUrl(post) {
  return post.staticArticle ? `/blogg/${post.slug}/` : `/blogg/${post.slug}`;
}

function authorLabel(post) {
  return post.authorName || 'Plasma MEDIA AB';
}

function catClass(post) {
  const map = {
    'google-ads': 'post-cat--ads',
    hemsida: 'post-cat--website',
    'sociala-medier': 'post-cat--social',
    strategi: 'post-cat--strategy',
  };
  return map[post.categoryKey] || '';
}

const customPostImages = {
  'hur-ofta-posta-instagram': {
    src: '/assets/instagram.png',
    alt: 'Instagram',
    className: 'instagram-logo',
    width: 204,
    height: 192,
  },
  'linkedin-foretag-b2b': {
    src: '/assets/linkedin.png',
    alt: 'LinkedIn',
    className: 'linkedin-logo',
    width: 225,
    height: 225,
  },
  'innehallskalender-sociala-medier': {
    src: '/assets/calendar.png',
    alt: 'Innehallskalender',
    className: 'calendar-logo',
    width: 192,
    height: 192,
  },
};

function renderPostVisual(post, variant = 'card') {
  const customImage = customPostImages[post.slug];
  if (customImage) {
    const imgClass = variant === 'article'
      ? `custom-post-logo custom-post-logo--article ${customImage.className}`
      : `custom-post-logo ${customImage.className}`;
    const loading = variant === 'article' ? 'eager' : 'lazy';
    return `<img class="${imgClass}" src="${customImage.src}" alt="${customImage.alt}" width="${customImage.width}" height="${customImage.height}" loading="${loading}" decoding="async">`;
  }

  if (post.categoryKey === 'google-ads') {
    const imgClass = variant === 'article' ? 'google-ads-logo google-ads-logo--article' : 'google-ads-logo';
    const loading = variant === 'article' ? 'eager' : 'lazy';
    return `<img class="${imgClass}" src="/assets/googleads.webp" alt="Google Ads" width="480" height="599" loading="${loading}" decoding="async">`;
  }

  return icons[post.icon];
}

function visualClass(post) {
  return customPostImages[post.slug] ? ' post-thumb--custom-image' : '';
}

function renderBreadcrumb(currentLabel, includeBlogLink = false) {
  const blogCrumb = includeBlogLink
    ? '<li><a href="/blogg/">Blogg</a></li><li class="sep" aria-hidden="true">&rsaquo;</li>'
    : '';

  return `<nav class="breadcrumb" aria-label="breadcrumb">
    <ol>
      <li><a href="/">Startsida</a></li>
      <li class="sep" aria-hidden="true">&rsaquo;</li>
      ${blogCrumb}
      <li><span>${currentLabel}</span></li>
    </ol>
  </nav>`;
}

function renderHero() {
  return `<div class="page-hero">
    <div class="page-hero-inner">
      <span class="section-tag">Kunskap &amp; insikter</span>
      <h1 class="page-title">Tips som hj&auml;lper dig<br><em>v&auml;xa online</em></h1>
      <p class="page-lead">Guider, r&aring;d och konkreta tips om SEO, hemsidor och digital marknadsf&ouml;ring - skrivet f&ouml;r dig som driver ett svenskt f&ouml;retag.</p>
    </div>
  </div>`;
}

function renderFilters() {
  const categories = [
    ['alla', 'Alla &auml;mnen'],
    ['seo', 'SEO'],
    ['hemsida', 'Hemsidor'],
    ['google-ads', 'Google Ads'],
    ['sociala-medier', 'Innehåll'],
    ['strategi', 'Strategi'],
  ];

  return `<div class="filter-bar" role="tablist" aria-label="Filtrera artiklar">
    ${categories.map(([key, label], index) => `<button class="filter-btn${index === 0 ? ' active' : ''}" type="button" data-filter="${key}">${label}</button>`).join('')}
  </div>`;
}

function renderFeaturedPost(post) {
  const href = postUrl(post);
  return `<article class="post-featured" data-cat="${post.categoryKey}">
    <a class="post-featured-img post-thumb--${post.coverStyle}${visualClass(post)}" href="${href}" aria-label="L&auml;s ${post.title}">
      <div class="featured-icon">${renderPostVisual(post, 'featured')}</div>
      <div class="featured-label">Popul&auml;r guide</div>
      <div class="featured-title">${post.title}</div>
    </a>
    <div class="post-featured-body">
      <div>
        <div class="post-meta">
          <span class="post-cat ${catClass(post)}">${post.category}</span>
          <span class="post-author">Av ${authorLabel(post)}</span>
          <span class="post-date">${post.date}</span>
          <span class="post-read">${post.readingTime}</span>
        </div>
        <p class="post-excerpt">${post.excerpt}</p>
      </div>
      <a href="${href}" class="post-link">L&auml;s hela artikeln ${arrowIcon()}</a>
    </div>
  </article>`;
}

function renderPostCard(post) {
  const href = postUrl(post);
  return `<article class="post-card" data-cat="${post.categoryKey}">
    <a class="post-card-thumb post-thumb--${post.coverStyle}${visualClass(post)}" href="${href}" aria-label="L&auml;s ${post.title}">${renderPostVisual(post, 'card')}</a>
    <div class="post-card-body">
      <div class="post-meta">
        <span class="post-cat ${catClass(post)}">${post.category}</span>
        <span class="post-author">Av ${authorLabel(post)}</span>
        <span class="post-date">${post.date}</span>
        <span class="post-read">${post.readingTime.replace(' l&auml;sning', '')}</span>
      </div>
      <h2 class="post-card-title"><a href="${href}">${post.title}</a></h2>
      <p class="post-card-excerpt">${post.excerpt}</p>
      <a href="${href}" class="post-card-link">L&auml;s mer ${arrowIcon()}</a>
    </div>
  </article>`;
}

function renderNewsletter() {
  return `<div class="newsletter-band">
    <h2>F&aring; nya artiklar direkt i inkorgen</h2>
    <p>Vi skickar ett mail n&auml;r vi publicerar nytt - max ett par g&aring;nger i m&aring;naden, aldrig spam.</p>
    <form class="newsletter-form" id="newsletterForm">
      <input type="email" class="newsletter-input" placeholder="din@email.se" required aria-label="Din e-postadress">
      <button type="submit" class="newsletter-btn">Prenumerera</button>
    </form>
    <p class="newsletter-note">Avregistrera dig n&auml;r som helst. Vi delar aldrig din adress.</p>
  </div>`;
}

function renderCta() {
  return `<section class="cta-band">
    <div class="container">
      <h2>Redo att s&auml;tta kunskapen i verket?</h2>
      <p>Boka ett kostnadsfritt samtal. Vi tittar p&aring; din situation och ger konkreta r&aring;d - utan f&ouml;rpliktelser.</p>
      <a href="/kontakt/#contact-form" class="btn-cta">Boka gratis samtal ${arrowIcon()}</a>
    </div>
  </section>`;
}

function resetArticleEvents() {
  cleanupArticleEvents();
  cleanupArticleEvents = () => {};
}

function attachListingEvents() {
  document.querySelectorAll('.filter-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach((filterButton) => filterButton.classList.remove('active'));
      button.classList.add('active');

      document.querySelectorAll('.post-featured, .post-card').forEach((post) => {
        post.classList.toggle('is-filtered', category !== 'alla' && post.dataset.cat !== category);
      });
    });
  });
}

function attachNewsletterEvent() {
  document.getElementById('newsletterForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const button = form.querySelector('button');
    form.querySelector('input').value = '';
    button.textContent = 'Tack!';
    button.classList.add('is-success');
  });
}

function renderListing() {
  resetArticleEvents();
  const sortedPosts = [...blogPosts].sort((a, b) => toIsoDate(b.date).localeCompare(toIsoDate(a.date)));
  const featured = sortedPosts.find((post) => post.featured) || sortedPosts[0];
  const rest = sortedPosts.filter((post) => post.slug !== featured.slug);

  setMeta({
    title: 'Blogg om SEO, hemsidor & digital marknadsf&ouml;ring | Plasma MEDIA AB',
    description: 'Tips, guider och r&aring;d om SEO, hemsidor och Google Ads f&ouml;r svenska f&ouml;retag.',
    canonical: `${origin}/blogg/`,
  });
  clearArticleStructuredData();

  app.innerHTML = `${renderBreadcrumb('Blogg')}${renderHero()}${renderFilters()}
    <section class="blog-section" aria-labelledby="blog-heading">
      <div class="container">
        <h2 id="blog-heading" class="screen-reader-only">Blogginl&auml;gg</h2>
        ${renderFeaturedPost(featured)}
        <div class="posts-grid" id="postsGrid">${rest.map(renderPostCard).join('')}</div>
      </div>
    </section>
    ${renderNewsletter()}${renderCta()}`;

  attachListingEvents();
  attachNewsletterEvent();
}

function renderArticleSections(post) {
  return post.contentSections.map((section, index) => {
    const sectionId = sectionIdFor(section, index);
    const sectionClass = [
      'article-section',
      index === 0 ? 'article-section--intro' : '',
      section.bullets ? 'article-section--with-list' : '',
      isServiceSection(section) ? 'article-section--service' : '',
      isFaqSection(section) ? 'article-section--faq' : '',
    ].filter(Boolean).join(' ');

    return `<section class="${sectionClass}" id="${sectionId}">
    <span class="article-section-kicker">${String(index + 1).padStart(2, '0')}</span>
    <h2>${section.heading}</h2>
    <div class="article-section-body">${section.body.map((paragraph) => `<p>${paragraph}</p>`).join('')}</div>
    ${section.bullets ? `<ul class="guide-list">${section.bullets.map((item) => `<li>${item}</li>`).join('')}</ul>` : ''}
  </section>`;
  }).join('');
}

function plainText(value) {
  return String(value || '').replace(/<[^>]+>/g, '').replace(/&[^;]+;/g, ' ').replace(/\s+/g, ' ').trim();
}

function sectionIdFor(section, index) {
  const slug = plainText(section.heading)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return slug || `avsnitt-${index + 1}`;
}

function isServiceSection(section) {
  return /relaterad|n&auml;sta steg|vill du/i.test(section.heading);
}

function isFaqSection(section) {
  return /vanliga fr/i.test(plainText(section.heading));
}

function renderArticleToc(post) {
  const sections = post.contentSections
    .map((section, index) => ({ section, index, id: sectionIdFor(section, index) }))
    .filter(({ section }) => !isServiceSection(section))
    .slice(0, 10);

  return `<aside class="article-sidebar" aria-label="Artikelverktyg">
    <div class="sidebar-progress" aria-label="Din l&auml;sning">
      <h3>Din l&auml;sning</h3>
      <div class="read-bar"><div class="read-fill" id="readFill"></div></div>
      <div class="read-pct" id="readPct">0% klart</div>
    </div>
    <div class="sidebar-toc">
      <h3>Inneh&aring;ll</h3>
      <ol class="toc-list">
        ${sections.map(({ section, index, id }) => `<li><a href="#${id}"><span class="toc-num">${String(index + 1).padStart(2, '0')}</span>${section.heading}</a></li>`).join('')}
      </ol>
    </div>
    <div class="sidebar-cta">
      <h3>Vill du g&ouml;ra detta praktiskt?</h3>
      <p>Vi tittar p&aring; din situation och visar vad som ger mest effekt f&ouml;rst.</p>
      <a href="/kontakt/#contact-form">Boka gratis samtal</a>
    </div>
  </aside>`;
}

function featuredAnswer(post) {
  const firstSection = post.contentSections?.[0];
  const source = firstSection?.body?.[0] || post.excerpt;
  return plainText(source).slice(0, 260);
}

function renderAuthorBox(post) {
  return `<div class="author-box">
    <div class="author-avatar" aria-hidden="true">${plainText(authorLabel(post)).charAt(0) || 'N'}</div>
    <div>
      <div class="author-name">${authorLabel(post)}</div>
      <p class="author-desc">${post.authorRole || 'Specialister p&aring; SEO, hemsidor och digital marknadsf&ouml;ring f&ouml;r svenska f&ouml;retag.'}</p>
    </div>
  </div>`;
}

function renderArticleTags(post) {
  const tags = [post.category, 'Plasma MEDIA AB', 'Digital marknadsf&ouml;ring'].filter(Boolean);
  return `<div class="article-tags">${tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}</div>`;
}

function renderAuthorityBox(post) {
  const serviceLink = post.categoryKey === 'google-ads'
    ? ['Google Ads', '/google-ads/']
    : post.categoryKey === 'hemsida'
      ? ['hemsidor', '/hemsida/']
      : ['SEO', '/seo/'];

  return `<aside class="authority-box" aria-label="Källor och nästa steg">
    <div>
      <span class="authority-label">Fördjupning och nästa steg</span>
      <h2>Vill du kontrollera eller jämföra själv?</h2>
      <p>Här är några pålitliga resurser och interna sidor som hjälper dig gå från guide till beslut.</p>
    </div>
    <div class="authority-links">
      <a href="https://search.google.com/search-console/about" target="_blank" rel="noopener">Google Search Console</a>
      <a href="https://pagespeed.web.dev/" target="_blank" rel="noopener">PageSpeed Insights</a>
      <a href="/priser/">Se priser och paket</a>
      <a href="${serviceLink[1]}">Läs mer om ${serviceLink[0]}</a>
    </div>
  </aside>`;
}

function attachArticleEvents() {
  resetArticleEvents();

  const article = document.querySelector('.blog-post--guide');
  const fill = document.getElementById('readFill');
  const pct = document.getElementById('readPct');
  const headings = document.querySelectorAll('.article-body h2[id]');
  const tocLinks = document.querySelectorAll('.toc-list a');

  function updateProgress() {
    if (!article || !fill || !pct) return;
    const rect = article.getBoundingClientRect();
    const total = Math.max(1, article.offsetHeight - window.innerHeight);
    const scrolled = Math.max(0, -rect.top);
    const percent = Math.min(100, Math.round((scrolled / total) * 100));
    fill.style.width = `${percent}%`;
    pct.textContent = `${percent}% klart`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  let observer = null;
  if ('IntersectionObserver' in window && headings.length) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        tocLinks.forEach((link) => link.classList.remove('active'));
        document.querySelector(`.toc-list a[href="#${entry.target.id}"]`)?.classList.add('active');
      });
    }, { rootMargin: '-15% 0px -75% 0px' });

    headings.forEach((heading) => observer.observe(heading));
  }

  cleanupArticleEvents = () => {
    window.removeEventListener('scroll', updateProgress);
    observer?.disconnect();
  };
}

function renderRelatedPosts(post) {
  const related = blogPosts
    .filter((candidate) => candidate.slug !== post.slug && candidate.categoryKey === post.categoryKey)
    .concat(blogPosts.filter((candidate) => candidate.slug !== post.slug && candidate.categoryKey !== post.categoryKey))
    .slice(0, 3);

  return `<section class="related-posts" aria-labelledby="related-heading">
    <div class="container">
      <div class="section-heading-row">
        <span class="section-tag">Fler guider</span>
        <h2 id="related-heading">L&auml;s vidare</h2>
      </div>
      <div class="posts-grid related-grid">${related.map(renderPostCard).join('')}</div>
    </div>
  </section>`;
}

function renderPost(post) {
  resetArticleEvents();

  if (post.staticArticle) {
    window.location.replace(postUrl(post));
    return;
  }

  setMeta({
    title: `${post.title} | Plasma MEDIA AB`,
    description: post.excerpt,
    canonical: `${origin}/blogg/${post.slug}`,
  });
  setArticleStructuredData(post);

  app.innerHTML = `${renderBreadcrumb(post.title, true)}
    <main class="article-page article-page--dynamic">
      <div class="article-wrap">
        <article class="blog-post blog-post--guide" itemscope itemtype="https://schema.org/BlogPosting">
          <meta itemprop="datePublished" content="${toIsoDate(post.date)}">
          <header class="article-header">
            <a href="/blogg/" class="article-back article-back--guide">Tillbaka till bloggen</a>
            <div class="post-badges">
              <span class="badge badge-cat">${post.category}</span>
              <span class="badge badge-time">${post.readingTime}</span>
            </div>
            <h1 class="article-title" itemprop="headline">${post.title}</h1>
            <div class="featured-answer">
              <span class="featured-answer-label">Kort svar</span>
              <p>${featuredAnswer(post)}</p>
            </div>
            <p class="article-lead" itemprop="description">${post.excerpt}</p>
            <div class="article-meta">
              <span><strong>Publicerad:</strong> ${post.date}</span>
              <span><strong>Av:</strong> ${authorLabel(post)}</span>
              <span><strong>Kategori:</strong> ${post.category}</span>
              <span><strong>L&auml;stid:</strong> ${post.readingTime}</span>
            </div>
          </header>

          <div class="article-hero article-hero--guide post-thumb--${post.coverStyle}${visualClass(post)}" role="img" aria-label="${post.category}">
            <div class="article-hero-visual">${renderPostVisual(post, 'article')}</div>
            <div class="hero-stats">
              <div class="hero-stat">
                <div class="hero-stat-num">01</div>
                <div class="hero-stat-label">praktisk guide</div>
              </div>
              <div class="hero-divider"></div>
              <div class="hero-stat">
                <div class="hero-stat-num">${post.contentSections.length}</div>
                <div class="hero-stat-label">avsnitt</div>
              </div>
              <div class="hero-divider"></div>
              <div class="hero-stat">
                <div class="hero-stat-num"><span>✓</span></div>
                <div class="hero-stat-label">konkreta steg</div>
              </div>
            </div>
          </div>

          <div class="article-body">
            ${renderArticleSections(post)}
          </div>
          ${renderAuthorityBox(post)}
          ${renderAuthorBox(post)}
          ${renderArticleTags(post)}
        </article>
        ${renderArticleToc(post)}
      </div>
    </main>
    ${renderRelatedPosts(post)}${renderCta()}`;

  attachArticleEvents();
}

function renderNotFound() {
  resetArticleEvents();
  setMeta({
    title: '404 - Artikeln hittades inte | Plasma MEDIA AB',
    description: 'Artikeln du s&ouml;ker finns inte. G&aring; tillbaka till bloggen f&ouml;r att hitta fler guider.',
    canonical: `${origin}/blogg/`,
  });
  clearArticleStructuredData();

  app.innerHTML = `${renderBreadcrumb('404', true)}
    <section class="not-found-section">
      <div class="container not-found-card">
        <span class="section-tag">404</span>
        <h1>Artikeln hittades inte</h1>
        <p>Den h&auml;r bloggartikeln finns inte eller har flyttats. G&aring; tillbaka till bloggen och v&auml;lj en annan guide.</p>
        <a class="btn-cta" href="/blogg/">Till bloggen ${arrowIcon()}</a>
      </div>
    </section>`;
}

function renderRoute(pathname = window.location.pathname) {
  const slug = getSlugFromPath(pathname);

  if (slug === '') {
    renderListing();
    return;
  }

  const post = getPostBySlug(slug);
  if (post) {
    if (window.location.search.includes('post=')) {
      window.history.replaceState({}, '', `/blogg/${post.slug}`);
    }
    renderPost(post);
  } else {
    renderNotFound();
  }
}

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="/blogg/"]');
  if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const url = new URL(link.href);
  if (url.origin !== window.location.origin) return;

  event.preventDefault();
  window.history.pushState({}, '', url.pathname);
  renderRoute(url.pathname);
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('popstate', () => renderRoute());

renderRoute();
