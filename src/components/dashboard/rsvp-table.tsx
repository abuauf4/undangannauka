"use client";

import { useState, useEffect } from "react";
import { Loader2, Users, CheckCircle, XCircle, Clock } from "lucide-react";
import { authFetch } from "@/lib/api-client";

interface Invitation {
  id: string;
  namaPria: string;
  namaWanita: string;
}

interface Guest {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: string;
  guestCount: number;
  message: string | null;
  createdAt: string;
}

export function RSVPTable({ invitations }: { invitations: Invitation[] }) {
  const [selectedInv, setSelectedInv] = useState<string>(invitations[0]?.id || "");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedInv) return;
    queueMicrotask(() => setLoading(true));
    authFetch(`/api/guest?invitationId=${selectedInv}`)
      .then((res) => res.json())
      .then((data) => setGuests(data.guests || []))
      .catch(() => setGuests([]))
      .finally(() => setLoading(false));
  }, [selectedInv]);

  const statusIcon = (status: string) => {
    switch (status) {
      case "attending": return <CheckCircle className="size-4 text-green-500" />;
      case "not_attending": return <XCircle className="size-4 text-red-400" />;
      default: return <Clock className="size-4 text-muted-foreground" />;
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "attending": return "Hadir";
      case "not_attending": return "Tidak Hadir";
      default: return "Menunggu";
    }
  };

  return (
    <div>
      <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-foreground mb-4">
        Manajemen RSVP
      </h2>

      {invitations.length === 0 ? (
        <p className="text-muted-foreground text-sm">Belum ada undangan.</p>
      ) : (
        <>
          {/* Selector */}
          <div className="mb-4">
            <select
              value={selectedInv}
              onChange={(e) => setSelectedInv(e.target.value)}
              className="w-full sm:w-auto border border-border rounded-lg px-3 py-2 text-sm bg-card"
            >
              {invitations.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.namaPria} & {inv.namaWanita}
                </option>
              ))}
            </select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-card border border-border rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-green-600">{guests.filter(g => g.status === "attending").length}</p>
              <p className="text-[10px] text-muted-foreground">Hadir</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-red-400">{guests.filter(g => g.status === "not_attending").length}</p>
              <p className="text-[10px] text-muted-foreground">Tidak Hadir</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-muted-foreground">{guests.filter(g => g.status === "pending").length}</p>
              <p className="text-[10px] text-muted-foreground">Menunggu</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="size-5 animate-spin text-[var(--gold)]" /></div>
          ) : guests.length === 0 ? (
            <div className="text-center py-10">
              <Users className="size-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Belum ada RSVP masuk</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground">Nama</th>
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground">Jumlah</th>
                    <th className="text-left py-2 px-3 font-medium text-muted-foreground">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map((g) => (
                    <tr key={g.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-2.5 px-3">
                        <p className="font-medium">{g.name}</p>
                        {g.message && <p className="text-xs text-muted-foreground mt-0.5">{g.message}</p>}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="flex items-center gap-1.5">
                          {statusIcon(g.status)}
                          {statusLabel(g.status)}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">{g.guestCount} orang</td>
                      <td className="py-2.5 px-3 text-muted-foreground text-xs">
                        {new Date(g.createdAt).toLocaleDateString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
