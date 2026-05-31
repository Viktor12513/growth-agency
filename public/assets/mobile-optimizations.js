(() => {
  const navSelectors = ['.site-nav', 'header nav', '.header-inner', '.quiz-site-nav'];

  function getLinks(nav) {
    const links = Array.from(nav.querySelectorAll('.nav-links a, .quiz-site-links a'));
    const cta = nav.querySelector('.nav-cta, .btn-cta');
    if (cta && !links.includes(cta)) links.push(cta);
    return links;
  }

  function enhanceExistingMenu(nav) {
    const button = nav.querySelector('.nav-hamburger');
    const menu = document.getElementById('mobile-menu');
    return Boolean(button && menu);
  }

  function createMobileMenu(nav, index) {
    if (nav.dataset.mobileNavReady === 'true') return;
    if (enhanceExistingMenu(nav)) {
      nav.dataset.mobileNavReady = 'true';
      return;
    }

    const links = getLinks(nav);
    if (!links.length) return;

    const button = document.createElement('button');
    const panel = document.createElement('div');
    const panelId = `mobile-nav-panel-${index}`;

    button.className = 'mobile-nav-toggle';
    button.type = 'button';
    button.setAttribute('aria-label', 'Öppna meny');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', panelId);
    button.innerHTML = '<span aria-hidden="true"></span>';

    panel.className = 'mobile-nav-panel';
    panel.id = panelId;
    panel.setAttribute('aria-label', 'Mobilmeny');

    links.forEach((link) => {
      const clone = link.cloneNode(true);
      clone.removeAttribute('id');
      clone.addEventListener('click', () => {
        panel.classList.remove('is-open');
        button.setAttribute('aria-expanded', 'false');
      });
      panel.appendChild(clone);
    });

    button.addEventListener('click', () => {
      const isOpen = panel.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (event) => {
      if (!panel.classList.contains('is-open')) return;
      if (panel.contains(event.target) || button.contains(event.target)) return;
      panel.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
    });

    nav.appendChild(button);
    document.body.appendChild(panel);
    nav.dataset.mobileNavReady = 'true';
  }

  function init() {
    const navs = navSelectors
      .flatMap((selector) => Array.from(document.querySelectorAll(selector)))
      .filter((nav, index, list) => list.indexOf(nav) === index);

    navs.forEach(createMobileMenu);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
