"use client";

import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useQuestionnaireStore } from "@/lib/store/questionnaire-store";
import { QUESTIONNAIRE_STEPS, STEP_NAMES_HE, STEP_ICONS } from "@/lib/types";
import type { FinancialProfile } from "@/lib/types";
import Section1Profile from "@/components/questionnaire/Section1Profile";
import Section2Income from "@/components/questionnaire/Section2Income";
import Section3Pension from "@/components/questionnaire/Section3Pension";
import Section4RealEstate from "@/components/questionnaire/Section4RealEstate";
import Section5Investments from "@/components/questionnaire/Section5Investments";
import Section6Savings from "@/components/questionnaire/Section6Savings";
import Section7Debt from "@/components/questionnaire/Section7Debt";
import Section8Insurance from "@/components/questionnaire/Section8Insurance";
import Section9CashFlow from "@/components/questionnaire/Section9CashFlow";
import { ChevronRight, ChevronLeft } from "lucide-react";

const sectionComponents: Record<string, React.FC> = {
  profile: Section1Profile,
  income: Section2Income,
  pension: Section3Pension,
  real_estate: Section4RealEstate,
  investments: Section5Investments,
  savings: Section6Savings,
  debt: Section7Debt,
  insurance: Section8Insurance,
  cash_flow: Section9CashFlow,
};

// RTL: forward = enter from right (start), exit to left (end)
const slideVariants = {
  enter: { x: 80, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -80, opacity: 0 },
};

function buildFullProfile(data: Partial<FinancialProfile>): FinancialProfile {
  const now = new Date().toISOString();
  return {
    profile: data.profile ?? {
      age: 35, gender: "prefer_not_to_say", maritalStatus: "single",
      dependents: 0, city: "", riskTolerance: "balanced",
      primaryGoal: "comfortable_retirement", targetRetirementAge: 67,
    },
    income: data.income ?? {
      employmentStatus: "employee", monthlyGrossSalary: 0,
      additionalIncome: [], yearsAtCurrentJob: 0, industry: "",
    },
    pension: data.pension ?? {
      productType: "keren_pensia", investmentTrack: "general",
      currentBalance: 0, managementFeePercent: null, depositFeePercent: null,
      kerenHishtalmut: { hasOne: false },
      hasOldAccounts: "not_sure", makesVoluntaryContributions: false,
    },
    realEstate: data.realEstate ?? {
      ownsProperty: false, properties: [], planningToBuy: false,
    },
    investments: data.investments ?? {
      hasBrokerage: false, hasCrypto: false,
      hasOtherInvestments: false, otherInvestments: [],
    },
    savings: data.savings ?? {
      liquidSavings: 0, hasEmergencyFund: "no",
      hasFixedDeposits: false, hasSavingsPlans: false, hasChildSavings: false,
    },
    debt: data.debt ?? {
      hasLoans: false, loans: [], creditCardDebt: 0, totalMonthlyObligations: 0,
    },
    insurance: data.insurance ?? {
      hasLifeInsurance: "no", hasDisabilityInsurance: "no",
      hasPrivateHealthInsurance: false, hasPropertyInsurance: false, hasWill: false,
    },
    cashFlow: data.cashFlow ?? {
      monthlyExpenses: 0, monthlySavingsAmount: 0, budgetDiscipline: "loose",
    },
    completedAt: now,
  };
}

export default function CheckPage() {
  const router = useRouter();
  const {
    currentStep, completedSteps, data, nextStep, prevStep, setStep,
    markComplete, setSubmitting, setError, isSubmitting, error,
  } = useQuestionnaireStore();

  const currentIdx = QUESTIONNAIRE_STEPS.indexOf(currentStep);
  const totalSteps = QUESTIONNAIRE_STEPS.length;
  const progress = ((currentIdx + 1) / totalSteps) * 100;
  const isLastStep = currentIdx === totalSteps - 1;
  const SectionComponent = sectionComponents[currentStep];
  // Sections 1-3 manage their own Next/Back buttons internally
  const hasInternalNav = currentStep === "profile" || currentStep === "income" || currentStep === "pension";

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    setError(null);
    try {
      const profile = buildFullProfile(data);
      if (!profile.income.monthlyGrossSalary && !profile.pension.currentBalance) {
        setError("אנא מלא/י לפחות: גיל, משכורת, ויתרת פנסיה");
        setSubmitting(false);
        return;
      }
      sessionStorage.setItem("wealthiq-profile", JSON.stringify(profile));
      router.push("/results");
    } catch {
      setError("לא הצלחנו לשמור את הנתונים. נסה/י שוב.");
      setSubmitting(false);
    }
  }, [data, router, setSubmitting, setError]);

  const handleNext = useCallback(() => {
    markComplete(currentStep);
    if (isLastStep) {
      handleSubmit();
    } else {
      nextStep();
    }
  }, [currentStep, isLastStep, markComplete, nextStep, handleSubmit]);

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold">
            <span className="text-gold-gradient">WealthIQ</span> Check
          </h1>
          <p className="text-sm text-gray-400">ענה/י על השאלות — הכל נשאר אצלך, לא שומרים כלום</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-gray-400">{STEP_ICONS[currentStep]} {STEP_NAMES_HE[currentStep]}</span>
            <span className="text-gray-500">{currentIdx + 1} / {totalSteps}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-dark-200">
            <motion.div className="progress-fill h-full rounded-full"
              initial={{ width: 0 }} animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }} />
          </div>
          <div className="mt-3 flex justify-between">
            {QUESTIONNAIRE_STEPS.map((step, i) => (
              <button key={step}
                onClick={() => (completedSteps.includes(step) || i <= currentIdx) && setStep(step)}
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  step === currentStep ? "bg-gold-400 scale-125"
                    : completedSteps.includes(step) ? "bg-gold-400/50 cursor-pointer hover:bg-gold-400"
                    : i < currentIdx ? "bg-gold-400/30 cursor-pointer" : "bg-dark-50"
                }`} title={STEP_NAMES_HE[step]} />
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Section */}
        <AnimatePresence mode="wait">
          <motion.div key={currentStep} variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}>
            {SectionComponent && <SectionComponent />}
          </motion.div>
        </AnimatePresence>

        {/* Navigation — hidden for sections that have internal nav buttons */}
        {!hasInternalNav && (
          <div className="mt-8 flex items-center justify-between">
            <button onClick={prevStep} disabled={currentIdx === 0}
              className="btn-outline flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronRight className="h-4 w-4" /><span>חזרה</span>
            </button>
            <button onClick={handleNext} disabled={isSubmitting}
              className="btn-gold flex items-center gap-1 disabled:opacity-60">
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <motion.span animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block h-4 w-4 rounded-full border-2 border-dark-500/30 border-t-dark-500" />
                  מחשב...
                </span>
              ) : (
                <><span>{isLastStep ? "סיום וחישוב ציון ✨" : "הבא"}</span><ChevronLeft className="h-4 w-4" /></>
              )}
            </button>
          </div>
        )}

        <p className="mt-8 text-center text-xs text-gray-600">
          מידע כללי בלבד. אינו מהווה ייעוץ פנסיוני או המלצה.
        </p>
      </div>
    </main>
  );
}
