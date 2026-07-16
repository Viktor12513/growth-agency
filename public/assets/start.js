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

  // Lightweight scroll reveals for the more editorial sections.
  // Content remains fully visible when JavaScript is unavailable.
  const revealItems = document.querySelectorAll('.reveal-on-scroll');
  if (revealItems.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('has-js');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }
