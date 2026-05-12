"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap, Shield, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTABanner() {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[var(--burgundy)]" />

      {/* Decorative pattern */}
      <div className="absolute inset-0 arabesque-bg opacity-50" />

      {/* Gold gradient overlays */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />

      {/* Floating decorative elements */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-8 left-[10%] text-[var(--gold)]/10 text-6xl font-serif select-none"
      >
        &#10045;
      </motion.div>
      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 right-[10%] text-[var(--gold)]/10 text-6xl font-serif select-none"
      >
        &#10045;
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-8">
            <div className="flex items-center gap-1.5 text-[var(--ivory)]/70">
              <Zap className="size-4 text-[var(--gold)]" />
              <span className="text-xs sm:text-sm">5 Menit Jadi</span>
            </div>
            <div className="w-px h-4 bg-[var(--gold)]/30" />
            <div className="flex items-center gap-1.5 text-[var(--ivory)]/70">
              <Shield className="size-4 text-[var(--gold)]" />
              <span className="text-xs sm:text-sm">Tanpa Biaya Tersembunyi</span>
            </div>
            <div className="w-px h-4 bg-[var(--gold)]/30" />
            <div className="flex items-center gap-1.5 text-[var(--ivory)]/70">
              <Heart className="size-4 text-[var(--gold)]" />
              <span className="text-xs sm:text-sm">1,000+ Terkirim</span>
            </div>
          </div>

          {/* Main CTA text */}
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--ivory)] mb-3 leading-tight">
            Buat Undangan Impian Anda{" "}
            <span className="gold-gradient-text">Sekarang</span>
          </h2>

          <p className="text-[var(--ivory)]/70 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Semua template premium, semua fitur lengkap — cuma{" "}
            <span className="font-bold text-[var(--gold)]">Rp 99.000</span>.
            Sekali bayar, tanpa langganan. Mulai buat sekarang dan bagikan ke tamu dalam hitungan menit.
          </p>

          {/* Price highlight */}
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-[var(--gold)]/30 rounded-full px-6 py-3 mb-8">
            <Sparkles className="size-5 text-[var(--gold)]" />
            <span className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold text-[var(--gold)]">
              Rp 99.000
            </span>
            <span className="text-[var(--ivory)]/60 text-sm">/ undangan</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="bg-[var(--gold)] text-[var(--burgundy)] hover:bg-[var(--ivory)] transition-all duration-300 text-base font-semibold h-12 px-8 shadow-lg shadow-[var(--gold)]/20 group"
            >
              <Link href="/builder">
              Buat Undangan Sekarang
              <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-[var(--ivory)]/30 text-[var(--ivory)] hover:bg-[var(--ivory)]/10 hover:text-[var(--ivory)] transition-all duration-300 text-base h-12 px-8"
              onClick={() => document.getElementById("fitur")?.scrollIntoView({ behavior: "smooth" })}
            >
              Lihat Fitur Lengkap
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
