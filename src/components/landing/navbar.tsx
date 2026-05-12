"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Menu, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "#template", label: "Template" },
  { href: "#fitur", label: "Fitur" },
  { href: "#cara-kerja", label: "Cara Kerja" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span
            className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl font-bold tracking-tight"
            style={{ color: "var(--burgundy)" }}
          >
            Undangan
            <span className="gold-gradient-text">Nauka</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--gold)] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:bg-[var(--gold)]/10"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="size-5 text-[var(--gold)]" />
              ) : (
                <Moon className="size-5 text-[var(--burgundy)]" />
              )}
            </Button>
          )}
          <Button
            asChild
            className="bg-[var(--burgundy)] text-[var(--ivory)] hover:bg-[var(--gold)] hover:text-[var(--burgundy)] transition-all duration-300 shadow-md"
          >
            <Link href="/builder">Buat Undangan</Link>
          </Button>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:bg-[var(--gold)]/10"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="size-5 text-[var(--gold)]" />
              ) : (
                <Moon className="size-5 text-[var(--burgundy)]" />
              )}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-6 text-foreground" />
          </Button>
        </div>
      </nav>

      {/* Mobile Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-[300px] bg-background">
          <SheetHeader>
            <SheetTitle
              className="font-[family-name:var(--font-playfair)] text-xl font-bold"
              style={{ color: "var(--burgundy)" }}
            >
              Undangan<span className="gold-gradient-text">Nauka</span>
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2 mt-6 px-4">
            {navLinks.map((link) => (
              <SheetClose asChild key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center py-3 px-4 text-base font-medium text-foreground/80 hover:text-foreground hover:bg-[var(--gold)]/10 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              </SheetClose>
            ))}
            <div className="mt-4 pt-4 border-t border-border">
              <SheetClose asChild>
                <Link href="/builder">
                  <Button className="w-full bg-[var(--burgundy)] text-[var(--ivory)] hover:bg-[var(--gold)] hover:text-[var(--burgundy)] transition-all duration-300">
                    Buat Undangan
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </motion.header>
  );
}
