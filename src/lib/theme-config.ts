/**
 * Theme Configuration System
 * 
 * 3 Kategori Template:
 * 1. NUANSA  — menentukan konten teks (Islam: Bismillah, Assalamu'alaikum | Umum: The Wedding Of, Dear)
 * 2. ADAT    — menentukan visual identity (warna, corak, SVG pattern, ornamen)
 * 3. TINGKAT — menentukan level beautification (animasi, font, border, efek)
 */

import type { NuansaType, AdatType, DesignType } from './template-data';
import { getTemplateById } from './template-data';

/* ─── Theme Variable Interface ─── */
export interface ThemeVariables {
  /* Core colors */
  '--inv-primary': string;       // Warna utama (burgundy, hijau, dll)
  '--inv-primary-dark': string;  // Versi gelap primary
  '--inv-primary-light': string; // Versi terang primary
  '--inv-accent': string;        // Warna aksen (gold, silver, dll)
  '--inv-accent-soft': string;   // Aksen lembut (dengan alpha)
  '--inv-bg': string;            // Background utama
  '--inv-bg-pattern': string;    // Background section pattern
  '--inv-text': string;          // Warna teks utama
  '--inv-text-muted': string;    // Warna teks secondary
  
  /* SVG Pattern untuk background */
  '--inv-pattern-url': string;   // Data URI SVG pattern
  '--inv-pattern-opacity': string;
  
  /* Border & ornament */
  '--inv-border-color': string;
  '--inv-ornament-fill': string;
  
  /* Section-specific */
  '--inv-footer-bg': string;
  '--inv-envelope-bg': string;
  '--inv-envelope-accent': string;
}

/* ─── Nuansa Text Config ─── */
export interface NuansaTextConfig {
  bismillah: string;
  bismillahArabic: string;
  greeting: string;
  introText: string;
  eventLabelAkad: string;
  eventLabelResepsi: string;
  rsvpLabel: string;
  footerDua: string;
}

/* ─── Adat Text Config ─── Cultural content per adat tradition */
export interface AdatTextConfig {
  /** Decorative script/characters unique to the culture (e.g. Aksara Jawa) */
  decorativeScript: string;
  /** Cultural greeting phrase specific to the tradition */
  culturalGreeting: string;
  /** Traditional proverb or saying about marriage */
  pepatah: string;
  /** Source/attribution for the pepatah */
  pepatahSource: string;
  /** Additional cultural phrases used in wedding context */
  weddingPhrase: string;
  /** Whether to show Pasaran (Javanese 5-day calendar) */
  showPasaran: boolean;
  /** Whether to show wayang/cultural ornaments in envelope */
  showCulturalOrnaments: boolean;
  /** Petal/particle colors for this adat theme */
  petalColors: string[];
}

export const nuansaTexts: Record<NuansaType, NuansaTextConfig> = {
  islam: {
    bismillah: 'Bismillahirrahmanirrahim',
    bismillahArabic: 'بسم الله الرحمن الرحيم',
    greeting: "Assalamu'alaikum Warahmatullahi Wabarakatuh",
    introText: 'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan',
    eventLabelAkad: 'Akad Nikah',
    eventLabelResepsi: 'Resepsi',
    rsvpLabel: 'Konfirmasi Kehadiran',
    footerDua: 'Barakallahu lakuma wa baraka \'alaikuma wa jama\'a bainakuma fi khair',
  },
  umum: {
    bismillah: 'The Wedding Of',
    bismillahArabic: '',
    greeting: 'Dear Beloved Friends & Family',
    introText: 'Dengan penuh sukacita, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia kami',
    eventLabelAkad: 'Pemberkatan Nikah',
    eventLabelResepsi: 'Resepsi',
    rsvpLabel: 'Konfirmasi Kehadiran',
    footerDua: 'Semoga cinta kami abadi selamanya',
  },
};

/* ─── Adat Text Configs ─── */
export const adatTexts: Record<AdatType, AdatTextConfig> = {
  jawa: {
    decorativeScript: 'ꦱꦶꦤꦺꦴꦩ꧀',  // Sinom in Aksara Jawa — represents beauty and refinement
    culturalGreeting: 'Kula ngaturaken sowan dumateng panjenengan sedaya',
    pepatah: 'Miturut tatakrama, memayu hayuning bawana. Ana hana seba bakti, wani ngalah luhur wekasane.',
    pepatahSource: 'Pepatah Jawa',
    weddingPhrase: 'Mbenjang pawiwahan utawi panggih pengantin',
    showPasaran: true,
    showCulturalOrnaments: true,
    petalColors: ['#D4AF37', '#E8D48B', '#3A2A1A', '#C9A84C', '#5D4A3A', '#D8C8B4'],
  },
  sunda: {
    decorativeScript: '',
    culturalGreeting: 'Bade ngondang ka hapunteun sadayana',
    pepatah: 'Kawas cai kapalitu, hirup kudu silih asih, silih asah, jeung silih asuh.',
    pepatahSource: 'Paribasa Sunda',
    weddingPhrase: 'Pasamoan pangantin',
    showPasaran: false,
    showCulturalOrnaments: false,
    petalColors: ['#C9A84C', '#4A7C2E', '#2D5016', '#8BC34A', '#6B8E23', '#DAA520'],
  },
  batak: {
    decorativeScript: '',
    culturalGreeting: 'Horas! Tu halak na mardongan hasangapon',
    pepatah: 'Hasangapon, Hagabeon, Hamoraon — kemuliaan, kebahagiaan, dan kemakmuran.',
    pepatahSource: 'Filosofi Batak',
    weddingPhrase: 'Parbaringin ni parmata',
    showPasaran: false,
    showCulturalOrnaments: false,
    petalColors: ['#C9A84C', '#3D1C56', '#7B4FA0', '#E8D5F5', '#A070C0', '#5C2D91'],
  },
  bali: {
    decorativeScript: '',
    culturalGreeting: 'Om Swastiastu',
    pepatah: 'Kama bangun yaning jagat, subha karya ring jagat — cinta lahir di dunia, kebaikan berkarya di dunia.',
    pepatahSource: 'Ajaran Bali',
    weddingPhrase: 'Mesakapan utawi pawiwahan',
    showPasaran: false,
    showCulturalOrnaments: false,
    petalColors: ['#C9A84C', '#2D6A4F', '#1A472A', '#90EE90', '#3CB371', '#DAA520'],
  },
  arab: {
    decorativeScript: '',
    culturalGreeting: 'Bismillah, dengan nama Allah yang Maha Pengasih lagi Maha Penyayang',
    pepatah: 'Wa min ayatihi an khalaqa lakum min anfusikum azwajan litaskunu ilayha wa ja\'ala baynakum mawaddatan wa rahmah.',
    pepatahSource: 'QS. Ar-Rum: 21',
    weddingPhrase: 'Zawajun mubarakun insya Allah',
    showPasaran: false,
    showCulturalOrnaments: false,
    petalColors: ['#C9A84C', '#2E5A6E', '#1B3A4B', '#87CEEB', '#4682B4', '#DAA520'],
  },
  jepang: {
    decorativeScript: '',
    culturalGreeting: 'Yoroshiku onegaishimasu',
    pepatah: 'Ennichi ni wa kekkon suru mono ga nai — Di hari baik, semua menuju kebahagiaan.',
    pepatahSource: 'Kotowaza',
    weddingPhrase: 'Kekkon shiki',
    showPasaran: false,
    showCulturalOrnaments: false,
    petalColors: ['#FFB7C5', '#FF69B4', '#C47A8B', '#D4A0AD', '#FFC0CB', '#FFE4E1'],
  },
  china: {
    decorativeScript: '囍',
    culturalGreeting: 'Gong xi fa cai, bai nian hao he',
    pepatah: 'You qian ren zhong cheng juan shu — Seribu benang tenun menjadi satu ikatan.',
    pepatahSource: 'Pepatah Tionghoa',
    weddingPhrase: 'Jie hun zhi xi',
    showPasaran: false,
    showCulturalOrnaments: false,
    petalColors: ['#FFD700', '#CC0000', '#8B0000', '#FF4444', '#FF6347', '#DAA520'],
  },
  minang: {
    decorativeScript: '',
    culturalGreeting: 'Assalamu\'alaikum, salam sejahtera untuak sanak sudaro',
    pepatah: 'Alam takambang jadi guru — alam terbentang menjadi guru, alam mengajarkan kebijaksanaan.',
    pepatahSource: 'Kato nan ampek Minang',
    weddingPhrase: 'Baralek pengantin',
    showPasaran: false,
    showCulturalOrnaments: false,
    petalColors: ['#C9A84C', '#A0522D', '#8B4513', '#D2B48C', '#DEB887', '#CD853F'],
  },
  bugis: {
    decorativeScript: '',
    culturalGreeting: 'Salama\' na riaseng ri paddissengeng',
    pepatah: 'Siri\' na pacce — rasa malu dan solidaritas, fondasi kehormatan dan kebersamaan.',
    pepatahSource: 'Pappaseng Bugis',
    weddingPhrase: 'Paennikang riaseng',
    showPasaran: false,
    showCulturalOrnaments: false,
    petalColors: ['#C9A84C', '#1B3A4B', '#0D1B2A', '#4682B4', '#87CEEB', '#DAA520'],
  },
  palembang: {
    decorativeScript: '',
    culturalGreeting: 'Salam sejahtera untuk sekalian',
    pepatah: 'Jerih rayo ndak merdeko, samo raso samo rato — berat sama dipikul, ringan sama dijinjing.',
    pepatahSource: 'Pepatah Palembang',
    weddingPhrase: 'Berkat betunangan',
    showPasaran: false,
    showCulturalOrnaments: false,
    petalColors: ['#FFD700', '#A0304A', '#800020', '#FF6B6B', '#DAA520', '#FFB6C1'],
  },
};

/* ─── Adat Theme Configs ─── */

// ─── JAWA patterns: Dark brown on cream (aged paper aesthetic) ───
// Parang pattern — dark brown on ivory for Jawa background
const batikParangJawaPattern = encodeURIComponent(`<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="%233A2A1A" fill-opacity="0.05"><path d="M30 5 L35 15 L45 20 L35 25 L30 35 L25 25 L15 20 L25 15 Z"/><path d="M10 40 L12 44 L16 46 L12 48 L10 52 L8 48 L4 46 L8 44 Z"/><path d="M50 40 L52 44 L56 46 L52 48 L50 52 L48 48 L44 46 L48 44 Z"/></g></svg>`);

// Kawung pattern — dark brown on ivory for Jawa secondary sections
const kawungJawaPattern = encodeURIComponent(`<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g fill="%233A2A1A" fill-opacity="0.04"><circle cx="20" cy="10" r="4"/><circle cx="10" cy="20" r="4"/><circle cx="30" cy="20" r="4"/><circle cx="20" cy="30" r="4"/><ellipse cx="20" cy="20" rx="3" ry="6"/></g></svg>`);

// Truntum pattern — subtle floral for Jawa (symbol of growing love)
const truntumJawaPattern = encodeURIComponent(`<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="%233A2A1A" fill-opacity="0.03"><circle cx="15" cy="15" r="3"/><circle cx="45" cy="15" r="3"/><circle cx="15" cy="45" r="3"/><circle cx="45" cy="45" r="3"/><circle cx="30" cy="30" r="4"/><path d="M30 26 L28 30 L30 34 L32 30Z"/><path d="M26 30 L30 28 L34 30 L30 32Z"/></g></svg>`);

// ─── Legacy patterns (kept for non-Jawa themes) ───
// Coffee palette versions (taupe #C7B7A3) — kept for backward compat
const batikParangCoffeePattern = encodeURIComponent(`<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="%23C7B7A3" fill-opacity="0.08"><path d="M30 5 L35 15 L45 20 L35 25 L30 35 L25 25 L15 20 L25 15 Z"/><path d="M10 40 L12 44 L16 46 L12 48 L10 52 L8 48 L4 46 L8 44 Z"/><path d="M50 40 L52 44 L56 46 L52 48 L50 52 L48 48 L44 46 L48 44 Z"/></g></svg>`);

// Gold patterns for non-Jawa themes
const batikParangPattern = encodeURIComponent(`<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="%23C9A84C" fill-opacity="0.06"><path d="M30 5 L35 15 L45 20 L35 25 L30 35 L25 25 L15 20 L25 15 Z"/><path d="M10 40 L12 44 L16 46 L12 48 L10 52 L8 48 L4 46 L8 44 Z"/><path d="M50 40 L52 44 L56 46 L52 48 L50 52 L48 48 L44 46 L48 44 Z"/></g></svg>`);

const kawungCoffeePattern = encodeURIComponent(`<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g fill="%23C7B7A3" fill-opacity="0.06"><circle cx="20" cy="10" r="4"/><circle cx="10" cy="20" r="4"/><circle cx="30" cy="20" r="4"/><circle cx="20" cy="30" r="4"/><ellipse cx="20" cy="20" rx="3" ry="6"/></g></svg>`);

const kawungPattern = encodeURIComponent(`<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g fill="%23C9A84C" fill-opacity="0.05"><circle cx="20" cy="10" r="4"/><circle cx="10" cy="20" r="4"/><circle cx="30" cy="20" r="4"/><circle cx="20" cy="30" r="4"/><ellipse cx="20" cy="20" rx="3" ry="6"/></g></svg>`);

const gorgaPattern = encodeURIComponent(`<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><g fill="%23C9A84C" fill-opacity="0.05"><path d="M0 0 L20 0 L20 10 L10 10 L10 20 L0 20 Z"/><path d="M40 0 L60 0 L60 10 L50 10 L50 20 L40 20 Z"/><path d="M0 40 L20 40 L20 50 L10 50 L10 60 L0 60 Z"/><path d="M40 40 L60 40 L60 50 L50 50 L50 60 L40 60 Z"/><path d="M25 25 L35 25 L35 35 L25 35 Z"/><path d="M65 25 L75 25 L75 35 L65 35 Z"/><path d="M25 65 L35 65 L35 75 L25 75 Z"/></g></svg>`);

const kambojaPattern = encodeURIComponent(`<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="%23C9A84C" fill-opacity="0.05"><ellipse cx="30" cy="15" rx="8" ry="5" transform="rotate(-20 30 15)"/><ellipse cx="20" cy="25" rx="8" ry="5" transform="rotate(20 20 25)"/><ellipse cx="40" cy="25" rx="8" ry="5" transform="rotate(-20 40 25)"/><circle cx="30" cy="30" r="3"/></g></svg>`);

const arabesquePattern = encodeURIComponent(`<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="%23C9A84C" fill-opacity="0.06"><path d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/></g></svg>`);

const daunPattern = encodeURIComponent(`<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="%23C9A84C" fill-opacity="0.05"><path d="M30 5 Q35 15 30 25 Q25 15 30 5Z"/><path d="M15 30 Q25 25 25 35 Q15 40 15 30Z"/><path d="M45 30 Q35 25 35 35 Q45 40 45 30Z"/><path d="M30 45 Q25 35 30 30 Q35 35 30 45Z"/></g></svg>`);

const gonjongPattern = encodeURIComponent(`<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><g fill="%23C9A84C" fill-opacity="0.05"><path d="M40 5 Q55 15 55 25 L55 30 L50 30 L50 25 Q50 18 40 10 Q30 18 30 25 L30 30 L25 30 L25 25 Q25 15 40 5Z"/><rect x="25" y="30" width="30" height="5" rx="1"/><rect x="30" y="35" width="20" height="20" rx="1"/></g></svg>`);

const ombakPattern = encodeURIComponent(`<svg width="100" height="40" viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg"><g fill="%23C9A84C" fill-opacity="0.04"><path d="M0 20 Q25 5 50 20 Q75 35 100 20 L100 40 L0 40Z"/><path d="M0 30 Q25 15 50 30 Q75 45 100 30 L100 40 L0 40Z" fill-opacity="0.03"/></g></svg>`);

const songketPattern = encodeURIComponent(`<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g fill="%23FFD700" fill-opacity="0.06"><path d="M0 0 L10 0 L10 5 L5 5 L5 10 L0 10 Z"/><path d="M20 0 L30 0 L30 5 L25 5 L25 10 L20 10 Z"/><path d="M0 20 L10 20 L10 25 L5 25 L5 30 L0 30 Z"/><path d="M20 20 L30 20 L30 25 L25 25 L25 30 L20 30 Z"/><path d="M10 10 L20 10 L20 20 L10 20 Z" fill-opacity="0.04"/></g></svg>`);

const sakuraPattern = encodeURIComponent(`<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="%23C9A84C" fill-opacity="0.05"><ellipse cx="30" cy="20" rx="5" ry="8" transform="rotate(-30 30 20)"/><ellipse cx="30" cy="20" rx="5" ry="8" transform="rotate(30 30 20)"/><ellipse cx="30" cy="20" rx="5" ry="8" transform="rotate(90 30 20)"/><ellipse cx="30" cy="20" rx="5" ry="8" transform="rotate(150 30 20)"/><circle cx="30" cy="20" r="3"/></g></svg>`);

const nagaPattern = encodeURIComponent(`<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="%23C9A84C" fill-opacity="0.05"><path d="M30 5 Q40 10 40 20 Q40 25 35 30 Q30 35 30 40 Q30 35 25 30 Q20 25 20 20 Q20 10 30 5Z"/><circle cx="30" cy="45" r="5"/></g></svg>`);


export const adatThemes: Record<AdatType, ThemeVariables> = {
  /* ─── JAWA: Dark Gold Javanese — Ivory/Cream BG + Dark Brown Text + Gold Accent
      Inspired by King Invitation "Tema Adat Jawa" — the "dark gold" aesthetic.
      Cream/ivory aged paper background with dark brown text and metallic gold accents.
      Black-on-cream batik patterns (kawung, parang, truntum) with wayang figures.
      "Mewah tapi tidak semewah harganya" — luxurious yet affordable. ─── */
  jawa: {
    '--inv-primary': '#3A2A1A',       // Dark Brown — headings, primary text
    '--inv-primary-dark': '#2A1A0A',   // Very dark brown — footer emphasis
    '--inv-primary-light': '#5D4A3A',  // Medium brown — secondary elements
    '--inv-accent': '#D4AF37',         // Metallic Gold — ornamental borders, dividers, highlights
    '--inv-accent-soft': '#D4AF3740',  // Gold with alpha — subtle accents
    '--inv-bg': '#F5F0E6',             // Warm Ivory — MAIN BACKGROUND (aged paper feel)
    '--inv-bg-pattern': '#EDE7D9',     // Slightly darker ivory — section bg alternation
    '--inv-text': '#3A2A1A',           // Dark Brown — PRIMARY TEXT on light bg
    '--inv-text-muted': '#5D4A3A',     // Muted Brown — secondary/muted text
    '--inv-pattern-url': `url("data:image/svg+xml,${batikParangJawaPattern}")`,
    '--inv-pattern-opacity': '1',
    '--inv-border-color': '#D4AF37',   // Gold borders
    '--inv-ornament-fill': '#3A2A1A',  // Dark brown — ornament fills (wayang, batik borders)
    '--inv-footer-bg': '#3A2A1A',      // Dark Brown — footer
    '--inv-envelope-bg': '#F5F0E6',     // Warm Ivory — envelope (matching main)
    '--inv-envelope-accent': '#D4AF37', // Gold — envelope accents
  },

  /* ─── SUNDA: Daun Kalapa, Hijau-Gold ─── */
  sunda: {
    '--inv-primary': '#2D5016',
    '--inv-primary-dark': '#1E3A0E',
    '--inv-primary-light': '#4A7C2E',
    '--inv-accent': '#C9A84C',
    '--inv-accent-soft': '#C9A84C40',
    '--inv-bg': '#FAFDF5',
    '--inv-bg-pattern': '#F5FAEF',
    '--inv-text': '#1A2E0F',
    '--inv-text-muted': '#3D5C2A',
    '--inv-pattern-url': `url("data:image/svg+xml,${daunPattern}")`,
    '--inv-pattern-opacity': '1',
    '--inv-border-color': '#C9A84C',
    '--inv-ornament-fill': '#C9A84C',
    '--inv-footer-bg': '#2D5016',
    '--inv-envelope-bg': '#2D5016',
    '--inv-envelope-accent': '#C9A84C',
  },

  /* ─── BATAK: Gorga, Ungu-Gold ─── */
  batak: {
    '--inv-primary': '#1A0A2E',
    '--inv-primary-dark': '#0F0620',
    '--inv-primary-light': '#3D1C56',
    '--inv-accent': '#C9A84C',
    '--inv-accent-soft': '#C9A84C40',
    '--inv-bg': '#FAF5FF',
    '--inv-bg-pattern': '#F5EFFA',
    '--inv-text': '#1A0A2E',
    '--inv-text-muted': '#3D2060',
    '--inv-pattern-url': `url("data:image/svg+xml,${gorgaPattern}")`,
    '--inv-pattern-opacity': '1',
    '--inv-border-color': '#C9A84C',
    '--inv-ornament-fill': '#C9A84C',
    '--inv-footer-bg': '#1A0A2E',
    '--inv-envelope-bg': '#1A0A2E',
    '--inv-envelope-accent': '#C9A84C',
  },

  /* ─── BALI: Kamboja, Hijau Tropical-Gold ─── */
  bali: {
    '--inv-primary': '#1A472A',
    '--inv-primary-dark': '#0F2E1B',
    '--inv-primary-light': '#2D6A4F',
    '--inv-accent': '#C9A84C',
    '--inv-accent-soft': '#C9A84C40',
    '--inv-bg': '#F5FFF5',
    '--inv-bg-pattern': '#EFFAEC',
    '--inv-text': '#1A2E14',
    '--inv-text-muted': '#2D5A3A',
    '--inv-pattern-url': `url("data:image/svg+xml,${kambojaPattern}")`,
    '--inv-pattern-opacity': '1',
    '--inv-border-color': '#C9A84C',
    '--inv-ornament-fill': '#C9A84C',
    '--inv-footer-bg': '#1A472A',
    '--inv-envelope-bg': '#1A472A',
    '--inv-envelope-accent': '#C9A84C',
  },

  /* ─── ARAB: Arabesque, Biru Gelap-Gold ─── */
  arab: {
    '--inv-primary': '#1B3A4B',
    '--inv-primary-dark': '#0F2533',
    '--inv-primary-light': '#2E5A6E',
    '--inv-accent': '#C9A84C',
    '--inv-accent-soft': '#C9A84C40',
    '--inv-bg': '#F5F8FA',
    '--inv-bg-pattern': '#EFF5FA',
    '--inv-text': '#0F2533',
    '--inv-text-muted': '#1B3A4B',
    '--inv-pattern-url': `url("data:image/svg+xml,${arabesquePattern}")`,
    '--inv-pattern-opacity': '1',
    '--inv-border-color': '#C9A84C',
    '--inv-ornament-fill': '#C9A84C',
    '--inv-footer-bg': '#1B3A4B',
    '--inv-envelope-bg': '#1B3A4B',
    '--inv-envelope-accent': '#C9A84C',
  },

  /* ─── JEPANG: Sakura, Pink-Gold ─── */
  jepang: {
    '--inv-primary': '#C47A8B',
    '--inv-primary-dark': '#A85A6B',
    '--inv-primary-light': '#D4A0AD',
    '--inv-accent': '#C9A84C',
    '--inv-accent-soft': '#C9A84C40',
    '--inv-bg': '#FFF5F7',
    '--inv-bg-pattern': '#FAF0F2',
    '--inv-text': '#3D1A25',
    '--inv-text-muted': '#8B5060',
    '--inv-pattern-url': `url("data:image/svg+xml,${sakuraPattern}")`,
    '--inv-pattern-opacity': '1',
    '--inv-border-color': '#C9A84C',
    '--inv-ornament-fill': '#C9A84C',
    '--inv-footer-bg': '#C47A8B',
    '--inv-envelope-bg': '#C47A8B',
    '--inv-envelope-accent': '#C9A84C',
  },

  /* ─── CHINA: Naga Merah, Merah-Gold ─── */
  china: {
    '--inv-primary': '#8B0000',
    '--inv-primary-dark': '#5C0000',
    '--inv-primary-light': '#CC0000',
    '--inv-accent': '#C9A84C',
    '--inv-accent-soft': '#C9A84C40',
    '--inv-bg': '#FFF8F0',
    '--inv-bg-pattern': '#FAF0E8',
    '--inv-text': '#2D0A0A',
    '--inv-text-muted': '#8B2020',
    '--inv-pattern-url': `url("data:image/svg+xml,${nagaPattern}")`,
    '--inv-pattern-opacity': '1',
    '--inv-border-color': '#C9A84C',
    '--inv-ornament-fill': '#C9A84C',
    '--inv-footer-bg': '#8B0000',
    '--inv-envelope-bg': '#8B0000',
    '--inv-envelope-accent': '#C9A84C',
  },

  /* ─── MINANG: Rumah Gadang, Coklat-Gold ─── */
  minang: {
    '--inv-primary': '#8B4513',
    '--inv-primary-dark': '#5C2D0E',
    '--inv-primary-light': '#A0522D',
    '--inv-accent': '#C9A84C',
    '--inv-accent-soft': '#C9A84C40',
    '--inv-bg': '#FFFAF5',
    '--inv-bg-pattern': '#FAF0E5',
    '--inv-text': '#2D1508',
    '--inv-text-muted': '#6B3A1A',
    '--inv-pattern-url': `url("data:image/svg+xml,${gonjongPattern}")`,
    '--inv-pattern-opacity': '1',
    '--inv-border-color': '#C9A84C',
    '--inv-ornament-fill': '#C9A84C',
    '--inv-footer-bg': '#8B4513',
    '--inv-envelope-bg': '#8B4513',
    '--inv-envelope-accent': '#C9A84C',
  },

  /* ─── BUGIS: Kapal Phinisi, Navy-Gold ─── */
  bugis: {
    '--inv-primary': '#0D1B2A',
    '--inv-primary-dark': '#070F18',
    '--inv-primary-light': '#1B3A4B',
    '--inv-accent': '#C9A84C',
    '--inv-accent-soft': '#C9A84C40',
    '--inv-bg': '#F5F8FA',
    '--inv-bg-pattern': '#EFF3F8',
    '--inv-text': '#0D1B2A',
    '--inv-text-muted': '#2A4A60',
    '--inv-pattern-url': `url("data:image/svg+xml,${ombakPattern}")`,
    '--inv-pattern-opacity': '1',
    '--inv-border-color': '#C9A84C',
    '--inv-ornament-fill': '#C9A84C',
    '--inv-footer-bg': '#0D1B2A',
    '--inv-envelope-bg': '#0D1B2A',
    '--inv-envelope-accent': '#C9A84C',
  },

  /* ─── PALEMBANG: Songket Sriwijaya, Merah Tua-Emas ─── */
  palembang: {
    '--inv-primary': '#800020',
    '--inv-primary-dark': '#5C0015',
    '--inv-primary-light': '#A0304A',
    '--inv-accent': '#FFD700',
    '--inv-accent-soft': '#FFD70040',
    '--inv-bg': '#FFFBF0',
    '--inv-bg-pattern': '#FAF5E8',
    '--inv-text': '#2D1B14',
    '--inv-text-muted': '#5A2E15',
    '--inv-pattern-url': `url("data:image/svg+xml,${songketPattern}")`,
    '--inv-pattern-opacity': '1',
    '--inv-border-color': '#FFD700',
    '--inv-ornament-fill': '#FFD700',
    '--inv-footer-bg': '#800020',
    '--inv-envelope-bg': '#800020',
    '--inv-envelope-accent': '#FFD700',
  },
};

/* ─── Tingkat Presets ─── */
export interface TingkatPreset {
  id: DesignType;
  label: string;
  animation: 'full' | 'elegant' | 'minimal' | 'traditional' | 'contemporary' | 'natural' | 'playful';
  particleEffect: 'gold-petals' | 'soft-sparkle' | 'none' | 'falling-leaves' | 'sakura-petals' | 'float-bubbles';
  borderStyle: 'ornate-gold' | 'thin-line' | 'double-gold' | 'classic-frame' | 'geometric' | 'rough-edge' | 'watercolor';
  fontHeading: string;
  fontBody: string;
}

export const tingkatPresets: Record<DesignType, TingkatPreset> = {
  mewah: {
    id: 'mewah',
    label: 'Mewah',
    animation: 'full',
    particleEffect: 'gold-petals',
    borderStyle: 'ornate-gold',
    fontHeading: 'var(--font-playfair)',
    fontBody: 'var(--font-inter)',
  },
  simple: {
    id: 'simple',
    label: 'Simple',
    animation: 'minimal',
    particleEffect: 'none',
    borderStyle: 'thin-line',
    fontHeading: 'var(--font-inter)',
    fontBody: 'var(--font-inter)',
  },
  luxury: {
    id: 'luxury',
    label: 'Luxury',
    animation: 'elegant',
    particleEffect: 'soft-sparkle',
    borderStyle: 'double-gold',
    fontHeading: 'var(--font-playfair)',
    fontBody: 'var(--font-inter)',
  },
  classic: {
    id: 'classic',
    label: 'Classic',
    animation: 'traditional',
    particleEffect: 'none',
    borderStyle: 'classic-frame',
    fontHeading: 'var(--font-playfair)',
    fontBody: 'var(--font-inter)',
  },
  modern: {
    id: 'modern',
    label: 'Modern',
    animation: 'contemporary',
    particleEffect: 'none',
    borderStyle: 'geometric',
    fontHeading: 'var(--font-inter)',
    fontBody: 'var(--font-inter)',
  },
  rustic: {
    id: 'rustic',
    label: 'Rustic',
    animation: 'natural',
    particleEffect: 'falling-leaves',
    borderStyle: 'rough-edge',
    fontHeading: 'var(--font-playfair)',
    fontBody: 'var(--font-inter)',
  },
  bohemian: {
    id: 'bohemian',
    label: 'Bohemian',
    animation: 'playful',
    particleEffect: 'float-bubbles',
    borderStyle: 'watercolor',
    fontHeading: 'var(--font-playfair)',
    fontBody: 'var(--font-inter)',
  },
};

/* ─── Combined Theme Resolver ─── */
export interface ResolvedTheme {
  variables: ThemeVariables;
  nuansa: NuansaTextConfig;
  adat: AdatTextConfig;
  tingkat: TingkatPreset;
  adatKey: AdatType;
  nuansaKey: NuansaType;
  tingkatKey: DesignType;
}

export function resolveTheme(
  nuansa: NuansaType,
  adat: AdatType,
  tingkat: DesignType
): ResolvedTheme {
  return {
    variables: adatThemes[adat],
    nuansa: nuansaTexts[nuansa],
    adat: adatTexts[adat],
    tingkat: tingkatPresets[tingkat],
    adatKey: adat,
    nuansaKey: nuansa,
    tingkatKey: tingkat,
  };
}

/* ─── Helper: Get Kawung pattern URL for Jawa secondary sections ─── */
export function getKawungPatternUrl(): string {
  return `url("data:image/svg+xml,${kawungJawaPattern}")`;
}

/* ─── Helper: Convert theme variables to React CSS style ─── */
export function themeToStyle(variables: ThemeVariables): React.CSSProperties {
  const style: Record<string, string> = {};
  for (const [key, value] of Object.entries(variables)) {
    style[key] = value;
  }
  return style as React.CSSProperties;
}

/* ─── Helper: Get theme from template ID ─── */
export function getThemeFromTemplateId(templateId: string): ResolvedTheme | null {
  const template = getTemplateById(templateId);
  if (!template) return null;
  
  const nuansa = template.nuansa[0] || 'islam';
  const adat = template.adat[0] || 'jawa';
  const tingkat = template.design[0] || 'mewah';
  
  return resolveTheme(nuansa, adat, tingkat);
}
