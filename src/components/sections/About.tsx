import Container from "../ui/Container";

export default function About() {
  return (
    <section id="about" className="section about-section">
      <Container>
        <h3 className="founders-title">Grundarna bakom Digital Growth</h3>
        {/* Founder Cards */}
        <div className="founders">
          <div className="founder-card">
            <img src="/images/founder1.jpeg" alt="Daniel" />
            <h4>Albin</h4>
            <p>Grundare & Strategi</p>
          </div>

          <div className="founder-card">
            <img src="/images/founder2.jpeg" alt="founder2" />
            <h4>Viktor</h4>
            <p>Grundare & Teknik</p>
          </div>
        </div>

        {/* Main About Box */}
        <div className="about-box">

          <h2>Albin & Viktor</h2>

          <p className="about-text">
            Tillsammans har vi över 30 års erfarenhet av att arbeta med
            strategi, analys och tekniska lösningar för företag som vill växa.
            Vi fokuserar inte på kortsiktiga kampanjer utan bygger system
            som skapar långsiktig och skalbar tillväxt.
          </p>

          <div className="about-buttons">

            <a href="#contact" className="btn btn-primary">
              Boka gratis rådgivning
            </a>

            <a href="tel:+46731234567" className="btn btn-secondary">
              Ring direkt
            </a>

          </div>

        </div>

      </Container>
    </section>
  );
}