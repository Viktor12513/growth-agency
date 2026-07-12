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

const caseDetails = [
  {
    summary: 'Vi b&ouml;rjade med att bygga om strukturen p&aring; hemsidan s&aring; att varje viktig tj&auml;nst och stadsdel fick en tydlig landningssida. D&auml;refter kopplade vi Google Ads till de mest akuta s&ouml;kningarna och f&ouml;ljde upp vilka s&ouml;kord som faktiskt skapade samtal.',
    points: ['Tydliga tj&auml;nstesidor f&ouml;r VVS, r&ouml;rstopp och jour&auml;renden', 'Lokal SEO mot prioriterade stadsdelar i Stockholm', 'Google Ads-kampanjer med fokus p&aring; akuta leads']
  },
  {
    summary: 'Arborist Roslagen beh&ouml;vde en sida som k&auml;ndes seri&ouml;s direkt och gjorde det enkelt f&ouml;r lokala kunder att f&ouml;rst&aring; tj&auml;nsterna. Vi tog fram en ren struktur, tydliga tj&auml;nstesektioner och kontaktv&auml;gar som fungerar bra p&aring; mobil.',
    points: ['Tydlig hemsida f&ouml;r tr&auml;df&auml;llning, besk&auml;rning och tr&auml;dv&aring;rd', 'Lokal SEO-grund f&ouml;r Roslagen och n&auml;rliggande orter', 'F&ouml;rtroendeskapande design med enkel v&auml;g till offertf&ouml;rfr&aringgan']
  },
  {
    summary: 'Kliniken beh&ouml;vde en enklare v&auml;g fr&aring;n s&ouml;kning till bokning. Vi byggde en snabbare hemsida, gjorde bokningen synlig p&aring; varje viktig sida och skapade annonser f&ouml;r b&aring;de planerade behandlingar och akuta bes&ouml;k.',
    points: ['Ny mobilanpassad hemsida med tydlig bokningsv&auml;g', 'Annonser f&ouml;r tandl&auml;kare, akut tandv&aring;rd och unders&ouml;kningar', 'M&auml;tning av bokningar, samtal och formul&auml;r']
  },
  {
    summary: 'Restaurangen hade stark produkt men svag synlighet. Vi optimerade Google-profilen, byggde upp lokala s&ouml;kord och skapade ett inneh&aring;llsuppl&auml;gg f&ouml;r Instagram som visade milj&ouml;, meny och fullbokade kv&auml;llar.',
    points: ['Google Business Profile med menyer, bilder och recensioner', 'Lokala landningssidor och tydligare restaurangtexter', 'Instagram-plan med &aring;terkommande teman och kampanjer']
  },
  {
    summary: 'E-handeln beh&ouml;vde mer l&ouml;nsam trafik, inte bara fler klick. Vi strukturerade om Shopping-kampanjerna, prioriterade produkter med stark marginal och byggde SEO-inneh&aring;ll runt kategorier som redan hade k&ouml;pintention.',
    points: ['Ny kampanjstruktur f&ouml;r Google Shopping', 'SEO-optimerade kategori- och produktsidor', 'Remarketing mot bes&ouml;kare som tittat p&aring; produkter men inte k&ouml;pt']
  },
  {
    summary: 'Byggf&ouml;retaget hade mycket bevis, men det syntes inte digitalt. Vi byggde ett projektgalleri, lyfte kundomd&ouml;men och skapade tj&auml;nstesidor som gjorde det enkelt att f&ouml;rst&aring; vad de g&ouml;r och beg&auml;ra offert.',
    points: ['Projektgalleri med f&ouml;re- och efterbilder', 'Lokala SEO-sidor f&ouml;r Uppsala och n&auml;romr&aring;den', 'Tydliga offertknappar och kortare kontaktv&auml;g']
  },
  {
    summary: 'Wellness-verksamheten beh&ouml;vde fler nya kunder och b&auml;ttre &aring;terbokning. Vi kombinerade innehåll med en ny bokningssida och enklare automatisering s&aring; att fler kunder kom tillbaka efter f&ouml;rsta bes&ouml;ket.',
    points: ['Instagram-inneh&aring;ll f&ouml;r behandlingar, resultat och f&ouml;rtroende', 'Ny bokningssida med mobilfokus', 'E-postfl&ouml;de f&ouml;r &aring;terbokning och kundrelation']
  },
  {
    summary: 'Redovisningsbyr&aring;n ville minska beroendet av rekommendationer. Vi tog fram guider f&ouml;r fr&aring;gor som f&ouml;retagare s&ouml;ker p&aring;, optimerade tj&auml;nstesidorna och byggde en tydligare v&auml;g fr&aring;n kunskap till kontakt.',
    points: ['Djupa guider om moms, bokslut och l&ouml;nehantering', 'SEO-struktur f&ouml;r redovisning och r&aring;dgivning', 'Kontaktv&auml;gar anpassade f&ouml;r B2B-leads']
  }
];

function createCaseDetails(detail, index) {
  return '<button class="case-card-link case-read-more" type="button" aria-expanded="false" aria-controls="case-more-' + index + '">' +
    'L&auml;s mer ' +
    '<svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' +
  '</button>' +
  '<div class="case-more" id="case-more-' + index + '" hidden>' +
    '<p>' + detail.summary + '</p>' +
    '<ul>' + detail.points.map(point => '<li>' + point + '</li>').join('') + '</ul>' +
  '</div>';
}

function setupCaseReadMore() {
  const cases = document.querySelectorAll('.case-featured, .case-card');

  cases.forEach((caseElement, index) => {
    if (caseElement.querySelector('.case-read-more')) return;

    const detail = caseDetails[index];
    const target = caseElement.querySelector('.case-quote, .case-services');
    if (!detail || !target) return;

    target.insertAdjacentHTML('afterend', createCaseDetails(detail, index));
  });

  document.querySelectorAll('.case-read-more').forEach((button) => {
    button.addEventListener('click', () => {
      const panel = document.getElementById(button.getAttribute('aria-controls'));
      const isOpen = button.getAttribute('aria-expanded') === 'true';

      button.setAttribute('aria-expanded', String(!isOpen));
      button.classList.toggle('is-open', !isOpen);
      button.innerHTML = (isOpen ? 'L&auml;s mer ' : 'Visa mindre ') +
        '<svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
      panel.hidden = isOpen;
    });
  });
}

setupCaseReadMore();
