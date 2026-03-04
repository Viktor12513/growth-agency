import Container from "../ui/Container";
import Reveal from "../ui/Reveal";

export default function ScalableGrowth() {
  return (
    <section className="section">
      <Container>
        <Reveal>
          <h2 className="section-title">
            Så skapar vi <span>skalbar tillväxt</span>
          </h2>

          <p className="section-intro">
            Tillväxt är inte tur. Det är system.
            Vi bygger strukturer som gör att marknadsföringen
            kan skala — utan att lönsamheten kollapsar.
          </p>

          <div className="timeline">
           <div className="timeline-item">
  <div className="timeline-dot" />
              <div className="timeline-number">01</div>
              <div className="timeline-content">
                <h3>Datadriven analys</h3>
                <p>
                  Vi börjar alltid med siffror. Kundresor,
                  konverteringspunkter, marginaler och flaskhalsar.
                </p>
              </div>
            </div>

            <div className="timeline-item">
  <div className="timeline-dot" />
              <div className="timeline-number">02</div>
              <div className="timeline-content">
                <h3>Struktur för skalning</h3>
                <p>
                  Kampanj- och SEO-strukturer byggda för att växa
                  utan exponentiellt ökande kostnad.
                </p>
              </div>
            </div>

            <div className="timeline-item">
  <div className="timeline-dot" />
              <div className="timeline-number">03</div>
              <div className="timeline-content">
                <h3>Test & optimering</h3>
                <p>
                  Kontinuerlig A/B-testning och datadriven CRO
                  för att pressa ner CPA och maximera ROAS.
                </p>
              </div>
            </div>

            <div className="timeline-item">
                <div className="timeline-dot" />
              <div className="timeline-number">04</div>
              <div className="timeline-content">
                <h3>Total transparens</h3>
                <p>
                  Inga fluff-rapporter. Bara siffror som påverkar
                  resultatet på riktigt.
                </p>
              </div>
            </div>
          </div>
          <div className="growth-cta">
  <h3>
    Redo att skala snabbare än konkurrenterna?
  </h3>

  <p>
    Vi bygger tillväxtsystem som gör marknadsföringen
    förutsägbar, lönsam och skalbar.
  </p>

  <button className="btn btn-primary">
    Boka kostnadsfri konultation
  </button>
</div>
        </Reveal>
      </Container>
    </section>
  );
}