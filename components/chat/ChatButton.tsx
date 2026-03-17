"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useChatStore } from "@/lib/store/chat-store";

export default function ChatButton() {
  const { isOpen, toggleChat } = useChatStore();
  const [pulseDone, setPulseDone] = useState(false);

  // Stop pulse after 3 cycles (~3s)
  useEffect(() => {
    const t = setTimeout(() => setPulseDone(true), 3200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center">
      {/* Pulse ring — shows on first load */}
      {!pulseDone && !isOpen && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "56px",
            height: "56px",
            backgroundColor: "rgba(200,162,78,0.3)",
          }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.2, repeat: 2, ease: "easeInOut" }}
          onAnimationComplete={() => setPulseDone(true)}
        />
      )}

      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg"
        style={{
          backgroundColor: "#C8A24E",
          boxShadow: isOpen
            ? "0 0 0 0 transparent"
            : "0 4px 20px rgba(200,162,78,0.35)",
        }}
        aria-label={isOpen ? "סגור צ׳אט" : "פתח יועץ WealthIQ"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-5 w-5" style={{ color: "#06080C" }} />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="h-5 w-5" style={{ color: "#06080C" }} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
