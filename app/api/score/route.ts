import { NextRequest, NextResponse } from "next/server";
import type { ScoreRequest, ScoreResponse } from "@/lib/types";
import { calculateWealthIQ } from "@/lib/score-engine/composite";

export async function POST(request: NextRequest) {
  try {
    const body: ScoreRequest = await request.json();
    const result = calculateWealthIQ(body.profile);
    return NextResponse.json({ success: true, result } satisfies ScoreResponse);
  } catch (error) {
    console.error("Score calculation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to calculate score" } satisfies ScoreResponse,
      { status: 500 }
    );
  }
}
