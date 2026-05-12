"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { OpeningAnimation } from "@/components/invitation/opening-animation";
import { Mempelai } from "@/components/invitation/mempelai";
import { QuranVerse } from "@/components/invitation/quran-verse";
import { EventDetails } from "@/components/invitation/event-details";
import { Countdown as CountdownFlip } from "@/components/invitation/countdown-flip";
import { PhotoGallery } from "@/components/invitation/photo-gallery";
import { AdatPepatah } from "@/components/invitation/adat-pepatah";
import { RSVPForm } from "@/components/invitation/rsvp-form";
import { Guestbook } from "@/components/invitation/guestbook";
import { AmplopDigital } from "@/components/invitation/amplop-digital";
import { ShareButtons } from "@/components/invitation/share-buttons";
import { MusicPlayer } from "@/components/invitation/music-player";
import { FlowerPetals } from "@/components/invitation/flower-petals";
import { GoldSparkle } from "@/components/invitation/gold-sparkle";
import { ScrollProgress } from "@/components/invitation/scroll-progress";
import { ScrollIndicator } from "@/components/invitation/scroll-indicator";
import { AnimatedDivider } from "@/components/invitation/animated-divider";
import { BatikBorderFrame } from "@/components/invitation/batik-border-frame";
import {
  BatikScallopTop,
  BatikScallopBottom,
  WayangBottomScene,
  WayangHeroScene,
  WayangArjuna,
  WayangSrikandi,
  AksaraJawaOrnament,
  BatikStripBorder,
  MegamendungLeft,
  MegamendungRight,
  JavaneseGoldDivider,
  JavaneseDoubleBorder,
} from "@/components/invitation/javanese-ornaments";
import { InvitationThemeProvider } from "@/components/invitation/theme-provider";
import { GuestWelcome } from "@/components/invitation/guest-welcome";
import { LoveQuotes } from "@/components/invitation/love-quotes";
import { OurStory } from "@/components/invitation/our-story";
import { WeddingItinerary } from "@/components/invitation/wedding-itinerary";
import { BridesmaidGroomsman } from "@/components/invitation/bridesmaid-groomsman";
import { WelcomeVideo } from "@/components/invitation/welcome-video";
import { Loader2 } from "lucide-react";
import type { NuansaType, AdatType, DesignType } from "@/lib/template-data";
import { JAVANESE_COLOR_PALETTES } from "@/lib/template-builder-types";

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

interface InvitationData {
  id: string;
  slug: string;
  templateId: string;
  namaPria: string;
  namaWanita: string;
  namaOrtuPria: string | null;
  namaOrtuWanita: string | null;
  fotoPria: string | null;
  fotoWanita: string | null;
  tanggalAkad: string | null;
  waktuAkad: string | null;
  lokasiAkad: string | null;
  alamatAkad: string | null;
  mapsAkadUrl: string | null;
  tanggalResepsi: string | null;
  waktuResepsi: string | null;
  lokasiResepsi: string | null;
  alamatResepsi: string | null;
  mapsResepsiUrl: string | null;
  nuansa: string | null;
  adat: string | null;
  tingkat: string | null;
  greeting: string | null;
  ayatQuote: string | null;
  musikUrl: string | null;
  fotoGallery: string | null;
  fotoBackground: string | null;
  ourStory: string | null;
  loveQuotes: string | null;
  bridesmaidGroomsman: string | null;
  weddingItinerary: string | null;
  welcomeVideo: string | null;
  amplopDigital: string | null;
  guestbook?: GuestbookEntry[];
}

function GoldDivider({ variant, isJawa }: { variant?: 'simple' | 'ornate' | 'floral'; isJawa?: boolean }) {
  if (isJawa) {
    return (
      <motion.div
        initial={{ opacity: 0, scaleY: 0.5 }}
        whileInView={{ opacity: 1, scaleY: 1 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="my-2"
      >
        {variant === 'ornate' ? (
          <BatikStripBorder showHorse />
        ) : variant === 'floral' ? (
          <div className="flex flex-col items-center gap-1">
            <JavaneseGoldDivider />
            <BatikStripBorder />
          </div>
        ) : (
          <BatikStripBorder />
        )}
      </motion.div>
    );
  }
  return <AnimatedDivider variant={variant} />;
}

function OrnamentalFooter({ namaPria, namaWanita, nuansa }: { namaPria: string; namaWanita: string; nuansa?: string }) {
  const isIslam = nuansa !== 'umum';
  const footerText = isIslam
    ? "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fi khair"
    : "May our love be eternal and our union blessed with happiness";
  return (
    <footer className="py-10 text-center" style={{ backgroundColor: "var(--inv-footer-bg)" }}>
      <div className="mx-auto mb-5 flex w-32 items-center justify-center gap-2">
        <div className="h-px flex-1" style={{ backgroundColor: "var(--inv-accent-soft)" }} />
        <svg width="14" height="14" viewBox="0 0 16 16" style={{ fill: "var(--inv-accent)" }}>
          <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6Z" />
        </svg>
        <div className="h-px flex-1" style={{ backgroundColor: "var(--inv-accent-soft)" }} />
      </div>
      <div className="mx-auto mb-4 flex max-w-xs items-center justify-center gap-1">
        {[...Array(7)].map((_, i) => (
          <svg key={i} width="6" height="6" viewBox="0 0 10 10" style={{ fill: "var(--inv-accent)", opacity: 0.4 + (i === 3 ? 0.4 : 0) }}>
            <path d="M5 0L6.5 3.5L10 5L6.5 6.5L5 10L3.5 6.5L0 5L3.5 3.5Z" />
          </svg>
        ))}
      </div>
      <p className="font-serif text-lg" style={{ color: "var(--inv-accent)", fontFamily: "var(--font-playfair)" }}>
        {namaPria} &amp; {namaWanita}
      </p>
      <p className="mt-3 text-xs italic" style={{ color: "var(--inv-accent)", opacity: 0.6 }}>
        {footerText}
      </p>
      <div className="mx-auto mt-5 flex w-20 items-center justify-center gap-2">
        <div className="h-px flex-1" style={{ backgroundColor: "var(--inv-accent-soft)" }} />
        <div className="h-px flex-1" style={{ backgroundColor: "var(--inv-accent-soft)" }} />
      </div>
      <div className="mt-3 flex items-center justify-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 30 30" style={{ opacity: 0.6 }}>
          <rect x="1.49" y="1.49" width="27.02" height="27.02" rx="4" fill="#2D2D2D" stroke="#FFFFFF" strokeWidth="0.6" />
          <path d="M15.47,7.1l-1.3,1.85c-0.2,0.29-0.54,0.47-0.9,0.47h-7.1V7.09C6.16,7.1,15.47,7.1,15.47,7.1z" fill="#FFFFFF" />
          <polygon points="24.3,7.1 13.14,22.91 5.7,22.91 16.86,7.1" fill="#FFFFFF" />
          <path d="M14.53,22.91l1.31-1.86c0.2-0.29,0.54-0.47,0.9-0.47h7.09v2.33H14.53z" fill="#FFFFFF" />
        </svg>
        <p className="text-xs" style={{ color: "var(--inv-accent)", opacity: 0.7 }}>
          Undangan<span style={{ opacity: 1, fontWeight: 700 }}>Nauka</span>
        </p>
      </div>
    </footer>
  );
}

// Helper to safely parse JSON from DB
function safeJsonParse<T>(jsonStr: string | null, fallback: T): T {
  if (!jsonStr) return fallback;
  try {
    return JSON.parse(jsonStr) as T;
  } catch {
    return fallback;
  }
}

function InvitationViewerContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [templateConfig, setTemplateConfig] = useState<any>(null);

  // Guest name personalization from URL param
  const guestName = searchParams.get("guest") || "Tamu Undangan";

  const handleEnvelopeOpen = () => {
    setIsEnvelopeOpen(true);
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
  };

  useEffect(() => {
    async function fetchInvitation() {
      try {
        const res = await fetch(`/api/invitation/slug/${slug}`);
        if (!res.ok) throw new Error("Undangan tidak ditemukan");
        const data = await res.json();
        setInvitation(data.invitation);
        // Fetch template config if templateId exists
        if (data.invitation?.templateId) {
          try {
            const tRes = await fetch(`/api/template/${data.invitation.templateId}`);
            if (tRes.ok) {
              const tData = await tRes.json();
              if (tData.template?.config) setTemplateConfig(tData.template.config);
            }
          } catch {}
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Gagal memuat undangan");
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchInvitation();
  }, [slug]);

  const nuansa = (invitation?.nuansa || "islam") as NuansaType;
  const adat = (invitation?.adat || "jawa") as AdatType;
  const tingkat = (invitation?.tingkat || "mewah") as DesignType;
  const isJawa = adat === 'jawa';

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: "var(--inv-bg)" }}>
        <Loader2 className="size-8 animate-spin" style={{ color: "var(--inv-accent)" }} />
        <p className="mt-4 text-sm" style={{ color: "var(--inv-text-muted)" }}>Memuat undangan...</p>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: "var(--inv-bg)" }}>
        <div className="text-center">
          <p className="font-[family-name:var(--font-playfair)] text-2xl font-bold mb-2" style={{ color: "var(--inv-primary)" }}>
            Undangan Tidak Ditemukan
          </p>
          <p className="text-sm" style={{ color: "var(--inv-text-muted)" }}>
            Link undangan mungkin salah atau sudah tidak aktif.
          </p>
        </div>
      </div>
    );
  }

  // Parse JSON fields from DB
  const galleryPhotos: string[] = safeJsonParse<string[]>(invitation.fotoGallery, []);
  const guestbookEntries = invitation.guestbook?.map((entry) => ({
    id: entry.id,
    name: entry.name,
    message: entry.message,
    createdAt: entry.createdAt,
  }));

  const ourStoryMilestones = safeJsonParse(invitation.ourStory, []);
  const loveQuotesData = safeJsonParse<{ text: string; source?: string }[]>(invitation.loveQuotes, []);
  const bridesmaidGroomsmanData = safeJsonParse<{
    bridesmaids: { name: string; role?: string }[];
    groomsmen: { name: string; role?: string }[];
  }>(invitation.bridesmaidGroomsman, { bridesmaids: [], groomsmen: [] });
  const itineraryItems = safeJsonParse<{ time: string; event: string; description: string }[]>(invitation.weddingItinerary, []);
  const amplopDigitalData = safeJsonParse<{ bank: string; accountNumber: string; accountHolder: string }[]>(invitation.amplopDigital, []);

  // Get palette CSS vars from template config
  const paletteId = templateConfig?.colorPalette as string | undefined;
  const palette = paletteId ? JAVANESE_COLOR_PALETTES.find(p => p.id === paletteId) : null;
  const paletteVars: Record<string, string> = palette ? {
    '--inv-bg': palette.bg,
    '--inv-primary': palette.primary,
    '--inv-secondary': palette.secondary,
    '--inv-accent': palette.accent,
    '--inv-text': palette.text,
    '--inv-text-muted': palette.textSub,
    '--inv-section-bg': palette.sectionBg,
    '--inv-border': palette.border,
    '--inv-footer-bg': palette.sectionBg,
    '--inv-envelope-bg': palette.bg,
    '--inv-envelope-accent': palette.accent,
  } : {};

  return (
    <InvitationThemeProvider nuansa={nuansa} adat={adat} tingkat={tingkat}>
      <div className="relative min-h-screen" style={{ backgroundColor: "var(--inv-bg)", ...paletteVars }}>
        {isEnvelopeOpen && <ScrollProgress />}
        {isEnvelopeOpen && <FlowerPetals />}
        {isEnvelopeOpen && <GoldSparkle />}

        <OpeningAnimation
          type={(templateConfig?.openingAnimation as any) || 'envelope'}
          guestName={guestName}
          greeting={invitation.greeting || undefined}
          fotoPria={invitation.fotoPria}
          fotoWanita={invitation.fotoWanita}
          namaPria={invitation.namaPria}
          namaWanita={invitation.namaWanita}
          nuansa={invitation.nuansa || undefined}
          adat={invitation.adat || undefined}
          onOpen={handleEnvelopeOpen}
        />

        {isEnvelopeOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <ScrollIndicator />

            {/* ═══ WAYANG KULIT — Hero Kalpataru at top ═══ */}
            {isJawa && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="py-4"
              >
                <WayangHeroScene />
              </motion.div>
            )}

            {/* ═══ Javanese Batik Scallop Top Border ═══ */}
            {isJawa && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <BatikScallopTop />
              </motion.div>
            )}

            {/* Guest Welcome — personalization from URL */}
            <GuestWelcome guestName={guestName} />

            {/* Aksara Jawa after GuestWelcome for Jawa adat */}
            {isJawa && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="py-4"
              >
                <AksaraJawaOrnament />
              </motion.div>
            )}

            {/* Javanese Batik Scallop bottom border */}
            {isJawa && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <BatikScallopBottom />
              </motion.div>
            )}

            {/* ═══ Wayang Arjuna & Srikandi flanking Mempelai ═══ */}
            {isJawa && (
              <div className="relative">
                <motion.div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-14 md:w-20 opacity-20 pointer-events-none z-10"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 0.2, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                >
                  <WayangArjuna />
                </motion.div>
                <motion.div
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-14 md:w-20 opacity-20 pointer-events-none z-10"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 0.2, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                >
                  <WayangSrikandi />
                </motion.div>
                <Mempelai
                  namaPria={invitation.namaPria}
                  namaWanita={invitation.namaWanita}
                  namaOrtuPria={invitation.namaOrtuPria}
                  namaOrtuWanita={invitation.namaOrtuWanita}
                  greeting={invitation.greeting}
                  fotoPria={invitation.fotoPria}
                  fotoWanita={invitation.fotoWanita}
                  fotoBackground={invitation.fotoBackground}
                />
              </div>
            )}
            {!isJawa && (
              <Mempelai
                namaPria={invitation.namaPria}
                namaWanita={invitation.namaWanita}
                namaOrtuPria={invitation.namaOrtuPria}
                namaOrtuWanita={invitation.namaOrtuWanita}
                greeting={invitation.greeting}
                fotoPria={invitation.fotoPria}
                fotoWanita={invitation.fotoWanita}
                fotoBackground={invitation.fotoBackground}
              />
            )}
            <GoldDivider variant="ornate" isJawa={isJawa} />

            {/* Adat Pepatah — cultural proverb/phrase section */}
            {isJawa && <BatikScallopTop />}
            <AdatPepatah />
            {isJawa && <BatikScallopBottom />}
            <GoldDivider variant="simple" isJawa={isJawa} />

            {/* Love Quotes Rotator - from builder */}
            {loveQuotesData.length > 0 && (
              <>
                <LoveQuotes quotes={loveQuotesData} />
                <GoldDivider variant="simple" isJawa={isJawa} />
              </>
            )}

            {/* Our Story Timeline - from builder */}
            {ourStoryMilestones.length > 0 && (
              <>
                <OurStory milestones={ourStoryMilestones} />
                <GoldDivider variant="floral" isJawa={isJawa} />
              </>
            )}

            {/* Quran Verse — flanked by Megamendung clouds for Jawa */}
            <div className="relative">
              {isJawa && (
                <motion.div
                  className="absolute left-0 top-0 w-12 md:w-16 opacity-30 pointer-events-none"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 0.3, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                >
                  <MegamendungLeft />
                </motion.div>
              )}
              {isJawa && (
                <motion.div
                  className="absolute right-0 top-0 w-12 md:w-16 opacity-30 pointer-events-none"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 0.3, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                >
                  <MegamendungRight />
                </motion.div>
              )}
              <BatikBorderFrame variant="elegant" className="mx-4 md:mx-8">
                <QuranVerse ayatQuote={invitation.ayatQuote} />
              </BatikBorderFrame>
            </div>
            <GoldDivider variant="ornate" isJawa={isJawa} />

            {/* Event Details — with JavaneseDoubleBorder for Jawa adat */}
            {isJawa ? (
              <div className="mx-4 md:mx-8">
                <BatikScallopTop />
                <JavaneseDoubleBorder className="mx-2">
                  <EventDetails
                    tanggalAkad={invitation.tanggalAkad}
                    waktuAkad={invitation.waktuAkad}
                    lokasiAkad={invitation.lokasiAkad}
                    alamatAkad={invitation.alamatAkad}
                    mapsAkadUrl={invitation.mapsAkadUrl}
                    tanggalResepsi={invitation.tanggalResepsi}
                    waktuResepsi={invitation.waktuResepsi}
                    lokasiResepsi={invitation.lokasiResepsi}
                    alamatResepsi={invitation.alamatResepsi}
                    mapsResepsiUrl={invitation.mapsResepsiUrl}
                  />
                </JavaneseDoubleBorder>
                <BatikScallopBottom />
              </div>
            ) : (
              <BatikBorderFrame variant="simple" className="mx-4 md:mx-8">
                <EventDetails
                  tanggalAkad={invitation.tanggalAkad}
                  waktuAkad={invitation.waktuAkad}
                  lokasiAkad={invitation.lokasiAkad}
                  alamatAkad={invitation.alamatAkad}
                  mapsAkadUrl={invitation.mapsAkadUrl}
                  tanggalResepsi={invitation.tanggalResepsi}
                  waktuResepsi={invitation.waktuResepsi}
                  lokasiResepsi={invitation.lokasiResepsi}
                  alamatResepsi={invitation.alamatResepsi}
                  mapsResepsiUrl={invitation.mapsResepsiUrl}
                />
              </BatikBorderFrame>
            )}
            <GoldDivider variant="simple" isJawa={isJawa} />

            {/* Flip-Clock Countdown — with Wayang figures for Jawa */}
            {isJawa && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <WayangBottomScene className="mb-4" />
              </motion.div>
            )}
            <CountdownFlip targetDate={invitation.tanggalAkad || undefined} />
            {isJawa && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-4"
              >
                <AksaraJawaOrnament text="ꦩꦸꦒꦶ" />
              </motion.div>
            )}
            <GoldDivider variant="ornate" isJawa={isJawa} />

            {/* Wedding Itinerary - from builder */}
            {itineraryItems.length > 0 && (
              <>
                <WeddingItinerary items={itineraryItems} />
                <GoldDivider variant="floral" isJawa={isJawa} />
              </>
            )}

            {/* Welcome Video - from builder */}
            {invitation.welcomeVideo && (
              <>
                <WelcomeVideo videoUrl={invitation.welcomeVideo} />
                <GoldDivider variant="floral" isJawa={isJawa} />
              </>
            )}

            {/* Photo Gallery — with interactive lightbox */}
            {galleryPhotos.length > 0 && (
              <>
                <PhotoGallery photos={galleryPhotos} />
                <GoldDivider variant="ornate" isJawa={isJawa} />
              </>
            )}

            {/* Bridesmaid & Groomsman - from builder */}
            {(bridesmaidGroomsmanData.bridesmaids.length > 0 || bridesmaidGroomsmanData.groomsmen.length > 0) && (
              <>
                <BridesmaidGroomsman
                  bridesmaids={bridesmaidGroomsmanData.bridesmaids}
                  groomsmen={bridesmaidGroomsmanData.groomsmen}
                />
                <GoldDivider variant="simple" isJawa={isJawa} />
              </>
            )}

            {/* RSVP Form — with AksaraJawa and BatikStripBorder before for Jawa */}
            {isJawa && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="py-4"
              >
                <AksaraJawaOrnament text="ꦏꦶꦫꦶꦩ꧀" />
                <div className="mt-3">
                  <BatikStripBorder showHorse />
                </div>
              </motion.div>
            )}
            <BatikBorderFrame variant="elegant" className="mx-4 md:mx-8">
              <RSVPForm invitationId={invitation.id} />
            </BatikBorderFrame>
            <GoldDivider variant="ornate" isJawa={isJawa} />

            {/* Guestbook */}
            {isJawa && <BatikScallopTop />}
            <Guestbook
              invitationId={invitation.id}
              initialEntries={guestbookEntries}
            />
            {isJawa && <BatikScallopBottom />}
            <GoldDivider variant="floral" isJawa={isJawa} />

            {/* Amplop Digital - from builder */}
            <BatikBorderFrame variant="simple" className="mx-4 md:mx-8">
              <AmplopDigital
                namaPria={invitation.namaPria}
                namaWanita={invitation.namaWanita}
                bankAccounts={amplopDigitalData.length > 0 ? amplopDigitalData : undefined}
              />
            </BatikBorderFrame>
            <GoldDivider variant="simple" isJawa={isJawa} />

            <ShareButtons
              namaPria={invitation.namaPria}
              namaWanita={invitation.namaWanita}
            />

            {/* Javanese closing ornaments before footer */}
            {isJawa && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="mt-6"
              >
                <BatikStripBorder showHorse />
                <div className="mt-4">
                  <WayangBottomScene />
                </div>
                <div className="mt-3">
                  <AksaraJawaOrnament text="ꦩꦠꦸꦂ ꦤꦸꦮꦸꦤ꧀" />
                </div>
              </motion.div>
            )}

            <OrnamentalFooter namaPria={invitation.namaPria} namaWanita={invitation.namaWanita} nuansa={invitation.nuansa || undefined} />
          </motion.div>
        )}

        {isEnvelopeOpen && (invitation.musikUrl || templateConfig?.musicPreset) && invitation.musikUrl !== "none" && (
          <MusicPlayer
            musikUrl={
              templateConfig?.musicPreset
                ? `/music/${templateConfig.musicPreset}.mp3`
                : invitation.musikUrl?.startsWith("http") || invitation.musikUrl?.startsWith("data:") || invitation.musikUrl?.startsWith("/api/")
                  ? invitation.musikUrl
                  : `/music/${invitation.musikUrl}.mp3`
            }
            autoPlay={true}
          />
        )}
      </div>
    </InvitationThemeProvider>
  );
}

export default function InvitationViewerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#561C24]">
          <Loader2 className="size-8 animate-spin text-[#C7B7A3]" />
          <p className="mt-4 text-sm text-[#C7B7A3]/70">Memuat undangan...</p>
        </div>
      }
    >
      <InvitationViewerContent />
    </Suspense>
  );
}
