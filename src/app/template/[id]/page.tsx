'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Heart, Loader2, MoonStar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DynamicInvitationPreview } from '@/components/invitation/dynamic-invitation-preview';
import { InvitationThemeProvider } from '@/components/invitation/theme-provider';
import { demoData } from '@/lib/demo-data';

/* ─── DB Template type (from API) ─── */
interface DbTemplate {
  id: string;
  name: string;
  description: string | null;
  thumbnail: string | null;
  nuansa: string;
  adat: string;
  design: string;
  config: Record<string, unknown>;
  isDefault: boolean;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

/* ─── Gradient map ─── */
function getGradientForTemplate(nuansa: string, adat: string): string {
  const key = `${nuansa}-${adat}`;
  const gradients: Record<string, string> = {
    'islam-jawa': 'from-[#800020] via-[#5C0015] to-[#C9A84C]',
    'islam-sunda': 'from-[#1a472a] via-[#2d6a4f] to-[#C9A84C]',
    'islam-batak': 'from-[#5C0015] via-[#8B0000] to-[#C9A84C]',
    'islam-bali': 'from-[#4a1942] via-[#800020] to-[#C9A84C]',
    'islam-arab': 'from-[#1a3c34] via-[#2d5a4e] to-[#C9A84C]',
    'umum-jawa': 'from-[#800020] via-[#5C0015] to-[#C9A84C]',
    'umum-sunda': 'from-[#2d6a4f] via-[#1a472a] to-[#D4AF37]',
    'umum-batak': 'from-[#8B0000] via-[#5C0015] to-[#D4AF37]',
  };
  return gradients[key] || 'from-[#800020] via-[#5C0015] to-[#C9A84C]';
}

/* ─── Badge based on isDefault + design ─── */
function getBadgeForTemplate(isDefault: boolean, design: string): string {
  if (isDefault) return 'Best Seller';
  const badges: Record<string, string> = {
    mewah: 'Premium',
    luxury: 'Luxury',
    classic: 'Klasik',
    modern: 'Modern',
    simple: 'Minimalis',
    rustic: 'Rustic',
    bohemian: 'Bohemian',
  };
  return badges[design] || 'Baru';
}

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;

  const [template, setTemplate] = useState<DbTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTemplate() {
      try {
        const res = await fetch(`/api/template/${templateId}`);
        if (res.ok) {
          const data = await res.json();
          setTemplate(data.template);
        } else if (res.status === 404) {
          setError('not_found');
        } else {
          setError('error');
        }
      } catch (err) {
        console.error('Failed to fetch template:', err);
        setError('error');
      } finally {
        setLoading(false);
      }
    }
    fetchTemplate();
  }, [templateId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--ivory)] flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[var(--gold)]" />
      </div>
    );
  }

  if (error === 'not_found' || !template) {
    return (
      <div className="min-h-screen bg-[var(--ivory)] flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold text-[var(--burgundy)] mb-2">
            Template Tidak Ditemukan
          </h1>
          <p className="text-muted-foreground mb-6">
            Maaf, template yang Anda cari tidak tersedia.
          </p>
          <Button
            onClick={() => router.push('/')}
            className="bg-[var(--burgundy)] text-[var(--ivory)] hover:bg-[var(--gold)] hover:text-[var(--burgundy)] transition-all"
          >
            <ArrowLeft className="size-4 mr-2" />
            Kembali ke Beranda
          </Button>
        </motion.div>
      </div>
    );
  }

  const nuansaLabels = [template.nuansa === 'islam' ? 'Islami' : 'Umum'];
  const adatLabels = [template.adat.charAt(0).toUpperCase() + template.adat.slice(1)];
  const designLabels = [template.design.charAt(0).toUpperCase() + template.design.slice(1)];
  const badge = getBadgeForTemplate(template.isDefault, template.design);

  const handleUseTemplate = () => {
    router.push(`/builder?template=${template.id}`);
  };

  return (
    <div className="min-h-screen bg-[var(--ivory)]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--ivory)]/90 backdrop-blur-md border-b border-[var(--gold)]/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Kembali</span>
            </button>
            <span className="font-[family-name:var(--font-playfair)] text-lg font-bold">
              Undangan<span className="gold-gradient-text">Nauka</span>
            </span>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left: Full Invitation Preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex-shrink-0 flex justify-center"
          >
            <div className="relative w-full max-w-[400px]">
              {/* iPhone Frame wrapping the full invitation */}
              <div className="relative w-full aspect-[9/19.5] bg-gray-900 rounded-[32px] p-[4px] shadow-2xl border border-gray-700/50 mx-auto">
                {/* Dynamic Island */}
                <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[90px] h-[22px] bg-black rounded-full z-30" />
                {/* Screen with invitation preview */}
                <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-[#FFFBF5]">
                  <div className="absolute inset-0 overflow-y-auto overflow-x-hidden scrollbar-hide">
                    <InvitationThemeProvider nuansa={template.nuansa || 'islam'} adat={template.adat || 'jawa'} tingkat={template.design || 'mewah'}>
                      <DynamicInvitationPreview data={demoData} previewMode />
                    </InvitationThemeProvider>
                  </div>
                </div>
                {/* Home indicator */}
                <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[90px] h-[4px] bg-white/30 rounded-full z-30" />
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Preview tampilan undangan
              </p>
            </div>
          </motion.div>

          {/* Right: Template Info + CTA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="flex-1 min-w-0"
          >
            {/* Badge */}
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-[var(--gold)] text-white border-none shadow-md text-sm px-3 py-1">
                {badge}
              </Badge>
              <Badge variant="outline" className="border-[var(--gold)]/30 text-[var(--gold)] text-sm">
                <MoonStar className="size-3 mr-1" />
                {template.adat.charAt(0).toUpperCase() + template.adat.slice(1)}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-foreground mb-3">
              {template.name}
            </h1>

            {/* Description */}
            <p className="text-base text-muted-foreground mb-6 leading-relaxed">
              {template.description || `Template undangan pernikahan dengan nuansa ${template.nuansa === 'islam' ? 'Islami' : 'Umum'} dan adat ${template.adat.charAt(0).toUpperCase() + template.adat.slice(1)}.`}
            </p>

            {/* Tags */}
            <div className="space-y-3 mb-8">
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Nuansa</span>
                <div className="flex flex-wrap gap-1.5">
                  {nuansaLabels.map((label) => (
                    <Badge key={label} variant="secondary" className="bg-[var(--burgundy)]/10 text-[var(--burgundy)] text-xs">
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Adat & Budaya</span>
                <div className="flex flex-wrap gap-1.5">
                  {adatLabels.map((label) => (
                    <Badge key={label} variant="secondary" className="bg-[var(--gold)]/10 text-[var(--gold)] border-[var(--gold)]/20 text-xs">
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Gaya Desain</span>
                <div className="flex flex-wrap gap-1.5">
                  {designLabels.map((label) => (
                    <Badge key={label} variant="secondary" className="bg-[var(--burgundy)]/10 text-[var(--burgundy)] text-xs">
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="bg-card border border-[var(--gold)]/20 rounded-xl p-5 mb-6">
              <div className="flex items-end gap-2 mb-1">
                <span className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[var(--burgundy)]">
                  Rp 99.000
                </span>
                <span className="text-sm text-muted-foreground mb-1">/ undangan</span>
              </div>
              <p className="text-xs text-muted-foreground">Sudah termasuk semua fitur premium — tanpa biaya tersembunyi</p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-2 mb-8">
              {[
                'RSVP Digital',
                'Buku Tamu',
                'Galeri Foto',
                'Musik Latar',
                'Amplop Digital',
                'Countdown Timer',
                'Peta Lokasi',
                'Berbagi WhatsApp',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="size-4 text-[var(--gold)] flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* MAU YANG INI - Big CTA */}
            <Button
              size="lg"
              onClick={handleUseTemplate}
              className="w-full bg-[var(--burgundy)] text-[var(--ivory)] hover:bg-[var(--gold)] hover:text-[var(--burgundy)] transition-all duration-300 text-lg h-14 shadow-xl relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Heart className="size-5 group-hover:scale-110 transition-transform" />
                Mau Yang Ini
                <ArrowRight className="size-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-3">
              Klik untuk mulai isi data undangan Anda
            </p>
          </motion.div>
        </div>

      </main>
    </div>
  );
}
