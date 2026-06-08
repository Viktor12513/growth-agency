import Container from "../ui/Container";

export default function Hero() {
  return (
    <section className="hero-full">
      <div className="hero-overlay" />

      <Container>
        <div className="hero-card">
          <p className="hero-eyebrow">Nordväxt.se</p>

          <h1>
            Bygg ett förutsägbart
            <br />
            tillväxtsystem
          </h1>

          <p className="hero-description">
            Vi hjälper företag att få fler kunder genom bättre hemsidor, synlighet på Google och löpande digital förbättring.
          </p>

          <div className="hero-buttons">
  <a href="#contact" className="btn btn-primary">
    Boka kostnadsfri tillväxtanalys
  </a>

  <a href="tel:+46768283996" className="btn btn-secondary">
    Ring oss
  </a>

          </div>
        </div>
      </Container>
    </section>
  );
}