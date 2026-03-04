import Container from "../ui/Container";
import Reveal from "../ui/Reveal";

export default function Authority() {
  return (
    <section className="section authority">
      <Container>
        <Reveal>
          <h2 className="section-title">
            Vi arbetar med <span>tillväxtambitiösa bolag</span>
          </h2>

          <p className="section-intro">
            Företag med bevisad efterfrågan som vill bygga
            ett förutsägbart och skalbart tillväxtsystem.
          </p>

          <div className="authority-grid">
            <div className="authority-card">
              <h3>5–200 MSEK</h3>
              <p>Typiskt omsättningsspann</p>
            </div>

            <div className="authority-card">
              <h3>B2B & E-handel</h3>
              <p>Skalbara affärsmodeller</p>
            </div>

            <div className="authority-card">
              <h3>Långsiktiga partnerskap</h3>
              <p>System före kampanjer</p>
            </div>
          </div>

          <div className="logo-row">
            <span>EXEMPELBOLAG</span>
            <span>NORDIC TECH</span>
            <span>E-COMMERCE CO</span>
            <span>SAAS GROUP</span>
            <span>RETAIL GROWTH</span>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}