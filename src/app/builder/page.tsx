"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { BuilderProvider, useBuilder } from "@/lib/builder-context";
import { StepIndicator } from "@/components/builder/step-indicator";
import { StepMempelai } from "@/components/builder/step-mempelai";
import { StepAcara } from "@/components/builder/step-acara";
import { StepPersonalisasi } from "@/components/builder/step-personalisasi";
import { StepFitur } from "@/components/builder/step-fitur";
import { StepPreview } from "@/components/builder/step-preview";
import { StepCheckout } from "@/components/builder/step-checkout";
import { LivePreview } from "@/components/builder/live-preview";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
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

function BuilderContent() {
  const { step, setData, setStep } = useBuilder();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");

  // Pre-select template from URL param and start at step 1 (Mempelai)
  useEffect(() => {
    if (templateId) {
      // Fetch template from API instead of hardcoded data
      fetch(`/api/template/${templateId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.template) {
            const t = data.template;
            setData({
              templateId: t.id,
              templateName: t.name,
              templateGradient: getGradientForTemplate(t.nuansa, t.adat),
              templateCategory: t.nuansa || "",
              nuansa: t.nuansa,
              adat: t.adat,
              tingkat: t.design,
            });
            setStep(1); // Start at Mempelai step
          }
        })
        .catch((err) => console.error('Failed to load template:', err));
    }
  }, []);

  const renderStep = () => {
    switch (step) {
      case 1: return <StepMempelai />;
      case 2: return <StepAcara />;
      case 3: return <StepPersonalisasi />;
      case 4: return <StepFitur />;
      case 5: return <StepPreview />;
      case 6: return <StepCheckout />;
      default: return <StepMempelai />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Kembali</span>
            </Link>
            <span className="font-[family-name:var(--font-playfair)] text-lg font-bold">
              Undangan<span className="gold-gradient-text">Nauka</span>
            </span>
            <div className="w-20" /> {/* Spacer */}
          </div>
          <StepIndicator />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Area */}
          <div className="flex-1 max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Live Preview Area */}
          <div className="hidden lg:flex flex-col items-center flex-shrink-0 w-[280px]">
            <LivePreview />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <BuilderProvider>
      <Suspense
        fallback={
          <div className="min-h-screen bg-background flex items-center justify-center">
            <Loader2 className="size-8 animate-spin text-[var(--gold)]" />
          </div>
        }
      >
        <BuilderContent />
      </Suspense>
    </BuilderProvider>
  );
}
