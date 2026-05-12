'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useInvitationTheme } from './theme-provider';
import { BatikScallopTop, BatikScallopBottom, WayangBottomScene, AksaraJawaOrnament, JavaneseGoldDivider } from './javanese-ornaments';

interface EnvelopeProps {
  guestName?: string;
  greeting?: string;
  fotoPria?: string | null;
  fotoWanita?: string | null;
  namaPria?: string;
  namaWanita?: string;
  nuansa?: string;
  adat?: string;
  onOpen: () => void;
}

export function Envelope({ guestName = 'Tamu Undangan', greeting, fotoPria, fotoWanita, namaPria, namaWanita, nuansa, adat, onOpen }: EnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const isIslam = nuansa !== 'umum';
  const isJawa = adat === 'jawa';
  const greetingText = greeting || (isIslam ? "Assalamu'alaikum Warahmatullahi Wabarakatuh" : "Dear Beloved Friends & Family");
  const displayPria = namaPria || '';
  const displayWanita = namaWanita || '';
  const hasPhotos = fotoPria || fotoWanita;

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    setTimeout(() => {
      setIsRevealed(true);
      setTimeout(() => {
        onOpen();
      }, 800);
    }, 600);
  };

  return (
    <AnimatePresence>
      {!isRevealed && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: 'var(--inv-envelope-bg)' }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* ─── JAVANESE THEME: Full authentic layout ─── */}
          {isJawa ? (
            <div className="relative inset-0 flex flex-col items-center justify-center w-full h-full">
              {/* Aged paper texture background */}
              <div className="absolute inset-0 inv-jawa-aged-paper" />
              <div className="absolute inset-0 inv-jawa-truntum-bg opacity-50" />

              {/* Subtle vignette */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(ellipse at center, transparent 40%, rgba(58,42,26,0.15) 100%)',
                }}
              />

              {/* Scalloped batik top border */}
              <div className="absolute top-0 left-0 right-0 z-20">
                <BatikScallopTop />
              </div>

              {/* Double gold border frame */}
              <div className="absolute inset-4 md:inset-8 pointer-events-none z-10">
                <div className="absolute inset-0 border-2" style={{ borderColor: '#D4AF37', opacity: 0.4 }} />
                <div className="absolute inset-3 border" style={{ borderColor: '#3A2A1A', opacity: 0.15 }} />
              </div>

              {/* Center content */}
              <motion.div
                className="relative z-10 w-[80vw] max-w-sm text-center px-6"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                {/* Aksara Jawa decorative */}
                <AksaraJawaOrnament className="mb-4" />

                {/* Bismillah Arabic — only for Islamic nuansa */}
                {isIslam && (
                  <motion.p
                    className="mb-4 font-serif text-2xl md:text-3xl"
                    style={{ color: '#3A2A1A' }}
                    dir="rtl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    بسم الله الرحمن الرحيم
                  </motion.p>
                )}
                {/* For non-Islamic nuansa */}
                {!isIslam && (
                  <motion.p
                    className="mb-4 font-serif text-2xl md:text-3xl uppercase tracking-[0.15em]"
                    style={{ color: '#3A2A1A' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    The Wedding Of
                  </motion.p>
                )}

                {/* Greeting text */}
                <motion.p
                  className="mb-5 text-xs uppercase tracking-[0.2em] md:text-sm"
                  style={{ color: '#5D4A3A' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.8, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  {greetingText}
                </motion.p>

                {/* Javanese cultural greeting */}
                <motion.p
                  className="mb-5 text-xs italic"
                  style={{ color: '#D4AF37', opacity: 0.7 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  Kula ngaturaken sowan dumateng panjenengan sedaya
                </motion.p>

                {/* Gold divider */}
                <JavaneseGoldDivider className="mb-5" />

                {/* Couple photos */}
                {hasPhotos && (
                  <motion.div
                    className="mb-5 flex items-center justify-center gap-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    {fotoPria && (
                      <div
                        className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full md:h-20 md:w-20"
                        style={{ border: '2px solid #D4AF37', boxShadow: '0 0 15px rgba(212,175,55,0.2)' }}
                      >
                        <img src={fotoPria} alt={displayPria} className="h-full w-full object-cover" />
                      </div>
                    )}
                    <span
                      className="font-serif text-3xl md:text-4xl"
                      style={{ color: '#D4AF37' }}
                    >
                      &amp;
                    </span>
                    {fotoWanita && (
                      <div
                        className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full md:h-20 md:w-20"
                        style={{ border: '2px solid #D4AF37', boxShadow: '0 0 15px rgba(212,175,55,0.2)' }}
                      >
                        <img src={fotoWanita} alt={displayWanita} className="h-full w-full object-cover" />
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Couple names — with gold outline effect */}
                {(displayPria || displayWanita) && (
                  <motion.p
                    className="mb-5 font-serif text-2xl font-semibold md:text-3xl"
                    style={{
                      color: '#3A2A1A',
                      fontFamily: 'var(--font-playfair)',
                      textShadow: '1px 1px 0 rgba(212,175,55,0.2)',
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    {displayPria}{displayPria && displayWanita ? ' & ' : ''}{displayWanita}
                  </motion.p>
                )}

                {/* Gold divider */}
                <JavaneseGoldDivider className="mb-5" />

                {/* Guest name */}
                <motion.p
                  className="mb-1 text-sm uppercase tracking-[0.2em]"
                  style={{ color: '#5D4A3A' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                >
                  Kepada Yth. Bapak/Ibu/Sedaya
                </motion.p>

                <motion.p
                  className="font-serif text-xl font-semibold"
                  style={{ color: '#D4AF37' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.6 }}
                >
                  {guestName}
                </motion.p>

                {/* Open button — dark brown with gold border */}
                <motion.button
                  onClick={handleOpen}
                  className="mt-8 cursor-pointer rounded-full px-8 py-3 font-serif text-sm uppercase tracking-widest transition-all"
                  style={{
                    backgroundColor: '#3A2A1A',
                    color: '#F5F0E6',
                    border: '2px solid #D4AF37',
                    boxShadow: '0 0 20px rgba(212,175,55,0.15)',
                  }}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(212,175,55,0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isOpen}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  {isOpen ? 'Membuka...' : 'Buka Undangan'}
                </motion.button>
              </motion.div>

              {/* Wayang bottom scene */}
              <div className="absolute bottom-12 left-0 right-0 z-10">
                <WayangBottomScene className="opacity-60" />
              </div>

              {/* Scalloped batik bottom border */}
              <div className="absolute bottom-0 left-0 right-0 z-20">
                <BatikScallopBottom />
              </div>
            </div>
          ) : (
            /* ─── NON-JAWA THEME: Original envelope layout ─── */
            <>
              {/* Background pattern */}
              <div className="absolute inset-0 inv-arabesque-bg opacity-20" />

              {/* Subtle vignette overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.4) 100%)',
                }}
              />

              {/* Full ornamental frame — 8-piece like the reference */}
              <div className="absolute inset-4 md:inset-8 pointer-events-none">
                {/* Outer frame border */}
                <div className="absolute inset-0 border-2 opacity-30" style={{ borderColor: 'var(--inv-envelope-accent)' }} />
                {/* Inner frame border */}
                <div className="absolute inset-3 border opacity-20" style={{ borderColor: 'var(--inv-envelope-accent)' }} />

                {/* Corner ornaments */}
                {[
                  { pos: 'top-0 left-0', rotate: 0 },
                  { pos: 'top-0 right-0', rotate: 90 },
                  { pos: 'bottom-0 right-0', rotate: 180 },
                  { pos: 'bottom-0 left-0', rotate: 270 },
                ].map((corner, i) => (
                  <div
                    key={`corner-${i}`}
                    className={`absolute ${corner.pos}`}
                    style={{
                      width: 40,
                      height: 40,
                      transform: `rotate(${corner.rotate}deg)`,
                      color: 'var(--inv-envelope-accent)',
                    }}
                  >
                    <svg viewBox="0 0 40 40" fill="currentColor" width="100%" height="100%">
                      <path d="M0 0C12 0 20 4 20 14C20 20 14 20 8 20L0 20L0 17C8 17 14 17 16 12C18 8 12 4 0 4Z" opacity="0.5" />
                      <path d="M0 0C6 0 12 2 12 7C12 10 8 12 4 12L0 12L0 9C3 9 6 9 7.5 6.5C9 4 5 3 0 3Z" opacity="0.8" />
                      <circle cx="5" cy="5" r="2.5" opacity="0.5" />
                    </svg>
                  </div>
                ))}

                {/* Edge midpoint ornaments */}
                {[
                  { pos: 'top-0 left-1/2 -translate-x-1/2', rotate: 0 },
                  { pos: 'bottom-0 left-1/2 -translate-x-1/2', rotate: 180 },
                  { pos: 'left-0 top-1/2 -translate-y-1/2', rotate: 90 },
                  { pos: 'right-0 top-1/2 -translate-y-1/2', rotate: 270 },
                ].map((mid, i) => (
                  <div
                    key={`mid-${i}`}
                    className={`absolute ${mid.pos}`}
                    style={{
                      width: 16,
                      height: 16,
                      transform: `rotate(${mid.rotate}deg)`,
                      color: 'var(--inv-envelope-accent)',
                    }}
                  >
                    <svg viewBox="0 0 16 16" fill="currentColor" width="100%" height="100%">
                      <path d="M8 0L10 5L16 8L10 11L8 16L6 11L0 8L6 5Z" opacity="0.5" />
                    </svg>
                  </div>
                ))}
              </div>

              {/* Center content */}
              <motion.div
                className="relative z-10 w-[80vw] max-w-sm text-center px-6"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                {/* Bismillah Arabic — only for Islamic nuansa */}
                {isIslam && (
                  <motion.p
                    className="mb-4 font-serif text-2xl md:text-3xl"
                    style={{ color: 'var(--inv-envelope-accent)' }}
                    dir="rtl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    بسم الله الرحمن الرحيم
                  </motion.p>
                )}
                {!isIslam && (
                  <motion.p
                    className="mb-4 font-serif text-2xl md:text-3xl uppercase tracking-[0.15em]"
                    style={{ color: 'var(--inv-envelope-accent)' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    The Wedding Of
                  </motion.p>
                )}

                {/* Greeting text */}
                <motion.p
                  className="mb-6 text-xs uppercase tracking-[0.2em] md:text-sm"
                  style={{ color: 'var(--inv-envelope-accent)', opacity: 0.8 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.8, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  {greetingText}
                </motion.p>

                {/* Couple photos */}
                {hasPhotos && (
                  <motion.div
                    className="mb-5 flex items-center justify-center gap-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    {fotoPria && (
                      <div
                        className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full md:h-20 md:w-20"
                        style={{ border: '2px solid var(--inv-envelope-accent)' }}
                      >
                        <img src={fotoPria} alt={displayPria} className="h-full w-full object-cover" />
                      </div>
                    )}
                    <span className="font-serif text-3xl md:text-4xl" style={{ color: 'var(--inv-envelope-accent)' }}>&amp;</span>
                    {fotoWanita && (
                      <div
                        className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full md:h-20 md:w-20"
                        style={{ border: '2px solid var(--inv-envelope-accent)' }}
                      >
                        <img src={fotoWanita} alt={displayWanita} className="h-full w-full object-cover" />
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Couple names */}
                {(displayPria || displayWanita) && (
                  <motion.p
                    className="mb-5 font-serif text-2xl font-semibold md:text-3xl"
                    style={{ color: 'var(--inv-text)', fontFamily: 'var(--font-playfair)' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    {displayPria}{displayPria && displayWanita ? ' & ' : ''}{displayWanita}
                  </motion.p>
                )}

                {/* Bottom ornament */}
                <motion.div
                  className="mb-5 flex justify-center gap-1"
                  style={{ color: 'var(--inv-envelope-accent)', opacity: 0.35 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.35 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" style={{ fill: 'currentColor' }}>
                    <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6Z" />
                  </svg>
                </motion.div>

                {/* Guest name */}
                <motion.p
                  className="mb-1 text-sm uppercase tracking-[0.2em]"
                  style={{ color: 'var(--inv-text-muted)' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                >
                  Kepada Yth.
                </motion.p>

                <motion.p
                  className="font-serif text-xl font-semibold"
                  style={{ color: 'var(--inv-envelope-accent)' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.6 }}
                >
                  {guestName}
                </motion.p>

                {/* Open button */}
                <motion.button
                  onClick={handleOpen}
                  className="mt-8 cursor-pointer rounded-full px-8 py-3 font-serif text-sm uppercase tracking-widest transition-all"
                  style={{
                    backgroundColor: 'var(--inv-envelope-accent)',
                    color: 'var(--inv-envelope-bg)',
                    border: '1px solid var(--inv-envelope-accent)',
                  }}
                  whileHover={{ scale: 1.05, opacity: 0.9 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isOpen}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  {isOpen ? 'Membuka...' : 'Buka Undangan'}
                </motion.button>
              </motion.div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
