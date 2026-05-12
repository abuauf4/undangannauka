'use client';

import { useState } from 'react';
import { Copy, Check, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionReveal } from './section-reveal';
import { ParallaxSection } from './parallax-section';

interface AmplopDigitalProps {
  namaPria?: string;
  namaWanita?: string;
  bankAccounts?: { bank: string; accountNumber: string; accountHolder: string }[];
}

export function AmplopDigital({ namaPria, namaWanita, bankAccounts: bankAccountsProp }: AmplopDigitalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Bank brand colors for common banks
  const bankColors: Record<string, string> = {
    'BCA': '#003D79',
    'BNI': '#E65100',
    'BRI': '#00529C',
    'Mandiri': '#003066',
    'BSI': '#00A650',
    'CIMB': '#7B0E24',
    'Danamon': '#FFD700',
    'Permata': '#0055A3',
  };

  const bankAccounts = bankAccountsProp && bankAccountsProp.length > 0
    ? bankAccountsProp.map((acc, i) => ({
        ...acc,
        accountHolder: acc.accountHolder || (i === 0 ? namaPria || 'Mempelai Pria' : namaWanita || 'Mempelai Wanita'),
        color: bankColors[acc.bank] || (i === 0 ? '#003D79' : '#E65100'),
      }))
    : [
        {
          bank: 'BCA',
          accountNumber: '1234567890',
          accountHolder: namaPria || 'Ahmad Fauzan',
          color: '#003D79',
        },
        {
          bank: 'BNI',
          accountNumber: '0987654321',
          accountHolder: namaWanita || 'Aisyah Putri',
          color: '#E65100',
        },
      ];

  const handleCopy = async (accountNumber: string, index: number) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = accountNumber;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  return (
    <ParallaxSection bgPattern="inv-arabesque-bg" className="py-16 md:py-24" style={{ backgroundColor: 'var(--inv-bg)' }}>
      <div className="mx-auto max-w-4xl px-4 text-center">
        <SectionReveal direction="scale">
          <div className="mb-4 flex justify-center">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{
                backgroundColor: 'var(--inv-primary)',
                border: '2px solid var(--inv-accent)',
              }}
            >
              <Gift className="h-7 w-7" style={{ color: 'var(--inv-accent)' }} />
            </div>
          </div>
        </SectionReveal>

        <SectionReveal direction="scale" delay={0.1}>
          <h2
            className="font-serif text-3xl font-bold md:text-4xl"
            style={{ color: 'var(--inv-primary)', fontFamily: 'var(--font-playfair)' }}
          >
            Amplop Digital
          </h2>
        </SectionReveal>

        <SectionReveal direction="fade" delay={0.2}>
          <p
            className="mx-auto mt-3 max-w-lg text-sm leading-relaxed md:text-base"
            style={{ color: 'var(--inv-text-muted)' }}
          >
            Doa restu Anda merupakan karunia yang sangat berarti bagi kami.
            Namun jika Anda ingin memberikan tanda kasih, kami menyediakan
            amplop digital melalui:
          </p>
        </SectionReveal>

        <SectionReveal direction="fade" delay={0.3}>
          <div className="mx-auto my-6 flex w-32 items-center justify-center gap-2">
            <div className="h-px flex-1" style={{ backgroundColor: 'var(--inv-accent)' }} />
            <svg width="12" height="12" viewBox="0 0 16 16" style={{ fill: 'var(--inv-accent)' }}>
              <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6Z" />
            </svg>
            <div className="h-px flex-1" style={{ backgroundColor: 'var(--inv-accent)' }} />
          </div>
        </SectionReveal>

        {/* Bank cards */}
        <div className="mx-auto grid max-w-lg gap-4">
          {bankAccounts.map((account, index) => (
            <SectionReveal key={account.bank} direction={index % 2 === 0 ? 'left' : 'right'} delay={0.4 + index * 0.15}>
              <div
                className="rounded-lg border-2 p-5"
                style={{
                  backgroundColor: 'var(--inv-bg-pattern)',
                  borderColor: 'var(--inv-accent)',
                }}
              >
                {/* Bank name badge */}
                <div className="mb-3 flex items-center justify-center">
                  <span
                    className="rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider text-white"
                    style={{ backgroundColor: account.color }}
                  >
                    {account.bank}
                  </span>
                </div>

                {/* Account number */}
                <div className="mb-2 flex items-center justify-center gap-2">
                  <span
                    className="font-mono text-lg font-bold tracking-widest md:text-xl"
                    style={{ color: 'var(--inv-primary)' }}
                  >
                    {account.accountNumber}
                  </span>
                </div>

                {/* Account holder */}
                <p className="text-sm" style={{ color: 'var(--inv-text-muted)' }}>
                  a.n.{' '}
                  <span className="font-semibold" style={{ color: 'var(--inv-primary)' }}>
                    {account.accountHolder}
                  </span>
                </p>

                {/* Copy button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 cursor-pointer"
                  style={{
                    borderColor: 'var(--inv-accent)',
                    color: 'var(--inv-primary)',
                  }}
                  onClick={() =>
                    handleCopy(account.accountNumber, index)
                  }
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="mr-1 h-3.5 w-3.5" style={{ color: 'var(--inv-accent)' }} />
                      Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1 h-3.5 w-3.5" />
                      Salin Nomor
                    </>
                  )}
                </Button>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </ParallaxSection>
  );
}
