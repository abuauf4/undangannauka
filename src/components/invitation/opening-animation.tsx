'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BatikScallopTop,
  BatikScallopBottom,
  AksaraJawaOrnament,
  JavaneseGoldDivider,
  WayangBottomScene,
} from './javanese-ornaments';
import { Envelope } from './envelope';
import type { OpeningAnimationType } from '@/lib/template-builder-types';

/* ═══════════════════════════════════════════════════════════════
   Opening Animation — Multiple reveal animation types
   for the wedding invitation cover screen.

   Types:
   - envelope:     Classic envelope (delegates to Envelope component)
   - gate-open:    Candi Bentar gate splits apart left/right
   - curtain-reveal: Wayang kelir (shadow screen) lifts upward
   - book-open:    Book pages open with 3D perspective
   - petal-reveal: Flower petals fall, accumulate, then scatter
   - none:         No animation, auto-opens immediately
   ═══════════════════════════════════════════════════════════════ */

interface OpeningAnimationProps {
  type: OpeningAnimationType;
  guestName: string;
  greeting?: string;
  namaPria?: string;
  namaWanita?: string;
  nuansa?: string;
  adat?: string;
  fotoPria?: string | null;
  fotoWanita?: string | null;
  onOpen: () => void;
}

/* ─── Main Component ─── */
export function OpeningAnimation({ type, ...props }: OpeningAnimationProps) {
  // 'envelope' or undefined falls back to the classic Envelope
  if (type === 'envelope' || !type) {
    return <Envelope {...props} />;
  }

  // 'none' auto-opens on mount
  if (type === 'none') {
    return <AutoOpen onOpen={props.onOpen} />;
  }

  // All other types use the overlay system
  return <OpeningAnimationOverlay type={type} {...props} />;
}

/* ─── AutoOpen: calls onOpen() immediately on mount ─── */
function AutoOpen({ onOpen }: { onOpen: () => void }) {
  useEffect(() => {
    // Use a small timeout to ensure the parent component is ready
    const timer = setTimeout(onOpen, 50);
    return () => clearTimeout(timer);
  }, [onOpen]);

  return null;
}

/* ─── Overlay Wrapper: shared full-screen overlay with AnimatePresence ─── */
function OpeningAnimationOverlay({
  type,
  guestName,
  greeting,
  namaPria,
  namaWanita,
  nuansa,
  adat,
  fotoPria,
  fotoWanita,
  onOpen,
}: OpeningAnimationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const isJawa = adat === 'jawa';

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    setTimeout(() => {
      setIsRevealed(true);
      setTimeout(onOpen, 800);
    }, 600);
  };

  const bgColor = isJawa ? '#F5F0E6' : 'var(--inv-envelope-bg)';
  const textColor = isJawa ? '#3A2A1A' : 'var(--inv-text)';
  const accentColor = isJawa ? '#D4AF37' : 'var(--inv-envelope-accent)';
  const mutedColor = isJawa ? '#5D4A3A' : 'var(--inv-text-muted, #888)';

  const sharedProps = {
    guestName,
    greeting,
    namaPria,
    namaWanita,
    nuansa,
    adat,
    fotoPria,
    fotoWanita,
    isOpen,
    isRevealed,
    isJawa,
    bgColor,
    textColor,
    accentColor,
    mutedColor,
    handleOpen,
  };

  return (
    <AnimatePresence>
      {!isRevealed && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: bgColor }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {type === 'gate-open' && <GateOpenAnimation {...sharedProps} />}
          {type === 'curtain-reveal' && <CurtainRevealAnimation {...sharedProps} />}
          {type === 'book-open' && <BookOpenAnimation {...sharedProps} />}
          {type === 'petal-reveal' && <PetalRevealAnimation {...sharedProps} />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Shared props interface for all animation sub-components
   ═══════════════════════════════════════════════════════════════ */
interface AnimationSharedProps {
  guestName: string;
  greeting?: string;
  namaPria?: string;
  namaWanita?: string;
  nuansa?: string;
  adat?: string;
  fotoPria?: string | null;
  fotoWanita?: string | null;
  isOpen: boolean;
  isRevealed: boolean;
  isJawa: boolean;
  bgColor: string;
  textColor: string;
  accentColor: string;
  mutedColor: string;
  handleOpen: () => void;
}

/* ═══════════════════════════════════════════════════════════════
   GATE OPEN — Candi Bentar that splits apart
   Two tall panels slide left and right revealing content behind.
   ═══════════════════════════════════════════════════════════════ */
function GateOpenAnimation({
  guestName,
  greeting,
  namaPria,
  namaWanita,
  nuansa,
  isOpen,
  isJawa,
  bgColor,
  textColor,
  accentColor,
  mutedColor,
  handleOpen,
}: AnimationSharedProps) {
  const isIslam = nuansa !== 'umum';
  const displayPria = namaPria || '';
  const displayWanita = namaWanita || '';
  const greetingText = greeting || (isIslam ? "Assalamu'alaikum Warahmatullahi Wabarakatuh" : 'Dear Beloved Friends & Family');

  return (
    <div className="relative inset-0 flex flex-col items-center justify-center w-full h-full">
      {/* Background texture for Jawa */}
      {isJawa && (
        <>
          <div className="absolute inset-0 inv-jawa-aged-paper" />
          <div className="absolute inset-0 inv-jawa-truntum-bg opacity-50" />
        </>
      )}

      {/* Content that sits behind the gates */}
      <motion.div
        className="relative z-10 w-[80vw] max-w-sm text-center px-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <AksaraJawaOrnament className="mb-3" />

        {isIslam && (
          <motion.p
            className="mb-3 font-serif text-xl md:text-2xl"
            style={{ color: textColor }}
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
            className="mb-3 font-serif text-xl md:text-2xl uppercase tracking-[0.15em]"
            style={{ color: textColor }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            The Wedding Of
          </motion.p>
        )}

        <motion.p
          className="mb-4 text-xs uppercase tracking-[0.2em] md:text-sm"
          style={{ color: mutedColor, opacity: 0.8 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {greetingText}
        </motion.p>

        <JavaneseGoldDivider className="mb-4" />

        {(displayPria || displayWanita) && (
          <motion.p
            className="mb-4 font-serif text-2xl font-semibold md:text-3xl"
            style={{
              color: textColor,
              fontFamily: 'var(--font-playfair)',
              textShadow: isJawa ? '1px 1px 0 rgba(212,175,55,0.2)' : undefined,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            {displayPria}{displayPria && displayWanita ? ' & ' : ''}{displayWanita}
          </motion.p>
        )}

        <JavaneseGoldDivider className="mb-4" />

        <motion.p
          className="mb-1 text-sm uppercase tracking-[0.2em]"
          style={{ color: mutedColor }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          {isJawa ? 'Kepada Yth. Bapak/Ibu/Sedaya' : 'Kepada Yth.'}
        </motion.p>

        <motion.p
          className="font-serif text-xl font-semibold"
          style={{ color: accentColor }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          {guestName}
        </motion.p>

        <motion.button
          onClick={handleOpen}
          className="mt-6 cursor-pointer rounded-full px-8 py-3 font-serif text-sm uppercase tracking-widest transition-all"
          style={{
            backgroundColor: isJawa ? '#3A2A1A' : accentColor,
            color: isJawa ? '#F5F0E6' : bgColor,
            border: `2px solid ${accentColor}`,
            boxShadow: `0 0 20px ${isJawa ? 'rgba(212,175,55,0.15)' : 'rgba(212,175,55,0.1)'}`,
          }}
          whileHover={{ scale: 1.05, boxShadow: `0 0 30px ${isJawa ? 'rgba(212,175,55,0.3)' : 'rgba(212,175,55,0.2)'}` }}
          whileTap={{ scale: 0.95 }}
          disabled={isOpen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          {isOpen ? 'Membuka...' : 'Buka Undangan'}
        </motion.button>
      </motion.div>

      {/* ─── Left Gate Panel ─── */}
      <motion.div
        className="absolute top-0 left-0 h-full w-1/2 z-20 overflow-hidden"
        initial={{ x: 0 }}
        animate={{ x: isOpen ? '-105%' : 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <GatePanel side="left" isJawa={isJawa} accentColor={accentColor} bgColor={bgColor} />
      </motion.div>

      {/* ─── Right Gate Panel ─── */}
      <motion.div
        className="absolute top-0 right-0 h-full w-1/2 z-20 overflow-hidden"
        initial={{ x: 0 }}
        animate={{ x: isOpen ? '105%' : 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <GatePanel side="right" isJawa={isJawa} accentColor={accentColor} bgColor={bgColor} />
      </motion.div>

      {/* Wayang bottom scene for Jawa */}
      {isJawa && (
        <div className="absolute bottom-0 left-0 right-0 z-10 opacity-40 pointer-events-none">
          <WayangBottomScene />
        </div>
      )}

      {/* Batik borders for Jawa */}
      {isJawa && (
        <>
          <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
            <BatikScallopTop />
          </div>
          <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
            <BatikScallopBottom />
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Single Gate Panel (half of Candi Bentar) ─── */
function GatePanel({
  side,
  isJawa,
  accentColor,
  bgColor,
}: {
  side: 'left' | 'right';
  isJawa: boolean;
  accentColor: string;
  bgColor: string;
}) {
  const panelBg = isJawa ? '#2C1810' : 'color-mix(in srgb, var(--inv-envelope-bg) 80%, black 20%)';
  const flipX = side === 'right' ? -1 : 1;

  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
      style={{ backgroundColor: panelBg }}
    >
      {/* Candi Bentar SVG silhouette */}
      <svg
        viewBox="0 0 160 320"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        style={{ transform: `scaleX(${flipX})` }}
      >
        {/* Main gate body */}
        <path
          d="M0 320 L0 220 L8 210 L8 170 L14 160 L14 130 L20 120 L20 90 L30 75 L40 55 L50 40 L60 28 L70 20 L80 16 L80 320 Z"
          fill={isJawa ? '#3D2215' : 'rgba(60,40,20,0.8)'}
        />
        {/* Gold outline */}
        <path
          d="M2 320 L2 222 L10 212 L10 172 L16 162 L16 132 L22 122 L22 92 L32 77 L42 57 L52 42 L62 30 L72 22 L80 18"
          fill="none"
          stroke={accentColor}
          strokeWidth="1.2"
          opacity="0.6"
        />
        {/* Decorative kawung pattern */}
        {[
          { y: 260, x: 30 },
          { y: 200, x: 25 },
          { y: 150, x: 20 },
          { y: 100, x: 28 },
        ].map((pos, i) => (
          <g key={i} transform={`translate(${pos.x}, ${pos.y})`}>
            <ellipse cx="0" cy="-5" rx="3" ry="4.5" fill={accentColor} opacity="0.3" />
            <ellipse cx="0" cy="5" rx="3" ry="4.5" fill={accentColor} opacity="0.3" />
            <ellipse cx="-5" cy="0" rx="4.5" ry="3" fill={accentColor} opacity="0.3" />
            <ellipse cx="5" cy="0" rx="4.5" ry="3" fill={accentColor} opacity="0.3" />
            <circle cx="0" cy="0" r="2" fill={accentColor} opacity="0.4" />
          </g>
        ))}
        {/* Horizontal ornamental bands */}
        <rect x="4" y="230" width="72" height="4" fill={accentColor} opacity="0.15" />
        <rect x="6" y="180" width="68" height="3" fill={accentColor} opacity="0.12" />
        <rect x="8" y="130" width="64" height="3" fill={accentColor} opacity="0.1" />
      </svg>

      {/* Center edge highlight */}
      <div
        className="absolute top-0 bottom-0"
        style={{
          [side === 'left' ? 'right' : 'left']: 0,
          width: 3,
          background: `linear-gradient(to bottom, transparent, ${accentColor}40, transparent)`,
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CURTAIN REVEAL — Wayang kelir (shadow screen) that lifts upward
   Dark background with gold border, shadow puppet silhouettes.
   ═══════════════════════════════════════════════════════════════ */
function CurtainRevealAnimation({
  guestName,
  greeting,
  namaPria,
  namaWanita,
  nuansa,
  isOpen,
  isJawa,
  bgColor,
  textColor,
  accentColor,
  mutedColor,
  handleOpen,
}: AnimationSharedProps) {
  const isIslam = nuansa !== 'umum';
  const displayPria = namaPria || '';
  const displayWanita = namaWanita || '';
  const greetingText = greeting || (isIslam ? "Assalamu'alaikum Warahmatullahi Wabarakatuh" : 'Dear Beloved Friends & Family');

  return (
    <div className="relative inset-0 flex flex-col items-center justify-center w-full h-full">
      {/* Background glow — simulates blencong (oil lamp) */}
      <div
        className="absolute inset-0"
        style={{
          background: isJawa
            ? 'radial-gradient(ellipse at center, rgba(212,175,55,0.05) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at center, rgba(212,175,55,0.03) 0%, transparent 60%)',
          animation: 'shadowScreenGlow 5s ease-in-out infinite',
        }}
      />

      {/* Content behind the curtain */}
      <motion.div
        className="relative z-10 w-[80vw] max-w-sm text-center px-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <AksaraJawaOrnament className="mb-3" />

        {isIslam && (
          <motion.p
            className="mb-3 font-serif text-xl md:text-2xl"
            style={{ color: isJawa ? '#F5F0E6' : textColor }}
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
            className="mb-3 font-serif text-xl md:text-2xl uppercase tracking-[0.15em]"
            style={{ color: isJawa ? '#F5F0E6' : textColor }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            The Wedding Of
          </motion.p>
        )}

        <motion.p
          className="mb-4 text-xs uppercase tracking-[0.2em] md:text-sm"
          style={{ color: isJawa ? '#C9B896' : mutedColor, opacity: 0.8 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {greetingText}
        </motion.p>

        <JavaneseGoldDivider className="mb-4" />

        {(displayPria || displayWanita) && (
          <motion.p
            className="mb-4 font-serif text-2xl font-semibold md:text-3xl"
            style={{
              color: isJawa ? '#F5F0E6' : textColor,
              fontFamily: 'var(--font-playfair)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            {displayPria}{displayPria && displayWanita ? ' & ' : ''}{displayWanita}
          </motion.p>
        )}

        <JavaneseGoldDivider className="mb-4" />

        <motion.p
          className="mb-1 text-sm uppercase tracking-[0.2em]"
          style={{ color: isJawa ? '#C9B896' : mutedColor }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          {isJawa ? 'Kepada Yth. Bapak/Ibu/Sedaya' : 'Kepada Yth.'}
        </motion.p>

        <motion.p
          className="font-serif text-xl font-semibold"
          style={{ color: accentColor }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          {guestName}
        </motion.p>

        <motion.button
          onClick={handleOpen}
          className="mt-6 cursor-pointer rounded-full px-8 py-3 font-serif text-sm uppercase tracking-widest transition-all"
          style={{
            backgroundColor: accentColor,
            color: isJawa ? '#2C1810' : bgColor,
            border: `2px solid ${accentColor}`,
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

      {/* ─── The Curtain (kelir) ─── */}
      <motion.div
        className="absolute inset-0 z-20"
        initial={{ y: 0 }}
        animate={{ y: isOpen ? '-105%' : 0 }}
        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="relative w-full h-full"
          style={{
            backgroundColor: isJawa ? '#1a0f08' : 'rgba(10,8,6,0.95)',
          }}
        >
          {/* Gold frame border */}
          <div
            className="absolute inset-4 md:inset-8 pointer-events-none"
            style={{
              border: `2px solid ${accentColor}`,
              opacity: 0.4,
            }}
          />
          <div
            className="absolute inset-6 md:inset-10 pointer-events-none"
            style={{
              border: `1px solid ${accentColor}`,
              opacity: 0.2,
            }}
          />

          {/* Shadow puppet silhouettes on the kelir */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <svg
              viewBox="0 0 200 300"
              className="w-40 md:w-56 h-auto"
              fill={accentColor}
            >
              {/* Central wayang silhouette (Kalpataru-inspired) */}
              <path d="M100 30 Q105 20 100 10 Q95 20 100 30Z" opacity="0.6" />
              <path d="M90 50 Q100 35 110 50 Q105 55 95 55Z" opacity="0.5" />
              <rect x="96" y="55" width="8" height="120" rx="2" opacity="0.4" />
              {/* Left branches */}
              <path d="M96 80 Q75 65 60 80 Q70 85 80 82 Q70 90 55 100 Q65 100 80 90Z" opacity="0.35" />
              <path d="M96 110 Q80 100 65 110 Q75 115 85 112 Q78 120 65 130 Q75 128 88 118Z" opacity="0.3" />
              {/* Right branches */}
              <path d="M104 80 Q125 65 140 80 Q130 85 120 82 Q130 90 145 100 Q135 100 120 90Z" opacity="0.35" />
              <path d="M104 110 Q120 100 135 110 Q125 115 115 112 Q122 120 135 130 Q125 128 112 118Z" opacity="0.3" />
              {/* Base */}
              <path d="M80 175 Q100 165 120 175 Q110 185 90 185Z" opacity="0.4" />
              <path d="M70 185 Q100 175 130 185 Q115 200 85 200Z" opacity="0.3" />
              {/* Decorative dots */}
              <circle cx="60" cy="80" r="2" opacity="0.3" />
              <circle cx="140" cy="80" r="2" opacity="0.3" />
              <circle cx="55" cy="100" r="1.5" opacity="0.25" />
              <circle cx="145" cy="100" r="1.5" opacity="0.25" />
            </svg>
          </div>

          {/* Blencong glow effect at top */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.12) 0%, transparent 70%)',
              animation: 'shadowScreenGlow 3s ease-in-out infinite',
            }}
          />

          {/* Fabric texture lines */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0"
              style={{
                top: `${8 + i * 8}%`,
                height: 1,
                background: `linear-gradient(to right, transparent, ${accentColor}08, transparent)`,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Wayang bottom scene for Jawa (below curtain) */}
      {isJawa && (
        <div className="absolute bottom-0 left-0 right-0 z-5 opacity-30 pointer-events-none">
          <WayangBottomScene />
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BOOK OPEN — Pages that open with 3D perspective transform
   Left page has cover content, right page rotates open.
   ═══════════════════════════════════════════════════════════════ */
function BookOpenAnimation({
  guestName,
  greeting,
  namaPria,
  namaWanita,
  nuansa,
  isOpen,
  isJawa,
  bgColor,
  textColor,
  accentColor,
  mutedColor,
  handleOpen,
}: AnimationSharedProps) {
  const isIslam = nuansa !== 'umum';
  const displayPria = namaPria || '';
  const displayWanita = namaWanita || '';
  const greetingText = greeting || (isIslam ? "Assalamu'alaikum Warahmatullahi Wabarakatuh" : 'Dear Beloved Friends & Family');

  const pageBg = isJawa ? '#F5F0E6' : bgColor;
  const pageText = isJawa ? '#3A2A1A' : textColor;

  return (
    <div className="relative inset-0 flex flex-col items-center justify-center w-full h-full">
      {/* Background behind the book */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: isJawa ? '#1a0f08' : 'rgba(10,8,6,0.9)',
        }}
      />

      {/* 3D perspective container */}
      <div
        className="relative z-10"
        style={{ perspective: 1200 }}
      >
        <motion.div
          className="relative flex"
          style={{
            width: '85vw',
            maxWidth: 420,
            height: '70vh',
            maxHeight: 520,
            transformStyle: 'preserve-3d',
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* ─── Book Spine ─── */}
          <div
            className="absolute top-0 bottom-0 z-20"
            style={{
              left: '50%',
              width: 8,
              transform: 'translateX(-50%)',
              background: isJawa
                ? 'linear-gradient(to right, #5D4A3A, #3A2A1A, #5D4A3A)'
                : `linear-gradient(to right, ${accentColor}80, ${accentColor}, ${accentColor}80)`,
              boxShadow: '0 0 15px rgba(0,0,0,0.5)',
            }}
          />

          {/* ─── Left Page (cover content — always visible) ─── */}
          <div
            className="w-1/2 h-full overflow-hidden flex flex-col items-center justify-center px-4 py-8"
            style={{
              backgroundColor: pageBg,
              borderRadius: '8px 0 0 8px',
              boxShadow: '-4px 0 20px rgba(0,0,0,0.3)',
            }}
          >
            <AksaraJawaOrnament className="mb-2" text="ꦱꦶꦤꦺꦴꦩ꧀" />

            {isIslam && (
              <p
                className="mb-2 font-serif text-sm md:text-base text-center"
                style={{ color: pageText }}
                dir="rtl"
              >
                بسم الله الرحمن الرحيم
              </p>
            )}
            {!isIslam && (
              <p
                className="mb-2 font-serif text-sm md:text-base uppercase tracking-[0.12em] text-center"
                style={{ color: pageText }}
              >
                The Wedding Of
              </p>
            )}

            <JavaneseGoldDivider className="mb-2" />

            {(displayPria || displayWanita) && (
              <p
                className="mb-2 font-serif text-lg font-semibold md:text-xl text-center"
                style={{ color: pageText, fontFamily: 'var(--font-playfair)' }}
              >
                {displayPria}{displayPria && displayWanita ? ' & ' : ''}{displayWanita}
              </p>
            )}

            <JavaneseGoldDivider className="mb-2" />

            <p
              className="text-[10px] uppercase tracking-[0.15em] text-center"
              style={{ color: mutedColor }}
            >
              {isJawa ? 'Kepada Yth. Bapak/Ibu/Sedaya' : 'Kepada Yth.'}
            </p>
            <p
              className="font-serif text-base font-semibold text-center"
              style={{ color: accentColor }}
            >
              {guestName}
            </p>
          </div>

          {/* ─── Right Page (rotates open) ─── */}
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-full origin-left"
            style={{
              transformStyle: 'preserve-3d',
              zIndex: 15,
            }}
            initial={{ rotateY: 0 }}
            animate={{ rotateY: isOpen ? -180 : 0 }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Front of right page (face-down cover) */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center px-4 py-8"
              style={{
                backgroundColor: pageBg,
                borderRadius: '0 8px 8px 0',
                boxShadow: '4px 0 20px rgba(0,0,0,0.3)',
                backfaceVisibility: 'hidden',
              }}
            >
              <AksaraJawaOrnament className="mb-3" text="ꦱꦶꦤꦺꦴꦩ꧀" />

              <p
                className="mb-3 text-xs uppercase tracking-[0.18em] text-center"
                style={{ color: mutedColor, opacity: 0.8 }}
              >
                {greetingText}
              </p>

              <JavaneseGoldDivider className="mb-4" />

              <motion.button
                onClick={handleOpen}
                className="cursor-pointer rounded-full px-6 py-2.5 font-serif text-xs uppercase tracking-widest transition-all"
                style={{
                  backgroundColor: isJawa ? '#3A2A1A' : accentColor,
                  color: isJawa ? '#F5F0E6' : bgColor,
                  border: `2px solid ${accentColor}`,
                  boxShadow: `0 0 15px ${isJawa ? 'rgba(212,175,55,0.15)' : 'rgba(212,175,55,0.1)'}`,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isOpen}
              >
                {isOpen ? 'Membuka...' : 'Buka Undangan'}
              </motion.button>

              {/* Bottom decorative corner */}
              <div className="absolute bottom-3 right-3 opacity-30">
                <svg width="30" height="30" viewBox="0 0 30 30" fill={accentColor}>
                  <path d="M0 30 Q0 15 15 15 Q0 15 0 0" opacity="0.5" />
                  <circle cx="8" cy="22" r="2" opacity="0.4" />
                </svg>
              </div>
            </div>

            {/* Back of right page (visible when flipped) */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                backgroundColor: isJawa ? '#2C1810' : 'rgba(40,30,20,0.9)',
                borderRadius: '0 8px 8px 0',
                transform: 'rotateY(180deg)',
                backfaceVisibility: 'hidden',
              }}
            >
              {/* Blank page or decorative pattern */}
              <div className="opacity-20">
                <svg width="60" height="60" viewBox="0 0 60 60" fill={accentColor}>
                  <ellipse cx="30" cy="15" rx="5" ry="8" opacity="0.5" />
                  <ellipse cx="30" cy="45" rx="5" ry="8" opacity="0.5" />
                  <ellipse cx="15" cy="30" rx="8" ry="5" opacity="0.5" />
                  <ellipse cx="45" cy="30" rx="8" ry="5" opacity="0.5" />
                  <circle cx="30" cy="30" r="5" opacity="0.6" />
                </svg>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative bottom corners */}
      {isJawa && (
        <div className="absolute bottom-6 left-0 right-0 z-5 opacity-20 pointer-events-none">
          <WayangBottomScene />
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PETAL REVEAL — Flower petals fall, accumulate, then scatter
   Multiple petal SVGs animated with framer-motion.
   ═══════════════════════════════════════════════════════════════ */
function PetalRevealAnimation({
  guestName,
  greeting,
  namaPria,
  namaWanita,
  nuansa,
  isOpen,
  isJawa,
  bgColor,
  textColor,
  accentColor,
  mutedColor,
  handleOpen,
}: AnimationSharedProps) {
  const isIslam = nuansa !== 'umum';
  const displayPria = namaPria || '';
  const displayWanita = namaWanita || '';
  const greetingText = greeting || (isIslam ? "Assalamu'alaikum Warahmatullahi Wabarakatuh" : 'Dear Beloved Friends & Family');

  // Generate random petal data (stable across re-renders)
  const petals = useMemo(() => {
    const count = 25;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // % position
      delay: Math.random() * 3, // staggered fall
      duration: 4 + Math.random() * 4, // fall duration 4-8s
      size: 12 + Math.random() * 16, // 12-28px
      rotation: Math.random() * 360,
      rotationSpeed: 30 + Math.random() * 60, // degrees per second
      // Petal colors — warm tones for Jawa, theme colors otherwise
      color: isJawa
        ? ['#D4AF37', '#C9A84C', '#B8935A', '#E8C97A', '#A0784A'][i % 5]
        : [accentColor, `${accentColor}CC`, `${accentColor}99`][i % 3],
      driftX: (Math.random() - 0.5) * 60, // horizontal drift
      scatterAngle: Math.random() * 360, // scatter direction
      scatterDistance: 200 + Math.random() * 300, // scatter distance
    }));
  }, [isJawa, accentColor]);

  return (
    <div className="relative inset-0 flex flex-col items-center justify-center w-full h-full">
      {/* Background */}
      {isJawa && (
        <>
          <div className="absolute inset-0 inv-jawa-aged-paper" />
          <div className="absolute inset-0 inv-jawa-truntum-bg opacity-50" />
        </>
      )}

      {/* Content behind petals */}
      <motion.div
        className="relative z-10 w-[80vw] max-w-sm text-center px-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <AksaraJawaOrnament className="mb-3" />

        {isIslam && (
          <motion.p
            className="mb-3 font-serif text-xl md:text-2xl"
            style={{ color: textColor }}
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
            className="mb-3 font-serif text-xl md:text-2xl uppercase tracking-[0.15em]"
            style={{ color: textColor }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            The Wedding Of
          </motion.p>
        )}

        <motion.p
          className="mb-4 text-xs uppercase tracking-[0.2em] md:text-sm"
          style={{ color: mutedColor, opacity: 0.8 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {greetingText}
        </motion.p>

        <JavaneseGoldDivider className="mb-4" />

        {(displayPria || displayWanita) && (
          <motion.p
            className="mb-4 font-serif text-2xl font-semibold md:text-3xl"
            style={{
              color: textColor,
              fontFamily: 'var(--font-playfair)',
              textShadow: isJawa ? '1px 1px 0 rgba(212,175,55,0.2)' : undefined,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            {displayPria}{displayPria && displayWanita ? ' & ' : ''}{displayWanita}
          </motion.p>
        )}

        <JavaneseGoldDivider className="mb-4" />

        <motion.p
          className="mb-1 text-sm uppercase tracking-[0.2em]"
          style={{ color: mutedColor }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          {isJawa ? 'Kepada Yth. Bapak/Ibu/Sedaya' : 'Kepada Yth.'}
        </motion.p>

        <motion.p
          className="font-serif text-xl font-semibold"
          style={{ color: accentColor }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          {guestName}
        </motion.p>

        <motion.button
          onClick={handleOpen}
          className="mt-6 cursor-pointer rounded-full px-8 py-3 font-serif text-sm uppercase tracking-widest transition-all"
          style={{
            backgroundColor: isJawa ? '#3A2A1A' : accentColor,
            color: isJawa ? '#F5F0E6' : bgColor,
            border: `2px solid ${accentColor}`,
            boxShadow: `0 0 20px ${isJawa ? 'rgba(212,175,55,0.15)' : 'rgba(212,175,55,0.1)'}`,
          }}
          whileHover={{ scale: 1.05, boxShadow: `0 0 30px ${isJawa ? 'rgba(212,175,55,0.3)' : 'rgba(212,175,55,0.2)'}` }}
          whileTap={{ scale: 0.95 }}
          disabled={isOpen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          {isOpen ? 'Membuka...' : 'Buka Undangan'}
        </motion.button>
      </motion.div>

      {/* ─── Falling / Scattering Petals ─── */}
      {petals.map((petal) => {
        const scatterRad = (petal.scatterAngle * Math.PI) / 180;
        const scatterX = Math.cos(scatterRad) * petal.scatterDistance;
        const scatterY = Math.sin(scatterRad) * petal.scatterDistance;

        return (
          <motion.div
            key={petal.id}
            className="absolute z-30 pointer-events-none"
            style={{
              left: `${petal.x}%`,
              top: -30,
            }}
            // Phase 1: Falling petals
            initial={{
              y: -30,
              x: 0,
              rotate: petal.rotation,
              opacity: 0.85,
              scale: 1,
            }}
            animate={
              isOpen
                ? // Phase 2: Scatter outward
                  {
                    y: scatterY,
                    x: petal.driftX + scatterX,
                    rotate: petal.rotation + petal.rotationSpeed * 3,
                    opacity: 0,
                    scale: 0.3,
                  }
                : // Phase 1: Fall down with drift
                  {
                    y: '110vh',
                    x: petal.driftX,
                    rotate: petal.rotation + petal.rotationSpeed * 6,
                    opacity: [0, 0.85, 0.85, 0.6],
                    scale: 1,
                  }
            }
            transition={
              isOpen
                ? {
                    duration: 1.2,
                    ease: 'easeOut',
                    delay: petal.id * 0.03,
                  }
                : {
                    duration: petal.duration,
                    delay: petal.delay,
                    repeat: Infinity,
                    ease: 'linear',
                  }
            }
          >
            <PetalSVG size={petal.size} color={petal.color} />
          </motion.div>
        );
      })}

      {/* Batik borders for Jawa */}
      {isJawa && (
        <>
          <div className="absolute top-0 left-0 right-0 z-40 pointer-events-none">
            <BatikScallopTop />
          </div>
          <div className="absolute bottom-0 left-0 right-0 z-40 pointer-events-none">
            <BatikScallopBottom />
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Petal SVG Component ─── */
function PetalSVG({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 20 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main petal shape */}
      <path
        d="M10 0 Q14 4 16 10 Q18 16 14 22 Q12 25 10 26 Q8 25 6 22 Q2 16 4 10 Q6 4 10 0Z"
        fill={color}
        opacity="0.75"
      />
      {/* Center vein */}
      <path
        d="M10 3 Q10 13 10 23"
        stroke={color}
        strokeWidth="0.5"
        opacity="0.4"
      />
      {/* Side veins */}
      <path d="M10 8 Q13 10 15 12" stroke={color} strokeWidth="0.3" opacity="0.3" />
      <path d="M10 8 Q7 10 5 12" stroke={color} strokeWidth="0.3" opacity="0.3" />
      <path d="M10 13 Q13 15 14 18" stroke={color} strokeWidth="0.3" opacity="0.25" />
      <path d="M10 13 Q7 15 6 18" stroke={color} strokeWidth="0.3" opacity="0.25" />
    </svg>
  );
}
