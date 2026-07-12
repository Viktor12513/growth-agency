document.addEventListener('click', function(event) {
  const question = event.target.closest('.faq-question');
  if (!question) return;
  const answer = document.getElementById(question.getAttribute('aria-controls'));
  const open = question.getAttribute('aria-expanded') === 'true';
  question.setAttribute('aria-expanded', String(!open));
  question.querySelector('span:last-child').textContent = open ? '+' : '−';
  if (answer) answer.hidden = open;
});

const search = document.getElementById('faqSearch');
const tabs = document.querySelectorAll('.faq-tab');
const cards = document.querySelectorAll('.faq-card');
const count = document.getElementById('faqCount');
let activeCat = 'all';
function updateFaqFilter(){
  const query = (search?.value || '').trim().toLowerCase();
  let visible = 0;
  cards.forEach((card) => {
    const catOk = activeCat === 'all' || card.dataset.cat === activeCat;
    const searchOk = !query || card.dataset.search.includes(query);
    const show = catOk && searchOk;
    card.classList.toggle('is-hidden', !show);
    if (show) visible += 1;
  });
  if (count) count.textContent = 'Visar ' + visible + ' frågor';
}
search?.addEventListener('input', updateFaqFilter);
tabs.forEach((tab) => tab.addEventListener('click', () => {
  tabs.forEach((item) => item.classList.remove('active'));
  tab.classList.add('active');
  activeCat = tab.dataset.cat || 'all';
  updateFaqFilter();
}));
