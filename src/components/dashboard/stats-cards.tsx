"use client";

import { Eye, Users, MessageSquare, CreditCard } from "lucide-react";

interface Invitation {
  id: string;
  isPaid: boolean;
  viewCount: number;
  rsvpCount: number;
  isPublished: boolean;
}

export function StatsCards({ invitations }: { invitations: Invitation[] }) {
  const totalViews = invitations.reduce((acc: number, inv: Invitation) => acc + inv.viewCount, 0);
  const totalRSVP = invitations.reduce((acc: number, inv: Invitation) => acc + inv.rsvpCount, 0);
  const paidCount = invitations.filter((inv: Invitation) => inv.isPaid).length;
  const publishedCount = invitations.filter((inv: Invitation) => inv.isPublished).length;

  const stats = [
    {
      icon: <Eye className="size-5" />,
      label: "Total Views",
      value: totalViews.toLocaleString("id-ID"),
      sub: `${publishedCount} undangan aktif`,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: <Users className="size-5" />,
      label: "RSVP Masuk",
      value: totalRSVP.toLocaleString("id-ID"),
      sub: "Konfirmasi tamu",
      color: "text-green-600 bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: <MessageSquare className="size-5" />,
      label: "Undangan",
      value: invitations.length.toString(),
      sub: `${paidCount} sudah bayar`,
      color: "text-[var(--gold)] bg-[var(--gold)]/10",
    },
    {
      icon: <CreditCard className="size-5" />,
      label: "Pembayaran",
      value: `Rp ${(paidCount * 99000).toLocaleString("id-ID")}`,
      sub: paidCount > 0 ? `${paidCount} transaksi` : "Belum ada",
      color: "text-[var(--burgundy)] bg-[var(--burgundy)]/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${stat.color} mb-3`}>
            {stat.icon}
          </div>
          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
          <p className="text-[10px] text-muted-foreground/60 mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
