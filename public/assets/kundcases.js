function filterCases(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const featured = document.querySelector('.case-featured');
  const cards = document.querySelectorAll('.case-card');
  const dividers = document.querySelectorAll('.section-divider');

  if (cat === 'alla') {
    featured.style.display = '';
    cards.forEach(c => { c.style.display = ''; });
    dividers.forEach(d => { d.style.display = ''; });
  } else {
    const featCats = featured.dataset.cat || '';
    featured.style.display = featCats.includes(cat) ? '' : 'none';
    cards.forEach(c => {
      const cats = c.dataset.cat || '';
      c.style.display = cats.includes(cat) ? '' : 'none';
    });
    dividers.forEach(d => { d.style.display = 'none'; });
  }
}
