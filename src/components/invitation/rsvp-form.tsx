'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check } from 'lucide-react';
import { SectionReveal } from './section-reveal';
import { ParallaxSection } from './parallax-section';
import { useInvitationTheme } from './theme-provider';
import { toast } from 'sonner';

interface RSVPFormProps {
  invitationId?: string;
  previewMode?: boolean;
}

export function RSVPForm({ invitationId, previewMode = false }: RSVPFormProps) {
  const [isAttending, setIsAttending] = useState(true);
  const [guestCount, setGuestCount] = useState(1);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { nuansa } = useInvitationTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);

    try {
      if (invitationId) {
        const res = await fetch('/api/guest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invitationId,
            name: name.trim(),
            status: isAttending ? 'attending' : 'not_attending',
            guestCount,
            message: message.trim() || undefined,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Gagal mengirim konfirmasi');
        }
      } else {
        // Demo mode: simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setIsSubmitted(true);
      toast.success('Konfirmasi terkirim!', {
        description: 'Terima kasih atas konfirmasi Anda.',
      });
    } catch (err) {
      toast.error('Gagal mengirim', {
        description: err instanceof Error ? err.message : 'Silakan coba lagi.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ParallaxSection bgPattern="inv-ivory-pattern-bg" className="py-16 md:py-24" style={{ backgroundColor: 'var(--inv-bg)' }}>
      <div className="mx-auto max-w-4xl px-4 text-center">
        <SectionReveal direction="scale">
          <h2
            className="font-serif text-3xl font-bold md:text-4xl"
            style={{ color: 'var(--inv-primary)', fontFamily: 'var(--font-playfair)' }}
          >
            {nuansa.rsvpLabel}
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

        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center py-8"
            >
              <motion.div
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                style={{
                  backgroundColor: 'var(--inv-primary)',
                  border: '3px solid var(--inv-accent)',
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <Check className="h-8 w-8" style={{ color: 'var(--inv-accent)' }} />
              </motion.div>
              <p
                className="font-serif text-2xl font-semibold"
                style={{ color: 'var(--inv-primary)' }}
              >
                Terima kasih!
              </p>
              <p className="mt-2 text-sm" style={{ color: 'var(--inv-text-muted)' }}>
                Konfirmasi Anda telah kami terima
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SectionReveal direction="fade" delay={0.3}>
                <form
                  onSubmit={handleSubmit}
                  className="mx-auto max-w-md space-y-6"
                >
                  {/* Attendance toggle */}
                  <div className="flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => setIsAttending(true)}
                      className="cursor-pointer rounded-full px-6 py-2.5 text-sm font-medium transition-all"
                      style={{
                        backgroundColor: isAttending ? 'var(--inv-primary)' : 'transparent',
                        color: isAttending ? 'var(--inv-accent)' : 'var(--inv-primary)',
                        border: `2px solid ${isAttending ? 'var(--inv-accent)' : 'var(--inv-primary)'}`,
                      }}
                    >
                      Hadir
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAttending(false)}
                      className="cursor-pointer rounded-full px-6 py-2.5 text-sm font-medium transition-all"
                      style={{
                        backgroundColor: !isAttending ? 'var(--inv-primary)' : 'transparent',
                        color: !isAttending ? 'var(--inv-accent)' : 'var(--inv-primary)',
                        border: `2px solid ${!isAttending ? 'var(--inv-accent)' : 'var(--inv-primary)'}`,
                      }}
                    >
                      Tidak Hadir
                    </button>
                  </div>

                  {/* Guest count (only if attending) */}
                  {isAttending && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <label
                        className="text-sm font-medium"
                        style={{ color: 'var(--inv-primary)' }}
                      >
                        Jumlah Tamu
                      </label>
                      <div className="flex items-center justify-center gap-3">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setGuestCount(num)}
                            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-sm font-medium transition-all"
                            style={{
                              backgroundColor:
                                guestCount === num ? 'var(--inv-primary)' : 'var(--inv-bg-pattern)',
                              color: guestCount === num ? 'var(--inv-accent)' : 'var(--inv-primary)',
                              border: `2px solid ${guestCount === num ? 'var(--inv-accent)' : 'var(--inv-accent-soft)'}`,
                            }}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Name input */}
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium"
                      style={{ color: 'var(--inv-primary)' }}
                    >
                      Nama <span style={{ color: 'var(--inv-accent)' }}>*</span>
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masukkan nama Anda"
                      required
                      className="text-center"
                      style={{
                        borderColor: 'var(--inv-accent)',
                        color: 'var(--inv-primary)',
                      }}
                    />
                  </div>

                  {/* Message textarea */}
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium"
                      style={{ color: 'var(--inv-primary)' }}
                    >
                      Pesan (opsional)
                    </label>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tulis pesan untuk kedua mempelai..."
                      rows={3}
                      className="text-center"
                      style={{
                        borderColor: 'var(--inv-accent)',
                        color: 'var(--inv-primary)',
                      }}
                    />
                  </div>

                  {/* Submit button - disabled in preview mode */}
                  {previewMode ? (
                    <div
                      className="w-full rounded py-5 text-center text-sm uppercase tracking-widest opacity-50"
                      style={{
                        backgroundColor: 'var(--inv-primary)',
                        color: 'var(--inv-accent)',
                        border: '1px solid var(--inv-accent)',
                      }}
                    >
                      Fitur ini aktif setelah undangan dipublikasikan
                    </div>
                  ) : (
                    <Button
                      type="submit"
                      disabled={!name.trim() || isSubmitting}
                      className="w-full cursor-pointer py-5 text-sm uppercase tracking-widest"
                      style={{
                        backgroundColor: 'var(--inv-primary)',
                        color: 'var(--inv-accent)',
                        border: '1px solid var(--inv-accent)',
                      }}
                    >
                      {isSubmitting ? 'Mengirim...' : 'Kirim Konfirmasi'}
                    </Button>
                  )}
                </form>
              </SectionReveal>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ParallaxSection>
  );
}
