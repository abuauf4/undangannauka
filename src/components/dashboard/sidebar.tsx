"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import {
  LayoutDashboard,
  Mail,
  BookOpen,
  CreditCard,
  Plus,
  ArrowLeft,
  Wand2,
  Palette,
  X,
} from "lucide-react";

interface DashboardSidebarProps {
  onClose?: () => void;
}

const sidebarLinks = [
  { href: "/dashboard", tab: "overview", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard?tab=templates", tab: "templates", icon: Palette, label: "Template" },
  { href: "/dashboard?tab=rsvp", tab: "rsvp", icon: Mail, label: "RSVP" },
  { href: "/dashboard?tab=guestbook", tab: "guestbook", icon: BookOpen, label: "Buku Tamu" },
  { href: "/dashboard?tab=payment", tab: "payment", icon: CreditCard, label: "Pembayaran" },
];

export function DashboardSidebar({ onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      {/* Logo + Close button */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <Link href="/" className="inline-block">
          <span className="font-[family-name:var(--font-playfair)] text-lg font-bold" style={{ color: "#800020" }}>
            Undangan<span className="gold-gradient-text">Nauka</span>
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg hover:bg-muted transition-colors"
            aria-label="Tutup menu"
          >
            <X className="size-5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === "/dashboard" && currentTab === link.tab;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-[var(--burgundy)] text-[var(--ivory)]"
                  : "text-muted-foreground hover:bg-[var(--gold)]/10 hover:text-foreground"
              }`}
            >
              <Icon className="size-4" />
              {link.label}
            </Link>
          );
        })}

        <div className="pt-3 border-t border-border mt-3">
          <Link
            href="/template-builder"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-[var(--gold)]/10 text-[var(--gold)] hover:bg-[var(--gold)]/20 transition-all"
          >
            <Wand2 className="size-4" />
            Template Builder
          </Link>
          <Link
            href="/builder"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-[var(--gold)]/10 hover:text-foreground transition-all mt-1"
          >
            <Plus className="size-4" />
            Buat Undangan
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border space-y-1">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Website
        </Link>
        <SignOutButton />
      </div>
    </aside>
  );
}
