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
                Vi kartlägger din startpunkt och identifierar vägen till ditt mål.
              </p>
            </div>
          </div>

          <div className="process-row">
            <div className="process-left">
              <div className="process-number">02</div>
              <h3>Synlighet</h3>
            </div>
            <div className="process-right">
              <p>
                Vi stärker din digitala närvaro och positionerar ditt företag där kunderna aktivt söker.
              </p>
            </div>
          </div>

          <div className="process-row">
            <div className="process-left">
              <div className="process-number">03</div>
              <h3>Affärer</h3>
            </div>
            <div className="process-right">
              <p>
                Ökad synlighet som leder till fler kundförfrågningar och nya affärer.
              </p>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}