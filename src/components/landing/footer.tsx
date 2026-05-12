"use client";

import Link from "next/link";
import { Mail, Phone, Instagram } from "lucide-react";

const productLinks = [
  { label: "Template", href: "#template" },
  { label: "Fitur", href: "#fitur" },
  { label: "Cara Kerja", href: "#cara-kerja" },
  { label: "FAQ", href: "#faq" },
];

const companyLinks = [
  { label: "Tentang Kami", href: "#tentang" },
  { label: "Kebijakan Privasi", href: "#kebijakan-privasi" },
  { label: "Syarat & Ketentuan", href: "#syarat-ketentuan" },
  { label: "Hubungi Kami", href: "mailto:halo@undangannauka.id" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--burgundy)] text-[var(--ivory)] relative">
      {/* Decorative gold line at top */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Logo & Tagline */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[var(--ivory)]">
                Undangan
                <span className="text-[var(--gold)]">Nauka</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--ivory)]/70 leading-relaxed max-w-xs">
              Platform undangan digital pernikahan premium. Buat momen spesial
              Anda semakin berkesan dengan desain mewah dan elegan.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[var(--gold)] mb-4">
              Produk
            </h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--ivory)]/70 hover:text-[var(--gold)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[var(--gold)] mb-4">
              Perusahaan
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--ivory)]/70 hover:text-[var(--gold)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[var(--gold)] mb-4">
              Kontak
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:halo@undangannauka.id"
                  className="flex items-center gap-2 text-sm text-[var(--ivory)]/70 hover:text-[var(--gold)] transition-colors"
                >
                  <Mail className="size-4 shrink-0" />
                  halo@undangannauka.id
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/6289655592925"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[var(--ivory)]/70 hover:text-[var(--gold)] transition-colors"
                >
                  <Phone className="size-4 shrink-0" />
                  +62 896-5559-2925
                </a>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://instagram.com/undangannauka"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--ivory)]/10 hover:bg-[var(--gold)]/20 text-[var(--ivory)]/70 hover:text-[var(--gold)] transition-all"
              >
                <Instagram className="size-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[var(--ivory)]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--ivory)]/50">
            &copy; {currentYear} UndanganNauka. Hak cipta dilindungi.
          </p>
          <p className="text-xs text-[var(--ivory)]/30">
            Dibuat dengan cinta di Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
