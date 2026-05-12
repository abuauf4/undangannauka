/* ═══════════════════════════════════════════════════════════════
   Template Builder Helpers
   
   - Section Presets (1-click add preset combos)
   - Theme Gradients (real theme preview)
   - Undo/Redo history stack
   - Auto-Save draft
   ═══════════════════════════════════════════════════════════════ */

import {
  TemplateConfig,
  TemplateSection,
  TemplateElement,
  SectionKey,
  ComponentType,
  PositionType,
  AnimationType,
  SizeType,
  DEFAULT_SECTION_ORDER,
  SECTION_LABELS,
  DESIGN_VARIANTS,
  JAVANESE_COLOR_PALETTES,
  DesignVariant,
  generateElementId,
} from './template-builder-types';

/* ─── Theme Gradients ─── */
export interface ThemeGradient {
  bg: string;         // Main background
  text: string;       // Primary text
  textSub: string;    // Secondary text
  accent: string;     // Gold/accent
  sectionBg: string;  // Section background
  border: string;     // Border color
  gradient: string;   // CSS gradient string
}

export function getThemeGradient(nuansa: string, adat: string): ThemeGradient {
  const themes: Record<string, ThemeGradient> = {
    'islam-jawa': {
      bg: 'linear-gradient(180deg, #1a0a0a 0%, #2C1810 30%, #3D2215 60%, #1a0a0a 100%)',
      text: '#F5F0E6',
      textSub: '#C9B896',
      accent: '#D4AF37',
      sectionBg: 'rgba(44, 24, 16, 0.6)',
      border: 'rgba(212, 175, 55, 0.3)',
      gradient: 'from-[#800020] via-[#5C0015] to-[#C9A84C]',
    },
    'islam-sunda': {
      bg: 'linear-gradient(180deg, #0a1a12 0%, #1a3324 30%, #2d5a3f 60%, #0a1a12 100%)',
      text: '#E8F0E8',
      textSub: '#A8C8A8',
      accent: '#D4AF37',
      sectionBg: 'rgba(26, 51, 36, 0.6)',
      border: 'rgba(212, 175, 55, 0.3)',
      gradient: 'from-[#1a472a] via-[#2d6a4f] to-[#C9A84C]',
    },
    'islam-batak': {
      bg: 'linear-gradient(180deg, #1a0505 0%, #3D0A0A 30%, #5C1515 60%, #1a0505 100%)',
      text: '#F5E6E6',
      textSub: '#C89696',
      accent: '#D4AF37',
      sectionBg: 'rgba(61, 10, 10, 0.6)',
      border: 'rgba(212, 175, 55, 0.3)',
      gradient: 'from-[#5C0015] via-[#8B0000] to-[#C9A84C]',
    },
    'islam-bali': {
      bg: 'linear-gradient(180deg, #1a0f1a 0%, #3D1a3D 30%, #5C2D5C 60%, #1a0f1a 100%)',
      text: '#F0E6F0',
      textSub: '#B896B8',
      accent: '#D4AF37',
      sectionBg: 'rgba(61, 26, 61, 0.6)',
      border: 'rgba(212, 175, 55, 0.3)',
      gradient: 'from-[#4a1942] via-[#800020] to-[#C9A84C]',
    },
    'islam-arab': {
      bg: 'linear-gradient(180deg, #0a1a15 0%, #1a332a 30%, #2d5a4e 60%, #0a1a15 100%)',
      text: '#E6F0EB',
      textSub: '#96C8A8',
      accent: '#D4AF37',
      sectionBg: 'rgba(26, 51, 42, 0.6)',
      border: 'rgba(212, 175, 55, 0.3)',
      gradient: 'from-[#1a3c34] via-[#2d5a4e] to-[#C9A84C]',
    },
    'umum-jawa': {
      bg: 'linear-gradient(180deg, #2C1810 0%, #4A2C1A 30%, #5C3317 60%, #2C1810 100%)',
      text: '#F5F0E6',
      textSub: '#C9B896',
      accent: '#D4AF37',
      sectionBg: 'rgba(74, 44, 26, 0.6)',
      border: 'rgba(212, 175, 55, 0.3)',
      gradient: 'from-[#800020] via-[#5C0015] to-[#D4AF37]',
    },
    'umum-sunda': {
      bg: 'linear-gradient(180deg, #0f1a15 0%, #1a3324 30%, #2d6a4f 60%, #0f1a15 100%)',
      text: '#E8F0E8',
      textSub: '#A8C8A8',
      accent: '#D4AF37',
      sectionBg: 'rgba(26, 51, 36, 0.6)',
      border: 'rgba(212, 175, 55, 0.3)',
      gradient: 'from-[#2d6a4f] via-[#1a472a] to-[#D4AF37]',
    },
    'umum-batak': {
      bg: 'linear-gradient(180deg, #2C0A0A 0%, #5C1515 30%, #8B2020 60%, #2C0A0A 100%)',
      text: '#F5E6E6',
      textSub: '#C89696',
      accent: '#D4AF37',
      sectionBg: 'rgba(92, 21, 21, 0.6)',
      border: 'rgba(212, 175, 55, 0.3)',
      gradient: 'from-[#8B0000] via-[#5C0015] to-[#D4AF37]',
    },
  };

  const key = `${nuansa}-${adat}`;
  return themes[key] || themes['islam-jawa'];
}

/* ─── Palette-Aware Theme ─── */
export function getThemeWithPalette(
  nuansa: string,
  adat: string,
  paletteId?: string,
  designVariant?: DesignVariant
): ThemeGradient {
  const base = getThemeGradient(nuansa, adat);

  // If a color palette is selected, override the base theme colors
  if (paletteId) {
    const palette = JAVANESE_COLOR_PALETTES.find(p => p.id === paletteId);
    if (palette) {
      return {
        ...base,
        bg: palette.bg.startsWith('#') || palette.bg.startsWith('rgb')
          ? `linear-gradient(180deg, ${palette.bg} 0%, ${palette.sectionBg} 50%, ${palette.bg} 100%)`
          : palette.bg,
        text: palette.text,
        textSub: palette.textSub,
        accent: palette.accent,
        sectionBg: palette.sectionBg,
        border: palette.border,
        gradient: `from-[${palette.primary}] via-[${palette.secondary}] to-[${palette.accent}]`,
      };
    }
  }

  // If a design variant overrides some visuals (e.g. "simple" = lighter)
  if (designVariant) {
    const dv = DESIGN_VARIANTS[designVariant];
    if (dv) {
      const isLight = ['ivory-brown', 'sage-copper'].includes(paletteId || '');
      // Simple/modern variants get lighter, more spacious treatment
      if (dv.animationLevel === 'minimal' || dv.animationLevel === 'contemporary') {
        return {
          ...base,
          sectionBg: isLight ? base.sectionBg : `rgba(30, 30, 30, 0.4)`,
          border: `rgba(${base.accent === '#C0C0C0' ? '192,192,192' : '212,175,55'}, 0.15)`,
        };
      }
    }
  }

  return base;
}

/* ─── Get CSS variables string for a palette ─── */
export function getPaletteCSSVars(paletteId?: string): Record<string, string> {
  if (!paletteId) return {};
  const palette = JAVANESE_COLOR_PALETTES.find(p => p.id === paletteId);
  if (!palette) return {};
  return {
    '--inv-bg': palette.bg,
    '--inv-primary': palette.primary,
    '--inv-secondary': palette.secondary,
    '--inv-accent': palette.accent,
    '--inv-text': palette.text,
    '--inv-text-muted': palette.textSub,
    '--inv-section-bg': palette.sectionBg,
    '--inv-border': palette.border,
  };
}

/* ─── Get design variant CSS classes ─── */
export function getDesignVariantClasses(variant?: DesignVariant): {
  sectionPadding: string;
  elementGap: string;
  borderClass: string;
  fontHeading: string;
  fontBody: string;
} {
  const dv = variant ? DESIGN_VARIANTS[variant] : null;
  if (!dv) {
    return {
      sectionPadding: 'py-4',
      elementGap: 'gap-2',
      borderClass: '',
      fontHeading: 'font-serif',
      fontBody: '',
    };
  }
  const paddingMap: Record<string, string> = {
    compact: 'py-2',
    normal: 'py-4',
    spacious: 'py-6',
  };
  const gapMap: Record<string, string> = {
    compact: 'gap-1',
    normal: 'gap-2',
    spacious: 'gap-3',
  };
  const borderMap: Record<string, string> = {
    ornate: 'border-2 border-[var(--inv-accent)]/40',
    thin: 'border border-[var(--inv-accent)]/20',
    double: 'border-2 border-[var(--inv-accent)]/30 ring-1 ring-[var(--inv-accent)]/10',
    classic: 'border border-[var(--inv-accent)]/30',
    geometric: 'border border-[var(--inv-accent)]/20 rounded-lg',
    rough: 'border-2 border-dashed border-[var(--inv-accent)]/25',
    watercolor: 'border border-[var(--inv-accent)]/15 rounded-2xl',
  };
  return {
    sectionPadding: paddingMap[dv.elementSpacing] || 'py-4',
    elementGap: gapMap[dv.elementSpacing] || 'gap-2',
    borderClass: borderMap[dv.borderStyle] || '',
    fontHeading: dv.fontHeading.includes('playfair') ? 'font-serif' : 'font-sans',
    fontBody: dv.fontBody.includes('inter') ? 'font-sans' : 'font-serif',
  };
}

/* ─── Section Presets ─── */
export interface SectionPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  targetSection: SectionKey;
  elements: Omit<TemplateElement, 'id'>[];
}

function presetElement(
  component: ComponentType,
  position: PositionType,
  animation: AnimationType,
  duration: number,
  size: SizeType,
  opacity: number,
  props?: Record<string, any>
): Omit<TemplateElement, 'id'> {
  return { component, position, animation, duration, delay: 0, size, opacity, ...(props ? { props } : {}) };
}

export const SECTION_PRESETS: SectionPreset[] = [
  // ─── Hero Presets ───
  {
    id: 'hero-grand-javanese',
    name: 'Grand Javanese Hero',
    description: 'Kalpataru center + Batik borders + Mega Mendung clouds',
    icon: '🎭',
    targetSection: 'hero',
    elements: [
      presetElement('ShadowScreenAtmosphere', 'background', 'glow', 5, 'full', 1),
      presetElement('BatikScallopTop', 'above', 'shimmer', 8, 'full', 1),
      presetElement('WayangKalpataru', 'center', 'sway', 6, 'large', 1),
      presetElement('MegamendungLeft', 'flank-left', 'drift', 12, 'small', 0.3),
      presetElement('MegamendungRight', 'flank-right', 'driftReverse', 12, 'small', 0.3),
      presetElement('BatikScallopBottom', 'below', 'shimmer', 8, 'full', 1),
    ],
  },
  {
    id: 'hero-minimal-gold',
    name: 'Minimal Gold Hero',
    description: 'Simple batik strip + gold divider',
    icon: '✨',
    targetSection: 'hero',
    elements: [
      presetElement('BatikStripBorder', 'above', 'shimmer', 6, 'full', 1),
      presetElement('JavaneseGoldDivider', 'center', 'pulse', 3, 'full', 1),
      presetElement('BatikStripBorder', 'below', 'shimmer', 6, 'full', 1),
    ],
  },
  {
    id: 'hero-candi-gate',
    name: 'Candi Gate Hero',
    description: 'Candi Bentar entrance + Sulur-suluran + Aksara Jawa',
    icon: '🏯',
    targetSection: 'hero',
    elements: [
      presetElement('SulurSuluran', 'above', 'fadeIn', 1, 'full', 1),
      presetElement('CandiBentar', 'center', 'fadeInUp', 0.8, 'medium', 1),
      presetElement('AksaraJawaOrnament', 'center', 'shimmer', 3, 'medium', 1, { text: 'ꦧꦶꦱ꧀ꦩꦶꦭ꧍' }),
      presetElement('SulurSuluran', 'below', 'fadeIn', 1, 'full', 1),
    ],
  },

  // ─── Mempelai Presets ───
  {
    id: 'mempelai-wayang-pair',
    name: 'Wayang Mempelai',
    description: 'Arjuna (pria) & Srikandi (wanita) flanking with double border',
    icon: '💑',
    targetSection: 'mempelai',
    elements: [
      presetElement('JavaneseDoubleBorder', 'background', 'fadeIn', 0.8, 'full', 1),
      presetElement('WayangArjuna', 'flank-left', 'sway', 7, 'medium', 0.8),
      presetElement('WayangSrikandi', 'flank-right', 'swayReverse', 7, 'medium', 0.8),
      presetElement('BatikStripBorder', 'above', 'shimmer', 6, 'full', 1),
      presetElement('JavaneseGoldDivider', 'center', 'pulse', 3, 'full', 1),
      presetElement('BatikStripBorder', 'below', 'shimmer', 6, 'full', 1),
    ],
  },
  {
    id: 'mempelai-elegant-frame',
    name: 'Elegant Frame',
    description: 'Double border frame with gold dividers',
    icon: '🖼️',
    targetSection: 'mempelai',
    elements: [
      presetElement('JavaneseDoubleBorder', 'background', 'fadeIn', 0.8, 'full', 1),
      presetElement('JavaneseGoldDivider', 'above', 'pulse', 3, 'full', 1),
      presetElement('JavaneseGoldDivider', 'below', 'pulse', 3, 'full', 1),
    ],
  },

  // ─── Quran Verse Preset ───
  {
    id: 'quran-reverence',
    name: 'Reverence Frame',
    description: 'Batik borders + Candi gate + Aksara for Quran section',
    icon: '🕌',
    targetSection: 'quran-verse',
    elements: [
      presetElement('BatikScallopTop', 'above', 'shimmer', 8, 'full', 1),
      presetElement('ShadowScreenAtmosphere', 'background', 'glow', 5, 'full', 1),
      presetElement('CandiBentar', 'center', 'fadeInUp', 0.8, 'medium', 1),
      presetElement('JavaneseGoldDivider', 'below', 'pulse', 3, 'full', 1),
      presetElement('BatikScallopBottom', 'below', 'shimmer', 8, 'full', 1),
    ],
  },

  // ─── Event Details Preset ───
  {
    id: 'event-formal',
    name: 'Formal Event',
    description: 'Double border + gold dividers for event info',
    icon: '📅',
    targetSection: 'event-details',
    elements: [
      presetElement('JavaneseDoubleBorder', 'background', 'fadeIn', 0.8, 'full', 1),
      presetElement('SulurSuluran', 'above', 'fadeIn', 1, 'full', 1),
      presetElement('JavaneseGoldDivider', 'above', 'pulse', 3, 'full', 1),
      presetElement('JavaneseGoldDivider', 'below', 'pulse', 3, 'full', 1),
    ],
  },

  // ─── Photo Gallery Preset ───
  {
    id: 'gallery-arched',
    name: 'Arched Gallery',
    description: 'Arched frames + batik borders for gallery',
    icon: '📸',
    targetSection: 'photo-gallery',
    elements: [
      presetElement('BatikScallopTop', 'above', 'shimmer', 8, 'full', 1),
      presetElement('MegamendungLeft', 'flank-left', 'drift', 12, 'small', 0.2),
      presetElement('MegamendungRight', 'flank-right', 'driftReverse', 12, 'small', 0.2),
      presetElement('BatikScallopBottom', 'below', 'shimmer', 8, 'full', 1),
    ],
  },

  // ─── RSVP Preset ───
  {
    id: 'rsvp-gateway',
    name: 'Candi Gateway RSVP',
    description: 'Candi gate entrance for RSVP section',
    icon: '✉️',
    targetSection: 'rsvp',
    elements: [
      presetElement('CandiBentar', 'above', 'fadeInUp', 0.8, 'medium', 1),
      presetElement('JavaneseDoubleBorder', 'background', 'fadeIn', 0.8, 'full', 1),
      presetElement('JavaneseGoldDivider', 'below', 'pulse', 3, 'full', 1),
    ],
  },

  // ─── Closing Preset ───
  {
    id: 'closing-grand',
    name: 'Grand Closing',
    description: 'Wayang scene + batik borders for closing',
    icon: '🙏',
    targetSection: 'closing',
    elements: [
      presetElement('BatikScallopTop', 'above', 'shimmer', 8, 'full', 1),
      presetElement('WayangArjuna', 'flank-left', 'sway', 7, 'medium', 0.6),
      presetElement('WayangKalpataru', 'center', 'sway', 6, 'large', 0.8),
      presetElement('WayangSrikandi', 'flank-right', 'swayReverse', 7, 'medium', 0.6),
      presetElement('AksaraJawaOrnament', 'center', 'shimmer', 3, 'medium', 1, { text: 'ꦩꦠꦸꦂꦤꦸꦮꦸꦤ꧀' }),
      presetElement('BatikScallopBottom', 'below', 'shimmer', 8, 'full', 1),
    ],
  },

  // ─── Guest Welcome Preset ───
  {
    id: 'welcome-candi',
    name: 'Candi Welcome',
    description: 'Candi gate + aksara for guest welcome',
    icon: '🙏',
    targetSection: 'guest-welcome',
    elements: [
      presetElement('CandiBentar', 'above', 'fadeInUp', 0.8, 'medium', 1),
      presetElement('AksaraJawaOrnament', 'center', 'shimmer', 3, 'medium', 1, { text: 'ꦱꦸꦒꦼꦁꦫꦮꦸꦃ' }),
      presetElement('SulurSuluran', 'below', 'fadeIn', 1, 'full', 1),
    ],
  },

  // ─── Love Quotes Preset ───
  {
    id: 'love-ornamental',
    name: 'Ornamental Love',
    description: 'Sulur-suluran + gold divider for love quotes',
    icon: '💕',
    targetSection: 'love-quotes',
    elements: [
      presetElement('SulurSuluran', 'above', 'fadeIn', 1, 'full', 1),
      presetElement('JavaneseGoldDivider', 'above', 'pulse', 3, 'full', 1),
      presetElement('ShadowScreenAtmosphere', 'background', 'glow', 5, 'full', 1),
      presetElement('JavaneseGoldDivider', 'below', 'pulse', 3, 'full', 1),
    ],
  },

  // ─── Adat & Pepatah Preset ───
  {
    id: 'adat-traditional',
    name: 'Traditional Adat',
    description: 'Full Javanese traditional frame with batik and wayang',
    icon: '📜',
    targetSection: 'adat-pepatah',
    elements: [
      presetElement('BatikScallopTop', 'above', 'shimmer', 8, 'full', 1),
      presetElement('JavaneseDoubleBorder', 'background', 'fadeIn', 0.8, 'full', 1),
      presetElement('WayangArjuna', 'flank-left', 'sway', 7, 'small', 0.5),
      presetElement('WayangSrikandi', 'flank-right', 'swayReverse', 7, 'small', 0.5),
      presetElement('AksaraJawaOrnament', 'above', 'shimmer', 3, 'medium', 1, { text: 'ꦲꦝꦠ꧀' }),
      presetElement('BatikScallopBottom', 'below', 'shimmer', 8, 'full', 1),
    ],
  },
];

/* ─── Undo/Redo History ─── */
const MAX_HISTORY = 50;

export interface HistoryState {
  config: TemplateConfig;
  selectedElementId: string | null;
  selectedSectionKey: SectionKey | null;
}

export class HistoryManager {
  private past: HistoryState[] = [];
  private present: HistoryState;
  private future: HistoryState[] = [];

  constructor(initial: HistoryState) {
    this.present = { ...initial, config: JSON.parse(JSON.stringify(initial.config)) };
  }

  push(state: HistoryState) {
    this.past.push(this.present);
    if (this.past.length > MAX_HISTORY) this.past.shift();
    this.present = { ...state, config: JSON.parse(JSON.stringify(state.config)) };
    this.future = [];
  }

  undo(): HistoryState | null {
    if (this.past.length === 0) return null;
    this.future.push(this.present);
    this.present = this.past.pop()!;
    return { ...this.present, config: JSON.parse(JSON.stringify(this.present.config)) };
  }

  redo(): HistoryState | null {
    if (this.future.length === 0) return null;
    this.past.push(this.present);
    this.present = this.future.pop()!;
    return { ...this.present, config: JSON.parse(JSON.stringify(this.present.config)) };
  }

  get canUndo() { return this.past.length > 0; }
  get canRedo() { return this.future.length > 0; }
}

/* ─── Auto-Save Draft ─── */
const DRAFT_KEY = 'undangannauka_builder_draft';
const DRAFT_META_KEY = 'undangannauka_builder_draft_meta';

export interface DraftData {
  templateName: string;
  templateDescription: string;
  templateAdat: string;
  templateNuansa: string;
  templateDesign: string;
  config: TemplateConfig;
}

export interface DraftMeta {
  savedAt: string;
  elementCount: number;
  sectionCount: number;
}

export function saveDraft(data: DraftData): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    localStorage.setItem(DRAFT_META_KEY, JSON.stringify({
      savedAt: new Date().toISOString(),
      elementCount: data.config.sections.reduce((s, sec) => s + sec.elements.length, 0),
      sectionCount: data.config.sections.filter((s) => s.enabled).length,
    }));
  } catch {}
}

export function loadDraft(): DraftData | null {
  try {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

export function loadDraftMeta(): DraftMeta | null {
  try {
    const saved = localStorage.getItem(DRAFT_META_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem(DRAFT_META_KEY);
  } catch {}
}

/* ─── Apply Preset to Config ─── */
export function applyPreset(config: TemplateConfig, preset: SectionPreset): TemplateConfig {
  const elements: TemplateElement[] = preset.elements.map((el) => ({
    ...el,
    id: generateElementId(),
  }));

  return {
    ...config,
    sections: config.sections.map((s) =>
      s.key === preset.targetSection
        ? { ...s, elements: [...s.elements, ...elements] }
        : s
    ),
  };
}

/* ─── Apply Preset (Replace) ─── */
export function applyPresetReplace(config: TemplateConfig, preset: SectionPreset): TemplateConfig {
  const elements: TemplateElement[] = preset.elements.map((el) => ({
    ...el,
    id: generateElementId(),
  }));

  return {
    ...config,
    sections: config.sections.map((s) =>
      s.key === preset.targetSection
        ? { ...s, elements }
        : s
    ),
  };
}

/* ─── Reorder Sections ─── */
export function reorderSections(config: TemplateConfig, fromIndex: number, toIndex: number): TemplateConfig {
  const sections = [...config.sections];
  const [moved] = sections.splice(fromIndex, 1);
  sections.splice(toIndex, 0, moved);
  return { ...config, sections };
}

/* ─── Export Config as JSON ─── */
export function exportConfigJson(data: DraftData): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.templateName.replace(/\s+/g, '-').toLowerCase()}-config.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ─── Import Config from JSON ─── */
export function importConfigJson(jsonString: string): DraftData | null {
  try {
    const parsed = JSON.parse(jsonString);
    // Basic validation
    if (!parsed || typeof parsed !== 'object') return null;
    if (!parsed.config || !Array.isArray(parsed.config.sections)) return null;
    if (!parsed.templateName || typeof parsed.templateName !== 'string') return null;
    // Validate sections have required fields
    for (const section of parsed.config.sections) {
      if (!section.key || typeof section.enabled !== 'boolean' || !Array.isArray(section.elements)) return null;
    }
    return parsed as DraftData;
  } catch {
    return null;
  }
}
