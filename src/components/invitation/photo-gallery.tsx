'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Camera, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { SectionReveal } from './section-reveal';

// Stagger animation variants for the grid container
const gridContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

// Individual photo animation variants — fly in from below + scale + fade
const photoItemVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.8,
    rotateY: -15,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateY: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
      mass: 0.8,
    },
  },
};

// Placeholder gradients for demo mode
const placeholderPhotos = [
  { id: 1, gradient: 'from-[#800020] to-[#a0334d]', height: 'h-48' },
  { id: 2, gradient: 'from-[#C9A84C] to-[#d4b96a]', height: 'h-56' },
  { id: 3, gradient: 'from-[#5a0017] to-[#800020]', height: 'h-44' },
  { id: 4, gradient: 'from-[#b08f3a] to-[#C9A84C]', height: 'h-52' },
  { id: 5, gradient: 'from-[#a0334d] to-[#c9556d]', height: 'h-48' },
  { id: 6, gradient: 'from-[#800020] to-[#C9A84C]', height: 'h-56' },
];

/* ─── Staggered Photo Grid Component ─── */
function StaggeredPhotoGrid({
  hasPhotos,
  photos,
  previewMode,
  onSelectPhoto,
}: {
  hasPhotos: boolean;
  photos?: string[];
  previewMode: boolean;
  onSelectPhoto: (index: number) => void;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={gridRef}
      className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4"
      variants={gridContainerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      style={{ perspective: '1000px' }}
    >
      {hasPhotos ? (
        photos!.map((photoUrl, index) => (
          <motion.button
            key={index}
            variants={photoItemVariants}
            onClick={() => !previewMode && onSelectPhoto(index)}
            className={`group relative overflow-hidden rounded-lg ${
              index % 3 === 1 ? 'h-56 md:h-64' : 'h-44 md:h-52'
            } ${previewMode ? 'cursor-default' : 'cursor-pointer'}`}
            whileHover={{ scale: 1.03, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={photoUrl}
              alt={`Galeri foto ${index + 1}`}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Shimmer effect on entrance */}
            <motion.div
              className="absolute inset-0 z-10"
              initial={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)' }}
              animate={{ background: 'linear-gradient(105deg, transparent 40%, transparent 50%, transparent 60%)' }}
              transition={{ delay: index * 0.12 + 0.4, duration: 0.6 }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/30">
              <ZoomIn className="h-8 w-8 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-80" />
            </div>
          </motion.button>
        ))
      ) : (
        placeholderPhotos.map((photo, index) => (
          <motion.button
            key={photo.id}
            variants={photoItemVariants}
            onClick={() => !previewMode && onSelectPhoto(index)}
            className={`group relative ${photo.height} overflow-hidden rounded-lg ${previewMode ? 'cursor-default' : 'cursor-pointer'}`}
            whileHover={{ scale: 1.03, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${photo.gradient}`} />
            {/* Shimmer effect on entrance */}
            <motion.div
              className="absolute inset-0 z-10"
              initial={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)' }}
              animate={{ background: 'linear-gradient(105deg, transparent 40%, transparent 50%, transparent 60%)' }}
              transition={{ delay: index * 0.12 + 0.4, duration: 0.6 }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/30">
              <ZoomIn className="h-8 w-8 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-80" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Camera className="h-10 w-10 text-white/40" />
            </div>
          </motion.button>
        ))
      )}
    </motion.div>
  );
}

interface PhotoGalleryProps {
  photos?: string[];
  previewMode?: boolean;
}

export function PhotoGallery({ photos, previewMode = false }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const hasPhotos = photos && photos.length > 0;
  const totalCount = hasPhotos ? photos!.length : placeholderPhotos.length;

  const goToPrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + totalCount) % totalCount);
    setIsZoomed(false);
  }, [selectedIndex, totalCount]);

  const goToNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % totalCount);
    setIsZoomed(false);
  }, [selectedIndex, totalCount]);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev();
      else if (e.key === 'ArrowRight') goToNext();
      else if (e.key === 'Escape') { setSelectedIndex(null); setIsZoomed(false); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, goToPrev, goToNext]);

  // Touch swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToPrev();
      else goToNext();
    }
    setTouchStart(null);
  };

  return (
    <section className="relative py-16 md:py-24" style={{ backgroundColor: 'var(--inv-bg)' }}>
      <div className="absolute inset-0 inv-arabesque-bg opacity-[0.04]" />

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
              Galeri Foto
            </h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--inv-text-muted)' }}>
              Momen indah yang kami abadikan
            </p>
          </div>
        </SectionReveal>

        {/* Photo grid — Masonry-style with staggered entrance animation */}
        <StaggeredPhotoGrid
          hasPhotos={hasPhotos}
          photos={photos}
          previewMode={previewMode}
          onSelectPhoto={setSelectedIndex}
        />
      </div>

      {/* Interactive Lightbox */}
      <AnimatePresence>
        {!previewMode && selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={() => { setSelectedIndex(null); setIsZoomed(false); }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close button */}
            <button
              onClick={() => { setSelectedIndex(null); setIsZoomed(false); }}
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20 cursor-pointer"
            >
              <X size={24} />
            </button>

            {/* Prev arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); goToPrev(); }}
              className="absolute left-3 z-10 flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20 md:left-6 cursor-pointer"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Next arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20 md:right-6 cursor-pointer"
            >
              <ChevronRight size={28} />
            </button>

            {/* Photo */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: isZoomed ? 1.5 : 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative max-h-[85vh] max-w-[90vw] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {hasPhotos ? (
                <img
                  src={photos![selectedIndex]}
                  alt={`Galeri foto ${selectedIndex + 1}`}
                  className="max-h-[80vh] w-auto max-w-full rounded-lg object-contain"
                  onDoubleClick={() => setIsZoomed(!isZoomed)}
                />
              ) : (
                <div
                  className={`flex h-[60vh] w-[80vw] max-w-2xl items-center justify-center bg-gradient-to-br ${placeholderPhotos[selectedIndex].gradient} rounded-lg md:h-[70vh]`}
                >
                  <Camera className="h-24 w-24 text-white/30" />
                </div>
              )}
            </motion.div>

            {/* Counter & zoom hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
              <span className="rounded-full bg-black/50 px-4 py-1.5 text-sm text-white">
                {selectedIndex + 1} / {totalCount}
              </span>
              {hasPhotos && (
                <button
                  onClick={(e) => { e.stopPropagation(); setIsZoomed(!isZoomed); }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 cursor-pointer"
                >
                  <ZoomIn size={16} />
                </button>
              )}
            </div>

            {/* Thumbnail strip */}
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto px-4">
              {(hasPhotos ? photos! : placeholderPhotos.map(p => '')).map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setSelectedIndex(i); setIsZoomed(false); }}
                  className={`h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all cursor-pointer ${
                    i === selectedIndex ? 'border-white scale-110' : 'border-white/30 opacity-50 hover:opacity-80'
                  }`}
                >
                  {hasPhotos ? (
                    <img src={photos![i]} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className={`h-full w-full bg-gradient-to-br ${placeholderPhotos[i]?.gradient || 'from-gray-600 to-gray-800'}`} />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
