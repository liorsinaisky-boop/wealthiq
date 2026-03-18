"use client";

import { useQuestionnaireStore } from "@/lib/store/questionnaire-store";
import { SectionWrapper, CurrencyField, YesNo, CardSelect, PercentField, Expandable } from "./FieldComponents";

export default function Section5Investments() {
  const { investments, updateSection } = useQuestionnaireStore();
  const update = (data: Partial<typeof investments>) => updateSection("investments", data);

  return (
    <SectionWrapper title="השקעות" subtitle="תיק השקעות, קריפטו והשקעות אחרות">
      <YesNo label="יש לך תיק השקעות (חשבון מסחר)?" value={investments.hasBrokerage ?? false}
        onChange={(v) => update({ hasBrokerage: v })} />

      <Expandable show={investments.hasBrokerage ?? false}>
        <CardSelect label="פלטפורמה" value={investments.brokerageAccount?.platform ?? "other"}
          onChange={(v) => update({ brokerageAccount: { ...investments.brokerageAccount!, platform: v as any } })}
          options={[["ibi", "IBI"], ["meitav_dash", "מיטב דש"], ["interactive_brokers", "Interactive Brokers"], ["other", "אחר"]]} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CurrencyField label="שווי כולל של התיק" value={investments.brokerageAccount?.totalValue}
            onChange={(v) => update({ brokerageAccount: { ...investments.brokerageAccount!, totalValue: v ?? 0, platform: investments.brokerageAccount?.platform ?? "other", allocation: investments.brokerageAccount?.allocation ?? { israeliStocks: 0.2, internationalStocks: 0.5, bonds: 0.1, etfsIndexFunds: 0.15, other: 0.05 }, annualFeePercent: investments.brokerageAccount?.annualFeePercent ?? 0.5 } })} />

          <CurrencyField label="הפקדה חודשית (DCA)" value={investments.brokerageAccount?.monthlyContribution}
            onChange={(v) => update({ brokerageAccount: { ...investments.brokerageAccount!, monthlyContribution: v ?? 0 } })}
            placeholder="0" />
        </div>

        <PercentField label="דמי ניהול שנתיים" value={investments.brokerageAccount?.annualFeePercent ?? null}
          onChange={(v) => update({ brokerageAccount: { ...investments.brokerageAccount!, annualFeePercent: v ?? 0.5 } })}
          placeholder="0.3" showDontKnow />
      </Expandable>

      <YesNo label="יש לך השקעות בקריפטו?" value={investments.hasCrypto ?? false}
        onChange={(v) => update({ hasCrypto: v })} />

      <Expandable show={investments.hasCrypto ?? false}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CurrencyField label="שווי כולל קריפטו" value={investments.crypto?.totalValue}
            onChange={(v) => update({ crypto: { ...investments.crypto, totalValue: v ?? 0, holdings: investments.crypto?.holdings ?? ["btc"] } })} />

          <CurrencyField label="הפקדה חודשית (DCA)" value={investments.crypto?.monthlyContribution}
            onChange={(v) => update({ crypto: { ...investments.crypto, totalValue: investments.crypto?.totalValue ?? 0, holdings: investments.crypto?.holdings ?? ["btc"], monthlyContribution: v ?? 0 } })}
            placeholder="0" />
        </div>
      </Expandable>
    </SectionWrapper>
  );
}
