import { motion } from "framer-motion";
import Container from "../ui/Container";
import Counter from "../ui/Counter";

export default function Metrics() {
  return (
    <section className="section section-dark">
      <Container>
        <motion.div
          className="metrics-grid"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div>
            <h2>
              <Counter to={240} suffix="%" />
            </h2>
            <p>Ökning av kvalificerade leads</p>
          </div>

          <div>
            <h2>
              <Counter to={3} suffix="x" />
            </h2>
            <p>Genomsnittlig ROAS för våra kunder</p>
          </div>

          <div>
            <h2>
              <Counter to={180} suffix="%" />
            </h2>
            <p>Ökning av organisk trafik</p>
          </div>

          <div>
            <h2>
              <Counter to={42} suffix="%" />
            </h2>
            <p>Lägre kostnad per konvertering</p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}