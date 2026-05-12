'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoveQuotesProps {
  quotes?: { text: string; source?: string }[];
}

const islamicQuotes = [
  { text: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan dari jenismu sendiri, supaya kamu merasa tenteram kepadanya.', source: 'QS. Ar-Rum: 21' },
  { text: 'Perempuan-perempuan yang baik adalah untuk laki-laki yang baik, dan laki-laki yang baik untuk perempuan yang baik.', source: 'QS. An-Nur: 26' },
  { text: 'Sebaik-baik kalian adalah yang paling baik kepada istrinya.', source: 'HR. Tirmidzi' },
  { text: 'Jika seseorang menikah, maka ia telah menyempurnakan separuh agamanya. Maka bertakwalah kepada Allah untuk separuh yang lain.', source: 'HR. Baihaqi' },
  { text: 'Tidaklah dua orang muslim berkumpul (dalam ikatan nikah) kecuali Allah mengabulkan doa di antara mereka.', source: 'HR. Ahmad' },
];

export function LoveQuotes({ quotes = islamicQuotes }: LoveQuotesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <div className="relative mx-auto max-w-lg text-center py-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-xs italic leading-relaxed md:text-sm"
            style={{ color: 'var(--inv-text-muted)' }}
          >
            &ldquo;{quotes[currentIndex].text}&rdquo;
          </p>
          {quotes[currentIndex].source && (
            <p
              className="mt-2 text-[10px] font-semibold tracking-wider uppercase"
              style={{ color: 'var(--inv-accent)', opacity: 0.6 }}
            >
              {quotes[currentIndex].source}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Dots indicator */}
      <div className="mt-4 flex justify-center gap-1.5">
        {quotes.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className="h-1.5 rounded-full transition-all cursor-pointer"
            style={{
              width: i === currentIndex ? 16 : 6,
              backgroundColor: i === currentIndex ? 'var(--inv-accent)' : 'var(--inv-accent-soft)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
