"use client";

import { useBuilder } from "@/lib/builder-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function StepAcara() {
  const { data, setData, step, setStep } = useBuilder();

  return (
    <div>
      <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-foreground mb-2">
        Detail Acara
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Isi informasi tanggal, waktu, dan lokasi acara
      </p>

      <div className="space-y-6">
        {/* Akad Nikah */}
        <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4">
          <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[var(--burgundy)]">
            Akad Nikah
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tanggal</Label>
              <Input
                type="date"
                value={data.tanggalAkad}
                onChange={(e) => setData({ tanggalAkad: e.target.value })}
                className="border-border focus:border-[var(--gold)]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Waktu</Label>
              <Input
                type="time"
                value={data.waktuAkad}
                onChange={(e) => setData({ waktuAkad: e.target.value })}
                className="border-border focus:border-[var(--gold)]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Nama Lokasi / Venue</Label>
            <Input
              placeholder="Masjid Agung Al-Azhar"
              value={data.lokasiAkad}
              onChange={(e) => setData({ lokasiAkad: e.target.value })}
              className="border-border focus:border-[var(--gold)]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Alamat Lengkap</Label>
            <Input
              placeholder="Jl. Sisingamangaraja, Kebayoran Baru, Jakarta Selatan"
              value={data.alamatAkad}
              onChange={(e) => setData({ alamatAkad: e.target.value })}
              className="border-border focus:border-[var(--gold)]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Google Maps URL</Label>
            <Input
              placeholder="https://maps.google.com/..."
              value={data.mapsAkadUrl}
              onChange={(e) => setData({ mapsAkadUrl: e.target.value })}
              className="border-border focus:border-[var(--gold)] text-xs"
            />
            <p className="text-[11px] text-muted-foreground">Opsional. Embed peta lokasi di undangan.</p>
          </div>
        </div>

        {/* Resepsi Toggle */}
        <div className="flex items-center justify-between bg-card border border-border rounded-xl p-4">
          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-foreground">
              Resepsi
            </h3>
            <p className="text-xs text-muted-foreground">Tambahkan detail resepsi</p>
          </div>
          <Switch
            checked={data.punyaResepsi}
            onCheckedChange={(v) => setData({ punyaResepsi: v })}
          />
        </div>

        {/* Resepsi Fields */}
        {data.punyaResepsi && (
          <div className="bg-card border border-border rounded-xl p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tanggal</Label>
                <Input
                  type="date"
                  value={data.tanggalResepsi}
                  onChange={(e) => setData({ tanggalResepsi: e.target.value })}
                  className="border-border focus:border-[var(--gold)]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Waktu</Label>
                <Input
                  type="time"
                  value={data.waktuResepsi}
                  onChange={(e) => setData({ waktuResepsi: e.target.value })}
                  className="border-border focus:border-[var(--gold)]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nama Lokasi / Venue</Label>
              <Input
                placeholder="The Ritz-Carlton Jakarta"
                value={data.lokasiResepsi}
                onChange={(e) => setData({ lokasiResepsi: e.target.value })}
                className="border-border focus:border-[var(--gold)]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Alamat Lengkap</Label>
              <Input
                placeholder="Pacific Place, SCBD, Jakarta Selatan"
                value={data.alamatResepsi}
                onChange={(e) => setData({ alamatResepsi: e.target.value })}
                className="border-border focus:border-[var(--gold)]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Google Maps URL</Label>
              <Input
                placeholder="https://maps.google.com/..."
                value={data.mapsResepsiUrl}
                onChange={(e) => setData({ mapsResepsiUrl: e.target.value })}
                className="border-border focus:border-[var(--gold)] text-xs"
              />
            </div>
          </div>
        )}
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
