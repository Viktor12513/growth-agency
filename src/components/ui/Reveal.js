import { jsx as _jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
export default function Reveal({ children }) {
    return (_jsx(motion.div, { initial: { opacity: 0, y: 50 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease: "easeOut" }, viewport: { once: true, amount: 0.2 }, children: children }));
}
