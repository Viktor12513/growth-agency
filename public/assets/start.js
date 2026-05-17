const needsData = {
  seo: {
    tag: 'SEO – Sökmotoroptimering',
    title: 'Vi hjälper dig toppa Google – utan att du behöver förstå det tekniska',
    body: 'Vi analyserar vad dina kunder söker efter och optimerar din hemsida så att du syns när det faktiskt gäller. Resultaten håller i sig och växer med tiden.',
    link: '/seo', linkText: 'Läs om vår SEO-tjänst →'
  },
  hemsida: {
    tag: 'Hemsida',
    title: 'En hemsida som jobbar för dig – dygnet runt',
    body: 'Vi designar och bygger din hemsida från grunden. Snabb, mobilanpassad och byggd för att omvandla besökare till kunder. Du godkänner varje steg.',
    link: '/hemsida', linkText: 'Läs om våra hemsidor →'
  },
  ads: {
    tag: 'Google Ads & Annonsering',
    title: 'Syns direkt – betala bara när någon klickar',
    body: 'Med Google Ads når du kunder som aktivt letar efter det du säljer. Vi skapar, optimerar och följer upp dina kampanjer så att varje krona jobbar hårt.',
    link: '/google-ads', linkText: 'Läs om Google Ads →'
  },
  sociala: {
    tag: 'Sociala medier',
    title: 'Vi sköter dina sociala medier – du fokuserar på jobbet',
    body: 'Från innehållsstrategi till daglig publicering och betald annonsering på Instagram, Facebook och LinkedIn. Vi bygger ditt varumärke där dina kunder hänger.',
    link: '/sociala-medier', linkText: 'Läs om sociala medier →'
  },
  allt: {
    tag: 'Komplett digitalt paket',
    title: 'Hela din digitala marknadsföring – ett enda samarbete',
    body: 'Hemsida, SEO, Google Ads och sociala medier samordnat under ett tak. Du får en dedikerad kontaktperson och slipper hålla koll på flera leverantörer.',
    link: '/kontakt', linkText: 'Se vad som ingår →'
  },
  'vet-ej': {
    tag: 'Gratis genomgång',
    title: 'Boka ett kort samtal – vi berättar vad som passar just dig',
    body: 'Ingen säljer in dig på något. Vi ställer några frågor om ditt företag och ger en ärlig bild av vad som skulle göra störst skillnad för dig just nu.',
    link: '/kontakt', linkText: 'Läs om vad vi går igenom →'
  }
};

function selectNeed(btn) {
  document.querySelectorAll('.need-btn').forEach((button) => {
    button.classList.remove('active');
  });

  btn.classList.add('active');

  const selectedNeed = needsData[btn.dataset.need];
  document.getElementById('resultTag').textContent = selectedNeed.tag;
  document.getElementById('resultTitle').textContent = selectedNeed.title;
  document.getElementById('resultBody').textContent = selectedNeed.body;
  document.getElementById('resultLink').textContent = selectedNeed.linkText;
  document.getElementById('resultLink').href = selectedNeed.link;

  const result = document.getElementById('needsResult');
  result.classList.remove('visible');
  void result.offsetWidth;
  result.classList.add('visible');
}

document.querySelectorAll('.need-btn').forEach((button) => {
  button.addEventListener('click', () => selectNeed(button));
});
