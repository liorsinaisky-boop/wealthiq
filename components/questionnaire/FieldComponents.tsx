"use client";

import { useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Currency Input (₪) ──────────────────────────────────────

function formatCommas(n: number): string {
  return n.toLocaleString("he-IL");
}

export function CurrencyField({ label, value, onChange, placeholder, hint }: {
  label: string; value: number | undefined | ""; onChange: (v: number | undefined) => void;
  placeholder?: string; hint?: string;
}) {
  const [display, setDisplay] = useState<string>(
    value != null && value !== "" ? formatCommas(Number(value)) : ""
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, "").replace(/[^\d]/g, "");
    if (raw === "") {
      setDisplay("");
      onChange(undefined);
    } else {
      const num = parseInt(raw, 10);
      setDisplay(formatCommas(num));
      onChange(num);
    }
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-800">{label}</label>
      <div className="relative">
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">₪</span>
        <input
          type="text"
          inputMode="numeric"
          dir="ltr"
          placeholder={placeholder ?? ""}
          value={display}
          onChange={handleChange}
          className="input-field pr-8 text-left"
        />
      </div>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

// ── Percentage Input ─────────────────────────────────────────

export function PercentField({ label, value, onChange, placeholder, showDontKnow }: {
  label: string; value: number | null | ""; onChange: (v: number | null) => void;
  placeholder?: string; showDontKnow?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-800">{label}</label>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input type="number" dir="ltr" min={0} max={100} step={0.01}
            placeholder={placeholder ?? ""} value={value === null ? "" : (value ?? "")}
            onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : null)}
            className="input-field pr-8 text-left" disabled={value === null && showDontKnow} />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">%</span>
        </div>
        {showDontKnow && (
          <button type="button" onClick={() => onChange(value === null ? 0 : null)}
            className={`whitespace-nowrap rounded-xl border px-3 py-2.5 text-xs font-medium transition-all ${
              value === null ? "border-tangerine-500 bg-tangerine-50 text-tangerine-600" : "border-slate-200 text-slate-500 bg-white shadow-sm"
            }`}>לא יודע/ת</button>
        )}
      </div>
    </div>
  );
}

// ── Yes/No Toggle ────────────────────────────────────────────

export function YesNo({ label, value, onChange }: {
  label: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-800">{label}</label>
      <div className="flex gap-3">
        {[true, false].map((v) => (
          <button key={String(v)} type="button" onClick={() => onChange(v)}
            className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium shadow-sm transition-all ${
              value === v ? "border-tangerine-500 bg-tangerine-50 text-tangerine-600" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}>{v ? "כן" : "לא"}</button>
        ))}
      </div>
    </div>
  );
}

// ── Card Select ──────────────────────────────────────────────

export function CardSelect({ label, options, value, onChange, columns = 2 }: {
  label: string; options: [string, string][]; value: string; onChange: (v: string) => void; columns?: 2 | 3;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-800">{label}</label>
      <div className={`grid gap-3 ${columns === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
        {options.map(([val, lbl]) => (
          <button key={val} type="button" onClick={() => onChange(val)}
            className={`rounded-xl border px-3 py-2.5 text-sm font-medium shadow-sm transition-all ${
              value === val ? "border-tangerine-500 bg-tangerine-50 text-tangerine-600" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}>{lbl}</button>
        ))}
      </div>
    </div>
  );
}

// ── Section Wrapper ──────────────────────────────────────────

export function SectionWrapper({ title, subtitle, children }: {
  title: string; subtitle?: string; children: ReactNode;
}) {
  return (
    <div className="glass-card space-y-6 p-6 md:p-8 bg-white border border-slate-100 shadow-sm">
      <div className="mb-2">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// ── Micro Insight ────────────────────────────────────────────

export function MicroInsight({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-tangerine-200 bg-tangerine-50 p-4">
      <p className="text-sm text-tangerine-800">💡 {children}</p>
    </div>
  );
}

// ── Expandable Sub-section (animated) ────────────────────────

export function Expandable({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="mt-4 space-y-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Number Input ─────────────────────────────────────────────

export function NumberField({ label, value, onChange, suffix, hint }: {
  label: string; value: number | string; onChange: (v: number) => void;
  suffix?: string; hint?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-800">{label}</label>
      <div className="relative">
        <input type="number" dir="ltr" min={0} value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className={`input-field bg-white ${suffix ? "pr-8 text-left" : ""}`} />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{suffix}</span>}
      </div>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

// ── Select (Dropdown) ────────────────────────────────────────

export function SelectField({ label, options, value, onChange }: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-800">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="input-field w-full bg-white text-slate-800">
        <option value="" disabled>בחר...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

// ── Toggle Group ─────────────────────────────────────────────

export function ToggleGroup({ label, value, onChange, options }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; icon?: string }[];
}) {
  const cols = options.length <= 2 ? "grid-cols-2" : options.length === 3 ? "grid-cols-3" : "grid-cols-2";
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-800">{label}</label>
      <div className={`grid gap-2 ${cols}`}>
        {options.map((opt) => (
          <button key={opt.value} type="button" onClick={() => onChange(opt.value)}
            className={`rounded-xl border px-3 py-2.5 text-sm font-medium shadow-sm transition-all ${
              value === opt.value
                ? "border-tangerine-500 bg-tangerine-50 text-tangerine-600"
                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}>
            {opt.icon && <span className="me-1">{opt.icon}</span>}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Slider Field ─────────────────────────────────────────────

export function SliderField({ label, min, max, value, onChange, formatValue, labels }: {
  label: string; min: number; max: number; value: number;
  onChange: (v: number) => void;
  formatValue?: (v: number) => string;
  labels?: { start: string; end: string };
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-slate-800">{label}</label>
        <span className="font-bold text-tangerine-600">
          {formatValue ? formatValue(value) : value}
        </span>
      </div>
      <input type="range" dir="ltr" min={min} max={max} value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-tangerine-500" />
      {labels && (
        <div className="mt-1 flex justify-between text-xs text-slate-500">
          <span>{labels.start}</span>
          <span>{labels.end}</span>
        </div>
      )}
    </div>
  );
}

// ── Navigation Buttons (RTL-aware) ───────────────────────────

export function NavButtons({ onNext, onBack, nextLabel }: {
  onNext: () => void; onBack?: () => void; nextLabel?: string;
}) {
  return (
    <div className="mt-6 flex items-center justify-between">
      {onBack ? (
        <button type="button" onClick={onBack}
          className="btn-outline flex items-center gap-1 text-sm">
          <ChevronRight className="h-4 w-4" /><span>חזרה</span>
        </button>
      ) : <div />}
      <button type="button" onClick={onNext}
        className="btn-tangerine flex items-center gap-1 text-sm">
        <span>{nextLabel ?? "הבא"}</span><ChevronLeft className="h-4 w-4" />
      </button>
    </div>
  );
}

// ── Inline Error ─────────────────────────────────────────────

export function FieldError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400 animate-shake">
      {message}
    </p>
  );
}
