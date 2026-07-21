(() => {
  'use strict';

  const totalPrice = 19999;
  const formatNumber = new Intl.NumberFormat('sv-SE');

  function renderTerm(months) {
    const monthlyPrice = Math.ceil(totalPrice / months);
    const price = document.getElementById('web-start-price');
    const note = document.getElementById('web-start-note');
    const total = document.getElementById('web-start-total');
    const startLink = document.getElementById('pricing-start-link');

    if (price) price.textContent = `${formatNumber.format(monthlyPrice)} kr/mån`;
    if (note) note.textContent = `i ${months} månader · ex. moms`;
    if (total) total.textContent = `${formatNumber.format(totalPrice)} kr`;
    if (startLink) {
      startLink.href = `/kontakt/?service=hemsida&package=start&term=${months}#contact-form`;
    }

    document.querySelectorAll('[data-web-term]').forEach((button) => {
      const selected = Number(button.dataset.webTerm) === months;
      button.classList.toggle('on', selected);
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });
  }

  function wirePricingTerms() {
    document.querySelectorAll('[data-web-term]').forEach((button) => {
      button.addEventListener('click', () => renderTerm(Number(button.dataset.webTerm)));
    });
    renderTerm(24);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wirePricingTerms, { once: true });
  } else {
    wirePricingTerms();
  }
})();
