/* ═══════════════════════════════════════════════════════════════
   Template Builder Types & Constants
   
   Defines the data model for custom templates built from
   Javanese properties (wayang, batik, ornaments).
   ═══════════════════════════════════════════════════════════════ */

// ─── Section Keys ───
export type SectionKey =
  | 'hero'
  | 'guest-welcome'
  | 'mempelai'
  | 'adat-pepatah'
  | 'love-quotes'
  | 'our-story'
  | 'quran-verse'
  | 'event-details'
  | 'countdown'
  | 'wedding-itinerary'
  | 'welcome-video'
  | 'photo-gallery'
  | 'bridesmaid-groomsman'
  | 'rsvp'
  | 'guestbook'
  | 'amplop-digital'
  | 'share'
  | 'closing';

// ─── Component Types ───
export type ComponentType =
  | 'WayangKalpataru'
  | 'WayangArjuna'
  | 'WayangSrikandi'
  | 'WayangBima'
  | 'WayangGatotkaca'
  | 'WayangHanoman'
  | 'BatikScallopTop'
  | 'BatikScallopBottom'
  | 'BatikStripBorder'
  | 'BatikParang'
  | 'BatikTruntum'
  | 'BatikKawung'
  | 'MegamendungLeft'
  | 'MegamendungRight'
  | 'AksaraJawaOrnament'
  | 'JavaneseGoldDivider'
  | 'SulurSuluran'
  | 'CandiBentar'
  | 'JavaneseDoubleBorder'
  | 'ShadowScreenAtmosphere'
  | 'ArchedPhotoFrame'
  | 'FloralCornerTopLeft'
  | 'FloralCornerTopRight'
  | 'FloralCornerBottomLeft'
  | 'FloralCornerBottomRight'
  | 'LampuHias'
  | 'BungaMelati'
  | 'KerisOrnament'
  | 'CustomUploadedImage';

// ─── Position Types ───
export type PositionType = 'above' | 'below' | 'left' | 'right' | 'center' | 'background' | 'flank-left' | 'flank-right';

// ─── Animation Types (expanded version defined later in this file) ───

// ─── Size Types ───
export type SizeType = 'small' | 'medium' | 'large' | 'full';

// ─── Design Variant Types ───
export type DesignVariant = 'mewah' | 'simple' | 'luxury' | 'classic' | 'modern' | 'rustic' | 'bohemian';

export interface DesignVariantConfig {
  id: DesignVariant;
  label: string;
  description: string;
  icon: string;
  // Layout density
  elementSpacing: 'compact' | 'normal' | 'spacious';
  // Border style
  borderStyle: 'ornate' | 'thin' | 'double' | 'classic' | 'geometric' | 'rough' | 'watercolor';
  // Animation intensity
  animationLevel: 'full' | 'elegant' | 'minimal' | 'traditional' | 'contemporary' | 'natural' | 'playful';
  // Particle effects
  particleEffect: 'gold-petals' | 'soft-sparkle' | 'none' | 'falling-leaves' | 'sakura-petals' | 'float-bubbles';
  // Typography
  fontHeading: string;
  fontBody: string;
  // Section padding multiplier
  sectionPaddingFactor: number; // 0.5 = compact, 1 = normal, 1.5 = spacious
  // Max elements visible per section
  maxElementsPerSection: number; // 0 = unlimited
  // Show batik borders by default
  showBatikBorders: boolean;
  // Show wayang by default
  showWayang: boolean;
}

export const DESIGN_VARIANTS: Record<DesignVariant, DesignVariantConfig> = {
  mewah: {
    id: 'mewah',
    label: 'Mewah',
    description: 'Kemewahan total dengan detail grand, wayang, batik borders',
    icon: '💎',
    elementSpacing: 'spacious',
    borderStyle: 'ornate',
    animationLevel: 'full',
    particleEffect: 'gold-petals',
    fontHeading: 'var(--font-playfair)',
    fontBody: 'var(--font-inter)',
    sectionPaddingFactor: 1.5,
    maxElementsPerSection: 0,
    showBatikBorders: true,
    showWayang: true,
  },
  simple: {
    id: 'simple',
    label: 'Simple',
    description: 'Minimalis, clean, tanpa ornamen berlebihan',
    icon: '🕊️',
    elementSpacing: 'compact',
    borderStyle: 'thin',
    animationLevel: 'minimal',
    particleEffect: 'none',
    fontHeading: 'var(--font-inter)',
    fontBody: 'var(--font-inter)',
    sectionPaddingFactor: 0.8,
    maxElementsPerSection: 3,
    showBatikBorders: false,
    showWayang: false,
  },
  luxury: {
    id: 'luxury',
    label: 'Luxury',
    description: 'Premium dan eksklusif, double borders, soft sparkle',
    icon: '👑',
    elementSpacing: 'spacious',
    borderStyle: 'double',
    animationLevel: 'elegant',
    particleEffect: 'soft-sparkle',
    fontHeading: 'var(--font-playfair)',
    fontBody: 'var(--font-inter)',
    sectionPaddingFactor: 1.3,
    maxElementsPerSection: 0,
    showBatikBorders: true,
    showWayang: false,
  },
  classic: {
    id: 'classic',
    label: 'Classic',
    description: 'Keabadian desain klasik, frame borders, traditional animation',
    icon: '📜',
    elementSpacing: 'normal',
    borderStyle: 'classic',
    animationLevel: 'traditional',
    particleEffect: 'none',
    fontHeading: 'var(--font-playfair)',
    fontBody: 'var(--font-inter)',
    sectionPaddingFactor: 1.0,
    maxElementsPerSection: 0,
    showBatikBorders: true,
    showWayang: true,
  },
  modern: {
    id: 'modern',
    label: 'Modern',
    description: 'Kontemporer, geometric borders, clean lines',
    icon: '🔲',
    elementSpacing: 'compact',
    borderStyle: 'geometric',
    animationLevel: 'contemporary',
    particleEffect: 'none',
    fontHeading: 'var(--font-inter)',
    fontBody: 'var(--font-inter)',
    sectionPaddingFactor: 0.9,
    maxElementsPerSection: 4,
    showBatikBorders: false,
    showWayang: false,
  },
  rustic: {
    id: 'rustic',
    label: 'Rustic',
    description: 'Alami, hangat, rough edges, falling leaves',
    icon: '🍂',
    elementSpacing: 'spacious',
    borderStyle: 'rough',
    animationLevel: 'natural',
    particleEffect: 'falling-leaves',
    fontHeading: 'var(--font-playfair)',
    fontBody: 'var(--font-inter)',
    sectionPaddingFactor: 1.2,
    maxElementsPerSection: 0,
    showBatikBorders: false,
    showWayang: true,
  },
  bohemian: {
    id: 'bohemian',
    label: 'Bohemian',
    description: 'Bebas, artistik, watercolor borders, playful',
    icon: '🎨',
    elementSpacing: 'spacious',
    borderStyle: 'watercolor',
    animationLevel: 'playful',
    particleEffect: 'float-bubbles',
    fontHeading: 'var(--font-playfair)',
    fontBody: 'var(--font-inter)',
    sectionPaddingFactor: 1.1,
    maxElementsPerSection: 0,
    showBatikBorders: false,
    showWayang: true,
  },
};

// ─── Color Palette Presets ───
export interface ColorPalettePreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  primary: string;     // Main background/accent
  secondary: string;   // Secondary color
  accent: string;      // Gold/ornamental accent
  text: string;        // Primary text
  textSub: string;     // Secondary text
  bg: string;          // Background
  sectionBg: string;   // Section background
  border: string;      // Border color
}

export const JAVANESE_COLOR_PALETTES: ColorPalettePreset[] = [
  {
    id: 'gold-maroon',
    name: 'Emas-Marun',
    description: 'Klasik Jawa — marun gelap dengan aksen emas',
    icon: '🏛️',
    primary: '#800020',
    secondary: '#5C0015',
    accent: '#D4AF37',
    text: '#F5F0E6',
    textSub: '#C9B896',
    bg: '#1a0a0a',
    sectionBg: 'rgba(44, 24, 16, 0.6)',
    border: 'rgba(212, 175, 55, 0.3)',
  },
  {
    id: 'emerald-gold',
    name: 'Zamrud-Emas',
    description: 'Hijau zamrud dengan aksen emas — nuansa Sunda',
    icon: '🌿',
    primary: '#1a472a',
    secondary: '#2d6a4f',
    accent: '#D4AF37',
    text: '#E8F0E8',
    textSub: '#A8C8A8',
    bg: '#0a1a12',
    sectionBg: 'rgba(26, 51, 36, 0.6)',
    border: 'rgba(212, 175, 55, 0.3)',
  },
  {
    id: 'royal-blue-gold',
    name: 'Biru Kerajaan-Emas',
    description: 'Biru navy dengan emas — nuansa Bugis/Arab',
    icon: '🌊',
    primary: '#1B3A4B',
    secondary: '#0D1B2A',
    accent: '#D4AF37',
    text: '#E6F0F5',
    textSub: '#96B8C8',
    bg: '#070F18',
    sectionBg: 'rgba(13, 27, 42, 0.6)',
    border: 'rgba(212, 175, 55, 0.3)',
  },
  {
    id: 'ivory-brown',
    name: 'Gading-Coklat',
    description: 'Krem gading dengan coklat tua — Jawa klasik',
    icon: '📜',
    primary: '#3A2A1A',
    secondary: '#5D4A3A',
    accent: '#D4AF37',
    text: '#3A2A1A',
    textSub: '#5D4A3A',
    bg: '#F5F0E6',
    sectionBg: '#EDE7D9',
    border: 'rgba(212, 175, 55, 0.3)',
  },
  {
    id: 'purple-gold',
    name: 'Ungu-Emas',
    description: 'Ungu gelap dengan emas — nuansa Batak',
    icon: '💎',
    primary: '#1A0A2E',
    secondary: '#3D1C56',
    accent: '#C9A84C',
    text: '#F0E6F5',
    textSub: '#B896C8',
    bg: '#0F0620',
    sectionBg: 'rgba(26, 10, 46, 0.6)',
    border: 'rgba(201, 168, 76, 0.3)',
  },
  {
    id: 'cherry-gold',
    name: 'Ceri-Emas',
    description: 'Merah ceri dengan emas — nuansa Palembang/China',
    icon: '🏮',
    primary: '#800020',
    secondary: '#A0304A',
    accent: '#FFD700',
    text: '#FFF0F0',
    textSub: '#C89696',
    bg: '#2C0A0A',
    sectionBg: 'rgba(92, 21, 21, 0.6)',
    border: 'rgba(255, 215, 0, 0.3)',
  },
  {
    id: 'sage-copper',
    name: 'Sage-Tembaga',
    description: 'Hijau sage dengan tembaga — rustic Jawa',
    icon: '🍂',
    primary: '#4A5D4A',
    secondary: '#6B8F6B',
    accent: '#B87333',
    text: '#2D3A2D',
    textSub: '#5A6B5A',
    bg: '#F0F2EB',
    sectionBg: '#E5E8DF',
    border: 'rgba(184, 115, 51, 0.3)',
  },
  {
    id: 'midnight-silver',
    name: 'Tengah Malam-Perak',
    description: 'Hitam pekat dengan perak — modern luxury',
    icon: '🌙',
    primary: '#0A0A0A',
    secondary: '#1A1A2E',
    accent: '#C0C0C0',
    text: '#F0F0F0',
    textSub: '#A0A0A0',
    bg: '#050505',
    sectionBg: 'rgba(20, 20, 30, 0.6)',
    border: 'rgba(192, 192, 192, 0.3)',
  },
];

// ─── Section Visibility Rules ───
export interface SectionVisibilityRule {
  sectionKey: SectionKey;
  /** Only show if nuansa is one of these (empty = show always) */
  nuansaFilter: string[];
  /** Only show if adat is one of these (empty = show always) */
  adatFilter: string[];
  /** Hide if design is one of these (empty = never hide) */
  designFilterHide: string[];
}

export const SECTION_VISIBILITY_RULES: SectionVisibilityRule[] = [
  { sectionKey: 'quran-verse', nuansaFilter: ['islam'], adatFilter: [], designFilterHide: [] },
  { sectionKey: 'adat-pepatah', nuansaFilter: [], adatFilter: ['jawa', 'sunda', 'batak', 'bali', 'minang', 'bugis', 'palembang'], designFilterHide: ['modern'] },
  { sectionKey: 'welcome-video', nuansaFilter: [], adatFilter: [], designFilterHide: ['simple'] },
  { sectionKey: 'bridesmaid-groomsman', nuansaFilter: [], adatFilter: [], designFilterHide: ['simple'] },
  { sectionKey: 'wedding-itinerary', nuansaFilter: [], adatFilter: [], designFilterHide: ['simple'] },
];

export function isSectionVisible(sectionKey: SectionKey, nuansa: string, adat: string, design: string): boolean {
  const rule = SECTION_VISIBILITY_RULES.find(r => r.sectionKey === sectionKey);
  if (!rule) return true;
  if (rule.nuansaFilter.length > 0 && !rule.nuansaFilter.includes(nuansa)) return false;
  if (rule.adatFilter.length > 0 && !rule.adatFilter.includes(adat)) return false;
  if (rule.designFilterHide.length > 0 && rule.designFilterHide.includes(design)) return false;
  return true;
}

// ─── Opening Animation Type ───
export type OpeningAnimationType = 'envelope' | 'gate-open' | 'curtain-reveal' | 'book-open' | 'petal-reveal' | 'none';

export const OPENING_ANIMATION_OPTIONS: { id: OpeningAnimationType; label: string; description: string; icon: string }[] = [
  { id: 'envelope', label: 'Amplop', description: 'Amplop klasik yang dibuka', icon: '✉️' },
  { id: 'gate-open', label: 'Candi Bentar', description: 'Gerbang candi terbuka ke dua sisi', icon: '🏯' },
  { id: 'curtain-reveal', label: 'Layar Wayang', description: 'Kelir wayang terbuka menampilkan isi', icon: '🎭' },
  { id: 'book-open', label: 'Buku Terbuka', description: 'Halaman buku terbuka', icon: '📖' },
  { id: 'petal-reveal', label: 'Kelopak Bunga', description: 'Kelopak bunga berguguran menampilkan undangan', icon: '🌸' },
  { id: 'none', label: 'Tanpa Animasi', description: 'Langsung tampil tanpa animasi pembuka', icon: '⚡' },
];

// ─── Music Preset Type ───
export interface MusicPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  filename: string;   // File in /public/music/
  category: 'gamelan' | 'acoustic' | 'piano' | 'strings' | 'nasyid';
}

export const MUSIC_PRESETS: MusicPreset[] = [
  { id: 'gamelan', name: 'Gamelan Jawa', description: 'Musik gamelan tradisional Jawa', icon: '🎵', filename: 'gamelan.mp3', category: 'gamelan' },
  { id: 'acoustic', name: 'Acoustic Guitar', description: 'Gitar akustik lembut', icon: '🎸', filename: 'acoustic.mp3', category: 'acoustic' },
  { id: 'piano', name: 'Piano', description: 'Piano klasik yang elegan', icon: '🎹', filename: 'piano.mp3', category: 'piano' },
  { id: 'strings', name: 'String Ensemble', description: 'Orkestra string yang megah', icon: '🎻', filename: 'strings.mp3', category: 'strings' },
  { id: 'nasyid', name: 'Nasyid', description: 'Nasyid Islami yang syahdu', icon: '🕌', filename: 'nasyid.mp3', category: 'nasyid' },
];

// ─── Background Type for Sections ───
export type BackgroundType = 'solid' | 'pattern' | 'photo' | 'gradient';

export type PatternType = 'parang' | 'truntum' | 'kawung' | 'megamendung' | 'none';

export interface SectionBackground {
  type: BackgroundType;
  // Solid
  color?: string;
  // Pattern
  pattern?: PatternType;
  patternOpacity?: number;  // 0-1
  // Photo
  photoUrl?: string;
  photoOpacity?: number;   // 0-1
  photoPosition?: 'cover' | 'contain' | 'center';
  // Gradient
  gradientFrom?: string;
  gradientTo?: string;
  gradientDirection?: 'to-b' | 'to-br' | 'to-r' | 'radial';
}

// ─── Template Element ───
export interface TemplateElement {
  id: string;
  component: ComponentType;
  position: PositionType;
  animation: AnimationType;
  duration: number;
  delay: number;
  size: SizeType;
  opacity: number;
  xOffset?: number;  // -100 to 100 (percentage offset from default position)
  yOffset?: number;  // -100 to 100
  props?: Record<string, any>;
}

// ─── Template Section ───
export interface TemplateSection {
  key: SectionKey;
  enabled: boolean;
  elements: TemplateElement[];
  // Background
  background?: SectionBackground;
  // Spacing control
  paddingTop?: number;    // 0-8 (in 0.25rem units)
  paddingBottom?: number;  // 0-8 (in 0.25rem units)
  // Custom colors per section
  customBg?: string;       // hex color override for section bg
  customAccent?: string;   // hex color override for accent/gold
  // Countdown config
  countdownTargetDate?: string;  // ISO date string
  countdownLabel?: string;       // Custom label like "Menuju Hari Bahagia"
  // Video embed config (welcome-video section)
  videoUrl?: string;             // YouTube/Vimeo URL
  videoAutoplay?: boolean;       // Autoplay toggle
  // QR Code config (closing / amplop-digital sections)
  qrCodeContent?: string;        // URL or text to encode
  qrCodeSize?: 'small' | 'medium' | 'large';  // QR code size
  qrCodeColor?: string;          // QR code foreground color (hex)
  // Section visibility override
  visibilityOverride?: 'show' | 'hide' | 'auto';  // 'auto' = follow rules
}

// ─── Template Config ───
export interface TemplateConfig {
  sections: TemplateSection[];
  // Design variant
  designVariant?: DesignVariant;
  // Color palette
  colorPalette?: string;  // id from JAVANESE_COLOR_PALETTES
  // Opening animation
  openingAnimation?: OpeningAnimationType;
  // Music
  musicPreset?: string;  // id from MUSIC_PRESETS
  // Custom music URL (overrides preset)
  customMusicUrl?: string;
  // OG Image / SEO
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  // Photo gallery images
  galleryImages?: string[];  // Array of image URLs for photo-gallery section
}

// ─── Component Registry ───
export interface ComponentInfo {
  type: ComponentType;
  label: string;
  category: 'wayang' | 'batik' | 'ornament' | 'atmosphere' | 'frame';
  description: string;
  icon: string; // emoji
  defaultPosition: PositionType;
  defaultAnimation: AnimationType;
  defaultDuration: number;
  defaultSize: SizeType;
  defaultOpacity: number;
  hasProps?: boolean;
  defaultProps?: Record<string, any>;
}

// ─── All Available Components ───
export const COMPONENT_REGISTRY: ComponentInfo[] = [
  // Wayang
  {
    type: 'WayangKalpataru',
    label: 'Wayang Kalpataru',
    category: 'wayang',
    description: 'Pohon Hayat — wayang pembuka pertunjukan',
    icon: '🌳',
    defaultPosition: 'center',
    defaultAnimation: 'sway',
    defaultDuration: 6,
    defaultSize: 'large',
    defaultOpacity: 1,
  },
  {
    type: 'WayangArjuna',
    label: 'Wayang Arjuna',
    category: 'wayang',
    description: 'Arjuna — ksatria halus, mempelai pria',
    icon: '🏹',
    defaultPosition: 'flank-left',
    defaultAnimation: 'sway',
    defaultDuration: 7,
    defaultSize: 'medium',
    defaultOpacity: 0.8,
  },
  {
    type: 'WayangSrikandi',
    label: 'Wayang Srikandi',
    category: 'wayang',
    description: 'Srikandi — wanita ksatria, mempelai wanita',
    icon: '⚔️',
    defaultPosition: 'flank-right',
    defaultAnimation: 'swayReverse',
    defaultDuration: 7,
    defaultSize: 'medium',
    defaultOpacity: 0.8,
  },
  // Batik
  {
    type: 'BatikScallopTop',
    label: 'Batik Scallop Atas',
    category: 'batik',
    description: 'Border batik puncak dengan pola kawung & parang',
    icon: '🔺',
    defaultPosition: 'above',
    defaultAnimation: 'shimmer',
    defaultDuration: 8,
    defaultSize: 'full',
    defaultOpacity: 1,
  },
  {
    type: 'BatikScallopBottom',
    label: 'Batik Scallop Bawah',
    category: 'batik',
    description: 'Border batik dasar dengan pola kawung & parang',
    icon: '🔻',
    defaultPosition: 'below',
    defaultAnimation: 'shimmer',
    defaultDuration: 8,
    defaultSize: 'full',
    defaultOpacity: 1,
  },
  {
    type: 'BatikStripBorder',
    label: 'Batik Strip Border',
    category: 'batik',
    description: 'Border horizontal dengan kawung & truntum',
    icon: '▬',
    defaultPosition: 'above',
    defaultAnimation: 'shimmer',
    defaultDuration: 6,
    defaultSize: 'full',
    defaultOpacity: 1,
  },
  // Ornaments
  {
    type: 'AksaraJawaOrnament',
    label: 'Aksara Jawa',
    category: 'ornament',
    description: 'Teks aksara Jawa dengan efek shimmer emas',
    icon: '✍️',
    defaultPosition: 'center',
    defaultAnimation: 'shimmer',
    defaultDuration: 3,
    defaultSize: 'medium',
    defaultOpacity: 1,
    hasProps: true,
    defaultProps: { text: 'ꦱꦶꦤꦺꦴꦩ꧀' },
  },
  {
    type: 'JavaneseGoldDivider',
    label: 'Gold Divider',
    category: 'ornament',
    description: 'Pembatas emas dengan ornamen kawung',
    icon: '✦',
    defaultPosition: 'center',
    defaultAnimation: 'pulse',
    defaultDuration: 3,
    defaultSize: 'full',
    defaultOpacity: 1,
  },
  {
    type: 'SulurSuluran',
    label: 'Sulur-suluran',
    category: 'ornament',
    description: 'Sulur tanaman Jawa dengan bunga kawung',
    icon: '🌿',
    defaultPosition: 'above',
    defaultAnimation: 'fadeIn',
    defaultDuration: 1,
    defaultSize: 'full',
    defaultOpacity: 1,
  },
  {
    type: 'CandiBentar',
    label: 'Candi Bentar',
    category: 'ornament',
    description: 'Gerbang candi belah — simbol penyambutan',
    icon: '🏯',
    defaultPosition: 'center',
    defaultAnimation: 'fadeInUp',
    defaultDuration: 0.8,
    defaultSize: 'medium',
    defaultOpacity: 1,
  },
  // Atmosphere
  {
    type: 'MegamendungLeft',
    label: 'Mega Mendung Kiri',
    category: 'atmosphere',
    description: 'Awan mega mendung bergerak ke kiri',
    icon: '☁️',
    defaultPosition: 'flank-left',
    defaultAnimation: 'drift',
    defaultDuration: 12,
    defaultSize: 'small',
    defaultOpacity: 0.3,
  },
  {
    type: 'MegamendungRight',
    label: 'Mega Mendung Kanan',
    category: 'atmosphere',
    description: 'Awan mega mendung bergerak ke kanan',
    icon: '☁️',
    defaultPosition: 'flank-right',
    defaultAnimation: 'driftReverse',
    defaultDuration: 12,
    defaultSize: 'small',
    defaultOpacity: 0.3,
  },
  {
    type: 'ShadowScreenAtmosphere',
    label: 'Shadow Screen',
    category: 'atmosphere',
    description: 'Efek layar wayang — cahaya blencong',
    icon: '🕯️',
    defaultPosition: 'background',
    defaultAnimation: 'glow',
    defaultDuration: 5,
    defaultSize: 'full',
    defaultOpacity: 1,
  },
  // Frame
  {
    type: 'JavaneseDoubleBorder',
    label: 'Double Border',
    category: 'frame',
    description: 'Bingkai ganda emas dengan kawung di sudut',
    icon: '🖼️',
    defaultPosition: 'center',
    defaultAnimation: 'fadeIn',
    defaultDuration: 0.8,
    defaultSize: 'full',
    defaultOpacity: 1,
  },
  {
    type: 'ArchedPhotoFrame',
    label: 'Arched Frame',
    category: 'frame',
    description: 'Bingkai foto lengkung dengan ornamen',
    icon: '📜',
    defaultPosition: 'center',
    defaultAnimation: 'fadeIn',
    defaultDuration: 0.8,
    defaultSize: 'medium',
    defaultOpacity: 1,
  },
  // More Wayang
  {
    type: 'WayangBima',
    label: 'Wayang Bima',
    category: 'wayang',
    description: 'Bima — ksatria gagah, kekuatan',
    icon: '💪',
    defaultPosition: 'flank-left',
    defaultAnimation: 'sway',
    defaultDuration: 7,
    defaultSize: 'medium',
    defaultOpacity: 0.8,
  },
  {
    type: 'WayangGatotkaca',
    label: 'Wayang Gatotkaca',
    category: 'wayang',
    description: 'Gatotkaca — ksatria sakti, otot kawat',
    icon: '🦸',
    defaultPosition: 'flank-right',
    defaultAnimation: 'swayReverse',
    defaultDuration: 7,
    defaultSize: 'medium',
    defaultOpacity: 0.8,
  },
  {
    type: 'WayangHanoman',
    label: 'Wayang Hanoman',
    category: 'wayang',
    description: 'Hanoman — kera putih setia, pengorbanan',
    icon: '🐒',
    defaultPosition: 'flank-left',
    defaultAnimation: 'sway',
    defaultDuration: 7,
    defaultSize: 'medium',
    defaultOpacity: 0.8,
  },
  // More Batik
  {
    type: 'BatikParang',
    label: 'Batik Parang',
    category: 'batik',
    description: 'Motif parang rusak — keberanian & keteguhan',
    icon: '🔷',
    defaultPosition: 'above',
    defaultAnimation: 'shimmer',
    defaultDuration: 8,
    defaultSize: 'full',
    defaultOpacity: 1,
  },
  {
    type: 'BatikTruntum',
    label: 'Batik Truntum',
    category: 'batik',
    description: 'Motif truntum — cinta yang tumbuh',
    icon: '🌸',
    defaultPosition: 'above',
    defaultAnimation: 'shimmer',
    defaultDuration: 8,
    defaultSize: 'full',
    defaultOpacity: 1,
  },
  {
    type: 'BatikKawung',
    label: 'Batik Kawung',
    category: 'batik',
    description: 'Motif kawung — harapan & keadilan',
    icon: '⬛',
    defaultPosition: 'above',
    defaultAnimation: 'shimmer',
    defaultDuration: 8,
    defaultSize: 'full',
    defaultOpacity: 1,
  },
  // Floral Corners
  {
    type: 'FloralCornerTopLeft',
    label: 'Floral Kiri Atas',
    category: 'ornament',
    description: 'Bunga sulur pojok kiri atas',
    icon: '🍃',
    defaultPosition: 'flank-left',
    defaultAnimation: 'fadeIn',
    defaultDuration: 1,
    defaultSize: 'small',
    defaultOpacity: 0.7,
  },
  {
    type: 'FloralCornerTopRight',
    label: 'Floral Kanan Atas',
    category: 'ornament',
    description: 'Bunga sulur pojok kanan atas',
    icon: '🍃',
    defaultPosition: 'flank-right',
    defaultAnimation: 'fadeIn',
    defaultDuration: 1,
    defaultSize: 'small',
    defaultOpacity: 0.7,
  },
  {
    type: 'FloralCornerBottomLeft',
    label: 'Floral Kiri Bawah',
    category: 'ornament',
    description: 'Bunga sulur pojok kiri bawah',
    icon: '🌿',
    defaultPosition: 'flank-left',
    defaultAnimation: 'fadeIn',
    defaultDuration: 1,
    defaultSize: 'small',
    defaultOpacity: 0.7,
  },
  {
    type: 'FloralCornerBottomRight',
    label: 'Floral Kanan Bawah',
    category: 'ornament',
    description: 'Bunga sulur pojok kanan bawah',
    icon: '🌿',
    defaultPosition: 'flank-right',
    defaultAnimation: 'fadeIn',
    defaultDuration: 1,
    defaultSize: 'small',
    defaultOpacity: 0.7,
  },
  // Atmosphere additions
  {
    type: 'LampuHias',
    label: 'Lampu Hias',
    category: 'atmosphere',
    description: 'Lampu hias/fairy lights — romantis',
    icon: '💡',
    defaultPosition: 'above',
    defaultAnimation: 'glow',
    defaultDuration: 4,
    defaultSize: 'full',
    defaultOpacity: 0.6,
  },
  {
    type: 'BungaMelati',
    label: 'Bunga Melati',
    category: 'atmosphere',
    description: 'Kelopak melati melayang — kesucian',
    icon: '💮',
    defaultPosition: 'background',
    defaultAnimation: 'float',
    defaultDuration: 8,
    defaultSize: 'full',
    defaultOpacity: 0.4,
  },
  // Ornament additions
  {
    type: 'KerisOrnament',
    label: 'Keris',
    category: 'ornament',
    description: 'Keris pusaka — simbol kebesaran Jawa',
    icon: '🗡️',
    defaultPosition: 'center',
    defaultAnimation: 'fadeInUp',
    defaultDuration: 1,
    defaultSize: 'small',
    defaultOpacity: 0.8,
  },
  // Custom Upload
  {
    type: 'CustomUploadedImage',
    label: 'Upload Custom',
    category: 'ornament',
    description: 'Upload gambar properti sendiri (PNG/SVG/JPG)',
    icon: '📤',
    defaultPosition: 'center',
    defaultAnimation: 'fadeIn',
    defaultDuration: 1,
    defaultSize: 'medium',
    defaultOpacity: 1,
    hasProps: true,
    defaultProps: { imageUrl: '', label: 'Custom Image' },
  },
];

// ─── Section Property Suggestions (Smart Auto-Suggest) ───
export const SECTION_PROPERTY_SUGGESTIONS: Record<SectionKey, ComponentType[]> = {
  'hero': ['CandiBentar', 'BatikScallopTop', 'BatikScallopBottom', 'ShadowScreenAtmosphere', 'MegamendungLeft', 'MegamendungRight', 'AksaraJawaOrnament'],
  'guest-welcome': ['CandiBentar', 'SulurSuluran', 'AksaraJawaOrnament', 'BatikStripBorder'],
  'mempelai': ['WayangArjuna', 'WayangSrikandi', 'JavaneseDoubleBorder', 'JavaneseGoldDivider', 'BatikScallopTop', 'BatikScallopBottom', 'FloralCornerTopLeft', 'FloralCornerTopRight', 'FloralCornerBottomLeft', 'FloralCornerBottomRight'],
  'adat-pepatah': ['AksaraJawaOrnament', 'JavaneseGoldDivider', 'SulurSuluran', 'WayangKalpataru'],
  'love-quotes': ['BungaMelati', 'SulurSuluran', 'JavaneseGoldDivider', 'LampuHias'],
  'our-story': ['FloralCornerTopLeft', 'FloralCornerTopRight', 'JavaneseDoubleBorder', 'BatikStripBorder'],
  'quran-verse': ['CandiBentar', 'JavaneseDoubleBorder', 'AksaraJawaOrnament', 'BatikScallopTop', 'BatikScallopBottom'],
  'event-details': ['CandiBentar', 'JavaneseGoldDivider', 'BatikStripBorder', 'LampuHias'],
  'countdown': ['JavaneseGoldDivider', 'MegamendungLeft', 'MegamendungRight'],
  'wedding-itinerary': ['BatikStripBorder', 'SulurSuluran', 'JavaneseGoldDivider'],
  'welcome-video': ['ArchedPhotoFrame', 'JavaneseDoubleBorder', 'FloralCornerTopLeft', 'FloralCornerTopRight'],
  'photo-gallery': ['ArchedPhotoFrame', 'BatikScallopTop', 'BatikScallopBottom', 'LampuHias'],
  'bridesmaid-groomsman': ['WayangArjuna', 'WayangSrikandi', 'FloralCornerTopLeft', 'FloralCornerTopRight', 'JavaneseGoldDivider'],
  'rsvp': ['CandiBentar', 'JavaneseDoubleBorder', 'BatikStripBorder'],
  'guestbook': ['SulurSuluran', 'JavaneseGoldDivider', 'BatikStripBorder'],
  'amplop-digital': ['JavaneseDoubleBorder', 'AksaraJawaOrnament', 'KerisOrnament'],
  'share': ['JavaneseGoldDivider', 'SulurSuluran'],
  'closing': ['WayangKalpataru', 'CandiBentar', 'BatikScallopTop', 'BatikScallopBottom', 'AksaraJawaOrnament'],
};

// ─── Section Labels ───
export const SECTION_LABELS: Record<SectionKey, string> = {
  'hero': 'Hero / Pembuka',
  'guest-welcome': 'Sambutan Tamu',
  'mempelai': 'Mempelai',
  'adat-pepatah': 'Adat & Pepatah',
  'love-quotes': 'Kata Cinta',
  'our-story': 'Cerita Kami',
  'quran-verse': 'Ayat Suci',
  'event-details': 'Detail Acara',
  'countdown': 'Hitung Mundur',
  'wedding-itinerary': 'Rundown Acara',
  'welcome-video': 'Video',
  'photo-gallery': 'Galeri Foto',
  'bridesmaid-groomsman': 'Pengiring',
  'rsvp': 'RSVP',
  'guestbook': 'Buku Tamu',
  'amplop-digital': 'Amplop Digital',
  'share': 'Bagikan',
  'closing': 'Penutup',
};

// ─── All sections in default order ───
export const DEFAULT_SECTION_ORDER: SectionKey[] = [
  'hero',
  'guest-welcome',
  'mempelai',
  'adat-pepatah',
  'love-quotes',
  'our-story',
  'quran-verse',
  'event-details',
  'countdown',
  'wedding-itinerary',
  'welcome-video',
  'photo-gallery',
  'bridesmaid-groomsman',
  'rsvp',
  'guestbook',
  'amplop-digital',
  'share',
  'closing',
];

// ─── Position Labels ───
export const POSITION_LABELS: Record<PositionType, string> = {
  'above': 'Di Atas',
  'below': 'Di Bawah',
  'left': 'Kiri',
  'right': 'Kanan',
  'center': 'Tengah',
  'background': 'Background',
  'flank-left': 'Flank Kiri',
  'flank-right': 'Flank Kanan',
};

// ─── Expanded Animation Types ───
export type AnimationType =
  | 'sway' | 'swayReverse'
  | 'shimmer' | 'shimmerGold'
  | 'float' | 'floatSoft' | 'floatBounce'
  | 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight'
  | 'pulse' | 'pulseSoft' | 'pulseGlow'
  | 'glow' | 'glowSoft' | 'glowPulse'
  | 'drift' | 'driftReverse' | 'driftUp' | 'driftDown'
  | 'rotate' | 'rotateSlow' | 'rotateSway'
  | 'scaleIn' | 'scalePulse' | 'scaleBounce'
  | 'bounce' | 'bounceSoft'
  | 'slideLeft' | 'slideRight'
  | 'typewriter' | 'wave'
  | 'flicker' | 'sparkle'
  | 'swing' | 'wiggle'
  | 'blur' | 'unblur'
  | 'colorShift' | 'goldFlow'
  | 'none';

export const ANIMATION_LABELS: Record<AnimationType, string> = {
  'sway': 'Sway (Goyang)',
  'swayReverse': 'Sway Terbalik',
  'shimmer': 'Shimmer (Kilau)',
  'shimmerGold': 'Shimmer Emas',
  'float': 'Float (Melayang)',
  'floatSoft': 'Float Halus',
  'floatBounce': 'Float Bounce',
  'fadeIn': 'Fade In',
  'fadeInUp': 'Fade In ke Atas',
  'fadeInDown': 'Fade In ke Bawah',
  'fadeInLeft': 'Fade In dari Kiri',
  'fadeInRight': 'Fade In dari Kanan',
  'pulse': 'Pulse (Denyut)',
  'pulseSoft': 'Pulse Halus',
  'pulseGlow': 'Pulse Bercahaya',
  'glow': 'Glow (Bercahaya)',
  'glowSoft': 'Glow Halus',
  'glowPulse': 'Glow Pulse',
  'drift': 'Drift Kiri',
  'driftReverse': 'Drift Kanan',
  'driftUp': 'Drift Atas',
  'driftDown': 'Drift Bawah',
  'rotate': 'Rotasi',
  'rotateSlow': 'Rotasi Lambat',
  'rotateSway': 'Rotasi Sway',
  'scaleIn': 'Scale In',
  'scalePulse': 'Scale Pulse',
  'scaleBounce': 'Scale Bounce',
  'bounce': 'Bounce',
  'bounceSoft': 'Bounce Halus',
  'slideLeft': 'Geser Kiri',
  'slideRight': 'Geser Kanan',
  'typewriter': 'Typewriter',
  'wave': 'Wave',
  'flicker': 'Flicker',
  'sparkle': 'Sparkle',
  'swing': 'Swing (Ayunan)',
  'wiggle': 'Wiggle (Goyang)',
  'blur': 'Blur',
  'unblur': 'Unblur',
  'colorShift': 'Color Shift',
  'goldFlow': 'Gold Flow',
  'none': 'Tanpa Animasi',
};

// ─── Size Labels ───
export const SIZE_LABELS: Record<SizeType, string> = {
  'small': 'Kecil',
  'medium': 'Sedang',
  'large': 'Besar',
  'full': 'Penuh',
};

// ─── Category Labels ───
export const CATEGORY_LABELS = {
  wayang: 'Wayang Kulit',
  batik: 'Batik',
  ornament: 'Ornamen',
  atmosphere: 'Atmosfer',
  frame: 'Bingkai',
};

// ─── Generate unique ID ───
export function generateElementId(): string {
  return 'el-' + Math.random().toString(36).substr(2, 9);
}

// ─── Create default empty config ───
export function createEmptyConfig(): TemplateConfig {
  return {
    sections: DEFAULT_SECTION_ORDER.map((key) => ({
      key,
      enabled: true,
      elements: [],
    })),
  };
}
