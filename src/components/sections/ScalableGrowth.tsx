import Container from "../ui/Container";
import Reveal from "../ui/Reveal";

export default function ScalableGrowth() {
  return (
    <section className="section scalable-growth">
      <Container>
        <Reveal>
          <h2 className="section-title">
            Såhär<span> jobbar vi</span>
          </h2>

          <p className="section-intro">
            Vi bygger och förbättrar digitala lösningar steg för steg så att företag kan få fler kunder och bättre resultat över tid — utan onödigt krångel.

          </p>

          <div className="timeline">
           <div className="timeline-item">
  <div className="timeline-dot" />
              <div className="timeline-number">01</div>
              <div className="timeline-content">
                <h3>Förståelse & genomgång</h3>
                <p>
                  Vi går igenom er verksamhet, mål och nuvarande digitala närvaro för att se vad som faktiskt kan förbättras.

                </p>
              </div>
            </div>

            <div className="timeline-item">
  <div className="timeline-dot" />
              <div className="timeline-number">02</div>
              <div className="timeline-content">
                <h3>Struktur som fungerar i praktiken</h3>
                <p>
                  Vi bygger hemsida, innehåll och annonser på ett sätt som gör det enkelt för kunder att hitta rätt och ta kontakt.

                </p>
              </div>
            </div>

            <div className="timeline-item">
  <div className="timeline-dot" />
              <div className="timeline-number">03</div>
              <div className="timeline-content">
                <h3>Löpande förbättring
</h3>
                <p>
                  Vi arbetar kontinuerligt med justeringar och förbättringar baserat på vad som faktiskt ger resultat.
                </p>
              </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot" />
              <div className="timeline-number">04</div>
              <div className="timeline-content">
                <h3>Tydliga resultat och uppföljning</h3>
                <p>
                  Ni får en enkel överblick över vad som görs och hur det påverkar synlighet, trafik och förfrågningar.
                </p>
              </div>
            </div>
          </div>
          <div className="growth-cta">
            <div className="growth-cta-card">
  <h3>
    Växer ni så snabbt ni borde?
  </h3>

  <p>
    Vi bygger tillväxtsystem som gör marknadsföringen
    förutsägbar, lönsam och skalbar.
  </p>

  <a href="#contact" className="btn-primary">
Boka strategimöte
</a>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
