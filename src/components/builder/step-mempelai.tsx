"use client";

import { useBuilder } from "@/lib/builder-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

const greetingOptions = [
  { value: "Bismillahirrahmanirrahim", label: "Bismillahirrahmanirrahim (Islam)" },
  { value: "Assalamu'alaikum", label: "Assalamu'alaikum (Islam)" },
  { value: "Om Swastiastu", label: "Om Swastiastu (Hindu Bali)" },
  { value: "Horas!", label: "Horas! (Batak)" },
  { value: "The Wedding of", label: "The Wedding of (Umum)" },
  { value: "ようこそ", label: "ようこそ (Jepang)" },
  { value: "custom", label: "Custom / Lainnya" },
];

export function StepMempelai() {
  const { data, setData, step, setStep } = useBuilder();
  const router = useRouter();

  const canNext = data.namaPria.trim() && data.namaWanita.trim();

  return (
    <div>
      <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-foreground mb-2">
        Data Mempelai
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Isi nama mempelai dan orang tua
      </p>

      <div className="space-y-5">
        {/* Nama Mempelai */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="namaPria" className="text-sm font-medium">Nama Mempelai Pria *</Label>
            <Input
              id="namaPria"
              placeholder="Ahmad"
              value={data.namaPria}
              onChange={(e) => setData({ namaPria: e.target.value })}
              className="border-border focus:border-[var(--gold)]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="namaWanita" className="text-sm font-medium">Nama Mempelai Wanita *</Label>
            <Input
              id="namaWanita"
              placeholder="Fatimah"
              value={data.namaWanita}
              onChange={(e) => setData({ namaWanita: e.target.value })}
              className="border-border focus:border-[var(--gold)]"
            />
          </div>
        </div>

        {/* Orang Tua */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ortuPria" className="text-sm font-medium">Nama Orang Tua Pria</Label>
            <Input
              id="ortuPria"
              placeholder="Bpk. H. Sulaiman & Ibu Hj. Aminah"
              value={data.namaOrtuPria}
              onChange={(e) => setData({ namaOrtuPria: e.target.value })}
              className="border-border focus:border-[var(--gold)]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ortuWanita" className="text-sm font-medium">Nama Orang Tua Wanita</Label>
            <Input
              id="ortuWanita"
              placeholder="Bpk. H. Abdullah & Ibu Hj. Khadijah"
              value={data.namaOrtuWanita}
              onChange={(e) => setData({ namaOrtuWanita: e.target.value })}
              className="border-border focus:border-[var(--gold)]"
            />
          </div>
        </div>

        {/* Greeting */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Salam Pembuka / Greeting</Label>
          <Select
            value={data.greeting === "" ? "_empty" : data.greeting}
            onValueChange={(v) => setData({ greeting: v === "_empty" ? "" : v })}
          >
            <SelectTrigger className="border-border">
              <SelectValue placeholder="Pilih salam pembuka" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_empty">— Tidak ada —</SelectItem>
              {greetingOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ayat / Quote */}
        <div className="space-y-2">
          <Label htmlFor="ayatQuote" className="text-sm font-medium">Ayat / Quote</Label>
          <Textarea
            id="ayatQuote"
            placeholder="Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan-pasangan dari jenismu sendiri..."
            value={data.ayatQuote}
            onChange={(e) => setData({ ayatQuote: e.target.value })}
            rows={3}
            className="border-border focus:border-[var(--gold)] resize-none"
          />
          <p className="text-[11px] text-muted-foreground">Opsional. Bisa ayat Al-Quran, kutipan, atau kata-kata romantis.</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:border-[var(--gold)] hover:text-foreground transition-all"
        >
          ← Kembali
        </button>
        <button
          disabled={!canNext}
          onClick={() => setStep(step + 1)}
          className="px-6 py-2.5 rounded-lg bg-[var(--burgundy)] text-[var(--ivory)] font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--gold)] hover:text-[var(--burgundy)] transition-all"
        >
          Lanjut →
        </button>
      </div>
    </div>
  );
}
