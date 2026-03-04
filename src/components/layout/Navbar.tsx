import { useEffect, useState } from "react";
import Container from "../ui/Container";
import Button from "../ui/Button";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <Container>
        <div className="nav-inner">
  <div className="nav-logo">
  <img src="/images/logo.png" alt="Digital Growth" />
</div>

          <ul className="nav-links">
            <li><a href="#tjanster">Tjänster</a></li>
            <li><a href="#process">Process</a></li>
            <li><a href="#case">Case</a></li>
            <li><a href="#om">Om oss</a></li>
          </ul>

          <Button>Boka kostnadsfri konultation</Button>
        </div>
      </Container>
    </nav>
  );
}