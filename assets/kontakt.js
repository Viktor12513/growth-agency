// FAQ accordion
document.querySelectorAll('.faq-q').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    if (!item) return;
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item').forEach((faqItem) => {
      faqItem.classList.remove('open');
      faqItem.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

const MAX_TOTAL_UPLOAD_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

function formatFileSize(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`;
}

function fileHasAllowedExtension(file) {
  const fileName = file.name.toLowerCase();
  return ALLOWED_IMAGE_EXTENSIONS.some((extension) => fileName.endsWith(extension));
}

function getFileErrorElement(input) {
  const group = input.closest('.form-group');
  return group?.querySelector('[data-file-error]') || input.form?.querySelector('[data-file-error]');
}

function setFileError(input, message = '') {
  const errorElement = getFileErrorElement(input);
  if (!errorElement) return;
  errorElement.textContent = message;
  errorElement.hidden = !message;
}

function validateFileInput(input) {
  const files = Array.from(input.files || []);
  if (!files.length) {
    setFileError(input);
    input.setCustomValidity('');
    return true;
  }

  const invalidFile = files.find((file) => {
    const hasAllowedType = ALLOWED_IMAGE_TYPES.has(file.type);
    return !hasAllowedType && !fileHasAllowedExtension(file);
  });

  if (invalidFile) {
    const message = 'Ladda bara upp bilder i JPG, PNG eller WebP.';
    setFileError(input, message);
    input.setCustomValidity(message);
    return false;
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > MAX_TOTAL_UPLOAD_SIZE) {
    const message = `Bilderna är ${formatFileSize(totalSize)} totalt. Maxgränsen är 10 MB.`;
    setFileError(input, message);
    input.setCustomValidity(message);
    return false;
  }

  setFileError(input);
  input.setCustomValidity('');
  return true;
}

function setupContactFormValidation(form) {
  const fileInputs = form.querySelectorAll('[data-file-input]');

  fileInputs.forEach((input) => {
    input.addEventListener('change', () => {
      validateFileInput(input);
    });
  });
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const result = String(reader.result || '');
      resolve(result.includes(',') ? result.split(',').pop() : result);
    });
    reader.addEventListener('error', () => reject(reader.error || new Error('Kunde inte läsa filen.')));
    reader.readAsDataURL(file);
  });
}

async function getAttachments(form) {
  const input = form.querySelector('[data-file-input]');
  const files = Array.from(input?.files || []);

  return Promise.all(files.map(async (file) => ({
    filename: file.name,
    content: await readFileAsBase64(file),
    content_type: file.type || 'application/octet-stream',
  })));
}

function setSubmitError(form, message) {
  const submitError = form.querySelector('#form-submit-error');
  if (!submitError) return;
  submitError.textContent = message || '';
  submitError.hidden = !message;
}

function getFormPayload(form) {
  return {
    name: form.elements.name?.value?.trim() || '',
    email: form.elements.email?.value?.trim() || '',
    phone: form.elements.phone?.value?.trim() || '',
    city: form.elements.city?.value?.trim() || '',
    company: form.elements.company?.value?.trim() || '',
    service: form.elements.service?.value?.trim() || '',
    message: form.elements.message?.value?.trim() || '',
    quiz_result: form.elements.quiz_result?.value?.trim() || '',
    quiz_recommendation: form.elements.quiz_recommendation?.value?.trim() || '',
    website: form.elements.website?.value?.trim() || '',
  };
}

function setupContactApiSubmit(form) {
  const submitButton = form.querySelector('button[type="submit"]');
  const originalSubmitText = submitButton?.innerHTML || '';

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setSubmitError(form, '');

    const fileInputs = form.querySelectorAll('[data-file-input]');
    const filesAreValid = Array.from(fileInputs).every(validateFileInput);

    if (!filesAreValid || !form.checkValidity()) {
      setSubmitError(
        form,
        !filesAreValid
          ? 'Kontrollera bilduppladdningen. Endast JPG, PNG eller WebP och max 10 MB totalt.'
          : 'Fyll i alla obligatoriska fält innan du skickar förfrågan.'
      );
      form.reportValidity();
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.setAttribute('aria-busy', 'true');
      submitButton.innerHTML = 'Skickar...';
    }

    try {
      const payload = getFormPayload(form);
      payload.attachments = await getAttachments(form);

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Meddelandet kunde inte skickas.');
      }

      window.location.href = '/tack/';
    } catch (error) {
      console.error(error);
      if (error.message && error.message !== 'Email service is not configured') {
        setSubmitError(form, error.message);
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.removeAttribute('aria-busy');
          submitButton.innerHTML = originalSubmitText;
        }
        return;
      }
      setSubmitError(form, error.message === 'Email service is not configured'
        ? 'Mailtjänsten är inte konfigurerad ännu. Lägg till RESEND_API_KEY i Vercel.'
        : 'Meddelandet kunde inte skickas just nu. Prova igen eller maila albin@plasmamedia.se.'
      );
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.removeAttribute('aria-busy');
        submitButton.innerHTML = originalSubmitText;
      }
    }
  });
}

document.querySelectorAll('.js-contact-api-form').forEach((form) => {
  setupContactFormValidation(form);
  setupContactApiSubmit(form);
});

const contactForm = document.getElementById('contact-form');
const contactQuizQuestion = document.getElementById('contact-quiz-question');
const contactQuizOptions = document.getElementById('contact-quiz-options');
const contactQuizProgress = document.getElementById('contact-quiz-progress');
const contactQuizResult = document.getElementById('contact-quiz-result');

function applyCartRequestToContactForm() {
  if (!contactForm) return;

  const params = new URLSearchParams(window.location.search);
  if (!params.has('cart')) return;

  let cartRequest = null;

  try {
    const savedRequest = sessionStorage.getItem('plasma_cart_request');
    if (savedRequest) cartRequest = JSON.parse(savedRequest);
  } catch (error) {
    console.warn('Kunde inte läsa sparad kundkorg.', error);
  }

  const service = cartRequest?.service || params.get('service') || '';
  const message = cartRequest?.message || params.get('message') || '';
  const serviceField = contactForm.elements.service;
  const messageField = contactForm.elements.message;

  if (serviceField && service) {
    const hasOption = Array.from(serviceField.options || []).some((option) => option.value === service);
    serviceField.value = hasOption ? service : 'paket';
  }

  if (messageField && message) {
    const current = messageField.value.trim();
    messageField.value = current ? `${message}\n\n${current}` : message;
    messageField.dispatchEvent(new Event('input', { bubbles: true }));
  }

  const heading = document.querySelector('.contact-form-head p');
  if (heading && cartRequest?.items?.length) {
    heading.textContent = 'Vi har lagt in dina val från prissidan i meddelandet. Fyll i kontaktuppgifterna så skickar du förfrågan.';
  }

  requestAnimationFrame(() => {
    contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  try {
    sessionStorage.removeItem('plasma_cart_request');
  } catch (error) {
    console.warn('Kunde inte rensa sparad kundkorg.', error);
  }
}

applyCartRequestToContactForm();

function applyHomeQuizRequestToContactForm() {
  if (!contactForm) return;

  const params = new URLSearchParams(window.location.search);
  if (!params.has('homequiz')) return;

  let quizRequest = null;
  try {
    const savedRequest = sessionStorage.getItem('plasma_home_quiz');
    if (savedRequest) quizRequest = JSON.parse(savedRequest);
  } catch (error) {
    console.warn('Kunde inte läsa sparad behovsanalys.', error);
  }

  if (!quizRequest?.recommendation) return;

  const recommendation = quizRequest.recommendation;
  const serviceField = contactForm.elements.service;
  const messageField = contactForm.elements.message;
  const quizResultField = contactForm.elements.quiz_result;
  const quizRecommendationField = contactForm.elements.quiz_recommendation;
  const contactData = quizRequest.contact || {};
  const answers = quizRequest.answers || {};
  const readable = [
    `Situation: ${answers.situation?.label || quizRequest.problem}`,
    `Identifierat behov: ${answers.need?.label || quizRequest.priority}`,
    `Viktigaste målsättning: ${answers.goal?.label || quizRequest.timeline}`,
    `Rekommenderad tjänst: ${recommendation.title}`,
  ].join('\n');

  if (serviceField) serviceField.value = recommendation.service || 'hemsida';
  if (contactForm.elements.name && contactData.name) contactForm.elements.name.value = contactData.name;
  if (contactForm.elements.company && contactData.company) contactForm.elements.company.value = contactData.company;
  if (contactForm.elements.email && contactData.email) contactForm.elements.email.value = contactData.email;
  if (contactForm.elements.phone && contactData.phone) contactForm.elements.phone.value = contactData.phone;
  if (quizResultField) quizResultField.value = readable;
  if (quizRecommendationField) quizRecommendationField.value = `${recommendation.title}\n${recommendation.text}`;
  if (messageField) {
    messageField.value = [
      'Behovsanalys från startsidan:',
      '',
      readable,
      '',
      recommendation.text,
      recommendation.reason || '',
      contactData.url ? `Företagets webbadress: ${contactData.url}` : '',
      contactData.message ? `Besökarens meddelande: ${contactData.message}` : '',
      '',
      'Jag vill gärna få hjälp med nästa steg.',
    ].filter(Boolean).join('\n');
    messageField.dispatchEvent(new Event('input', { bubbles: true }));
  }

  const heading = document.querySelector('.form-header p');
  if (heading) heading.textContent = 'Din rekommendation från startsidan är infogad. Fyll i kontaktuppgifterna så återkommer vi med nästa steg.';

  try {
    sessionStorage.removeItem('plasma_home_quiz');
  } catch (error) {
    console.warn('Kunde inte rensa sparad behovsanalys.', error);
  }
}

applyHomeQuizRequestToContactForm();

const contactQuizQuestions = [
  {
    question: 'Vad behöver du mest hjälp med just nu?',
    options: [
      { label: 'Vi behöver en bättre hemsida', service: 'hemsida', score: 0 },
      { label: 'Vi vill synas bättre på Google', service: 'seo', score: 1 },
      { label: 'Vi behöver fler leads snabbt', service: 'google-ads', score: 2 },
      { label: 'Vi vet inte riktigt ännu', service: 'paket', score: 3 },
    ],
  },
  {
    question: 'Hur får ni de flesta nya kunder idag?',
    options: [
      { label: 'Främst rekommendationer', score: 0 },
      { label: 'Lite från Google och lite rekommendationer', score: 1 },
      { label: 'Google fungerar redan okej', score: 2 },
      { label: 'Vi vet inte exakt', score: 3 },
    ],
  },
  {
    question: 'Hur snabbt vill du se effekt?',
    options: [
      { label: 'Så snabbt som möjligt', score: 2 },
      { label: 'Inom några månader', score: 1 },
      { label: 'Långsiktig tillväxt är viktigast', score: 0 },
      { label: 'Jag vill först förstå vad som är bäst', score: 3 },
    ],
  },
];

let contactQuizStep = 0;
let contactQuizAnswers = [];

function getContactField(name) {
  return contactForm?.elements[name] || null;
}

function getQuizRecommendation() {
  const firstService = contactQuizAnswers.find((answer) => answer.service)?.service || 'paket';
  const scores = contactQuizAnswers.map((answer) => answer.score);
  const urgency = scores.filter((score) => score === 2).length;
  const unsure = scores.filter((score) => score === 3).length;
  const wantsAds = firstService === 'google-ads';
  const adsIsClearlyNeeded = wantsAds && urgency >= 2;

  if (firstService === 'hemsida') {
    return {
      service: 'hemsida',
      title: 'Rekommendation: börja med en konverterande hemsida',
      text: 'Det låter som att hemsidan bör vara första steget. En tydligare struktur, bättre budskap och enklare kontaktvägar gör både SEO och annonser mer effektiva efteråt.',
      cta: 'Skicka formuläret så återkommer vi med vad en ny hemsida bör innehålla.',
    };
  }

  if (firstService === 'seo' || (!adsIsClearlyNeeded && wantsAds)) {
    return {
      service: 'seo',
      title: 'Rekommendation: prioritera SEO och lokal synlighet',
      text: wantsAds
        ? 'Även om du vill få fler leads snabbt är SEO ofta den smartaste grunden först. Vi hade börjat med tydliga tjänstesidor, lokal synlighet och sökord som kan skapa återkommande förfrågningar. Google Ads kan läggas på senare om det behövs extra fart.'
        : 'Det låter som att ni behöver stärka den långsiktiga synligheten i Google. Vi hade börjat med sökordsbild, teknisk grund och sidor som matchar kundernas sökningar.',
      cta: 'Skicka formuläret så kan vi föreslå de viktigaste SEO-stegen.',
    };
  }

  if (adsIsClearlyNeeded) {
    return {
      service: 'google-ads',
      title: 'Rekommendation: Google Ads som komplement till SEO eller hemsida',
      text: 'Här pekar svaren på att snabb lead-generering kan vara nödvändig. Vi hade ändå kopplat annonserna till en tydlig landningssida och sett till att SEO-grunden finns, så ni inte bara blir beroende av betalda klick.',
      cta: 'Skicka formuläret så tittar vi på om annonser behövs direkt eller som nästa steg.',
    };
  }

  if (unsure >= 2) {
    return {
      service: 'hemsida',
      title: 'Rekommendation: börja med hemsida och tydlig prioritering',
      text: 'När det är oklart vilken kanal som är bäst är hemsidan oftast tryggast att börja med. Den blir navet för SEO, förtroende och framtida kampanjer. Därefter kan vi prioritera SEO eller annonser utifrån data.',
      cta: 'Skicka formuläret så återkommer vi med en tydlig startpunkt.',
    };
  }

  return {
    service: urgency >= 1 ? 'seo' : 'hemsida',
    title: urgency >= 1 ? 'Rekommendation: stärk SEO-grunden först' : 'Rekommendation: börja med hemsidan som grund',
    text: urgency >= 1
      ? 'Det verkar finnas potential att få fler kunder genom bättre synlighet i Google. Vi hade prioriterat SEO först: rätt sidor, rätt sökord och en teknisk grund som gör att ni kan växa utan att vara beroende av annonser.'
      : 'Det verkar finnas flera delar som kan förstärka varandra, men hemsidan är den bästa grunden. En tydlig struktur, starka tjänstesidor och bra kontaktvägar gör både SEO och framtida kampanjer mer effektiva.',
    cta: 'Skicka formuläret så föreslår vi en rimlig startnivå.',
  };
}

function saveQuizResult(recommendation) {
  const readableAnswers = contactQuizQuestions.map((question, index) => {
    const answer = contactQuizAnswers[index]?.label || 'Ej besvarad';
    return `${index + 1}. ${question.question} ${answer}`;
  }).join('\n');

  const quizResultField = getContactField('quiz_result');
  const quizRecommendationField = getContactField('quiz_recommendation');
  const serviceField = getContactField('service');
  const messageField = getContactField('message');

  if (quizResultField) quizResultField.value = readableAnswers;
  if (quizRecommendationField) quizRecommendationField.value = `${recommendation.title}\n${recommendation.text}`;
  if (serviceField) serviceField.value = recommendation.service;

  if (messageField) {
    const quizSummary = `Quizresultat:\n${recommendation.title}\n${recommendation.text}\n\nSvar:\n${readableAnswers}\n\nMeddelande:\n`;
    const existingText = messageField.value.includes('Quizresultat:')
      ? messageField.value.split('Meddelande:\n').slice(1).join('Meddelande:\n').trim()
      : messageField.value.trim();

    messageField.value = quizSummary + existingText;
  }
}

function renderContactQuizResult() {
  const recommendation = getQuizRecommendation();
  saveQuizResult(recommendation);

  if (!contactQuizQuestion || !contactQuizOptions || !contactQuizProgress || !contactQuizResult) return;

  contactQuizQuestion.textContent = '';
  contactQuizOptions.innerHTML = '';
  contactQuizProgress.style.width = '100%';
  contactQuizResult.hidden = false;
  contactQuizResult.innerHTML = `
    <strong>${recommendation.title}</strong>
    <p>${recommendation.text}</p>
    <span>${recommendation.cta}</span>
    <button type="button" class="contact-quiz-restart" id="contact-quiz-restart">Gör om</button>
  `;
  document.getElementById('contact-quiz-restart')?.addEventListener('click', () => {
    contactQuizStep = 0;
    contactQuizAnswers = [];
    const quizResultField = getContactField('quiz_result');
    const quizRecommendationField = getContactField('quiz_recommendation');
    if (quizResultField) quizResultField.value = '';
    if (quizRecommendationField) quizRecommendationField.value = '';
    contactQuizResult.hidden = true;
    renderContactQuiz();
  });
}

function renderContactQuiz() {
  if (!contactForm || !contactQuizQuestion || !contactQuizOptions || !contactQuizProgress) return;

  const current = contactQuizQuestions[contactQuizStep];
  contactQuizQuestion.textContent = current.question;
  contactQuizOptions.innerHTML = '';
  contactQuizProgress.style.width = `${Math.round((contactQuizStep / contactQuizQuestions.length) * 100)}%`;

  current.options.forEach((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'contact-quiz-option';
    button.textContent = option.label;
    button.addEventListener('click', () => {
      contactQuizAnswers[contactQuizStep] = option;
      contactQuizStep += 1;
      if (contactQuizStep >= contactQuizQuestions.length) {
        renderContactQuizResult();
      } else {
        renderContactQuiz();
      }
    });
    contactQuizOptions.appendChild(button);
  });
}

renderContactQuiz();
