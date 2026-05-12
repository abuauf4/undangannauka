"use client";

import { useState } from "react";
import { useBuilder } from "@/lib/builder-context";
import { motion } from "framer-motion";
import {
  Check,
  Copy,
  Share2,
  ExternalLink,
  Loader2,
  Link2,
  AlertCircle,
  PartyPopper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { isBase64DataUrl, uploadImage, uploadAudio, estimateBase64Size } from "@/lib/upload-helper";
import { authFetch } from "@/lib/api-client";

type CheckoutState = "form" | "processing" | "success" | "error";
type ProcessingStep = "uploading-remaining" | "creating" | "finalizing";

export function StepCheckout() {
  const { data, resetData } = useBuilder();
  const [state, setState] = useState<CheckoutState>("form");
  const [processingStep, setProcessingStep] = useState<ProcessingStep>("uploading-remaining");
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://undangannauka.id";
  const shareUrl = publishedSlug ? `${baseUrl}/i/${publishedSlug}` : "";

  const handleGetLink = async () => {
    setErrorMsg(null);
    setState("processing");

    try {
      // ─── 1. Validate required fields ───
      if (!data.templateId) {
        throw new Error("Template belum dipilih. Silakan pilih template terlebih dahulu.");
      }
      if (!data.namaPria.trim() || !data.namaWanita.trim()) {
        throw new Error("Nama mempelai pria dan wanita wajib diisi.");
      }

      setProcessingStep("uploading-remaining");

      // ─── 2. Upload any remaining base64 values that weren't uploaded yet ───
      // (this handles legacy data from localStorage or failed uploads)
      let fotoPria = data.fotoPria;
      let fotoWanita = data.fotoWanita;
      let fotoBackground = data.fotoBackground;
      let fotoGallery = [...(data.fotoGallery || [])];
      let customMusicUrl = data.customMusicUrl;

      // Try to upload any base64 images that weren't uploaded during the form step
      if (fotoPria && isBase64DataUrl(fotoPria)) {
        try {
          const blob = await fetch(fotoPria).then(r => r.blob());
          const uploaded = await uploadImage(blob as File, `foto-pria-${Date.now()}`, 800, 0.8);
          if (!isBase64DataUrl(uploaded)) fotoPria = uploaded; // Use cloud URL if successful
        } catch (e) { console.warn("Failed to upload fotoPria:", e); }
      }
      if (fotoWanita && isBase64DataUrl(fotoWanita)) {
        try {
          const blob = await fetch(fotoWanita).then(r => r.blob());
          const uploaded = await uploadImage(blob as File, `foto-wanita-${Date.now()}`, 800, 0.8);
          if (!isBase64DataUrl(uploaded)) fotoWanita = uploaded;
        } catch (e) { console.warn("Failed to upload fotoWanita:", e); }
      }
      if (fotoBackground && isBase64DataUrl(fotoBackground)) {
        try {
          const blob = await fetch(fotoBackground).then(r => r.blob());
          const uploaded = await uploadImage(blob as File, `foto-bg-${Date.now()}`, 1600, 0.8);
          if (!isBase64DataUrl(uploaded)) fotoBackground = uploaded;
        } catch (e) { console.warn("Failed to upload fotoBackground:", e); }
      }
      for (let i = 0; i < fotoGallery.length; i++) {
        if (isBase64DataUrl(fotoGallery[i])) {
          try {
            const blob = await fetch(fotoGallery[i]).then(r => r.blob());
            const uploaded = await uploadImage(blob as File, `gallery-${i}-${Date.now()}`, 1000, 0.8);
            if (!isBase64DataUrl(uploaded)) fotoGallery[i] = uploaded;
          } catch (e) { console.warn(`Failed to upload gallery[${i}]:`, e); }
        }
      }
      if (customMusicUrl && isBase64DataUrl(customMusicUrl)) {
        try {
          const blob = await fetch(customMusicUrl).then(r => r.blob());
          const uploaded = await uploadAudio(blob as File, `music-${Date.now()}`);
          if (!isBase64DataUrl(uploaded)) customMusicUrl = uploaded;
        } catch (e) { console.warn("Failed to upload custom music:", e); }
      }

      // ─── 2b. Check payload size for base64 fallback ───
      const totalBase64Size = estimateBase64Size([
        fotoPria, fotoWanita, fotoBackground, customMusicUrl, ...fotoGallery
      ]);
      
      if (totalBase64Size > 3.5) {
        throw new Error(
          `Total file terlalu besar (${totalBase64Size.toFixed(1)}MB). Cloud storage sedang tidak tersedia. ` +
          `Coba kurangi jumlah foto atau gunakan file musik yang lebih kecil (di bawah 2MB).`
        );
      }

      setProcessingStep("creating");

      // ─── 3. Create invitation (URLs only — tiny payload!) ───
      const musikUrl = data.musikPilihan === "custom"
        ? (customMusicUrl || "")
        : (data.musikPilihan !== "none" ? data.musikPilihan : undefined);

      const invRes = await authFetch("/api/invitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: data.templateId,
          namaPria: data.namaPria,
          namaWanita: data.namaWanita,
          namaOrtuPria: data.namaOrtuPria || undefined,
          namaOrtuWanita: data.namaOrtuWanita || undefined,
          fotoPria: fotoPria || undefined,
          fotoWanita: fotoWanita || undefined,
          tanggalAkad: data.tanggalAkad || undefined,
          waktuAkad: data.waktuAkad || undefined,
          lokasiAkad: data.lokasiAkad || undefined,
          alamatAkad: data.alamatAkad || undefined,
          mapsAkadUrl: data.mapsAkadUrl || undefined,
          tanggalResepsi: data.punyaResepsi ? data.tanggalResepsi || undefined : undefined,
          waktuResepsi: data.punyaResepsi ? data.waktuResepsi || undefined : undefined,
          lokasiResepsi: data.punyaResepsi ? data.lokasiResepsi || undefined : undefined,
          alamatResepsi: data.punyaResepsi ? data.alamatResepsi || undefined : undefined,
          mapsResepsiUrl: data.punyaResepsi ? data.mapsResepsiUrl || undefined : undefined,
          nuansa: data.templateCategory || undefined,
          adat: data.adat || undefined,
          tingkat: data.tingkat || undefined,
          greeting: data.greeting || undefined,
          ayatQuote: data.ayatQuote || undefined,
          musikUrl,
          fotoGallery: fotoGallery.length > 0 ? fotoGallery : undefined,
          fotoBackground: fotoBackground || undefined,
          ourStory: (data.ourStory?.length ?? 0) > 0 ? data.ourStory : undefined,
          loveQuotes: (data.loveQuotes?.length ?? 0) > 0 ? data.loveQuotes : undefined,
          bridesmaidGroomsman: ((data.bridesmaids?.length ?? 0) > 0 || (data.groomsmen?.length ?? 0) > 0)
            ? { bridesmaids: data.bridesmaids || [], groomsmen: data.groomsmen || [] }
            : undefined,
          weddingItinerary: (data.weddingItinerary?.length ?? 0) > 0 ? data.weddingItinerary : undefined,
          welcomeVideo: data.welcomeVideo || undefined,
          amplopDigital: (data.amplopDigital || []).filter((a: { accountNumber: string }) => a.accountNumber).length > 0
            ? (data.amplopDigital || []).filter((a: { accountNumber: string }) => a.accountNumber)
            : undefined,
        }),
      });

      // Handle non-JSON responses
      if (!invRes.ok) {
        let errorMsg = "Gagal membuat undangan. Coba lagi nanti.";
        try {
          const errData = await invRes.json();
          errorMsg = errData.error || errorMsg;
        } catch {
          if (invRes.status === 413) {
            errorMsg = "Data undangan terlalu besar. Coba kurangi jumlah foto atau gunakan ukuran lebih kecil.";
          } else {
            errorMsg = `Server error (${invRes.status}). Coba lagi nanti.`;
          }
        }
        throw new Error(errorMsg);
      }

      const invResult = await invRes.json();
      if (!invResult.invitation?.slug) {
        throw new Error(invResult.error || "Gagal membuat undangan. Coba lagi nanti.");
      }

      const invitationSlug = invResult.invitation.slug;
      const invitationId = invResult.invitation.id;

      setProcessingStep("finalizing");

      // ─── 4. Payment ───
      // In production, this should redirect to Midtrans/Xendit payment gateway.
      // For now, invitation is created as unpaid — user can still preview but
      // the invitation won't be publicly accessible until payment is confirmed.
      // TODO: Integrate Midtrans Snap API here:
      //   1. Call /api/payment/create-transaction to get Midtrans token
      //   2. Open Midtrans Snap payment popup
      //   3. On success callback, Midtrans webhook will mark isPaid=true

      // ─── 5. Done! Show success ───
      setPublishedSlug(invitationSlug);
      setState("success");
    } catch (err) {
      console.error("Checkout failed:", err);
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi.");
      setState("error");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const waMessage = encodeURIComponent(
    `Assalamu'alaikum\nKami mengundang Bapak/Ibu/Saudara/i untuk menghadiri pernikahan kami.\n\n${data.namaPria} & ${data.namaWanita}\n\nBuka undangan digital:\n${shareUrl}`
  );

  // ─── PROCESSING SCREEN ───
  if (state === "processing") {
    const stepLabels: Record<ProcessingStep, { text: string; sub: string }> = {
      "uploading-remaining": { text: "Menyiapkan file...", sub: "Memastikan semua foto & musik tersimpan" },
      creating: { text: "Membuat undangan...", sub: "Menyimpan data undangan" },
      finalizing: { text: "Menyelesaikan...", sub: "Hampir selesai!" },
    };
    const currentStep = stepLabels[processingStep];

    return (
      <div className="text-center py-16">
        <Loader2 className="size-10 animate-spin mx-auto text-[var(--gold)] mb-4" />
        <p className="text-sm text-muted-foreground font-medium">{currentStep.text}</p>
        <p className="text-xs text-muted-foreground/60 mt-1">{currentStep.sub}</p>
      </div>
    );
  }

  // ─── SUCCESS SCREEN ───
  if (state === "success" && publishedSlug) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6"
        >
          <PartyPopper className="size-12 text-green-600" />
        </motion.div>
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-foreground mb-2">
          Undangan Berhasil Dibuat!
        </h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          Undangan pernikahan <span className="font-semibold text-foreground">{data.namaPria} & {data.namaWanita}</span> sudah siap. Bagikan link di bawah ke tamu Anda.
        </p>

        {/* Share URL Card */}
        <div className="max-w-md mx-auto bg-card border border-border rounded-xl p-5 mb-6">
          <p className="text-xs text-muted-foreground mb-3 font-medium">Link Undangan Anda:</p>
          <div className="flex items-center gap-2 mb-4">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 bg-muted rounded-lg px-3 py-2.5 text-sm font-mono text-foreground truncate border-0 outline-none"
            />
            <Button size="sm" variant="outline" onClick={handleCopy} className="flex-shrink-0 cursor-pointer">
              {copied ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
            </Button>
          </div>

          <div className="flex gap-2">
            <a
              href={`https://wa.me/?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#25D366" }}
            >
              <Share2 className="size-4" />
              WhatsApp
            </a>
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[var(--burgundy)] text-[var(--ivory)] text-sm font-medium hover:bg-[var(--gold)] hover:text-[var(--burgundy)] transition-all"
            >
              <ExternalLink className="size-4" />
              Buka Undangan
            </a>
          </div>
        </div>

        {/* Tip */}
        <div className="max-w-md mx-auto bg-[var(--gold)]/5 border border-[var(--gold)]/20 rounded-lg p-3 mb-6">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-[var(--gold)]">Tips:</span> Tambahkan <code className="bg-muted px-1 py-0.5 rounded text-[10px]">?guest=Nama+Tamu</code> di akhir link untuk personalisasi nama tamu.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => { resetData(); window.location.href = "/"; }}
          className="border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--burgundy)] cursor-pointer"
        >
          Buat Undangan Lain
        </Button>
      </motion.div>
    );
  }

  // ─── ERROR SCREEN ───
  if (state === "error") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="size-10 text-red-500" />
        </div>
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-foreground mb-2">
          Gagal Membuat Undangan
        </h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          {errorMsg || "Terjadi kesalahan. Silakan coba lagi."}
        </p>
        <Button
          onClick={() => setState("form")}
          className="bg-[var(--burgundy)] text-[var(--ivory)] hover:bg-[var(--gold)] hover:text-[var(--burgundy)] transition-all cursor-pointer"
        >
          Coba Lagi
        </Button>
      </motion.div>
    );
  }

  // ─── FORM / MAIN SCREEN ───
  return (
    <div>
      <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-foreground mb-2">
        Dapatkan Link Undangan
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Klik tombol di bawah untuk membuat undangan dan mendapatkan link yang bisa dibagikan
      </p>

      {/* Validation warnings */}
      {!data.templateId && (
        <div className="mb-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 text-sm flex items-start gap-2">
          <AlertCircle className="size-4 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-yellow-700 dark:text-yellow-300">Template Belum Dipilih</p>
            <p className="text-xs mt-0.5 text-yellow-600 dark:text-yellow-400">Silakan pilih template dari halaman utama terlebih dahulu.</p>
          </div>
        </div>
      )}

      {/* Order Summary */}
      <div className="bg-card border border-border rounded-xl p-5 mb-6 space-y-4">
        <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold">Ringkasan Undangan</h3>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Template</span>
            <span className="font-medium">{data.templateName || "—"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Mempelai</span>
            <span className="font-medium">{data.namaPria || "—"} & {data.namaWanita || "—"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tanggal Akad</span>
            <span className="font-medium">
              {data.tanggalAkad
                ? new Date(data.tanggalAkad).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                : "—"}
            </span>
          </div>
          {data.punyaResepsi && data.tanggalResepsi && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Resepsi</span>
              <span className="font-medium">
                {new Date(data.tanggalResepsi).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Foto & Musik</span>
            <span className="font-medium">
              {[
                data.fotoPria && "Foto Pria",
                data.fotoWanita && "Foto Wanita",
                (data.fotoGallery?.length ?? 0) > 0 && `${data.fotoGallery!.length} Galeri`,
                data.fotoBackground && "Background",
                data.musikPilihan !== "none" && "Musik",
              ].filter(Boolean).join(", ") || "Belum ada"}
            </span>
          </div>
        </div>
      </div>

      {/* Features Included */}
      <div className="bg-[var(--gold)]/5 border border-[var(--gold)]/20 rounded-xl p-4 mb-6">
        <p className="text-xs font-semibold text-[var(--gold)] mb-2 uppercase tracking-wider">Fitur yang termasuk:</p>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            "RSVP Digital",
            "Buku Tamu",
            "Galeri Foto",
            "Musik Latar",
            "Amplop Digital",
            "Countdown Timer",
            "Peta Lokasi",
            "Our Story",
            "Love Quotes",
            "Bridesmaid",
            "Wedding Itinerary",
            "Welcome Video",
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Check className="size-3 text-[var(--gold)] flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Storage Info */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-6 text-xs flex items-start gap-2">
        <Check className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium text-green-700 dark:text-green-300">Cloud Storage Aktif</p>
          <p className="text-[10px] mt-0.5 text-green-600 dark:text-green-400">Semua foto & musik disimpan ke Cloudinary CDN. Cepat, aman, dan tidak ada batasan ukuran file!</p>
        </div>
      </div>

      {/* Pricing Info */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6 text-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-amber-700 dark:text-amber-300">Undangan Digital Premium</span>
          <span className="text-lg font-bold text-[var(--burgundy)]">Rp 99.000</span>
        </div>
        <p className="text-xs text-amber-600 dark:text-amber-400">Satu harga untuk semua fitur. Masa aktif 90 hari. Tanpa biaya tersembunyi.</p>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg p-3 text-sm flex items-start gap-2"
        >
          <AlertCircle className="size-4 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Gagal Membuat Undangan</p>
            <p className="text-xs mt-0.5">{errorMsg}</p>
          </div>
        </motion.div>
      )}

      {/* Get Link Button */}
      <div className="bg-gradient-to-r from-[var(--burgundy)]/5 to-[var(--gold)]/5 border border-[var(--gold)]/20 rounded-xl p-5 text-center">
        <Button
          size="lg"
          disabled={!data.templateId || !data.namaPria.trim() || !data.namaWanita.trim()}
          onClick={handleGetLink}
          className="bg-[var(--burgundy)] text-[var(--ivory)] hover:bg-[var(--gold)] hover:text-[var(--burgundy)] transition-all duration-300 font-semibold px-8 cursor-pointer disabled:opacity-40"
        >
          <Link2 className="size-5 mr-2" />
          Dapatkan Link Undangan
        </Button>
      </div>
    </div>
  );
}
