"use client";

import { useState, useEffect } from "react";
import { useBuilder } from "@/lib/builder-context";
import { motion } from "framer-motion";
import { Check, Loader2, MoonStar } from "lucide-react";

/* ─── DB Template type (from API) ─── */
interface DbTemplate {
  id: string;
  name: string;
  description: string | null;
  nuansa: string;
  adat: string;
  design: string;
  isDefault: boolean;
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

export function StepTemplate() {
  const { data, setData, setStep } = useBuilder();
  const [templates, setTemplates] = useState<DbTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await fetch("/api/template");
        if (res.ok) {
          const data = await res.json();
          setTemplates(data.templates);
        }
      } catch (err) {
        console.error("Failed to fetch templates:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTemplates();
  }, []);

  const handleSelect = (t: DbTemplate) => {
    setData({
      templateId: t.id,
      templateName: t.name,
      templateGradient: getGradientForTemplate(t.nuansa, t.adat),
      templateCategory: t.nuansa,
      nuansa: t.nuansa,
      adat: t.adat,
      tingkat: t.design,
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-[var(--gold)]" />
        <p className="text-sm text-muted-foreground mt-3">Memuat template...</p>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Belum ada template tersedia</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-foreground mb-2">
        Pilih Template
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Pilih desain undangan yang sesuai dengan tema pernikahan Anda
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-h-[60vh] overflow-y-auto pr-1">
        {templates.map((t) => {
          const isSelected = data.templateId === t.id;
          const gradient = getGradientForTemplate(t.nuansa, t.adat);
          return (
            <motion.button
              key={t.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(t)}
              className={`relative rounded-xl overflow-hidden border-2 transition-all text-left ${
                isSelected
                  ? "border-[var(--gold)] shadow-lg shadow-[var(--gold)]/20 ring-2 ring-[var(--gold)]/30"
                  : "border-border hover:border-[var(--gold)]/50"
              }`}
            >
              {/* Preview gradient */}
              <div className={`aspect-[3/4] bg-gradient-to-br ${gradient} relative`}>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-2">
                  <span className="text-[var(--gold)] mb-2"><MoonStar className="size-4" /></span>
                  <span className="font-[family-name:var(--font-playfair)] text-sm font-bold leading-tight">{t.name}</span>
                </div>
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[var(--gold)] flex items-center justify-center">
                    <Check className="size-4 text-[var(--burgundy)]" />
                  </div>
                )}
              </div>
              {/* Label */}
              <div className="p-2 bg-card">
                <p className="text-xs font-medium truncate">{t.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--gold)]/10 text-[var(--gold)]">
                    {t.adat.charAt(0).toUpperCase() + t.adat.slice(1)}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--burgundy)]/10 text-[var(--burgundy)]">
                    {t.nuansa === 'islam' ? 'Islami' : 'Umum'}
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Next button */}
      <div className="mt-6 flex justify-end">
        <button
          disabled={!data.templateId}
          onClick={() => setStep(2)}
          className="px-6 py-2.5 rounded-lg bg-[var(--burgundy)] text-[var(--ivory)] font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--gold)] hover:text-[var(--burgundy)] transition-all"
        >
          Lanjut →
        </button>
      </div>
    </div>
  );
}
