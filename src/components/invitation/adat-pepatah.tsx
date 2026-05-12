'use client';

import { motion } from 'framer-motion';
import { SectionReveal } from './section-reveal';
import { useInvitationTheme } from './theme-provider';

/**
 * AdatPepatah — Menampilkan pepatah/ungkapan tradisional sesuai adat.
 * Untuk Jawa: tampilkan pepatah Jawa dengan Aksara Jawa dekoratif.
 * Untuk adat lain: tampilkan ungkapan budaya masing-masing.
 * Untuk nuansa Islam + Jawa: tambah ayat sebagai konteks spiritual.
 */
export function AdatPepatah() {
  const { adat, adatKey, nuansaKey } = useInvitationTheme();
  const isJawa = adatKey === 'jawa';

  return (
    <section
      className="relative py-16 md:py-24 overflow-hidden"
      style={{ backgroundColor: 'var(--inv-bg-pattern)' }}
    >
      {/* Kawung pattern background for Jawa, arabesque for others */}
      <div className={`absolute inset-0 ${isJawa ? 'inv-kawung-bg' : 'inv-arabesque-bg'} opacity-[0.08]`} />

      <div className="relative z-10 mx-auto max-w-2xl px-4 text-center">
        {/* Aksara Jawa decorative — only for Jawa adat */}
        {isJawa && (
          <SectionReveal direction="fade">
            <p
              className="mb-6 text-4xl md:text-5xl tracking-[0.2em]"
              style={{ color: 'var(--inv-accent)', opacity: 0.3 }}
            >
              ꦱꦶꦤꦺꦴꦩ꧀
            </p>
          </SectionReveal>
        )}

        {/* Cultural ornament top */}
        <SectionReveal direction="fade">
          <div className="mx-auto mb-8 flex w-24 items-center justify-center gap-2">
            <div className="h-px flex-1" style={{ backgroundColor: 'var(--inv-accent)', opacity: 0.3 }} />
            <svg width="16" height="16" viewBox="0 0 16 16" style={{ fill: 'var(--inv-accent)', opacity: 0.5 }}>
              <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6Z" />
            </svg>
            <div className="h-px flex-1" style={{ backgroundColor: 'var(--inv-accent)', opacity: 0.3 }} />
          </div>
        </SectionReveal>

        {/* Pepatah text */}
        <SectionReveal direction="scale" delay={0.2}>
          <motion.blockquote
            className="font-serif text-base md:text-lg leading-relaxed italic"
            style={{ color: 'var(--inv-accent)', fontFamily: 'var(--font-playfair)' }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            &ldquo;{adat.pepatah}&rdquo;
          </motion.blockquote>
        </SectionReveal>

        {/* Pepatah source */}
        <SectionReveal direction="fade" delay={0.4}>
          <p
            className="mt-6 text-xs uppercase tracking-[0.2em]"
            style={{ color: 'var(--inv-accent)', opacity: 0.5 }}
          >
            — {adat.pepatahSource} —
          </p>
        </SectionReveal>

        {/* Wedding phrase */}
        <SectionReveal direction="fade" delay={0.5}>
          <p
            className="mt-4 text-sm"
            style={{ color: 'var(--inv-text-muted)' }}
          >
            {adat.weddingPhrase}
          </p>
        </SectionReveal>

        {/* Cultural ornament bottom */}
        <SectionReveal direction="fade" delay={0.6}>
          <div className="mx-auto mt-8 flex w-24 items-center justify-center gap-2">
            <div className="h-px flex-1" style={{ backgroundColor: 'var(--inv-accent)', opacity: 0.3 }} />
            <svg width="16" height="16" viewBox="0 0 16 16" style={{ fill: 'var(--inv-accent)', opacity: 0.5 }}>
              <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6Z" />
            </svg>
            <div className="h-px flex-1" style={{ backgroundColor: 'var(--inv-accent)', opacity: 0.3 }} />
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
