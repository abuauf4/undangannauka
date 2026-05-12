"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";

export function WhatsAppFAB() {
  const [isOpen, setIsOpen] = useState(false);

  const waNumber = "6289655592925"; // Nomor WA bisnis
  const waMessage = encodeURIComponent(
    "Halo UndanganNauka! Saya tertarik membuat undangan digital pernikahan. Bisa bantu saya?"
  );
  const waLink = `https://wa.me/${waNumber}?text=${waMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip / Expanded Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-2 items-end mb-2"
          >
            {/* Chat Option */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white dark:bg-gray-900 rounded-full pl-4 pr-3 py-2.5 shadow-lg border border-border hover:border-[var(--gold)] transition-all group"
            >
              <span className="text-sm font-medium text-foreground mr-2">
                Chat via WhatsApp
              </span>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#25D366] text-white">
                <Send className="size-3.5" />
              </div>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-all duration-300 hover:scale-110"
        style={{ backgroundColor: "#25D366" }}
        whileTap={{ scale: 0.95 }}
        aria-label="WhatsApp"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="size-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="size-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse ring */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: "#25D366" }} />
        )}
      </motion.button>
    </div>
  );
}
