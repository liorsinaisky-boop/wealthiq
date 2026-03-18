"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useChatStore } from "@/lib/store/chat-store";

export default function ChatButton() {
  const { isOpen, toggleChat, hasUnread } = useChatStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center">
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

        {/* Notification dot — shows when there's an unread greeting */}
        <AnimatePresence>
          {hasUnread && !isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "absolute",
                top: "2px",
                right: "2px",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#C8A24E",
                border: "2px solid #06080C",
                boxShadow: "0 0 6px rgba(200,162,78,0.6)",
              }}
            />
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
