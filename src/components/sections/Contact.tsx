import Container from "../ui/Container";
import Reveal from "../ui/Reveal";

export default function Contact() {
  return (
   <section id="contact" className="contact-section">
  <Container>

    <div className="contact-layout">

      {/* LEFT SIDE */}
      <div className="contact-text">

        <h2>Låt oss analysera er tillväxtpotential.</h2>

        <p>
          Vi bokar ett strategisamtal där vi analyserar nuläget,
          identifierar flaskhalsar och visar hur ni kan skala lönsamt.
        </p>

        <ul className="contact-benefits">
          <li>✓ Ingen bindningstid</li>
          <li>✓ Konkret analys</li>
          <li>✓ Tydlig plan framåt</li>
        </ul>

      </div>

      {/* RIGHT SIDE */}
     <form className="contact-form">

  <div className="form-row">
    <input type="text" placeholder="Namn" />
    <input type="tel" placeholder="Telefonnummer" />
  </div>

  <div className="form-row">
    <input type="email" placeholder="E-post" />
    <input type="text" placeholder="Företag" />
  </div>

  <textarea placeholder="Berätta kort om era tillväxtmål..."></textarea>

  <button className="btn-primary">
    Boka strategimöte
  </button>

</form>

    </div>

  </Container>
</section>
  );
}