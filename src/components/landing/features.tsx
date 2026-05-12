"use client";

import { motion } from "framer-motion";
import {
  Palette,
  MousePointerClick,
  BookOpen,
  ImageIcon,
  Share2,
  Music,
  MapPin,
  Gift,
  Clock,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "Desain Premium",
    description: "Template eksklusif dengan desain mewah dan elegan, mencerminkan beragam budaya Indonesia",
    highlight: false,
  },
  {
    icon: MousePointerClick,
    title: "Buat dalam 5 Menit",
    description: "Proses pembuatan super mudah — isi data, pilih template, langsung jadi. Tanpa skill desain",
    highlight: true,
  },
  {
    icon: BookOpen,
    title: "Buku Tamu Digital",
    description: "Tamu bisa meninggalkan ucapan, doa, dan harapan langsung di undangan digital Anda",
    highlight: false,
  },
  {
    icon: Music,
    title: "Musik Latar",
    description: "Tambahkan lagu favorit Anda sebagai pengiring saat tamu membuka undangan",
    highlight: false,
  },
  {
    icon: ImageIcon,
    title: "Galeri Foto",
    description: "Tampilkan momen pre-wedding dan foto pasangan dalam galeri yang cantik",
    highlight: false,
  },
  {
    icon: MapPin,
    title: "Lokasi Google Maps",
    description: "Embed lokasi venue langsung di undangan, tamu tinggal klik untuk navigasi",
    highlight: true,
  },
  {
    icon: Gift,
    title: "Amplop Digital",
    description: "Terima hadiah langsung via transfer bank atau e-wallet — praktis tanpa amplop fisik",
    highlight: false,
  },
  {
    icon: Clock,
    title: "Countdown Timer",
    description: "Hitung mundur menuju hari H, bikin tamu makin excited dan tidak lupa tanggalnya",
    highlight: false,
  },
  {
    icon: Share2,
    title: "Bagikan ke WhatsApp",
    description: "Kirim undangan langsung via WhatsApp, email, atau media sosial dengan satu klik",
    highlight: true,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function Features() {
  return (
    <section id="fitur" className="py-20 md:py-28 relative grain-overlay">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="section-title">
            Semua Fitur <span className="gold-gradient-text">Premium</span>
          </h2>
          <div className="ornament-divider mt-4">
            <span className="ornament-center">&#10045;</span>
          </div>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Hanya <span className="font-semibold text-[var(--burgundy)]">Rp 99.000</span> — sudah termasuk semua fitur di bawah ini. Tanpa paket, tanpa biaya tersembunyi.
          </p>
        </div>

        {/* Feature Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className={`group relative bg-card border rounded-xl p-6 hover:-translate-y-1 transition-all duration-300 ${
                  feature.highlight
                    ? "border-[var(--gold)]/30 hover:border-[var(--gold)] hover:shadow-lg hover:shadow-[var(--gold)]/5"
                    : "border-border hover:border-[var(--gold)]/50 hover:shadow-lg"
                }`}
              >
                {/* Highlight badge */}
                {feature.highlight && (
                  <div className="absolute -top-2.5 right-4">
                    <span className="inline-flex items-center gap-1 bg-[var(--gold)] text-[var(--burgundy)] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      <Sparkles className="size-3" />
                      Populer
                    </span>
                  </div>
                )}

                <div className="flex flex-col items-start gap-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors ${
                    feature.highlight
                      ? "bg-[var(--gold)]/15 group-hover:bg-[var(--gold)]/25"
                      : "bg-[var(--gold)]/10 group-hover:bg-[var(--gold)]/20"
                  }`}>
                    <Icon className="size-6 text-[var(--gold)]" />
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
