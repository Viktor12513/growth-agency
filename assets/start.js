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

// Homepage needs analysis
const homeQuizForm = document.getElementById('home-quiz-form');
const homeQuizQuestions = Array.from(document.querySelectorAll('[data-question-step]'));
const homeQuizProgress = Array.from(document.querySelectorAll('[data-progress-step]'));
const homeQuizQuestionCount = document.getElementById('home-quiz-question-count');
const homeQuizQ2Title = document.getElementById('home-quiz-q2-title');
const homeQuizQ3Title = document.getElementById('home-quiz-q3-title');
const homeQuizQ2Options = document.getElementById('home-quiz-q2-options');
const homeQuizQ3Options = document.getElementById('home-quiz-q3-options');
const homeQuizError = document.getElementById('home-quiz-error');
const homeQuizPrevious = document.getElementById('home-quiz-prev');
const homeQuizNext = document.getElementById('home-quiz-next');
const homeQuizNavigation = document.getElementById('home-quiz-navigation');
const homeQuizResult = document.getElementById('home-quiz-result');
const homeQuizResultTitle = document.getElementById('home-quiz-result-title');
const homeQuizResultText = document.getElementById('home-quiz-result-text');
const homeQuizResultReason = document.getElementById('home-quiz-result-reason');
const homeQuizResultSteps = document.getElementById('home-quiz-result-steps');
const homeQuizResultNext = document.getElementById('home-quiz-result-next');
const homeQuizSummary = [null, document.getElementById('home-quiz-summary-1'), document.getElementById('home-quiz-summary-2'), document.getElementById('home-quiz-summary-3')];
const homeQuizBook = document.getElementById('home-quiz-book');
const homeQuizSend = document.getElementById('home-quiz-send');
const homeQuizContactError = document.getElementById('home-quiz-contact-error');

const homeQuizBranches = {
  'new-site': {
    question: 'Vad är viktigast med den nya hemsidan?',
    options: [
      ['new-professional', 'Presentera företaget professionellt', 'Skapa ett tryggt och trovärdigt första intryck'],
      ['new-leads', 'Generera fler samtal och förfrågningar', 'Göra vägen till kontakt tydlig och enkel'],
      ['new-services', 'Sälja eller visa tydliga tjänster', 'Hjälpa besökaren förstå och välja rätt erbjudande'],
      ['new-seo', 'Bygga en grund för framtida SEO', 'Planera struktur och innehåll för organisk synlighet'],
    ],
  },
  redesign: {
    question: 'Vad fungerar sämst på den nuvarande hemsidan?',
    options: [
      ['redesign-design', 'Designen känns gammal eller opersonlig', 'Företaget får inte det intryck ni vill förmedla'],
      ['redesign-tech', 'Sidan är långsam eller fungerar dåligt på mobil', 'Tekniken skapar friktion för besökaren'],
      ['redesign-message', 'Besökarna förstår inte erbjudandet', 'Budskap och struktur behöver bli tydligare'],
      ['redesign-leads', 'Hemsidan genererar för få förfrågningar', 'Trafiken blir inte till önskade affärskontakter'],
    ],
  },
  seo: {
    question: 'Vilken typ av synlighet behöver ni främst?',
    options: [
      ['seo-local', 'Synas lokalt i en eller flera städer', 'Nå kunder nära företaget eller i prioriterade orter'],
      ['seo-national', 'Synas nationellt i hela Sverige', 'Konkurrera om kunder på en bredare marknad'],
      ['seo-services', 'Synas på specifika tjänster eller produkter', 'Bygga landningssidor kring tydlig efterfrågan'],
      ['seo-competition', 'Konkurrera med företag som redan rankar högre', 'Arbeta systematiskt med teknik, innehåll och auktoritet'],
    ],
  },
  combined: {
    question: 'Vilken utgångspunkt har företaget idag?',
    options: [
      ['combined-none', 'Vi saknar hemsida helt', 'Både webbplats och synlighet behöver byggas från grunden'],
      ['combined-replace', 'Vi har en hemsida som behöver ersättas', 'En ny struktur kan planeras för både kunder och Google'],
      ['combined-low-visibility', 'Vi har en okej hemsida men nästan ingen synlighet', 'Webbplatsen behöver utvecklas med en tydligare SEO-grund'],
      ['combined-long', 'Vi vill bygga en långsiktig digital satsning', 'Skapa en lösning som kan växa med verksamheten'],
    ],
  },
  conversion: {
    question: 'Var verkar besökarna falla bort?',
    options: [
      ['conversion-offer', 'Erbjudandet är inte tillräckligt tydligt', 'Besökaren förstår inte snabbt vad ni erbjuder'],
      ['conversion-contact', 'Det är svårt att kontakta eller boka', 'Vägen till nästa steg innehåller onödig friktion'],
      ['conversion-trust', 'Sidan saknar förtroendeskapande innehåll', 'Kundcase, bevis och tydlighet behöver stärkas'],
      ['conversion-unknown', 'Vi vet inte var problemet ligger', 'Beteende och kontaktvägar behöver analyseras först'],
    ],
  },
  unsure: {
    question: 'Vilket affärsproblem vill ni främst lösa?',
    options: [
      ['unsure-awareness', 'För få personer känner till företaget', 'Ni behöver öka relevant digital synlighet'],
      ['unsure-leads', 'Vi får för få relevanta förfrågningar', 'Fler rätt personer behöver hitta och välja er'],
      ['unsure-brand', 'Företaget upplevs inte tillräckligt professionellt', 'Den digitala närvaron speglar inte verksamheten'],
      ['unsure-competition', 'Konkurrenterna syns mer än vi gör', 'Ni behöver en tydligare position och plan för synlighet'],
    ],
  },
};

const homeQuizGoalSets = {
  geography: {
    question: 'Vilka geografiska områden vill ni framför allt synas i?',
    options: [
      ['goal-one-city', 'En prioriterad ort', 'Fokusera insatsen kring företagets viktigaste lokala marknad'],
      ['goal-cities', 'Flera närliggande kommuner', 'Bygga relevant synlighet i ett sammanhängande område'],
      ['goal-county', 'Ett helt län', 'Skapa en skalbar struktur för ett större geografiskt område'],
      ['goal-regions', 'Flera regioner i Sverige', 'Planera en bredare lokal strategi som kan växa över tid'],
    ],
  },
  perception: {
    question: 'Hur vill ni att företaget ska uppfattas?',
    options: [
      ['goal-trust', 'Professionellt och trovärdigt', 'Skapa ett tryggt första intryck för nya kunder'],
      ['goal-modern', 'Modernt och etablerat', 'Visa att företaget är relevant och välorganiserat'],
      ['goal-clear', 'Tydligt och lätt att förstå', 'Göra erbjudandet enkelt att ta till sig'],
      ['goal-specialist', 'Som det självklara specialistvalet', 'Lyfta kompetens, bevis och tydliga styrkor'],
    ],
  },
  inquiries: {
    question: 'Vilken typ av förfrågningar vill ni få fler av?',
    options: [
      ['goal-calls', 'Fler telefonsamtal och offertförfrågningar', 'Göra nästa steg snabbt och naturligt'],
      ['goal-bookings', 'Fler bokningar eller mötesförfrågningar', 'Leda rätt besökare till en konkret handling'],
      ['goal-services', 'Förfrågningar om prioriterade tjänster', 'Styra efterfrågan mot rätt delar av erbjudandet'],
      ['goal-quality', 'Färre men mer relevanta förfrågningar', 'Tydliggöra vem tjänsten passar bäst för'],
    ],
  },
  growth: {
    question: 'Vilket resultat är viktigast för er?',
    options: [
      ['goal-leads', 'Fler relevanta förfrågningar', 'Nå personer som faktiskt behöver era tjänster'],
      ['goal-visibility', 'Bättre synlighet på Google', 'Bli lättare att hitta vid relevanta sökningar'],
      ['goal-sales-site', 'En webbplats som tydligare säljer tjänsterna', 'Förklara värdet och göra valet enklare'],
      ['goal-long-term', 'En långsiktig lösning som kan utvecklas', 'Bygga en stabil grund i rätt ordning'],
    ],
  },
  timing: {
    question: 'Hur snabbt vill ni komma igång med satsningen?',
    options: [
      ['goal-now', 'Så snart planeringen är klar', 'Prioritera en tydlig första etapp utan att tumma på grunden'],
      ['goal-quarter', 'Inom de närmaste tre månaderna', 'Ge tid för analys, innehåll och en genomtänkt lansering'],
      ['goal-year', 'Stegvis under kommande år', 'Bygga ut webbplats och synlighet i prioriterad ordning'],
      ['goal-plan', 'Vi behöver först en realistisk plan', 'Få hjälp att avgränsa omfattning och nästa steg'],
    ],
  },
};

const homeQuizRecommendations = {
  'new-site': {
    service: 'hemsida', title: 'Ny konverteringsfokuserad företagshemsida',
    text: 'En ny, konverteringsfokuserad företagshemsida verkar vara rätt första steg.',
    reason: 'Lösningen bör ge företaget en tydlig digital grund som förklarar erbjudandet, skapar förtroende och gör det enkelt att ta kontakt.',
    priorities: ['Tydligt erbjudande och logisk sidstruktur', 'Förtroendeskapande och mobilanpassad design', 'Enkla kontaktvägar samt teknisk SEO-grund'],
    next: 'Samla era viktigaste tjänster, målgrupper och befintliga underlag inför en gemensam genomgång.',
  },
  redesign: {
    service: 'hemsida', title: 'Omdesign av befintlig hemsida',
    text: 'Er nuvarande hemsida har en grund att bygga vidare på, men behöver moderniseras och göras tydligare.',
    reason: 'Struktur, budskap, design och konverteringspunkter bör ses över innan mer trafik eller nya kampanjer prioriteras.',
    priorities: ['Kartlägg vad som fungerar och vad som skapar friktion', 'Förtydliga budskap, tjänster och visuellt uttryck', 'Förbättra mobilupplevelse och vägar till kontakt'],
    next: 'Genomför en nulägesanalys av webbplatsens viktigaste sidor och kontaktflöden.',
  },
  'local-seo': {
    service: 'seo', title: 'Lokal SEO i prioriterade områden',
    text: 'Lokal SEO verkar vara den mest relevanta vägen till fler kunder i era prioriterade områden.',
    reason: 'Arbetet kan omfatta tjänstesidor, relevanta ortssidor, Google Business Profile, teknisk SEO och innehåll anpassat efter lokala sökningar.',
    priorities: ['Kartlägg tjänster, orter och lokala sökbeteenden', 'Förbättra Google Business Profile och webbplatsens lokala signaler', 'Bygg relevanta tjänste- och ortssidor i en hållbar struktur'],
    next: 'Välj vilka tjänster och geografiska områden som är viktigast att börja med.',
  },
  'long-seo': {
    service: 'seo', title: 'Långsiktig SEO-satsning',
    text: 'En långsiktig SEO-satsning kan hjälpa er att nå kunder som aktivt söker efter era tjänster.',
    reason: 'Sökordsanalys, teknisk SEO, innehåll, landningssidor och kontinuerlig uppföljning behöver samverka för att bygga relevant synlighet.',
    priorities: ['Prioritera sökfraser med tydlig affärsrelevans', 'Åtgärda tekniska hinder och utveckla viktiga landningssidor', 'Följ synlighet, relevant trafik och faktiska förfrågningar'],
    next: 'Börja med en avgränsad SEO-analys och en prioriterad åtgärdsplan.',
  },
  combined: {
    service: 'paket', title: 'Hemsida och SEO som en gemensam satsning',
    text: 'En kombination av ny hemsida och SEO ger er den starkaste långsiktiga grunden.',
    reason: 'Webbplatsen bör planeras för både besökaren och Google från början, så att struktur, innehåll och teknik stödjer samma affärsmål.',
    priorities: ['Planera webbplatsens struktur utifrån tjänster och sökbeteenden', 'Skapa tydliga budskap och konverteringsvägar', 'Bygg teknisk SEO och mätning före lansering'],
    next: 'Samla affärsmål, prioriterade tjänster och geografiska marknader i en gemensam workshop.',
  },
  conversion: {
    service: 'hemsida', title: 'Konverteringsanalys av hemsidan',
    text: 'Ni verkar främst behöva förbättra hur befintliga besökare omvandlas till förfrågningar.',
    reason: 'Erbjudande, sidstruktur, förtroendeskapande design och kontaktvägar bör analyseras innan mer trafik köps in eller nya kanaler prioriteras.',
    priorities: ['Identifiera var besökaren tappar förståelse eller förtroende', 'Förtydliga erbjudande, bevis och nästa steg', 'Förenkla kontaktflöden och följ upp faktiska konverteringar'],
    next: 'Granska de viktigaste landningssidorna och välj ett tydligt mätmål för varje sida.',
  },
};

const homeQuizState = { step: 1, situation: null, situationLabel: '', need: null, needLabel: '', goal: null, goalLabel: '', recommendation: null };

function getHomeQuizGoalSet(situation, need) {
  if (situation === 'seo' && need === 'seo-local') return homeQuizGoalSets.geography;
  if (situation === 'conversion') return homeQuizGoalSets.inquiries;
  if (situation === 'combined') return homeQuizGoalSets.timing;
  if (['new-professional', 'redesign-design', 'redesign-message', 'unsure-brand'].includes(need)) return homeQuizGoalSets.perception;
  if (['new-leads', 'redesign-leads', 'conversion-contact', 'unsure-leads'].includes(need)) return homeQuizGoalSets.inquiries;
  return homeQuizGoalSets.growth;
}

function createHomeQuizAnswer(option, index, step) {
  const [value, title, subtitle] = option;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'home-quiz-answer';
  button.dataset.answer = value;
  button.setAttribute('aria-pressed', 'false');
  button.innerHTML = `<span class="home-quiz-answer-number">${String(index + 1).padStart(2, '0')}</span><span><strong>${title}</strong><small>${subtitle}</small></span><span class="home-quiz-answer-arrow" aria-hidden="true">→</span>`;
  button.addEventListener('click', () => selectHomeQuizAnswer(step, value, title, button));
  return button;
}

function selectHomeQuizAnswer(step, value, label, button) {
  const container = button.closest('.home-quiz-answer-grid');
  container?.querySelectorAll('.home-quiz-answer').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
  if (step === 1) {
    homeQuizState.situation = value;
    homeQuizState.situationLabel = label;
    homeQuizState.need = null;
    homeQuizState.needLabel = '';
    homeQuizState.goal = null;
    homeQuizState.goalLabel = '';
  } else if (step === 2) {
    homeQuizState.need = value;
    homeQuizState.needLabel = label;
    homeQuizState.goal = null;
    homeQuizState.goalLabel = '';
  } else {
    homeQuizState.goal = value;
    homeQuizState.goalLabel = label;
  }
  if (homeQuizError) homeQuizError.textContent = '';
  updateHomeQuizSummary();
  updateHomeQuizNavigation();
}

function renderHomeQuizQuestion2() {
  const branch = homeQuizBranches[homeQuizState.situation];
  if (!branch || !homeQuizQ2Title || !homeQuizQ2Options) return;
  homeQuizQ2Title.textContent = branch.question;
  homeQuizQ2Options.replaceChildren(...branch.options.map((option, index) => createHomeQuizAnswer(option, index, 2)));
  if (homeQuizState.need) homeQuizQ2Options.querySelector(`[data-answer="${homeQuizState.need}"]`)?.setAttribute('aria-pressed', 'true');
}

function renderHomeQuizQuestion3() {
  const goalSet = getHomeQuizGoalSet(homeQuizState.situation, homeQuizState.need);
  if (!homeQuizQ3Title || !homeQuizQ3Options) return;
  homeQuizQ3Title.textContent = goalSet.question;
  homeQuizQ3Options.replaceChildren(...goalSet.options.map((option, index) => createHomeQuizAnswer(option, index, 3)));
  if (homeQuizState.goal) homeQuizQ3Options.querySelector(`[data-answer="${homeQuizState.goal}"]`)?.setAttribute('aria-pressed', 'true');
}

function updateHomeQuizSummary() {
  if (homeQuizSummary[1]) homeQuizSummary[1].textContent = homeQuizState.situationLabel || 'Inte valt ännu';
  if (homeQuizSummary[2]) homeQuizSummary[2].textContent = homeQuizState.needLabel || 'Inte valt ännu';
  if (homeQuizSummary[3]) homeQuizSummary[3].textContent = homeQuizState.goalLabel || 'Inte valt ännu';
}

function stepHasHomeQuizAnswer(step) {
  if (step === 1) return Boolean(homeQuizState.situation);
  if (step === 2) return Boolean(homeQuizState.need);
  return Boolean(homeQuizState.goal);
}

function updateHomeQuizNavigation() {
  if (!homeQuizNext) return;
  homeQuizNext.disabled = !stepHasHomeQuizAnswer(homeQuizState.step);
  homeQuizNext.firstChild.textContent = homeQuizState.step === 3 ? 'Visa rekommendationen ' : 'Fortsätt ';
  if (homeQuizPrevious) homeQuizPrevious.hidden = homeQuizState.step === 1;
}

function showHomeQuizStep(step) {
  homeQuizState.step = step;
  homeQuizQuestions.forEach((section) => {
    const active = Number(section.dataset.questionStep) === step;
    section.hidden = !active;
    section.classList.toggle('is-active', active);
  });
  if (homeQuizResult) homeQuizResult.hidden = true;
  if (homeQuizNavigation) homeQuizNavigation.hidden = false;
  homeQuizProgress.forEach((item) => {
    const itemStep = Number(item.dataset.progressStep);
    item.classList.toggle('is-active', itemStep === step);
    item.classList.toggle('is-complete', itemStep < step);
    if (itemStep === step) item.setAttribute('aria-current', 'step');
    else item.removeAttribute('aria-current');
  });
  if (homeQuizQuestionCount) homeQuizQuestionCount.textContent = `Fråga ${step} av 3`;
  if (homeQuizError) homeQuizError.textContent = '';
  updateHomeQuizNavigation();
  homeQuizForm?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function getHomeQuizRecommendationKey() {
  if (homeQuizState.situation === 'combined') return 'combined';
  if (homeQuizState.situation === 'new-site') return homeQuizState.need === 'new-seo' ? 'combined' : 'new-site';
  if (homeQuizState.situation === 'redesign') return 'redesign';
  if (homeQuizState.situation === 'conversion') return 'conversion';
  if (homeQuizState.situation === 'seo') return homeQuizState.need === 'seo-local' ? 'local-seo' : 'long-seo';
  if (homeQuizState.need === 'unsure-brand') return 'redesign';
  if (homeQuizState.need === 'unsure-leads') return 'combined';
  return 'long-seo';
}

function buildHomeQuizPayload(contact = {}) {
  const recommendation = homeQuizState.recommendation;
  return {
    problem: `${homeQuizState.situationLabel}. ${homeQuizState.needLabel}. ${homeQuizState.goalLabel}.`,
    priority: recommendation?.service || 'hemsida',
    timeline: homeQuizState.goalLabel,
    answers: {
      situation: { value: homeQuizState.situation, label: homeQuizState.situationLabel },
      need: { value: homeQuizState.need, label: homeQuizState.needLabel },
      goal: { value: homeQuizState.goal, label: homeQuizState.goalLabel },
    },
    recommendation,
    contact,
    createdAt: new Date().toISOString(),
  };
}

function storeHomeQuizResult(payload) {
  try {
    sessionStorage.setItem('plasma_home_quiz', JSON.stringify(payload));
  } catch (error) {
    console.warn('Kunde inte spara behovsanalysen inför kontaktformuläret.', error);
  }
}

function renderHomeQuizResult() {
  const recommendation = homeQuizRecommendations[getHomeQuizRecommendationKey()];
  homeQuizState.recommendation = { ...recommendation };
  if (homeQuizResultTitle) homeQuizResultTitle.textContent = recommendation.title;
  if (homeQuizResultText) homeQuizResultText.textContent = recommendation.text;
  if (homeQuizResultReason) homeQuizResultReason.textContent = `${recommendation.reason} Era svar visar att ${homeQuizState.needLabel.toLocaleLowerCase('sv-SE')} och att den viktigaste målsättningen är ${homeQuizState.goalLabel.toLocaleLowerCase('sv-SE')}.`;
  if (homeQuizResultSteps) homeQuizResultSteps.replaceChildren(...recommendation.priorities.map((priority) => {
    const item = document.createElement('li');
    item.textContent = priority;
    return item;
  }));
  if (homeQuizResultNext) homeQuizResultNext.textContent = recommendation.next;
  homeQuizQuestions.forEach((section) => { section.hidden = true; section.classList.remove('is-active'); });
  if (homeQuizResult) homeQuizResult.hidden = false;
  if (homeQuizNavigation) homeQuizNavigation.hidden = true;
  homeQuizProgress.forEach((item) => { item.classList.remove('is-active'); item.classList.add('is-complete'); item.removeAttribute('aria-current'); });
  if (homeQuizQuestionCount) homeQuizQuestionCount.textContent = 'Analysen är klar';
  storeHomeQuizResult(buildHomeQuizPayload());
  homeQuizForm?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function resetHomeQuiz() {
  Object.assign(homeQuizState, { step: 1, situation: null, situationLabel: '', need: null, needLabel: '', goal: null, goalLabel: '', recommendation: null });
  document.querySelectorAll('.home-quiz-answer').forEach((button) => button.setAttribute('aria-pressed', 'false'));
  homeQuizQ2Options?.replaceChildren();
  homeQuizQ3Options?.replaceChildren();
  homeQuizForm?.querySelectorAll('.home-quiz-mini-contact input,.home-quiz-mini-contact textarea').forEach((field) => { field.value = ''; });
  if (homeQuizContactError) homeQuizContactError.textContent = '';
  updateHomeQuizSummary();
  showHomeQuizStep(1);
}

function readHomeQuizContact() {
  return {
    name: document.getElementById('home-quiz-contact-name')?.value.trim() || '',
    company: document.getElementById('home-quiz-contact-company')?.value.trim() || '',
    email: document.getElementById('home-quiz-contact-email')?.value.trim() || '',
    phone: document.getElementById('home-quiz-contact-phone')?.value.trim() || '',
    url: document.getElementById('home-quiz-contact-url')?.value.trim() || '',
    message: document.getElementById('home-quiz-contact-message')?.value.trim() || '',
  };
}

function transferHomeQuizToContact(requireDetails) {
  const contact = readHomeQuizContact();
  const emailField = document.getElementById('home-quiz-contact-email');
  if (requireDetails && (!contact.name || !contact.company || !contact.email || !emailField?.checkValidity())) {
    if (homeQuizContactError) homeQuizContactError.textContent = 'Fyll i namn, företag och en giltig e-postadress för att boka genomgången.';
    if (!contact.name) document.getElementById('home-quiz-contact-name')?.focus();
    else if (!contact.company) document.getElementById('home-quiz-contact-company')?.focus();
    else emailField?.focus();
    return;
  }
  storeHomeQuizResult(buildHomeQuizPayload(contact));
  window.location.href = '/kontakt/?homequiz=1#contact-form';
}

document.querySelectorAll('#home-quiz-question-1 .home-quiz-answer').forEach((button) => {
  const title = button.querySelector('strong')?.textContent || '';
  button.addEventListener('click', () => selectHomeQuizAnswer(1, button.dataset.answer, title, button));
});

homeQuizNext?.addEventListener('click', () => {
  if (!stepHasHomeQuizAnswer(homeQuizState.step)) {
    if (homeQuizError) homeQuizError.textContent = 'Välj det alternativ som stämmer bäst för att fortsätta.';
    return;
  }
  if (homeQuizState.step === 1) {
    renderHomeQuizQuestion2();
    showHomeQuizStep(2);
  } else if (homeQuizState.step === 2) {
    renderHomeQuizQuestion3();
    showHomeQuizStep(3);
  } else {
    renderHomeQuizResult();
  }
});

homeQuizPrevious?.addEventListener('click', () => showHomeQuizStep(Math.max(1, homeQuizState.step - 1)));
document.querySelectorAll('[data-quiz-reset]').forEach((button) => button.addEventListener('click', resetHomeQuiz));
homeQuizBook?.addEventListener('click', () => transferHomeQuizToContact(true));
homeQuizSend?.addEventListener('click', (event) => { event.preventDefault(); transferHomeQuizToContact(false); });
homeQuizForm?.addEventListener('submit', (event) => event.preventDefault());
updateHomeQuizSummary();
updateHomeQuizNavigation();
