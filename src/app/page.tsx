'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/landing/navbar';
import { SmartFilter } from '@/components/landing/smart-filter';
import { Features } from '@/components/landing/features';
import { TemplateShowcase } from '@/components/landing/template-showcase';
import { Testimonials } from '@/components/landing/testimonials';
import { CTABanner } from '@/components/landing/cta-banner';
import { HowItWorks } from '@/components/landing/how-it-works';
import { FAQ } from '@/components/landing/faq';
import { Pricing } from '@/components/landing/pricing';
import { Footer } from '@/components/landing/footer';
import { BackToTop } from '@/components/landing/back-to-top';
import { WhatsAppFAB } from '@/components/landing/whatsapp-fab';
import { SocialProof } from '@/components/landing/social-proof';
import { DynamicInvitationPreview } from '@/components/invitation/dynamic-invitation-preview';
import { InvitationThemeProvider } from '@/components/invitation/theme-provider';
import { demoData } from '@/lib/demo-data';
import type { BuilderData } from '@/lib/builder-context';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';

/* Loading Shimmer Screen with Brand Identity */
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ backgroundColor: '#FFFBF5' }}
    >
      {/* Decorative background pattern */}
      <div className="absolute inset-0 arabesque-bg opacity-30" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center gap-6 relative z-10"
      >
        {/* Logo / Brand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col items-center gap-3"
        >
          {/* Diamond ornament */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="text-[var(--gold)] text-2xl"
            style={{ color: '#C9A84C' }}
          >
            &#10045;
          </motion.div>

          {/* Brand Name */}
          <div className="flex items-center">
            <span
              className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold tracking-tight"
              style={{ color: '#800020' }}
            >
              Undangan
            </span>
            <span
              className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #C9A84C, #E8D48B, #C9A84C)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Nauka
            </span>
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-sm tracking-[0.2em] uppercase"
            style={{ color: '#8B7355' }}
          >
            Undangan Digital Pernikahan
          </motion.p>
        </motion.div>

        {/* Gold divider */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 80 }}
          transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
          className="h-px"
          style={{ background: 'linear-gradient(to right, transparent, #C9A84C, transparent)' }}
        />
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        className="absolute bottom-12 h-0.5 max-w-[200px] rounded-full"
        style={{ backgroundColor: 'rgba(201,168,76,0.3)' }}
      />
    </motion.div>
  );
}

/* Section wrapper with scroll reveal animation */
function SectionReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      <main className="flex min-h-screen flex-col overflow-x-hidden">
        <Navbar />
        <SmartFilter onOpenDemo={() => setIsDemoOpen(true)} />

        <SectionReveal>
          <SocialProof />
        </SectionReveal>

        <SectionReveal>
          <TemplateShowcase onOpenDemo={() => setIsDemoOpen(true)} />
        </SectionReveal>

        <SectionReveal>
          <Features />
        </SectionReveal>

        <SectionReveal>
          <CTABanner />
        </SectionReveal>

        <SectionReveal>
          <Testimonials />
        </SectionReveal>

        <SectionReveal>
          <HowItWorks />
        </SectionReveal>

        <SectionReveal>
          <Pricing />
        </SectionReveal>

        <SectionReveal>
          <FAQ />
        </SectionReveal>

        <Footer />
        <BackToTop />
        <WhatsAppFAB />

        {/* Demo Modal */}
        <Dialog open={isDemoOpen} onOpenChange={setIsDemoOpen}>
          <DialogContent className="h-screen max-h-[100vh] w-full max-w-full overflow-y-auto rounded-none border-none p-0">
            <button
              onClick={() => setIsDemoOpen(false)}
              className="fixed right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-black/70"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
              <X size={20} />
            </button>
            <InvitationThemeProvider nuansa="islam" adat="jawa" tingkat="mewah">
              <DynamicInvitationPreview data={demoData} previewMode />
            </InvitationThemeProvider>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}
