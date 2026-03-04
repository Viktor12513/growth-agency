import { jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
export default function Counter({ from = 0, to, duration = 2000, // slightly longer for premium feel
suffix = "", }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [value, setValue] = useState(from);
    useEffect(() => {
        if (!isInView)
            return;
        let startTime = null;
        // MUCH stronger slowdown near the end
        const easeOutExpo = (t) => {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        };
        const animate = (timestamp) => {
            if (!startTime)
                startTime = timestamp;
            const progress = timestamp - startTime;
            const progressRatio = Math.min(progress / duration, 1);
            const easedProgress = easeOutExpo(progressRatio);
            const currentValue = from + (to - from) * easedProgress;
            setValue(Math.round(currentValue));
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }, [isInView, from, to, duration]);
    return (_jsxs("span", { ref: ref, children: [value, suffix] }));
}
