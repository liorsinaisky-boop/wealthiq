"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X } from "lucide-react";
import { useChatStore } from "@/lib/store/chat-store";
import type { ChatMessage } from "@/lib/types";

// ── Loading dots ──────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: "#8A8680" }}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </div>
  );
}

// ── Single message bubble ─────────────────────────────────────
function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
        style={{
          backgroundColor: isUser
            ? "rgba(200,162,78,0.12)"
            : "rgba(255,255,255,0.05)",
          color: "#E8E4DC",
          borderRadius: isUser
            ? "16px 16px 4px 16px"
            : "16px 16px 16px 4px",
          border: isUser
            ? "1px solid rgba(200,162,78,0.2)"
            : "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {msg.content}
      </div>
    </motion.div>
  );
}

// ── Main ChatPanel ────────────────────────────────────────────
export default function ChatPanel() {
  const {
    isOpen,
    toggleChat,
    messages,
    isLoading,
    suggestedQuestions,
    sendMessage,
  } = useChatStore();

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = () => {
    const msg = inputValue.trim();
    if (!msg || isLoading) return;
    setInputValue("");
    sendMessage(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (q: string) => {
    if (isLoading) return;
    sendMessage(q);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed z-49 flex flex-col overflow-hidden"
          style={{
            bottom: "88px",
            right: "24px",
            width: "380px",
            height: "500px",
            backgroundColor: "#0E1015",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
            zIndex: 49,
          }}
        >
          {/* Header */}
          <div
            className="flex flex-shrink-0 items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div>
              <h3
                className="font-sora font-semibold"
                style={{ fontSize: "15px", color: "#E8E4DC" }}
              >
                WealthIQ Advisor
              </h3>
              <p className="text-xs" style={{ color: "#8A8680" }}>
                שאל/י על הבריאות הפיננסית שלך
              </p>
            </div>
            <button
              onClick={toggleChat}
              className="rounded-lg p-1.5 transition-colors hover:bg-white/5"
              aria-label="סגור"
            >
              <X className="h-4 w-4" style={{ color: "#8A8680" }} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 text-center text-sm"
                style={{ color: "#5A5650" }}
              >
                <div className="mb-3 text-3xl">💬</div>
                <p>שאל/י כל שאלה על הציון והמצב הפיננסי שלך</p>
              </motion.div>
            )}
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} />
            ))}
            {isLoading && (
              <div
                className="w-fit rounded-2xl"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <TypingDots />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions */}
          <AnimatePresence>
            {suggestedQuestions.length > 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex-shrink-0 overflow-x-auto px-4 pb-2"
                style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
              >
                <div className="flex gap-2 py-2">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestion(q)}
                      className="flex-shrink-0 rounded-full border px-3 py-1.5 text-xs transition-all"
                      style={{
                        borderColor: "rgba(200,162,78,0.25)",
                        color: "#8A8680",
                        backgroundColor: "transparent",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLButtonElement).style.borderColor = "#C8A24E";
                        (e.target as HTMLButtonElement).style.color = "#C8A24E";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLButtonElement).style.borderColor = "rgba(200,162,78,0.25)";
                        (e.target as HTMLButtonElement).style.color = "#8A8680";
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input row */}
          <div
            className="flex flex-shrink-0 items-center gap-2 px-4 py-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.slice(0, 500))}
              onKeyDown={handleKeyDown}
              placeholder="שאל/י על הציון שלך..."
              className="flex-1 rounded-xl border px-4 py-2.5 text-sm outline-none transition-all"
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                borderColor: "rgba(255,255,255,0.08)",
                color: "#E8E4DC",
                fontFamily: "DM Sans, sans-serif",
              }}
              disabled={isLoading}
              dir="rtl"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-all disabled:opacity-40"
              style={{ backgroundColor: "#C8A24E" }}
              aria-label="שלח"
            >
              <Send className="h-4 w-4" style={{ color: "#06080C" }} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
