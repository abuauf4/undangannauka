'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { ReactNode } from 'react';

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  /** Parallax speed: 0 = no parallax, 1 = full parallax. Default 0.15 for subtlety */
  speed?: number;
  /** Background pattern class to apply parallax to (e.g. 'inv-arabesque-bg', 'inv-ivory-pattern-bg') */
  bgPattern?: string;
  style?: React.CSSProperties;
}

export function ParallaxSection({
  children,
  className = '',
  speed = 0.15,
  bgPattern,
  style,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Transform scroll progress to a subtle Y offset for parallax
  const bgY = useTransform(scrollYProgress, [0, 1], [-30 * speed, 30 * speed]);

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {/* Parallax background layer */}
      {bgPattern && (
        <motion.div
          className={`absolute inset-0 ${bgPattern} opacity-30`}
          style={{ y: bgY }}
        />
      )}
      {/* Content layer — no parallax, sits on top */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}
