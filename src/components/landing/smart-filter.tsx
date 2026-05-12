"use client";

import { useState, useRef, useEffect, useSyncExternalStore, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Eye,
  CheckCircle2,
  Wand2,
  ArrowRight,
  MoonStar,
  Globe2,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  nuansaOptions,
  adatOptions,
  designOptions,
  type NuansaType,
  type AdatType,
  type DesignType,
  type FilterChoice,
  type CoverData,
  type InnerData,
} from "@/lib/template-data.tsx";

/* ─── DB Template type (from API) ─── */
interface DbTemplate {
  id: string;
  name: string;
  description: string | null;
  nuansa: string;
  adat: string;
  design: string;
  config: Record<string, unknown>;
  isDefault: boolean;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

/* ─── Recommendation type for display ─── */
interface TemplateRecommendation {
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

/* ─── Gradient map ─── */
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
    mewah: 'Premium', luxury: 'Luxury', classic: 'Klasik',
    modern: 'Modern', simple: 'Minimalis', rustic: 'Rustic', bohemian: 'Bohemian',
  };
  return badges[design] || 'Baru';
}

/* ─── Cover data based on nuansa ─── */
function getCoverForTemplate(nuansa: string): CoverData {
  if (nuansa === 'islam') {
    return { greeting: "Bismillahirrahmanirrahim", names: "Ahmad & Fatimah", date: "12 Rajab 1447 H", ornament: "\uFDFA" };
  }
  return { greeting: "Om Swastiastu", names: "Arjun & Sinta", date: "15 Juni 2026", ornament: "\u2727" };
}

/* ─── Inner data based on nuansa ─── */
function getInnerForTemplate(nuansa: string): InnerData {
  if (nuansa === 'islam') {
    return { verse: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan dari jenismu sendiri", parents: "Bpk. H. Sulaiman & Ibu Hj. Aminah\nBpk. H. Abdullah & Ibu Hj. Khadijah", event: "Akad Nikah" };
  }
  return { verse: "Cinta bukan saling menatap, tapi saling melihat ke arah yang sama", parents: "Bpk. Arif & Ibu Sari\nBpk. Budi & Ibu Dewi", event: "Resepsi" };
}

/* ─── Map DB template to recommendation format ─── */
function mapToRecommendation(t: DbTemplate): TemplateRecommendation {
  return {
    id: t.id,
    name: t.name,
    nuansa: [t.nuansa as NuansaType],
    adat: [t.adat as AdatType],
    design: [t.design as DesignType],
    gradient: getGradientForTemplate(t.nuansa, t.adat),
    description: t.description || `Template ${t.adat.charAt(0).toUpperCase() + t.adat.slice(1)} dengan nuansa ${t.nuansa === 'islam' ? 'Islami' : 'Umum'}`,
    badge: getBadgeForTemplate(t.isDefault, t.design),
    previewIcon: <MoonStar className="size-4" />,
    cover: getCoverForTemplate(t.nuansa),
    inner: getInnerForTemplate(t.nuansa),
  };
}

/* ─── Fetch and score recommendations from API ─── */
async function fetchRecommendations(nuansa: NuansaType, adat: AdatType, design: DesignType): Promise<TemplateRecommendation[]> {
  try {
    const res = await fetch("/api/template");
    if (!res.ok) return [];
    const data = await res.json();
    const templates = (data.templates as DbTemplate[]).map(mapToRecommendation);
    // Score templates based on user's filter choices
    const scored = templates.map((template) => {
      let score = 0;
      if (template.nuansa.includes(nuansa)) score += 40;
      if (template.adat.includes(adat)) score += 35;
      if (template.design.includes(design)) score += 25;
      return { template, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 6).map((s) => s.template);
  } catch {
    return [];
  }
}

/* ─── Gold Particles (reused from Hero) ─── */
function GoldParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      fadeDirection: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        fadeDirection: Math.random() > 0.5 ? 1 : -1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += p.fadeDirection * 0.003;
        if (p.opacity >= 0.7) p.fadeDirection = -1;
        if (p.opacity <= 0.1) p.fadeDirection = 1;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 168, 76, ${p.opacity})`;
        ctx.fill();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}

/* ─── Step Indicator ─── */
function StepIndicator({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <motion.div
            animate={{
              scale: i + 1 === currentStep ? 1.1 : 1,
              backgroundColor:
                i + 1 <= currentStep
                  ? "var(--burgundy)"
                  : "var(--muted)",
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white transition-colors"
          >
            {i + 1 < currentStep ? (
              <CheckCircle2 className="size-4" />
            ) : (
              i + 1
            )}
          </motion.div>
          {i < totalSteps - 1 && (
            <div
              className="w-8 h-0.5 rounded-full transition-colors"
              style={{
                backgroundColor:
                  i + 1 < currentStep
                    ? "var(--burgundy)"
                    : "var(--muted-foreground)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Selection Card ─── */
function SelectionCard({
  choice,
  isSelected,
  onClick,
  index,
}: {
  choice: FilterChoice;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={onClick}
      className={`relative w-full text-left p-4 rounded-xl border-2 transition-all duration-300 group cursor-pointer ${
        isSelected
          ? "border-[var(--gold)] bg-[var(--gold)]/10 shadow-lg shadow-[var(--gold)]/10"
          : "border-border hover:border-[var(--gold)]/50 hover:bg-[var(--gold)]/5"
      }`}
    >
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2"
        >
          <CheckCircle2 className="size-5 text-[var(--gold)]" />
        </motion.div>
      )}
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0 mt-0.5">{choice.emoji}</span>
        <div className="min-w-0">
          <div
            className={`font-semibold text-base ${
              isSelected ? "text-[var(--gold)]" : "text-foreground"
            }`}
          >
            {choice.label}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            {choice.description}
          </div>
        </div>
      </div>
    </motion.button>
  );
}

/* ─── iPhone Mockup (compact for recommendation) ─── */
function MiniIPhone({ gradient, children, isLeft = true }: { gradient: string; children: React.ReactNode; isLeft?: boolean }) {
  return (
    <div className={`relative ${isLeft ? "z-20" : "z-10 -ml-4 md:-ml-6"} transition-transform duration-300 group-hover:${isLeft ? "-translate-y-1" : "translate-y-1"}`}>
      <div className="relative w-[100px] sm:w-[115px] md:w-[125px] aspect-[9/19.5] bg-gray-900 rounded-[16px] sm:rounded-[18px] p-[2px] shadow-xl border border-gray-700/50">
        <div className={`relative w-full h-full rounded-[14px] sm:rounded-[16px] overflow-hidden bg-gradient-to-br ${gradient}`}>
          <div className="absolute top-[4px] left-1/2 -translate-x-1/2 w-[38px] sm:w-[44px] h-[10px] sm:h-[12px] bg-black rounded-full z-20" />
          <div className="absolute inset-0 pt-[20px] pb-[6px] px-[6px] overflow-hidden">
            {children}
          </div>
          <div className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[38px] sm:w-[44px] h-[2px] bg-white/30 rounded-full z-20" />
        </div>
      </div>
    </div>
  );
}

/* ─── Mini Cover Screen ─── */
function MiniCoverScreen({ content }: { content: CoverData }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-white px-1">
      <div className="text-[6px] sm:text-[7px] opacity-60 mb-0.5">{content.ornament}</div>
      <div className="font-[family-name:var(--font-playfair)] text-[5px] sm:text-[6px] md:text-[7px] opacity-80 mb-1 tracking-wide">{content.greeting}</div>
      <div className="w-6 sm:w-7 h-px bg-white/40 mb-1" />
      <div className="font-[family-name:var(--font-playfair)] text-[7px] sm:text-[9px] md:text-[10px] font-bold leading-tight mb-0.5">{content.names}</div>
      <div className="text-[4px] sm:text-[5px] opacity-70 tracking-wider">{content.date}</div>
    </div>
  );
}

/* ─── Mini Inner Screen ─── */
function MiniInnerScreen({ content }: { content: InnerData }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-white px-1 overflow-hidden">
      <div className="text-[3.5px] sm:text-[4px] md:text-[5px] leading-relaxed opacity-80 mb-1.5 max-w-[85px] sm:max-w-[100px] line-clamp-3">
        &ldquo;{content.verse}&rdquo;
      </div>
      <div className="w-5 sm:w-6 h-px bg-white/40 mb-1.5" />
      <div className="text-[3px] sm:text-[3.5px] md:text-[4px] opacity-70 leading-relaxed whitespace-pre-line mb-1">{content.parents}</div>
      <div className="font-[family-name:var(--font-playfair)] text-[4.5px] sm:text-[5.5px] md:text-[6px] font-semibold tracking-wider border border-white/30 px-1.5 py-0.5 rounded-full">{content.event}</div>
    </div>
  );
}

/* ─── Template Recommendation Card ─── */
function RecommendationCard({
  template,
  index,
}: {
  template: TemplateRecommendation;
  index: number;
}) {
  const router = useRouter();
  const matchScore = index === 0 ? 98 : index === 1 ? 95 : index === 2 ? 92 : 88 + Math.floor(Math.random() * 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-[var(--gold)] hover:shadow-2xl hover:shadow-[var(--gold)]/10 transition-all duration-500"
    >
      {/* Match badge */}
      {index === 0 && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-[var(--gold)] text-white border-none shadow-md text-xs">
            <Sparkles className="size-3 mr-1" /> Paling Cocok
          </Badge>
        </div>
      )}

      {/* iPhone Mockup Area */}
      <div className="relative bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 pt-6 pb-4 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, var(--gold) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

        <div className="relative flex items-center justify-center gap-0">
          <MiniIPhone gradient={template.gradient} isLeft={true}>
            <MiniCoverScreen content={template.cover} />
          </MiniIPhone>
          <MiniIPhone gradient={template.gradient} isLeft={false}>
            <MiniInnerScreen content={template.inner} />
          </MiniIPhone>
        </div>

        <div className="flex justify-center gap-6 sm:gap-8 mt-2">
          <span className="text-[8px] sm:text-[9px] text-muted-foreground">Buka</span>
          <span className="text-[8px] sm:text-[9px] text-muted-foreground">Isi</span>
        </div>

        {/* Match score */}
        <div className="absolute top-3 right-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm">
          {matchScore}% cocok
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button
            size="sm"
            className="bg-white/90 text-[var(--burgundy)] hover:bg-[var(--gold)] hover:text-white shadow-lg text-xs"
            onClick={(e) => { e.stopPropagation(); router.push(`/template/${template.id}`); }}
          >
            <Eye className="size-3.5 mr-1.5" />
            Preview
          </Button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[var(--gold)] flex-shrink-0">{template.previewIcon}</span>
            <h3 className="font-[family-name:var(--font-playfair)] text-base font-semibold truncate">
              {template.name}
            </h3>
          </div>
          <Badge
            variant="secondary"
            className="bg-[var(--gold)]/10 text-[var(--gold)] border-[var(--gold)]/20 text-[10px] flex-shrink-0"
          >
            {template.badge}
          </Badge>
        </div>
        <p className="text-[11px] text-muted-foreground line-clamp-2 mb-3">
          {template.description}
        </p>

        {/* Price */}
        <div className="pt-2.5 border-t border-border/60 flex items-center justify-between">
          <span className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[var(--burgundy)]">
            Rp 99.000
          </span>
          <Button
            size="sm"
            className="bg-[var(--burgundy)] text-[var(--ivory)] hover:bg-[var(--gold)] hover:text-[var(--burgundy)] transition-all duration-300 text-[11px] h-7"
            onClick={(e) => { e.stopPropagation(); router.push(`/template/${template.id}`); }}
          >
            Lihat Contoh
            <Eye className="size-3 ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Step Labels ─── */
const stepLabels = [
  {
    title: "Nuansa Undangan",
    subtitle: "Pilih nuansa yang sesuai dengan keinginan Anda",
    icon: <MoonStar className="size-5" />,
  },
  {
    title: "Adat & Budaya",
    subtitle: "Adat apa yang akan mewarnai undangan Anda?",
    icon: <Globe2 className="size-5" />,
  },
  {
    title: "Gaya Desain",
    subtitle: "Pilih gaya desain yang Anda inginkan",
    icon: <Palette className="size-5" />,
  },
];

/* ─── Main Smart Filter Component ─── */
interface SmartFilterProps {
  onOpenDemo?: () => void;
}

type FilterStep = "intro" | "step1" | "step2" | "step3" | "result";

export function SmartFilter({ onOpenDemo }: SmartFilterProps) {
  const loaded = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [step, setStep] = useState<FilterStep>("intro");
  const [nuansa, setNuansa] = useState<NuansaType | null>(null);
  const [adat, setAdat] = useState<AdatType | null>(null);
  const [design, setDesign] = useState<DesignType | null>(null);
  const [recommendations, setRecommendations] = useState<TemplateRecommendation[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  const handleStartFilter = useCallback(() => {
    setStep("step1");
  }, []);

  const handleChooseSelf = useCallback(() => {
    const el = document.getElementById("template");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleNext = useCallback(() => {
    if (step === "step1" && nuansa) {
      setStep("step2");
    } else if (step === "step2" && adat) {
      setStep("step3");
    } else if (step === "step3" && design) {
      setLoadingRecs(true);
      fetchRecommendations(nuansa!, adat!, design!).then((recs) => {
        setRecommendations(recs);
        setStep("result");
        setLoadingRecs(false);
      });
    }
  }, [step, nuansa, adat, design]);

  const handleBack = useCallback(() => {
    if (step === "step1") {
      setStep("intro");
    } else if (step === "step2") {
      setStep("step1");
    } else if (step === "step3") {
      setStep("step2");
    } else if (step === "result") {
      setStep("step3");
    }
  }, [step]);

  const handleReset = useCallback(() => {
    setStep("intro");
    setNuansa(null);
    setAdat(null);
    setDesign(null);
    setRecommendations([]);
  }, []);

  useEffect(() => {
    if (step === "step1" && nuansa) {
      const timer = setTimeout(() => setStep("step2"), 500);
      return () => clearTimeout(timer);
    }
  }, [step, nuansa]);

  useEffect(() => {
    if (step === "step2" && adat) {
      const timer = setTimeout(() => setStep("step3"), 500);
      return () => clearTimeout(timer);
    }
  }, [step, adat]);

  useEffect(() => {
    if (step === "step3" && design) {
      const timer = setTimeout(() => {
        setLoadingRecs(true);
        fetchRecommendations(nuansa!, adat!, design!).then((recs) => {
          setRecommendations(recs);
          setStep("result");
          setLoadingRecs(false);
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [step, design, nuansa, adat]);

  const getCurrentOptions = () => {
    if (step === "step1") return nuansaOptions;
    if (step === "step2") return adatOptions;
    if (step === "step3") return designOptions;
    return [];
  };

  const getCurrentValue = () => {
    if (step === "step1") return nuansa;
    if (step === "step2") return adat;
    if (step === "step3") return design;
    return null;
  };

  const handleSelect = (value: string) => {
    if (step === "step1") setNuansa(value as NuansaType);
    else if (step === "step2") setAdat(value as AdatType);
    else if (step === "step3") setDesign(value as DesignType);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--ivory)] via-[var(--ivory)] to-[var(--secondary)]" />
      <GoldParticles />

      <div className="absolute top-8 left-8 w-24 h-24 border-t-2 border-l-2 border-[var(--gold)]/30 rounded-tl-lg" />
      <div className="absolute top-8 right-8 w-24 h-24 border-t-2 border-r-2 border-[var(--gold)]/30 rounded-tr-lg" />
      <div className="absolute bottom-8 left-8 w-24 h-24 border-b-2 border-l-2 border-[var(--gold)]/30 rounded-bl-lg" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-b-2 border-r-2 border-[var(--gold)]/30 rounded-br-lg" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <AnimatePresence mode="wait">
          {/* ─── INTRO SCREEN ─── */}
          {step === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 30 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={loaded ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 mb-8"
              >
                <Wand2 className="size-4 text-[var(--gold)]" />
                <span className="text-sm font-medium text-[var(--gold)]">
                  Smart Filter - Temukan Template Impianmu
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-4"
              >
                Apakah Anda Mau Kami Bantu
                <br />
                <span className="gold-gradient-text">Carikan Design Undangan?</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-base sm:text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed"
              >
                Jawab 3 pertanyaan singkat dan kami akan merekomendasikan template
                yang paling cocok untuk undangan pernikahan impian Anda
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Button
                  size="lg"
                  onClick={handleStartFilter}
                  className="bg-[var(--burgundy)] text-[var(--ivory)] hover:bg-[var(--gold)] hover:text-[var(--burgundy)] transition-all duration-300 shadow-lg text-base px-10 h-14 btn-royal"
                >
                  <Sparkles className="size-5 mr-2" />
                  Mau, Bantu Saya!
                  <ChevronRight className="size-5 ml-1" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleChooseSelf}
                  className="border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--burgundy)] transition-all duration-300 text-base px-10 h-14"
                >
                  Pilih Sendiri
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={loaded ? { opacity: 1 } : {}}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-[var(--gold)]" />
                  <span>Gratis & Tanpa Komitmen</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-[var(--gold)]" />
                  <span>Hanya 30 Detik</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-[var(--gold)]" />
                  <span>Rekomendasi Akurat</span>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ─── FILTER STEPS ─── */}
          {(step === "step1" || step === "step2" || step === "step3") && (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <StepIndicator
                currentStep={step === "step1" ? 1 : step === "step2" ? 2 : 3}
                totalSteps={3}
              />

              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--burgundy)]/10 text-[var(--burgundy)] mb-4">
                  {stepLabels[step === "step1" ? 0 : step === "step2" ? 1 : 2].icon}
                </div>
                <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold mb-2">
                  {stepLabels[step === "step1" ? 0 : step === "step2" ? 1 : 2].title}
                </h2>
                <p className="text-muted-foreground">
                  {stepLabels[step === "step1" ? 0 : step === "step2" ? 1 : 2].subtitle}
                </p>
              </div>

              <div
                className={`grid gap-3 max-h-[50vh] overflow-y-auto px-1 pb-2 ${
                  step === "step1"
                    ? "grid-cols-1 sm:grid-cols-2 max-w-lg mx-auto"
                    : step === "step2"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-3xl mx-auto"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-3xl mx-auto"
                }`}
              >
                {getCurrentOptions().map((choice, index) => (
                  <SelectionCard
                    key={choice.value}
                    choice={choice}
                    isSelected={getCurrentValue() === choice.value}
                    onClick={() => handleSelect(choice.value)}
                    index={index}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between mt-8 max-w-lg mx-auto">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="size-4 mr-1" />
                  Kembali
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!getCurrentValue()}
                  className="bg-[var(--burgundy)] text-[var(--ivory)] hover:bg-[var(--gold)] hover:text-[var(--burgundy)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Lanjut
                  <ChevronRight className="size-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ─── RESULT SCREEN ─── */}
          {step === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="text-center mb-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--gold)]/20 mb-6"
                >
                  <Sparkles className="size-8 text-[var(--gold)]" />
                </motion.div>
                <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold mb-2">
                  Rekomendasi <span className="gold-gradient-text">Untuk Anda</span>
                </h2>
                <p className="text-muted-foreground">
                  Berdasarkan pilihan Anda, ini template yang paling cocok
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {recommendations.map((template, index) => (
                  <RecommendationCard
                    key={template.id}
                    template={template}
                    index={index}
                  />
                ))}
              </div>

              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--burgundy)] transition-all duration-300"
                >
                  Coba Lagi dengan Pilihan Berbeda
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
