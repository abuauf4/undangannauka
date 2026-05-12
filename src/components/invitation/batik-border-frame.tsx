'use client';

import { motion } from 'framer-motion';

/**
 * BatikBorderFrame — ornamental Javanese batik border that wraps content.
 * Inspired by the Satu Momen "Maroon Javanese" template.
 *
 * Variants:
 * - "full"    — double border with corner ornaments + diamond midpoint markers
 * - "simple"  — single border with corner brackets only
 * - "elegant" — double border with scrollwork corners
 */

interface BatikBorderFrameProps {
  children: React.ReactNode;
  variant?: 'full' | 'simple' | 'elegant';
  className?: string;
  /** Override accent color (defaults to var(--inv-accent)) */
  accentColor?: string;
}

export function BatikBorderFrame({
  children,
  variant = 'full',
  className = '',
  accentColor,
}: BatikBorderFrameProps) {
  const accent = accentColor || 'var(--inv-accent)';

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8 }}
    >
      {variant === 'full' && <FullBorder accent={accent} />}
      {variant === 'simple' && <SimpleBorder accent={accent} />}
      {variant === 'elegant' && <ElegantBorder accent={accent} />}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

/* ─── Full Border: Double line + corner ornaments + midpoint diamonds ─── */
function FullBorder({ accent }: { accent: string }) {
  return (
    <>
      {/* Outer border */}
      <div
        className="absolute inset-0 rounded-sm border-2 opacity-50"
        style={{ borderColor: accent }}
      />
      {/* Inner border */}
      <div
        className="absolute inset-2 rounded-sm border opacity-30"
        style={{ borderColor: accent }}
      />

      {/* Corner ornaments */}
      <CornerOrnament position="top-1 left-1" rotate={0} accent={accent} size={20} />
      <CornerOrnament position="top-1 right-1" rotate={90} accent={accent} size={20} />
      <CornerOrnament position="bottom-1 left-1" rotate={270} accent={accent} size={20} />
      <CornerOrnament position="bottom-1 right-1" rotate={180} accent={accent} size={20} />

      {/* Midpoint diamonds */}
      <MidpointDiamond position="top-0 left-1/2 -translate-x-1/2" accent={accent} />
      <MidpointDiamond position="bottom-0 left-1/2 -translate-x-1/2" accent={accent} />
      <MidpointDiamond position="left-0 top-1/2 -translate-y-1/2" accent={accent} rotate={90} />
      <MidpointDiamond position="right-0 top-1/2 -translate-y-1/2" accent={accent} rotate={90} />
    </>
  );
}

/* ─── Simple Border: Single line + corner brackets ─── */
function SimpleBorder({ accent }: { accent: string }) {
  return (
    <>
      <div
        className="absolute inset-0 rounded-sm border-2 opacity-40"
        style={{ borderColor: accent }}
      />
      {/* Corner L-brackets */}
      <CornerBracket position="top-0 left-0" rotate={0} accent={accent} />
      <CornerBracket position="top-0 right-0" rotate={90} accent={accent} />
      <CornerBracket position="bottom-0 right-0" rotate={180} accent={accent} />
      <CornerBracket position="bottom-0 left-0" rotate={270} accent={accent} />
    </>
  );
}

/* ─── Elegant Border: Double line + scrollwork corners ─── */
function ElegantBorder({ accent }: { accent: string }) {
  return (
    <>
      {/* Outer border */}
      <div
        className="absolute inset-0 rounded-sm border-2 opacity-40"
        style={{ borderColor: accent }}
      />
      {/* Inner border */}
      <div
        className="absolute inset-3 rounded-sm border opacity-25"
        style={{ borderColor: accent }}
      />

      {/* Scrollwork corners */}
      <ScrollCorner position="top-1 left-1" rotate={0} accent={accent} />
      <ScrollCorner position="top-1 right-1" rotate={90} accent={accent} />
      <ScrollCorner position="bottom-1 right-1" rotate={180} accent={accent} />
      <ScrollCorner position="bottom-1 left-1" rotate={270} accent={accent} />
    </>
  );
}

/* ─── Corner Ornament SVG — Batik-inspired corner piece ─── */
function CornerOrnament({
  position,
  rotate,
  accent,
  size = 20,
}: {
  position: string;
  rotate: number;
  accent: string;
  size?: number;
}) {
  return (
    <div
      className={`absolute ${position}`}
      style={{
        width: size,
        height: size,
        transform: `rotate(${rotate}deg)`,
        color: accent,
      }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
        {/* Batik-inspired corner with parang-like diagonal + inner detail */}
        <path d="M0 0L8 0L0 8Z" opacity="0.6" />
        <path d="M0 0L5 0L0 5Z" opacity="0.3" />
        <path d="M3 0L4 0L0 4L0 3Z" opacity="0.8" />
      </svg>
    </div>
  );
}

/* ─── Midpoint Diamond SVG ─── */
function MidpointDiamond({
  position,
  accent,
  rotate = 0,
}: {
  position: string;
  accent: string;
  rotate?: number;
}) {
  return (
    <div
      className={`absolute ${position}`}
      style={{
        width: 10,
        height: 10,
        transform: `rotate(${rotate}deg)`,
        color: accent,
      }}
    >
      <svg viewBox="0 0 10 10" fill="currentColor" width="100%" height="100%">
        <path d="M5 0L6.5 3.5L10 5L6.5 6.5L5 10L3.5 6.5L0 5L3.5 3.5Z" opacity="0.7" />
      </svg>
    </div>
  );
}

/* ─── Corner Bracket SVG — simple L-shaped bracket ─── */
function CornerBracket({
  position,
  rotate,
  accent,
}: {
  position: string;
  rotate: number;
  accent: string;
}) {
  return (
    <div
      className={`absolute ${position}`}
      style={{
        width: 24,
        height: 24,
        transform: `rotate(${rotate}deg)`,
        color: accent,
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="100%" height="100%">
        <path d="M1 12L1 1L12 1" opacity="0.7" />
        <circle cx="1" cy="1" r="1.5" fill="currentColor" opacity="0.5" />
      </svg>
    </div>
  );
}

/* ─── Scroll Corner SVG — ornamental scrollwork ─── */
function ScrollCorner({
  position,
  rotate,
  accent,
}: {
  position: string;
  rotate: number;
  accent: string;
}) {
  return (
    <div
      className={`absolute ${position}`}
      style={{
        width: 28,
        height: 28,
        transform: `rotate(${rotate}deg)`,
        color: accent,
      }}
    >
      <svg viewBox="0 0 28 28" fill="currentColor" width="100%" height="100%">
        {/* Scroll-like corner with curved lines */}
        <path d="M0 0C8 0 14 2 14 8C14 14 8 14 4 14L0 14L0 12C4 12 8 12 10 8C12 4 8 2 0 2Z" opacity="0.5" />
        <path d="M0 0C4 0 8 1 8 4C8 7 5 8 2 8L0 8L0 6C2 6 4 6 5 4C6 2 3 2 0 2Z" opacity="0.8" />
        <circle cx="3" cy="3" r="1.5" opacity="0.6" />
      </svg>
    </div>
  );
}
