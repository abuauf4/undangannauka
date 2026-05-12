'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { SectionReveal } from './section-reveal';
import { toast } from 'sonner';

interface GuestMessage {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

interface GuestbookProps {
  invitationId?: string;
  initialEntries?: Array<{ id: string; name: string; message: string; createdAt: string }>;
  previewMode?: boolean;
}

const sampleMessages: GuestMessage[] = [
  {
    id: '1',
    name: 'Budi Santoso',
    message:
      "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khair. Semoga menjadi keluarga yang sakinah, mawaddah, warahmah!",
    createdAt: '2026-05-09T08:00:00.000Z',
  },
  {
    id: '2',
    name: 'Rina Handayani',
    message:
      'Selamat menempuh hidup baru! Semoga selalu diberkahi kebahagiaan dan keharmonikan. Aamiin.',
    createdAt: '2026-05-09T05:00:00.000Z',
  },
  {
    id: '3',
    name: 'Hassan Ahmed',
    message:
      'Mabrouk! Semoga Allah memberkahi pernikahan kalian dengan cinta dan kebahagiaan yang abadi.',
    createdAt: '2026-05-08T10:00:00.000Z',
  },
  {
    id: '4',
    name: 'Dewi Lestari',
    message:
      'Bahagia selalu ya Kak Ahmad & Aisyah! Semoga menjadi pasangan yang saling melengkapi.',
    createdAt: '2026-05-08T09:00:00.000Z',
  },
];

function formatTimestamp(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'Baru saja';
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function Guestbook({ invitationId, initialEntries, previewMode = false }: GuestbookProps) {
  const [messages, setMessages] = useState<GuestMessage[]>(
    initialEntries ? initialEntries.map((e) => ({ ...e })) : []
  );
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialEntries && !!invitationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll only within the guestbook container, NOT the whole page
  const scrollToBottom = () => {
    const container = messagesEndRef.current?.parentElement;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  };

  // Only auto-scroll after submitting a new message, NOT on initial mount
  // (scrollIntoView on mount was causing the page to jump to amplop digital section)

  // Fetch guestbook entries if invitationId provided and no initialEntries
  useEffect(() => {
    if (!invitationId || initialEntries) return;

    async function fetchEntries() {
      try {
        const res = await fetch(`/api/guestbook?invitationId=${invitationId}`);
        if (res.ok) {
          const data = await res.json();
          const entries: GuestMessage[] = (data.entries || []).map(
            (e: { id: string; name: string; message: string; createdAt: string; isHidden?: boolean }) => ({
              id: e.id,
              name: e.name,
              message: e.message,
              createdAt: e.createdAt,
            })
          );
          setMessages(entries);
        }
      } catch {
        // Silently fail, use empty list
      } finally {
        setIsLoading(false);
      }
    }

    fetchEntries();
  }, [invitationId, initialEntries]);

  // Use sample messages if no invitationId and no initialEntries
  useEffect(() => {
    if (!invitationId && !initialEntries && messages.length === 0) {
      setMessages(sampleMessages);
    }
  }, [invitationId, initialEntries, messages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);

    try {
      if (invitationId) {
        const res = await fetch('/api/guestbook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invitationId,
            name: name.trim(),
            message: message.trim(),
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Gagal mengirim ucapan');
        }

        const data = await res.json();
        const newMessage: GuestMessage = {
          id: data.entry?.id || Date.now().toString(),
          name: name.trim(),
          message: message.trim(),
          createdAt: data.entry?.createdAt || new Date().toISOString(),
        };
        setMessages((prev) => [newMessage, ...prev]);
      } else {
        // Demo mode: simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        const newMessage: GuestMessage = {
          id: Date.now().toString(),
          name: name.trim(),
          message: message.trim(),
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, newMessage]);
      }

      setName('');
      setMessage('');
      toast.success('Ucapan terkirim!', {
        description: 'Terima kasih atas doa dan ucapan Anda.',
      });
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      toast.error('Gagal mengirim', {
        description: err instanceof Error ? err.message : 'Silakan coba lagi.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (nameStr: string) => {
    return nameStr
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section className="relative py-16 md:py-24" style={{ backgroundColor: 'var(--inv-bg)' }}>
      <div className="mx-auto max-w-4xl px-4 text-center">
        <SectionReveal direction="scale">
          <h2
            className="font-serif text-3xl font-bold md:text-4xl"
            style={{ color: 'var(--inv-primary)', fontFamily: 'var(--font-playfair)' }}
          >
            Buku Tamu &amp; Ucapan
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

        {/* Guest form - disabled in preview mode */}
        <SectionReveal direction="fade" delay={0.3}>
          {previewMode ? (
            <div
              className="mx-auto mb-8 max-w-md rounded py-5 text-center text-sm uppercase tracking-widest opacity-50"
              style={{
                backgroundColor: 'var(--inv-primary)',
                color: 'var(--inv-accent)',
                border: '1px solid var(--inv-accent)',
              }}
            >
              Fitur ini aktif setelah undangan dipublikasikan
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mb-8 max-w-md space-y-4"
            >
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
                required
                className="text-center"
                style={{ borderColor: 'var(--inv-accent)', color: 'var(--inv-primary)' }}
              />
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis ucapan & doa untuk kedua mempelai..."
                rows={3}
                required
                className="text-center"
                style={{ borderColor: 'var(--inv-accent)', color: 'var(--inv-primary)' }}
              />
              <Button
                type="submit"
                disabled={!name.trim() || !message.trim() || isSubmitting}
                className="w-full cursor-pointer py-5 text-sm uppercase tracking-widest"
                style={{
                  backgroundColor: 'var(--inv-primary)',
                  color: 'var(--inv-accent)',
                  border: '1px solid var(--inv-accent)',
                }}
              >
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Mengirim...' : 'Kirim Ucapan'}
              </Button>
            </form>
          )}
        </SectionReveal>

        {/* Messages list */}
        <SectionReveal direction="up" delay={0.4}>
          <div className="mx-auto max-w-md">
            <div className="max-h-96 space-y-4 overflow-y-auto invitation-scroll pr-1">
              {isLoading ? (
                <p className="text-sm py-4" style={{ color: 'var(--inv-text-muted)' }}>
                  Memuat ucapan...
                </p>
              ) : (
                messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-lg border p-4 text-left"
                    style={{
                      backgroundColor: 'var(--inv-bg-pattern)',
                      borderColor: 'var(--inv-accent-soft)',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: 'var(--inv-primary)',
                          color: 'var(--inv-accent)',
                        }}
                      >
                        {getInitials(msg.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="truncate text-sm font-semibold"
                            style={{ color: 'var(--inv-primary)' }}
                          >
                            {msg.name}
                          </span>
                          <span
                            className="shrink-0 text-xs"
                            style={{ color: 'var(--inv-accent)' }}
                          >
                            {formatTimestamp(msg.createdAt)}
                          </span>
                        </div>
                        <p
                          className="mt-1 text-sm leading-relaxed"
                          style={{ color: 'var(--inv-text-muted)' }}
                        >
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
