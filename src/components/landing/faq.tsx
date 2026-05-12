"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Apa itu undangan digital?",
    answer:
      "Undangan digital adalah undangan pernikahan dalam format website yang bisa diakses melalui link. Tamu bisa melihat detail pernikahan, mengisi RSVP, meninggalkan ucapan di buku tamu, mengirim amplop digital, dan melihat galeri foto langsung dari smartphone mereka.",
  },
  {
    question: "Berapa harga undangan digital?",
    answer:
      "Semua template kami harga satu harga: Rp 99.000 per undangan. Sudah termasuk semua fitur lengkap — RSVP digital, buku tamu, galeri foto, musik latar, amplop digital, countdown, dan masa aktif hingga 90 hari. Tanpa biaya tersembunyi.",
  },
  {
    question: "Berapa lama undangan aktif?",
    answer:
      "Undangan aktif selama 90 hari sejak dipublikasikan. Itu cukup waktu untuk mengirim ke semua tamu dan mengumpulkan ucapan serta konfirmasi kehadiran. Jika butuh perpanjangan, bisa hubungi kami.",
  },
  {
    question: "Apakah bisa diedit setelah dipublikasikan?",
    answer:
      "Ya, Anda masih bisa mengedit informasi pernikahan, foto, dan detail lainnya bahkan setelah undangan dipublikasikan. Perubahan akan langsung terlihat oleh tamu yang membuka undangan.",
  },
  {
    question: "Bagaimana cara mengirim undangan ke tamu?",
    answer:
      "Setelah undangan selesai dibuat, Anda akan mendapatkan link unik yang bisa dibagikan melalui WhatsApp, email, media sosial, atau SMS. Kami juga menyediakan fitur kirim langsung melalui WhatsApp dengan pesan otomatis.",
  },
  {
    question: "Apakah ada biaya tersembunyi?",
    answer:
      "Tidak ada biaya tersembunyi sama sekali. Harga Rp 99.000 sudah mencakup semua fitur premium — sekali bayar, tanpa langganan bulanan, tanpa biaya tambahan.",
  },
  {
    question: "Bisa pakai domain sendiri?",
    answer:
      "Saat ini undangan diakses melalui domain undangannauka.id/nama-anda. Fitur custom domain sedang dalam pengembangan dan akan tersedia segera.",
  },
  {
    question: "Berapa tamu maksimal yang bisa diundang?",
    answer:
      "Tidak ada batasan jumlah tamu. Anda bisa membagikan link undangan ke sebanyak mungkin tamu tanpa biaya tambahan. Semua tamu bisa mengisi RSVP dan buku tamu.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 md:py-28 bg-[var(--secondary)] relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="section-title">
            Pertanyaan{" "}
            <span className="gold-gradient-text">Umum</span>
          </h2>
          <div className="ornament-divider mt-4">
            <span className="ornament-center">&#10045;</span>
          </div>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Temukan jawaban untuk pertanyaan yang sering diajukan tentang
            UndanganNauka
          </p>
        </div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="bg-card border border-border rounded-xl px-6 hover:border-[var(--gold)]/50 transition-colors data-[state=open]:border-[var(--gold)]/50 data-[state=open]:shadow-sm"
              >
                <AccordionTrigger className="text-left font-[family-name:var(--font-playfair)] text-base font-semibold hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
