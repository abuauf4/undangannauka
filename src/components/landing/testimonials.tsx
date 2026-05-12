"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Sari & Budi",
    location: "Jakarta",
    quote:
      "Undangannya bagus banget! Tamu-tamu pada kagum. Prosesnya gampang dan hasilnya premium. Kami pilih template Royal Islamic Jawa dan tamu dari luar negeri juga bisa akses dengan mudah.",
    initials: "SB",
    rating: 5,
    template: "Royal Islamic Jawa",
  },
  {
    name: "Dewi & Andi",
    location: "Surabaya",
    quote:
      "Desainnya elegan banget, sesuai dengan tema pernikahan kami. RSVP-nya sangat membantu mengatur tamu — kami bisa track siapa yang sudah konfirmasi secara real-time. Worth every rupiah!",
    initials: "DA",
    rating: 5,
    template: "Bali Spiritual",
  },
  {
    name: "Rina & Fajar",
    location: "Bandung",
    quote:
      "Harga terjangkau tapi kualitas premium! Buku tamu digital-nya jadi kenangan yang indah dari tamu kami. Amplop digital juga sangat praktis, tidak perlu khawatir amplop fisik hilang.",
    initials: "RF",
    rating: 5,
    template: "Royal Elegance",
  },
  {
    name: "Ayu & Made",
    location: "Denpasar",
    quote:
      "Kami dari Bali dan cari undangan yang nuansa Hindu-nya kental. Template Bali Spiritual pas banget! Musik latar gamelan-nya bikin tamu langsung merasakan suasana Bali.",
    initials: "AM",
    rating: 5,
    template: "Bali Spiritual",
  },
  {
    name: "Hana & Omar",
    location: "Yogyakarta",
    quote:
      "Kaligrafi Bismillah-nya indah banget, ortu kami sangat terharu lihat undangannya. Countdown timer dan maps juga sangat membantu tamu yang datang dari luar kota. Terima kasih UndanganNauka!",
    initials: "HO",
    rating: 5,
    template: "Arabian Nights",
  },
  {
    name: "Nadia & Rizki",
    location: "Medan",
    quote:
      "Gorga Batak-nya autentik banget! Keluarga dari Sumatera Utara pada bangga ada undangan digital yang mengangkat budaya Batak. Fitur buku tamu jadi tempat ucapan yang sangat berkesan.",
    initials: "NR",
    rating: 5,
    template: "Sultan Batak",
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalSlides = testimonials.length;
  const itemsPerView = typeof window !== "undefined" && window.innerWidth >= 768 ? 3 : 1;
  const maxIndex = totalSlides - itemsPerView;

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-slide
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <section className="py-20 md:py-28 bg-[var(--secondary)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="section-title">
            Kata <span className="gold-gradient-text">Mereka</span>
          </h2>
          <div className="ornament-divider mt-4">
            <span className="ornament-center">&#10045;</span>
          </div>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Ribuan pasangan sudah mempercayakan momen bahagia mereka kepada kami
          </p>
        </div>

        {/* Desktop Grid View */}
        <div className="hidden md:block">
          <div className="relative overflow-hidden">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="grid grid-cols-3 gap-6 lg:gap-8"
              >
                {testimonials.slice(current, current + 3).map((testimonial) => (
                  <div
                    key={testimonial.name}
                    className="bg-card border border-border rounded-xl p-6 lg:p-8 hover:border-[var(--gold)]/50 hover:shadow-lg transition-all duration-300 relative"
                  >
                    <Quote className="size-8 text-[var(--gold)]/20 mb-4" />
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="size-4 fill-[var(--gold)] text-[var(--gold)]" />
                      ))}
                    </div>
                    <p className="text-foreground/80 italic leading-relaxed mb-6 line-clamp-4">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--burgundy)] text-[var(--ivory)] font-semibold text-sm">
                        {testimonial.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-foreground">{testimonial.name}</div>
                        <div className="text-xs text-muted-foreground">{testimonial.location} · {testimonial.template}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-border hover:border-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all"
              aria-label="Previous"
            >
              <ChevronLeft className="size-5 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? "w-6 bg-[var(--gold)]" : "w-2 bg-[var(--gold)]/30"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-border hover:border-[var(--gold)] hover:bg-[var(--gold)]/10 transition-all"
              aria-label="Next"
            >
              <ChevronRight className="size-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Mobile Carousel */}
        <div
          className="md:hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div className="relative overflow-hidden">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {(() => {
                  const t = testimonials[current];
                  return (
                    <div className="bg-card border border-border rounded-xl p-6 hover:border-[var(--gold)]/50 hover:shadow-lg transition-all duration-300 relative">
                      <Quote className="size-8 text-[var(--gold)]/20 mb-4" />
                      <div className="flex gap-1 mb-4">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="size-4 fill-[var(--gold)] text-[var(--gold)]" />
                        ))}
                      </div>
                      <p className="text-foreground/80 italic leading-relaxed mb-6">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-border">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--burgundy)] text-[var(--ivory)] font-semibold text-sm">
                          {t.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-foreground">{t.name}</div>
                          <div className="text-xs text-muted-foreground">{t.location} · {t.template}</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="flex items-center justify-center w-9 h-9 rounded-full border border-border hover:border-[var(--gold)] transition-all"
            >
              <ChevronLeft className="size-4 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? "w-5 bg-[var(--gold)]" : "w-1.5 bg-[var(--gold)]/30"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="flex items-center justify-center w-9 h-9 rounded-full border border-border hover:border-[var(--gold)] transition-all"
            >
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
