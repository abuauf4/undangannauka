"use client";

import { motion } from "framer-motion";
import { Palette, PenTool, Send } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: Palette,
    title: "Pilih Template",
    description: "Pilih dari koleksi template premium kami",
  },
  {
    number: "2",
    icon: PenTool,
    title: "Isi Detail",
    description: "Masukkan informasi pernikahan dan mempelai",
  },
  {
    number: "3",
    icon: Send,
    title: "Bagikan",
    description: "Kirim undangan digital ke seluruh tamu",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="py-20 md:py-28 relative grain-overlay">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="section-title">
            Cara Membuat{" "}
            <span className="gold-gradient-text">Undangan</span>
          </h2>
          <div className="ornament-divider mt-4">
            <span className="ornament-center">&#10045;</span>
          </div>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Hanya 3 langkah mudah untuk membuat undangan pernikahan digital Anda
          </p>
        </div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative"
        >
          {/* Connecting line - desktop */}
          <div className="hidden md:block absolute top-24 left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-[var(--gold)]/20 via-[var(--gold)] to-[var(--gold)]/20" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  variants={stepVariants}
                  className="flex flex-col items-center text-center relative"
                >
                  {/* Step number circle */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full bg-[var(--burgundy)] flex items-center justify-center shadow-lg shadow-[var(--burgundy)]/20 relative z-10">
                      <span className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[var(--gold)]">
                        {step.number}
                      </span>
                    </div>
                    {/* Decorative ring */}
                    <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-[var(--gold)]/30 scale-125" />
                  </div>

                  {/* Icon */}
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-[var(--gold)]/10 mb-4">
                    <Icon className="size-7 text-[var(--gold)]" />
                  </div>

                  {/* Text */}
                  <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-[250px] leading-relaxed">
                    {step.description}
                  </p>

                  {/* Mobile connecting line */}
                  {idx < steps.length - 1 && (
                    <div className="md:hidden w-0.5 h-12 bg-gradient-to-b from-[var(--gold)] to-[var(--gold)]/20 mt-6" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
