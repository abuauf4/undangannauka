'use client';

import { motion } from 'framer-motion';
import { SectionReveal } from './section-reveal';
import { BatikBorderFrame } from './batik-border-frame';
import { useInvitationTheme } from './theme-provider';
import {
  MegamendungLeft,
  MegamendungRight,
  ArchedPhotoFrame,
  JavaneseGoldDivider,
  AksaraJawaOrnament,
  BatikStripBorder,
  WayangBottomScene,
} from './javanese-ornaments';

interface MempelaiProps {
  namaPria?: string;
  namaWanita?: string;
  namaOrtuPria?: string | null;
  namaOrtuWanita?: string | null;
  greeting?: string | null;
  fotoPria?: string | null;
  fotoWanita?: string | null;
  fotoBackground?: string | null;
}

export function Mempelai({
  namaPria = 'Ahmad Fauzan',
  namaWanita = 'Aisyah Putri',
  namaOrtuPria = 'Bapak H. Muhammad Rizki & Ibu Hj. Siti Aminah',
  namaOrtuWanita = 'Bapak H. Abdullah Hakim & Ibu Hj. Fatimah Zahra',
  greeting,
  fotoPria,
  fotoWanita,
  fotoBackground,
}: MempelaiProps) {
  const { nuansa, adatKey, adat } = useInvitationTheme();
  const isJawa = adatKey === 'jawa';

  // Determine intro text based on nuansa
  const isIslam = !greeting || greeting.toLowerCase().includes('assalamu') || greeting.toLowerCase().includes('salam');
  const introText = isIslam
    ? nuansa.introText
    : 'Dengan penuh sukacita, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia kami';

  // Use provided background or default
  const bgImage = fotoBackground || '/wedding-couple-bg.jpg';

  /* ─── JAVANESE THEME ─── */
  if (isJawa) {
    return (
      <section className="relative py-16 md:py-24 overflow-hidden" style={{ backgroundColor: '#F5F0E6' }}>
        {/* Aged paper texture background */}
        <div className="absolute inset-0 inv-jawa-aged-paper" />
        <div className="absolute inset-0 inv-jawa-truntum-bg opacity-30" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          {/* Aksara Jawa decorative */}
          <SectionReveal direction="fade">
            <AksaraJawaOrnament className="mb-4" />
          </SectionReveal>

          {/* Intro text */}
          <SectionReveal direction="fade">
            <p
              className="mb-6 text-sm md:text-base tracking-wide max-w-lg mx-auto"
              style={{ color: '#5D4A3A' }}
            >
              {introText}
            </p>
          </SectionReveal>

          {/* Javanese cultural greeting */}
          <SectionReveal direction="fade">
            <p
              className="mb-8 text-xs italic"
              style={{ color: '#D4AF37', opacity: 0.8 }}
            >
              {adat.culturalGreeting}
            </p>
          </SectionReveal>

          {/* Gold divider */}
          <JavaneseGoldDivider className="mb-8" />

          {/* Megamendung clouds + Couple section */}
          <SectionReveal direction="scale" delay={0.3}>
            <div className="relative mx-auto max-w-lg py-6">
              {/* Double gold border frame */}
              <div className="absolute inset-0 border-2" style={{ borderColor: '#D4AF37', opacity: 0.3, borderRadius: 4 }} />
              <div className="absolute inset-3 border" style={{ borderColor: '#3A2A1A', opacity: 0.1, borderRadius: 4 }} />

              {/* Megamendung cloud — left */}
              <div className="absolute -left-8 md:-left-16 top-8 w-16 md:w-24 opacity-40">
                <MegamendungLeft />
              </div>

              {/* Megamendung cloud — right */}
              <div className="absolute -right-8 md:-right-16 top-8 w-16 md:w-24 opacity-40">
                <MegamendungRight />
              </div>

              {/* Groom */}
              <div className="relative mb-8 px-4">
                {fotoPria && (
                  <ArchedPhotoFrame
                    src={fotoPria}
                    alt={namaPria}
                    className="mb-4"
                  />
                )}
                <h2
                  className="font-serif text-3xl font-bold md:text-4xl"
                  style={{
                    color: '#3A2A1A',
                    fontFamily: 'var(--font-playfair)',
                    textShadow: '1px 1px 0 rgba(212,175,55,0.15)',
                  }}
                >
                  {namaPria}
                </h2>
                {namaOrtuPria && (
                  <p className="text-sm font-medium mt-2" style={{ color: '#5D4A3A' }}>
                    {namaOrtuPria}
                  </p>
                )}
              </div>

              {/* Aksara Jawa "dan" (ꦢꦤ꧀) divider */}
              <div className="my-4">
                <motion.span
                  className="font-serif text-4xl md:text-5xl inline-block"
                  style={{
                    color: '#D4AF37',
                    textShadow: '0 0 20px rgba(212,175,55,0.3)',
                  }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  ꦢꦤ꧀
                </motion.span>
              </div>

              {/* Bride */}
              <div className="relative mt-8 px-4">
                {fotoWanita && (
                  <ArchedPhotoFrame
                    src={fotoWanita}
                    alt={namaWanita}
                    className="mb-4"
                  />
                )}
                <h2
                  className="font-serif text-3xl font-bold md:text-4xl"
                  style={{
                    color: '#3A2A1A',
                    fontFamily: 'var(--font-playfair)',
                    textShadow: '1px 1px 0 rgba(212,175,55,0.15)',
                  }}
                >
                  {namaWanita}
                </h2>
                {namaOrtuWanita && (
                  <p className="text-sm font-medium mt-2" style={{ color: '#5D4A3A' }}>
                    {namaOrtuWanita}
                  </p>
                )}
              </div>
            </div>
          </SectionReveal>

          {/* Gold divider */}
          <JavaneseGoldDivider className="my-8" />

          {/* Javanese Pepatah section */}
          <SectionReveal direction="fade" delay={0.5}>
            <div className="mx-auto max-w-md">
              <p
                className="text-xs italic leading-relaxed"
                style={{ color: '#5D4A3A' }}
              >
                &ldquo;{adat.pepatah}&rdquo;
              </p>
              <p
                className="mt-2 text-[10px] uppercase tracking-widest"
                style={{ color: '#D4AF37', opacity: 0.7 }}
              >
                — {adat.pepatahSource} —
              </p>
            </div>
          </SectionReveal>

          {/* Batik strip border */}
          <div className="mt-10">
            <BatikStripBorder showHorse />
          </div>

          {/* Wayang bottom scene */}
          <div className="mt-2">
            <WayangBottomScene className="opacity-50" />
          </div>
        </div>
      </section>
    );
  }

  /* ─── NON-JAWA THEME: Original mempelai layout ─── */
  return (
    <section
      className="relative py-20 md:py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--inv-bg)' }}
    >
      {/* Background Photo with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Couple background"
          className="h-full w-full object-cover"
          style={{ filter: 'blur(2px) brightness(0.4)', transform: 'scale(1.05)' }}
        />
        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              to bottom,
              var(--inv-bg) 0%,
              color-mix(in srgb, var(--inv-primary) 75%, transparent) 20%,
              color-mix(in srgb, var(--inv-primary) 85%, transparent) 50%,
              color-mix(in srgb, var(--inv-primary) 75%, transparent) 80%,
              var(--inv-bg) 100%
            )`,
          }}
        />
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 inv-arabesque-bg opacity-[0.06]" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        {/* Top ornamental flourish */}
        <SectionReveal direction="fade">
          <div className="mx-auto mb-6 flex w-48 items-center justify-center gap-2">
            <div className="h-px flex-1" style={{ backgroundColor: 'var(--inv-accent)', opacity: 0.5 }} />
            <svg width="20" height="20" viewBox="0 0 20 20" style={{ fill: 'var(--inv-accent)', opacity: 0.6 }}>
              <path d="M10 0L12.5 7.5L20 10L12.5 12.5L10 20L7.5 12.5L0 10L7.5 7.5Z" />
            </svg>
            <div className="h-px flex-1" style={{ backgroundColor: 'var(--inv-accent)', opacity: 0.5 }} />
          </div>
        </SectionReveal>

        {/* Intro text */}
        <SectionReveal direction="fade">
          <p
            className="mb-10 text-sm md:text-base tracking-wide"
            style={{ color: 'var(--inv-text-muted)' }}
          >
            {introText}
          </p>
        </SectionReveal>

        {/* Couple section with batik border frame */}
        <SectionReveal direction="scale" delay={0.3}>
          <BatikBorderFrame variant="full" className="mx-auto max-w-lg py-10 px-6">
            {/* Groom */}
            <div className="mb-8">
              {fotoPria && (
                <div
                  className="mx-auto mb-4 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full md:h-32 md:w-32"
                  style={{
                    border: '3px solid var(--inv-accent)',
                    boxShadow: '0 0 20px rgba(199, 183, 163, 0.3)',
                  }}
                >
                  <img src={fotoPria} alt={namaPria} className="h-full w-full object-cover" />
                </div>
              )}
              <h2
                className="font-serif text-3xl font-bold md:text-4xl"
                style={{ color: 'var(--inv-accent)', fontFamily: 'var(--font-playfair)' }}
              >
                {namaPria}
              </h2>
              {namaOrtuPria && (
                <p className="text-sm font-medium mt-2" style={{ color: 'var(--inv-text-muted)' }}>
                  {namaOrtuPria}
                </p>
              )}
            </div>

            {/* Ampersand divider */}
            <div className="my-6">
              <motion.span
                className="font-serif text-5xl md:text-6xl"
                style={{ color: 'var(--inv-accent)', fontFamily: 'var(--font-playfair)' }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                &amp;
              </motion.span>
            </div>

            {/* Bride */}
            <div className="mt-8">
              {fotoWanita && (
                <div
                  className="mx-auto mb-4 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full md:h-32 md:w-32"
                  style={{
                    border: '3px solid var(--inv-accent)',
                    boxShadow: '0 0 20px rgba(199, 183, 163, 0.3)',
                  }}
                >
                  <img src={fotoWanita} alt={namaWanita} className="h-full w-full object-cover" />
                </div>
              )}
              <h2
                className="font-serif text-3xl font-bold md:text-4xl"
                style={{ color: 'var(--inv-accent)', fontFamily: 'var(--font-playfair)' }}
              >
                {namaWanita}
              </h2>
              {namaOrtuWanita && (
                <p className="text-sm font-medium mt-2" style={{ color: 'var(--inv-text-muted)' }}>
                  {namaOrtuWanita}
                </p>
              )}
            </div>
          </BatikBorderFrame>
        </SectionReveal>

        {/* Bottom ornamental line */}
        <SectionReveal direction="fade" delay={0.6}>
          <div className="mx-auto my-10 flex w-48 items-center justify-center gap-2">
            <div className="h-px flex-1" style={{ backgroundColor: 'var(--inv-accent)', opacity: 0.5 }} />
            <svg width="20" height="20" viewBox="0 0 20 20" style={{ fill: 'var(--inv-accent)', opacity: 0.6 }}>
              <path d="M10 0L12.5 7.5L20 10L12.5 12.5L10 20L7.5 12.5L0 10L7.5 7.5Z" />
            </svg>
            <div className="h-px flex-1" style={{ backgroundColor: 'var(--inv-accent)', opacity: 0.5 }} />
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
