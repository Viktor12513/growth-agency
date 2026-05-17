import { useState } from "react";

export default function Contact() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [step, setStep] = useState<"choices" | "contact">("choices");

  const options = [
    {
      label: "Bli mer synlig n\u00e4r kunder s\u00f6ker online",
      icon: "G",
    },
    {
      label: "Bygga en hemsida som ger ett starkare intryck",
      icon: "WEB",
    },
    {
      label: "N\u00e5 ut bredare i fler digitala kanaler",
      icon: "PIN",
    },
    {
      label: "F\u00e5 varum\u00e4rket att k\u00e4nnas mer professionellt",
      icon: "ART",
    },
    {
      label: "Kom ig\u00e5ng med annonsering som driver leads",
      icon: "AD",
    },
    {
      label: "Hitta r\u00e4tt plan f\u00f6r att f\u00e5 fler kunder",
      icon: "?",
    },
  ];

  const toggleOption = (label: string) => {
    setSelectedOptions((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label]
    );
  };

  const showContactStep = () => {
    if (selectedOptions.length > 0) {
      setStep("contact");
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-choice-panel">
        <h2>
          {step === "choices"
            ? "Hur kan vi hj\u00e4lpa dig?"
            : "Hur kontaktar vi dig?"}
        </h2>

        {step === "choices" ? (
          <p>
            Baserat p&aring; vad som &auml;r viktigast f&ouml;r ditt f&ouml;retag
            hj&auml;lper vi dig hitta r&auml;tt hj&auml;lp.
          </p>
        ) : (
          <p>
            L&auml;mna dina uppgifter s&aring; kontaktar vi dig och pratar om hur
            vi kan hj&auml;lpa dig vidare.
          </p>
        )}

        {step === "choices" ? (
          <form className="contact-choice-form">
            <div className="contact-choice-grid">
              {options.map((option) => {
                const isSelected = selectedOptions.includes(option.label);

                return (
                  <label
                    className={`contact-choice ${
                      isSelected ? "contact-choice-selected" : ""
                    }`}
                    key={option.label}
                  >
                    <input
                      checked={isSelected}
                      name="help"
                      type="checkbox"
                      value={option.label}
                      onChange={() => toggleOption(option.label)}
                    />
                    <span className="contact-checkbox" />
                    <span className="contact-choice-label">{option.label}</span>
                    <span className="contact-choice-icon">{option.icon}</span>
                  </label>
                );
              })}
            </div>

            <button
              className="contact-next-button"
              type="button"
              disabled={selectedOptions.length === 0}
              onClick={showContactStep}
            >
              Forts&auml;tt
              <span>&rarr;</span>
            </button>
          </form>
        ) : (
          <form className="contact-details-form">
            <div className="contact-selected-summary">
              {selectedOptions.map((option) => (
                <span key={option}>{option}</span>
              ))}
            </div>

            <div className="contact-details-fields">
              <input type="email" name="email" placeholder="Din e-post" />
              <input type="tel" name="phone" placeholder="Ditt telefonnummer" />
            </div>

            <div className="contact-details-actions">
              <button
                className="contact-back-button"
                type="button"
                onClick={() => setStep("choices")}
              >
                Tillbaka
              </button>

              <button className="contact-next-button" type="submit">
                Skicka
                <span>&rarr;</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
