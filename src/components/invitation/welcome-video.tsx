'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';

interface WelcomeVideoProps {
  videoUrl?: string;
  posterUrl?: string;
}

export function WelcomeVideo({ videoUrl, posterUrl }: WelcomeVideoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // If no video URL, don't render
  if (!videoUrl) return null;

  return (
    <>
      {/* Play button trigger */}
      <div className="relative mx-auto mb-8 max-w-sm">
        <motion.button
          onClick={() => setIsOpen(true)}
          className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl cursor-pointer"
          style={{
            border: '2px solid var(--inv-accent-soft)',
            aspectRatio: '16/9',
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Poster image or gradient background */}
          {posterUrl ? (
            <img
              src={posterUrl}
              alt="Video thumbnail"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: 'brightness(0.4)' }}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, var(--inv-primary) 0%, var(--inv-primary-dark) 100%)`,
              }}
            />
          )}

          {/* Play icon overlay */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full transition-all group-hover:scale-110"
              style={{
                backgroundColor: 'var(--inv-accent)',
                color: 'var(--inv-bg)',
              }}
            >
              <Play className="h-6 w-6 ml-1" />
            </div>
            <p className="text-xs font-medium tracking-wider uppercase" style={{ color: 'var(--inv-accent)' }}>
              Tonton Video Kami
            </p>
          </div>
        </motion.button>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute -top-10 right-0 flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20 cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Video */}
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                autoPlay
                className="w-full rounded-lg"
                style={{ maxHeight: '70vh' }}
              >
                <track kind="captions" />
              </video>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
