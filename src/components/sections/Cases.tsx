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
      image: "/images/case1.jpg",
      quote:
        "Digital Growth hjälpte oss skapa ett strukturerat system som ökade våra leads med 240%.",
      company: "VD, Techbolag",
      industry: "B2B SaaS",
    },
    {
      image: "/images/case2.jpg",
      quote:
        "Vi gick från sporadiska kampanjer till förutsägbar lönsam tillväxt.",
      company: "CMO, E-handel",
      industry: "E-commerce",
    },
    {
      image: "/images/case3.jpg",
      quote:
        "Struktur, tydliga KPI:er och kontinuerlig optimering gjorde hela skillnaden.",
      company: "Marknadschef",
      industry: "Fintech",
    },
    {
      image: "/images/case4.jpg",
      quote:
        "Vi tredubblade vår ROAS på mindre än 6 månader.",
      company: "VD",
      industry: "Retail",
    },
    {
      image: "/images/case5.jpg",
      quote:
        "Nu vet vi exakt vad som driver vår tillväxt varje månad.",
      company: "Growth Lead",
      industry: "SaaS",
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
              Vad våra <span>partners säger</span>
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

            <div className="case-company">
              <strong>{cases[activeIndex].company}</strong>
              <p>{cases[activeIndex].industry}</p>
            </div>
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