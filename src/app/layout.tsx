import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://undangannauka.id"),
  title: {
    default: "UndanganNauka — Undangan Digital Pernikahan Premium Rp 99K",
    template: "%s | UndanganNauka",
  },
  description:
    "Buat undangan pernikahan digital yang memukau dengan desain premium. RSVP digital, buku tamu, galeri foto, musik latar, amplop digital. Semua fitur cuma Rp 99.000.",
  keywords: [
    "undangan digital",
    "undangan pernikahan",
    "undangan online",
    "undangan pernikahan digital",
    "wedding invitation digital",
    "RSVP digital",
    "buku tamu digital",
    "amplop digital",
    "UndanganNauka",
    "undangan mewah",
    "undangan elegan",
    "undangan Islami",
    "undangan Jawa",
    "undangan Batak",
    "undangan Bali",
    "undangan murah",
    "undangan pernikahan online",
    "e-wedding invitation Indonesia",
  ],
  authors: [{ name: "UndanganNauka", url: "https://undangannauka.id" }],
  creator: "UndanganNauka",
  publisher: "UndanganNauka",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/logo-undangannauka.png", sizes: "32x32" },
    ],
    apple: "/logo-undangannauka.png",
  },
  openGraph: {
    title: "UndanganNauka — Undangan Digital Pernikahan Premium",
    description:
      "Buat undangan pernikahan digital yang memukau — desain premium, RSVP, buku tamu, galeri foto, musik, amplop digital. Semua fitur cuma Rp 99.000.",
    url: "https://undangannauka.id",
    siteName: "UndanganNauka",
    type: "website",
    locale: "id_ID",
    images: [
      {
        url: "/hero-wedding.png",
        width: 1344,
        height: 768,
        alt: "UndanganNauka - Undangan Digital Pernikahan Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UndanganNauka — Undangan Digital Pernikahan Premium Rp 99K",
    description:
      "Buat undangan pernikahan digital premium dengan semua fitur lengkap cuma Rp 99.000.",
    images: ["/hero-wedding.png"],
  },
  alternates: {
    canonical: "https://undangannauka.id",
  },
  category: "Lifestyle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Structured Data
  const jsonLdWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "UndanganNauka",
    description:
      "Platform undangan digital pernikahan premium dengan desain mewah dan elegan",
    url: "https://undangannauka.id",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://undangannauka.id/template?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const jsonLdProduct = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "UndanganNauka",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "99000",
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "5200",
      bestRating: "5",
    },
    description:
      "Platform undangan digital pernikahan premium dengan desain mewah dan elegan. Semua fitur lengkap termasuk RSVP digital, buku tamu, galeri foto, musik latar, amplop digital, dan countdown timer.",
  };

  const jsonLdOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "UndanganNauka",
    url: "https://undangannauka.id",
    logo: "https://undangannauka.id/logo-undangannauka.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+62-812-3456-7890",
      contactType: "customer service",
      availableLanguage: ["Indonesian", "English"],
    },
    sameAs: [
      "https://instagram.com/undangannauka",
      "https://facebook.com/undangannauka",
    ],
  };

  const jsonLdFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Berapa harga undangan digital UndanganNauka?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Semua template UndanganNauka harga satu harga: Rp 99.000 per undangan. Sudah termasuk semua fitur lengkap — RSVP digital, buku tamu, galeri foto, musik latar, amplop digital, countdown, dan masa aktif hingga 90 hari.",
        },
      },
      {
        "@type": "Question",
        name: "Apakah ada biaya tersembunyi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Tidak ada biaya tersembunyi sama sekali. Harga Rp 99.000 sudah mencakup semua fitur premium — sekali bayar, tanpa langganan bulanan, tanpa biaya tambahan.",
        },
      },
      {
        "@type": "Question",
        name: "Berapa lama undangan aktif?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Undangan aktif selama 90 hari sejak dipublikasikan. Jika butuh perpanjangan, bisa hubungi kami.",
        },
      },
    ],
  };

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProduct) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }}
        />
      </head>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
