import { MoonStar } from "lucide-react";

/* ─── Filter Data Types ─── */
export type NuansaType = "islam" | "umum";
export type AdatType =
  | "jawa"
  | "sunda"
  | "batak"
  | "bali"
  | "arab"
  | "jepang"
  | "china"
  | "minang"
  | "bugis"
  | "palembang";
export type DesignType =
  | "mewah"
  | "simple"
  | "luxury"
  | "classic"
  | "modern"
  | "rustic"
  | "bohemian";

export interface FilterChoice {
  value: string;
  label: string;
  emoji: string;
  description: string;
}

export interface CoverData {
  greeting: string;
  names: string;
  date: string;
  ornament: string;
}

export interface InnerData {
  verse: string;
  parents: string;
  event: string;
}

export interface TemplateRecommendation {
  id: string;
  name: string;
  nuansa: NuansaType[];
  adat: AdatType[];
  design: DesignType[];
  gradient: string;
  description: string;
  badge: string;
  previewIcon: React.ReactNode;
  cover: CoverData;
  inner: InnerData;
}

/* ─── Category Data ─── */
export const nuansaOptions: FilterChoice[] = [
  {
    value: "islam",
    label: "Islam",
    emoji: "🕌",
    description:
      "Nuansa Islami dengan Assalamu'alaikum, Bismillah, ayat Al-Quran, dan doa",
  },
  {
    value: "umum",
    label: "Umum",
    emoji: "🌍",
    description: "Nuansa umum yang elegan tanpa elemen keagamaan spesifik",
  },
];

export const adatOptions: FilterChoice[] = [
  { value: "jawa", label: "Jawa", emoji: "🏛️", description: "Tradisi Jawa yang kaya adat dan filosofi" },
  { value: "sunda", label: "Sunda", emoji: "🌿", description: "Kearifan Sunda yang lembut dan harmonis" },
  { value: "batak", label: "Batak", emoji: "🏔️", description: "Gorga Batak yang megah dan penuh makna" },
  { value: "bali", label: "Bali", emoji: "🌺", description: "Sana Bali yang eksotis dan spiritual" },
  { value: "arab", label: "Arab", emoji: "✨", description: "Keanggunan budaya Arab yang mewah" },
  { value: "jepang", label: "Jepang", emoji: "🌸", description: "Sakura dan keindahan Japanese aesthetic" },
  { value: "china", label: "China", emoji: "🏮", description: "Perpaduan tradisi Tionghoa yang meriah" },
  { value: "minang", label: "Minang", emoji: "🎪", description: "Rumah Gadang dan tradisi Minangkabau" },
  { value: "bugis", label: "Bugis", emoji: "⚓", description: "Kekuatan tradisi Bugis yang gagah" },
  { value: "palembang", label: "Palembang", emoji: "🏯", description: "Keagungan tradisi Sriwijaya" },
];

export const designOptions: FilterChoice[] = [
  { value: "mewah", label: "Mewah", emoji: "💎", description: "Kemewahan total dengan detail yang grand" },
  { value: "simple", label: "Simple", emoji: "🕊️", description: "Minimalis namun tetap bermakna" },
  { value: "luxury", label: "Luxury", emoji: "👑", description: "Premium dan eksklusif, pilihan terbaik" },
  { value: "classic", label: "Classic", emoji: "📜", description: "Keabadian desain klasik yang tak lekang waktu" },
  { value: "modern", label: "Modern", emoji: "🔲", description: "Kontemporer, fresh, dan trendsetter" },
  { value: "rustic", label: "Rustic", emoji: "🍂", description: "Alami, hangat, dan penuh kesan" },
  { value: "bohemian", label: "Bohemian", emoji: "🎨", description: "Bebas, artistik, dan penuhi warna" },
];

/* ─── Template Database (1 base template — more will be added) ─── */
export const templateDatabase: TemplateRecommendation[] = [
  {
    id: "royal-islamic-jawa",
    name: "Royal Islamic Jawa",
    nuansa: ["islam"],
    adat: ["jawa"],
    design: ["mewah", "luxury", "classic"],
    gradient: "from-[#800020] via-[#5C0015] to-[#C9A84C]",
    description: "Kemewahan keraton Jawa dengan sentuhan Islami, ayat suci Al-Quran dan bismillah",
    badge: "Best Seller",
    previewIcon: <MoonStar className="size-4" />,
    cover: { greeting: "Bismillahirrahmanirrahim", names: "Ahmad & Fatimah", date: "12 Rajab 1447 H", ornament: "﷽" },
    inner: { verse: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan dari jenismu sendiri", parents: "Bpk. H. Sulaiman & Ibu Hj. Aminah\nBpk. H. Abdullah & Ibu Hj. Khadijah", event: "Akad Nikah" },
  },
];

/* ─── Recommendation Engine ─── */
export function getRecommendations(
  nuansa: NuansaType,
  adat: AdatType,
  design: DesignType
): TemplateRecommendation[] {
  const scored = templateDatabase.map((template) => {
    let score = 0;
    if (template.nuansa.includes(nuansa)) score += 40;
    if (template.adat.includes(adat)) score += 35;
    if (template.design.includes(design)) score += 25;
    return { template, score };
  });

  // With only 1 template, always return it regardless of score
  const filtered = scored.filter((s) => s.score >= 0);
  filtered.sort((a, b) => b.score - a.score);
  return filtered.slice(0, 6).map((s) => s.template);
}

/* ─── Helper to get template by ID ─── */
export function getTemplateById(id: string): TemplateRecommendation | undefined {
  return templateDatabase.find((t) => t.id === id);
}

/* ─── Helper to map template name to ID ─── */
export function getTemplateIdByName(name: string): string | undefined {
  return templateDatabase.find((t) => t.name === name)?.id;
}
