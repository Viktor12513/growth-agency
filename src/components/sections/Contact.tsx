import Container from "../ui/Container";
import Reveal from "../ui/Reveal";

export default function Contact() {
  return (
<section id="contact" className="contact-section">

  <div className="contact-container">

    {/* LEFT SIDE */}
    <div className="contact-left">

      <h2>
        Låt oss analysera er <span>tillväxtpotential</span>
      </h2>

      <p className="contact-intro">
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
    <div className="contact-card">

      <form className="contact-form">

        <div className="form-row">
          <input type="text" placeholder="Namn" />
          <input type="tel" placeholder="Telefonnummer" />
        </div>

        <div className="form-row">
          <input type="email" placeholder="E-post" />
          <input type="text" placeholder="Företag" />
        </div>

        <textarea
          placeholder="Berätta kort om era tillväxtmål..."
        />

        <button className="btn-primary">
          Boka strategimöte
        </button>

      </form>

    </div>

  </div>

</section>
  );
}