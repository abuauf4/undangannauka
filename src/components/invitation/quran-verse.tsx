'use client';

import { SectionReveal } from './section-reveal';
import { ParallaxSection } from './parallax-section';

interface QuranVerseProps {
  ayatQuote?: string | null;
}

export function QuranVerse({ ayatQuote }: QuranVerseProps) {
  // Default verse: QS. Ar-Rum: 21
  const defaultArabic = 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً';
  const defaultTranslation = 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan dari jenismu sendiri, supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.';
  const defaultReference = 'QS. Ar-Rum: 21';

  let displayArabic = defaultArabic;
  let displayTranslation = defaultTranslation;
  let displayReference = defaultReference;

  if (ayatQuote) {
    // Try to split by "||" delimiter for arabic||translation||reference
    // Or by "|" for arabic|translation
    const parts = ayatQuote.split('||');
    if (parts.length >= 3) {
      displayArabic = parts[0].trim();
      displayTranslation = parts[1].trim();
      displayReference = parts[2].trim();
    } else if (parts.length === 2) {
      displayArabic = parts[0].trim();
      displayTranslation = parts[1].trim();
      displayReference = '';
    } else {
      // Single string: show as the entire quote without splitting
      displayArabic = '';
      displayTranslation = ayatQuote.trim();
      displayReference = '';
    }
  }

  return (
    <ParallaxSection bgPattern="inv-arabesque-bg" className="py-16 md:py-24" style={{ backgroundColor: 'var(--inv-bg)' }}>
      <div className="mx-auto max-w-4xl px-4 text-center">
        {/* Opening gold quote mark */}
        <SectionReveal direction="scale">
          <div className="mb-4 flex justify-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              style={{ fill: 'var(--inv-accent)' }}
              opacity="0.6"
            >
              <path d="M14 28C14 23 17 18 22 16L21 14C14 16 10 22 10 30C10 34 12 36 15 36C18 36 20 34 20 31C20 28 18 26 15 26C14.5 26 14.2 26 14 28ZM28 28C28 23 31 18 36 16L35 14C28 16 24 22 24 30C24 34 26 36 29 36C32 36 34 34 34 31C34 28 32 26 29 26C28.5 26 28.2 26 28 28Z" />
            </svg>
          </div>
        </SectionReveal>

        {/* Arabic text */}
        {displayArabic && (
          <SectionReveal direction="reveal" delay={0.2}>
            <p
              className="mb-6 font-serif text-2xl leading-relaxed md:text-3xl lg:text-4xl"
              style={{ color: 'var(--inv-primary)' }}
              dir="rtl"
            >
              {displayArabic}
            </p>
          </SectionReveal>
        )}

        {/* Translation */}
        <SectionReveal direction="fade" delay={0.4}>
          <p
            className="mx-auto max-w-2xl text-sm leading-relaxed italic md:text-base"
            style={{ color: 'var(--inv-text-muted)' }}
          >
            &ldquo;{displayTranslation}&rdquo;
          </p>
        </SectionReveal>

        {/* Reference */}
        {displayReference && (
          <SectionReveal direction="fade" delay={0.5}>
            <p
              className="mt-4 font-serif text-base font-semibold"
              style={{ color: 'var(--inv-accent)' }}
            >
              {displayReference}
            </p>
          </SectionReveal>
        )}

        {/* Closing gold quote mark */}
        <SectionReveal direction="scale" delay={0.3}>
          <div className="mt-4 flex justify-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              opacity="0.6"
              style={{ transform: 'rotate(180deg)', fill: 'var(--inv-accent)' }}
            >
              <path d="M14 28C14 23 17 18 22 16L21 14C14 16 10 22 10 30C10 34 12 36 15 36C18 36 20 34 20 31C20 28 18 26 15 26C14.5 26 14.2 26 14 28ZM28 28C28 23 31 18 36 16L35 14C28 16 24 22 24 30C24 34 26 36 29 36C32 36 34 34 34 31C34 28 32 26 29 26C28.5 26 28.2 26 28 28Z" />
            </svg>
          </div>
        </SectionReveal>
      </div>
    </ParallaxSection>
  );
}
