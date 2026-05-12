'use client';

import { useState, useCallback } from 'react';
import { Envelope } from './envelope';
import { Mempelai } from './mempelai';
import { QuranVerse } from './quran-verse';
import { EventDetails } from './event-details';
import { Countdown as CountdownFlip } from './countdown-flip';
import { PhotoGallery } from './photo-gallery';
import { AdatPepatah } from './adat-pepatah';
import { RSVPForm } from './rsvp-form';
import { Guestbook } from './guestbook';
import { AmplopDigital } from './amplop-digital';
import { ShareButtons } from './share-buttons';
import { MusicPlayer } from './music-player';
import { FlowerPetals } from './flower-petals';
import { GoldSparkle } from './gold-sparkle';
import { ScrollProgress } from './scroll-progress';
import { ScrollIndicator } from './scroll-indicator';
import { useInvitationTheme } from './theme-provider';
import { GuestWelcome } from './guest-welcome';
import { LoveQuotes } from './love-quotes';
import { OurStory } from './our-story';
import { WeddingItinerary } from './wedding-itinerary';
import { BridesmaidGroomsman } from './bridesmaid-groomsman';
import { WelcomeVideo } from './welcome-video';
import { motion } from 'framer-motion';
import { AnimatedDivider } from './animated-divider';
import { BatikBorderFrame } from './batik-border-frame';
import { BatikStripBorder, WayangBottomScene, JavaneseGoldDivider } from './javanese-ornaments';
import type { BuilderData } from '@/lib/builder-context';

function GoldDivider({ variant }: { variant?: 'simple' | 'ornate' | 'floral' }) {
  return <AnimatedDivider variant={variant} />;
}

interface DynamicInvitationPreviewProps {
  data: BuilderData;
  previewMode?: boolean;
}

export function DynamicInvitationPreview({ data, previewMode = false }: DynamicInvitationPreviewProps) {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(previewMode);
  const { variables, nuansa, adatKey } = useInvitationTheme();
  const isJawa = adatKey === 'jawa';

  const namaPria = data.namaPria || 'Pria';
  const namaWanita = data.namaWanita || 'Wanita';

  const handleEnvelopeOpen = useCallback(() => {
    setIsEnvelopeOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: 'var(--inv-bg)' }}>
      {/* Template gradient header - only in preview mode */}
      {previewMode && data.templateGradient && (
        <div className={`h-3 bg-gradient-to-r ${data.templateGradient}`} />
      )}

      {/* Preview mode badge */}
      {previewMode && (
        <div className="sticky top-0 z-30 bg-black/70 text-white text-center py-1.5 text-xs font-medium tracking-wider backdrop-blur-sm">
          PREVIEW — {data.templateName || 'Template'}
        </div>
      )}

      {/* Scroll progress bar */}
      {!previewMode && isEnvelopeOpen && <ScrollProgress />}

      {/* Flower petals + Gold sparkle overlay */}
      {!previewMode && isEnvelopeOpen && <FlowerPetals />}
      {!previewMode && isEnvelopeOpen && <GoldSparkle />}

      {/* Envelope (opening animation) - skip in preview mode */}
      {!previewMode && (
        <Envelope
          guestName="Tamu Undangan"
          greeting={data.greeting || undefined}
          fotoPria={data.fotoPria || null}
          fotoWanita={data.fotoWanita || null}
          namaPria={namaPria}
          namaWanita={namaWanita}
          nuansa={data.nuansa || undefined}
          adat={data.adat || undefined}
          onOpen={handleEnvelopeOpen}
        />
      )}

      {/* Preview mode hero banner */}
      {previewMode && (
        <div className={`relative overflow-hidden bg-gradient-to-br ${data.templateGradient || 'from-[#561C24] via-[#3D1218] to-[#C7B7A3]'} py-12 md:py-16`}>
          <div className="absolute inset-0 inv-arabesque-bg opacity-20" />
          <div className="relative z-10 text-center px-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70 mb-3">
              {data.greeting || "Assalamu'alaikum Warahmatullahi Wabarakatuh"}
            </p>
            <h1
              className="font-serif text-3xl md:text-5xl font-bold text-white mb-2"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {namaPria}
            </h1>
            <span
              className="font-serif text-3xl md:text-4xl"
              style={{ color: 'var(--inv-accent)', fontFamily: 'var(--font-playfair)' }}
            >
              &amp;
            </span>
            <h1
              className="font-serif text-3xl md:text-5xl font-bold text-white mt-2"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {namaWanita}
            </h1>
            {data.tanggalAkad && (
              <p className="mt-4 text-sm text-white/70 tracking-wider">
                {new Date(data.tanggalAkad).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main invitation content */}
      {(isEnvelopeOpen || previewMode) && (
        <motion.div
          initial={previewMode ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: previewMode ? 0 : 1, delay: previewMode ? 0 : 0.3 }}
        >
          {/* Scroll Indicator */}
          {!previewMode && <ScrollIndicator />}

          {/* Guest Welcome — personalization */}
          <GuestWelcome guestName="Tamu Undangan" />

          {/* Mempelai section - with background photo */}
          <Mempelai
            namaPria={namaPria}
            namaWanita={namaWanita}
            namaOrtuPria={data.namaOrtuPria || null}
            namaOrtuWanita={data.namaOrtuWanita || null}
            greeting={data.greeting || null}
            fotoPria={data.fotoPria || null}
            fotoWanita={data.fotoWanita || null}
            fotoBackground={data.fotoBackground || null}
          />
          <GoldDivider variant="ornate" />

          {/* Adat Pepatah — cultural proverb/phrase section */}
          <AdatPepatah />
          <GoldDivider variant="simple" />

          {/* Love Quotes Rotator - with builder data */}
          {(data.loveQuotes?.length ?? 0) > 0 && (
            <>
              <LoveQuotes quotes={data.loveQuotes} />
              <GoldDivider variant="simple" />
            </>
          )}

          {/* Our Story Timeline - with builder data */}
          {(data.ourStory?.length ?? 0) > 0 && (
            <>
              <OurStory milestones={data.ourStory} />
              <GoldDivider variant="floral" />
            </>
          )}

          {/* Quran verse / Quote section */}
          <BatikBorderFrame variant="elegant" className="mx-4 md:mx-8">
            <QuranVerse ayatQuote={data.ayatQuote || null} />
          </BatikBorderFrame>
          <GoldDivider variant="ornate" />

          {/* Event details section */}
          <BatikBorderFrame variant="simple" className="mx-4 md:mx-8">
            <EventDetails
              tanggalAkad={data.tanggalAkad || null}
              waktuAkad={data.waktuAkad || null}
              lokasiAkad={data.lokasiAkad || null}
              alamatAkad={data.alamatAkad || null}
              mapsAkadUrl={data.mapsAkadUrl || null}
              tanggalResepsi={data.punyaResepsi ? data.tanggalResepsi || null : null}
              waktuResepsi={data.punyaResepsi ? data.waktuResepsi || null : null}
              lokasiResepsi={data.punyaResepsi ? data.lokasiResepsi || null : null}
              alamatResepsi={data.punyaResepsi ? data.alamatResepsi || null : null}
              mapsResepsiUrl={data.punyaResepsi ? data.mapsResepsiUrl || null : null}
            />
          </BatikBorderFrame>
          <GoldDivider variant="simple" />

          {/* Flip-Clock Countdown */}
          <CountdownFlip targetDate={data.tanggalAkad || undefined} />
          <GoldDivider variant="ornate" />

          {/* Wedding Itinerary - with builder data */}
          {(data.weddingItinerary?.length ?? 0) > 0 && (
            <>
              <WeddingItinerary items={data.weddingItinerary} />
              <GoldDivider variant="floral" />
            </>
          )}


          {/* Welcome Video - with builder data */}
          {data.welcomeVideo && (
            <>
              <WelcomeVideo videoUrl={data.welcomeVideo} />
              <GoldDivider variant="floral" />
            </>
          )}

          {/* Photo gallery section */}
          {(data.fotoGallery?.length ?? 0) > 0 && (
            <>
              <PhotoGallery
                photos={data.fotoGallery}
                previewMode={previewMode}
              />
              <GoldDivider variant="ornate" />
            </>
          )}

          {/* Bridesmaid & Groomsman - with builder data */}
          {((data.bridesmaids?.length ?? 0) > 0 || (data.groomsmen?.length ?? 0) > 0) && (
            <>
              <BridesmaidGroomsman
                bridesmaids={data.bridesmaids || []}
                groomsmen={data.groomsmen || []}
              />
              <GoldDivider variant="simple" />
            </>
          )}

          {/* RSVP form section */}
          <BatikBorderFrame variant="elegant" className="mx-4 md:mx-8">
            <RSVPForm previewMode={previewMode} />
          </BatikBorderFrame>
          <GoldDivider variant="ornate" />

          {/* Guestbook section */}
          <Guestbook previewMode={previewMode} />
          <GoldDivider variant="floral" />

          {/* Amplop digital section - with builder data */}
          <BatikBorderFrame variant="simple" className="mx-4 md:mx-8">
            <AmplopDigital
              namaPria={namaPria}
              namaWanita={namaWanita}
              bankAccounts={(data.amplopDigital || []).filter(a => a.accountNumber)}
            />
          </BatikBorderFrame>
          <GoldDivider variant="simple" />

          {/* Share buttons section */}
          <ShareButtons namaPria={namaPria} namaWanita={namaWanita} previewMode={previewMode} />

          {/* Footer */}
          <footer
            className="relative py-10 text-center overflow-hidden"
            style={{ backgroundColor: 'var(--inv-footer-bg)' }}
          >
            {/* Javanese-specific footer decorations */}
            {isJawa && (
              <div className="absolute top-0 left-0 right-0">
                <BatikStripBorder showHorse />
              </div>
            )}

            <div className="relative z-10">
              {isJawa ? (
                <JavaneseGoldDivider className="mb-6" />
              ) : (
                <div className="mx-auto mb-6 flex w-32 items-center justify-center gap-2">
                  <div className="h-px flex-1" style={{ backgroundColor: 'var(--inv-accent-soft)' }} />
                  <svg width="14" height="14" viewBox="0 0 16 16" style={{ fill: 'var(--inv-accent)' }}>
                    <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6Z" />
                  </svg>
                  <div className="h-px flex-1" style={{ backgroundColor: 'var(--inv-accent-soft)' }} />
                </div>
              )}

              <div className="mx-auto mb-5 flex max-w-xs items-center justify-center gap-1">
                {[...Array(7)].map((_, i) => (
                  <svg key={i} width="6" height="6" viewBox="0 0 10 10" style={{ fill: 'var(--inv-accent)', opacity: 0.4 + (i === 3 ? 0.4 : 0) }}>
                    <path d="M5 0L6.5 3.5L10 5L6.5 6.5L5 10L3.5 6.5L0 5L3.5 3.5Z" />
                  </svg>
                ))}
              </div>
              <p className="font-serif text-lg" style={{ color: 'var(--inv-accent)', fontFamily: 'var(--font-playfair)' }}>
                {namaPria} &amp; {namaWanita}
              </p>
              <p className="mt-3 text-xs italic" style={{ color: 'var(--inv-accent)', opacity: 0.6 }}>
                {nuansa.footerDua}
              </p>

              {isJawa ? (
                <JavaneseGoldDivider className="my-5" />
              ) : (
                <div className="mx-auto mt-5 flex w-20 items-center justify-center gap-2">
                  <div className="h-px flex-1" style={{ backgroundColor: 'var(--inv-accent-soft)' }} />
                  <div className="h-px flex-1" style={{ backgroundColor: 'var(--inv-accent-soft)' }} />
                </div>
              )}

              {/* Wayang scene for Jawa footer */}
              {isJawa && (
                <div className="my-4 opacity-40">
                  <WayangBottomScene />
                </div>
              )}

              <div className="mt-3 flex items-center justify-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 30 30" style={{ opacity: 0.6 }}>
                  <rect x="1.49" y="1.49" width="27.02" height="27.02" rx="4" fill={isJawa ? "#F5F0E6" : "#2D2D2D"} stroke={isJawa ? "#D4AF37" : "#FFFFFF"} strokeWidth="0.6" />
                  <path d="M15.47,7.1l-1.3,1.85c-0.2,0.29-0.54,0.47-0.9,0.47h-7.1V7.09C6.16,7.1,15.47,7.1,15.47,7.1z" fill={isJawa ? "#D4AF37" : "#FFFFFF"} />
                  <polygon points="24.3,7.1 13.14,22.91 5.7,22.91 16.86,7.1" fill={isJawa ? "#D4AF37" : "#FFFFFF"} />
                  <path d="M14.53,22.91l1.31-1.86c0.2-0.29,0.54-0.47,0.9-0.47h7.09v2.33H14.53z" fill={isJawa ? "#D4AF37" : "#FFFFFF"} />
                </svg>
                <p className="text-xs" style={{ color: 'var(--inv-accent)', opacity: 0.7 }}>
                  Undangan<span style={{ opacity: 1, fontWeight: 700 }}>Nauka</span>
                </p>
              </div>
            </div>
          </footer>
        </motion.div>
      )}

      {/* Floating music player */}
      {!previewMode && isEnvelopeOpen && data.musikPilihan && data.musikPilihan !== 'none' && (() => {
        let musicUrl = '';
        if (data.musikPilihan === 'custom') {
          musicUrl = data.customMusicUrl || '';
        } else if (data.customMusicUrl && (data.customMusicUrl.startsWith('http') || data.customMusicUrl.startsWith('data:') || data.customMusicUrl.startsWith('/api/'))) {
          musicUrl = data.customMusicUrl;
        } else {
          musicUrl = `/music/${data.musikPilihan}.mp3`;
        }
        return musicUrl ? <MusicPlayer musikUrl={musicUrl} autoPlay={false} /> : null;
      })()}
    </div>
  );
}
