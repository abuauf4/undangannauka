"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  "RSVP Digital",
  "Buku Tamu Interaktif",
  "Galeri Foto Unlimited",
  "Musik Latar Pilihan",
  "Amplop Digital",
  "Countdown Timer",
  "Peta Lokasi Google Maps",
  "Our Story Timeline",
  "Love Quotes",
  "Bridesmaid & Groomsman",
  "Wedding Itinerary",
  "Welcome Video",
  "Personalisasi Nuansa & Adat",
  "Masa Aktif 90 Hari",
  "Share via WhatsApp",
  "Desain Premium & Elegan",
];

export function Pricing() {
  return (
    <section id="harga" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--secondary)] via-background to-[var(--secondary)]" />

      {/* Subtle decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 mb-4">
            <Crown className="size-4 text-[var(--gold)]" />
            <span className="text-sm font-medium text-[var(--gold)]">Harga Transparan</span>
          </div>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Satu Harga, <span className="gold-gradient-text">Semua Fitur</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tidak ada biaya tersembunyi, tidak ada paket bertingkat. Semua fitur premium sudah termasuk dalam satu harga.
          </p>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-lg mx-auto"
        >
          <div className="relative rounded-2xl border-2 border-[var(--gold)]/30 bg-card shadow-xl overflow-hidden">
            {/* Popular badge */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[var(--burgundy)] to-[var(--gold)] text-center py-2">
              <span className="text-sm font-bold text-[var(--ivory)] tracking-wide uppercase flex items-center justify-center gap-2">
                <Sparkles className="size-4" />
                Paling Populer
                <Sparkles className="size-4" />
              </span>
            </div>

            <div className="pt-12 pb-8 px-8 text-center">
              {/* Package name */}
              <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-foreground mb-2">
                Undangan Premium
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Semua fitur lengkap untuk momen spesial Anda
              </p>

              {/* Price */}
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-sm text-muted-foreground">Rp</span>
                <span className="font-[family-name:var(--font-playfair)] text-6xl font-bold text-[var(--burgundy)]">
                  99.000
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-8">
                per undangan &middot; sekali bayar &middot; tanpa langganan
              </p>

              {/* CTA Button */}
              <Button
                size="lg"
                asChild
                className="w-full bg-[var(--burgundy)] text-[var(--ivory)] hover:bg-[var(--gold)] hover:text-[var(--burgundy)] transition-all duration-300 text-base font-semibold h-12 shadow-lg shadow-[var(--burgundy)]/20 group"
              >
                <Link href="/builder">
                  <Zap className="size-5 mr-2 group-hover:scale-110 transition-transform" />
                  Buat Undangan Sekarang
                </Link>
              </Button>

              <p className="text-xs text-muted-foreground mt-3">
                Tidak perlu kartu kredit untuk memulai
              </p>
            </div>

            {/* Features List */}
            <div className="border-t border-border px-8 py-8 bg-muted/30">
              <p className="text-sm font-semibold text-foreground mb-4">
                Semua fitur yang Anda dapatkan:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((feature, idx) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.3 + idx * 0.03 }}
                    className="flex items-center gap-2.5"
                  >
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                      <Check className="size-3 text-[var(--gold)]" />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Guarantee */}
            <div className="px-8 py-5 bg-green-50 dark:bg-green-900/10 border-t border-green-200 dark:border-green-800">
              <div className="flex items-center justify-center gap-2">
                <Check className="size-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                  Garansi 100% uang kembali jika tidak puas
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ teaser */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          Masih ragu? Cek <a href="#faq" className="text-[var(--gold)] hover:underline font-medium">FAQ</a> kami atau{' '}
          <a href="https://wa.me/6289655592925" target="_blank" rel="noopener noreferrer" className="text-[var(--gold)] hover:underline font-medium">
            hubungi via WhatsApp
          </a>
        </motion.p>
      </div>
    </section>
  );
}
