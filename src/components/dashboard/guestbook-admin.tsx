"use client";

import { useState, useEffect } from "react";
import { Loader2, BookOpen, EyeOff, Eye } from "lucide-react";
import { authFetch } from "@/lib/api-client";

interface Invitation {
  id: string;
  namaPria: string;
  namaWanita: string;
}

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  isHidden: boolean;
  createdAt: string;
}

export function GuestbookAdmin({ invitations }: { invitations: Invitation[] }) {
  const [selectedInv, setSelectedInv] = useState<string>(invitations[0]?.id || "");
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedInv) return;
    queueMicrotask(() => setLoading(true));
    authFetch(`/api/guestbook?invitationId=${selectedInv}`)
      .then((res) => res.json())
      .then((data) => setEntries(data.entries || []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [selectedInv]);

  const toggleHide = async (id: string, currentHidden: boolean) => {
    try {
      await authFetch("/api/guestbook", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isHidden: !currentHidden }),
      });
      setEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, isHidden: !currentHidden } : e))
      );
    } catch {}
  };

  return (
    <div>
      <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-foreground mb-4">
        Buku Tamu
      </h2>

      {invitations.length === 0 ? (
        <p className="text-muted-foreground text-sm">Belum ada undangan.</p>
      ) : (
        <>
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

          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="size-5 animate-spin text-[var(--gold)]" /></div>
          ) : entries.length === 0 ? (
            <div className="text-center py-10">
              <BookOpen className="size-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Belum ada ucapan masuk</p>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className={`bg-card border rounded-xl p-4 ${entry.isHidden ? "border-red-200 dark:border-red-900/50 opacity-60" : "border-border"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground">{entry.name}</p>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        &ldquo;{entry.message}&rdquo;
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 mt-2">
                        {new Date(entry.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleHide(entry.id, entry.isHidden)}
                      className={`p-2 rounded-lg border transition-colors ${
                        entry.isHidden
                          ? "border-red-200 text-red-400 hover:bg-red-50 dark:border-red-900/50"
                          : "border-border text-muted-foreground hover:border-[var(--gold)]"
                      }`}
                      title={entry.isHidden ? "Tampilkan" : "Sembunyikan"}
                    >
                      {entry.isHidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
