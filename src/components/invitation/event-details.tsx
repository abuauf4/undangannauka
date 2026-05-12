'use client';

import { Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionReveal } from './section-reveal';
import { useInvitationTheme } from './theme-provider';
import { JavaneseGoldDivider } from './javanese-ornaments';

interface EventData {
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapUrl: string;
}

interface EventDetailsProps {
  tanggalAkad?: string | null;
  waktuAkad?: string | null;
  lokasiAkad?: string | null;
  alamatAkad?: string | null;
  mapsAkadUrl?: string | null;
  tanggalResepsi?: string | null;
  waktuResepsi?: string | null;
  lokasiResepsi?: string | null;
  alamatResepsi?: string | null;
  mapsResepsiUrl?: string | null;
}

function formatEventDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  try {
    const parsed = new Date(dateStr + 'T00:00:00');
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    }
  } catch {}
  return dateStr;
}

/* Javanese Pasaran Day Calculation */
const pasaranDays = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

function getPasaranDay(dateStr?: string | null): string {
  if (!dateStr) return '';
  try {
    const parsed = new Date(dateStr + 'T00:00:00');
    if (isNaN(parsed.getTime())) return '';
    const refDate = new Date(1900, 0, 1);
    const diffTime = parsed.getTime() - refDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const pasaranIndex = ((diffDays % 5) + 5) % 5;
    return pasaranDays[pasaranIndex];
  } catch {}
  return '';
}

function formatEventDateWithPasaran(dateStr?: string | null, showPasaran?: boolean): string {
  const formatted = formatEventDate(dateStr);
  if (!showPasaran) return formatted;
  const pasaran = getPasaranDay(dateStr);
  if (!formatted || !pasaran) return formatted;
  const parts = formatted.split(', ');
  if (parts.length >= 2) {
    return `${parts[0]} ${pasaran}, ${parts.slice(1).join(', ')}`;
  }
  return formatted;
}

export function EventDetails(props: EventDetailsProps) {
  const { nuansa, adat, adatKey } = useInvitationTheme();
  const showPasaran = adat.showPasaran;
  const isJawa = adatKey === 'jawa';

  const events = buildEvents(props, nuansa.eventLabelAkad, nuansa.eventLabelResepsi, showPasaran);

  /* ─── JAVANESE THEME ─── */
  if (isJawa) {
    return (
      <section className="relative py-16 md:py-24 overflow-hidden" style={{ backgroundColor: '#F5F0E6' }}>
        {/* Aged paper texture */}
        <div className="absolute inset-0 inv-jawa-aged-paper" />
        <div className="absolute inset-0 inv-jawa-parang-bg opacity-50" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          {/* Section title */}
          <SectionReveal direction="scale">
            <h2
              className="font-serif text-3xl font-bold md:text-4xl"
              style={{ color: '#3A2A1A', fontFamily: 'var(--font-playfair)' }}
            >
              Rangkaian Acara
            </h2>
          </SectionReveal>

          <SectionReveal direction="fade" delay={0.2}>
            <JavaneseGoldDivider className="my-6" />
          </SectionReveal>

          {/* Event cards */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {events.map((event, index) => (
              <SectionReveal key={event.title} direction={index % 2 === 0 ? 'left' : 'right'} delay={0.3 + index * 0.2}>
                <div
                  className="group rounded-lg p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    backgroundColor: '#EDE7D9',
                    border: '2px solid #D4AF37',
                    boxShadow: '0 0 15px rgba(212,175,55,0.1)',
                  }}
                >
                  {/* Event title */}
                  <h3
                    className="mb-4 font-serif text-2xl font-semibold"
                    style={{ color: '#3A2A1A', fontFamily: 'var(--font-playfair)' }}
                  >
                    {event.title}
                  </h3>

                  {/* Gold divider under title */}
                  <JavaneseGoldDivider className="mb-5" />

                  {/* Event details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="h-4 w-4 shrink-0" style={{ color: '#D4AF37' }} />
                      <span className="text-sm font-medium" style={{ color: '#5D4A3A' }}>
                        {event.date}
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <Clock className="h-4 w-4 shrink-0" style={{ color: '#D4AF37' }} />
                      <span className="text-sm font-medium" style={{ color: '#5D4A3A' }}>
                        {event.time}
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0" style={{ color: '#D4AF37' }} />
                      <span className="text-sm font-semibold" style={{ color: '#3A2A1A' }}>
                        {event.venue}
                      </span>
                    </div>

                    <p className="text-xs" style={{ color: '#5D4A3A' }}>
                      {event.address}
                    </p>

                    {/* Map link */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 cursor-pointer"
                      style={{
                        borderColor: '#D4AF37',
                        color: '#3A2A1A',
                      }}
                      asChild
                    >
                      <a
                        href={event.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-1 h-3.5 w-3.5" />
                        Lihat Peta
                      </a>
                    </Button>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ─── NON-JAWA THEME: Original event details layout ─── */
  return (
    <section className="relative py-16 md:py-24" style={{ backgroundColor: 'var(--inv-bg)' }}>
      <div className="mx-auto max-w-4xl px-4 text-center">
        {/* Section title */}
        <SectionReveal direction="scale">
          <h2
            className="font-serif text-3xl font-bold md:text-4xl"
            style={{ color: 'var(--inv-primary)', fontFamily: 'var(--font-playfair)' }}
          >
            Rangkaian Acara
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

        {/* Event cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {events.map((event, index) => (
            <SectionReveal key={event.title} direction={index % 2 === 0 ? 'left' : 'right'} delay={0.3 + index * 0.2}>
              <div
                className="group rounded-lg border-2 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  backgroundColor: 'var(--inv-bg-pattern)',
                  borderColor: 'var(--inv-accent)',
                }}
              >
                {/* Event title */}
                <h3
                  className="mb-4 font-serif text-2xl font-semibold"
                  style={{ color: 'var(--inv-primary)', fontFamily: 'var(--font-playfair)' }}
                >
                  {event.title}
                </h3>

                {/* Ornamental line under title */}
                <div className="mx-auto mb-5 flex w-20 items-center justify-center gap-1">
                  <div className="h-px flex-1" style={{ backgroundColor: 'var(--inv-accent)' }} />
                  <div className="h-1.5 w-1.5 rotate-45" style={{ backgroundColor: 'var(--inv-accent)' }} />
                  <div className="h-px flex-1" style={{ backgroundColor: 'var(--inv-accent)' }} />
                </div>

                {/* Event details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0" style={{ color: 'var(--inv-accent)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--inv-text-muted)' }}>
                      {event.date}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <Clock className="h-4 w-4 shrink-0" style={{ color: 'var(--inv-accent)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--inv-text-muted)' }}>
                      {event.time}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0" style={{ color: 'var(--inv-accent)' }} />
                    <span className="text-sm font-semibold" style={{ color: 'var(--inv-primary)' }}>
                      {event.venue}
                    </span>
                  </div>

                  <p className="text-xs" style={{ color: 'var(--inv-text-muted)' }}>
                    {event.address}
                  </p>

                  {/* Map link */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 cursor-pointer"
                    style={{
                      borderColor: 'var(--inv-accent)',
                      color: 'var(--inv-primary)',
                    }}
                    asChild
                  >
                    <a
                      href={event.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-1 h-3.5 w-3.5" />
                      Lihat Peta
                    </a>
                  </Button>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function buildEvents(props: EventDetailsProps, labelAkad: string, labelResepsi: string, showPasaran: boolean): EventData[] {
  const events: EventData[] = [];

  events.push({
    title: labelAkad,
    date: formatEventDateWithPasaran(props.tanggalAkad, showPasaran) || 'Belum ditentukan',
    time: props.waktuAkad || 'Belum ditentukan',
    venue: props.lokasiAkad || 'Belum ditentukan',
    address: props.alamatAkad || '',
    mapUrl: props.mapsAkadUrl || '#',
  });

  if (props.tanggalResepsi || props.lokasiResepsi) {
    events.push({
      title: labelResepsi,
      date: formatEventDateWithPasaran(props.tanggalResepsi, showPasaran) || formatEventDateWithPasaran(props.tanggalAkad, showPasaran) || 'Belum ditentukan',
      time: props.waktuResepsi || 'Belum ditentukan',
      venue: props.lokasiResepsi || 'Belum ditentukan',
      address: props.alamatResepsi || '',
      mapUrl: props.mapsResepsiUrl || '#',
    });
  }

  return events;
}
