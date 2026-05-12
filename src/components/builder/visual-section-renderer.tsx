'use client';

import Image from 'next/image';
import { Upload } from 'lucide-react';
import {
  TemplateSection,
  TemplateElement,
  AnimationType,
  SectionKey,
  SECTION_LABELS,
  SectionBackground,
  PatternType,
  DesignVariant,
} from '@/lib/template-builder-types';
import { ThemeGradient } from '@/lib/template-builder-helpers';

/* ═══════════════════════════════════════════════════════════════
   VISUAL SECTION RENDERER v4 — TRUE WYSIWYG

   Renders at FULL invitation size (not mini).
   All components render at invitation-appropriate dimensions.
   44+ CSS animation types fully mapped.
   Per-section backgrounds (solid/pattern/photo/gradient).
   Element positioning with X/Y offsets.
   ═══════════════════════════════════════════════════════════════ */

// ─── Full-size dimension maps ───
const sizeWidthMap: Record<string, string> = {
  small: '80px',
  medium: '120px',
  large: '160px',
  full: '100%',
};
const sizeHeightMap: Record<string, string> = {
  small: '130px',
  medium: '200px',
  large: '260px',
  full: 'auto',
};

// Wayang pixel dimensions for Image component
const wayangSizeMap: Record<string, { w: number; h: number }> = {
  small: { w: 80, h: 130 },
  medium: { w: 120, h: 200 },
  large: { w: 160, h: 260 },
  full: { w: 200, h: 320 },
};

// SVG Wayang pixel dimensions
const svgWayangSizeMap: Record<string, { w: number; h: number }> = {
  small: { w: 80, h: 100 },
  medium: { w: 120, h: 150 },
  large: { w: 160, h: 200 },
  full: { w: 200, h: 250 },
};

/* ═══════════════════════════════════════════════════════════════
   ANIMATION CSS — Maps AnimationType to CSS animation string
   ═══════════════════════════════════════════════════════════════ */
export function getAnimationCSS(anim: AnimationType, duration: number, delay: number, paused?: boolean): React.CSSProperties {
  if (anim === 'none') return {};
  const playState = paused ? 'paused' : 'running';
  const keyframeMap: Record<string, string> = {
    sway: 'wayangSway',
    swayReverse: 'wayangSwayReverse',
    shimmer: 'batikShimmer',
    shimmerGold: 'shimmerGold',
    float: 'float',
    floatSoft: 'floatSoft',
    floatBounce: 'floatBounce',
    fadeIn: 'fadeIn',
    fadeInUp: 'fadeInUp',
    fadeInDown: 'fadeInDown',
    fadeInLeft: 'fadeInLeft',
    fadeInRight: 'fadeInRight',
    pulse: 'pulse-slow',
    pulseSoft: 'pulseSoft',
    pulseGlow: 'pulseGlow',
    glow: 'goldGlow',
    glowSoft: 'goldGlowSoft',
    glowPulse: 'glowPulse',
    drift: 'megaDrift',
    driftReverse: 'megaDriftReverse',
    driftUp: 'driftUp',
    driftDown: 'driftDown',
    rotate: 'rotate',
    rotateSlow: 'rotateSlow',
    rotateSway: 'rotateSway',
    scaleIn: 'scaleIn',
    scalePulse: 'scalePulse',
    scaleBounce: 'scaleBounce',
    bounce: 'bounce',
    bounceSoft: 'bounceSoft',
    slideLeft: 'slideLeft',
    slideRight: 'slideRight',
    wave: 'wave',
    flicker: 'shadowFlicker',
    sparkle: 'sparkle',
    swing: 'swing',
    wiggle: 'wiggle',
    blur: 'blur',
    unblur: 'unblur',
    colorShift: 'colorShift',
    goldFlow: 'goldFlow',
    typewriter: 'typewriter',
  };
  const keyframe = keyframeMap[anim] || anim;
  return {
    animation: `${keyframe} ${duration}s ease-in-out ${delay}s infinite`,
    animationPlayState: playState,
  };
}

/* ═══════════════════════════════════════════════════════════════
   SECTION BACKGROUND RENDERER
   ═══════════════════════════════════════════════════════════════ */
function renderSectionBackgroundStyle(bg: SectionBackground, theme: ThemeGradient): React.CSSProperties {
  switch (bg.type) {
    case 'solid':
      return { backgroundColor: bg.color || theme.sectionBg };
    case 'pattern':
      return { backgroundColor: theme.sectionBg };
    case 'photo':
      return {
        backgroundImage: bg.photoUrl ? `url(${bg.photoUrl})` : undefined,
        backgroundSize: bg.photoPosition === 'contain' ? 'contain' : 'cover',
        backgroundPosition: 'center',
      };
    case 'gradient': {
      const dirMap: Record<string, string> = {
        'to-b': 'to bottom',
        'to-br': 'to bottom right',
        'to-r': 'to right',
        'radial': 'radial',
      };
      const dir = dirMap[bg.gradientDirection || 'to-b'] || 'to bottom';
      if (dir === 'radial') {
        return { background: `radial-gradient(circle, ${bg.gradientFrom || theme.accent}, ${bg.gradientTo || theme.sectionBg})` };
      }
      return { background: `linear-gradient(${dir}, ${bg.gradientFrom || theme.accent}, ${bg.gradientTo || theme.sectionBg})` };
    }
    default:
      return { backgroundColor: theme.sectionBg };
  }
}

function getPatternClassName(pattern?: PatternType): string {
  switch (pattern) {
    case 'parang': return 'inv-jawa-parang-bg';
    case 'truntum': return 'inv-jawa-truntum-bg';
    case 'kawung': return 'inv-jawa-kawung-bg';
    default: return '';
  }
}

/* ═══════════════════════════════════════════════════════════════
   WAYANG RENDERERS (Full-Size)
   ═══════════════════════════════════════════════════════════════ */
function WayangRenderer({ src, alt, animation, opacity, size, duration, delay, paused }: {
  src: string; alt: string; animation: AnimationType; opacity: number; size: string; duration: number; delay: number; paused?: boolean;
}) {
  const s = wayangSizeMap[size] || wayangSizeMap.medium;
  const animStyle: React.CSSProperties = {
    opacity,
    transformOrigin: 'top center',
    ...getAnimationCSS(animation, duration, delay, paused),
  };

  return (
    <div className="relative" style={animStyle}>
      <div className="absolute inset-0" style={{
        animation: paused ? 'none' : 'shadowFlicker 3s ease-in-out infinite',
        filter: 'blur(6px)', opacity: 0.3,
      }}>
        <Image src={src} alt="" width={s.w} height={s.h} className="w-full h-auto object-contain" />
      </div>
      <Image src={src} alt={alt} width={s.w} height={s.h} className="w-full h-auto object-contain relative z-10" />
    </div>
  );
}

function WayangSVGRenderer({ variant, animation, opacity, size, duration, delay, paused }: {
  variant: 'bima' | 'gatotkaca' | 'hanoman'; animation: AnimationType; opacity: number; size: string; duration: number; delay: number; paused?: boolean;
}) {
  const s = svgWayangSizeMap[size] || svgWayangSizeMap.medium;
  const animStyle: React.CSSProperties = {
    opacity,
    transformOrigin: 'top center',
    ...getAnimationCSS(animation, duration, delay, paused),
  };

  const wayangPaths: Record<string, React.ReactNode> = {
    bima: (
      <>
        <path d="M50 10 Q55 5 60 8 Q65 5 68 10 L70 18 Q72 22 70 26 L68 30 Q66 34 62 36 L60 38 L58 42 L56 38 Q54 36 52 34 L50 30 Q48 26 48 22 L48 18 Q48 14 50 10Z" fill="#2C1810" />
        <path d="M48 12 L46 4 L50 8 L52 2 L56 8 L58 4 L60 12" fill="#3D2215" stroke="#D4AF37" strokeWidth="0.5" />
        <path d="M44 38 L42 50 L40 65 L38 80 L36 95 L40 98 L46 95 L48 80 L50 65 L52 50 L54 38Z" fill="#2C1810" />
        <path d="M54 38 L56 50 L58 65 L60 80 L62 95 L68 98 L72 95 L70 80 L68 65 L66 50 L64 38Z" fill="#2C1810" />
        <path d="M44 50 L30 46 L28 44 L30 42 L44 46" fill="#2C1810" stroke="#D4AF37" strokeWidth="0.5" />
        <circle cx="54" cy="22" r="2" fill="#D4AF37" opacity="0.6" />
        <line x1="48" y1="60" x2="64" y2="60" stroke="#D4AF37" strokeWidth="0.5" opacity="0.4" />
        <path d="M38 95 L36 110 L40 120 L48 125 L56 125 L64 125 L72 120 L76 110 L74 95" fill="#3D2215" />
        <path d="M40 100 L56 105 L72 100" stroke="#D4AF37" strokeWidth="0.5" opacity="0.3" />
      </>
    ),
    gatotkaca: (
      <>
        <path d="M50 8 Q55 3 60 6 Q65 3 68 8 L70 16 Q72 20 70 24 L68 28 Q66 32 62 34 L60 36 L58 40 L56 36 Q54 34 52 32 L50 28 Q48 24 48 20 L48 16 Q48 12 50 8Z" fill="#2C1810" />
        <path d="M46 10 L44 0 L48 6 L50 -2 L54 6 L56 -1 L58 6 L60 0 L62 10" fill="#3D2215" stroke="#D4AF37" strokeWidth="0.5" />
        <path d="M44 36 L42 48 L40 60 L38 75 L36 90 L40 93 L46 90 L48 75 L50 60 L52 48 L54 36Z" fill="#2C1810" />
        <path d="M54 36 L56 48 L58 60 L60 75 L62 90 L68 93 L72 90 L70 75 L68 60 L66 48 L64 36Z" fill="#2C1810" />
        <line x1="46" y1="42" x2="62" y2="48" stroke="#D4AF37" strokeWidth="0.4" opacity="0.5" />
        <line x1="46" y1="48" x2="62" y2="42" stroke="#D4AF37" strokeWidth="0.4" opacity="0.5" />
        <circle cx="54" cy="44" r="2.5" fill="#D4AF37" opacity="0.5" />
        <circle cx="42" cy="40" r="3" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.5" />
        <circle cx="66" cy="40" r="3" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.5" />
        <path d="M38 90 L36 108 L40 118 L48 123 L56 123 L64 123 L72 118 L76 108 L74 90" fill="#3D2215" />
        <path d="M40 95 L56 100 L72 95" stroke="#D4AF37" strokeWidth="0.5" opacity="0.3" />
      </>
    ),
    hanoman: (
      <>
        <path d="M50 10 Q55 4 60 8 Q65 4 68 10 L70 20 Q72 24 70 28 L68 32 Q65 36 60 38 L58 40 L56 38 Q52 36 50 32 L48 28 Q46 24 48 20 L48 14 Q48 12 50 10Z" fill="#2C1810" />
        <path d="M46 16 L38 12 L42 20" fill="#2C1810" stroke="#D4AF37" strokeWidth="0.5" />
        <path d="M70 16 L78 12 L74 20" fill="#2C1810" stroke="#D4AF37" strokeWidth="0.5" />
        <path d="M48 10 L46 2 L50 6 L54 0 L58 6 L62 2 L64 10" fill="#3D2215" stroke="#D4AF37" strokeWidth="0.5" />
        <path d="M44 38 L42 50 L40 65 L38 80 L36 95 L40 98 L46 95 L48 80 L50 65 L52 50 L54 38Z" fill="#2C1810" />
        <path d="M54 38 L56 50 L58 65 L60 80 L62 95 L68 98 L72 95 L70 80 L68 65 L66 50 L64 38Z" fill="#2C1810" />
        <path d="M68 70 Q80 60 82 50 Q84 40 78 35 Q74 32 72 36 Q70 40 74 42" fill="none" stroke="#2C1810" strokeWidth="2" />
        <path d="M40 48 L28 44 L24 40 Q22 38 24 36 L28 38 L40 42" fill="#2C1810" stroke="#D4AF37" strokeWidth="0.5" />
        <circle cx="54" cy="20" r="1.5" fill="#D4AF37" opacity="0.5" />
        <path d="M38 95 L36 110 L40 118 L48 123 L56 123 L64 123 L72 118 L76 110 L74 95" fill="#3D2215" />
        <path d="M40 100 L56 105 L72 100" stroke="#D4AF37" strokeWidth="0.5" opacity="0.3" />
      </>
    ),
  };

  return (
    <div className="relative" style={animStyle}>
      <svg viewBox="0 0 108 125" fill="none" className="w-full h-auto" style={{ maxWidth: s.w }}>
        {wayangPaths[variant]}
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BATIK RENDERERS (Full-Size)
   ═══════════════════════════════════════════════════════════════ */
function BatikScallopRenderer({ variant, animation, opacity, duration, delay, paused, accent }: {
  variant: 'top' | 'bottom' | 'strip'; animation: AnimationType; opacity: number; duration: number; delay: number; paused?: boolean; accent?: string;
}) {
  const goldColor = accent || '#D4AF37';
  const animStyle = getAnimationCSS(animation, duration, delay, paused);
  const h = variant === 'strip' ? 44 : 60;
  const viewBox = variant === 'strip' ? '0 0 600 44' : '0 0 600 55';

  return (
    <div className="w-full" style={{ opacity, ...animStyle }}>
      <svg viewBox={viewBox} preserveAspectRatio="none" className="block w-full" style={{ height: h }}>
        {variant === 'top' && (
          <>
            <rect x="0" y="0" width="600" height="55" fill="#2C1810" />
            {[0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550].map((x, i) => (
              <path key={i} d={`M${x} 55 Q${x + 25} 5 ${x + 50} 55`} fill="#3D2215" />
            ))}
            <line x1="0" y1="0.5" x2="600" y2="0.5" stroke={goldColor} strokeWidth="1.5" opacity="0.6" />
          </>
        )}
        {variant === 'bottom' && (
          <>
            <rect x="0" y="0" width="600" height="55" fill="#2C1810" />
            {[0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550].map((x, i) => (
              <path key={i} d={`M${x} 0 Q${x + 25} 50 ${x + 50} 0`} fill="#3D2215" />
            ))}
            <line x1="0" y1="54.5" x2="600" y2="54.5" stroke={goldColor} strokeWidth="1.5" opacity="0.6" />
          </>
        )}
        {variant === 'strip' && (
          <>
            <rect x="0" y="0" width="600" height="44" fill="#2C1810" />
            <line x1="0" y1="1" x2="600" y2="1" stroke={goldColor} strokeWidth="1.5" opacity="0.5" />
            <line x1="0" y1="43" x2="600" y2="43" stroke={goldColor} strokeWidth="1.5" opacity="0.5" />
            <line x1="0" y1="22" x2="600" y2="22" stroke={goldColor} strokeWidth="0.5" opacity="0.2" />
          </>
        )}
      </svg>
    </div>
  );
}

function BatikPatternRenderer({ variant, animation, opacity, duration, delay, paused, accent }: {
  variant: 'parang' | 'truntum' | 'kawung'; animation: AnimationType; opacity: number; duration: number; delay: number; paused?: boolean; accent?: string;
}) {
  const goldColor = accent || '#D4AF37';
  const animStyle = getAnimationCSS(animation, duration, delay, paused);

  const renderParang = () => (
    <>
      <rect x="0" y="0" width="600" height="40" fill="#2C1810" />
      {[0, 60, 120, 180, 240, 300, 360, 420, 480, 540].map((x, i) => (
        <g key={i} transform={`translate(${x}, 0)`}>
          <path d="M0 20 L10 5 L20 0 L30 5 L40 20 L30 35 L20 40 L10 35Z" fill="#3D2215" />
          <path d="M10 10 L20 5 L30 10 L20 15Z" fill={goldColor} opacity="0.15" />
          <circle cx="20" cy="20" r="4" fill="none" stroke={goldColor} strokeWidth="0.5" opacity="0.3" />
          <circle cx="20" cy="20" r="1.5" fill={goldColor} opacity="0.2" />
        </g>
      ))}
      <line x1="0" y1="0.5" x2="600" y2="0.5" stroke={goldColor} strokeWidth="1" opacity="0.4" />
      <line x1="0" y1="39.5" x2="600" y2="39.5" stroke={goldColor} strokeWidth="1" opacity="0.4" />
    </>
  );

  const renderTruntum = () => (
    <>
      <rect x="0" y="0" width="600" height="40" fill="#2C1810" />
      {[20, 60, 100, 140, 180, 220, 260, 300, 340, 380, 420, 460, 500, 540, 580].map((x, i) => (
        <g key={i} transform={`translate(${x}, ${i % 2 === 0 ? 10 : 30})`}>
          <ellipse cx="0" cy="-3" rx="2" ry="4" fill={goldColor} opacity="0.2" />
          <ellipse cx="0" cy="3" rx="2" ry="4" fill={goldColor} opacity="0.2" />
          <ellipse cx="-3" cy="0" rx="4" ry="2" fill={goldColor} opacity="0.2" />
          <ellipse cx="3" cy="0" rx="4" ry="2" fill={goldColor} opacity="0.2" />
          <circle cx="0" cy="0" r="1.5" fill={goldColor} opacity="0.35" />
        </g>
      ))}
      <line x1="0" y1="0.5" x2="600" y2="0.5" stroke={goldColor} strokeWidth="0.8" opacity="0.3" />
      <line x1="0" y1="39.5" x2="600" y2="39.5" stroke={goldColor} strokeWidth="0.8" opacity="0.3" />
    </>
  );

  const renderKawung = () => (
    <>
      <rect x="0" y="0" width="600" height="40" fill="#2C1810" />
      {[20, 60, 100, 140, 180, 220, 260, 300, 340, 380, 420, 460, 500, 540, 580].map((x, i) => (
        <g key={i} transform={`translate(${x}, 20)`}>
          <rect x="-1.5" y="-6" width="3" height="12" rx="1.5" fill={goldColor} opacity="0.2" />
          <rect x="-6" y="-1.5" width="12" height="3" rx="1.5" fill={goldColor} opacity="0.2" />
          <circle cx="0" cy="0" r="2" fill={goldColor} opacity="0.25" />
          <circle cx="-5" cy="-5" r="1" fill={goldColor} opacity="0.1" />
          <circle cx="5" cy="-5" r="1" fill={goldColor} opacity="0.1" />
          <circle cx="-5" cy="5" r="1" fill={goldColor} opacity="0.1" />
          <circle cx="5" cy="5" r="1" fill={goldColor} opacity="0.1" />
        </g>
      ))}
      <line x1="0" y1="0.5" x2="600" y2="0.5" stroke={goldColor} strokeWidth="0.8" opacity="0.3" />
      <line x1="0" y1="39.5" x2="600" y2="39.5" stroke={goldColor} strokeWidth="0.8" opacity="0.3" />
    </>
  );

  return (
    <div className="w-full" style={{ opacity, ...animStyle }}>
      <svg viewBox="0 0 600 40" preserveAspectRatio="none" className="block w-full" style={{ height: 48 }}>
        {variant === 'parang' && renderParang()}
        {variant === 'truntum' && renderTruntum()}
        {variant === 'kawung' && renderKawung()}
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MEGA MENDUNG (Full-Size)
   ═══════════════════════════════════════════════════════════════ */
function MegaMendungRenderer({ direction, animation, opacity, size, duration, delay, paused }: {
  direction: 'left' | 'right'; animation: AnimationType; opacity: number; size: string; duration: number; delay: number; paused?: boolean;
}) {
  const sizeW = size === 'small' ? '80px' : size === 'medium' ? '120px' : size === 'large' ? '160px' : '200px';
  const animStyle: React.CSSProperties = {
    opacity,
    ...getAnimationCSS(animation, duration, delay, paused),
  };

  return (
    <div style={{ ...animStyle, width: sizeW }}>
      <svg viewBox="0 0 100 140" fill="none" className="w-full h-auto">
        <path d="M5 130 Q0 100 15 85 Q5 65 25 50 Q20 30 40 20 Q45 5 60 10 Q75 0 80 15 Q95 10 95 30 Q100 45 90 55 Q95 70 85 80 Q90 95 80 105 Q85 120 70 130Z" fill="#0D1B2A" />
        <path d="M20 120 Q16 100 28 90 Q22 74 38 64 Q34 48 48 40 Q52 28 64 32 Q74 26 76 38 Q86 34 86 50 Q90 60 82 68 Q86 78 78 88 Q82 100 72 110 Q76 118 62 122Z" fill="#2E5A6E" />
        <path d="M36 110 Q32 96 40 88 Q36 76 48 70 Q44 58 56 50 Q58 42 68 46 Q74 42 74 54 Q78 60 72 66 Q76 74 68 82 Q72 92 64 100 Q68 108 54 112Z" fill="#4682B4" />
        <path d="M52 100 Q48 92 54 86 Q50 78 58 74 Q54 66 64 60 Q66 54 72 56 Q74 54 74 62 Q76 66 72 68 Q74 72 68 78 Q72 84 66 92 Q68 98 58 102Z" fill="#87CEEB" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ORNAMENT RENDERERS (Full-Size)
   ═══════════════════════════════════════════════════════════════ */
function CandiBentarRenderer({ opacity, animation, duration, delay, paused, accent }: {
  opacity: number; animation: AnimationType; duration: number; delay: number; paused?: boolean; accent?: string;
}) {
  const goldColor = accent || '#D4AF37';
  const animStyle = getAnimationCSS(animation, duration, delay, paused);
  return (
    <div style={{ opacity, maxWidth: 200, ...animStyle }} className="mx-auto">
      <svg viewBox="0 0 160 100" fill="none" className="w-full h-auto">
        <path d="M10 95 L10 70 L14 65 L14 55 L18 50 L18 42 L22 38 L22 30 L28 25 L32 18 L38 14 L42 10 L48 8 L50 8" fill="#2C1810" stroke={goldColor} strokeWidth="0.8" />
        <path d="M150 95 L150 70 L146 65 L146 55 L142 50 L142 42 L138 38 L138 30 L132 25 L128 18 L122 14 L118 10 L112 8 L110 8" fill="#2C1810" stroke={goldColor} strokeWidth="0.8" />
        <path d="M60 12 Q70 4 80 8 Q90 4 100 12" stroke={goldColor} strokeWidth="1" fill="none" opacity="0.5" />
        <circle cx="80" cy="8" r="1.5" fill={goldColor} opacity="0.5" />
      </svg>
    </div>
  );
}

function GoldDividerRenderer({ opacity, animation, duration, delay, paused, accent }: {
  opacity: number; animation: AnimationType; duration: number; delay: number; paused?: boolean; accent?: string;
}) {
  const goldColor = accent || '#D4AF37';
  const animStyle = getAnimationCSS(animation, duration, delay, paused);
  return (
    <div className="flex items-center justify-center gap-3 py-2 w-full" style={{ opacity, ...animStyle }}>
      <div className="h-px flex-1 max-w-24" style={{ background: `linear-gradient(to right, transparent, ${goldColor})` }} />
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <ellipse cx="16" cy="8" rx="3.5" ry="5.5" fill={goldColor} opacity="0.5" />
        <ellipse cx="16" cy="24" rx="3.5" ry="5.5" fill={goldColor} opacity="0.5" />
        <ellipse cx="8" cy="16" rx="5.5" ry="3.5" fill={goldColor} opacity="0.5" />
        <ellipse cx="24" cy="16" rx="5.5" ry="3.5" fill={goldColor} opacity="0.5" />
        <circle cx="16" cy="16" r="3.5" fill={goldColor} opacity="0.7" />
      </svg>
      <div className="h-px flex-1 max-w-24" style={{ background: `linear-gradient(to left, transparent, ${goldColor})` }} />
    </div>
  );
}

function SulurSuluranRenderer({ opacity, animation, duration, delay, paused, accent }: {
  opacity: number; animation: AnimationType; duration: number; delay: number; paused?: boolean; accent?: string;
}) {
  const goldColor = accent || '#D4AF37';
  const animStyle = getAnimationCSS(animation, duration, delay, paused);
  return (
    <div className="w-full" style={{ opacity, ...animStyle }}>
      <svg viewBox="0 0 200 30" fill="none" className="w-full h-auto">
        <path d="M0 15 Q25 8 50 15 Q75 22 100 15 Q125 8 150 15 Q175 22 200 15" stroke="#5C3317" strokeWidth="1.5" fill="none" opacity="0.6" />
        <g transform="translate(50, 15)">
          <ellipse cx="0" cy="-3" rx="1.5" ry="3" fill={goldColor} opacity="0.4" />
          <ellipse cx="0" cy="3" rx="1.5" ry="3" fill={goldColor} opacity="0.4" />
          <ellipse cx="-3" cy="0" rx="3" ry="1.5" fill={goldColor} opacity="0.4" />
          <ellipse cx="3" cy="0" rx="3" ry="1.5" fill={goldColor} opacity="0.4" />
          <circle cx="0" cy="0" r="1.5" fill={goldColor} opacity="0.5" />
        </g>
        <g transform="translate(150, 15)">
          <ellipse cx="0" cy="-3" rx="1.5" ry="3" fill={goldColor} opacity="0.4" />
          <ellipse cx="0" cy="3" rx="1.5" ry="3" fill={goldColor} opacity="0.4" />
          <ellipse cx="-3" cy="0" rx="3" ry="1.5" fill={goldColor} opacity="0.4" />
          <ellipse cx="3" cy="0" rx="3" ry="1.5" fill={goldColor} opacity="0.4" />
          <circle cx="0" cy="0" r="1.5" fill={goldColor} opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}

function AksaraJawaRenderer({ text, opacity, animation, duration, delay, paused, accent, onTextClick }: {
  text?: string; opacity: number; animation: AnimationType; duration: number; delay: number; paused?: boolean; accent?: string; onTextClick?: () => void;
}) {
  const goldColor = accent || '#D4AF37';
  const animStyle = getAnimationCSS(animation, duration, delay, paused);
  return (
    <div className="text-center cursor-text group relative" style={{ opacity, ...animStyle }}
      onClick={(e) => { e.stopPropagation(); onTextClick?.(); }}>
      <span className="text-2xl tracking-[0.15em] group-hover:underline decoration-dashed underline-offset-4" style={{ color: goldColor }}>{text || 'ꦱꦶꦤꦺꦴꦩ꧀'}</span>
      <span className="absolute -top-1 -right-1 text-[8px] opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: goldColor }}>edit</span>
    </div>
  );
}

function DoubleBorderRenderer({ opacity, animation, duration, delay, paused, accent }: {
  opacity: number; animation: AnimationType; duration: number; delay: number; paused?: boolean; accent?: string;
}) {
  const goldColor = accent || '#D4AF37';
  const animStyle = getAnimationCSS(animation, duration, delay, paused);
  return (
    <div className="relative w-full" style={{ opacity, ...animStyle }}>
      <div className="absolute inset-0 border-2 rounded-sm" style={{ borderColor: goldColor, opacity: 0.4 }} />
      <div className="absolute inset-2 border rounded-sm" style={{ borderColor: '#2C1810', opacity: 0.15 }} />
      {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-5 h-5`} style={{ color: goldColor, opacity: 0.5 }}>
          <svg viewBox="0 0 20 20" fill="currentColor" width="100%" height="100%">
            <ellipse cx="10" cy="5" rx="3" ry="4" />
            <ellipse cx="10" cy="15" rx="3" ry="4" />
            <ellipse cx="5" cy="10" rx="4" ry="3" />
            <ellipse cx="15" cy="10" rx="4" ry="3" />
          </svg>
        </div>
      ))}
      <div className="relative p-4 min-h-[80px]" />
    </div>
  );
}

function ArchedFrameRenderer({ opacity, animation, duration, delay, paused, accent }: {
  opacity: number; animation: AnimationType; duration: number; delay: number; paused?: boolean; accent?: string;
}) {
  const goldColor = accent || '#D4AF37';
  const animStyle = getAnimationCSS(animation, duration, delay, paused);
  return (
    <div className="mx-auto" style={{ opacity, width: 120, height: 150, ...animStyle }}>
      <svg viewBox="0 0 160 200" fill="none" className="w-full h-auto">
        <path d="M10 200 L10 80 Q10 10 80 10 Q150 10 150 80 L150 200" stroke="#2C1810" strokeWidth="3" fill="none" />
        <path d="M15 200 L15 82 Q15 16 80 16 Q145 16 145 82 L145 200" stroke={goldColor} strokeWidth="1" fill="none" opacity="0.6" />
        <circle cx="80" cy="14" r="4" fill={goldColor} opacity="0.4" />
      </svg>
    </div>
  );
}

function FloralCornerRenderer({ position, opacity, animation, duration, delay, paused, accent }: {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'; opacity: number; animation: AnimationType; duration: number; delay: number; paused?: boolean; accent?: string;
}) {
  const goldColor = accent || '#D4AF37';
  const flipX = position.includes('right') ? 'scale(-1,1)' : '';
  const flipY = position.includes('bottom') ? 'scale(1,-1)' : '';
  const transform = `${flipX} ${flipY}`.trim() || undefined;
  const animStyle = getAnimationCSS(animation, duration, delay, paused);

  return (
    <div style={{ opacity, width: 60, height: 60, ...animStyle }}>
      <svg viewBox="0 0 80 80" fill="none" className="w-full h-auto" style={{ transform }}>
        <path d="M5 5 Q5 25 15 35 Q25 45 40 45 Q55 45 65 35" stroke="#5C3317" strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M5 5 Q15 5 25 12 Q35 20 40 32" stroke="#5C3317" strokeWidth="1.5" fill="none" opacity="0.4" />
        <path d="M15 15 Q20 10 18 18 Q16 22 15 15Z" fill="#5C3317" opacity="0.4" />
        <path d="M25 22 Q30 17 28 25 Q26 28 25 22Z" fill="#5C3317" opacity="0.4" />
        <g transform="translate(12, 12)">
          <ellipse cx="0" cy="-4" rx="2" ry="5" fill={goldColor} opacity="0.35" />
          <ellipse cx="0" cy="4" rx="2" ry="5" fill={goldColor} opacity="0.35" />
          <ellipse cx="-4" cy="0" rx="5" ry="2" fill={goldColor} opacity="0.35" />
          <ellipse cx="4" cy="0" rx="5" ry="2" fill={goldColor} opacity="0.35" />
          <circle cx="0" cy="0" r="2" fill={goldColor} opacity="0.5" />
        </g>
        <g transform="translate(30, 30)">
          <ellipse cx="0" cy="-2" rx="1" ry="2.5" fill={goldColor} opacity="0.25" />
          <ellipse cx="0" cy="2" rx="1" ry="2.5" fill={goldColor} opacity="0.25" />
          <circle cx="0" cy="0" r="1" fill={goldColor} opacity="0.35" />
        </g>
      </svg>
    </div>
  );
}

function LampuHiasRenderer({ opacity, animation, duration, delay, paused, accent }: {
  opacity: number; animation: AnimationType; duration: number; delay: number; paused?: boolean; accent?: string;
}) {
  const goldColor = accent || '#D4AF37';
  const bulbColors = ['#FFD700', '#FFA500', '#FF6347', '#FFD700', '#FFA500', '#FF6347', '#FFD700', '#FFA500', '#FF6347', '#FFD700', '#FFA500', '#FF6347'];
  const animStyle = getAnimationCSS(animation, duration, delay, paused);

  return (
    <div className="w-full" style={{ opacity, ...animStyle }}>
      <svg viewBox="0 0 600 24" fill="none" className="block w-full" style={{ height: 24 }}>
        <path d="M0 8 Q25 14 50 8 Q75 2 100 8 Q125 14 150 8 Q175 2 200 8 Q225 14 250 8 Q275 2 300 8 Q325 14 350 8 Q375 2 400 8 Q425 14 450 8 Q475 2 500 8 Q525 14 550 8 Q575 2 600 8" stroke="#5C3317" strokeWidth="0.8" fill="none" opacity="0.5" />
        {[25, 75, 125, 175, 225, 275, 325, 375, 425, 475, 525, 575].map((x, i) => {
          const y = i % 2 === 0 ? 12 : 4;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="5" fill={bulbColors[i]} opacity="0.15"
                style={{ animation: paused ? 'none' : `goldGlow ${3 + (i % 3)}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }} />
              <circle cx={x} cy={y} r="2.5" fill={bulbColors[i]} opacity="0.7" />
              <circle cx={x} cy={y} r="1.2" fill="#FFFFFF" opacity="0.4" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function BungaMelatiRenderer({ opacity, animation, duration, delay, paused }: {
  opacity: number; animation: AnimationType; duration: number; delay: number; paused?: boolean;
}) {
  const animStyle = getAnimationCSS(animation, duration, delay, paused);
  const petalPositions = [
    { x: 15, y: 20, r: 4, delay: 0 }, { x: 40, y: 10, r: 3.5, delay: 1.2 },
    { x: 65, y: 25, r: 4, delay: 2.4 }, { x: 85, y: 8, r: 3, delay: 0.8 },
    { x: 25, y: 45, r: 3.5, delay: 1.8 }, { x: 55, y: 50, r: 4, delay: 3 },
    { x: 75, y: 35, r: 3, delay: 0.4 }, { x: 10, y: 55, r: 3, delay: 2 },
    { x: 45, y: 60, r: 3.5, delay: 1 }, { x: 90, y: 55, r: 3, delay: 2.6 },
  ];

  return (
    <div className="w-full absolute inset-0 pointer-events-none" style={{ opacity, ...animStyle }}>
      <svg viewBox="0 0 100 70" fill="none" className="w-full h-auto" style={{ minHeight: 60 }}>
        {petalPositions.map((p, i) => (
          <g key={i} style={{
            animation: paused ? 'none' : `megaDrift ${6 + (i % 4)}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}>
            <ellipse cx={p.x} cy={p.y - p.r * 0.6} rx={p.r * 0.4} ry={p.r * 0.8} fill="#FFFFFF" opacity="0.5" />
            <ellipse cx={p.x} cy={p.y + p.r * 0.6} rx={p.r * 0.4} ry={p.r * 0.8} fill="#FFFFFF" opacity="0.5" />
            <ellipse cx={p.x - p.r * 0.6} cy={p.y} rx={p.r * 0.8} ry={p.r * 0.4} fill="#FFFFFF" opacity="0.5" />
            <ellipse cx={p.x + p.r * 0.6} cy={p.y} rx={p.r * 0.8} ry={p.r * 0.4} fill="#FFFFFF" opacity="0.5" />
            <circle cx={p.x} cy={p.y} r={p.r * 0.3} fill="#FFFACD" opacity="0.6" />
          </g>
        ))}
      </svg>
    </div>
  );
}

function KerisRenderer({ opacity, animation, duration, delay, paused, accent }: {
  opacity: number; animation: AnimationType; duration: number; delay: number; paused?: boolean; accent?: string;
}) {
  const goldColor = accent || '#D4AF37';
  const animStyle = getAnimationCSS(animation, duration, delay, paused);

  return (
    <div style={{ opacity, width: 50, height: 130, ...animStyle }} className="mx-auto">
      <svg viewBox="0 0 60 160" fill="none" className="w-full h-auto">
        <path d="M28 10 L30 5 L32 10 L30 25 L33 35 L30 45 L33 55 L30 65 L33 75 L30 85 L33 95 L30 105 L32 110"
          fill="#2C1810" stroke={goldColor} strokeWidth="0.5" opacity="0.9" />
        <path d="M30 10 L30 110" stroke={goldColor} strokeWidth="0.3" opacity="0.3" />
        <path d="M29 30 Q31 35 29 40 Q27 45 29 50 Q31 55 29 60 Q27 65 29 70 Q31 75 29 80 Q27 85 29 90 Q31 95 29 100"
          stroke={goldColor} strokeWidth="0.4" fill="none" opacity="0.3" />
        <path d="M25 108 L30 112 L35 108 L35 115 L30 118 L25 115Z" fill="#2C1810" stroke={goldColor} strokeWidth="0.5" opacity="0.6" />
        <path d="M26 118 L24 125 L28 128 L26 132 L30 135 L34 132 L32 128 L36 125 L34 118" fill="#3D2215" stroke={goldColor} strokeWidth="0.5" />
        <ellipse cx="30" cy="118" rx="6" ry="2" fill={goldColor} opacity="0.4" />
        <path d="M22 135 L20 142 L22 150 L30 155 L38 150 L40 142 L38 135" fill="#3D2215" stroke={goldColor} strokeWidth="0.5" opacity="0.7" />
        <line x1="24" y1="140" x2="36" y2="140" stroke={goldColor} strokeWidth="0.5" opacity="0.3" />
        <circle cx="30" cy="145" r="2" fill={goldColor} opacity="0.25" />
      </svg>
    </div>
  );
}

function ShadowScreenRenderer({ opacity, animation, duration, delay, paused }: {
  opacity: number; animation: AnimationType; duration: number; delay: number; paused?: boolean;
}) {
  const animStyle = getAnimationCSS(animation, duration, delay, paused);
  return (
    <div className="absolute inset-0 pointer-events-none" style={{
      boxShadow: 'inset 0 0 40px rgba(212,175,55,0.06)',
      opacity, ...animStyle,
    }} />
  );
}

/* ═══════════════════════════════════════════════════════════════
   RENDER ELEMENT — Main dispatcher
   ═══════════════════════════════════════════════════════════════ */
function RenderElement({ element, paused, accent, onTextClick }: {
  element: TemplateElement; paused?: boolean; accent?: string; onTextClick?: () => void;
}) {
  const el = element;
  const customWidth = el.props?.width && el.props.width < 100 && el.position !== 'background' ? `${el.props.width}%` : undefined;

  const content = (() => {
    switch (el.component) {
      case 'WayangKalpataru':
        return <WayangRenderer src="/wayang-kalpataru.png" alt="Kalpataru" animation={el.animation} opacity={el.opacity} size={el.size} duration={el.duration} delay={el.delay} paused={paused} />;
      case 'WayangArjuna':
        return <WayangRenderer src="/wayang-arjuna.png" alt="Arjuna" animation={el.animation} opacity={el.opacity} size={el.size} duration={el.duration} delay={el.delay} paused={paused} />;
      case 'WayangSrikandi':
        return <WayangRenderer src="/wayang-srikandi.png" alt="Srikandi" animation={el.animation} opacity={el.opacity} size={el.size} duration={el.duration} delay={el.delay} paused={paused} />;
      case 'WayangBima':
        return <WayangSVGRenderer variant="bima" animation={el.animation} opacity={el.opacity} size={el.size} duration={el.duration} delay={el.delay} paused={paused} />;
      case 'WayangGatotkaca':
        return <WayangSVGRenderer variant="gatotkaca" animation={el.animation} opacity={el.opacity} size={el.size} duration={el.duration} delay={el.delay} paused={paused} />;
      case 'WayangHanoman':
        return <WayangSVGRenderer variant="hanoman" animation={el.animation} opacity={el.opacity} size={el.size} duration={el.duration} delay={el.delay} paused={paused} />;
      case 'BatikScallopTop':
        return <BatikScallopRenderer variant="top" animation={el.animation} opacity={el.opacity} duration={el.duration} delay={el.delay} paused={paused} accent={accent} />;
      case 'BatikScallopBottom':
        return <BatikScallopRenderer variant="bottom" animation={el.animation} opacity={el.opacity} duration={el.duration} delay={el.delay} paused={paused} accent={accent} />;
      case 'BatikStripBorder':
        return <BatikScallopRenderer variant="strip" animation={el.animation} opacity={el.opacity} duration={el.duration} delay={el.delay} paused={paused} accent={accent} />;
      case 'BatikParang':
        return <BatikPatternRenderer variant="parang" animation={el.animation} opacity={el.opacity} duration={el.duration} delay={el.delay} paused={paused} accent={accent} />;
      case 'BatikTruntum':
        return <BatikPatternRenderer variant="truntum" animation={el.animation} opacity={el.opacity} duration={el.duration} delay={el.delay} paused={paused} accent={accent} />;
      case 'BatikKawung':
        return <BatikPatternRenderer variant="kawung" animation={el.animation} opacity={el.opacity} duration={el.duration} delay={el.delay} paused={paused} accent={accent} />;
      case 'MegamendungLeft':
        return <MegaMendungRenderer direction="left" animation={el.animation} opacity={el.opacity} size={el.size} duration={el.duration} delay={el.delay} paused={paused} />;
      case 'MegamendungRight':
        return <MegaMendungRenderer direction="right" animation={el.animation} opacity={el.opacity} size={el.size} duration={el.duration} delay={el.delay} paused={paused} />;
      case 'CandiBentar':
        return <CandiBentarRenderer opacity={el.opacity} animation={el.animation} duration={el.duration} delay={el.delay} paused={paused} accent={accent} />;
      case 'JavaneseGoldDivider':
        return <GoldDividerRenderer opacity={el.opacity} animation={el.animation} duration={el.duration} delay={el.delay} paused={paused} accent={accent} />;
      case 'SulurSuluran':
        return <SulurSuluranRenderer opacity={el.opacity} animation={el.animation} duration={el.duration} delay={el.delay} paused={paused} accent={accent} />;
      case 'AksaraJawaOrnament':
        return <AksaraJawaRenderer text={el.props?.text} opacity={el.opacity} animation={el.animation} duration={el.duration} delay={el.delay} paused={paused} accent={accent} onTextClick={onTextClick} />;
      case 'ShadowScreenAtmosphere':
        return <ShadowScreenRenderer opacity={el.opacity} animation={el.animation} duration={el.duration} delay={el.delay} paused={paused} />;
      case 'JavaneseDoubleBorder':
        return <DoubleBorderRenderer opacity={el.opacity} animation={el.animation} duration={el.duration} delay={el.delay} paused={paused} accent={accent} />;
      case 'ArchedPhotoFrame':
        return <ArchedFrameRenderer opacity={el.opacity} animation={el.animation} duration={el.duration} delay={el.delay} paused={paused} accent={accent} />;
      case 'FloralCornerTopLeft':
        return <FloralCornerRenderer position="top-left" opacity={el.opacity} animation={el.animation} duration={el.duration} delay={el.delay} paused={paused} accent={accent} />;
      case 'FloralCornerTopRight':
        return <FloralCornerRenderer position="top-right" opacity={el.opacity} animation={el.animation} duration={el.duration} delay={el.delay} paused={paused} accent={accent} />;
      case 'FloralCornerBottomLeft':
        return <FloralCornerRenderer position="bottom-left" opacity={el.opacity} animation={el.animation} duration={el.duration} delay={el.delay} paused={paused} accent={accent} />;
      case 'FloralCornerBottomRight':
        return <FloralCornerRenderer position="bottom-right" opacity={el.opacity} animation={el.animation} duration={el.duration} delay={el.delay} paused={paused} accent={accent} />;
      case 'LampuHias':
        return <LampuHiasRenderer opacity={el.opacity} animation={el.animation} duration={el.duration} delay={el.delay} paused={paused} accent={accent} />;
      case 'BungaMelati':
        return <BungaMelatiRenderer opacity={el.opacity} animation={el.animation} duration={el.duration} delay={el.delay} paused={paused} />;
      case 'KerisOrnament':
        return <KerisRenderer opacity={el.opacity} animation={el.animation} duration={el.duration} delay={el.delay} paused={paused} accent={accent} />;
      case 'CustomUploadedImage':
        return (
          <div className="relative" style={{ opacity: el.opacity }}>
            {el.props?.imageUrl ? (
              <img src={el.props.imageUrl} alt={el.props?.label || 'Custom'} className="max-w-full h-auto object-contain"
                style={{ width: sizeWidthMap[el.size] || 'auto', maxHeight: sizeHeightMap[el.size] || 'auto' }} />
            ) : (
              <div className="border-2 border-dashed rounded-lg p-4 text-center" style={{ borderColor: `${accent || '#D4AF37'}30` }}>
                <Upload className="size-8 mx-auto mb-2 opacity-40" />
                <div className="text-xs opacity-50">Upload gambar</div>
              </div>
            )}
          </div>
        );
      default:
        return <div className="text-xs text-red-400">Unknown: {el.component}</div>;
    }
  })();

  if (!customWidth) return content;
  return <div style={{ width: customWidth }} className="mx-auto">{content}</div>;
}

/* ═══════════════════════════════════════════════════════════════
   SECTION PLACEHOLDER — shown when section has no elements
   ═══════════════════════════════════════════════════════════════ */
function SectionPlaceholder({ sectionKey, theme }: { sectionKey: SectionKey; theme?: ThemeGradient }) {
  const placeholders: Record<SectionKey, { icon: string; title: string; subtitle: string }> = {
    'hero': { icon: '🏛️', title: 'Pembuka', subtitle: 'Nama & Tanggal' },
    'guest-welcome': { icon: '🙏', title: 'Assalamualaikum', subtitle: 'Sambutan Tamu' },
    'mempelai': { icon: '💑', title: 'Mempelai', subtitle: 'Nama Pasangan' },
    'adat-pepatah': { icon: '📜', title: 'Adat & Pepatah', subtitle: 'Ucapan Tradisi' },
    'love-quotes': { icon: '💕', title: 'Kata Cinta', subtitle: 'Ayat & Quotes' },
    'our-story': { icon: '📖', title: 'Cerita Kami', subtitle: 'Timeline Cinta' },
    'quran-verse': { icon: '🕌', title: 'Ayat Suci', subtitle: 'Al-Quran' },
    'event-details': { icon: '📅', title: 'Detail Acara', subtitle: 'Waktu & Tempat' },
    'countdown': { icon: '⏳', title: 'Hitung Mundur', subtitle: '00:00:00:00' },
    'wedding-itinerary': { icon: '📋', title: 'Rundown', subtitle: 'Susunan Acara' },
    'welcome-video': { icon: '🎬', title: 'Video', subtitle: 'Putar Video' },
    'photo-gallery': { icon: '📸', title: 'Galeri', subtitle: 'Koleksi Foto' },
    'bridesmaid-groomsman': { icon: '👫', title: 'Pengiring', subtitle: 'Brides & Grooms' },
    'rsvp': { icon: '✉️', title: 'RSVP', subtitle: 'Konfirmasi' },
    'guestbook': { icon: '📝', title: 'Buku Tamu', subtitle: 'Tulis Ucapan' },
    'amplop-digital': { icon: '🎁', title: 'Amplop', subtitle: 'Kirim Hadiah' },
    'share': { icon: '🔗', title: 'Bagikan', subtitle: 'Share Link' },
    'closing': { icon: '🙏', title: 'Penutup', subtitle: 'Terima Kasih' },
  };
  const p = placeholders[sectionKey];
  const titleColor = theme?.text || '#2C1810';
  const subColor = theme?.textSub || 'rgba(92, 51, 23, 0.6)';
  return (
    <div className="text-center py-6">
      <div className="text-3xl mb-2">{p.icon}</div>
      <div className="text-sm font-bold leading-tight" style={{ color: titleColor }}>{p.title}</div>
      <div className="text-xs mt-1" style={{ color: subColor }}>{p.subtitle}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VISUAL SECTION — Main Export

   Renders at FULL invitation size with proper element positioning
   ═══════════════════════════════════════════════════════════════ */
interface VisualSectionProps {
  section: TemplateSection;
  isSelected: boolean;
  selectedElementId: string | null;
  theme?: ThemeGradient;
  animationsPaused?: boolean;
  designVariant?: DesignVariant;
  onClick: () => void;
  onElementClick: (elementId: string) => void;
  onDropZoneClick: (position: string) => void;
  onTextElementClick?: (elementId: string) => void;
}

function getFlankWidth(elements: TemplateElement[]): number {
  if (elements.length === 0) return 80;
  const sizeMap: Record<string, number> = { small: 80, medium: 120, large: 160, full: 160 };
  const maxSize = Math.max(...elements.map(el => {
    const base = sizeMap[el.size] || 120;
    if (el.props?.width && el.props.width < 100) return Math.max(base * el.props.width / 100, 40);
    return base;
  }));
  return Math.min(maxSize + 16, 180);
}

export function VisualSection({
  section,
  isSelected,
  selectedElementId,
  theme,
  animationsPaused,
  designVariant,
  onClick,
  onElementClick,
  onDropZoneClick,
  onTextElementClick,
}: VisualSectionProps) {
  const accent = section.customAccent || theme?.accent || '#D4AF37';
  const sectionBg = section.customBg || theme?.sectionBg || 'rgba(44, 24, 16, 0.6)';

  // Separate elements by position
  const aboveElements = section.elements.filter(e => e.position === 'above');
  const belowElements = section.elements.filter(e => e.position === 'below');
  const centerElements = section.elements.filter(e => e.position === 'center');
  const flankLeftElements = section.elements.filter(e => e.position === 'flank-left' || e.position === 'left');
  const flankRightElements = section.elements.filter(e => e.position === 'flank-right' || e.position === 'right');
  const bgElements = section.elements.filter(e => e.position === 'background');

  const flankLeftW = getFlankWidth(flankLeftElements);
  const flankRightW = getFlankWidth(flankRightElements);

  // Section padding
  const pt = (section.paddingTop ?? 2) * 0.25;
  const pb = (section.paddingBottom ?? 2) * 0.25;

  // Build section background style
  const bgStyle = section.background
    ? renderSectionBackgroundStyle(section.background, theme || { sectionBg } as ThemeGradient)
    : { backgroundColor: sectionBg };

  const patternClass = section.background?.type === 'pattern' ? getPatternClassName(section.background.pattern) : '';

  // Click handler for element wrapper
  const handleElementClick = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    onElementClick(elementId);
  };

  // Element wrapper with animation, opacity, X/Y offset
  const ElementWrapper = ({ element, children }: { element: TemplateElement; children: React.ReactNode }) => {
    const isSelectedEl = selectedElementId === element.id;
    const xOffset = element.xOffset || 0;
    const yOffset = element.yOffset || 0;
    const animStyle = getAnimationCSS(element.animation, element.duration, element.delay, animationsPaused);

    return (
      <div
        className={`relative cursor-pointer transition-all ${isSelectedEl ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-transparent rounded' : 'hover:ring-1 hover:ring-blue-300/50 hover:rounded'}`}
        style={{
          ...animStyle,
          transform: `translate(${xOffset}%, ${yOffset}%)`,
          opacity: element.opacity,
        }}
        onClick={(e) => handleElementClick(e, element.id)}
      >
        {children}
      </div>
    );
  };

  return (
    <div
      className={`relative overflow-hidden transition-all cursor-pointer ${isSelected ? 'ring-2 ring-blue-500/60' : ''}`}
      style={{ ...bgStyle, paddingTop: `${pt}rem`, paddingBottom: `${pb}rem` }}
      onClick={onClick}
    >
      {/* Pattern overlay */}
      {patternClass && (
        <div className={`absolute inset-0 ${patternClass} pointer-events-none`}
          style={{ opacity: section.background?.patternOpacity ?? 0.1 }} />
      )}

      {/* Photo background overlay */}
      {section.background?.type === 'photo' && section.background.photoUrl && (
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${section.background.photoUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: section.background.photoOpacity ?? 0.3,
          }} />
      )}

      {/* Background elements (absolute overlay) */}
      {bgElements.map((el) => (
        <ElementWrapper key={el.id} element={el}>
          <RenderElement element={el} paused={animationsPaused} accent={accent} onTextClick={() => onTextElementClick?.(el.id)} />
        </ElementWrapper>
      ))}

      {/* Above zone */}
      {aboveElements.length > 0 && (
        <div className="flex flex-col items-center gap-2">
          {aboveElements.map((el) => (
            <ElementWrapper key={el.id} element={el}>
              <RenderElement element={el} paused={animationsPaused} accent={accent} onTextClick={() => onTextElementClick?.(el.id)} />
            </ElementWrapper>
          ))}
        </div>
      )}

      {/* Main content row: [Flank Left | Center | Flank Right] */}
      <div className="flex items-start gap-2">
        {/* Flank Left */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0" style={{ width: flankLeftW }}>
          {flankLeftElements.map((el) => (
            <ElementWrapper key={el.id} element={el}>
              <RenderElement element={el} paused={animationsPaused} accent={accent} onTextClick={() => onTextElementClick?.(el.id)} />
            </ElementWrapper>
          ))}
          {flankLeftElements.length === 0 && isSelected && (
            <button onClick={(e) => { e.stopPropagation(); onDropZoneClick('flank-left'); }}
              className="w-full h-12 border border-dashed border-blue-400/30 rounded-md text-[10px] text-blue-400/60 hover:bg-blue-400/5 transition-colors">
              + Kiri
            </button>
          )}
        </div>

        {/* Center */}
        <div className="flex-1 flex flex-col items-center gap-2 min-w-0">
          {centerElements.map((el) => (
            <ElementWrapper key={el.id} element={el}>
              <RenderElement element={el} paused={animationsPaused} accent={accent} onTextClick={() => onTextElementClick?.(el.id)} />
            </ElementWrapper>
          ))}
          {centerElements.length === 0 && aboveElements.length === 0 && belowElements.length === 0 && flankLeftElements.length === 0 && flankRightElements.length === 0 && (
            <SectionPlaceholder sectionKey={section.key} theme={theme} />
          )}
        </div>

        {/* Flank Right */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0" style={{ width: flankRightW }}>
          {flankRightElements.map((el) => (
            <ElementWrapper key={el.id} element={el}>
              <RenderElement element={el} paused={animationsPaused} accent={accent} onTextClick={() => onTextElementClick?.(el.id)} />
            </ElementWrapper>
          ))}
          {flankRightElements.length === 0 && isSelected && (
            <button onClick={(e) => { e.stopPropagation(); onDropZoneClick('flank-right'); }}
              className="w-full h-12 border border-dashed border-blue-400/30 rounded-md text-[10px] text-blue-400/60 hover:bg-blue-400/5 transition-colors">
              + Kanan
            </button>
          )}
        </div>
      </div>

      {/* Below zone */}
      {belowElements.length > 0 && (
        <div className="flex flex-col items-center gap-2">
          {belowElements.map((el) => (
            <ElementWrapper key={el.id} element={el}>
              <RenderElement element={el} paused={animationsPaused} accent={accent} onTextClick={() => onTextElementClick?.(el.id)} />
            </ElementWrapper>
          ))}
        </div>
      )}

      {/* Section label (visible when selected) */}
      {isSelected && (
        <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-blue-500 text-white text-[8px] rounded font-medium z-10 pointer-events-none">
          {SECTION_LABELS[section.key]}
        </div>
      )}
    </div>
  );
}
