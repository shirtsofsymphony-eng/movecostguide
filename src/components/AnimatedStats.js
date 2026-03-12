'use client';
import { useEffect, useRef, useState } from 'react';

const stats = [
  { target: 100, suffix: '+', label: 'Cities' },
  { target: 9900, suffix: '+', label: 'Routes' },
  { target: 41, suffix: '', label: 'Checklist Tasks' },
];

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export default function AnimatedStats() {
  const ref = useRef(null);
  const hasAnimated = useRef(false);
  const [values, setValues] = useState(stats.map(() => 0));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1500;
          const start = performance.now();

          function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutCubic(progress);
            setValues(stats.map((s) => Math.round(eased * s.target)));
            if (progress < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-wrap justify-center gap-6 mt-10">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="bg-white/10 backdrop-blur-sm rounded-xl px-8 py-5 text-center min-w-[140px] border border-white/10"
        >
          <div className="text-3xl font-bold gradient-text">
            {values[i].toLocaleString()}
            {stat.suffix}
          </div>
          <div className="text-sm text-orange-200 font-medium mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
