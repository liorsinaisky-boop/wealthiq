"use client";

import { motion } from "framer-motion";
import type { ProjectionResult } from "@/lib/types";
import { formatCurrencyCompact } from "@/lib/utils/format";

interface Props {
  summary: ProjectionResult["summary"];
}

export default function ImpactSummary({ summary }: Props) {
  const nwDelta = summary.netWorthAtRetirementModified - summary.netWorthAtRetirementBaseline;
  const incomeDelta = summary.monthlyPassiveIncomeModified - summary.monthlyPassiveIncomeBaseline;
  const ageDelta = summary.retirementAgeModified - summary.retirementAgeBaseline;

  return (
    <div className="grid grid-cols-3 gap-3">
      <ImpactCard
        label="שינוי בשווי בפרישה"
        value={nwDelta === 0 ? "ללא שינוי" : `${nwDelta > 0 ? "+" : ""}${formatCurrencyCompact(nwDelta)}`}
        sub={`${formatCurrencyCompact(summary.netWorthAtRetirementModified)} סה״כ`}
        positive={nwDelta >= 0}
        delay={0}
      />
      <ImpactCard
        label="הכנסה פסיבית חודשית"
        value={`₪${summary.monthlyPassiveIncomeModified.toLocaleString()}`}
        sub={
          incomeDelta !== 0
            ? `${incomeDelta > 0 ? "+" : ""}₪${incomeDelta.toLocaleString()} לעומת הנוכחי`
            : "ללא שינוי"
        }
        positive={incomeDelta >= 0}
        delay={0.05}
      />
      <ImpactCard
        label="גיל פרישה"
        value={`${summary.retirementAgeModified}`}
        sub={
          ageDelta !== 0
            ? `${ageDelta > 0 ? "+" : ""}${ageDelta} שנים`
            : "ללא שינוי"
        }
        positive={ageDelta <= 0}
        delay={0.1}
      />
    </div>
  );
}

function ImpactCard({
  label, value, sub, positive, delay,
}: {
  label: string; value: string; sub: string; positive: boolean; delay: number;
}) {
  return (
    <motion.div
      key={value}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="glass-card p-4 text-center bg-white border border-slate-100 shadow-sm"
    >
      <p className="text-xs font-medium text-slate-500 mb-1 leading-tight">{label}</p>
      <p className={`text-lg font-black tabular-nums ${positive ? "text-emerald-600" : "text-rose-600"}`}>
        {value}
      </p>
      <p className="text-xs font-medium text-slate-500 mt-1 leading-tight">{sub}</p>
    </motion.div>
  );
}
