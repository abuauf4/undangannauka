'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, Copy, Share2, ExternalLink, Home, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [invitationData, setInvitationData] = useState<{
    slug: string;
    namaPria: string;
    namaWanita: string;
  } | null>(null);

  const orderId = searchParams.get('order_id');

  useEffect(() => {
    // Try to get invitation data from session storage
    try {
      const saved = sessionStorage.getItem('undangannauka_checkout_success');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Use microtask to avoid synchronous setState in effect
        queueMicrotask(() => setInvitationData(parsed));
      }
    } catch {
      // ignore
    }
  }, []);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://undangannauka.id';
  const shareUrl = invitationData ? `${baseUrl}/i/${invitationData.slug}` : '';

  const waMessage = invitationData
    ? encodeURIComponent(
        `Assalamu'alaikum 🌸\nKami mengundang Bapak/Ibu/Saudara/i untuk menghadiri pernikahan kami.\n\n${invitationData.namaPria} & ${invitationData.namaWanita}\n\n💌 Buka undangan digital:\n${shareUrl}`
      )
    : '';

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-[var(--ivory)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-lg w-full text-center"
      >
        {/* Animated Checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
          className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 10, delay: 0.5 }}
          >
            <Check className="size-12 text-green-600" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-foreground mb-3"
        >
          Pembayaran Berhasil!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-muted-foreground mb-8"
        >
          {orderId ? (
            <>Order ID: <span className="font-mono text-sm">{orderId}</span></>
          ) : (
            'Undangan digital Anda sudah aktif dan siap dibagikan!'
          )}
        </motion.p>

        {/* Share Section */}
        {invitationData && shareUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-card border border-border rounded-xl p-5 mb-6"
          >
            <p className="text-sm font-medium mb-3">
              Link Undangan {invitationData.namaPria} & {invitationData.namaWanita}
            </p>

            <div className="flex items-center gap-2 mb-4">
              <input
                readOnly
                value={shareUrl}
                className="flex-1 bg-muted rounded-lg px-3 py-2.5 text-sm font-mono text-foreground truncate border-0 outline-none"
              />
              <Button size="sm" variant="outline" onClick={handleCopy} className="flex-shrink-0">
                {copied ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
              </Button>
            </div>

            <div className="flex gap-2">
              <a
                href={`https://wa.me/?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#25D366' }}
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
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--burgundy)] transition-all"
          >
            <Home className="size-4 mr-2" />
            Ke Dashboard
          </Button>
          <Button
            onClick={() => router.push('/')}
            className="bg-[var(--burgundy)] text-[var(--ivory)] hover:bg-[var(--gold)] hover:text-[var(--burgundy)] transition-all"
          >
            Buat Undangan Lain
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--ivory)] flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-[var(--gold)]" />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
