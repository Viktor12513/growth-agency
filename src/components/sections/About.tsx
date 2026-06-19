import Container from "../ui/Container";

export default function About() {
  return (
    <section id="about" className="section about-section">
      <Container>
        <h3 className="founders-title">Vi bakom Nordväxt</h3>
        {/* Founder Cards */}
        <div className="founders">

  <div className="founder-card">
    <img src="/images/founder1.jpeg" alt="Albin" />
    <h4>Albin Hagman</h4>
    <p>Strategi & kundrelationer</p>

  </div>

  <div className="founder-card">
    <img src="/images/founder2.jpeg" alt="Viktor" />
    <h4>Viktor Hagman</h4>
    <p>Produktion & digital utveckling</p>

  </div>

</div>
      

        {/* Main About Box */}
        <div className="about-box">

          <h2>Albin & Viktor</h2>
              <center>
          <p className="about-text">
            Nordväxt drivs av ett litet och personligt team där strategi, kommunikation och produktion arbetar nära tillsammans genom hela processen. 
<br></br><br></br>Vi hjälper företag att synas bättre online genom hemsidor, digital utveckling och löpande optimering. Med fokus på tydlig kommunikation och smarta lösningar bygger vi digitala plattformar som både ser bra ut och skapar resultat över tid. 

          </p></center>

    <div className="about-buttons">
  <a href="#contact" className="btn btn-primary">
    Boka gratis rådgivning
  </a>

  <a href="tel:+46735365788" className="btn btn-secondary">
    Ring direkt
  </a>
</div>

          </div>

        
      </Container>
    </section>
  );
}