(function () {
  function clearElement(element) {
    while (element.firstChild) element.removeChild(element.firstChild);
  }

  function createBreadcrumbList(label, options = {}) {
    const includeBlog = Boolean(options.includeBlog);
    const list = document.createElement('ol');
    const homeItem = document.createElement('li');
    const homeLink = document.createElement('a');
    homeLink.href = '/';
    homeLink.textContent = 'Startsida';
    homeItem.appendChild(homeLink);
    list.appendChild(homeItem);

    if (includeBlog) {
      const blogItem = document.createElement('li');
      const blogLink = document.createElement('a');
      blogLink.href = '/blogg/';
      blogLink.textContent = 'Blogg';
      blogItem.appendChild(blogLink);
      list.appendChild(blogItem);
    }

    const currentItem = document.createElement('li');
    const current = document.createElement('span');
    current.setAttribute('aria-current', 'page');
    current.textContent = label;
    currentItem.appendChild(current);

    list.appendChild(currentItem);
    return list;
  }

  function clearTranslation() {
    document.querySelectorAll('.language-switch, #google_translate_element, .goog-te-banner-frame').forEach((element) => element.remove());
    document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    if (location.hostname.includes('.')) {
      document.cookie = `googtrans=; path=/; domain=.${location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    }
    document.documentElement.lang = 'sv';
    document.body.style.top = '0';
  }

  function removeQuizLinks() {
    document.querySelectorAll('header[role="banner"] a, nav a, footer a').forEach((link) => {
      const label = (link.textContent || '').trim().toLowerCase();
      const href = (link.getAttribute('href') || '').toLowerCase();
      if (label === 'quiz' || href === '/quiz/' || href === '/quiz' || href.includes('/quiz/')) {
        link.closest('li')?.remove();
        if (link.isConnected) link.remove();
      }
    });
  }

  function getPageLabel() {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    const labels = {
      '/hemsida': 'Hemsidor',
      '/seo': 'SEO – Sökmotoroptimering',
      '/google-ads': 'Google Ads',
      '/priser': 'Priser',
      '/blogg': 'Blogg',
      '/faq': 'FAQ',
      '/om-oss': 'Om oss',
      '/kontakt': 'Kontakt',
      '/kundcases': 'Kundcase',
      '/teknisk-seo': 'Teknisk SEO',
      '/on-page-seo': 'On-page SEO',
      '/off-page-seo': 'Off-page SEO',
      '/ai-seo': 'AI SEO',
      '/lokal-seo': 'Lokal SEO',
      '/google-ads-pris': 'Google Ads pris',
      '/google-ads-byra': 'Google Ads byrå'
    };
    if (labels[path]) return labels[path];
    const heading = document.querySelector('main h1, h1');
    return (heading?.textContent || document.title || 'Sida')
      .replace(/\s+/g, ' ')
      .replace(/\s*\|.*$/, '')
      .trim();
  }

  function normalizeBreadcrumb() {
    if (window.location.pathname === '/' || window.location.pathname === '') return;

    const header = document.querySelector('header[role="banner"]');
    if (!header) return;

    const allBreadcrumbs = Array.from(document.querySelectorAll('body .breadcrumb'));
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    const isBlogPage = path === '/blogg' || path.startsWith('/blogg/');

    let breadcrumb = allBreadcrumbs.find((item) => item.closest('main.article-page'))
      || allBreadcrumbs.find((item) => item.querySelector('a[href="/blogg/"], a[href="/blogg"]'))
      || allBreadcrumbs[0];

    if (!breadcrumb) {
      breadcrumb = document.createElement('nav');
      breadcrumb.className = 'breadcrumb';
      breadcrumb.setAttribute('aria-label', 'Brödsmulor');
      breadcrumb.appendChild(createBreadcrumbList('', { includeBlog: isBlogPage && path !== '/blogg' }));
      header.insertAdjacentElement('afterend', breadcrumb);
    }

    allBreadcrumbs.forEach((item) => {
      if (item !== breadcrumb) item.remove();
    });

    if (breadcrumb.parentElement !== document.body || breadcrumb.previousElementSibling !== header) {
      header.insertAdjacentElement('afterend', breadcrumb);
    }

    const label = getPageLabel();
    const normalizedKey = `${isBlogPage ? 'blog' : 'page'}:${label}`;
    let list = breadcrumb.querySelector('ol, .breadcrumb-list, .breadcrumb-inner');
    if (!list) {
      clearElement(breadcrumb);
      list = createBreadcrumbList(label, { includeBlog: isBlogPage && path !== '/blogg' });
      breadcrumb.appendChild(list);
    }
    if (breadcrumb.dataset.normalizedLabel === normalizedKey) return;
    clearElement(breadcrumb);
    breadcrumb.appendChild(createBreadcrumbList(label, { includeBlog: isBlogPage && path !== '/blogg' }));
    breadcrumb.dataset.normalizedLabel = normalizedKey;
  }

  function enhanceSeoDropdown() {
    const seoDropdowns = Array.from(document.querySelectorAll('header[role="banner"] .nav-dropdown')).filter((dropdown) => {
      const trigger = dropdown.querySelector('.nav-dropdown-trigger, a');
      return (trigger?.textContent || '').trim().toLowerCase() === 'seo';
    }).map((dropdown) => dropdown.querySelector('.nav-dropdown-menu')).filter(Boolean);

    const groups = [
      {
        title: 'Strategi & marknad',
        text: 'SEO-upplägg för olika affärer, marknader och tillväxtmål.',
        links: [
          { href: '/seo/', title: 'SEO – sökmotoroptimering', text: 'Översikt, arbetssätt och vägen till fler relevanta besök.' },
          { href: '/seo-pris/', title: 'SEO-priser', text: 'Prisfaktorer, omfattning och vad som bör ingå.' },
          { href: '/seo-byra-smaforetag/', title: 'SEO-byrå för småföretag', text: 'Praktisk SEO för företag som vill växa stegvis.' },
          { href: '/casino-seo/', title: 'Casino SEO', text: 'Teknik, innehåll och förtroende i en reglerad bransch.' },
          { href: '/shopify-seo/', title: 'Shopify SEO', text: 'Kategorier, produkter, indexering och konvertering.' },
          { href: '/skalbar-lokal-seo/', title: 'Skalbar lokal SEO', text: 'Kvalitativa ortssidor och lokal struktur i större skala.' },
          { href: '/internationell-seo/', title: 'Internationell SEO', text: 'Språk, marknader, URL-struktur och hreflang.' }
        ]
      },
      {
        title: 'Teknik & innehåll',
        text: 'Starka sidor som går att hitta, förstå och välja.',
        links: [
          { href: '/teknisk-seo/', title: 'Teknisk SEO', text: 'Indexering, hastighet, struktur och Core Web Vitals.' },
          { href: '/on-page-seo/', title: 'On-page SEO', text: 'Sökintention, innehåll, rubriker och internlänkar.' },
          { href: '/innehallsanalys-seo/', title: 'Innehållsanalys SEO', text: 'Innehållsgap, kannibalisering och uppdateringsbehov.' },
          { href: '/seo-anpassade-texter/', title: 'SEO-anpassade texter', text: 'Texter som svarar på sökintention och leder vidare.' },
          { href: '/sitemigrering-seo/', title: 'Byt hemsida – sitemigrering', text: 'Behåll synlighet vid byte av CMS, domän eller struktur.' },
          { href: '/lokal-seo/', title: 'Lokal SEO', text: 'Google Maps och synlighet där kunderna söker.' },
          { href: '/blogg/hur-lang-tid-tar-seo/', title: 'Guide: Hur lång tid tar SEO?', text: 'Realistisk tidslinje från första åtgärd till resultat.' }
        ]
      },
      {
        title: 'Auktoritet & AI-sök',
        text: 'Förtroendesignaler för Google, AI-tjänster och kunder.',
        links: [
          { href: '/off-page-seo/', title: 'Off-page SEO', text: 'Länkstrategi, digital PR och relevanta omnämnanden.' },
          { href: '/lankstrategi/', title: 'Länkstrategi', text: 'Relevanta länkar, outreach, digital PR och riskkontroll.' },
          { href: '/youtube-seo/', title: 'YouTube SEO', text: 'Videotitlar, retention, thumbnails och kanalstruktur.' },
          { href: '/app-store-optimering/', title: 'App Store-optimering', text: 'Synlighet och konvertering i App Store och Google Play.' },
          { href: '/ai-seo/', title: 'AI SEO', text: 'Synlighet i AI-sök, ChatGPT och moderna sökresultat.' },
          { href: '/blogg/hur-syns-man-i-chatgpt/', title: 'Guide: Synas i ChatGPT', text: 'Så görs information tydligare och mer citerbar.' }
        ]
      }
    ];

    const links = groups.flatMap((group) => group.links);

    seoDropdowns.forEach((menu) => {
      const current = Array.from(menu.querySelectorAll('a')).map((link) => link.getAttribute('href')).join('|');
      const expected = links.map((item) => item.href).join('|');
      if (current === expected) return;
      clearElement(menu);
      const intro = document.createElement('div');
      intro.className = 'seo-menu-intro';
      intro.innerHTML = '<strong>SEO-tjänster för hållbar synlighet</strong><span>Välj område eller börja med vår SEO-översikt.</span>';
      menu.appendChild(intro);

      groups.forEach((group) => {
        const section = document.createElement('div');
        const heading = document.createElement('p');
        const description = document.createElement('span');
        section.className = 'seo-menu-group';
        heading.className = 'seo-menu-group-title';
        heading.textContent = group.title;
        description.className = 'seo-menu-group-description';
        description.textContent = group.text;
        section.append(heading, description);

        group.links.forEach((item) => {
          const link = document.createElement('a');
          const title = document.createElement('strong');
          const text = document.createElement('span');
          link.href = item.href;
          title.textContent = item.title;
          text.textContent = item.text;
          link.append(title, text);
          section.appendChild(link);
        });
        menu.appendChild(section);
      });
    });
  }

  function setupArticleReadingTools() {
    const article = document.querySelector('.blog-post--guide');
    const fill = document.getElementById('readFill');
    const pct = document.getElementById('readPct');
    const headings = Array.from(document.querySelectorAll('.article-body h2[id]'));
    const tocLinks = Array.from(document.querySelectorAll('.toc-list a[href^="#"]'));
    if (!article || !fill || !pct || article.dataset.readingToolsReady === 'true') return;

    article.dataset.readingToolsReady = 'true';

    const getScrollTop = () => {
      const scrollingElement = document.scrollingElement || document.documentElement;
      return Math.max(window.scrollY || 0, scrollingElement?.scrollTop || 0, document.body?.scrollTop || 0);
    };

    const updateProgress = () => {
      const scrollTop = getScrollTop();
      const articleTop = article.getBoundingClientRect().top + scrollTop;
      const start = Math.max(0, articleTop - window.innerHeight * 0.2);
      const end = Math.max(start + 1, articleTop + article.offsetHeight - window.innerHeight * 0.7);
      const read = Math.min(Math.max(scrollTop - start, 0), end - start);
      const scrollable = end - start;
      const progress = Math.round((read / scrollable) * 100);
      fill.style.width = `${progress}%`;
      pct.textContent = `${progress}% klart`;

      if (headings.length && tocLinks.length) {
        const activeHeading = headings
          .map((heading) => ({ heading, top: heading.getBoundingClientRect().top }))
          .filter((item) => item.top <= window.innerHeight * 0.35)
          .sort((a, b) => b.top - a.top)[0] || { heading: headings[0] };
        tocLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${activeHeading.heading.id}`);
        });
      }
    };

    if (headings.length && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          tocLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
          });
        });
      }, { rootMargin: '-20% 0px -65% 0px', threshold: 0.01 });

      headings.forEach((heading) => observer.observe(heading));
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }

  function setupNavigation() {
    const toggle = document.querySelector('header[role="banner"] .nav-hamburger');
    const links = document.querySelector('header[role="banner"] .nav-links');
    removeQuizLinks();
    enhanceSeoDropdown();
    if (!toggle || !links || toggle.dataset.ready === 'true') return;
    toggle.dataset.ready = 'true';
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Öppna meny' : 'Stäng meny');
      links.classList.toggle('is-open', !open);
    });
    links.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Öppna meny');
      links.classList.remove('is-open');
    }));
  }

  clearTranslation();
  removeQuizLinks();
  normalizeBreadcrumb();
  enhanceSeoDropdown();
  setupArticleReadingTools();
  const observer = new MutationObserver(() => {
    removeQuizLinks();
    normalizeBreadcrumb();
    enhanceSeoDropdown();
    setupArticleReadingTools();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.setTimeout(() => observer.disconnect(), 4500);
  setupNavigation();
})();
