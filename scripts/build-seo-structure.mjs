import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { blogPosts } from '../src/data/blogPosts.js';

const root = process.cwd();
const site = 'https://www.plasmamedia.se';
const today = '2026-07-12';

const decode = (value = '') => String(value)
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&auml;/g, 'ä')
  .replace(/&aring;/g, 'å')
  .replace(/&ouml;/g, 'ö')
  .replace(/&Auml;/g, 'Ä')
  .replace(/&Aring;/g, 'Å')
  .replace(/&Ouml;/g, 'Ö')
  .replace(/&ndash;/g, '–')
  .replace(/&mdash;/g, '—')
  .replace(/&rsquo;/g, '’')
  .replace(/&quot;/g, '"')
  .replace(/&#039;/g, "'");

const strip = (value = '') => decode(String(value).replace(/<[^>]+>/g, ' '))
  .replace(/\s+/g, ' ')
  .trim();

const esc = (value = '') => strip(value)
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

function slugToInputName(slug) {
  return slug.replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase()).replace(/[^a-zA-Z0-9]/g, '');
}

const months = {
  jan: '01', feb: '02', mar: '03', apr: '04', maj: '05', jun: '06',
  jul: '07', aug: '08', sep: '09', okt: '10', nov: '11', dec: '12',
};

function toIsoDate(date) {
  const [day, month, year] = String(date).trim().split(/\s+/);
  return `${year}-${months[month] || '01'}-${String(day).padStart(2, '0')}`;
}

function head({ title, description, canonical, css = ['/assets/cluster.css'], type = 'website', schema = [] }) {
  return `<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description).slice(0, 180)}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="${type}">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description).slice(0, 180)}">
<meta property="og:image" content="${site}/images/logo.png">
<meta property="og:locale" content="sv_SE">
<meta property="og:site_name" content="Plasma MEDIA AB">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
${css.map((href) => `<link rel="stylesheet" href="${href}">`).join('\n')}
<link rel="stylesheet" href="/assets/footer-areas.css">
<link rel="stylesheet" href="/assets/site-shell.css?v=20260714c">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="alternate icon" type="image/png" href="/favicon.png">
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ML4E8DFP54"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-ML4E8DFP54');</script>
${schema.map((item) => `<script type="application/ld+json">${JSON.stringify(item)}</script>`).join('\n')}
</head>`;
}

function header() {
  return `<body>
<a href="#main-content" class="skip-link">Hoppa till innehållet</a>
<header role="banner">
<nav aria-label="Huvudnavigation">
  <a href="/" class="nav-logo" aria-label="Plasma MEDIA AB – startsida">Plasma<span> MEDIA</span><span class="logo-domain"> AB</span></a>
  <ul class="nav-links">
    <li><a href="/hemsida/">Hemsidor</a></li>
    <li class="nav-dropdown">
      <a href="/seo/" class="nav-dropdown-trigger" aria-haspopup="true">SEO</a>
      <div class="nav-dropdown-menu" aria-label="SEO undermeny">
        <a href="/seo/"><strong>SEO – sökmotoroptimering</strong><span>Huvudsida för organisk synlighet.</span></a>
        <a href="/teknisk-seo/"><strong>Teknisk SEO</strong><span>Indexering, hastighet, crawl och struktur.</span></a>
        <a href="/on-page-seo/"><strong>On-page SEO</strong><span>Rubriker, innehåll, sökintention och internlänkar.</span></a>
        <a href="/off-page-seo/"><strong>Off-page SEO</strong><span>Länkar, auktoritet och digitalt förtroende.</span></a>
        <a href="/ai-seo/"><strong>AI SEO</strong><span>Synlighet i AI-sök och moderna sökresultat.</span></a>
        <a href="/lokal-seo/"><strong>Lokal SEO</strong><span>Google Maps och lokala sökningar.</span></a>
        <a href="/seo-pris/"><strong>SEO-priser</strong><span>Vad SEO kostar och hur nivåerna skiljer sig.</span></a>
      </div>
    </li>
    <li><a href="/google-ads/">Google Ads</a></li>
    <li><a href="/priser/">Priser</a></li>
    <li><a href="/blogg/">Blogg</a></li>
    <li><a href="/faq/">FAQ</a></li>
    <li><a href="/om-oss/">Om oss</a></li>
  </ul>
  <div class="nav-right">
    <a href="/kontakt/#contact-form" class="nav-cta">Kontakta oss</a>
    <button class="nav-hamburger" id="hamburger" aria-label="Öppna meny" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
</nav>
</header>`;
}

function footer() {
  return `<footer role="contentinfo" itemscope itemtype="https://schema.org/Organization">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="footer-logo" itemprop="name">Plasma<span> MEDIA</span><span class="logo-domain"> AB</span></div>
        <p itemprop="description">Vi hjälper svenska företag att växa online med professionella hemsidor, SEO och digital marknadsföring.</p>
      </div>
      <div class="footer-col"><h4>Tjänster</h4><ul>
        <li><a href="/hemsida/">Hemsidor</a></li><li><a href="/seo/">SEO</a></li><li><a href="/google-ads/">Google Ads</a></li><li><a href="/priser/">Priser</a></li>
      </ul></div>
      <div class="footer-col"><h4>Företaget</h4><ul>
        <li><a href="/om-oss/">Om oss</a></li><li><a href="/blogg/">Blogg</a></li><li><a href="/kundcases/">Kundcase</a></li><li><a href="/kontakt/#contact-form">Kontakt</a></li>
      </ul></div>
      <div class="footer-col"><h4>SEO-kluster</h4><ul>
        <li><a href="/teknisk-seo/">Teknisk SEO</a></li><li><a href="/on-page-seo/">On-page SEO</a></li><li><a href="/off-page-seo/">Off-page SEO</a></li><li><a href="/ai-seo/">AI SEO</a></li>
      </ul></div>
      <div class="footer-col"><h4>Kontakt</h4><address class="footer-address"><ul>
        <li><a href="mailto:albin@plasmamedia.se" itemprop="email">albin@plasmamedia.se</a></li>
        <li><a href="tel:+46735365788" itemprop="telephone">073-536 57 88</a></li>
        <li><span itemprop="streetAddress">O D Krooks gata 25</span></li>
        <li><span itemprop="postalCode">254 44</span> <span itemprop="addressLocality">Helsingborg</span>, Sverige</li>
      </ul></address></div>
    </div>
    <div class="footer-bottom"><p>&copy; 2026 Plasma MEDIA AB. Org.nr: 559565-4277</p><p><a href="/integritetspolicy/" class="footer-legal-link">Integritetspolicy</a></p></div>
  </div>
</footer>
<script src="/assets/site-shell.js?v=20260714h" defer></script>
</body>
</html>`;
}

function orgSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    name: 'Plasma MEDIA AB',
    url: `${site}/`,
    email: 'albin@plasmamedia.se',
    telephone: '+46735365788',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'O D Krooks gata 25',
      postalCode: '254 44',
      addressLocality: 'Helsingborg',
      addressCountry: 'SE',
    },
    areaServed: 'Sverige',
    sameAs: [],
  };
}

function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: strip(faq.q),
      acceptedAnswer: { '@type': 'Answer', text: strip(faq.a) },
    })),
  };
}

async function writePage(route, html) {
  const dir = path.join(root, route);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), html, 'utf8');
}

function articleFaqs(post) {
  const faqs = [];
  for (const section of post.contentSections || []) {
    if (!/vanliga fr/i.test(strip(section.heading))) continue;
    for (const paragraph of section.body || []) {
      const match = String(paragraph).match(/<strong>(.*?)<\/strong>\s*(.*)/i);
      if (match) faqs.push({ q: match[1], a: match[2] || post.excerpt });
    }
  }
  return faqs.slice(0, 6);
}

function sectionIdFor(section, index) {
  const base = strip(section?.heading || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || `sektion-${index + 1}`;
}

function renderBlogPost(post) {
  const canonical = `${site}/blogg/${post.slug}/`;
  const faqs = articleFaqs(post);
  const schema = [
    orgSchema(),
    breadcrumbSchema([
      { name: 'Startsida', url: `${site}/` },
      { name: 'Blogg', url: `${site}/blogg/` },
      { name: strip(post.title), url: canonical },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: strip(post.title),
      description: strip(post.excerpt),
      url: canonical,
      datePublished: toIsoDate(post.date),
      dateModified: toIsoDate(post.date),
      inLanguage: 'sv-SE',
      author: { '@type': 'Organization', name: strip(post.authorName || 'Plasma MEDIA AB') },
      publisher: { '@type': 'Organization', name: 'Plasma MEDIA AB', url: site },
      mainEntityOfPage: canonical,
    },
    ...(faqs.length ? [faqSchema(faqs)] : []),
  ];

  const articleSections = (post.contentSections || []).map((section, index) => ({
    section,
    index,
    id: sectionIdFor(section, index),
  }));

  const sections = articleSections.map(({ section, id }) => `
    <section class="article-section">
      <h2 id="${id}">${section.heading}</h2>
      ${(section.body || []).map((paragraph) => `<p>${paragraph}</p>`).join('\n')}
      ${section.bullets ? `<ul class="guide-list">${section.bullets.map((item) => `<li>${item}</li>`).join('')}</ul>` : ''}
    </section>`).join('\n');

  const tocItems = articleSections.slice(0, 10).map(({ section, id }, index) =>
    `<li><a href="#${id}"><span class="toc-num">${String(index + 1).padStart(2, '0')}</span>${strip(section.heading)}</a></li>`
  ).join('\n          ');

  return `${head({
    title: `${strip(post.title)} | Plasma MEDIA AB`,
    description: post.excerpt,
    canonical,
    css: ['/assets/blog.css?v=20260714c', '/assets/blogg.css?v=20260714d'],
    type: 'article',
    schema,
  })}
${header()}
<main id="main-content" class="article-page article-page--static">
  <nav class="breadcrumb" aria-label="breadcrumb"><ol><li><a href="/">Startsida</a></li><li class="sep">›</li><li><a href="/blogg/">Blogg</a></li><li class="sep">›</li><li><span>${esc(post.title)}</span></li></ol></nav>
  <div class="article-wrap">
    <article class="blog-post blog-post--guide">
      <header class="article-header">
        <a href="/blogg/" class="article-back article-back--guide">Tillbaka till bloggen</a>
        <div class="post-badges"><span class="badge badge-cat">${post.category}</span><span class="badge badge-time">${post.readingTime}</span></div>
        <h1 class="article-title">${post.title}</h1>
        <div class="featured-answer"><span class="featured-answer-label">Kort svar</span><p>${(post.contentSections?.[0]?.body?.[0] || post.excerpt)}</p></div>
        <p class="article-lead">${post.excerpt}</p>
        <div class="article-meta"><span><strong>Publicerad:</strong> ${post.date}</span><span><strong>Av:</strong> ${post.authorName || 'Plasma MEDIA AB'}</span><span><strong>Kategori:</strong> ${post.category}</span></div>
      </header>
      <div class="article-body">${sections}
        <section class="article-section article-section--service">
          <h2>Vill du omsätta detta i praktiken?</h2>
          <p>Plasma MEDIA AB hjälper företag med <a href="/seo/">SEO</a>, <a href="/hemsida/">hemsidor</a> och <a href="/google-ads/">Google Ads</a>. Vill du veta vad som passar din situation bäst kan du <a href="/kontakt/#contact-form">skicka en förfrågan</a>.</p>
        </section>
      </div>
    </article>
    <aside class="article-sidebar" aria-label="Artikelverktyg">
      <div class="sidebar-progress" aria-label="Din l&auml;sning">
        <h3>Din l&auml;sning</h3>
        <div class="read-bar"><div class="read-fill" id="readFill"></div></div>
        <div class="read-pct" id="readPct">0% klart</div>
      </div>
      <div class="sidebar-toc">
        <h3>Inneh&aring;ll</h3>
        <ol class="toc-list">
          ${tocItems}
        </ol>
      </div>
      <div class="sidebar-cta"><h3>Vill du g&ouml;ra detta praktiskt?</h3><p>Vi tittar p&aring; din situation och visar vad som ger mest effekt f&ouml;rst.</p><a href="/kontakt/#contact-form">Boka gratis samtal</a></div>
    </aside>
  </div>
</main>
${footer()}`;
}

const seoPages = [
  {
    route: 'teknisk-seo',
    title: 'Teknisk SEO byrå | Indexering, hastighet och struktur',
    h1: 'Teknisk SEO som gör din hemsida lättare för Google att förstå',
    kicker: 'SEO-kluster',
    description: 'Teknisk SEO för företag som vill förbättra indexering, laddningstid, Core Web Vitals, sitemap, canonical och intern struktur.',
    lead: 'Teknisk SEO är grunden som avgör om Google kan hitta, läsa och prioritera dina viktigaste sidor. Här går vi igenom hur Plasma MEDIA AB arbetar praktiskt med teknisk SEO för svenska företag.',
    sections: [
      ['Vad ingår i teknisk SEO?', 'Vi kontrollerar crawlning, indexering, statuskoder, canonical, sitemap, interna länkar, laddningstid, mobilupplevelse och schema. Målet är att ta bort hinder som gör att bra innehåll inte får full effekt.'],
      ['När behövs teknisk SEO?', 'Vid ny hemsida, migrering, fallande trafik, många 404-fel, dålig laddningstid eller när viktiga sidor inte indexeras. För mindre företag börjar vi med sidorna som kan skapa kunder: startsida, tjänster, priser, lokala sidor och kontakt.'],
      ['Hur mäts resultatet?', 'Vi följer indexerade sidor, organiska klick, Core Web Vitals, tekniska fel i Search Console och om fler viktiga sidor börjar få visningar. Teknisk SEO är ofta första steget innan innehåll och länkar skalas upp.'],
    ],
    links: [['/seo/', 'SEO'], ['/on-page-seo/', 'On-page SEO'], ['/seo-pris/', 'SEO-priser']],
    faqs: [
      ['Vad kostar teknisk SEO?', 'Kostnaden beror på webbplatsens storlek och problemens omfattning. Mindre sajter kan ofta börja med en riktad analys och prioriterad åtgärdslista.'],
      ['Är teknisk SEO samma sak som laddningstid?', 'Nej. Laddningstid är en viktig del, men teknisk SEO omfattar även indexering, URL-struktur, canonical, redirects, internlänkar och schema.'],
      ['Kan teknisk SEO ge snabb effekt?', 'Ja, om det finns tydliga hinder som blockerar indexering eller gör viktiga sidor svåra att hitta.'],
    ],
  },
  {
    route: 'on-page-seo',
    title: 'On-page SEO | Tjänstesidor, rubriker och innehåll som rankar',
    h1: 'On-page SEO för sidor som både rankar och konverterar',
    kicker: 'SEO-kluster',
    description: 'On-page SEO för företag: sökintention, title, H1, meta description, innehåll, FAQ, internlänkar och konvertering.',
    lead: 'On-page SEO handlar om att göra varje viktig sida tydlig för både Google och kunden. Rätt struktur hjälper besökaren förstå, jämföra och ta kontakt.',
    sections: [
      ['Sökintention först', 'Varje sida ska svara på en tydlig fråga. En prissida ska prata pris. En lokal sida ska visa lokal relevans. En tjänstesida ska förklara process, värde och nästa steg.'],
      ['Rubriker och innehåll', 'Vi vässar title, H1, underrubriker, brödtext, FAQ och interna länkar så att sidan blir mer komplett utan att kännas sökordsstoppad.'],
      ['Konvertering och SEO tillsammans', 'En sida som rankar men inte skapar leads är inte färdig. Därför kopplar vi on-page SEO till kontaktvägar, förtroendebevis och tydliga CTA-knappar.'],
    ],
    links: [['/seo/', 'SEO'], ['/teknisk-seo/', 'Teknisk SEO'], ['/hemsida/', 'Hemsidor']],
    faqs: [
      ['Hur många ord behöver en tjänstesida ha?', 'Det beror på sökintentionen. Sidan ska vara tillräckligt komplett för att besvara kundens viktigaste frågor, inte lång för längdens skull.'],
      ['Påverkar meta description ranking?', 'Inte direkt på samma sätt som innehåll och relevans, men den kan påverka klickfrekvensen från sökresultatet.'],
      ['Behöver alla sidor FAQ?', 'Nej. FAQ är bäst där kunder faktiskt har återkommande frågor, till exempel priser, SEO, hemsidor och lokala tjänster.'],
    ],
  },
  {
    route: 'off-page-seo',
    title: 'Off-page SEO & länkstrategi | Bygg auktoritet tryggt',
    h1: 'Off-page SEO som bygger förtroende utan genvägar',
    kicker: 'SEO-kluster',
    description: 'Off-page SEO och länkstrategi för företag som vill stärka auktoritet, lokala signaler, omnämnanden och förtroende.',
    lead: 'Off-page SEO handlar om signaler utanför din egen webbplats: länkar, omnämnanden, lokala profiler, recensioner och relationer som visar att företaget är relevant.',
    sections: [
      ['Kvalitet före kvantitet', 'En relevant länk från en kund, partner, branschorganisation eller lokal aktör är ofta mer värd än många svaga kataloglänkar.'],
      ['Lokal auktoritet', 'För lokala företag är Google Business Profile, konsekventa företagsuppgifter och riktiga recensioner viktiga delar av förtroendet online.'],
      ['Digital PR i liten skala', 'Kundcase, guider, samarbeten och användbara resurser kan skapa naturliga omnämnanden. Det är långsammare än länkpaket, men betydligt tryggare.'],
    ],
    links: [['/seo/', 'SEO'], ['/lokal-seo/', 'Lokal SEO'], ['/kundcases/arborist-roslagen/', 'Kundcase']],
    faqs: [
      ['Är länkbygge riskabelt?', 'Det kan vara riskabelt om det bygger på köpta lågkvalitetslänkar. En trygg strategi prioriterar relevans, relationer och verkligt värde.'],
      ['Hur många länkar behöver man?', 'Det beror på konkurrens och marknad. För lokala företag räcker ofta färre men mer relevanta signaler.'],
      ['Är kundcase bra för off-page SEO?', 'Ja, kundcase kan både bygga förtroende och skapa naturliga möjligheter till länkar från kunder och samarbetspartners.'],
    ],
  },
  {
    route: 'ai-seo',
    title: 'AI SEO 2026 | Synlighet i ChatGPT, AI-sök och Google',
    h1: 'AI SEO för företag som vill synas när söket förändras',
    kicker: 'SEO-kluster',
    description: 'AI SEO för företag 2026: struktur, källvärde, E-E-A-T, tydliga svar, schema och hur innehåll kan bli lättare att förstå för AI-sök.',
    lead: 'AI SEO handlar inte om en magisk tagg. Det handlar om att göra företagets innehåll tydligt, trovärdigt, aktuellt och lätt att tolka för både sökmotorer och AI-drivna svar.',
    sections: [
      ['Vad innebär AI SEO?', 'AI-sök premierar ofta tydliga svar, stark avsändare, uppdaterat innehåll och sidor som kan användas som källa. Därför behöver webbplatsen ha bra struktur, tydliga tjänstesidor och faktiska bevis.'],
      ['Bygg innehåll som går att citera', 'Svara på konkreta frågor: vad kostar det, vad ingår, hur går processen till och när passar lösningen? Ju mer användbart svaret är, desto starkare blir sidan.'],
      ['Teknik och förtroende', 'Organization-schema, BreadcrumbList, FAQ, författare, kontaktuppgifter, kundcase och konsekvent företagsinformation hjälper maskiner och människor att förstå vem som står bakom innehållet.'],
    ],
    links: [['/blogg/hur-syns-man-i-chatgpt/', 'Hur syns man i ChatGPT?'], ['/teknisk-seo/', 'Teknisk SEO'], ['/seo/', 'SEO']],
    faqs: [
      ['Kan man garantera synlighet i ChatGPT?', 'Nej. Ingen seriös aktör kan garantera att ett företag rekommenderas i AI-svar. Däremot kan man stärka innehåll, teknik och förtroendesignaler.'],
      ['Är AI SEO samma sak som vanlig SEO?', 'Det överlappar mycket. Skillnaden är att innehåll behöver vara ännu tydligare, mer källbart och mer strukturerat.'],
      ['Vad ska företag prioritera först?', 'Börja med starka tjänstesidor, tydlig kontaktinformation, FAQ, kundcase och tekniskt indexerbara sidor.'],
    ],
  },
];

const commercialPages = [
  {
    route: 'google-ads-pris',
    title: 'Vad kostar Google Ads? Pris, budget och byråarvode 2026',
    h1: 'Google Ads pris 2026 – budget, klick och kostnad per lead',
    kicker: 'Google Ads',
    description: 'Guide till Google Ads-priser 2026: annonsbudget, CPC, byråarvode, konverteringsspårning och vad företag bör räkna med.',
    lead: 'Google Ads har inget fast pris. Kostnaden styrs av konkurrens, sökord, geografiskt område, landningssida, budstrategi och hur väl konverteringar mäts.',
    sections: [
      ['Vad betalar man för?', 'Du betalar dels annonsbudget till Google, dels eventuellt byråarvode för strategi, uppsättning, optimering och rapportering. Det viktiga är att mäta kostnad per kvalificerat lead, inte bara kostnad per klick.'],
      ['Rimlig startbudget', 'Många lokala företag kan börja med 5 000–15 000 kr per månad i annonsbudget. Mer konkurrensutsatta branscher eller större områden kräver ofta mer data och högre budget.'],
      ['Vad ingår i ett seriöst upplägg?', 'Sökordsanalys, kampanjstruktur, annonser, negativa sökord, konverteringsspårning, landningssiderekommendationer och löpande optimering bör ingå.'],
    ],
    links: [['/google-ads/', 'Google Ads'], ['/google-ads-byra/', 'Google Ads-byrå'], ['/priser/', 'Priser']],
    faqs: [
      ['Vad kostar Google Ads per klick?', 'Klickpriset varierar kraftigt mellan branscher. Lokala tjänster kan ligga betydligt lägre än juridik, finans eller hårt konkurrensutsatta B2B-sökord.'],
      ['Hur snabbt får man resultat?', 'Google Ads kan ge trafik direkt, men lönsam optimering kräver korrekt mätning och ofta några veckors data.'],
      ['Är Google Ads bättre än SEO?', 'Google Ads är snabbare. SEO är mer långsiktigt. För många företag fungerar kombinationen bäst.'],
    ],
  },
  {
    route: 'google-ads-byra',
    title: 'Google Ads-byrå för småföretag | Plasma MEDIA AB',
    h1: 'Google Ads-byrå som fokuserar på leads, inte bara klick',
    kicker: 'Google Ads',
    description: 'Google Ads-byrå för företag som vill ha fler förfrågningar genom sökannonsering, tydlig mätning och bättre landningssidor.',
    lead: 'Vi hjälper företag att sätta upp, mäta och optimera Google Ads med fokus på verkliga förfrågningar. Målet är färre gissningar och bättre kontroll på budgeten.',
    sections: [
      ['Så arbetar vi', 'Vi börjar med sökintention, tjänster, geografi och landningssida. Därefter byggs kampanjer med tydliga annonsteman, negativa sökord och mätning av formulär och samtal.'],
      ['När passar Google Ads?', 'Google Ads passar bäst när kunder redan söker efter tjänsten. Det är särskilt starkt för lokala tjänster, akuta behov och erbjudanden där köpintentionen är tydlig.'],
      ['När rekommenderar vi SEO istället?', 'Om budgeten är låg, säljcykeln lång eller behovet är långsiktig synlighet kan SEO eller hemsidearbete vara bättre första prioritet. Vi försöker välja kanal efter affärsläge, inte efter vad som låter mest spännande.'],
    ],
    links: [['/google-ads-pris/', 'Google Ads-pris'], ['/seo/', 'SEO'], ['/kontakt/#contact-form', 'Boka genomgång']],
    faqs: [
      ['Måste jag ha en ny landningssida?', 'Inte alltid, men Google Ads fungerar bäst när landningssidan matchar sökningen tydligt och har enkel kontaktväg.'],
      ['Kan ni ta över ett befintligt konto?', 'Ja, vi kan granska struktur, söktermer, spårning och resultat innan vi rekommenderar nästa steg.'],
      ['Hur vet jag om Ads är lönsamt?', 'Genom att mäta kostnad per kvalificerat lead och jämföra det med värdet av en ny kund.'],
    ],
  },
];

const countyPages = [
  ['webbyra-skane', 'Webbyrå i Skåne | Hemsida, SEO och lokal synlighet', 'Webbyrå i Skåne för företag som vill växa lokalt', 'Vi hjälper företag i Skåne med hemsidor, lokal SEO och struktur som gör det lättare att synas i Malmö, Helsingborg, Lund och resten av länet.'],
  ['webbyra-stockholms-lan', 'Webbyrå i Stockholms län | SEO och hemsidor', 'Webbyrå i Stockholms län med fokus på tydliga förfrågningar', 'Vi bygger hemsidor och SEO-struktur för företag i Stockholms län som vill synas lokalt och konkurrera smartare på Google.'],
  ['webbyra-vastra-gotaland', 'Webbyrå i Västra Götaland | Hemsida och lokal SEO', 'Webbyrå i Västra Götaland för lokal synlighet', 'Vi hjälper företag i Göteborg, Borås, Trollhättan och övriga Västra Götaland med hemsidor, SEO och konverterande innehåll.'],
];

function renderClusterPage(page) {
  const canonical = `${site}/${page.route}/`;
  const schema = [
    orgSchema(),
    breadcrumbSchema([{ name: 'Startsida', url: `${site}/` }, { name: page.h1, url: canonical }]),
    faqSchema(page.faqs.map(([q, a]) => ({ q, a }))),
  ];
  return `${head({ title: page.title, description: page.description, canonical, schema })}
${header()}
<main id="main-content">
  <section class="cluster-hero"><div class="container">
    <span class="cluster-kicker">${page.kicker}</span>
    <h1>${page.h1}</h1>
    <p class="cluster-lead">${page.lead}</p>
    <div class="cluster-actions"><a class="cluster-btn" href="/kontakt/#contact-form">Få rekommendation</a><a class="cluster-btn cluster-btn--ghost" href="/priser/">Se priser</a></div>
  </div></section>
  <section class="cluster-section"><div class="container cluster-wide">
    ${page.sections.map(([heading, body]) => `<h2>${heading}</h2><p>${body}</p>`).join('\n')}
    <div class="cluster-link-grid">${page.links.map(([href, label]) => `<a class="cluster-link-card" href="${href}">${label}<span>Läs mer</span></a>`).join('')}</div>
  </div></section>
  <section class="cluster-section cluster-section--cream"><div class="container">
    <h2 class="section-title">Vanliga frågor</h2>
    <div class="faq-list">${page.faqs.map(([q, a]) => `<div class="faq-item"><h3>${q}</h3><p>${a}</p></div>`).join('')}</div>
  </div></section>
  <section class="cluster-cta"><h2>Vill du prioritera rätt SEO-insats?</h2><p>Skicka din webbplats och vad du vill uppnå, så rekommenderar vi om hemsida, SEO eller annonsering är mest rimligt först.</p><a class="cluster-btn cluster-btn--ghost" href="/kontakt/#contact-form">Kontakta oss</a></section>
</main>
${footer()}`;
}

function renderCountyPage([route, title, h1, lead]) {
  return renderClusterPage({
    route,
    title,
    h1,
    kicker: 'Lokal webbyrå',
    description: lead,
    lead,
    sections: [
      ['Hemsida och SEO i samma struktur', 'En lokal sida behöver visa både vad företaget erbjuder och var kunderna finns. Därför bygger vi tjänstesidor, lokala signaler, internlänkar och kontaktvägar som hänger ihop.'],
      ['För företag i flera kommuner', 'Om du vill synas i flera kommuner räcker det inte att kopiera samma text. Varje viktig ort eller länssida behöver ett eget syfte, lokala exempel och tydlig koppling till tjänsterna.'],
      ['Från lokal synlighet till förfrågningar', 'Målet är inte bara ranking. Sidorna ska hjälpa kunden förstå erbjudandet, jämföra alternativ och ta kontakt via telefon eller formulär.'],
    ],
    links: [['/webbyra/', 'Alla orter'], ['/lokal-seo/', 'Lokal SEO'], ['/hemsida/', 'Hemsidor']],
    faqs: [
      ['Behöver jag en sida per kommun?', 'Inte alltid. Börja med de viktigaste områdena där du faktiskt vill ha kunder och kan skapa relevant innehåll.'],
      ['Är länssidor bra för SEO?', 'Ja, om de har verkligt innehåll och hjälper användaren. Tunna kopior med bara bytt ortsnamn bör undvikas.'],
      ['Kan ni bygga både hemsida och lokal SEO?', 'Ja, vi kopplar gärna hemsidestruktur, lokal SEO och internlänkar från start.'],
    ],
  });
}

function renderCasePage() {
  const canonical = `${site}/kundcases/arborist-roslagen/`;
  const schema = [
    orgSchema(),
    breadcrumbSchema([
      { name: 'Startsida', url: `${site}/` },
      { name: 'Kundcase', url: `${site}/kundcases/` },
      { name: 'Arborist Roslagen', url: canonical },
    ]),
  ];
  return `${head({
    title: 'Kundcase: Arborist Roslagen | Hemsida för arborist',
    description: 'Kundcase om Arborist Roslagen: en tydlig hemsida för trädvård, trädfällning, beskärning och lokala sökningar i Roslagen.',
    canonical,
    css: ['/assets/kundcases.css', '/assets/cluster.css'],
    schema,
  })}
${header()}
<main id="main-content">
  <section class="cluster-hero"><div class="container">
    <span class="cluster-kicker">Kundcase</span>
    <h1>Arborist Roslagen – hemsida som gör trädvård enkel att förstå</h1>
    <p class="cluster-lead">Arborist Roslagen behövde en professionell webbplats som tydligt visar tjänster, geografiskt område och kontaktväg för kunder i Norrtälje och Roslagen.</p>
    <div class="cluster-actions"><a class="cluster-btn" href="https://www.arboristroslagen.se/" target="_blank" rel="noopener">Besök hemsidan</a><a class="cluster-btn cluster-btn--ghost" href="/kontakt/#contact-form">Vill du ha liknande?</a></div>
  </div></section>
  <section class="cluster-section"><div class="container cluster-split">
    <div><h2>Uppdraget</h2><p>Vi skapade en hemsida med fokus på tydliga tjänstesidor, lokal trovärdighet och enkel kontakt. Besökaren ska snabbt förstå om Arborist Roslagen hjälper med trädfällning, beskärning, riskträd eller rådgivning.</p><p>Strukturen är byggd för lokala sökningar och för att minska friktion: tydliga CTA-knappar, serviceområden, förtroendeskapande text och en kontaktväg som fungerar på mobil.</p></div>
    <div class="mini-stats"><div class="mini-stat"><strong>19</strong><span>nöjda kunder totalt</span></div><div class="mini-stat"><strong>3 mån</strong><span>genomsnitt till mätbara resultat</span></div><div class="mini-stat"><strong>SEO + webb</strong><span>struktur från start</span></div></div>
  </div></section>
  <section class="cluster-section cluster-section--cream"><div class="container cluster-wide">
    <h2>Vad vi tog med oss</h2><p>Lokala tjänsteföretag behöver ofta mindre “flash” och mer tydlighet. När kunden har ett trädproblem vill de snabbt veta om företaget arbetar i området, vilka tjänster som finns, hur processen går till och hur man får offert.</p>
    <div class="cluster-link-grid"><a class="cluster-link-card" href="/hemsida/">Hemsidor<span>Så bygger vi</span></a><a class="cluster-link-card" href="/lokal-seo/">Lokal SEO<span>Syns i närområdet</span></a><a class="cluster-link-card" href="/kundcases/">Fler kundcase<span>Se översikt</span></a></div>
  </div></section>
</main>
${footer()}`;
}

async function renderRedirectBlog() {
  await writePage('blog', `<!DOCTYPE html><html lang="sv"><head><meta charset="UTF-8"><meta name="robots" content="noindex, follow"><link rel="canonical" href="${site}/blogg/"><meta http-equiv="refresh" content="0; url=/blogg/"><title>Bloggen har flyttat | Plasma MEDIA AB</title><script>location.replace('/blogg/');</script></head><body><p>Bloggen har flyttat till <a href="/blogg/">/blogg/</a>.</p></body></html>`);
}

async function buildBlogPosts() {
  for (const post of blogPosts) {
    if (!post.contentSections?.length || post.staticArticle) continue;
    await writePage(path.join('blogg', post.slug), renderBlogPost(post));
  }
}

async function buildPages() {
  for (const page of [...seoPages, ...commercialPages]) {
    await writePage(page.route, renderClusterPage(page));
  }
  for (const page of countyPages) {
    await writePage(page[0], renderCountyPage(page));
  }
  await writePage(path.join('kundcases', 'arborist-roslagen'), renderCasePage());
  await renderRedirectBlog();
}

async function collectIndexPages(dir = root, rel = '') {
  const entries = await readdir(dir, { withFileTypes: true });
  const pages = [];
  if (entries.some((entry) => entry.isFile() && entry.name === 'index.html')) {
    pages.push(rel ? `/${rel.replaceAll(path.sep, '/')}/` : '/');
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith('.') || ['node_modules', 'public', 'src', 'api', 'scripts', 'dist'].includes(entry.name)) continue;
    pages.push(...await collectIndexPages(path.join(dir, entry.name), path.join(rel, entry.name)));
  }
  return pages;
}

async function isIndexable(route) {
  if (['/blog/', '/quiz/', '/tack/'].includes(route)) return false;
  const file = route === '/' ? path.join(root, 'index.html') : path.join(root, route, 'index.html');
  if (!existsSync(file)) return false;
  const html = await readFile(file, 'utf8');
  return !/<meta\s+name=["']robots["'][^>]+noindex/i.test(html);
}

function priority(route) {
  if (route === '/') return '1.0';
  if (['/seo/', '/hemsida/', '/google-ads/', '/priser/'].includes(route)) return '0.9';
  if (route.startsWith('/blogg/')) return route === '/blogg/' ? '0.8' : '0.7';
  if (route.startsWith('/webbyra') || route.includes('seo')) return '0.75';
  return '0.65';
}

async function buildSitemap() {
  const routes = [...new Set(await collectIndexPages())].sort((a, b) => {
    if (a === '/') return -1;
    if (b === '/') return 1;
    return a.localeCompare(b, 'sv');
  });
  const indexable = [];
  for (const route of routes) {
    if (await isIndexable(route)) indexable.push(route);
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable.map((route) => `  <url>\n    <loc>${site}${route === '/' ? '/' : route}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${route.startsWith('/blogg/') ? 'monthly' : 'weekly'}</changefreq>\n    <priority>${priority(route)}</priority>\n  </url>`).join('\n')}\n</urlset>\n`;
  await writeFile(path.join(root, 'public', 'sitemap.xml'), xml, 'utf8');
}

await buildBlogPosts();
await buildPages();
await buildSitemap();

console.log(`Generated ${blogPosts.filter((post) => post.contentSections?.length && !post.staticArticle).length} blog pages`);
console.log(`Suggested Vite input names: ${[...seoPages, ...commercialPages].map((page) => `${slugToInputName(page.route)}: ${page.route}`).join(', ')}`);
