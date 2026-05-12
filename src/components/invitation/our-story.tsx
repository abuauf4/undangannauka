'use client';

import { motion } from 'framer-motion';
import { SectionReveal } from './section-reveal';

interface StoryMilestone {
  date: string;
  title: string;
  description: string;
  icon?: 'heart' | 'ring' | 'home' | 'star';
}

interface OurStoryProps {
  milestones?: StoryMilestone[];
}

const defaultMilestones: StoryMilestone[] = [
  {
    date: '2019',
    title: 'Pertama Bertemu',
    description: 'Kami pertama kali bertemu di sebuah acara kampus. Senyummu yang hangat membuatku ingin mengenalmu lebih dekat.',
    icon: 'star',
  },
  {
    date: '2020',
    title: 'Mulai Dekat',
    description: 'Obrolan ringan berubah menjadi percakapan panjang hingga dini hari. Kami menyadari ada kecocokan yang tak bisa dipungkiri.',
    icon: 'heart',
  },
  {
    date: '2023',
    title: 'Lamaran',
    description: 'Di tengah mawar dan lilin, aku meluncurkan pertanyaan yang telah lama kunanti. Dan kau menjawab "Ya".',
    icon: 'ring',
  },
  {
    date: '2024',
    title: 'Menuju Pelaminan',
    description: 'Dengan izin Allah, kami siap melangkah bersama membangun rumah tangga penuh cinta dan keberkahan.',
    icon: 'home',
  },
];

const iconMap = {
  heart: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ),
  ring: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C9.24 2 7 4.24 7 7c0 1.63.78 3.08 2 4v1c0 2.21 1.79 4 4 4s4-1.79 4-4v-1c1.22-.92 2-2.37 2-4 0-2.76-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm1 10c0 1.1-.9 2-2 2s-2-.9-2-2v-.73c.63.22 1.3.37 2 .37s1.37-.15 2-.37V14z" />
    </svg>
  ),
  home: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  ),
  star: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  ),
};

export function OurStory({ milestones = defaultMilestones }: OurStoryProps) {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden" style={{ backgroundColor: 'var(--inv-bg)' }}>
      {/* Background pattern */}
      <div className="absolute inset-0 inv-arabesque-bg opacity-[0.04]" />

      <div className="relative z-10 mx-auto max-w-4xl px-4">
        {/* Section Header */}
        <SectionReveal direction="scale">
          <div className="mb-12 text-center">
            {/* Decorative top ornament */}
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
              Cerita Kami
            </h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--inv-text-muted)' }}>
              Perjalanan cinta yang membawa kami ke hari ini
            </p>
          </div>
        </SectionReveal>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
            style={{ backgroundColor: 'var(--inv-accent)', opacity: 0.2 }}
          />

          {milestones.map((milestone, index) => (
            <SectionReveal
              key={index}
              direction={index % 2 === 0 ? 'left' : 'right'}
              delay={index * 0.15}
            >
              <div className={`relative mb-12 flex items-center ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}>
                {/* Content card */}
                <div className="w-5/12">
                  <motion.div
                    className="rounded-lg p-5"
                    style={{
                      backgroundColor: 'var(--inv-bg-pattern)',
                      border: '1px solid var(--inv-accent-soft)',
                    }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p
                      className="mb-1 text-xs font-semibold uppercase tracking-widest"
                      style={{ color: 'var(--inv-accent)' }}
                    >
                      {milestone.date}
                    </p>
                    <h3
                      className="mb-2 font-serif text-lg font-bold"
                      style={{ color: 'var(--inv-text)', fontFamily: 'var(--font-playfair)' }}
                    >
                      {milestone.title}
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--inv-text-muted)' }}>
                      {milestone.description}
                    </p>
                  </motion.div>
                </div>

                {/* Center dot with icon */}
                <div className="absolute left-1/2 -translate-x-1/2 z-10">
                  <motion.div
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: 'var(--inv-primary)',
                      border: '2px solid var(--inv-accent)',
                      color: 'var(--inv-accent)',
                    }}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {iconMap[milestone.icon || 'heart']}
                  </motion.div>
                </div>

                {/* Spacer for the other side */}
                <div className="w-5/12" />
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
