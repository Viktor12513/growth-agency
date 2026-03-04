import Container from "../ui/Container";

export default function Hero() {
  return (
    <section className="hero-full">
      <div className="hero-overlay" />

      <Container>
        <div className="hero-card">
          <p className="hero-eyebrow">DIGITAL GROWTH AGENCY</p>

          <h1>
            Bygg ett förutsägbart
            <br />
            tillväxtsystem
          </h1>

          <p className="hero-description">
            Vi hjälper B2B- och e-handelsbolag att skala lönsamt
            genom struktur, data och kontinuerlig optimering.
          </p>

          <div className="hero-buttons">
  <a href="#contact" className="btn btn-primary">
    Boka kostnadsfri tillväxtanalys
  </a>

  <a href="tel:+46701234567" className="btn btn-secondary">
    Ring oss
  </a>

          </div>
        </div>
      </Container>
    </section>
  );
}