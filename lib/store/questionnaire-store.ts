import { create } from "zustand";
import type {
  FinancialProfile, QuestionnaireStep,
  ProfileSection, IncomeSection, PensionSection, RealEstateSection,
  InvestmentsSection, SavingsSection, DebtSection, InsuranceSection, CashFlowSection,
} from "@/lib/types";
import { QUESTIONNAIRE_STEPS } from "@/lib/types";

interface QuestionnaireStore {
  currentStep: QuestionnaireStep;
  completedSteps: QuestionnaireStep[];
  data: Partial<FinancialProfile>;
  isSubmitting: boolean;
  error: string | null;

  // Section shortcuts — mirrors data.* with empty-object defaults so sections can destructure safely
  profile: Partial<ProfileSection>;
  income: Partial<IncomeSection>;
  pension: Partial<PensionSection>;
  realEstate: Partial<RealEstateSection>;
  investments: Partial<InvestmentsSection>;
  savings: Partial<SavingsSection>;
  debt: Partial<DebtSection>;
  insurance: Partial<InsuranceSection>;
  cashFlow: Partial<CashFlowSection>;

  setStep: (step: QuestionnaireStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  // Accepts partial section data and merges with existing
  updateSection: <K extends keyof FinancialProfile>(
    section: K,
    data: Partial<FinancialProfile[K]>
  ) => void;
  markComplete: (step: QuestionnaireStep) => void;
  setSubmitting: (v: boolean) => void;
  setError: (e: string | null) => void;
  reset: () => void;
}

export const useQuestionnaireStore = create<QuestionnaireStore>((set, get) => ({
  currentStep: "profile",
  completedSteps: [],
  data: {},
  isSubmitting: false,
  error: null,

  // Section shortcuts (start empty; populated by updateSection)
  profile: {},
  income: {},
  pension: {},
  realEstate: {},
  investments: {},
  savings: {},
  debt: {},
  insurance: {},
  cashFlow: {},

  setStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep } = get();
    const idx = QUESTIONNAIRE_STEPS.indexOf(currentStep);
    if (idx < QUESTIONNAIRE_STEPS.length - 1) {
      set({ currentStep: QUESTIONNAIRE_STEPS[idx + 1] });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    const idx = QUESTIONNAIRE_STEPS.indexOf(currentStep);
    if (idx > 0) {
      set({ currentStep: QUESTIONNAIRE_STEPS[idx - 1] });
    }
  },

  updateSection: (section, sectionData) =>
    set((state) => {
      const existing = (state.data[section] ?? {}) as Record<string, unknown>;
      const merged = { ...existing, ...(sectionData as Record<string, unknown>) };
      return {
        data: { ...state.data, [section]: merged },
        [section]: merged,
      };
    }),

  markComplete: (step) =>
    set((state) => ({
      completedSteps: state.completedSteps.includes(step)
        ? state.completedSteps
        : [...state.completedSteps, step],
    })),

  setSubmitting: (v) => set({ isSubmitting: v }),
  setError: (e) => set({ error: e }),

  reset: () =>
    set({
      currentStep: "profile",
      completedSteps: [],
      data: {},
      isSubmitting: false,
      error: null,
      profile: {},
      income: {},
      pension: {},
      realEstate: {},
      investments: {},
      savings: {},
      debt: {},
      insurance: {},
      cashFlow: {},
    }),
}));
