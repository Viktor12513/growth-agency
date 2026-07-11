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

  function enhanceSeoDropdown() {
    const seoDropdowns = Array.from(document.querySelectorAll('header[role="banner"] .nav-dropdown')).filter((dropdown) => {
      const trigger = dropdown.querySelector('.nav-dropdown-trigger, a');
      return (trigger?.textContent || '').trim().toLowerCase() === 'seo';
    }).map((dropdown) => dropdown.querySelector('.nav-dropdown-menu')).filter(Boolean);
    const links = [
      {
        href: '/blogg/?post=teknisk-seo-2026',
        title: 'Teknisk SEO',
        text: 'Indexering, hastighet, struktur och Core Web Vitals.'
      },
      {
        href: '/blogg/?post=on-page-seo-guide-2026',
        title: 'On-page SEO',
        text: 'Rubriker, innehåll, sökintention och interna länkar.'
      },
      {
        href: '/blogg/?post=off-page-seo-lankstrategi-2026',
        title: 'Off-page SEO',
        text: 'Länkar, lokal auktoritet och digitalt förtroende.'
      }
    ];

    seoDropdowns.forEach((menu) => {
      links.forEach((item) => {
        if (menu.querySelector(`a[href="${item.href}"]`)) return;
        const link = document.createElement('a');
        link.href = item.href;
        link.dataset.seoClusterLink = 'true';
        link.innerHTML = `<strong>${item.title}</strong><span>${item.text}</span>`;
        menu.appendChild(link);
      });
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
  enhanceSeoDropdown();
  new MutationObserver(() => {
    removeQuizLinks();
    enhanceSeoDropdown();
  }).observe(document.documentElement, { childList: true, subtree: true });
  setupNavigation();
})();
