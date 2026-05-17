function filterPosts(category, button) {
  document.querySelectorAll('.filter-btn').forEach((filterButton) => {
    filterButton.classList.remove('active');
  });

  button.classList.add('active');

  const featuredPost = document.querySelector('.post-featured');
  const postCards = document.querySelectorAll('.post-card');
  const showAllPosts = category === 'alla';

  featuredPost?.classList.toggle('is-filtered', !showAllPosts && featuredPost.dataset.cat !== category);

  postCards.forEach((card) => {
    card.classList.toggle('is-filtered', !showAllPosts && card.dataset.cat !== category);
  });
}

function handleNewsletter(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const button = form.querySelector('button');
  const input = form.querySelector('input');

  button.textContent = '? Tack!';
  button.classList.add('is-success');
  input.value = '';
}

document.querySelectorAll('.filter-btn').forEach((button) => {
  button.addEventListener('click', () => filterPosts(button.dataset.filter, button));
});

document.getElementById('newsletterForm')?.addEventListener('submit', handleNewsletter);
