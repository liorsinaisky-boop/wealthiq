"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { FinancialProfile, ProjectionResult, ScenarioModification } from "@/lib/types";
import ProjectionChart from "./ProjectionChart";
import ImpactSummary from "./ImpactSummary";

interface SliderState {
  extraContribution: number; // ₪0–5000/month
  retirementAge: number;     // 55–75
  feeReduction: number;      // 0–0.5 (%)
  salaryGrowth: number;      // 0–10 (%)
}

function SliderRow({
  label, value, min, max, step, format, onChange,
}: {
  label: string; value: number; min: number; max: number;
  step: number; format: (v: number) => string; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <span className="text-sm font-bold text-gold-400 tabular-nums">{format(value)}</span>
      </div>
      <input
        type="range" dir="ltr"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-gold-400"
      />
    </div>
  );
}

export default function SimulatorPanel({ profile }: { profile: FinancialProfile }) {
  const defaultRetAge = profile.profile.gender === "female" ? 65 : 67;

  const [sliders, setSliders] = useState<SliderState>({
    extraContribution: 0,
    retirementAge: profile.profile.targetRetirementAge ?? defaultRetAge,
    feeReduction: 0,
    salaryGrowth: 0,
  });

  const [result, setResult] = useState<ProjectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSimulation = useCallback(async (state: SliderState) => {
    setLoading(true);
    try {
      const scenarios: ScenarioModification[] = [];

      if (state.extraContribution > 0) {
        scenarios.push({
          type: "increase_pension_contribution",
          value: state.extraContribution,
          label: `הגדלת הפקדות ב-₪${state.extraContribution.toLocaleString()}`,
        });
      }
      if (state.retirementAge !== defaultRetAge) {
        scenarios.push({
          type: "change_retirement_age",
          value: state.retirementAge,
          label: `גיל פרישה ${state.retirementAge}`,
        });
      }
      if (state.feeReduction > 0) {
        scenarios.push({
          type: "reduce_fees",
          value: state.feeReduction,
          label: `הורדת דמי ניהול ${state.feeReduction}%`,
        });
      }
      if (state.salaryGrowth > 0) {
        scenarios.push({
          type: "salary_growth",
          value: state.salaryGrowth,
          label: `עליית שכר ${state.salaryGrowth}%`,
        });
      }

      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, scenarios, horizonYears: 30 }),
      });
      const data = await res.json();
      if (data.success && data.result) setResult(data.result);
    } catch {
      // silent — chart stays with previous data
    } finally {
      setLoading(false);
    }
  }, [profile, defaultRetAge]);

  // Load baseline on mount
  useEffect(() => {
    runSimulation(sliders);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (key: keyof SliderState, value: number) => {
    const next = { ...sliders, [key]: value };
    setSliders(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSimulation(next), 300);
  };

  return (
    <div className="space-y-4">
      {/* Sliders card */}
      <div className="glass-card p-6 space-y-5">
        <SliderRow
          label="הגדלת הפקדות חודשיות"
          value={sliders.extraContribution}
          min={0} max={5000} step={100}
          format={(v) => v === 0 ? "ללא שינוי" : `+₪${v.toLocaleString()}/חודש`}
          onChange={(v) => handleChange("extraContribution", v)}
        />
        <SliderRow
          label="גיל פרישה"
          value={sliders.retirementAge}
          min={55} max={75} step={1}
          format={(v) => `${v}`}
          onChange={(v) => handleChange("retirementAge", v)}
        />
        <SliderRow
          label="הורדת דמי ניהול"
          value={sliders.feeReduction}
          min={0} max={0.5} step={0.05}
          format={(v) => v === 0 ? "ללא שינוי" : `-${v.toFixed(2)}%`}
          onChange={(v) => handleChange("feeReduction", v)}
        />
        <SliderRow
          label="עליית שכר שנתית"
          value={sliders.salaryGrowth}
          min={0} max={10} step={0.5}
          format={(v) => v === 0 ? "ללא שינוי" : `+${v}%`}
          onChange={(v) => handleChange("salaryGrowth", v)}
        />
      </div>

      {/* Chart + impact summary */}
      {result && (
        <>
          <ProjectionChart
            baseline={result.baseline}
            modified={result.modified}
            loading={loading}
          />
          <ImpactSummary summary={result.summary} />
        </>
      )}

      {/* Loading state — no result yet */}
      {!result && loading && (
        <div className="glass-card p-8 flex items-center justify-center">
          <span className="text-sm text-gold-400 animate-pulse">מחשב תחזית...</span>
        </div>
      )}
    </div>
  );
}
