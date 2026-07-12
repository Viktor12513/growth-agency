function toggleFaq(button) {
  const item = button.closest('.faq-item');
  const isOpen = item.classList.contains('open');

  document.querySelectorAll('.faq-item').forEach((faqItem) => {
    faqItem.classList.remove('open');
    faqItem.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
  });

  if (!isOpen) {
    item.classList.add('open');
    button.setAttribute('aria-expanded', 'true');
  }
}

document.querySelectorAll('.faq-q').forEach((button) => {
  button.addEventListener('click', () => toggleFaq(button));
});
