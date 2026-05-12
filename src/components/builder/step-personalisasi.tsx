"use client";

import { useBuilder } from "@/lib/builder-context";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Camera, Music, X, Loader2, Upload, Plus, Trash2, FileAudio, Cloud } from "lucide-react";
import { useCallback, useState, useRef } from "react";
import { uploadImage, uploadAudio, isBase64DataUrl, isCloudUrl } from "@/lib/upload-helper";

const musikOptions = [
  { value: "none", label: "Tanpa Musik" },
  { value: "nasyid", label: "Nasyid Islami" },
  { value: "gamelan", label: "Gamelan Bali" },
  { value: "piano", label: "Piano Romantic" },
  { value: "acoustic", label: "Acoustic Guitar" },
  { value: "strings", label: "String Orchestra" },
  { value: "custom", label: "🎵 Upload Musik Sendiri" },
];

const MAX_GALLERY = 10;

function PhotoUpload({
  label,
  value,
  onChange,
  maxWidth = 800,
  quality = 0.8,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  maxWidth?: number;
  quality?: number;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = "";
      setUploading(true);
      setError(null);
      try {
        // Upload directly to Supabase Storage (bypasses Vercel limit)
        const url = await uploadImage(file, `photo-${Date.now()}`, maxWidth, quality);
        onChange(url);
      } catch (err) {
        console.error("Upload failed:", err);
        setError("Upload gagal. Coba lagi.");
      } finally {
        setUploading(false);
      }
    },
    [onChange, maxWidth, quality]
  );

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="relative">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
        {uploading ? (
          <div className="flex flex-col items-center justify-center w-full aspect-square max-w-[160px] rounded-xl border-2 border-dashed border-[var(--gold)] bg-[var(--gold)]/5 gap-2">
            <Loader2 className="size-5 animate-spin text-[var(--gold)]" />
            <span className="text-[10px] text-muted-foreground">Mengupload...</span>
          </div>
        ) : value ? (
          <div className="relative w-full aspect-square max-w-[160px] rounded-xl overflow-hidden border-2 border-[var(--gold)]/30">
            <img src={value} alt={label} className="w-full h-full object-cover" />
            <button
              onClick={() => onChange("")}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-500 transition-colors cursor-pointer z-10"
            >
              <X className="size-3" />
            </button>
            {isBase64DataUrl(value) && (
              <div className="absolute bottom-1 left-1 bg-yellow-500/80 text-white text-[8px] px-1.5 py-0.5 rounded font-medium">
                LOKAL
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center w-full aspect-square max-w-[160px] rounded-xl border-2 border-dashed border-border hover:border-[var(--gold)] hover:bg-[var(--gold)]/5 cursor-pointer transition-all bg-muted/30 active:scale-95"
          >
            <Camera className="size-6 text-muted-foreground mb-1" />
            <span className="text-[11px] text-muted-foreground">Upload Foto</span>
          </button>
        )}
      </div>
      {error && <p className="text-[10px] text-red-500">{error}</p>}
    </div>
  );
}

export function StepPersonalisasi() {
  const { data, setData, step, setStep } = useBuilder();
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [musicUploading, setMusicUploading] = useState(false);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [musicError, setMusicError] = useState<string | null>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const musicInputRef = useRef<HTMLInputElement>(null);

  const handleGalleryAdd = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      e.target.value = "";

      setGalleryUploading(true);
      setGalleryError(null);
      try {
        const remaining = MAX_GALLERY - (data.fotoGallery?.length ?? 0);
        const toProcess = Array.from(files).slice(0, remaining);

        const uploadedUrls: string[] = [];
        for (const file of toProcess) {
          // Upload each photo immediately to Supabase Storage
          const url = await uploadImage(file, `gallery-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, 1000, 0.8);
          uploadedUrls.push(url);
        }

        setData(prev => ({
          fotoGallery: [...(prev.fotoGallery || []), ...uploadedUrls].slice(0, MAX_GALLERY),
        }));
      } catch (err) {
        console.error("Gallery upload failed:", err);
        setGalleryError("Upload galeri gagal. Coba lagi.");
      } finally {
        setGalleryUploading(false);
      }
    },
    [data.fotoGallery, setData]
  );

  const handleMusicUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = "";

      // Check file size upfront
      if (file.size > 10 * 1024 * 1024) {
        setMusicError("File musik terlalu besar (maks 10MB). Gunakan file yang lebih kecil.");
        return;
      }

      setMusicUploading(true);
      setMusicError(null);
      try {
        const url = await uploadAudio(file);
        setData({ musikPilihan: "custom", customMusicUrl: url });
      } catch (err) {
        console.error("Music upload failed:", err);
        const msg = err instanceof Error ? err.message : "Upload musik gagal. Coba lagi.";
        setMusicError(msg);
      } finally {
        setMusicUploading(false);
      }
    },
    [setData]
  );

  const handleRemoveCustomMusic = useCallback(() => {
    setData({ musikPilihan: "none", customMusicUrl: "" });
  }, [setData]);

  const isCustomMusic = data.musikPilihan === "custom";

  // Check if any files are stored as base64 (not cloud)
  const hasLocalFiles =
    (data.fotoPria && isBase64DataUrl(data.fotoPria)) ||
    (data.fotoWanita && isBase64DataUrl(data.fotoWanita)) ||
    (data.fotoBackground && isBase64DataUrl(data.fotoBackground)) ||
    (data.customMusicUrl && isBase64DataUrl(data.customMusicUrl)) ||
    (data.fotoGallery || []).some(url => isBase64DataUrl(url));

  return (
    <div>
      <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-foreground mb-2">
        Personalisasi
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Tambahkan foto dan musik untuk undangan Anda
      </p>

      <div className="space-y-6">
        {/* Foto Mempelai */}
        <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
          <h3 className="font-medium text-sm text-foreground mb-4">Foto Mempelai</h3>
          <div className="flex gap-4">
            <PhotoUpload
              label="Foto Pria"
              value={data.fotoPria}
              onChange={(v) => setData({ fotoPria: v })}
            />
            <PhotoUpload
              label="Foto Wanita"
              value={data.fotoWanita}
              onChange={(v) => setData({ fotoWanita: v })}
            />
          </div>
        </div>

        {/* Galeri Foto */}
        <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm text-foreground">Galeri Foto</h3>
            <span className="text-[11px] text-muted-foreground">{data.fotoGallery?.length ?? 0}/{MAX_GALLERY}</span>
          </div>

          {/* Hidden file input for gallery */}
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryAdd}
            className="hidden"
          />

          <div className="flex flex-wrap gap-3">
            {(data.fotoGallery || []).map((url, idx) => (
              <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group">
                <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => setData({ fotoGallery: (data.fotoGallery || []).filter((_, i) => i !== idx) })}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 z-10"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
            {(data.fotoGallery?.length ?? 0) < MAX_GALLERY && (
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                disabled={galleryUploading}
                className="flex flex-col items-center justify-center w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-[var(--gold)] hover:bg-[var(--gold)]/5 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
              >
                {galleryUploading ? (
                  <Loader2 className="size-5 animate-spin text-[var(--gold)]" />
                ) : (
                  <>
                    <Plus className="size-5 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground mt-0.5">Tambah</span>
                  </>
                )}
              </button>
            )}
          </div>
          {galleryError && <p className="text-[10px] text-red-500 mt-2">{galleryError}</p>}
          <p className="text-[11px] text-muted-foreground mt-2">Maksimal {MAX_GALLERY} foto. Format: JPG, PNG. Foto langsung disimpan ke cloud.</p>
        </div>

        {/* Musik */}
        <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <Music className="size-4 text-[var(--gold)]" />
            <h3 className="font-medium text-sm text-foreground">Musik Latar</h3>
          </div>

          <Select
            value={data.musikPilihan}
            onValueChange={(v) => setData({ musikPilihan: v })}
          >
            <SelectTrigger className="border-border">
              <SelectValue placeholder="Pilih musik latar" />
            </SelectTrigger>
            <SelectContent>
              {musikOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Custom music upload area */}
          {isCustomMusic && (
            <div className="mt-3">
              <input
                ref={musicInputRef}
                type="file"
                accept="audio/*"
                onChange={handleMusicUpload}
                className="hidden"
              />
              {data.customMusicUrl ? (
                <div className="flex items-center gap-3 bg-[var(--gold)]/5 border border-[var(--gold)]/20 rounded-lg p-3">
                  <FileAudio className="size-5 text-[var(--gold)] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">Musik berhasil diupload</p>
                    <p className="text-[10px] text-muted-foreground">Musik custom Anda akan diputar di undangan</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCustomMusic}
                    className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => musicInputRef.current?.click()}
                  disabled={musicUploading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-dashed border-border hover:border-[var(--gold)] hover:bg-[var(--gold)]/5 cursor-pointer transition-all text-sm text-muted-foreground hover:text-foreground active:scale-[0.98] disabled:opacity-50"
                >
                  {musicUploading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Mengupload...
                    </>
                  ) : (
                    <>
                      <Upload className="size-4" />
                      Upload Musik (MP3, WAV, OGG)
                    </>
                  )}
                </button>
              )}
              {musicError && <p className="text-[10px] text-red-500 mt-2">{musicError}</p>}
            </div>
          )}

          <p className="text-[11px] text-muted-foreground mt-2">Pilih dari daftar atau upload musik sendiri. Tidak ada batasan ukuran file — langsung disimpan ke cloud storage.</p>
        </div>

        {/* Storage Status Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-xs flex items-start gap-2">
          <Cloud className="size-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-blue-700 dark:text-blue-300">Cloud Storage Aktif</p>
            <p className="text-[10px] mt-0.5 text-blue-600 dark:text-blue-400">Semua foto & musik langsung disimpan ke cloud storage. Tidak ada batasan jumlah foto atau ukuran file musik!</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setStep(step - 1)}
          className="px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:border-[var(--gold)] hover:text-foreground transition-all"
        >
          ← Kembali
        </button>
        <button
          onClick={() => setStep(step + 1)}
          className="px-6 py-2.5 rounded-lg bg-[var(--burgundy)] text-[var(--ivory)] font-medium text-sm hover:bg-[var(--gold)] hover:text-[var(--burgundy)] transition-all"
        >
          Lanjut →
        </button>
      </div>
    </div>
  );
}
