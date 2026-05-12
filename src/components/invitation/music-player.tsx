'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Music, Music2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { MusicVisualizer } from './music-visualizer';

interface MusicPlayerProps {
  musikUrl?: string;
  autoPlay?: boolean;
}

export function MusicPlayer({ musikUrl, autoPlay = true }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Setup audio element
  useEffect(() => {
    if (musikUrl && musikUrl !== 'none') {
      try {
        audioRef.current = new Audio(musikUrl);
        audioRef.current.loop = true;
      } catch {
        audioRef.current = null;
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [musikUrl]);

  // Auto-play on mount (after envelope open)
  useEffect(() => {
    if (autoPlay && !hasAutoPlayed && audioRef.current && musikUrl && musikUrl !== 'none') {
      // Small delay to ensure audio is ready
      const timer = setTimeout(() => {
        audioRef.current?.play().then(() => {
          setIsPlaying(true);
          setHasAutoPlayed(true);
        }).catch(() => {
          // Browser blocked autoplay — user needs to click play
          // This is normal for browsers that require user gesture first
          setHasAutoPlayed(true);
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, hasAutoPlayed, musikUrl]);

  // Play/Pause control
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
      {/* Visualizer bars - shown when playing */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center rounded-full px-3 py-2"
            style={{
              backgroundColor: 'var(--inv-primary)',
              border: '1px solid var(--inv-accent-soft)',
            }}
          >
            <MusicVisualizer isPlaying={isPlaying} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play/Pause button */}
      <motion.button
        onClick={() => setIsPlaying(!isPlaying)}
        className="flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-colors cursor-pointer"
        style={{
          backgroundColor: 'var(--inv-primary)',
          border: '2px solid var(--inv-accent)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="playing"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Music className="h-5 w-5" style={{ color: 'var(--inv-accent)' }} />
            </motion.div>
          ) : (
            <motion.div
              key="paused"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -180 }}
              transition={{ duration: 0.3 }}
            >
              <Music2 className="h-5 w-5" style={{ color: 'var(--inv-accent)' }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse animation when playing */}
        {isPlaying && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: '2px solid var(--inv-accent)' }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.button>
    </div>
  );
}
