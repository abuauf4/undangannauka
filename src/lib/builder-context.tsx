"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface StoryMilestone {
  date: string;
  title: string;
  description: string;
  icon: 'heart' | 'ring' | 'home' | 'star';
}

export interface LoveQuote {
  text: string;
  source?: string;
}

export interface WeddingPartyMember {
  name: string;
  role?: string;
}

export interface ItineraryItem {
  time: string;
  event: string;
  description: string;
}

export interface BankAccount {
  bank: string;
  accountNumber: string;
  accountHolder: string;
}

export interface BuilderData {
  // Template
  templateId: string;
  templateName: string;
  templateGradient: string;
  templateCategory: string;

  // Mempelai
  namaPria: string;
  namaWanita: string;
  namaOrtuPria: string;
  namaOrtuWanita: string;
  greeting: string;
  ayatQuote: string;

  // Acara
  tanggalAkad: string;
  waktuAkad: string;
  lokasiAkad: string;
  alamatAkad: string;
  mapsAkadUrl: string;
  punyaResepsi: boolean;
  tanggalResepsi: string;
  waktuResepsi: string;
  lokasiResepsi: string;
  alamatResepsi: string;
  mapsResepsiUrl: string;

  // Personalisasi
  fotoPria: string;           // Supabase Storage URL (uploaded immediately when selected)
  fotoWanita: string;         // Supabase Storage URL
  fotoGallery: string[];      // array of Supabase Storage URLs (max 10)
  musikPilihan: string;       // "none" | "nasyid" | "gamelan" | ... | "custom"
  customMusicUrl: string;     // Supabase Storage URL for custom uploaded music

  // Theme
  nuansa: string;
  adat: string;
  tingkat: string;

  // Fitur Tambahan
  fotoBackground: string;
  ourStory: StoryMilestone[];
  loveQuotes: LoveQuote[];
  bridesmaids: WeddingPartyMember[];
  groomsmen: WeddingPartyMember[];
  weddingItinerary: ItineraryItem[];
  welcomeVideo: string;
  amplopDigital: BankAccount[];
}

const defaultData: BuilderData = {
  templateId: "",
  templateName: "",
  templateGradient: "",
  templateCategory: "",
  namaPria: "",
  namaWanita: "",
  namaOrtuPria: "",
  namaOrtuWanita: "",
  greeting: "",
  ayatQuote: "",
  tanggalAkad: "",
  waktuAkad: "",
  lokasiAkad: "",
  alamatAkad: "",
  mapsAkadUrl: "",
  punyaResepsi: false,
  tanggalResepsi: "",
  waktuResepsi: "",
  lokasiResepsi: "",
  alamatResepsi: "",
  mapsResepsiUrl: "",
  fotoPria: "",
  fotoWanita: "",
  fotoGallery: [],          // max 10 gallery photos
  musikPilihan: "none",
  customMusicUrl: "",

  nuansa: "islam",
  adat: "jawa",
  tingkat: "mewah",

  // Fitur Tambahan defaults
  fotoBackground: "",
  ourStory: [
    { date: '2019', title: 'Pertama Bertemu', description: 'Kami pertama kali bertemu di sebuah acara kampus. Senyummu yang hangat membuatku ingin mengenalmu lebih dekat.', icon: 'star' },
    { date: '2020', title: 'Mulai Dekat', description: 'Obrolan ringan berubah menjadi percakapan panjang hingga dini hari. Kami menyadari ada kecocokan yang tak bisa dipungkiri.', icon: 'heart' },
    { date: '2023', title: 'Lamaran', description: 'Di tengah mawar dan lilin, aku meluncurkan pertanyaan yang telah lama kunanti. Dan kau menjawab "Ya".', icon: 'ring' },
    { date: '2024', title: 'Menuju Pelaminan', description: 'Dengan izin Allah, kami siap melangkah bersama membangun rumah tangga penuh cinta dan keberkahan.', icon: 'home' },
  ],
  loveQuotes: [
    { text: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan dari jenismu sendiri, supaya kamu merasa tenteram kepadanya.', source: 'QS. Ar-Rum: 21' },
    { text: 'Perempuan-perempuan yang baik adalah untuk laki-laki yang baik, dan laki-laki yang baik untuk perempuan yang baik.', source: 'QS. An-Nur: 26' },
    { text: 'Sebaik-baik kalian adalah yang paling baik kepada istrinya.', source: 'HR. Tirmidzi' },
    { text: 'Jika seseorang menikah, maka ia telah menyempurnakan separuh agamanya. Maka bertakwalah kepada Allah untuk separuh yang lain.', source: 'HR. Baihaqi' },
    { text: 'Tidaklah dua orang muslim berkumpul (dalam ikatan nikah) kecuali Allah mengabulkan doa di antara mereka.', source: 'HR. Ahmad' },
  ],
  bridesmaids: [
    { name: 'Siti Rahma', role: 'Maid of Honor' },
    { name: 'Aisyah Dewi', role: 'Bridesmaid' },
    { name: 'Fatimah Zahra', role: 'Bridesmaid' },
  ],
  groomsmen: [
    { name: 'Muhammad Rizki', role: 'Best Man' },
    { name: 'Abdullah Hakim', role: 'Groomsman' },
    { name: 'Umar Faruq', role: 'Groomsman' },
  ],
  weddingItinerary: [
    { time: '07:00', event: 'Persiapan Mempelai', description: 'Makeup & styling mempelai wanita' },
    { time: '09:00', event: 'Akad Nikah', description: 'Ijab kabul di masjid' },
    { time: '10:30', event: 'Foto Sesi', description: 'Photo session bersama keluarga' },
    { time: '12:00', event: 'Resepsi', description: 'Makan bersama tamu undangan' },
    { time: '14:00', event: 'Entertain', description: 'Hiburan & persembahan dari sahabat' },
    { time: '15:30', event: 'Penutup', description: 'Bersama foto & pamitan' },
  ],
  welcomeVideo: "",
  amplopDigital: [
    { bank: 'BCA', accountNumber: '', accountHolder: '' },
    { bank: 'BNI', accountNumber: '', accountHolder: '' },
  ],
};

interface BuilderContextType {
  data: BuilderData;
  setData: (data: Partial<BuilderData>) => void;
  step: number;
  setStep: (step: number) => void;
  resetData: () => void;
}

const BuilderContext = createContext<BuilderContextType | null>(null);

const STORAGE_KEY = "undangannauka_builder_data";
const STEP_KEY = "undangannauka_builder_step";

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<BuilderData>(defaultData);
  const [step, setStepState] = useState(1);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage — merge with defaults so new fields are never undefined
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const savedStep = localStorage.getItem(STEP_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaultData to ensure all new fields have values
        queueMicrotask(() => setDataState({ ...defaultData, ...parsed }));
      }
      if (savedStep) queueMicrotask(() => setStepState(parseInt(savedStep, 10)));
    } catch {
      // If localStorage is corrupted, just use defaults
    }
    queueMicrotask(() => setHydrated(true));
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(STEP_KEY, String(step));
    } catch {}
  }, [data, step, hydrated]);

  const setData = (partial: Partial<BuilderData>) => {
    setDataState((prev) => ({ ...prev, ...partial }));
  };

  const setStep = (s: number) => {
    setStepState(Math.max(1, Math.min(6, s)));
  };

  const resetData = () => {
    setDataState(defaultData);
    setStepState(1);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STEP_KEY);
    } catch {}
  };

  if (!hydrated) return null;

  return (
    <BuilderContext.Provider value={{ data, setData, step, setStep, resetData }}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error("useBuilder must be used within BuilderProvider");
  return ctx;
}
