import type { BuilderData } from "@/lib/builder-context";

/**
 * Shared demo invitation data for landing page and template preview.
 * Single source of truth — no duplication.
 */
export const demoData: BuilderData = {
  templateId: "maroon-javanese",
  templateName: "Maroon Javanese",
  templateGradient: "from-[#561C24] via-[#6D2932] to-[#C7B7A3]",
  templateCategory: "islam",
  namaPria: "Ahmad Fauzan",
  namaWanita: "Aisyah Rahma",
  namaOrtuPria: "Bapak H. Muhammad Rizki",
  namaOrtuWanita: "Bapak H. Abdullah Hakim",
  greeting: "Assalamu'alaikum Warahmatullahi Wabarakatuh",
  ayatQuote:
    "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan dari jenismu sendiri, supaya kamu merasa tenteram kepadanya.",
  tanggalAkad: "2025-08-17",
  waktuAkad: "08:00",
  lokasiAkad: "Masjid Agung Al-Akbar",
  alamatAkad: "Jl. Masjid No. 1, Surabaya",
  mapsAkadUrl: "",
  punyaResepsi: true,
  tanggalResepsi: "2025-08-17",
  waktuResepsi: "11:00",
  lokasiResepsi: "Gedung Serba Guna",
  alamatResepsi: "Jl. Raya No. 10, Surabaya",
  mapsResepsiUrl: "",
  fotoPria: "",
  fotoWanita: "",
  fotoGallery: [],
  musikPilihan: "nasyid",
  customMusicUrl: "",
  nuansa: "islam",
  adat: "jawa",
  tingkat: "mewah",
  fotoBackground: "",
  ourStory: [
    {
      date: "2019",
      title: "Pertama Bertemu",
      description:
        "Kami pertama kali bertemu di sebuah acara kampus.",
      icon: "star",
    },
    {
      date: "2023",
      title: "Lamaran",
      description:
        "Di tengah mawar dan lilin, aku meluncurkan pertanyaan yang telah lama kunanti.",
      icon: "ring",
    },
  ],
  loveQuotes: [
    {
      text: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan dari jenismu sendiri.",
      source: "QS. Ar-Rum: 21",
    },
  ],
  bridesmaids: [],
  groomsmen: [],
  weddingItinerary: [],
  welcomeVideo: "",
  amplopDigital: [],
};
