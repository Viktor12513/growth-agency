import Container from "../ui/Container";
import Reveal from "../ui/Reveal";

export default function Services() {
  return (
    <section className="section services">
      <Container>
        <Reveal>
          <h2 className="section-title">
           Det här <span>hjälper vi våra kunder med</span>
          </h2>

          <p className="section-intro">
            Vi bygger inte bara hemsidor — vi hjälper företag skapa en starkare digital närvaro som faktiskt bidrar till fler förfrågningar, bättre synlighet och enklare kundkontakt.

          </p>

          <div className="services-grid">
            <div className="service-card">
              <h3>Fler relevanta förfrågningar</h3>
              <p>
                Vi hjälper er synas bättre online och göra det enklare för rätt kunder att ta kontakt genom tydlig struktur, smart innehåll och en stark digital närvaro.
              </p>
            </div>

            <div className="service-card">
              <h3>En modern och professionell hemsida</h3>
              <p>
                Snabba, tydliga och mobilanpassade hemsidor som stärker företagets intryck och gör det enkelt för besökare att hitta rätt — oavsett enhet.
              </p>
            </div>

            <div className="service-card">
              <h3>Google-annonsering som når rätt målgrupp</h3>
              <p>
                Vi arbetar med Google Ads och lokal sökannonsering för att hjälpa företag synas när potentiella kunder aktivt söker efter deras tjänster eller produkter.
              </p>
            </div>

            <div className="service-card">
              <h3>Sociala medier och digital synlighet</h3>
              <p>
                Vi hjälper företag skapa ett mer professionellt och aktivt intryck på sociala medier genom innehåll, struktur och löpande optimering anpassat efter verksamheten.

              </p>
            </div>
          </div>

          
        </Reveal>
      </Container>
    </section>
  );
}