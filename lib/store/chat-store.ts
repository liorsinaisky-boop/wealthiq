import { create } from "zustand";
import type { ChatMessage, FinancialProfile, WealthIQResult, Insight } from "@/lib/types";

export interface ChatContext {
  profile: FinancialProfile;
  result: WealthIQResult;
  insights: Insight[];
}

interface ChatStore {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  suggestedQuestions: string[];
  context: ChatContext | null;
  hasAutoOpened: boolean;
  hasUnread: boolean;

  toggleChat: () => void;
  openChat: () => void;
  setContext: (ctx: ChatContext) => void;
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
  setSuggestions: (q: string[]) => void;
  addGreeting: (text: string, questions: string[]) => void;
  markRead: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isOpen: false,
  isLoading: false,
  suggestedQuestions: [],
  context: null,
  hasAutoOpened: false,
  hasUnread: false,

  toggleChat: () =>
    set((s) => {
      const opening = !s.isOpen;
      return { isOpen: opening, hasUnread: opening ? false : s.hasUnread };
    }),

  openChat: () =>
    set({ isOpen: true, hasAutoOpened: true, hasUnread: false }),

  setContext: (ctx) => set({ context: ctx }),

  setSuggestions: (q) => set({ suggestedQuestions: q }),

  addGreeting: (text: string, questions: string[]) => {
    const { messages } = get();
    if (messages.length > 0) return; // only add once
    const greetingMsg: ChatMessage = {
      role: "assistant",
      content: text,
      timestamp: Date.now(),
    };
    set({ messages: [greetingMsg], suggestedQuestions: questions, hasUnread: true });
  },

  markRead: () => set({ hasUnread: false }),

  clearChat: () => set({ messages: [], suggestedQuestions: [] }),

  sendMessage: async (message: string) => {
    const { messages, context } = get();

    if (!context) return;

    const userMsg: ChatMessage = {
      role: "user",
      content: message,
      timestamp: Date.now(),
    };
    const updatedMessages = [...messages, userMsg];
    set({ messages: updatedMessages, isLoading: true, suggestedQuestions: [], hasUnread: false });

    try {
      const history = updatedMessages.slice(-10);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, context, history }),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: data.reply || "לא הצלחתי לעבד את התשובה.",
        timestamp: Date.now(),
      };

      set((s) => ({
        messages: [...s.messages, assistantMsg],
        isLoading: false,
        suggestedQuestions: data.suggestedQuestions ?? [],
      }));
    } catch {
      const errMsg: ChatMessage = {
        role: "assistant",
        content: "אין חיבור כרגע. נסה/י שוב בעוד רגע.",
        timestamp: Date.now(),
      };
      set((s) => ({
        messages: [...s.messages, errMsg],
        isLoading: false,
      }));
    }
  },
}));
