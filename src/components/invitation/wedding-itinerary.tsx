'use client';

import { SectionReveal } from './section-reveal';

interface ItineraryItem {
  time: string;
  event: string;
  description: string;
}

interface WeddingItineraryProps {
  items?: ItineraryItem[];
}

const defaultItems: ItineraryItem[] = [
  { time: '07:00', event: 'Persiapan Mempelai', description: 'Makeup & styling mempelai wanita' },
  { time: '09:00', event: 'Akad Nikah', description: 'Ijab kabul di masjid' },
  { time: '10:30', event: 'Foto Sesi', description: 'Photo session bersama keluarga' },
  { time: '12:00', event: 'Resepsi', description: 'Makan bersama tamu undangan' },
  { time: '14:00', event: 'Entertain', description: 'Hiburan & persembahan dari sahabat' },
  { time: '15:30', event: 'Penutup', description: 'Bersama foto & pamitan' },
];

export function WeddingItinerary({ items = defaultItems }: WeddingItineraryProps) {
  return (
    <section className="relative py-16 md:py-24" style={{ backgroundColor: 'var(--inv-bg)' }}>
      <div className="absolute inset-0 inv-ivory-pattern-bg opacity-[0.03]" />

      <div className="relative z-10 mx-auto max-w-3xl px-4">
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
              Susunan Acara
            </h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--inv-text-muted)' }}>
              Rangkaian acara di hari bahagia kami
            </p>
          </div>
        </SectionReveal>

        {/* Timeline */}
        <div className="relative">
          {items.map((item, index) => (
            <SectionReveal key={index} direction="up" delay={index * 0.1}>
              <div className="relative flex items-start gap-4 pb-8 last:pb-0">
                {/* Timeline line */}
                {index < items.length - 1 && (
                  <div
                    className="absolute left-[19px] top-10 h-[calc(100%-20px)] w-px"
                    style={{ backgroundColor: 'var(--inv-accent)', opacity: 0.15 }}
                  />
                )}

                {/* Time badge */}
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: 'var(--inv-primary)',
                    color: 'var(--inv-accent)',
                    border: '2px solid var(--inv-accent-soft)',
                  }}
                >
                  {item.time.split(':')[0]}
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-xs font-semibold tracking-wider"
                      style={{ color: 'var(--inv-accent)' }}
                    >
                      {item.time}
                    </span>
                  </div>
                  <h3
                    className="font-serif text-base font-bold md:text-lg"
                    style={{ color: 'var(--inv-text)', fontFamily: 'var(--font-playfair)' }}
                  >
                    {item.event}
                  </h3>
                  <p className="text-xs mt-1" style={{ color: 'var(--inv-text-muted)' }}>
                    {item.description}
                  </p>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
