import { NextRequest, NextResponse } from "next/server";
import type { ChatRequest, ChatResponse } from "@/lib/types";
import { SYSTEM_PROMPT_CHAT } from "@/lib/ai/system-prompts";

export async function POST(req: NextRequest): Promise<NextResponse<ChatResponse>> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      reply: "AI advisor is not configured.",
      suggestedQuestions: [],
    });
  }

  let body: ChatRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ reply: "Invalid request.", suggestedQuestions: [] }, { status: 400 });
  }

  const { context, history } = body;

  // Build concise context summary (avoid huge token payloads)
  const ctxSummary = {
    age: context.profile.profile.age,
    targetRetirementAge: context.profile.profile.targetRetirementAge,
    dependents: context.profile.profile.dependents,
    primaryGoal: context.profile.profile.primaryGoal,
    monthlyGrossSalary: context.profile.income.monthlyGrossSalary,
    pensionBalance: context.profile.pension.currentBalance,
    pensionFee: context.profile.pension.managementFeePercent,
    liquidSavings: context.profile.savings.liquidSavings,
    totalScore: context.result.totalScore,
    grade: context.result.grade,
    netWorth: context.result.netWorth.netWorth,
    categoryScores: context.result.categoryScores.map(cs => ({
      name: cs.categoryNameHe,
      score: Math.round(cs.score),
      grade: cs.grade,
    })),
    topInsights: context.insights.slice(0, 3).map(i => ({
      title: i.titleHe,
      impact: i.impact,
    })),
    insightsContext: {
      emergencyFundMonths: context.result.insightsContext.emergencyFundMonths,
      debtToIncomeRatio: context.result.insightsContext.debtToIncomeRatio,
      savingsRate: context.result.insightsContext.savingsRate,
      yearsToRetirement: context.result.insightsContext.yearsToRetirement,
      percentile: context.result.insightsContext.percentile,
    },
  };

  const systemText =
    SYSTEM_PROMPT_CHAT +
    "\n\nUSER'S FINANCIAL DATA:\n" +
    JSON.stringify(ctxSummary, null, 2) +
    '\n\nRespond ONLY with valid JSON matching: {"reply":"<your response>","suggestedQuestions":["<q1>","<q2>"]}';

  // Keep last 10 messages, ensure alternating roles for Gemini
  const recentHistory = history.slice(-10);
  const contents = recentHistory.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  // Gemini requires contents to end with a "user" role
  // (the last message in history should be the current user message)
  if (contents.length === 0 || contents[contents.length - 1].role !== "user") {
    return NextResponse.json({
      reply: "I'm having trouble connecting right now. Try again in a moment.",
      suggestedQuestions: [],
    });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemText }] },
          contents,
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1024,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    const data = await response.json();
    const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

    let parsed: ChatResponse;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { reply: text, suggestedQuestions: [] };
    }

    return NextResponse.json({
      reply: parsed.reply || "לא הצלחתי לעבד את התשובה. נסה/י שוב.",
      suggestedQuestions: parsed.suggestedQuestions ?? [],
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({
      reply: "I'm having trouble connecting right now. Try again in a moment.",
      suggestedQuestions: [],
    });
  }
}
