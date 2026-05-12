"use client";

import { useBuilder } from "@/lib/builder-context";
import { Check } from "lucide-react";

const steps = [
  { number: 1, label: "Mempelai" },
  { number: 2, label: "Acara" },
  { number: 3, label: "Personalisasi" },
  { number: 4, label: "Fitur" },
  { number: 5, label: "Review" },
  { number: 6, label: "Link" },
];

export function StepIndicator() {
  const { step, setStep } = useBuilder();

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 py-4">
      {steps.map((s, idx) => (
        <div key={s.number} className="flex items-center">
          <button
            onClick={() => s.number <= step && setStep(s.number)}
            disabled={s.number > step}
            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
              s.number === step
                ? "bg-[var(--burgundy)] text-[var(--ivory)] shadow-md"
                : s.number < step
                ? "bg-[var(--gold)]/20 text-[var(--gold)] cursor-pointer hover:bg-[var(--gold)]/30"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {s.number < step ? (
              <Check className="size-3.5" />
            ) : (
              <span className="w-4 h-4 flex items-center justify-center text-[10px] font-bold">{s.number}</span>
            )}
            <span className="hidden sm:inline">{s.label}</span>
          </button>
          {idx < steps.length - 1 && (
            <div className={`w-4 sm:w-8 h-0.5 mx-1 ${s.number < step ? "bg-[var(--gold)]" : "bg-border"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
