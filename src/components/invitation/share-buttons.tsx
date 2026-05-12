'use client';

import { useState } from 'react';
import { MessageCircle, Link2, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { SectionReveal } from './section-reveal';

interface ShareButtonsProps {
  namaPria?: string;
  namaWanita?: string;
  previewMode?: boolean;
}

export function ShareButtons({ namaPria = 'Ahmad Fauzan', namaWanita = 'Aisyah Putri', previewMode = false }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText =
    `Anda diundang ke pernikahan ${namaPria} & ${namaWanita}. Buka undangan:`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link tersalin!', {
        description: 'Link undangan telah disalin ke clipboard.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Gagal menyalin', {
        description: 'Silakan salin link secara manual.',
      });
    }
  };

  const handleWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(waUrl, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Undangan Pernikahan ${namaPria} & ${namaWanita}`,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <section className="relative py-16 md:py-24" style={{ backgroundColor: 'var(--inv-bg)' }}>
      <div className="mx-auto max-w-4xl px-4 text-center">
        <SectionReveal direction="scale">
          <h2
            className="font-serif text-3xl font-bold md:text-4xl"
            style={{ color: 'var(--inv-primary)', fontFamily: 'var(--font-playfair)' }}
          >
            Bagikan Undangan
          </h2>
        </SectionReveal>

        <SectionReveal direction="fade" delay={0.2}>
          <div className="mx-auto my-6 flex w-32 items-center justify-center gap-2">
            <div className="h-px flex-1" style={{ backgroundColor: 'var(--inv-accent)' }} />
            <svg width="12" height="12" viewBox="0 0 16 16" style={{ fill: 'var(--inv-accent)' }}>
              <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6Z" />
            </svg>
            <div className="h-px flex-1" style={{ backgroundColor: 'var(--inv-accent)' }} />
          </div>
        </SectionReveal>

        <SectionReveal direction="fade" delay={0.3}>
          <p className="mx-auto mb-8 max-w-md text-sm" style={{ color: 'var(--inv-text-muted)' }}>
            Sebarkan kebahagiaan ini dengan membagikan undangan kepada orang-orang terdekat
          </p>
        </SectionReveal>

        <SectionReveal direction="scale" delay={0.4}>
          {previewMode ? (
            <div
              className="mx-auto max-w-md rounded py-5 text-center text-sm uppercase tracking-widest opacity-50"
              style={{
                backgroundColor: 'var(--inv-primary)',
                color: 'var(--inv-accent)',
                border: '1px solid var(--inv-accent)',
              }}
            >
              Tombol berbagi aktif setelah undangan dipublikasikan
            </div>
          ) : (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* WhatsApp */}
            <Button
              onClick={handleWhatsApp}
              className="cursor-pointer gap-2 px-6"
              style={{
                backgroundColor: '#25D366', // WhatsApp brand color - keep as-is
                color: 'white',
                border: 'none',
              }}
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>

            {/* Copy Link */}
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="cursor-pointer gap-2 px-6"
              style={{
                borderColor: 'var(--inv-accent)',
                color: 'var(--inv-primary)',
                backgroundColor: copied ? 'color-mix(in srgb, var(--inv-primary) 6%, transparent)' : 'transparent',
              }}
            >
              <Link2 className="h-4 w-4" />
              {copied ? 'Tersalin!' : 'Salin Link'}
            </Button>

            {/* Native share */}
            <Button
              onClick={handleNativeShare}
              variant="outline"
              className="cursor-pointer gap-2 px-6"
              style={{
                borderColor: 'var(--inv-accent)',
                color: 'var(--inv-primary)',
              }}
            >
              <Share2 className="h-4 w-4" />
              Bagikan
            </Button>
          </div>
          )}
        </SectionReveal>
      </div>
    </section>
  );
}
