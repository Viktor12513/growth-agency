import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

type CounterProps = {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
};

export default function Counter({
  from = 0,
  to,
  duration = 2000, // slightly longer for premium feel
  suffix = "",
}: CounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true });
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;

    // MUCH stronger slowdown near the end
    const easeOutExpo = (t: number) => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

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

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}