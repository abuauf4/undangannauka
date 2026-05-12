'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SectionReveal } from './section-reveal';

interface FlipDigitProps {
  digit: number;
  label: string;
}

function FlipDigit({ digit, label }: FlipDigitProps) {
  const [currentDigit, setCurrentDigit] = useState(digit);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (digit !== currentDigit) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setCurrentDigit(digit);
        setTimeout(() => setIsFlipping(false), 300);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [digit, currentDigit]);

  const displayDigit = String(currentDigit).padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      <div className="relative overflow-hidden rounded-lg" style={{ perspective: '300px' }}>
        {/* Top half */}
        <div
          className="flex h-12 w-14 items-end justify-center rounded-t-lg pb-0.5 md:h-16 md:w-18"
          style={{
            backgroundColor: 'var(--inv-primary)',
            borderBottom: '1px solid var(--inv-primary-dark)',
          }}
        >
          <span
            className="font-serif text-2xl font-bold md:text-3xl"
            style={{ color: 'var(--inv-accent)', fontFamily: 'var(--font-playfair)' }}
          >
            {displayDigit}
          </span>
        </div>
        {/* Bottom half */}
        <div
          className="flex h-12 w-14 items-start justify-center rounded-b-lg pt-0.5 md:h-16 md:w-18"
          style={{
            backgroundColor: 'var(--inv-primary-dark)',
          }}
        >
          <span
            className="font-serif text-2xl font-bold md:text-3xl"
            style={{ color: 'var(--inv-accent)', fontFamily: 'var(--font-playfair)', opacity: 0.9 }}
          >
            {displayDigit}
          </span>
        </div>

        {/* Flip animation overlay */}
        {isFlipping && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center rounded-lg"
            style={{ backgroundColor: 'var(--inv-primary-dark)' }}
            initial={{ rotateX: 0, opacity: 1 }}
            animate={{ rotateX: -90, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeIn' }}
          >
            <span
              className="font-serif text-2xl font-bold md:text-3xl"
              style={{ color: 'var(--inv-accent)', fontFamily: 'var(--font-playfair)' }}
            >
              {displayDigit}
            </span>
          </motion.div>
        )}
      </div>

      {/* Label */}
      <span
        className="mt-2 text-[10px] uppercase tracking-widest md:text-xs"
        style={{ color: 'var(--inv-text-muted)' }}
      >
        {label}
      </span>
    </div>
  );
}

interface CountdownProps {
  targetDate?: string;
}

export function Countdown({ targetDate }: CountdownProps) {
  // Use fixed future date as default to avoid hydration mismatch
  const defaultDate = new Date('2026-12-31T00:00:00');

  const target = targetDate ? new Date(targetDate) : defaultDate;

  const calculateTimeLeft = useCallback(() => {
    const now = new Date().getTime();
    const distance = target.getTime() - now;

    if (distance < 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    };
  }, [target]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return (
    <section className="relative py-16 md:py-24" style={{ backgroundColor: 'var(--inv-bg)' }}>
      <div className="absolute inset-0 inv-ivory-pattern-bg opacity-[0.03]" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        {/* Section Header */}
        <SectionReveal direction="scale">
          <div className="mb-10">
            <div className="mx-auto mb-4 flex w-40 items-center justify-center gap-2">
              <div className="h-px flex-1" style={{ backgroundColor: 'var(--inv-accent)', opacity: 0.4 }} />
              <svg width="16" height="16" viewBox="0 0 16 16" style={{ fill: 'var(--inv-accent)' }}>
                <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6Z" />
              </svg>
              <div className="h-px flex-1" style={{ backgroundColor: 'var(--inv-accent)', opacity: 0.4 }} />
            </div>
            <h2
              className="font-serif text-3xl font-bold md:text-4xl"
              style={{ color: 'var(--inv-accent)', fontFamily: 'var(--font-playfair)' }}
            >
              Menghitung Hari
            </h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--inv-text-muted)' }}>
              Menuju hari bahagia kami
            </p>
          </div>
        </SectionReveal>

        {/* Flip Clock */}
        <SectionReveal direction="up" delay={0.2}>
          <div className="flex items-center justify-center gap-3 md:gap-5">
            <FlipDigit digit={timeLeft.days} label="Hari" />
            <span
              className="mt-[-20px] font-serif text-3xl font-bold md:text-4xl"
              style={{ color: 'var(--inv-accent)' }}
            >
              :
            </span>
            <FlipDigit digit={timeLeft.hours} label="Jam" />
            <span
              className="mt-[-20px] font-serif text-3xl font-bold md:text-4xl"
              style={{ color: 'var(--inv-accent)' }}
            >
              :
            </span>
            <FlipDigit digit={timeLeft.minutes} label="Menit" />
            <span
              className="mt-[-20px] font-serif text-3xl font-bold md:text-4xl"
              style={{ color: 'var(--inv-accent)' }}
            >
              :
            </span>
            <FlipDigit digit={timeLeft.seconds} label="Detik" />
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
