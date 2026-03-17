import { create } from "zustand";
import type { ChatMessage, FinancialProfile, WealthIQResult, Insight } from "@/lib/types";

const INITIAL_SUGGESTIONS = [
  "מה הכי מושך את הציון שלי למטה?",
  "איך הציון שלי משתווה לאחרים בגילי?",
  "מה הדבר הכי משפיע שאני יכול/ה לעשות?",
];

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

  toggleChat: () => void;
  setContext: (ctx: ChatContext) => void;
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
  setSuggestions: (q: string[]) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isOpen: false,
  isLoading: false,
  suggestedQuestions: INITIAL_SUGGESTIONS,
  context: null,

  toggleChat: () => set((s) => ({ isOpen: !s.isOpen })),

  setContext: (ctx) =>
    set({ context: ctx, suggestedQuestions: INITIAL_SUGGESTIONS }),

  setSuggestions: (q) => set({ suggestedQuestions: q }),

  clearChat: () =>
    set({ messages: [], suggestedQuestions: INITIAL_SUGGESTIONS }),

  sendMessage: async (message: string) => {
    const { messages, context } = get();

    if (!context) return;

    // Add user message immediately
    const userMsg: ChatMessage = {
      role: "user",
      content: message,
      timestamp: Date.now(),
    };
    const updatedMessages = [...messages, userMsg];
    set({ messages: updatedMessages, isLoading: true, suggestedQuestions: [] });

    try {
      // Send last 10 messages (including the one just added) as history
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
        content: "I'm having trouble connecting right now. Try again in a moment.",
        timestamp: Date.now(),
      };
      set((s) => ({
        messages: [...s.messages, errMsg],
        isLoading: false,
      }));
    }
  },
}));
