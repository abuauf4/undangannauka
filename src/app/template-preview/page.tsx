'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { authFetch } from '@/lib/api-client';
import {
  TemplateConfig,
  TemplateSection,
  TemplateElement,
  SECTION_LABELS,
} from '@/lib/template-builder-types';
import {
  WayangKalpataru,
  WayangArjuna,
  WayangSrikandi,
  BatikScallopTop,
  BatikScallopBottom,
  BatikStripBorder,
  MegamendungLeft,
  MegamendungRight,
  AksaraJawaOrnament,
  JavaneseGoldDivider,
  SulurSuluran,
  CandiBentar,
  JavaneseDoubleBorder,
  ShadowScreenAtmosphere,
  ArchedPhotoFrame,
} from '@/components/invitation/javanese-ornaments';
import { InvitationThemeProvider } from '@/components/invitation/theme-provider';

// ─── Animation Styles Injector ───
function AnimationStyles() {
  return (
    <style>{`
      @keyframes tbSway {
        0%, 100% { transform: rotate(0deg); }
        15% { transform: rotate(0.8deg); }
        30% { transform: rotate(-0.5deg); }
        45% { transform: rotate(0.6deg); }
        60% { transform: rotate(-0.3deg); }
        75% { transform: rotate(0.4deg); }
        90% { transform: rotate(-0.2deg); }
      }
      @keyframes tbSwayReverse {
        0%, 100% { transform: rotate(0deg); }
        15% { transform: rotate(-0.8deg); }
        30% { transform: rotate(0.5deg); }
        45% { transform: rotate(-0.6deg); }
        60% { transform: rotate(0.3deg); }
        75% { transform: rotate(-0.4deg); }
        90% { transform: rotate(0.2deg); }
      }
      @keyframes tbShimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      @keyframes tbFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
      @keyframes tbPulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.9; }
      }
      @keyframes tbGlow {
        0%, 100% { filter: brightness(1) drop-shadow(0 0 12px rgba(212,175,55,0.2)); }
        50% { filter: brightness(1.15) drop-shadow(0 0 25px rgba(212,175,55,0.35)); }
      }
      @keyframes tbDrift {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(8px); }
      }
      @keyframes tbDriftReverse {
        0%, 100% { transform: translateX(0) scaleX(-1); }
        50% { transform: translateX(-8px) scaleX(-1); }
      }
      @keyframes tbAksaraShimmer {
        0%, 100% { text-shadow: 0 0 20px rgba(212,175,55,0.3), 0 0 40px rgba(212,175,55,0.1); }
        50% { text-shadow: 0 0 30px rgba(212,175,55,0.5), 0 0 60px rgba(212,175,55,0.2); }
      }
    `}</style>
  );
}

// ─── Size classes ───
const SIZE_CLASSES = {
  small: 'w-8 md:w-12',
  medium: 'w-14 md:w-20',
  large: 'w-24 md:w-36',
  full: 'w-full',
};

// ─── Render a single animated element ───
function AnimatedElement({ element }: { element: TemplateElement }) {
  const animationStyle = getAnimationStyle(element.animation, element.duration, element.delay);

  const component = renderComponent(element.component, element.props);
  if (!component) return null;

  const sizeClass = SIZE_CLASSES[element.size] || SIZE_CLASSES.medium;

  // Position wrapper
  if (element.position === 'above' || element.position === 'below') {
    return (
      <div style={animationStyle} className={`${element.size === 'full' ? 'w-full' : 'mx-auto ' + sizeClass}`}>
        {component}
      </div>
    );
  }

  if (element.position === 'flank-left' || element.position === 'left') {
    return (
      <div style={{ ...animationStyle, opacity: element.opacity }} className={`flex-shrink-0 ${sizeClass}`}>
        {component}
      </div>
    );
  }

  if (element.position === 'flank-right' || element.position === 'right') {
    return (
      <div style={animationStyle} className={`flex-shrink-0 ${sizeClass}`}>
        {component}
      </div>
    );
  }

  // center / background
  return (
    <div style={animationStyle} className={`${element.size === 'full' ? 'w-full' : 'mx-auto ' + sizeClass}`}>
      {component}
    </div>
  );
}

// ─── Get CSS animation style from animation type ───
function getAnimationStyle(animation: string, duration: number, delay: number): React.CSSProperties {
  const base: React.CSSProperties = {};

  switch (animation) {
    case 'sway':
      base.animation = `tbSway ${duration}s ease-in-out infinite`;
      base.transformOrigin = 'top center';
      break;
    case 'swayReverse':
      base.animation = `tbSwayReverse ${duration}s ease-in-out infinite`;
      base.transformOrigin = 'top center';
      break;
    case 'shimmer':
      base.animation = `tbShimmer ${duration}s linear infinite`;
      break;
    case 'float':
      base.animation = `tbFloat ${duration}s ease-in-out infinite`;
      base.animationDelay = `${delay}s`;
      break;
    case 'pulse':
      base.animation = `tbPulse ${duration}s ease-in-out infinite`;
      break;
    case 'glow':
      base.animation = `tbGlow ${duration}s ease-in-out infinite`;
      break;
    case 'drift':
      base.animation = `tbDrift ${duration}s ease-in-out infinite`;
      break;
    case 'driftReverse':
      base.animation = `tbDriftReverse ${duration}s ease-in-out infinite`;
      break;
    case 'fadeIn':
    case 'fadeInUp':
    case 'fadeInLeft':
    case 'fadeInRight':
      // Handled by framer-motion below
      break;
    case 'none':
    default:
      break;
  }

  return base;
}

// ─── Render the correct component by type ───
function renderComponent(type: string, props?: Record<string, any>): React.ReactNode {
  switch (type) {
    case 'WayangKalpataru':
      return <WayangKalpataru />;
    case 'WayangArjuna':
      return <WayangArjuna />;
    case 'WayangSrikandi':
      return <WayangSrikandi />;
    case 'BatikScallopTop':
      return <BatikScallopTop />;
    case 'BatikScallopBottom':
      return <BatikScallopBottom />;
    case 'BatikStripBorder':
      return <BatikStripBorder />;
    case 'MegamendungLeft':
      return <MegamendungLeft />;
    case 'MegamendungRight':
      return <MegamendungRight />;
    case 'AksaraJawaOrnament':
      return <AksaraJawaOrnament text={props?.text || 'ꦱꦶꦤꦺꦴꦩ꧀'} />;
    case 'JavaneseGoldDivider':
      return <JavaneseGoldDivider />;
    case 'SulurSuluran':
      return <SulurSuluran />;
    case 'CandiBentar':
      return <CandiBentar />;
    case 'JavaneseDoubleBorder':
      return <JavaneseDoubleBorder><div /></JavaneseDoubleBorder>;
    case 'ShadowScreenAtmosphere':
      return <ShadowScreenAtmosphere><div /></ShadowScreenAtmosphere>;
    case 'WayangBima':
      return (
        <div className="w-full h-auto" style={{ maxWidth: 60 }}>
          <svg viewBox="0 0 108 125" fill="none" className="w-full h-auto">
            <path d="M50 10 Q55 5 60 8 Q65 5 68 10 L70 18 Q72 22 70 26 L68 30 Q66 34 62 36 L60 38 L58 42 L56 38 Q54 36 52 34 L50 30 Q48 26 48 22 L48 18 Q48 14 50 10Z" fill="#2C1810" />
            <path d="M48 12 L46 4 L50 8 L52 2 L56 8 L58 4 L60 12" fill="#3D2215" stroke="#D4AF37" strokeWidth="0.5" />
            <path d="M44 38 L42 50 L40 65 L38 80 L36 95 L40 98 L46 95 L48 80 L50 65 L52 50 L54 38Z" fill="#2C1810" />
            <path d="M54 38 L56 50 L58 65 L60 80 L62 95 L68 98 L72 95 L70 80 L68 65 L66 50 L64 38Z" fill="#2C1810" />
            <path d="M44 50 L30 46 L28 44 L30 42 L44 46" fill="#2C1810" stroke="#D4AF37" strokeWidth="0.5" />
            <circle cx="54" cy="22" r="2" fill="#D4AF37" opacity="0.6" />
            <path d="M38 95 L36 110 L40 120 L48 125 L56 125 L64 125 L72 120 L76 110 L74 95" fill="#3D2215" />
          </svg>
        </div>
      );
    case 'WayangGatotkaca':
      return (
        <div className="w-full h-auto" style={{ maxWidth: 60 }}>
          <svg viewBox="0 0 108 125" fill="none" className="w-full h-auto">
            <path d="M50 8 Q55 3 60 6 Q65 3 68 8 L70 16 Q72 20 70 24 L68 28 Q66 32 62 34 L60 36 L58 40 L56 36 Q54 34 52 32 L50 28 Q48 24 48 20 L48 16 Q48 12 50 8Z" fill="#2C1810" />
            <path d="M46 10 L44 0 L48 6 L50 -2 L54 6 L56 -1 L58 6 L60 0 L62 10" fill="#3D2215" stroke="#D4AF37" strokeWidth="0.5" />
            <path d="M44 36 L42 48 L40 60 L38 75 L36 90 L40 93 L46 90 L48 75 L50 60 L52 48 L54 36Z" fill="#2C1810" />
            <path d="M54 36 L56 48 L58 60 L60 75 L62 90 L68 93 L72 90 L70 75 L68 60 L66 48 L64 36Z" fill="#2C1810" />
            <line x1="46" y1="42" x2="62" y2="48" stroke="#D4AF37" strokeWidth="0.4" opacity="0.5" />
            <line x1="46" y1="48" x2="62" y2="42" stroke="#D4AF37" strokeWidth="0.4" opacity="0.5" />
            <circle cx="54" cy="44" r="2.5" fill="#D4AF37" opacity="0.5" />
            <path d="M38 90 L36 108 L40 118 L48 123 L56 123 L64 123 L72 118 L76 108 L74 90" fill="#3D2215" />
          </svg>
        </div>
      );
    case 'WayangHanoman':
      return (
        <div className="w-full h-auto" style={{ maxWidth: 60 }}>
          <svg viewBox="0 0 108 125" fill="none" className="w-full h-auto">
            <path d="M50 10 Q55 4 60 8 Q65 4 68 10 L70 20 Q72 24 70 28 L68 32 Q65 36 60 38 L58 40 L56 38 Q52 36 50 32 L48 28 Q46 24 48 20 L48 14 Q48 12 50 10Z" fill="#2C1810" />
            <path d="M46 16 L38 12 L42 20" fill="#2C1810" stroke="#D4AF37" strokeWidth="0.5" />
            <path d="M70 16 L78 12 L74 20" fill="#2C1810" stroke="#D4AF37" strokeWidth="0.5" />
            <path d="M48 10 L46 2 L50 6 L54 0 L58 6 L62 2 L64 10" fill="#3D2215" stroke="#D4AF37" strokeWidth="0.5" />
            <path d="M44 38 L42 50 L40 65 L38 80 L36 95 L40 98 L46 95 L48 80 L50 65 L52 50 L54 38Z" fill="#2C1810" />
            <path d="M54 38 L56 50 L58 65 L60 80 L62 95 L68 98 L72 95 L70 80 L68 65 L66 50 L64 38Z" fill="#2C1810" />
            <path d="M68 70 Q80 60 82 50 Q84 40 78 35 Q74 32 72 36 Q70 40 74 42" fill="none" stroke="#2C1810" strokeWidth="2" />
            <circle cx="54" cy="20" r="1.5" fill="#D4AF37" opacity="0.5" />
            <path d="M38 95 L36 110 L40 118 L48 123 L56 123 L64 123 L72 118 L76 110 L74 95" fill="#3D2215" />
          </svg>
        </div>
      );
    case 'BatikParang':
      return (
        <div className="w-full overflow-hidden" style={{ height: 24 }}>
          <svg viewBox="0 0 600 40" preserveAspectRatio="none" className="block w-full" style={{ height: 24 }}>
            <rect x="0" y="0" width="600" height="40" fill="#2C1810" />
            {[0, 60, 120, 180, 240, 300, 360, 420, 480, 540].map((x, i) => (
              <g key={i} transform={`translate(${x}, 0)`}>
                <path d="M0 20 L10 5 L20 0 L30 5 L40 20 L30 35 L20 40 L10 35Z" fill="#3D2215" />
                <path d="M10 10 L20 5 L30 10 L20 15Z" fill="#D4AF37" opacity="0.15" />
                <circle cx="20" cy="20" r="4" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.3" />
              </g>
            ))}
            <line x1="0" y1="0.5" x2="600" y2="0.5" stroke="#D4AF37" strokeWidth="1" opacity="0.4" />
            <line x1="0" y1="39.5" x2="600" y2="39.5" stroke="#D4AF37" strokeWidth="1" opacity="0.4" />
          </svg>
        </div>
      );
    case 'BatikTruntum':
      return (
        <div className="w-full overflow-hidden" style={{ height: 24 }}>
          <svg viewBox="0 0 600 40" preserveAspectRatio="none" className="block w-full" style={{ height: 24 }}>
            <rect x="0" y="0" width="600" height="40" fill="#2C1810" />
            {[20, 60, 100, 140, 180, 220, 260, 300, 340, 380, 420, 460, 500, 540, 580].map((x, i) => (
              <g key={i} transform={`translate(${x}, ${i % 2 === 0 ? 10 : 30})`}>
                <ellipse cx="0" cy="-3" rx="2" ry="4" fill="#D4AF37" opacity="0.2" />
                <ellipse cx="0" cy="3" rx="2" ry="4" fill="#D4AF37" opacity="0.2" />
                <ellipse cx="-3" cy="0" rx="4" ry="2" fill="#D4AF37" opacity="0.2" />
                <ellipse cx="3" cy="0" rx="4" ry="2" fill="#D4AF37" opacity="0.2" />
                <circle cx="0" cy="0" r="1.5" fill="#D4AF37" opacity="0.35" />
              </g>
            ))}
            <line x1="0" y1="0.5" x2="600" y2="0.5" stroke="#D4AF37" strokeWidth="0.8" opacity="0.3" />
            <line x1="0" y1="39.5" x2="600" y2="39.5" stroke="#D4AF37" strokeWidth="0.8" opacity="0.3" />
          </svg>
        </div>
      );
    case 'BatikKawung':
      return (
        <div className="w-full overflow-hidden" style={{ height: 24 }}>
          <svg viewBox="0 0 600 40" preserveAspectRatio="none" className="block w-full" style={{ height: 24 }}>
            <rect x="0" y="0" width="600" height="40" fill="#2C1810" />
            {[20, 60, 100, 140, 180, 220, 260, 300, 340, 380, 420, 460, 500, 540, 580].map((x, i) => (
              <g key={i} transform={`translate(${x}, 20)`}>
                <rect x="-1.5" y="-6" width="3" height="12" rx="1.5" fill="#D4AF37" opacity="0.2" />
                <rect x="-6" y="-1.5" width="12" height="3" rx="1.5" fill="#D4AF37" opacity="0.2" />
                <circle cx="0" cy="0" r="2" fill="#D4AF37" opacity="0.25" />
              </g>
            ))}
            <line x1="0" y1="0.5" x2="600" y2="0.5" stroke="#D4AF37" strokeWidth="0.8" opacity="0.3" />
            <line x1="0" y1="39.5" x2="600" y2="39.5" stroke="#D4AF37" strokeWidth="0.8" opacity="0.3" />
          </svg>
        </div>
      );
    case 'FloralCornerTopLeft':
      return (
        <div style={{ width: 40, height: 40 }}>
          <svg viewBox="0 0 80 80" fill="none" className="w-full h-auto">
            <path d="M5 5 Q5 25 15 35 Q25 45 40 45 Q55 45 65 35" stroke="#5C3317" strokeWidth="2" fill="none" opacity="0.6" />
            <path d="M5 5 Q15 5 25 12 Q35 20 40 32" stroke="#5C3317" strokeWidth="1.5" fill="none" opacity="0.4" />
            <g transform="translate(12, 12)">
              <ellipse cx="0" cy="-4" rx="2" ry="5" fill="#D4AF37" opacity="0.35" />
              <ellipse cx="0" cy="4" rx="2" ry="5" fill="#D4AF37" opacity="0.35" />
              <ellipse cx="-4" cy="0" rx="5" ry="2" fill="#D4AF37" opacity="0.35" />
              <ellipse cx="4" cy="0" rx="5" ry="2" fill="#D4AF37" opacity="0.35" />
              <circle cx="0" cy="0" r="2" fill="#D4AF37" opacity="0.5" />
            </g>
          </svg>
        </div>
      );
    case 'FloralCornerTopRight':
      return (
        <div style={{ width: 40, height: 40 }}>
          <svg viewBox="0 0 80 80" fill="none" className="w-full h-auto" style={{ transform: 'scale(-1,1)' }}>
            <path d="M5 5 Q5 25 15 35 Q25 45 40 45 Q55 45 65 35" stroke="#5C3317" strokeWidth="2" fill="none" opacity="0.6" />
            <path d="M5 5 Q15 5 25 12 Q35 20 40 32" stroke="#5C3317" strokeWidth="1.5" fill="none" opacity="0.4" />
            <g transform="translate(12, 12)">
              <ellipse cx="0" cy="-4" rx="2" ry="5" fill="#D4AF37" opacity="0.35" />
              <ellipse cx="0" cy="4" rx="2" ry="5" fill="#D4AF37" opacity="0.35" />
              <ellipse cx="-4" cy="0" rx="5" ry="2" fill="#D4AF37" opacity="0.35" />
              <ellipse cx="4" cy="0" rx="5" ry="2" fill="#D4AF37" opacity="0.35" />
              <circle cx="0" cy="0" r="2" fill="#D4AF37" opacity="0.5" />
            </g>
          </svg>
        </div>
      );
    case 'FloralCornerBottomLeft':
      return (
        <div style={{ width: 40, height: 40 }}>
          <svg viewBox="0 0 80 80" fill="none" className="w-full h-auto" style={{ transform: 'scale(1,-1)' }}>
            <path d="M5 5 Q5 25 15 35 Q25 45 40 45 Q55 45 65 35" stroke="#5C3317" strokeWidth="2" fill="none" opacity="0.6" />
            <path d="M5 5 Q15 5 25 12 Q35 20 40 32" stroke="#5C3317" strokeWidth="1.5" fill="none" opacity="0.4" />
            <g transform="translate(12, 12)">
              <ellipse cx="0" cy="-4" rx="2" ry="5" fill="#D4AF37" opacity="0.35" />
              <ellipse cx="0" cy="4" rx="2" ry="5" fill="#D4AF37" opacity="0.35" />
              <ellipse cx="-4" cy="0" rx="5" ry="2" fill="#D4AF37" opacity="0.35" />
              <ellipse cx="4" cy="0" rx="5" ry="2" fill="#D4AF37" opacity="0.35" />
              <circle cx="0" cy="0" r="2" fill="#D4AF37" opacity="0.5" />
            </g>
          </svg>
        </div>
      );
    case 'FloralCornerBottomRight':
      return (
        <div style={{ width: 40, height: 40 }}>
          <svg viewBox="0 0 80 80" fill="none" className="w-full h-auto" style={{ transform: 'scale(-1,-1)' }}>
            <path d="M5 5 Q5 25 15 35 Q25 45 40 45 Q55 45 65 35" stroke="#5C3317" strokeWidth="2" fill="none" opacity="0.6" />
            <path d="M5 5 Q15 5 25 12 Q35 20 40 32" stroke="#5C3317" strokeWidth="1.5" fill="none" opacity="0.4" />
            <g transform="translate(12, 12)">
              <ellipse cx="0" cy="-4" rx="2" ry="5" fill="#D4AF37" opacity="0.35" />
              <ellipse cx="0" cy="4" rx="2" ry="5" fill="#D4AF37" opacity="0.35" />
              <ellipse cx="-4" cy="0" rx="5" ry="2" fill="#D4AF37" opacity="0.35" />
              <ellipse cx="4" cy="0" rx="5" ry="2" fill="#D4AF37" opacity="0.35" />
              <circle cx="0" cy="0" r="2" fill="#D4AF37" opacity="0.5" />
            </g>
          </svg>
        </div>
      );
    case 'LampuHias':
      return (
        <div className="w-full" style={{ height: 16 }}>
          <svg viewBox="0 0 600 24" fill="none" className="block w-full" style={{ height: 16 }}>
            <path d="M0 8 Q25 14 50 8 Q75 2 100 8 Q125 14 150 8 Q175 2 200 8 Q225 14 250 8 Q275 2 300 8 Q325 14 350 8 Q375 2 400 8 Q425 14 450 8 Q475 2 500 8 Q525 14 550 8 Q575 2 600 8" stroke="#5C3317" strokeWidth="0.8" fill="none" opacity="0.5" />
            {[25, 75, 125, 175, 225, 275, 325, 375, 425, 475, 525, 575].map((x, i) => {
              const y = i % 2 === 0 ? 12 : 4;
              const colors = ['#FFD700', '#FFA500', '#FF6347'];
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r="5" fill={colors[i % 3]} opacity="0.15" />
                  <circle cx={x} cy={y} r="2.5" fill={colors[i % 3]} opacity="0.7" />
                  <circle cx={x} cy={y} r="1.2" fill="#FFFFFF" opacity="0.4" />
                </g>
              );
            })}
          </svg>
        </div>
      );
    case 'BungaMelati':
      return (
        <div className="w-full relative" style={{ minHeight: 40 }}>
          <svg viewBox="0 0 100 60" fill="none" className="w-full h-auto" style={{ minHeight: 40 }}>
            {[
              { x: 15, y: 20, r: 3 }, { x: 40, y: 10, r: 2.5 }, { x: 65, y: 25, r: 3 },
              { x: 85, y: 8, r: 2 }, { x: 25, y: 40, r: 2.5 }, { x: 55, y: 45, r: 3 },
              { x: 75, y: 35, r: 2 }, { x: 10, y: 50, r: 2 }, { x: 45, y: 55, r: 2.5 },
              { x: 90, y: 50, r: 2 },
            ].map((p, i) => (
              <g key={i}>
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
    case 'KerisOrnament':
      return (
        <div className="mx-auto" style={{ width: 30, height: 80 }}>
          <svg viewBox="0 0 60 160" fill="none" className="w-full h-auto">
            <path d="M28 10 L30 5 L32 10 L30 25 L33 35 L30 45 L33 55 L30 65 L33 75 L30 85 L33 95 L30 105 L32 110" fill="#2C1810" stroke="#D4AF37" strokeWidth="0.5" opacity="0.9" />
            <path d="M30 10 L30 110" stroke="#D4AF37" strokeWidth="0.3" opacity="0.3" />
            <path d="M25 108 L30 112 L35 108 L35 115 L30 118 L25 115Z" fill="#2C1810" stroke="#D4AF37" strokeWidth="0.5" opacity="0.6" />
            <path d="M26 118 L24 125 L28 128 L26 132 L30 135 L34 132 L32 128 L36 125 L34 118" fill="#3D2215" stroke="#D4AF37" strokeWidth="0.5" />
            <path d="M22 135 L20 142 L22 150 L30 155 L38 150 L40 142 L38 135" fill="#3D2215" stroke="#D4AF37" strokeWidth="0.5" opacity="0.7" />
          </svg>
        </div>
      );
    case 'CustomUploadedImage':
      return (
        <div className="border-2 border-dashed rounded-lg p-3 text-center" style={{ borderColor: 'rgba(212,175,55,0.3)' }}>
          <div className="text-[8px]" style={{ color: 'var(--inv-text-muted, #5C3317)' }}>Custom Image</div>
        </div>
      );
    case 'ArchedPhotoFrame':
      return <ArchedPhotoFrame src="" alt="Photo Frame" />;
    default:
      return null;
  }
}

// ─── Render a section with its elements ───
function RenderSection({ section }: { section: TemplateSection }) {
  const aboveElements = section.elements.filter((e) => e.position === 'above');
  const belowElements = section.elements.filter((e) => e.position === 'below');
  const leftElements = section.elements.filter((e) => e.position === 'left' || e.position === 'flank-left');
  const rightElements = section.elements.filter((e) => e.position === 'right' || e.position === 'flank-right');
  const centerElements = section.elements.filter((e) => e.position === 'center' || e.position === 'background');

  return (
    <div className="relative py-4">
      {/* Above elements */}
      {aboveElements.length > 0 && (
        <div className="space-y-1 mb-2">
          {aboveElements.map((el) => (
            <AnimatedElement key={el.id} element={el} />
          ))}
        </div>
      )}

      {/* Main row with flanking */}
      {(leftElements.length > 0 || rightElements.length > 0) ? (
        <div className="flex items-center gap-2">
          {/* Left/Flank-left */}
          {leftElements.length > 0 && (
            <div className="flex flex-col gap-1">
              {leftElements.map((el) => (
                <div key={el.id} style={{ opacity: el.opacity }}>
                  <AnimatedElement element={el} />
                </div>
              ))}
            </div>
          )}

          {/* Center content */}
          <div className="flex-1">
            {centerElements.map((el) => (
              <AnimatedElement key={el.id} element={el} />
            ))}
            {/* Section placeholder content */}
            <div className="text-center py-6 px-4">
              <p className="font-[family-name:var(--font-playfair)] text-lg" style={{ color: 'var(--inv-accent)' }}>
                {SECTION_LABELS[section.key]}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--inv-text-muted)' }}>
                Konten seksi akan muncul di sini
              </p>
            </div>
          </div>

          {/* Right/Flank-right */}
          {rightElements.length > 0 && (
            <div className="flex flex-col gap-1">
              {rightElements.map((el) => (
                <div key={el.id} style={{ opacity: el.opacity }}>
                  <AnimatedElement element={el} />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {centerElements.map((el) => (
            <AnimatedElement key={el.id} element={el} />
          ))}
          {/* Section placeholder */}
          <div className="text-center py-6 px-4">
            <p className="font-[family-name:var(--font-playfair)] text-lg" style={{ color: 'var(--inv-accent)' }}>
              {SECTION_LABELS[section.key]}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--inv-text-muted)' }}>
              Konten seksi akan muncul di sini
            </p>
          </div>
        </div>
      )}

      {/* Below elements */}
      {belowElements.length > 0 && (
        <div className="space-y-1 mt-2">
          {belowElements.map((el) => (
            <AnimatedElement key={el.id} element={el} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Preview Page ───
function TemplatePreviewContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('id');
  const [config, setConfig] = useState<TemplateConfig | null>(null);
  const [templateInfo, setTemplateInfo] = useState<{ name: string; adat: string; nuansa: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTemplate() {
      if (!templateId) {
        setError('ID template tidak ditemukan');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/template/${templateId}`);
        if (!res.ok) throw new Error('Template tidak ditemukan');
        const data = await res.json();
        setTemplateInfo({
          name: data.template.name,
          adat: data.template.adat,
          nuansa: data.template.nuansa,
        });
        setConfig(data.template.config as TemplateConfig);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadTemplate();
  }, [templateId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F0E6' }}>
        <Loader2 className="size-8 animate-spin" style={{ color: '#D4AF37' }} />
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F0E6' }}>
        <div className="text-center">
          <p className="font-[family-name:var(--font-playfair)] text-xl" style={{ color: '#800020' }}>
            {error || 'Template tidak ditemukan'}
          </p>
          <Link href="/template-builder" className="text-sm mt-2 inline-block" style={{ color: '#C9A84C' }}>
            Kembali ke Builder
          </Link>
        </div>
      </div>
    );
  }

  return (
    <InvitationThemeProvider
      nuansa={(templateInfo?.nuansa || 'islam') as any}
      adat={(templateInfo?.adat || 'jawa') as any}
      tingkat="mewah"
    >
      <AnimationStyles />
      <div className="relative min-h-screen" style={{ backgroundColor: 'var(--inv-bg)' }}>
        {/* Back button */}
        <div className="fixed top-3 left-3 z-50">
          <Link
            href={`/template-builder${templateId ? `?edit=${templateId}` : ''}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm text-white/80 text-xs hover:bg-black/50 transition-colors"
          >
            <ArrowLeft className="size-3" />
            Builder
          </Link>
        </div>

        {/* Template content */}
        <div className="max-w-lg mx-auto">
          {config.sections
            .filter((s) => s.enabled)
            .map((section) => (
              <motion.div
                key={section.key}
                initial={
                  section.elements.some((e) => e.animation.startsWith('fadeIn'))
                    ? { opacity: 0, y: section.elements.find((e) => e.animation === 'fadeInUp') ? 20 : 0 }
                    : undefined
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8 }}
              >
                <RenderSection section={section} />
                <div className="my-1">
                  <JavaneseGoldDivider />
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </InvitationThemeProvider>
  );
}

export default function TemplatePreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F0E6' }}>
          <Loader2 className="size-8 animate-spin" style={{ color: '#D4AF37' }} />
        </div>
      }
    >
      <TemplatePreviewContent />
    </Suspense>
  );
}
