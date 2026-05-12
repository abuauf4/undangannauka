'use client';

import { SectionReveal } from './section-reveal';
import { BatikBorderFrame } from './batik-border-frame';

interface BridesmaidGroomsmanProps {
  bridesmaids?: { name: string; role?: string }[];
  groomsmen?: { name: string; role?: string }[];
}

const defaultBridesmaids = [
  { name: 'Siti Rahma', role: 'Maid of Honor' },
  { name: 'Aisyah Dewi', role: 'Bridesmaid' },
  { name: 'Fatimah Zahra', role: 'Bridesmaid' },
];

const defaultGroomsmen = [
  { name: 'Muhammad Rizki', role: 'Best Man' },
  { name: 'Abdullah Hakim', role: 'Groomsman' },
  { name: 'Umar Faruq', role: 'Groomsman' },
];

export function BridesmaidGroomsman({
  bridesmaids = defaultBridesmaids,
  groomsmen = defaultGroomsmen,
}: BridesmaidGroomsmanProps) {
  return (
    <section className="relative py-16 md:py-24" style={{ backgroundColor: 'var(--inv-bg)' }}>
      <div className="absolute inset-0 inv-arabesque-bg opacity-[0.04]" />

      <div className="relative z-10 mx-auto max-w-4xl px-4">
        {/* Section Header */}
        <SectionReveal direction="scale">
          <div className="mb-12 text-center">
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
              Sahabat Kami
            </h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--inv-text-muted)' }}>
              Orang-orang terdekat yang mendampingi hari bahagia kami
            </p>
          </div>
        </SectionReveal>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Groomsmen */}
          <BatikBorderFrame variant="simple" className="py-6 px-4">
            <h3
              className="mb-5 font-serif text-xl font-semibold"
              style={{ color: 'var(--inv-accent)', fontFamily: 'var(--font-playfair)' }}
            >
              Best Man & Groomsmen
            </h3>
            <div className="space-y-4">
              {groomsmen.map((person, i) => (
                <SectionReveal key={i} direction="left" delay={i * 0.1}>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: 'var(--inv-primary)',
                        color: 'var(--inv-accent)',
                        border: '1px solid var(--inv-accent-soft)',
                      }}
                    >
                      {person.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold" style={{ color: 'var(--inv-text)' }}>
                        {person.name}
                      </p>
                      {person.role && (
                        <p className="text-xs" style={{ color: 'var(--inv-text-muted)' }}>
                          {person.role}
                        </p>
                      )}
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </BatikBorderFrame>

          {/* Bridesmaids */}
          <BatikBorderFrame variant="simple" className="py-6 px-4">
            <h3
              className="mb-5 font-serif text-xl font-semibold"
              style={{ color: 'var(--inv-accent)', fontFamily: 'var(--font-playfair)' }}
            >
              Maid of Honor & Bridesmaids
            </h3>
            <div className="space-y-4">
              {bridesmaids.map((person, i) => (
                <SectionReveal key={i} direction="right" delay={i * 0.1}>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: 'var(--inv-primary)',
                        color: 'var(--inv-accent)',
                        border: '1px solid var(--inv-accent-soft)',
                      }}
                    >
                      {person.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold" style={{ color: 'var(--inv-text)' }}>
                        {person.name}
                      </p>
                      {person.role && (
                        <p className="text-xs" style={{ color: 'var(--inv-text-muted)' }}>
                          {person.role}
                        </p>
                      )}
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </BatikBorderFrame>
        </div>
      </div>
    </section>
  );
}
