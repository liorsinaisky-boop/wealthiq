"use client";

import type { ReactNode } from "react";

// ── Currency Input (₪) ──────────────────────────────────────

export function CurrencyField({ label, value, onChange, placeholder, hint }: {
  label: string; value: number | undefined | ""; onChange: (v: number | undefined) => void;
  placeholder?: string; hint?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-300">{label}</label>
      <div className="relative">
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">₪</span>
        <input type="number" dir="ltr" min={0} step={1000}
          placeholder={placeholder ?? ""} value={value ?? ""}
          onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : undefined)}
          className="input-field pe-8 text-left" />
      </div>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
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
      <label className="mb-1 block text-sm font-medium text-gray-300">{label}</label>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input type="number" dir="ltr" min={0} max={100} step={0.01}
            placeholder={placeholder ?? ""} value={value === null ? "" : (value ?? "")}
            onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : null)}
            className="input-field text-left" disabled={value === null && showDontKnow} />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
        </div>
        {showDontKnow && (
          <button type="button" onClick={() => onChange(value === null ? 0 : null)}
            className={`whitespace-nowrap rounded-xl border px-3 py-2.5 text-xs font-medium transition-all ${
              value === null ? "border-gold-400 bg-gold-400/10 text-gold-400" : "border-dark-50 text-gray-400"
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
      <label className="mb-2 block text-sm font-medium text-gray-300">{label}</label>
      <div className="flex gap-3">
        {[true, false].map((v) => (
          <button key={String(v)} type="button" onClick={() => onChange(v)}
            className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
              value === v ? "border-gold-400 bg-gold-400/10 text-gold-400" : "border-dark-50 text-gray-400 hover:border-gray-600"
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
      <label className="mb-2 block text-sm font-medium text-gray-300">{label}</label>
      <div className={`grid gap-3 ${columns === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
        {options.map(([val, lbl]) => (
          <button key={val} type="button" onClick={() => onChange(val)}
            className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
              value === val ? "border-gold-400 bg-gold-400/10 text-gold-400" : "border-dark-50 text-gray-400 hover:border-gray-600"
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
    <div className="glass-card space-y-6 p-6 md:p-8">
      <div className="mb-2">
        <h2 className="text-xl font-bold">{title}</h2>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// ── Micro Insight ────────────────────────────────────────────

export function MicroInsight({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-gold-400/20 bg-gold-400/5 p-4">
      <p className="text-sm text-gold-300">💡 {children}</p>
    </div>
  );
}

// ── Expandable Sub-section ───────────────────────────────────

export function Expandable({ show, children }: { show: boolean; children: ReactNode }) {
  if (!show) return null;
  return <div className="mt-4 space-y-4 rounded-xl border border-dark-50 bg-dark-300/50 p-4">{children}</div>;
}

// ── Number Input ─────────────────────────────────────────────

export function NumberField({ label, value, onChange, suffix, hint }: {
  label: string; value: number | string; onChange: (v: number) => void;
  suffix?: string; hint?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-300">{label}</label>
      <div className="relative">
        <input type="number" dir="ltr" min={0} value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className={`input-field ${suffix ? "pe-8 text-left" : ""}`} />
        {suffix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{suffix}</span>}
      </div>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
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
      <label className="mb-1 block text-sm font-medium text-gray-300">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="input-field w-full bg-dark-300">
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
      <label className="mb-2 block text-sm font-medium text-gray-300">{label}</label>
      <div className={`grid gap-2 ${cols}`}>
        {options.map((opt) => (
          <button key={opt.value} type="button" onClick={() => onChange(opt.value)}
            className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
              value === opt.value
                ? "border-gold-400 bg-gold-400/10 text-gold-400"
                : "border-dark-50 text-gray-400 hover:border-gray-600"
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
        <label className="text-sm font-medium text-gray-300">{label}</label>
        <span className="font-bold text-gold-400">
          {formatValue ? formatValue(value) : value}
        </span>
      </div>
      <input type="range" dir="ltr" min={min} max={max} value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-gold-400" />
      {labels && (
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>{labels.start}</span>
          <span>{labels.end}</span>
        </div>
      )}
    </div>
  );
}

// ── Navigation Buttons ───────────────────────────────────────

export function NavButtons({ onNext, onBack }: { onNext: () => void; onBack?: () => void }) {
  return (
    <div className="mt-6 flex items-center justify-between">
      {onBack ? (
        <button type="button" onClick={onBack} className="btn-outline text-sm">חזרה</button>
      ) : <div />}
      <button type="button" onClick={onNext} className="btn-gold text-sm">הבא ←</button>
    </div>
  );
}
