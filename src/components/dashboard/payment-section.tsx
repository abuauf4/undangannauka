"use client";

import { useState } from "react";
import { CreditCard, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authFetch } from "@/lib/api-client";

interface Invitation {
  id: string;
  slug: string;
  templateId: string;
  namaPria: string;
  namaWanita: string;
  isPaid: boolean;
  paymentId: string | null;
  isPublished: boolean;
}

export function PaymentSection({ invitations }: { invitations: Invitation[] }) {
  const [payingId, setPayingId] = useState<string | null>(null);
  const [paidIds, setPaidIds] = useState<Set<string>>(new Set(invitations.filter(i => i.isPaid).map(i => i.id)));

  const handlePay = async (invitationId: string) => {
    setPayingId(invitationId);
    try {
      const res = await authFetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId }),
      });
      const data = await res.json();
      if (data.success) {
        setPaidIds((prev) => new Set([...prev, invitationId]));
      }
    } catch (err) {
      console.error("Payment failed:", err);
    } finally {
      setPayingId(null);
    }
  };

  const unpaid = invitations.filter((inv) => !paidIds.has(inv.id));
  const paid = invitations.filter((inv) => paidIds.has(inv.id));

  return (
    <div>
      <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-foreground mb-4">
        Pembayaran
      </h2>

      {/* Info banner */}
      <div className="bg-[var(--gold)]/5 border border-[var(--gold)]/20 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <CreditCard className="size-5 text-[var(--gold)] mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Harga: Rp 99.000 / undangan</p>
            <p className="text-xs text-muted-foreground mt-1">
              Sekali bayar, semua fitur lengkap. Saat ini dalam mode demo — pembayaran otomatis berhasil.
              Di production, akan terintegrasi dengan Midtrans Snap untuk pembayaran via transfer bank, e-wallet, dan kartu kredit.
            </p>
          </div>
        </div>
      </div>

      {/* Unpaid */}
      {unpaid.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Belum Dibayar</h3>
          <div className="space-y-3">
            {unpaid.map((inv) => (
              <div key={inv.id} className="bg-card border border-[var(--gold)]/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{inv.namaPria} & {inv.namaWanita}</p>
                  <p className="text-xs text-muted-foreground">{inv.templateId}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-[family-name:var(--font-playfair)] font-bold text-[var(--burgundy)]">Rp 99.000</span>
                  <Button
                    size="sm"
                    disabled={payingId === inv.id}
                    onClick={() => handlePay(inv.id)}
                    className="bg-[var(--gold)] text-[var(--burgundy)] hover:bg-[var(--burgundy)] hover:text-[var(--ivory)] transition-all"
                  >
                    {payingId === inv.id ? (
                      <><Loader2 className="size-3.5 animate-spin mr-1" /> Memproses...</>
                    ) : (
                      "Bayar Sekarang"
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Paid */}
      {paid.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Sudah Dibayar</h3>
          <div className="space-y-3">
            {paid.map((inv) => (
              <div key={inv.id} className="bg-card border border-green-200 dark:border-green-900/50 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle className="size-5 text-green-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{inv.namaPria} & {inv.namaWanita}</p>
                  <p className="text-xs text-muted-foreground">{inv.templateId} · Lunas</p>
                </div>
                <span className="text-xs text-green-600 font-medium">Rp 99.000 ✓</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {invitations.length === 0 && (
        <div className="text-center py-10">
          <AlertCircle className="size-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Belum ada undangan untuk dibayar</p>
        </div>
      )}
    </div>
  );
}
