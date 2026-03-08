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
            Företag med bevisat engagemang som vill bygga ett förutsägbart och skalbart tillväxtsystem.
Från nystartat till börsnoterat – vi hjälper företag växa.

          </p>

          <div className="authority-grid">
            <div className="authority-card">
              <h3>0–50 MSEK</h3>
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

          <div className="authority-logos">

  <div className="partners-section">

  <h3 className="partners-title">
    Några av våra partners
  </h3>

  <div className="partner-logos">

    <a href="https://www.pvsab.se/" target="_blank">
      <img src="/images/pvsab.png" alt="PVS AB" />
    </a>

    <a href="https://progressum.se/" target="_blank">
      <img src="/images/progressum.png" alt="Progressum" />
    </a>

    <a href="https://lindsjos.com/" target="_blank">
      <img src="/images/lindsjos.png" alt="Lindsjös" />
    </a>

    <a href="https://sorangs.nu/" target="_blank">
      <img src="/images/sorangs.png" alt="Sörängs Glas" />
    </a>

  </div>

</div>

</div>
        </Reveal>
      </Container>
    </section>
  );
}