"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Copy, Check, Eye } from "lucide-react";

interface Invitation {
  id: string;
  slug: string;
  templateId: string;
  namaPria: string;
  namaWanita: string;
  isPublished: boolean;
  isPaid: boolean;
  viewCount: number;
  rsvpCount: number;
  createdAt: string;
}

export function InvitationList({ invitations }: { invitations: Invitation[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (slug: string, id: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/i/${slug}`);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-foreground">
          Undangan Anda
        </h2>
        <Link
          href="/builder"
          className="text-sm font-medium text-[var(--gold)] hover:underline"
        >
          + Buat Baru
        </Link>
      </div>

      {invitations.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <p className="text-muted-foreground mb-4">Anda belum punya undangan</p>
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--burgundy)] text-[var(--ivory)] text-sm font-medium hover:bg-[var(--gold)] hover:text-[var(--burgundy)] transition-all"
          >
            Buat Undangan Pertama
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {invitations.map((inv) => (
            <div
              key={inv.id}
              className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:border-[var(--gold)]/50 transition-colors"
            >
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-[family-name:var(--font-playfair)] font-semibold text-foreground truncate">
                    {inv.namaPria} & {inv.namaWanita}
                  </h3>
                  {inv.isPaid ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Lunas
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--gold)]/10 text-[var(--gold)]">
                      Belum Bayar
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {inv.templateId} · Dibuat {new Date(inv.createdAt).toLocaleDateString("id-ID")}
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Eye className="size-3" /> {inv.viewCount}</span>
                <span>{inv.rsvpCount} RSVP</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(inv.slug, inv.id)}
                  className="p-2 rounded-lg border border-border hover:border-[var(--gold)] transition-colors"
                  title="Copy link"
                >
                  {copiedId === inv.id ? (
                    <Check className="size-4 text-green-500" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </button>
                <a
                  href={`/i/${inv.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-border hover:border-[var(--gold)] transition-colors"
                  title="Buka undangan"
                >
                  <ExternalLink className="size-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
