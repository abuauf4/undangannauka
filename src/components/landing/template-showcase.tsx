"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoonStar } from "lucide-react";

/* ─── DB Template type (from API) ─── */
interface DbTemplate {
  id: string;
  name: string;
  description: string | null;
  thumbnail: string | null;
  nuansa: string;
  adat: string;
  design: string;
  config: Record<string, unknown>;
  isDefault: boolean;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

/* ─── Showcase-ready template type ─── */
interface ShowcaseTemplate {
  id: string;
  name: string;
  nuansa: string[];
  adat: string[];
  design: string[];
  gradient: string;
  description: string;
  badge: string;
  previewIcon: React.ReactNode;
  cover: {
    greeting: string;
    names: string;
    date: string;
    ornament: string;
  };
  inner: {
    verse: string;
    parents: string;
    event: string;
  };
}

/* ─── Gradient map by nuansa+adat ─── */
function getGradientForTemplate(nuansa: string, adat: string): string {
  const key = `${nuansa}-${adat}`;
  const gradients: Record<string, string> = {
    'islam-jawa': 'from-[#800020] via-[#5C0015] to-[#C9A84C]',
    'islam-sunda': 'from-[#1a472a] via-[#2d6a4f] to-[#C9A84C]',
    'islam-batak': 'from-[#5C0015] via-[#8B0000] to-[#C9A84C]',
    'islam-bali': 'from-[#4a1942] via-[#800020] to-[#C9A84C]',
    'islam-arab': 'from-[#1a3c34] via-[#2d5a4e] to-[#C9A84C]',
    'umum-jawa': 'from-[#800020] via-[#5C0015] to-[#C9A84C]',
    'umum-sunda': 'from-[#2d6a4f] via-[#1a472a] to-[#D4AF37]',
    'umum-batak': 'from-[#8B0000] via-[#5C0015] to-[#D4AF37]',
  };
  return gradients[key] || 'from-[#800020] via-[#5C0015] to-[#C9A84C]';
}

/* ─── Badge based on isDefault + design ─── */
function getBadgeForTemplate(isDefault: boolean, design: string): string {
  if (isDefault) return 'Best Seller';
  const badges: Record<string, string> = {
    mewah: 'Premium',
    luxury: 'Luxury',
    classic: 'Klasik',
    modern: 'Modern',
    simple: 'Minimalis',
    rustic: 'Rustic',
    bohemian: 'Bohemian',
  };
  return badges[design] || 'Baru';
}

/* ─── Cover data based on nuansa ─── */
function getCoverForTemplate(nuansa: string): ShowcaseTemplate['cover'] {
  if (nuansa === 'islam') {
    return {
      greeting: "Bismillahirrahmanirrahim",
      names: "Ahmad & Fatimah",
      date: "12 Rajab 1447 H",
      ornament: "\uFDFA",
    };
  }
  return {
    greeting: "Om Swastiastu",
    names: "Arjun & Sinta",
    date: "15 Juni 2026",
    ornament: "\u2727",
  };
}

/* ─── Inner data based on nuansa ─── */
function getInnerForTemplate(nuansa: string): ShowcaseTemplate['inner'] {
  if (nuansa === 'islam') {
    return {
      verse: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan dari jenismu sendiri",
      parents: "Bpk. H. Sulaiman & Ibu Hj. Aminah\nBpk. H. Abdullah & Ibu Hj. Khadijah",
      event: "Akad Nikah",
    };
  }
  return {
    verse: "Cinta bukan saling menatap, tapi saling melihat ke arah yang sama",
    parents: "Bpk. Arif & Ibu Sari\nBpk. Budi & Ibu Dewi",
    event: "Resepsi",
  };
}

/* ─── Map DB template to showcase format ─── */
function mapToShowcase(t: DbTemplate): ShowcaseTemplate {
  return {
    id: t.id,
    name: t.name,
    nuansa: [t.nuansa],
    adat: [t.adat],
    design: [t.design],
    gradient: getGradientForTemplate(t.nuansa, t.adat),
    description: t.description || `Template ${t.adat.charAt(0).toUpperCase() + t.adat.slice(1)} dengan nuansa ${t.nuansa === 'islam' ? 'Islami' : 'Umum'}`,
    badge: getBadgeForTemplate(t.isDefault, t.design),
    previewIcon: <MoonStar className="size-4" />,
    cover: getCoverForTemplate(t.nuansa),
    inner: getInnerForTemplate(t.nuansa),
  };
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/* ─── iPhone Mockup Component ─── */
function IPhoneMockup({
  gradient,
  children,
  isLeft = true,
}: {
  gradient: string;
  children: React.ReactNode;
  isLeft?: boolean;
}) {
  return (
    <div
      className={`relative ${isLeft ? "z-20" : "z-10 -ml-6 md:-ml-10"} transition-transform duration-300 group-hover:${isLeft ? "-translate-y-2" : "translate-y-2"}`}
    >
      {/* iPhone frame */}
      <div className="relative w-[130px] sm:w-[150px] md:w-[160px] aspect-[9/19.5] bg-gray-900 rounded-[20px] sm:rounded-[24px] p-[2px] shadow-2xl border border-gray-700/50">
        {/* Screen */}
        <div className={`relative w-full h-full rounded-[18px] sm:rounded-[22px] overflow-hidden bg-gradient-to-br ${gradient}`}>
          {/* Dynamic Island */}
          <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[50px] sm:w-[60px] h-[14px] sm:h-[16px] bg-black rounded-full z-20" />

          {/* Screen content */}
          <div className="absolute inset-0 pt-[28px] pb-[8px] px-[8px] overflow-hidden">
            {children}
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-[4px] left-1/2 -translate-x-1/2 w-[50px] sm:w-[60px] h-[3px] bg-white/30 rounded-full z-20" />
        </div>
      </div>
    </div>
  );
}

/* ─── Cover Screen Content ─── */
function CoverScreen({ content }: { content: ShowcaseTemplate["cover"] }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-white px-1">
      {/* Ornament top */}
      <div className="text-[8px] sm:text-[10px] opacity-60 mb-1 tracking-widest">
        {content.ornament}
      </div>

      {/* Greeting */}
      <div className="font-[family-name:var(--font-playfair)] text-[7px] sm:text-[8px] md:text-[9px] opacity-80 mb-2 tracking-wide">
        {content.greeting}
      </div>

      {/* Divider */}
      <div className="w-8 sm:w-10 h-px bg-white/40 mb-2" />

      {/* Names */}
      <div className="font-[family-name:var(--font-playfair)] text-[9px] sm:text-[11px] md:text-[12px] font-bold leading-tight mb-1">
        {content.names}
      </div>

      {/* Date */}
      <div className="text-[5px] sm:text-[6px] md:text-[7px] opacity-70 tracking-wider">
        {content.date}
      </div>

      {/* Bottom ornament */}
      <div className="mt-3 w-5 sm:w-6 h-px bg-white/30" />
    </div>
  );
}

/* ─── Inner Screen Content ─── */
function InnerScreen({ content }: { content: ShowcaseTemplate["inner"] }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-white px-1 overflow-hidden">
      {/* Verse */}
      <div className="text-[4.5px] sm:text-[5.5px] md:text-[6px] leading-relaxed opacity-80 mb-2 max-w-[110px] sm:max-w-[130px] line-clamp-4">
        &ldquo;{content.verse}&rdquo;
      </div>

      {/* Divider */}
      <div className="w-6 sm:w-8 h-px bg-white/40 mb-2" />

      {/* Parents */}
      <div className="text-[3.5px] sm:text-[4.5px] md:text-[5px] opacity-70 leading-relaxed whitespace-pre-line mb-2">
        {content.parents}
      </div>

      {/* Event */}
      <div className="font-[family-name:var(--font-playfair)] text-[6px] sm:text-[7px] md:text-[8px] font-semibold tracking-wider border border-white/30 px-2 py-0.5 rounded-full">
        {content.event}
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
interface TemplateShowcaseProps {
  onOpenDemo?: () => void;
}

export function TemplateShowcase({ onOpenDemo }: TemplateShowcaseProps) {
  const router = useRouter();
  const [templates, setTemplates] = useState<ShowcaseTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await fetch("/api/template");
        if (res.ok) {
          const data = await res.json();
          const mapped = (data.templates as DbTemplate[]).map(mapToShowcase);
          setTemplates(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch templates:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTemplates();
  }, []);

  return (
    <section
      id="template"
      className="py-20 md:py-28 bg-[var(--secondary)] relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-10">
          <h2 className="section-title">
            Template <span className="gold-gradient-text">Pilihan</span>
          </h2>
          <div className="ornament-divider mt-4">
            <span className="ornament-center">&#10045;</span>
          </div>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Template premium kami — hanya{" "}
            <span className="font-semibold text-[var(--burgundy)]">Rp 99.000</span>{" "}
            dengan fitur lengkap
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-8 animate-spin text-[var(--gold)]" />
          </div>
        )}

        {/* No templates */}
        {!loading && templates.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Belum ada template tersedia</p>
          </div>
        )}

        {/* Template Cards */}
        {!loading && templates.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {templates.map((template) => (
              <motion.div
                key={template.id}
                variants={cardVariants}
                className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-[var(--gold)] hover:shadow-2xl hover:shadow-[var(--gold)]/10 transition-all duration-500"
              >
                {/* iPhone Mockup Area */}
                <div className="relative bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 pt-8 pb-6 overflow-hidden">
                  {/* Subtle grid pattern */}
                  <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: "radial-gradient(circle, var(--gold) 1px, transparent 1px)",
                    backgroundSize: "20px 20px"
                  }} />

                  {/* Two iPhones */}
                  <div className="relative flex items-center justify-center gap-0">
                    <IPhoneMockup gradient={template.gradient} isLeft={true}>
                      <CoverScreen content={template.cover} />
                    </IPhoneMockup>

                    <IPhoneMockup gradient={template.gradient} isLeft={false}>
                      <InnerScreen content={template.inner} />
                    </IPhoneMockup>
                  </div>

                  {/* Labels below phones */}
                  <div className="flex justify-center gap-8 sm:gap-12 mt-3">
                    <span className="text-[9px] sm:text-[10px] text-muted-foreground font-medium">Buka Undangan</span>
                    <span className="text-[9px] sm:text-[10px] text-muted-foreground font-medium">Isi Undangan</span>
                  </div>

                  {/* Hover overlay with button */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button
                      size="sm"
                      className="bg-white/90 text-[var(--burgundy)] hover:bg-[var(--gold)] hover:text-white shadow-lg text-xs"
                      onClick={(e) => { e.stopPropagation(); router.push(`/template/${template.id}`); }}
                    >
                      <Eye className="size-3.5 mr-1.5" />
                      Lihat Contoh
                    </Button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[var(--gold)]">{template.previewIcon}</span>
                        <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold truncate">
                          {template.name}
                        </h3>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {template.description}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-[var(--gold)]/10 text-[var(--gold)] border-[var(--gold)]/20 text-[10px] flex-shrink-0"
                    >
                      {template.badge}
                    </Badge>
                  </div>

                  {/* Price */}
                  <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between">
                    <div>
                      <span className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[var(--burgundy)]">
                        Rp 99.000
                      </span>
                      <span className="text-[10px] text-muted-foreground ml-1.5">/ undangan</span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-[var(--burgundy)] text-[var(--ivory)] hover:bg-[var(--gold)] hover:text-[var(--burgundy)] transition-all duration-300 text-xs h-8"
                      onClick={(e) => { e.stopPropagation(); router.push(`/template/${template.id}`); }}
                    >
                      Lihat Contoh
                      <Eye className="size-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* See detail link */}
        {templates.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <Button
              variant="outline"
              onClick={() => router.push(`/template/${templates[0]?.id}`)}
              className="border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--burgundy)] transition-all duration-300 group"
            >
              Lihat Detail Template
              <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
