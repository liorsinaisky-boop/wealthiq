import { NextRequest, NextResponse } from "next/server";
import type { InsightsRequest, InsightsResponse } from "@/lib/types";
import { generateInsights } from "@/lib/ai/insight-generator";

export async function POST(request: NextRequest) {
  try {
    const body: InsightsRequest = await request.json();
    const insights = await generateInsights(body.context);
    return NextResponse.json({ success: true, insights } satisfies InsightsResponse);
  } catch (error) {
    console.error("Insights generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate insights" } satisfies InsightsResponse,
      { status: 500 }
    );
  }
}
