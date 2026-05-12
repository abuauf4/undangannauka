"use client";

import { useRef, useEffect, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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

const stats = [
  { value: "1,000+", label: "Undangan Terkirim" },
  { value: "4.9/5", label: "Rating" },
  { value: "10+", label: "Template Premium" },
];

const emptySubscribe = () => () => {};

interface HeroProps {
  onOpenDemo?: () => void;
}

export function Hero({ onOpenDemo }: HeroProps) {
  const loaded = useSyncExternalStore(emptySubscribe, () => true, () => false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--ivory)] via-[var(--ivory)] to-[var(--secondary)]" />

      {/* Gold particles */}
      <GoldParticles />

      {/* Decorative corner ornaments */}
      <div className="absolute top-8 left-8 w-24 h-24 border-t-2 border-l-2 border-[var(--gold)]/30 rounded-tl-lg" />
      <div className="absolute top-8 right-8 w-24 h-24 border-t-2 border-r-2 border-[var(--gold)]/30 rounded-tr-lg" />
      <div className="absolute bottom-8 left-8 w-24 h-24 border-b-2 border-l-2 border-[var(--gold)]/30 rounded-bl-lg" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-b-2 border-r-2 border-[var(--gold)]/30 rounded-br-lg" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={loaded ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 mb-6"
            >
              <Sparkles className="size-4 text-[var(--gold)]" />
              <span className="text-sm font-medium text-[var(--gold)]">
                Platform Undangan #1 di Indonesia
              </span>
            </motion.div>

            <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6">
              Undangan Digital{" "}
              <span className="gold-gradient-text">yang Memukau</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Buat undangan pernikahan digital yang mewah dan berkesan. Cukup{" "}
              <span className="font-semibold text-[var(--burgundy)]">
                Rp 99.000
              </span>{" "}
              untuk semua fitur premium.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-[var(--burgundy)] text-[var(--ivory)] hover:bg-[var(--gold)] hover:text-[var(--burgundy)] transition-all duration-300 shadow-lg text-base px-8 h-12"
              >
                <a href="#harga">Buat Undangan Sekarang</a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--burgundy)] transition-all duration-300 text-base px-8 h-12"
              >
                <button type="button" onClick={onOpenDemo}>Lihat Demo</button>
              </Button>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={loaded ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-lg">
              {/* Decorative frame */}
              <div className="absolute -inset-4 border-2 border-[var(--gold)]/20 rounded-2xl" />
              <div className="absolute -inset-2 border border-[var(--gold)]/10 rounded-2xl" />
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="/hero-wedding.png"
                  alt="Undangan pernikahan digital mewah"
                  width={672}
                  height={384}
                  className="w-full h-auto object-cover"
                  priority
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--burgundy)]/20 to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16"
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[var(--burgundy)]">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <a
            href="#fitur"
            aria-label="Scroll ke bawah"
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-[var(--gold)] transition-colors"
          >
            <span className="text-xs">Scroll</span>
            <ChevronDown className="size-5" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
