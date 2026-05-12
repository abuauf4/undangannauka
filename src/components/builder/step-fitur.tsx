"use client";

import { useBuilder } from "@/lib/builder-context";
import type { StoryMilestone, LoveQuote, WeddingPartyMember, ItineraryItem, BankAccount } from "@/lib/builder-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, GripVertical, Camera, X, Heart, Star, Home, Diamond, Loader2 } from "lucide-react";
import { useCallback, useState, useRef } from "react";
import { uploadImage } from "@/lib/upload-helper";

const iconOptions = [
  { value: 'heart', label: 'Hati', icon: Heart },
  { value: 'star', label: 'Bintang', icon: Star },
  { value: 'home', label: 'Rumah', icon: Home },
  { value: 'ring', label: 'Cincin', icon: Diamond },
] as const;

// ─── Photo Upload (uploads immediately to cloud) ───
function PhotoUpload({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = "";
      setUploading(true);
      try {
        // Upload directly to Supabase Storage (bypasses Vercel limit)
        const url = await uploadImage(file, `bg-${Date.now()}`, 1600, 0.8);
        onChange(url);
      } catch (err) {
        console.error("Upload failed:", err);
      } finally {
        setUploading(false);
      }
    },
    [onChange]
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
          <div className="flex flex-col items-center justify-center w-full aspect-video max-w-[200px] rounded-xl border-2 border-dashed border-[var(--gold)] bg-[var(--gold)]/5 gap-1">
            <Loader2 className="size-5 animate-spin text-[var(--gold)]" />
            <span className="text-[10px] text-muted-foreground">Mengupload...</span>
          </div>
        ) : value ? (
          <div className="relative w-full aspect-video max-w-[200px] rounded-xl overflow-hidden border-2 border-[var(--gold)]/30">
            <img src={value} alt={label} className="w-full h-full object-cover" />
            <button
              onClick={() => onChange("")}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-500 transition-colors cursor-pointer z-10"
            >
              <X className="size-3" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center w-full aspect-video max-w-[200px] rounded-xl border-2 border-dashed border-border hover:border-[var(--gold)] cursor-pointer transition-colors bg-muted/30 active:scale-95"
          >
            <Camera className="size-5 text-muted-foreground mb-1" />
            <span className="text-[10px] text-muted-foreground">Upload Foto</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Our Story Section ───
function OurStoryEditor() {
  const { data, setData } = useBuilder();
  const milestones = data.ourStory || [];

  const updateMilestone = (index: number, field: keyof StoryMilestone, value: string) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ourStory: updated });
  };

  const addMilestone = () => {
    setData({
      ourStory: [...milestones, { date: '', title: '', description: '', icon: 'heart' }],
    });
  };

  const removeMilestone = (index: number) => {
    setData({ ourStory: milestones.filter((_, i) => i !== index) });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[var(--burgundy)]">
          Cerita Kami (Our Story)
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={addMilestone}
          className="text-xs cursor-pointer"
        >
          <Plus className="size-3 mr-1" /> Tambah
        </Button>
      </div>
      <p className="text-[11px] text-muted-foreground">Milestone perjalanan cinta kalian. Maksimal 6 momen.</p>

      <div className="space-y-3">
        {milestones.map((m, i) => (
          <div key={i} className="relative bg-muted/30 rounded-lg p-3 space-y-2 border border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="size-4 text-muted-foreground/50" />
                <span className="text-xs font-semibold text-muted-foreground">Momen #{i + 1}</span>
              </div>
              <button
                onClick={() => removeMilestone(i)}
                className="text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-[11px]">Tahun / Tanggal</Label>
                <Input
                  value={m.date}
                  onChange={(e) => updateMilestone(i, 'date', e.target.value)}
                  placeholder="2024"
                  className="text-xs h-8"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px]">Ikon</Label>
                <Select
                  value={m.icon}
                  onValueChange={(v) => updateMilestone(i, 'icon', v)}
                >
                  <SelectTrigger className="text-xs h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">Judul</Label>
              <Input
                value={m.title}
                onChange={(e) => updateMilestone(i, 'title', e.target.value)}
                placeholder="Pertama Bertemu"
                className="text-xs h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">Deskripsi</Label>
              <Textarea
                value={m.description}
                onChange={(e) => updateMilestone(i, 'description', e.target.value)}
                placeholder="Ceritakan momen ini..."
                className="text-xs resize-none"
                rows={2}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Love Quotes Section ───
function LoveQuotesEditor() {
  const { data, setData } = useBuilder();
  const quotes = data.loveQuotes || [];

  const updateQuote = (index: number, field: keyof LoveQuote, value: string) => {
    const updated = [...quotes];
    updated[index] = { ...updated[index], [field]: value };
    setData({ loveQuotes: updated });
  };

  const addQuote = () => {
    setData({ loveQuotes: [...quotes, { text: '', source: '' }] });
  };

  const removeQuote = (index: number) => {
    setData({ loveQuotes: quotes.filter((_, i) => i !== index) });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[var(--burgundy)]">
          Kutipan Cinta (Love Quotes)
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={addQuote}
          className="text-xs cursor-pointer"
        >
          <Plus className="size-3 mr-1" /> Tambah
        </Button>
      </div>
      <p className="text-[11px] text-muted-foreground">Quote yang akan muncul bergantian di undangan. Bisa ayat, hadits, atau kutipan romantis.</p>

      <div className="space-y-3">
        {quotes.map((q, i) => (
          <div key={i} className="relative bg-muted/30 rounded-lg p-3 space-y-2 border border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Quote #{i + 1}</span>
              <button
                onClick={() => removeQuote(i)}
                className="text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">Teks Quote</Label>
              <Textarea
                value={q.text}
                onChange={(e) => updateQuote(i, 'text', e.target.value)}
                placeholder="Dan di antara tanda-tanda kekuasaan-Nya..."
                className="text-xs resize-none"
                rows={2}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px]">Sumber (opsional)</Label>
              <Input
                value={q.source || ''}
                onChange={(e) => updateQuote(i, 'source', e.target.value)}
                placeholder="QS. Ar-Rum: 21"
                className="text-xs h-8"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Bridesmaid & Groomsman Section ───
function WeddingPartyEditor() {
  const { data, setData } = useBuilder();

  const updateBridesmaid = (index: number, field: keyof WeddingPartyMember, value: string) => {
    const updated = [...(data.bridesmaids || [])];
    updated[index] = { ...updated[index], [field]: value };
    setData({ bridesmaids: updated });
  };

  const updateGroomsman = (index: number, field: keyof WeddingPartyMember, value: string) => {
    const updated = [...(data.groomsmen || [])];
    updated[index] = { ...updated[index], [field]: value };
    setData({ groomsmen: updated });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4">
      <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[var(--burgundy)]">
        Sahabat Mempelai
      </h3>
      <p className="text-[11px] text-muted-foreground">Nama bridesmaid dan groomsman yang mendampingi hari bahagia.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Groomsmen */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Groomsmen</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setData({ groomsmen: [...(data.groomsmen || []), { name: '', role: 'Groomsman' }] })}
              className="text-[10px] h-6 px-2 cursor-pointer"
            >
              <Plus className="size-2.5 mr-0.5" /> Tambah
            </Button>
          </div>
          {(data.groomsmen || []).map((g, i) => (
            <div key={i} className="flex gap-1.5 items-center">
              <Input
                value={g.name}
                onChange={(e) => updateGroomsman(i, 'name', e.target.value)}
                placeholder="Nama"
                className="text-xs h-8 flex-1"
              />
              <Input
                value={g.role || ''}
                onChange={(e) => updateGroomsman(i, 'role', e.target.value)}
                placeholder="Role"
                className="text-xs h-8 w-24"
              />
              <button
                onClick={() => setData({ groomsmen: (data.groomsmen || []).filter((_, j) => j !== i) })}
                className="text-muted-foreground hover:text-red-500 cursor-pointer"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Bridesmaids */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Bridesmaids</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setData({ bridesmaids: [...(data.bridesmaids || []), { name: '', role: 'Bridesmaid' }] })}
              className="text-[10px] h-6 px-2 cursor-pointer"
            >
              <Plus className="size-2.5 mr-0.5" /> Tambah
            </Button>
          </div>
          {(data.bridesmaids || []).map((b, i) => (
            <div key={i} className="flex gap-1.5 items-center">
              <Input
                value={b.name}
                onChange={(e) => updateBridesmaid(i, 'name', e.target.value)}
                placeholder="Nama"
                className="text-xs h-8 flex-1"
              />
              <Input
                value={b.role || ''}
                onChange={(e) => updateBridesmaid(i, 'role', e.target.value)}
                placeholder="Role"
                className="text-xs h-8 w-24"
              />
              <button
                onClick={() => setData({ bridesmaids: (data.bridesmaids || []).filter((_, j) => j !== i) })}
                className="text-muted-foreground hover:text-red-500 cursor-pointer"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Wedding Itinerary Section ───
function ItineraryEditor() {
  const { data, setData } = useBuilder();
  const items = data.weddingItinerary || [];

  const updateItem = (index: number, field: keyof ItineraryItem, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setData({ weddingItinerary: updated });
  };

  const addItem = () => {
    setData({ weddingItinerary: [...items, { time: '', event: '', description: '' }] });
  };

  const removeItem = (index: number) => {
    setData({ weddingItinerary: items.filter((_, i) => i !== index) });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[var(--burgundy)]">
          Susunan Acara (Itinerary)
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={addItem}
          className="text-xs cursor-pointer"
        >
          <Plus className="size-3 mr-1" /> Tambah
        </Button>
      </div>
      <p className="text-[11px] text-muted-foreground">Rangkaian acara di hari pernikahan.</p>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-1.5 items-start">
            <Input
              type="time"
              value={item.time}
              onChange={(e) => updateItem(i, 'time', e.target.value)}
              className="text-xs h-8 w-24"
            />
            <div className="flex-1 space-y-1">
              <Input
                value={item.event}
                onChange={(e) => updateItem(i, 'event', e.target.value)}
                placeholder="Nama acara"
                className="text-xs h-8"
              />
              <Input
                value={item.description}
                onChange={(e) => updateItem(i, 'description', e.target.value)}
                placeholder="Deskripsi singkat"
                className="text-xs h-8"
              />
            </div>
            <button
              onClick={() => removeItem(i)}
              className="text-muted-foreground hover:text-red-500 mt-1 cursor-pointer"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Amplop Digital Section ───
function AmplopDigitalEditor() {
  const { data, setData } = useBuilder();
  const accounts = data.amplopDigital || [];

  const updateAccount = (index: number, field: keyof BankAccount, value: string) => {
    const updated = [...accounts];
    updated[index] = { ...updated[index], [field]: value };
    setData({ amplopDigital: updated });
  };

  const addAccount = () => {
    setData({ amplopDigital: [...accounts, { bank: '', accountNumber: '', accountHolder: '' }] });
  };

  const removeAccount = (index: number) => {
    setData({ amplopDigital: accounts.filter((_, i) => i !== index) });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[var(--burgundy)]">
          Amplop Digital (Rekening)
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={addAccount}
          className="text-xs cursor-pointer"
        >
          <Plus className="size-3 mr-1" /> Tambah
        </Button>
      </div>
      <p className="text-[11px] text-muted-foreground">Nomor rekening untuk amplop digital. Nama pemilik rekening akan otomatis menggunakan nama mempelai jika dikosongkan.</p>

      <div className="space-y-3">
        {accounts.map((acc, i) => (
          <div key={i} className="relative bg-muted/30 rounded-lg p-3 space-y-2 border border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Rekening #{i + 1}</span>
              <button
                onClick={() => removeAccount(i)}
                className="text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-[11px]">Bank</Label>
                <Input
                  value={acc.bank}
                  onChange={(e) => updateAccount(i, 'bank', e.target.value)}
                  placeholder="BCA"
                  className="text-xs h-8"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px]">No. Rekening</Label>
                <Input
                  value={acc.accountNumber}
                  onChange={(e) => updateAccount(i, 'accountNumber', e.target.value)}
                  placeholder="1234567890"
                  className="text-xs h-8"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px]">Atas Nama</Label>
                <Input
                  value={acc.accountHolder}
                  onChange={(e) => updateAccount(i, 'accountHolder', e.target.value)}
                  placeholder={i === 0 ? data.namaPria || 'Nama Pria' : data.namaWanita || 'Nama Wanita'}
                  className="text-xs h-8"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Welcome Video Section ───
function WelcomeVideoEditor() {
  const { data, setData } = useBuilder();

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4">
      <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[var(--burgundy)]">
        Video Perkenalan
      </h3>
      <p className="text-[11px] text-muted-foreground">URL video yang akan muncul di undangan. Kosongkan jika tidak ada.</p>
      <div className="space-y-2">
        <Label className="text-sm font-medium">URL Video</Label>
        <Input
          value={data.welcomeVideo}
          onChange={(e) => setData({ welcomeVideo: e.target.value })}
          placeholder="https://youtube.com/... atau URL video langsung"
          className="border-border focus:border-[var(--gold)] text-xs"
        />
        <p className="text-[10px] text-muted-foreground">Support: YouTube, Vimeo, atau URL video langsung (mp4, webm)</p>
      </div>
    </div>
  );
}

// ─── Background Photo Section ───
function BackgroundPhotoEditor() {
  const { data, setData } = useBuilder();

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4">
      <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[var(--burgundy)]">
        Foto Background Mempelai
      </h3>
      <p className="text-[11px] text-muted-foreground">Foto latar belakang di section mempelai. Kosongkan untuk menggunakan background default.</p>
      <PhotoUpload
        label="Foto Background"
        value={data.fotoBackground}
        onChange={(v) => setData({ fotoBackground: v })}
      />
    </div>
  );
}

// ─── Main Step Component ───
export function StepFitur() {
  const { data, setData, step, setStep } = useBuilder();

  return (
    <div>
      <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-foreground mb-2">
        Fitur Tambahan
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Kustomisasi konten lengkap undangan Anda
      </p>

      <div className="space-y-5">
        <BackgroundPhotoEditor />
        <OurStoryEditor />
        <LoveQuotesEditor />
        <ItineraryEditor />
        <WeddingPartyEditor />
        <AmplopDigitalEditor />
        <WelcomeVideoEditor />
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
