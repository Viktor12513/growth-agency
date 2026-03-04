import Container from "../ui/Container";

export default function Process() {
  return (
    <section id="process" className="section process-section">
      <Container>
        <h2 className="section-title">
          Så bygger vi <span>skalbar tillväxt</span>
        </h2>

        <div className="process-vertical">

          <div className="process-row">
            <div className="process-left">
              <div className="process-number">01</div>
              <h3>Analys</h3>
            </div>
            <div className="process-right">
              <p>
                Vi analyserar nuläge, data och marknad för att identifiera
                flaskhalsar och möjligheter.
              </p>
            </div>
          </div>

          <div className="process-row">
            <div className="process-left">
              <div className="process-number">02</div>
              <h3>Strategi</h3>
            </div>
            <div className="process-right">
              <p>
                En strukturerad tillväxtplan med tydliga KPI:er,
                prioriteringar och skalbar struktur.
              </p>
            </div>
          </div>

          <div className="process-row">
            <div className="process-left">
              <div className="process-number">03</div>
              <h3>Optimering</h3>
            </div>
            <div className="process-right">
              <p>
                Kontinuerlig testning, förbättring och skalning
                för att maximera lönsamheten över tid.
              </p>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}