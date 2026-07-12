(function () {
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

    let breadcrumb = document.querySelector('body .breadcrumb');
    if (!breadcrumb) {
      breadcrumb = document.createElement('nav');
      breadcrumb.className = 'breadcrumb';
      breadcrumb.setAttribute('aria-label', 'Brödsmulor');
      breadcrumb.innerHTML = `<ol><li><a href="/">Startsida</a></li><li aria-current="page"></li></ol>`;
      header.insertAdjacentElement('afterend', breadcrumb);
    }

    if (breadcrumb.parentElement !== document.body || breadcrumb.previousElementSibling !== header) {
      header.insertAdjacentElement('afterend', breadcrumb);
    }

    const label = getPageLabel();
    let list = breadcrumb.querySelector('ol, .breadcrumb-list, .breadcrumb-inner');
    if (!list) {
      breadcrumb.innerHTML = '<ol></ol>';
      list = breadcrumb.querySelector('ol');
    }
    if (breadcrumb.dataset.normalizedLabel === label) return;
    list.innerHTML = `<li><a href="/">Startsida</a></li><li aria-current="page">${label}</li>`;
    breadcrumb.dataset.normalizedLabel = label;
  }

  function enhanceSeoDropdown() {
    const seoDropdowns = Array.from(document.querySelectorAll('header[role="banner"] .nav-dropdown')).filter((dropdown) => {
      const trigger = dropdown.querySelector('.nav-dropdown-trigger, a');
      return (trigger?.textContent || '').trim().toLowerCase() === 'seo';
    }).map((dropdown) => dropdown.querySelector('.nav-dropdown-menu')).filter(Boolean);

    const links = [
      { href: '/seo/', title: 'SEO – sökmotoroptimering', text: 'Så hjälper vi företag att synas organiskt på Google.' },
      { href: '/seo-pris/', title: 'SEO pris', text: 'Vad SEO kostar och hur du väljer rätt nivå.' },
      { href: '/lokal-seo/', title: 'Lokal SEO', text: 'Syns i Google Maps och i sökningar nära kunden.' },
      { href: '/seo-byra-smaforetag/', title: 'SEO byrå för småföretag', text: 'Praktisk SEO-hjälp för mindre företag.' },
      { href: '/internationell-seo/', title: 'Internationell SEO', text: 'Strategi för språk, länder och hreflang.' },
      { href: '/blogg/hur-lang-tid-tar-seo/', title: 'Hur lång tid tar SEO?', text: 'Guide med realistisk tidslinje och vanliga misstag.' },
      { href: '/teknisk-seo/', title: 'Teknisk SEO', text: 'Indexering, hastighet, struktur och Core Web Vitals.' },
      { href: '/on-page-seo/', title: 'On-page SEO', text: 'Rubriker, innehåll, sökintention och interna länkar.' },
      { href: '/off-page-seo/', title: 'Off-page SEO', text: 'Länkar, lokal auktoritet och digitalt förtroende.' },
      { href: '/ai-seo/', title: 'AI SEO', text: 'Synlighet i AI-sök, ChatGPT och moderna sökresultat.' }
    ];

    seoDropdowns.forEach((menu) => {
      const current = Array.from(menu.querySelectorAll('a')).map((link) => link.getAttribute('href')).join('|');
      const expected = links.map((item) => item.href).join('|');
      if (current === expected) return;
      menu.innerHTML = links.map((item) => (
        `<a href="${item.href}"><strong>${item.title}</strong><span>${item.text}</span></a>`
      )).join('');
    });
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
  new MutationObserver(() => {
    removeQuizLinks();
    normalizeBreadcrumb();
    enhanceSeoDropdown();
  }).observe(document.documentElement, { childList: true, subtree: true });
  setupNavigation();
})();
