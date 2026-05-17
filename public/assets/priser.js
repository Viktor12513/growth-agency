let isYearly = false;

function updateBillingPrices() {
  document.querySelectorAll('.price-main[data-monthly]').forEach((price) => {
    price.textContent = (isYearly ? price.dataset.yearly : price.dataset.monthly) + ' kr';
  });

  document.querySelectorAll('.yearly-note').forEach((note) => {
    note.classList.toggle('is-hidden', !isYearly);
  });
}

function toggleBilling() {
  isYearly = !isYearly;

  document.getElementById('billingToggle')?.classList.toggle('yearly', isYearly);
  document.getElementById('label-monthly')?.classList.toggle('active', !isYearly);
  document.getElementById('label-yearly')?.classList.toggle('active', isYearly);

  updateBillingPrices();
}

function toggleFaq(button) {
  const item = button.closest('.faq-item');
  const isOpen = item.classList.contains('open');

  document.querySelectorAll('.faq-item').forEach((faqItem) => {
    faqItem.classList.remove('open');
  });

  if (!isOpen) item.classList.add('open');
}

document.getElementById('billingToggle')?.addEventListener('click', toggleBilling);
document.querySelectorAll('.faq-q').forEach((button) => {
  button.addEventListener('click', () => toggleFaq(button));
});
