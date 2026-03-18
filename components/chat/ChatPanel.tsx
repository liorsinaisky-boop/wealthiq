"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X } from "lucide-react";
import { useChatStore } from "@/lib/store/chat-store";
import SuggestedQuestions from "./SuggestedQuestions";
import type { ChatMessage } from "@/lib/types";

// ── Thinking indicator ────────────────────────────────────────
function ThinkingIndicator() {
  return (
    <div className="flex justify-start">
      <motion.div
        className="rounded-2xl px-4 py-2.5 text-sm"
        style={{
          backgroundColor: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.06)",
          color: "#5A5650",
          borderRadius: "16px 16px 16px 4px",
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        חושב/ת...
      </motion.div>
    </div>
  );
}

// ── Single message bubble ─────────────────────────────────────
function MessageBubble({ msg, isFirst }: { msg: ChatMessage; isFirst: boolean }) {
  const isUser = msg.role === "user";
  const isGreeting = !isUser && isFirst;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className="max-w-[85%] leading-relaxed"
        style={{
          fontSize: isGreeting ? "16px" : "14px",
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
          // Prominent gold right-border for the greeting (visual start in RTL)
          borderRight: isGreeting ? "4px solid #C8A24E" : undefined,
          padding: isGreeting ? "14px 18px 14px 16px" : "10px 16px",
          whiteSpace: "pre-wrap",
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed flex flex-col overflow-hidden"
          style={{
            bottom: "88px",
            right: "24px",
            width: "420px",
            height: "560px",
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
                יועץ פיננסי AI אישי
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
                <p>מכין את הניתוח שלך...</p>
              </motion.div>
            )}
            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} isFirst={i === 0} />
            ))}
            {isLoading && <ThinkingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions */}
          <AnimatePresence>
            {suggestedQuestions.length > 0 && !isLoading && (
              <SuggestedQuestions
                questions={suggestedQuestions}
                onSelect={(q) => sendMessage(q)}
                disabled={isLoading}
              />
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
              placeholder="כתוב/י תשובה..."
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

          {/* Powered by AI label */}
          <div
            className="flex-shrink-0 pb-2 text-center"
            style={{ fontSize: "10px", color: "#3D3A38" }}
          >
            Powered by AI · מידע כללי בלבד, אינו ייעוץ פיננסי
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
