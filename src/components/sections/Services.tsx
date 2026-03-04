import Container from "../ui/Container";
import Reveal from "../ui/Reveal";

export default function Services() {
  return (
    <section className="section services">
      <Container>
        <Reveal>
          <h2 className="section-title">
            Vad vi <span>faktiskt levererar</span>
          </h2>

          <p className="section-intro">
            Vi säljer inte timmar. Vi bygger tillväxtmotorer.
            Här är vad det innebär i praktiken.
          </p>

          <div className="services-grid">
            <div className="service-card">
              <h3>Förutsägbar leadgenerering</h3>
              <p>
                System för att kontinuerligt generera kvalificerade leads —
                med tydlig kostnad per kund.
              </p>
            </div>

            <div className="service-card">
              <h3>Lönsam kundanskaffning</h3>
              <p>
                Annonsering och budstrategier optimerade för marginal —
                inte bara volym.
              </p>
            </div>

            <div className="service-card">
              <h3>Skalbar digital infrastruktur</h3>
              <p>
                SEO, tracking och konverteringsoptimering byggt för att
                växa utan att kostnaderna skenar.
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}