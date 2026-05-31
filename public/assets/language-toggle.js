(function () {
  const COOKIE_NAME = 'googtrans';
  const SOURCE_LANG = 'sv';
  const TARGET_LANG = 'en';

  function getCookie(name) {
    return document.cookie
      .split('; ')
      .find((row) => row.startsWith(name + '='))
      ?.split('=')[1] || '';
  }

  function setTranslateCookie(value) {
    const host = window.location.hostname;
    const maxAge = value ? '; max-age=31536000' : '; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    const base = `${COOKIE_NAME}=${value}; path=/${maxAge}; SameSite=Lax`;

    document.cookie = base;
    if (host && host.includes('.')) {
      document.cookie = `${COOKIE_NAME}=${value}; path=/; domain=.${host}${maxAge}; SameSite=Lax`;
    }
  }

  function isEnglish() {
    return decodeURIComponent(getCookie(COOKIE_NAME)).includes(`/${SOURCE_LANG}/${TARGET_LANG}`);
  }

  function addStyles() {
    if (document.getElementById('language-toggle-styles')) return;
    const style = document.createElement('style');
    style.id = 'language-toggle-styles';
    style.textContent = `
      .language-switch {
        position: relative;
        display: inline-flex;
        align-items: center;
        z-index: 50;
      }
      .language-switch-trigger,
      .language-switch-option {
        border: 1px solid rgba(20,58,31,0.18);
        background: transparent;
        color: #143a1f;
        border-radius: 8px;
        min-width: 44px;
        padding: 0.55rem 0.7rem;
        font: 700 0.82rem/1 'DM Sans', Arial, sans-serif;
        cursor: pointer;
        white-space: nowrap;
        transition: background 0.2s, border-color 0.2s, color 0.2s;
      }
      .language-switch-trigger:hover,
      .language-switch-option:hover {
        background: rgba(20,58,31,0.07);
        border-color: rgba(20,58,31,0.34);
      }
      .language-switch-menu {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(-4px);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.16s, transform 0.16s;
        background: #fff;
        border: 1px solid rgba(20,58,31,0.14);
        border-radius: 10px;
        padding: 10px 6px 6px;
        box-shadow: 0 12px 30px rgba(20,58,31,0.12);
      }
      .language-switch-menu::before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: -10px;
        height: 10px;
      }
      .language-switch:hover .language-switch-menu,
      .language-switch:focus-within .language-switch-menu {
        opacity: 1;
        pointer-events: auto;
        transform: translateX(-50%) translateY(0);
      }
      .language-switch-option {
        background: #fff;
        border-color: transparent;
      }
      #google_translate_element,
      .goog-te-banner-frame,
      .goog-te-gadget {
        display: none !important;
      }
      body { top: 0 !important; }
    `;
    document.head.appendChild(style);
  }

  function insertButton() {
    if (document.querySelector('.language-switch')) return;

    const switcher = document.createElement('div');
    switcher.className = 'language-switch';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'language-switch-trigger';
    button.textContent = isEnglish() ? 'ENG' : 'SV';
    button.setAttribute('aria-label', 'Välj språk');
    button.setAttribute('aria-haspopup', 'true');

    const menu = document.createElement('div');
    menu.className = 'language-switch-menu';

    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'language-switch-option';
    option.textContent = isEnglish() ? 'SV' : 'ENG';
    option.setAttribute('aria-label', isEnglish() ? 'Visa sidan på svenska' : 'Translate page to English');
    option.addEventListener('click', function () {
      setTranslateCookie(isEnglish() ? '' : `/${SOURCE_LANG}/${TARGET_LANG}`);
      window.location.reload();
    });

    menu.appendChild(option);
    switcher.appendChild(button);
    switcher.appendChild(menu);

    const cta = document.querySelector('.nav-cta');
    if (cta && cta.parentElement) {
      cta.parentElement.insertBefore(switcher, cta);
      return;
    }

    const navLinks = document.querySelector('.nav-links');
    if (navLinks && navLinks.parentElement) {
      navLinks.parentElement.appendChild(switcher);
      return;
    }

    const nav = document.querySelector('header nav, body > nav, nav');
    if (nav) nav.appendChild(switcher);
  }

  function setupMobileNavigation() {
    const nav = document.querySelector('header[role="banner"] > nav, body > header > nav, .site-nav, .quiz-site-nav, .header-inner');
    if (!nav) return;

    const links = nav.querySelector('.nav-links, .quiz-site-links') ||
      (nav.classList.contains('header-inner') ? nav.querySelector(':scope > nav') : null);
    if (!links) return;

    if (!links.id) {
      links.id = 'primary-nav';
    }

    const existingMenu = document.getElementById('mobile-menu');
    if (existingMenu && nav.querySelector('.nav-hamburger')) {
      nav.querySelector('.nav-hamburger')?.classList.add('mobile-nav-toggle');
      return;
    }

    let toggle = nav.querySelector('.mobile-nav-toggle');
    if (!toggle) {
      toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'mobile-nav-toggle';
      toggle.setAttribute('aria-label', 'Öppna meny');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-controls', links.id);
      toggle.innerHTML = '<span></span><span></span><span></span>';

      const logo = nav.querySelector('.nav-logo, .quiz-logo, .logo');
      if (logo?.nextSibling) {
        nav.insertBefore(toggle, logo.nextSibling);
      } else {
        nav.insertBefore(toggle, links);
      }
    } else {
      toggle.setAttribute('aria-controls', links.id);
      toggle.setAttribute('aria-expanded', toggle.getAttribute('aria-expanded') || 'false');
    }

    if (toggle.dataset.mobileNavReady === 'true') return;
    toggle.dataset.mobileNavReady = 'true';

    toggle.addEventListener('click', function () {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      links.classList.toggle('is-open', !isOpen);
    });

    links.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('is-open');
      });
    });
  }

  function addGoogleTranslate() {
    if (document.getElementById('google_translate_element')) return;

    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement({
        pageLanguage: SOURCE_LANG,
        includedLanguages: TARGET_LANG,
        autoDisplay: false,
      }, 'google_translate_element');
    };

    const holder = document.createElement('div');
    holder.id = 'google_translate_element';
    document.body.appendChild(holder);

    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }

  function init() {
    addStyles();
    setupMobileNavigation();
    insertButton();
    addGoogleTranslate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
