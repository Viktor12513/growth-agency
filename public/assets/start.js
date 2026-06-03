// Hamburger menu
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const menu = mobileMenu || navLinks;
      if (!menu) return;
      const isOpen = mobileMenu
        ? menu.classList.toggle('open')
        : menu.classList.toggle('is-open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen && mobileMenu ? 'hidden' : '';
    });
  }

  const closeLinks = mobileMenu || navLinks;
  closeLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu?.classList.remove('open');
      navLinks?.classList.remove('is-open');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
