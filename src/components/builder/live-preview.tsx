"use client";

import { useBuilder } from "@/lib/builder-context";
import { motion } from "framer-motion";

export function LivePreview() {
  const { data } = useBuilder();

  const hasTemplate = !!data.templateId;
  const names = `${data.namaPria || "Pria"} & ${data.namaWanita || "Wanita"}`;
  const greeting = data.greeting || "";

  return (
    <div className="sticky top-4 flex flex-col items-center">
      <p className="text-xs text-muted-foreground font-medium mb-3 uppercase tracking-wider">
        Live Preview
      </p>

      {/* iPhone Frame */}
      <div className="relative w-[200px] sm:w-[220px] md:w-[240px] aspect-[9/19.5] bg-gray-900 rounded-[28px] sm:rounded-[30px] p-[3px] shadow-2xl border border-gray-700/50">
        {/* Screen */}
        <div className={`relative w-full h-full rounded-[25px] sm:rounded-[27px] overflow-hidden ${
          hasTemplate ? `bg-gradient-to-br ${data.templateGradient}` : "bg-gradient-to-br from-gray-400 to-gray-600"
        }`}>
          {/* Dynamic Island */}
          <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[60px] sm:w-[70px] h-[16px] sm:h-[18px] bg-black rounded-full z-20" />

          {/* Content */}
          <div className="absolute inset-0 pt-[32px] pb-[10px] px-[10px] overflow-hidden flex flex-col items-center justify-center text-center text-white">
            {/* Greeting */}
            {greeting && (
              <motion.p
                key={greeting}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                className="font-[family-name:var(--font-playfair)] text-[8px] sm:text-[9px] tracking-wide mb-2"
              >
                {greeting}
              </motion.p>
            )}

            {/* Divider */}
            <div className="w-12 h-px bg-white/40 mb-3" />

            {/* Names */}
            <motion.h2
              key={names}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-[family-name:var(--font-playfair)] text-[14px] sm:text-[16px] font-bold leading-tight mb-2"
            >
              {names}
            </motion.h2>

            {/* Date */}
            {data.tanggalAkad && (
              <p className="text-[7px] sm:text-[8px] opacity-70 tracking-wider mb-3">
                {new Date(data.tanggalAkad).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            )}

            {/* Quote */}
            {data.ayatQuote && (
              <>
                <div className="w-8 h-px bg-white/30 mb-2" />
                <p className="text-[6px] sm:text-[7px] leading-relaxed opacity-70 max-w-[180px] line-clamp-3">
                  &ldquo;{data.ayatQuote}&rdquo;
                </p>
              </>
            )}

            {/* Parents */}
            {(data.namaOrtuPria || data.namaOrtuWanita) && (
              <div className="mt-3 space-y-1">
                {data.namaOrtuPria && (
                  <p className="text-[5px] opacity-60">{data.namaOrtuPria}</p>
                )}
                {data.namaOrtuWanita && (
                  <p className="text-[5px] opacity-60">{data.namaOrtuWanita}</p>
                )}
              </div>
            )}

            {/* Event info */}
            {data.lokasiAkad && (
              <div className="mt-3 text-[6px] sm:text-[7px] font-semibold tracking-wider border border-white/30 px-3 py-0.5 rounded-full">
                {data.lokasiAkad}
              </div>
            )}
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-[5px] left-1/2 -translate-x-1/2 w-[60px] sm:w-[70px] h-[3px] bg-white/30 rounded-full z-20" />
        </div>
      </div>

      {/* Template name label */}
      {hasTemplate && (
        <p className="mt-3 text-xs font-medium text-[var(--gold)]">{data.templateName}</p>
      )}
    </div>
  );
}
