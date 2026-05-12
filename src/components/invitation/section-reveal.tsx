'use client';

import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right' | 'fade' | 'scale' | 'reveal';
  delay?: number;
  duration?: number;
}

const directionVariants: Record<string, Variants> = {
  // Rise from below with subtle scale — classic elegant entrance
  up: {
    hidden: { opacity: 0, y: 60, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  // Slide from left — traditional scroll unfurl feel
  left: {
    hidden: { opacity: 0, x: -60, scale: 0.97 },
    visible: { opacity: 1, x: 0, scale: 1 },
  },
  // Slide from right — mirror of left
  right: {
    hidden: { opacity: 0, x: 60, scale: 0.97 },
    visible: { opacity: 1, x: 0, scale: 1 },
  },
  // Gentle fade with subtle scale — for backgrounds and subtle elements
  fade: {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1 },
  },
  // Dramatic scale from center — like unfolding a letter
  scale: {
    hidden: { opacity: 0, scale: 0.85, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
  },
  // Clip-path reveal from center — like curtains opening
  reveal: {
    hidden: { opacity: 0, clipPath: 'inset(40% 40% 40% 40%)', scale: 0.9 },
    visible: { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', scale: 1 },
  },
};

export function SectionReveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  duration,
}: SectionRevealProps) {
  // Vary duration based on animation type for natural feel
  const defaultDuration = direction === 'reveal' ? 0.9 : direction === 'scale' ? 0.8 : 0.7;

  return (
    <motion.div
      variants={directionVariants[direction]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: duration ?? defaultDuration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Decelerate curve for elegant deceleration
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
