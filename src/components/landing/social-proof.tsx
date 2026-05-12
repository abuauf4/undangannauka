"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Heart, Users, Gift, Star } from "lucide-react";

/* ─── Animated Counter Hook ─── */
function useAnimatedCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();
          const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
}

/* ─── Individual Stat Item ─── */
function StatItem({
  icon,
  value,
  suffix,
  label,
  delay,
}: {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  const { count, ref } = useAnimatedCounter(value);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center text-center group"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--gold)]/10 group-hover:bg-[var(--gold)]/20 transition-colors mb-3">
        {icon}
      </div>
      <div className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-foreground">
        {count.toLocaleString("id-ID")}
        <span className="text-[var(--gold)]">{suffix}</span>
      </div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </motion.div>
  );
}

/* ─── Main Component ─── */
export function SocialProof() {
  const stats = [
    {
      icon: <Gift className="size-5 text-[var(--gold)]" />,
      value: 1000,
      suffix: "+",
      label: "Undangan Terkirim",
    },
    {
      icon: <Users className="size-5 text-[var(--gold)]" />,
      value: 15000,
      suffix: "+",
      label: "Tamu Diundang",
    },
    {
      icon: <Heart className="size-5 text-[var(--gold)]" />,
      value: 99,
      suffix: "%",
      label: "Kepuasan Pengguna",
    },
    {
      icon: <Star className="size-5 text-[var(--gold)]" />,
      value: 49,
      suffix: "/5",
      label: "Rating Rata-rata",
    },
  ];

  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--burgundy)]/5 via-transparent to-[var(--gold)]/5" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, idx) => (
            <StatItem
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delay={idx * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
