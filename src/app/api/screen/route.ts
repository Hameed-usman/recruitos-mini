import { NextRequest, NextResponse } from "next/server";
import { evaluateCandidate } from "@/lib/evaluator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeText, criteria } = body;

    if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid 'resumeText'. Must provide a non-empty string." },
        { status: 400 }
      );
    }

    if (!criteria || !Array.isArray(criteria) || criteria.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid 'criteria'. Must provide an array with at least one criterion." },
        { status: 400 }
      );
    }

    // Filter out any blank criteria strings
    const cleanedCriteria = criteria.map((c) => String(c).trim()).filter((c) => c.length > 0);
    if (cleanedCriteria.length === 0) {
      return NextResponse.json(
        { error: "Criteria list cannot contain only empty strings." },
        { status: 400 }
      );
    }

    const result = await evaluateCandidate(resumeText, cleanedCriteria);

    return NextResponse.json({
      evaluation: result.evaluation,
      latencyMs: result.latencyMs,
      attempts: result.attempts,
    });
  } catch (error) {
    console.error("Screening error:", error);
    const message = error instanceof Error ? error.message : "Failed to screen candidate";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
