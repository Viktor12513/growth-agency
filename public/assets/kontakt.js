// FAQ accordion
document.querySelectorAll('.faq-q').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item').forEach((faqItem) => {
      faqItem.classList.remove('open');
      faqItem.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (new URLSearchParams(window.location.search).get('skickat') === '1') {
  contactForm.style.display = 'none';
  formSuccess.classList.add('visible');
}

contactForm.addEventListener('submit', function (event) {
  if (!this.checkValidity()) {
    event.preventDefault();
    this.reportValidity();
  }
});
