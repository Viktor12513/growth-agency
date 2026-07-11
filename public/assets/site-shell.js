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

  function setupNavigation() {
    const toggle = document.querySelector('header[role="banner"] .nav-hamburger');
    const links = document.querySelector('header[role="banner"] .nav-links');
    removeQuizLinks();
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
  new MutationObserver(removeQuizLinks).observe(document.documentElement, { childList: true, subtree: true });
  setupNavigation();
})();
