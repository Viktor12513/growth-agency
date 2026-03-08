import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Container from "../ui/Container";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

export default function Cases() {
  const cases = [
    {
      image: "/images/sorangs.png",
      quote:
        "Nordväxt hjälpte oss skapa en tydlig struktur för vår digitala närvaro och generera fler kvalificerade förfrågningar från rätt kunder.",
      company: "— Christer Gunnarsson",
      industry: "VD, Sörängs Glas",
    },
    {
      image: "/images/lindsjos.png",
      quote:
        "Vi fick en tydlig strategi och bättre synlighet online. Det har lett till fler seriösa kundförfrågningar och bättre affärer.",
      company: "— Pierre Lindsjö",
      industry: "VD, Lindsjös Måleri & Byggnadsvård",
    },
    {
      image: "/images/pvsab.png",
      quote:
        "Nordväxt hjälpte oss strukturera vår marknadsföring och skapa ett system för kontinuerlig tillväxt. Vi har sett en markant förbättring i både synlighet och konverteringar.",
      company: "— Piotr Zgliczynski",
      industry: "VD, PVS AB",
    },
    {
      image: "/images/sorangs.png",
      quote:
        "Nordväxt hjälpte oss skapa en tydlig struktur för vår digitala närvaro och generera fler kvalificerade förfrågningar från rätt kunder.",
      company: "— Christer Gunnarsson",
      industry: "VD, Sörängs Glas",
    },
    {
      image: "/images/lindsjos.png",
      quote:
        "Vi fick en tydlig strategi och bättre synlighet online. Det har lett till fler seriösa kundförfrågningar och bättre affärer.",
      company: "— Pierre Lindsjö",
      industry: "VD, Lindsjös Måleri & Byggnadsvård",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="case" className="section case-section">
      <Container>
        <div className="case-layout">

          {/* LEFT SIDE – Dynamic Text */}
          <div className="case-text">
            <h2 className="section-title">
              Vad företag <span>säger om oss</span>
            </h2>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
              >
                <blockquote>
                  {cases[activeIndex].quote}
                </blockquote>

                <div className="case-company">
                  <strong>{cases[activeIndex].company}</strong>
                  <p>{cases[activeIndex].industry}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            
          </div>

          {/* RIGHT SIDE – Carousel */}
          <div className="case-carousel">
            <Swiper
              modules={[Navigation, Pagination, EffectCoverflow]}
              effect="coverflow"
              centeredSlides={true}
              slidesPerView="auto"
              loop={true}
              speed={800}
              onSlideChange={(swiper) =>
                setActiveIndex(swiper.realIndex)
              }
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 200,
                modifier: 1,
                slideShadows: false,
              }}
              navigation
              pagination={{ clickable: true }}
            >
              {cases.map((item, index) => (
                <SwiperSlide key={index}>
                  <img src={item.image} alt={`Case ${index + 1}`} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

        </div>
      </Container>
    </section>
  );
}