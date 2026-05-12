"use client";

import { useState } from "react";
import { useBuilder } from "@/lib/builder-context";
import { motion } from "framer-motion";
import { ArrowRight, Eye, X, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DynamicInvitationPreview } from "@/components/invitation/dynamic-invitation-preview";
import { InvitationThemeProvider } from "@/components/invitation/theme-provider";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

export function StepPreview() {
  const { data, setStep } = useBuilder();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div>
      <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-foreground mb-2">
        Review Undangan
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Periksa data undangan Anda. Lihat preview atau langsung dapatkan link undangan.
      </p>

      {/* Summary Cards */}
      <div className="space-y-3 mb-6">
        <SummaryCard title="Template" value={data.templateName || "Belum dipilih"} />
        <SummaryCard
          title="Mempelai"
          value={`${data.namaPria || "—"} & ${data.namaWanita || "—"}`}
          sub={data.greeting || undefined}
        />
        <SummaryCard
          title="Akad Nikah"
          value={data.tanggalAkad ? new Date(data.tanggalAkad).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "Belum diisi"}
          sub={[data.waktuAkad, data.lokasiAkad].filter(Boolean).join(" · ") || undefined}
        />
        {data.punyaResepsi && (
          <SummaryCard
            title="Resepsi"
            value={data.tanggalResepsi ? new Date(data.tanggalResepsi).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "Belum diisi"}
            sub={[data.waktuResepsi, data.lokasiResepsi].filter(Boolean).join(" · ") || undefined}
          />
        )}
        <SummaryCard
          title="Personalisasi"
          value={[
            data.fotoPria ? "Foto Pria" : null,
            data.fotoWanita ? "Foto Wanita" : null,
            (data.fotoGallery?.length ?? 0) > 0 ? `${data.fotoGallery.length} Galeri` : null,
            data.musikPilihan !== "none" ? data.musikPilihan : null,
          ].filter(Boolean).join(" · ") || "Belum diisi"}
        />
      </div>

      {/* Feature Summary */}
      <div className="bg-gradient-to-r from-[var(--burgundy)]/5 to-[var(--gold)]/5 border border-[var(--gold)]/20 rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-muted-foreground">Undangan Digital Premium</span>
          <span className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[var(--gold)]">
            Gratis (Tester)
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground">Sudah termasuk semua fitur — tanpa biaya tersembunyi</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Lihat Preview Button */}
        <Button
          size="lg"
          variant="outline"
          onClick={() => setIsPreviewOpen(true)}
          className="flex-1 border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--burgundy)] transition-all duration-300 h-12 text-base"
        >
          <Eye className="size-5 mr-2" />
          Lihat Preview
        </Button>

        {/* Dapatkan Link Button */}
        <Button
          size="lg"
          onClick={() => setStep(6)}
          className="flex-1 bg-[var(--burgundy)] text-[var(--ivory)] hover:bg-[var(--gold)] hover:text-[var(--burgundy)] transition-all duration-300 h-12 text-base shadow-lg"
        >
          <Link2 className="size-5 mr-2" />
          Dapatkan Link
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>

      {/* Full Preview Modal - uses builder data with previewMode */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="h-screen max-h-[100vh] w-full max-w-full overflow-hidden rounded-none border-none p-0">
          {/* Close button - positioned inside the scroll area */}
          <button
            onClick={() => setIsPreviewOpen(false)}
            className="absolute right-4 top-4 z-[60] flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-black/70"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <X size={20} />
          </button>

          {/* Scrollable content area */}
          <div className="h-full overflow-y-auto">
            {/* Dynamic preview with actual builder data in preview mode */}
            <InvitationThemeProvider nuansa={data.nuansa as any} adat={data.adat as any} tingkat={data.tingkat as any}>
            <DynamicInvitationPreview data={data} previewMode={true} />
            </InvitationThemeProvider>

            {/* Bottom spacing for floating CTA */}
            <div className="h-28" />
          </div>

          {/* Floating CTA at bottom of preview */}
          <div className="absolute bottom-0 left-0 right-0 z-[60] bg-gradient-to-t from-black/80 via-black/60 to-transparent pt-12 pb-4 px-4 pointer-events-auto">
            <div className="max-w-lg mx-auto">
              <Button
                size="lg"
                onClick={() => { setIsPreviewOpen(false); setStep(6); }}
                className="w-full bg-[var(--burgundy)] text-[var(--ivory)] hover:bg-[var(--gold)] hover:text-[var(--burgundy)] transition-all duration-300 h-13 text-base shadow-xl"
              >
                <Link2 className="size-5 mr-2" />
                Dapatkan Link Undangan
                <ArrowRight className="size-4 ml-2" />
              </Button>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="block mx-auto mt-2 text-sm text-white/70 hover:text-white transition-colors"
              >
                Kembali ke Review
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SummaryCard({ title, value, sub }: { title: string; value: string; sub?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start justify-between bg-card border border-border rounded-lg p-3"
    >
      <div>
        <p className="text-xs text-muted-foreground font-medium">{title}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
    </motion.div>
  );
}
