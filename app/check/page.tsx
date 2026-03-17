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
  profile:     Section1Profile,
  income:      Section2Income,
  pension:     Section3Pension,
  real_estate: Section4RealEstate,
  investments: Section5Investments,
  savings:     Section6Savings,
  debt:        Section7Debt,
  insurance:   Section8Insurance,
  cash_flow:   Section9CashFlow,
};

// RTL: forward = enter from right (start), exit to left (end)
const slideVariants = {
  enter:  { x: 80, opacity: 0 },
  center: { x: 0,  opacity: 1 },
  exit:   { x: -80, opacity: 0 },
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

  const currentIdx  = QUESTIONNAIRE_STEPS.indexOf(currentStep);
  const totalSteps  = QUESTIONNAIRE_STEPS.length;
  const progress    = ((currentIdx + 1) / totalSteps) * 100;
  const isLastStep  = currentIdx === totalSteps - 1;
  const SectionComponent = sectionComponents[currentStep];
  const hasInternalNav   = currentStep === "profile" || currentStep === "income" || currentStep === "pension";

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
    <main className="min-h-screen px-4 py-8" style={{ backgroundColor: "#06080C" }}>
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-sora text-2xl font-bold">
            <span className="gold-text">WealthIQ</span>
            <span style={{ color: "#E8E4DC" }}> Check</span>
          </h1>
          <p className="text-sm" style={{ color: "#8A8680" }}>
            ענה/י על השאלות — הכל נשאר אצלך, לא שומרים כלום
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span style={{ color: "#8A8680" }}>
              {STEP_ICONS[currentStep]} {STEP_NAMES_HE[currentStep]}
            </span>
            <span className="font-jetbrains-mono text-xs" style={{ color: "#5A5650" }}>
              {currentIdx + 1} / {totalSteps}
            </span>
          </div>

          {/* Progress bar — 3px, gold fill, RTL */}
          <div
            className="h-[3px] w-full overflow-hidden rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
          >
            <motion.div
              className="progress-fill h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          {/* Step dots */}
          <div className="mt-3 flex justify-between">
            {QUESTIONNAIRE_STEPS.map((step, i) => (
              <button
                key={step}
                onClick={() => (completedSteps.includes(step) || i <= currentIdx) && setStep(step)}
                className="rounded-full transition-all duration-200"
                style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor:
                    step === currentStep
                      ? "#C8A24E"
                      : completedSteps.includes(step)
                      ? "rgba(200,162,78,0.45)"
                      : i < currentIdx
                      ? "rgba(200,162,78,0.25)"
                      : "rgba(255,255,255,0.08)",
                  transform: step === currentStep ? "scale(1.3)" : "scale(1)",
                  cursor: completedSteps.includes(step) || i <= currentIdx ? "pointer" : "default",
                  boxShadow: step === currentStep ? "0 0 8px rgba(200,162,78,0.5)" : "none",
                }}
                title={STEP_NAMES_HE[step]}
              />
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-6 rounded-xl border px-4 py-3 text-sm"
            style={{
              backgroundColor: "rgba(239,68,68,0.06)",
              borderColor: "rgba(239,68,68,0.25)",
              color: "#EF4444",
            }}
          >
            {error}
          </div>
        )}

        {/* Section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {SectionComponent && <SectionComponent />}
          </motion.div>
        </AnimatePresence>

        {/* Navigation — hidden for sections that manage their own nav */}
        {!hasInternalNav && (
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentIdx === 0}
              className="btn-outline flex items-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
              <span>חזרה</span>
            </button>
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="btn-gold flex items-center gap-1.5 disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block h-4 w-4 rounded-full border-2"
                    style={{ borderColor: "rgba(6,8,12,0.3)", borderTopColor: "#06080C" }}
                  />
                  מחשב...
                </span>
              ) : (
                <>
                  <span>{isLastStep ? "סיום וחישוב ציון ✨" : "הבא"}</span>
                  <ChevronLeft className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}

        <p className="mt-8 text-center text-xs" style={{ color: "#3D3A38" }}>
          מידע כללי בלבד. אינו מהווה ייעוץ פנסיוני או המלצה.
        </p>
      </div>
    </main>
  );
}
