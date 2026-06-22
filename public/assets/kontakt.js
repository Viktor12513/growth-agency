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
const submitButton = contactForm.querySelector('.btn-submit');
const originalSubmitText = submitButton.innerHTML;

function formValue(name) {
  return contactForm.elements[name]?.value?.trim() || '';
}

function buildPayload() {
  return {
    fname: formValue('fname'),
    lname: formValue('lname'),
    email: formValue('email'),
    phone: formValue('phone'),
    company: formValue('company'),
    service: formValue('service'),
    message: formValue('message'),
  };
}

function buildMailto(payload) {
  const subject = encodeURIComponent('Ny kontaktförfrågan från Plasma MEDIA AB');
  const body = encodeURIComponent(
    `Förnamn: ${payload.fname}\n` +
    `Efternamn: ${payload.lname}\n` +
    `E-post: ${payload.email}\n` +
    `Telefon: ${payload.phone || '-'}\n` +
    `Företag: ${payload.company || '-'}\n` +
    `Tjänst: ${payload.service}\n\n` +
    `Meddelande:\n${payload.message}`
  );

  return `mailto:albin@plasmamedia.se?subject=${subject}&body=${body}`;
}

function showSuccess() {
  contactForm.style.display = 'none';
  formSuccess.classList.add('visible');
}

function setSubmitting(isSubmitting) {
  submitButton.disabled = isSubmitting;
  submitButton.innerHTML = isSubmitting ? 'Skickar...' : originalSubmitText;
}

contactForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  if (!this.checkValidity()) {
    this.reportValidity();
    return;
  }

  const payload = buildPayload();
  setSubmitting(true);

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      showSuccess();
      return;
    }

    const result = await response.json().catch(() => ({}));
    if (result.fallback === 'mailto') {
      window.location.href = buildMailto(payload);
      return;
    }

    throw new Error(result.error || 'Contact request failed');
  } catch (error) {
    console.error(error);
    window.location.href = buildMailto(payload);
  } finally {
    setSubmitting(false);
  }
});
