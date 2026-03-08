import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Metrics from "../components/sections/Metrics";
import Hero from "../components/sections/Hero";
import Services from "../components/sections/Services";

import Cases from "../components/sections/Cases";
import About from "../components/sections/About";
import Contact from "../components/sections/Contact";
import ScalableGrowth from "../components/sections/ScalableGrowth";
import Authority from "../components/sections/Authority";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Metrics />
      <ScalableGrowth />
      <Authority />
      <Services />
      
      <Cases />
      <About />
      <Contact />
      <Footer />
    </>
  );
}