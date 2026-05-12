'use client';

import { motion } from 'framer-motion';
import { SectionReveal } from './section-reveal';
import { useInvitationTheme } from './theme-provider';
import { AksaraJawaOrnament, JavaneseGoldDivider } from './javanese-ornaments';

interface GuestWelcomeProps {
  guestName?: string;
}

export function GuestWelcome({ guestName = 'Tamu Undangan' }: GuestWelcomeProps) {
  const { adatKey, adat } = useInvitationTheme();
  const isJawa = adatKey === 'jawa';

  /* ─── JAVANESE THEME ─── */
  if (isJawa) {
    return (
      <section className="relative py-12 md:py-16 overflow-hidden" style={{ backgroundColor: '#F5F0E6' }}>
        {/* Aged paper texture */}
        <div className="absolute inset-0 inv-jawa-aged-paper" />
        <div className="absolute inset-0 inv-jawa-kawung-bg opacity-40" />

        <div className="relative z-10 mx-auto max-w-2xl px-4 text-center">
          <SectionReveal direction="up">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {/* Aksara Jawa */}
              <AksaraJawaOrnament className="mb-4" />

              <p
                className="mb-2 text-xs uppercase tracking-[0.3em]"
                style={{ color: '#5D4A3A' }}
              >
                Kepada Yth. Bapak/Ibu/Sedaya
              </p>
              <h2
                className="font-serif text-2xl font-bold md:text-3xl"
                style={{ color: '#D4AF37', fontFamily: 'var(--font-playfair)' }}
              >
                {guestName}
              </h2>

              <JavaneseGoldDivider className="my-5" />

              <p className="text-sm" style={{ color: '#5D4A3A' }}>
                Panjenengan katitahaken dhateng dinten bagya kula
              </p>

              {/* Javanese cultural greeting */}
              <p
                className="mt-2 text-xs italic"
                style={{ color: '#D4AF37', opacity: 0.7 }}
              >
                {adat.culturalGreeting}
              </p>
            </motion.div>
          </SectionReveal>
        </div>
      </section>
    );
  }

  /* ─── NON-JAWA THEME: Original layout ─── */
  return (
    <section className="relative py-12 md:py-16" style={{ backgroundColor: 'var(--inv-bg)' }}>
      <div className="absolute inset-0 inv-arabesque-bg opacity-[0.03]" />

      <div className="relative z-10 mx-auto max-w-2xl px-4 text-center">
        <SectionReveal direction="up">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <p
              className="mb-2 text-xs uppercase tracking-[0.3em]"
              style={{ color: 'var(--inv-text-muted)' }}
            >
              Kepada Yth.
            </p>
            <h2
              className="font-serif text-2xl font-bold md:text-3xl"
              style={{ color: 'var(--inv-accent)', fontFamily: 'var(--font-playfair)' }}
            >
              {guestName}
            </h2>
            <div className="mx-auto mt-4 flex w-32 items-center justify-center gap-2">
              <div className="h-px flex-1" style={{ backgroundColor: 'var(--inv-accent)', opacity: 0.3 }} />
              <svg width="12" height="12" viewBox="0 0 16 16" style={{ fill: 'var(--inv-accent)', opacity: 0.5 }}>
                <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6Z" />
              </svg>
              <div className="h-px flex-1" style={{ backgroundColor: 'var(--inv-accent)', opacity: 0.3 }} />
            </div>
            <p className="mt-4 text-sm" style={{ color: 'var(--inv-text-muted)' }}>
              Anda diundang ke hari bahagia kami
            </p>
          </motion.div>
        </SectionReveal>
      </div>
    </section>
  );
}
