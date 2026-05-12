'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

/* ═══════════════════════════════════════════════════════════════
   JAVANESE ORNAMENTS — LIVING, ANIMATED visual elements
   
   Wayang kulit ANIMATED like a real dalang performance:
   - Puppets SWAY on their puppet rods (tangkai)
   - SHADOW flickers like oil lamp (blencong) backlight
   - GOLD filigree GLOWS and pulses warmly
   - Shadow screen (kelir) atmosphere effect
   
   Batik patterns ALIVE:
   - Kawung petals breathe/pulse subtly
   - Gold threads SHIMMER across patterns
   - Parang blades flow diagonally
   
   Mega Mendung clouds DRIFT slowly across the screen
   
   Color palette: 
   - Ivory #F5F0E6 (aged paper/cloth background)
   - Dark Brown #2C1810 (wayang silhouette, sogan dye)
   - Sogan Brown #5C3317 (traditional batik brown)
   - Gold #D4AF37 (prada/gold leaf accents)
   - Indigo #1B2744 (mega mendung blue)
   ═══════════════════════════════════════════════════════════════ */

/* ─── Oil Lamp Flicker Keyframes (injected once) ─── */
function OilLampFlickerCSS() {
  return (
    <style>{`
      @keyframes wayangSway {
        0%, 100% { transform: rotate(0deg); }
        15% { transform: rotate(0.8deg); }
        30% { transform: rotate(-0.5deg); }
        45% { transform: rotate(0.6deg); }
        60% { transform: rotate(-0.3deg); }
        75% { transform: rotate(0.4deg); }
        90% { transform: rotate(-0.2deg); }
      }
      @keyframes wayangSwayReverse {
        0%, 100% { transform: rotate(0deg); }
        15% { transform: rotate(-0.8deg); }
        30% { transform: rotate(0.5deg); }
        45% { transform: rotate(-0.6deg); }
        60% { transform: rotate(0.3deg); }
        75% { transform: rotate(-0.4deg); }
        90% { transform: rotate(0.2deg); }
      }
      @keyframes shadowFlicker {
        0%, 100% { opacity: 0.4; filter: blur(8px); }
        10% { opacity: 0.5; filter: blur(7px); }
        20% { opacity: 0.35; filter: blur(9px); }
        30% { opacity: 0.45; filter: blur(8px); }
        40% { opacity: 0.38; filter: blur(10px); }
        50% { opacity: 0.5; filter: blur(7px); }
        60% { opacity: 0.42; filter: blur(9px); }
        70% { opacity: 0.48; filter: blur(8px); }
        80% { opacity: 0.36; filter: blur(10px); }
        90% { opacity: 0.44; filter: blur(7px); }
      }
      @keyframes goldGlow {
        0%, 100% { filter: brightness(1.05) drop-shadow(0 0 12px rgba(212,175,55,0.2)); }
        50% { filter: brightness(1.15) drop-shadow(0 0 25px rgba(212,175,55,0.35)); }
      }
      @keyframes shadowScreenGlow {
        0%, 100% { box-shadow: inset 0 0 60px rgba(212,175,55,0.03); }
        50% { box-shadow: inset 0 0 80px rgba(212,175,55,0.06); }
      }
      @keyframes batikShimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      @keyframes megaDrift {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(8px); }
      }
      @keyframes megaDriftReverse {
        0%, 100% { transform: translateX(0) scaleX(-1); }
        50% { transform: translateX(-8px) scaleX(-1); }
      }
      @keyframes aksaraShimmer {
        0%, 100% { text-shadow: 0 0 20px rgba(212,175,55,0.3), 0 0 40px rgba(212,175,55,0.1); }
        50% { text-shadow: 0 0 30px rgba(212,175,55,0.5), 0 0 60px rgba(212,175,55,0.2); }
      }
      @keyframes kawungPulse {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.4; transform: scale(1.02); }
      }
    `}</style>
  );
}

/* ═══════════════════════════════════════════════════════════════
   WAYANG KULIT — ANIMATED like a real shadow puppet performance
   
   Each puppet:
   1. SWAYS on its tangkai (puppet rod) — slow, organic oscillation
   2. CASTS a flickering shadow — simulates oil lamp (blencong) light
   3. GOLDFIREFLY glow — filigree perforations glow & pulse
   4. TRANSFORM ORIGIN at top (puppet hung from above)
   ═══════════════════════════════════════════════════════════════ */

/* ─── Wayang Kulit: Kalpataru (Tree of Life / Gunungan) ───
    The most iconic wayang — opens and closes the performance.
    Sways gently like a dalang is holding it. */
export function WayangKalpataru({ className = '' }: { className?: string }) {
  return (
    <div className={`${className}`}>
      <OilLampFlickerCSS />
      <div className="relative" style={{ transformOrigin: 'top center' }}>
        {/* Shadow layer — flickers like oil lamp backlight */}
        <div
          className="absolute inset-0 z-0"
          style={{
            animation: 'wayangSway 6s ease-in-out infinite, shadowFlicker 3s ease-in-out infinite',
            filter: 'blur(8px)',
            opacity: 0.4,
          }}
        >
          <Image
            src="/wayang-kalpataru.png"
            alt=""
            width={300}
            height={400}
            className="w-full h-auto object-contain"
            aria-hidden="true"
          />
        </div>
        {/* Main puppet — sways + gold glow */}
        <div
          style={{
            animation: 'wayangSway 6s ease-in-out infinite, goldGlow 4s ease-in-out infinite',
            transformOrigin: 'top center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Image
            src="/wayang-kalpataru.png"
            alt="Wayang Kulit Kalpataru — Pohon Hayat"
            width={300}
            height={400}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Wayang Kulit: Arjuna (Refined Groom) ─── */
export function WayangArjuna({ className = '' }: { className?: string }) {
  return (
    <div className={`${className}`}>
      <div className="relative" style={{ transformOrigin: 'top center' }}>
        {/* Shadow layer */}
        <div
          className="absolute inset-0 z-0"
          style={{
            animation: 'wayangSway 7s ease-in-out infinite, shadowFlicker 2.8s ease-in-out infinite',
            filter: 'blur(6px)',
            opacity: 0.35,
          }}
        >
          <Image
            src="/wayang-arjuna.png"
            alt=""
            width={200}
            height={350}
            className="w-full h-auto object-contain"
            aria-hidden="true"
          />
        </div>
        {/* Main puppet */}
        <div
          style={{
            animation: 'wayangSway 7s ease-in-out infinite, goldGlow 5s ease-in-out infinite',
            transformOrigin: 'top center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Image
            src="/wayang-arjuna.png"
            alt="Wayang Kulit Arjuna"
            width={200}
            height={350}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Wayang Kulit: Srikandi (Warrior Bride) ─── */
export function WayangSrikandi({ className = '' }: { className?: string }) {
  return (
    <div className={`${className}`}>
      <div className="relative" style={{ transformOrigin: 'top center' }}>
        {/* Shadow layer */}
        <div
          className="absolute inset-0 z-0"
          style={{
            animation: 'wayangSwayReverse 7s ease-in-out infinite, shadowFlicker 3.2s ease-in-out infinite',
            filter: 'blur(6px)',
            opacity: 0.35,
          }}
        >
          <Image
            src="/wayang-srikandi.png"
            alt=""
            width={200}
            height={350}
            className="w-full h-auto object-contain"
            aria-hidden="true"
          />
        </div>
        {/* Main puppet */}
        <div
          style={{
            animation: 'wayangSwayReverse 7s ease-in-out infinite, goldGlow 4.5s ease-in-out infinite',
            transformOrigin: 'top center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Image
            src="/wayang-srikandi.png"
            alt="Wayang Kulit Srikandi"
            width={200}
            height={350}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MEGA MENDUNG — ANIMATED drifting clouds
   
   Clouds slowly drift like they're floating across the shadow screen.
   ═══════════════════════════════════════════════════════════════ */

export function MegamendungLeft({ className = '' }: { className?: string }) {
  return (
    <div className={`${className}`} style={{ animation: 'megaDrift 12s ease-in-out infinite' }}>
      <svg
        viewBox="0 0 100 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <path d="M5 130 Q0 100 15 85 Q5 65 25 50 Q20 30 40 20 Q45 5 60 10 Q75 0 80 15 Q95 10 95 30 Q100 45 90 55 Q95 70 85 80 Q90 95 80 105 Q85 120 70 130 Z" fill="#0D1B2A" />
        <path d="M12 125 Q8 100 22 88 Q14 70 32 58 Q28 40 44 30 Q50 18 62 22 Q74 14 78 28 Q90 24 90 42 Q94 54 86 62 Q90 74 82 84 Q86 98 76 108 Q80 120 66 125 Z" fill="#1B3A4B" />
        <path d="M20 120 Q16 100 28 90 Q22 74 38 64 Q34 48 48 40 Q52 28 64 32 Q74 26 76 38 Q86 34 86 50 Q90 60 82 68 Q86 78 78 88 Q82 100 72 110 Q76 118 62 122 Z" fill="#2E5A6E" />
        <path d="M28 115 Q24 98 34 90 Q28 76 44 68 Q40 54 52 46 Q56 36 66 40 Q74 34 76 48 Q82 44 82 58 Q86 66 78 72 Q82 82 74 90 Q78 100 68 108 Q72 114 58 118 Z" fill="#4682B4" />
        <path d="M36 110 Q32 96 40 88 Q36 76 48 70 Q44 58 56 50 Q58 42 68 46 Q74 42 74 54 Q78 60 72 66 Q76 74 68 82 Q72 92 64 100 Q68 108 54 112 Z" fill="#6BA3D6" />
        <path d="M44 105 Q40 94 48 88 Q44 78 54 72 Q50 62 60 56 Q62 48 70 52 Q74 48 74 60 Q76 64 70 68 Q74 74 66 82 Q70 90 62 98 Q64 104 52 108 Z" fill="#87CEEB" />
        <path d="M52 100 Q48 92 54 86 Q50 78 58 74 Q54 66 64 60 Q66 54 72 56 Q74 54 74 62 Q76 66 72 68 Q74 72 68 78 Q72 84 66 92 Q68 98 58 102 Z" fill="#B8E2F8" />
        <path d="M5 130 Q0 100 15 85 Q5 65 25 50 Q20 30 40 20 Q45 5 60 10 Q75 0 80 15 Q95 10 95 30" stroke="#D4AF37" strokeWidth="0.5" fill="none" opacity="0.3" />
      </svg>
    </div>
  );
}

/* ─── Mega Mendung Right (drifting opposite direction) ─── */
export function MegamendungRight({ className = '' }: { className?: string }) {
  return (
    <div className={`${className}`} style={{ animation: 'megaDriftReverse 12s ease-in-out infinite' }}>
      <svg
        viewBox="0 0 100 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <path d="M5 130 Q0 100 15 85 Q5 65 25 50 Q20 30 40 20 Q45 5 60 10 Q75 0 80 15 Q95 10 95 30 Q100 45 90 55 Q95 70 85 80 Q90 95 80 105 Q85 120 70 130 Z" fill="#0D1B2A" />
        <path d="M12 125 Q8 100 22 88 Q14 70 32 58 Q28 40 44 30 Q50 18 62 22 Q74 14 78 28 Q90 24 90 42 Q94 54 86 62 Q90 74 82 84 Q86 98 76 108 Q80 120 66 125 Z" fill="#1B3A4B" />
        <path d="M20 120 Q16 100 28 90 Q22 74 38 64 Q34 48 48 40 Q52 28 64 32 Q74 26 76 38 Q86 34 86 50 Q90 60 82 68 Q86 78 78 88 Q82 100 72 110 Q76 118 62 122 Z" fill="#2E5A6E" />
        <path d="M28 115 Q24 98 34 90 Q28 76 44 68 Q40 54 52 46 Q56 36 66 40 Q74 34 76 48 Q82 44 82 58 Q86 66 78 72 Q82 82 74 90 Q78 100 68 108 Q72 114 58 118 Z" fill="#4682B4" />
        <path d="M36 110 Q32 96 40 88 Q36 76 48 70 Q44 58 56 50 Q58 42 68 46 Q74 42 74 54 Q78 60 72 66 Q76 74 68 82 Q72 92 64 100 Q68 108 54 112 Z" fill="#6BA3D6" />
        <path d="M44 105 Q40 94 48 88 Q44 78 54 72 Q50 62 60 56 Q62 48 70 52 Q74 48 74 60 Q76 64 70 68 Q74 72 66 82 Q70 90 62 98 Q64 104 52 108 Z" fill="#87CEEB" />
        <path d="M52 100 Q48 92 54 86 Q50 78 58 74 Q54 66 64 60 Q66 54 72 56 Q74 54 74 62 Q76 66 72 68 Q74 72 68 78 Q72 84 66 92 Q68 98 58 102 Z" fill="#B8E2F8" />
        <path d="M5 130 Q0 100 15 85 Q5 65 25 50 Q20 30 40 20 Q45 5 60 10 Q75 0 80 15 Q95 10 95 30" stroke="#D4AF37" strokeWidth="0.5" fill="none" opacity="0.3" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BATIK PATTERNS — LIVING, breathing patterns
   
   Kawung petals pulse/breathe subtly
   Gold threads shimmer across the fabric
   Parang blades flow diagonally
   ═══════════════════════════════════════════════════════════════ */

function KawungUnit({ cx, cy, size = 8, opacity = 0.35 }: { cx: number; cy: number; size?: number; opacity?: number }) {
  const petalW = size * 0.55;
  const petalH = size;
  return (
    <g style={{ animation: 'kawungPulse 4s ease-in-out infinite', transformOrigin: `${cx}px ${cy}px` }}>
      <ellipse cx={cx} cy={cy - size * 0.6} rx={petalW} ry={petalH * 0.5} fill="#D4AF37" opacity={opacity} />
      <ellipse cx={cx} cy={cy + size * 0.6} rx={petalW} ry={petalH * 0.5} fill="#D4AF37" opacity={opacity} />
      <ellipse cx={cx - size * 0.6} cy={cy} rx={petalH * 0.5} ry={petalW} fill="#D4AF37" opacity={opacity} />
      <ellipse cx={cx + size * 0.6} cy={cy} rx={petalH * 0.5} ry={petalW} fill="#D4AF37" opacity={opacity} />
      <circle cx={cx} cy={cy} r={size * 0.2} fill="#D4AF37" opacity={opacity + 0.15} />
      <circle cx={cx} cy={cy} r={size * 0.35} fill="none" stroke="#D4AF37" strokeWidth="0.4" opacity={opacity * 0.5} />
    </g>
  );
}

function ParangUnit({ x, y, size = 14, opacity = 0.25 }: { x: number; y: number; size?: number; opacity?: number }) {
  return (
    <g>
      <path d={`M${x} ${y - size * 0.4} Q${x + size * 0.3} ${y - size * 0.1} ${x} ${y + size * 0.1} Q${x - size * 0.3} ${y + size * 0.3} ${x} ${y + size * 0.4}`}
        fill="none" stroke="#D4AF37" strokeWidth="1.2" opacity={opacity} strokeLinecap="round" />
      <circle cx={x} cy={y - size * 0.4} r={size * 0.08} fill="#D4AF37" opacity={opacity} />
      <path d={`M${x - size * 0.15} ${y - size * 0.2} Q${x - size * 0.35} ${y} ${x - size * 0.15} ${y + size * 0.2}`}
        fill="none" stroke="#D4AF37" strokeWidth="0.6" opacity={opacity * 0.6} />
      <path d={`M${x + size * 0.15} ${y - size * 0.2} Q${x + size * 0.35} ${y} ${x + size * 0.15} ${y + size * 0.2}`}
        fill="none" stroke="#D4AF37" strokeWidth="0.6" opacity={opacity * 0.6} />
    </g>
  );
}

/* ─── Batik Scalloped Border with SHIMMER effect ─── */
function BatikShimmerOverlay() {
  return (
    <rect
      x="0" y="0" width="600" height="55"
      fill="url(#shimmerGradient)"
      style={{ animation: 'batikShimmer 8s linear infinite' }}
    />
  );
}

/* ─── Scalloped Batik Top Border ─── */
export function BatikScallopTop({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 600 55"
        preserveAspectRatio="none"
        className="block w-full h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="shimmerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
            <stop offset="40%" stopColor="#D4AF37" stopOpacity="0" />
            <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.08" />
            <stop offset="60%" stopColor="#D4AF37" stopOpacity="0" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="600" height="55" fill="#2C1810" />
        {[0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550].map((x, i) => (
          <g key={i}>
            <path d={`M${x} 55 Q${x + 25} 5 ${x + 50} 55`} fill="#3D2215" />
          </g>
        ))}
        {[25, 75, 125, 175, 225, 275, 325, 375, 425, 475, 525, 575].map((x, i) => (
          <KawungUnit key={`k-${i}`} cx={x} cy={22} size={7} opacity={0.35} />
        ))}
        {[30, 70, 110, 150, 190, 230, 270, 310, 350, 390, 430, 470, 510, 550, 590].map((x, i) => (
          <ParangUnit key={`p-${i}`} x={x} y={8} size={5} opacity={0.15} />
        ))}
        <line x1="0" y1="0.5" x2="600" y2="0.5" stroke="#D4AF37" strokeWidth="1.5" opacity="0.6" />
        <line x1="0" y1="53" x2="600" y2="53" stroke="#D4AF37" strokeWidth="1" opacity="0.4" />
        {[0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550].map((x, i) => (
          <path key={`d-${i}`} d={`M${x + 25} 50 L${x + 27} 53 L${x + 25} 56 L${x + 23} 53 Z`} fill="#D4AF37" opacity="0.4" />
        ))}
        {/* Shimmer overlay */}
        <BatikShimmerOverlay />
      </svg>
    </div>
  );
}

/* ─── Scalloped Batik Bottom Border ─── */
export function BatikScallopBottom({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 600 55"
        preserveAspectRatio="none"
        className="block w-full h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="shimmerGradientB" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
            <stop offset="40%" stopColor="#D4AF37" stopOpacity="0" />
            <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.08" />
            <stop offset="60%" stopColor="#D4AF37" stopOpacity="0" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="600" height="55" fill="#2C1810" />
        {[0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550].map((x, i) => (
          <g key={i}>
            <path d={`M${x} 0 Q${x + 25} 50 ${x + 50} 0`} fill="#3D2215" />
          </g>
        ))}
        {[25, 75, 125, 175, 225, 275, 325, 375, 425, 475, 525, 575].map((x, i) => (
          <KawungUnit key={`k-${i}`} cx={x} cy={33} size={7} opacity={0.35} />
        ))}
        {[30, 70, 110, 150, 190, 230, 270, 310, 350, 390, 430, 470, 510, 550, 590].map((x, i) => (
          <ParangUnit key={`p-${i}`} x={x} y={47} size={5} opacity={0.15} />
        ))}
        <line x1="0" y1="1" x2="600" y2="1" stroke="#D4AF37" strokeWidth="1" opacity="0.4" />
        <line x1="0" y1="54.5" x2="600" y2="54.5" stroke="#D4AF37" strokeWidth="1.5" opacity="0.6" />
        {[0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550].map((x, i) => (
          <path key={`d-${i}`} d={`M${x + 25} -1 L${x + 27} 2 L${x + 25} 5 L${x + 23} 2 Z`} fill="#D4AF37" opacity="0.4" />
        ))}
        <rect x="0" y="0" width="600" height="55" fill="url(#shimmerGradientB)"
          style={{ animation: 'batikShimmer 8s linear infinite' }} />
      </svg>
    </div>
  );
}

/* ─── Batik Strip Border with Kawung + Truntum ─── */
export function BatikStripBorder({ className = '', showHorse = false }: { className?: string; showHorse?: boolean }) {
  return (
    <div className={`relative w-full ${className}`}>
      <svg
        viewBox="0 0 600 44"
        preserveAspectRatio="none"
        className="block w-full h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="shimmerGradientS" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
            <stop offset="40%" stopColor="#D4AF37" stopOpacity="0" />
            <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.06" />
            <stop offset="60%" stopColor="#D4AF37" stopOpacity="0" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="600" height="44" fill="#2C1810" />
        {[20, 65, 110, 155, 200, 245, 290, 335, 380, 425, 470, 515, 560].map((x, i) => (
          <KawungUnit key={`k1-${i}`} cx={x} cy={14} size={6} opacity={0.3} />
        ))}
        {[42, 87, 132, 177, 222, 267, 312, 357, 402, 447, 492, 537, 582].map((x, i) => (
          <g key={`t-${i}`}>
            {[0, 60, 120, 180, 240, 300].map((angle, j) => {
              const rad = (angle * Math.PI) / 180;
              const px = x + Math.cos(rad) * 4;
              const py = 30 + Math.sin(rad) * 4;
              return <circle key={j} cx={px} cy={py} r="1.2" fill="#D4AF37" opacity={0.25} />;
            })}
            <circle cx={x} cy={30} r="1.5" fill="#D4AF37" opacity={0.4} />
          </g>
        ))}
        {[40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440, 480, 520, 560].map((x, i) => (
          <line key={`pl-${i}`} x1={x} y1="20" x2={x + 10} y2="24" stroke="#D4AF37" strokeWidth="0.5" opacity="0.15" />
        ))}
        <line x1="0" y1="1" x2="600" y2="1" stroke="#D4AF37" strokeWidth="1.5" opacity="0.5" />
        <line x1="0" y1="43" x2="600" y2="43" stroke="#D4AF37" strokeWidth="1.5" opacity="0.5" />
        <line x1="0" y1="22" x2="600" y2="22" stroke="#D4AF37" strokeWidth="0.5" opacity="0.2" />
        <rect x="0" y="0" width="600" height="44" fill="url(#shimmerGradientS)"
          style={{ animation: 'batikShimmer 6s linear infinite' }} />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CANDI BENTAR — Split Gate with shadow screen glow
   ═══════════════════════════════════════════════════════════════ */
export function CandiBentar({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`relative mx-auto ${className}`}
      style={{ maxWidth: 200 }}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <svg
        viewBox="0 0 160 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <path d="M10 95 L10 70 L14 65 L14 55 L18 50 L18 42 L22 38 L22 30 L28 25 L32 18 L38 14 L42 10 L48 8 L50 8"
          fill="#2C1810" stroke="#D4AF37" strokeWidth="0.8" />
        <rect x="10" y="65" width="6" height="5" fill="#D4AF37" opacity="0.3" />
        <rect x="14" y="50" width="5" height="5" fill="#D4AF37" opacity="0.3" />
        <rect x="18" y="38" width="5" height="4" fill="#D4AF37" opacity="0.3" />
        <circle cx="18" cy="58" r="3" fill="#D4AF37" opacity="0.4" />
        <path d="M15 56 L18 54 L21 56" stroke="#D4AF37" strokeWidth="0.5" opacity="0.5" />
        <path d="M150 95 L150 70 L146 65 L146 55 L142 50 L142 42 L138 38 L138 30 L132 25 L128 18 L122 14 L118 10 L112 8 L110 8"
          fill="#2C1810" stroke="#D4AF37" strokeWidth="0.8" />
        <rect x="144" y="65" width="6" height="5" fill="#D4AF37" opacity="0.3" />
        <rect x="141" y="50" width="5" height="5" fill="#D4AF37" opacity="0.3" />
        <rect x="137" y="38" width="5" height="4" fill="#D4AF37" opacity="0.3" />
        <circle cx="142" cy="58" r="3" fill="#D4AF37" opacity="0.4" />
        <path d="M139 56 L142 54 L145 56" stroke="#D4AF37" strokeWidth="0.5" opacity="0.5" />
        <path d="M60 12 Q70 4 80 8 Q90 4 100 12" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.5" />
        <circle cx="70" cy="6" r="2" fill="#D4AF37" opacity="0.4" />
        <circle cx="90" cy="6" r="2" fill="#D4AF37" opacity="0.4" />
        <circle cx="80" cy="8" r="1.5" fill="#D4AF37" opacity="0.5" />
      </svg>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SULUR-SULURAN — Javanese Floral Vine (with gentle sway)
   ═══════════════════════════════════════════════════════════════ */
export function SulurSuluran({ className = '', direction = 'horizontal' }: { className?: string; direction?: 'horizontal' | 'vertical-left' | 'vertical-right' }) {
  const isVertical = direction !== 'horizontal';
  const flipX = direction === 'vertical-right' ? -1 : 1;

  return (
    <motion.div
      className={`${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      <svg
        viewBox="0 0 200 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        style={isVertical ? { transform: `rotate(90deg) scaleX(${flipX})` } : undefined}
      >
        <path d="M0 30 Q25 20 50 30 Q75 40 100 30 Q125 20 150 30 Q175 40 200 30"
          stroke="#5C3317" strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M30 24 Q35 16 40 22 Q35 20 30 24Z" fill="#5C3317" opacity="0.3" />
        <path d="M70 36 Q75 44 80 38 Q75 40 70 36Z" fill="#5C3317" opacity="0.3" />
        <path d="M120 24 Q125 16 130 22 Q125 20 120 24Z" fill="#5C3317" opacity="0.3" />
        <path d="M160 36 Q165 44 170 38 Q165 40 160 36Z" fill="#5C3317" opacity="0.3" />
        <g transform="translate(50, 30)">
          <ellipse cx="0" cy="-5" rx="2" ry="4" fill="#D4AF37" opacity="0.4" />
          <ellipse cx="0" cy="5" rx="2" ry="4" fill="#D4AF37" opacity="0.4" />
          <ellipse cx="-5" cy="0" rx="4" ry="2" fill="#D4AF37" opacity="0.4" />
          <ellipse cx="5" cy="0" rx="4" ry="2" fill="#D4AF37" opacity="0.4" />
          <circle cx="0" cy="0" r="2" fill="#D4AF37" opacity="0.5" />
        </g>
        <g transform="translate(150, 30)">
          <ellipse cx="0" cy="-5" rx="2" ry="4" fill="#D4AF37" opacity="0.4" />
          <ellipse cx="0" cy="5" rx="2" ry="4" fill="#D4AF37" opacity="0.4" />
          <ellipse cx="-5" cy="0" rx="4" ry="2" fill="#D4AF37" opacity="0.4" />
          <ellipse cx="5" cy="0" rx="4" ry="2" fill="#D4AF37" opacity="0.4" />
          <circle cx="0" cy="0" r="2" fill="#D4AF37" opacity="0.5" />
        </g>
        <path d="M25 28 Q20 22 22 16" stroke="#5C3317" strokeWidth="0.8" fill="none" opacity="0.4" />
        <path d="M75 32 Q80 38 78 44" stroke="#5C3317" strokeWidth="0.8" fill="none" opacity="0.4" />
        <path d="M125 28 Q120 22 122 16" stroke="#5C3317" strokeWidth="0.8" fill="none" opacity="0.4" />
        <path d="M175 32 Q180 38 178 44" stroke="#5C3317" strokeWidth="0.8" fill="none" opacity="0.4" />
      </svg>
    </motion.div>
  );
}

/* ─── Aksara Jawa — Shimmer reveal animation ─── */
export function AksaraJawaOrnament({ text = 'ꦱꦶꦤꦺꦴꦩ꧀', className = '' }: { text?: string; className?: string }) {
  return (
    <motion.div
      className={`text-center ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <span
        className="text-4xl md:text-5xl tracking-[0.2em] inline-block"
        style={{
          color: '#D4AF37',
          animation: 'aksaraShimmer 3s ease-in-out infinite',
        }}
      >
        {text}
      </span>
    </motion.div>
  );
}

/* ─── Arched Photo Frame ─── */
export function ArchedPhotoFrame({
  src,
  alt,
  className = '',
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`relative mx-auto ${className}`} style={{ width: 160, height: 200 }}>
      <svg
        className="absolute inset-0 w-full h-full z-10 pointer-events-none"
        viewBox="0 0 160 200"
        fill="none"
      >
        <path d="M10 200 L10 80 Q10 10 80 10 Q150 10 150 80 L150 200"
          stroke="#2C1810" strokeWidth="3" fill="none" />
        <rect x="8" y="80" width="6" height="4" fill="#D4AF37" opacity="0.5" />
        <rect x="146" y="80" width="6" height="4" fill="#D4AF37" opacity="0.5" />
        <rect x="10" y="50" width="5" height="3" fill="#D4AF37" opacity="0.4" />
        <rect x="145" y="50" width="5" height="3" fill="#D4AF37" opacity="0.4" />
        <path d="M15 200 L15 82 Q15 16 80 16 Q145 16 145 82 L145 200"
          stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.6" />
        <circle cx="80" cy="14" r="4" fill="#D4AF37" opacity="0.4" />
        <path d="M76 12 L80 10 L84 12" stroke="#2C1810" strokeWidth="0.8" fill="none" opacity="0.5" />
      </svg>
      <div
        className="absolute overflow-hidden"
        style={{ top: 4, left: 4, right: 4, bottom: 4, borderRadius: '80px 80px 0 0' }}
      >
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
    </div>
  );
}

/* ─── Gold Ornamental Divider with Kawung + gentle glow ─── */
export function JavaneseGoldDivider({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`flex items-center justify-center gap-3 ${className}`}
      initial={{ opacity: 0, scaleX: 0.5 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="h-px flex-1 max-w-20" style={{ background: 'linear-gradient(to right, transparent, #D4AF37)' }} />
      <motion.svg
        width="32" height="32" viewBox="0 0 32 32" fill="none"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ellipse cx="16" cy="8" rx="3.5" ry="5.5" fill="#D4AF37" opacity="0.5" />
        <ellipse cx="16" cy="24" rx="3.5" ry="5.5" fill="#D4AF37" opacity="0.5" />
        <ellipse cx="8" cy="16" rx="5.5" ry="3.5" fill="#D4AF37" opacity="0.5" />
        <ellipse cx="24" cy="16" rx="5.5" ry="3.5" fill="#D4AF37" opacity="0.5" />
        <circle cx="16" cy="16" r="3.5" fill="#D4AF37" opacity="0.7" />
        <circle cx="16" cy="16" r="6" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.3" />
      </motion.svg>
      <div className="h-px flex-1 max-w-20" style={{ background: 'linear-gradient(to left, transparent, #D4AF37)' }} />
    </motion.div>
  );
}

/* ─── Shadow Screen Atmosphere — wraps sections in wayang performance feel ─── */
export function ShadowScreenAtmosphere({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={`relative ${className}`}
      style={{ animation: 'shadowScreenGlow 5s ease-in-out infinite' }}
    >
      {children}
    </div>
  );
}

/* ─── Wayang Scene: Arjuna & Srikandi flanking Kalpataru — ALL ANIMATED ─── */
export function WayangBottomScene({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full flex items-end justify-center gap-1 md:gap-3 ${className}`}>
      {/* Arjuna — sways left, enters from left */}
      <motion.div
        className="w-16 md:w-24 flex-shrink-0"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <WayangArjuna />
      </motion.div>
      
      {/* Kalpataru — rises from below */}
      <motion.div
        className="w-20 md:w-32 flex-shrink-0 -mb-2"
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
      >
        <WayangKalpataru />
      </motion.div>
      
      {/* Srikandi — sways right, enters from right */}
      <motion.div
        className="w-16 md:w-24 flex-shrink-0"
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <WayangSrikandi />
      </motion.div>
    </div>
  );
}

/* ─── Wayang Hero Scene — Grand entrance with shadow screen feel ─── */
export function WayangHeroScene({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Shadow screen glow behind */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{ animation: 'shadowScreenGlow 5s ease-in-out infinite' }}
      />
      
      <motion.div
        className="relative w-full flex items-center justify-center"
        initial={{ opacity: 0, y: 40, scale: 0.85 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="w-32 md:w-48">
          <WayangKalpataru />
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Legacy aliases ─── */
export const WayangLeft = WayangArjuna;
export const WayangRight = WayangSrikandi;
export const WayangHorse = CandiBentar;

/* ─── Double Gold Border Frame with corner animation ─── */
export function JavaneseDoubleBorder({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="absolute inset-0 border-2 rounded-sm"
        style={{ borderColor: '#D4AF37', opacity: 0.4 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.4 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      />
      <motion.div
        className="absolute inset-2 border rounded-sm"
        style={{ borderColor: '#2C1810', opacity: 0.15 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.15 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      {/* Corner Kawung ornaments — animate in */}
      {[
        { pos: 'top-0 left-0', delay: 0 },
        { pos: 'top-0 right-0', delay: 0.1 },
        { pos: 'bottom-0 left-0', delay: 0.2 },
        { pos: 'bottom-0 right-0', delay: 0.3 },
      ].map((corner, i) => (
        <motion.div
          key={i}
          className={`absolute ${corner.pos} w-5 h-5`}
          style={{ color: '#D4AF37', opacity: 0.5 }}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.5 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 + corner.delay, type: 'spring' }}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" width="100%" height="100%">
            <ellipse cx="10" cy="5" rx="3" ry="4" />
            <ellipse cx="10" cy="15" rx="3" ry="4" />
            <ellipse cx="5" cy="10" rx="4" ry="3" />
            <ellipse cx="15" cy="10" rx="4" ry="3" />
            <circle cx="10" cy="10" r="2.5" />
          </svg>
        </motion.div>
      ))}
      <div className="relative p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
