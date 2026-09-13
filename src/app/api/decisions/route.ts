import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

interface DecisionPayload {
  candidate_name: string;
  overall_score: number;
  recommendation: string;
  human_decision: "APPROVED" | "REJECTED" | "OVERRIDDEN";
  reviewer_notes?: string;
  criteria_summary?: string;
}

function escapeCsvField(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '""';
  const stringValue = String(value);
  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n") ||
    stringValue.includes("\r")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

/**
 * Resolves the writable data directory.
 * - On Vercel (serverless): /var/task is read-only. Only /tmp is writable.
 * - On localhost: use the local data/ directory for persistent storage.
 */
function getDataDir(): string {
  if (process.env.VERCEL) {
    return "/tmp";
  }
  return path.resolve(process.cwd(), "data");
}

export async function POST(request: NextRequest) {
  try {
    const body: DecisionPayload = await request.json();

    if (
      !body.candidate_name ||
      body.overall_score === undefined ||
      !body.recommendation ||
      !body.human_decision
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: candidate_name, overall_score, recommendation, human_decision",
        },
        { status: 400 }
      );
    }

    const dataDir = getDataDir();
    await fs.mkdir(dataDir, { recursive: true });

    const recordId = `DEC_${Date.now()}_${crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase()}`;
    const loggedAt = new Date().toISOString();
    const notes = body.reviewer_notes || "";

    // Tool 1: Append to CSV audit log
    const csvPath = path.join(dataDir, "screening_log.csv");
    const csvHeader =
      "Timestamp,CandidateName,Score,Recommendation,HumanDecision,ReviewerNotes\n";
    const csvRow = `${escapeCsvField(loggedAt)},${escapeCsvField(
      body.candidate_name
    )},${escapeCsvField(body.overall_score)},${escapeCsvField(
      body.recommendation
    )},${escapeCsvField(body.human_decision)},${escapeCsvField(notes)}\n`;

    try {
      await fs.access(csvPath);
      await fs.appendFile(csvPath, csvRow, "utf-8");
    } catch {
      await fs.writeFile(csvPath, csvHeader + csvRow, "utf-8");
    }

    // Tool 2: Append to structured JSON registry
    const jsonPath = path.join(dataDir, "decisions.json");
    let decisionsRegistry: Array<Record<string, unknown>> = [];

    try {
      const existingData = await fs.readFile(jsonPath, "utf-8");
      decisionsRegistry = JSON.parse(existingData);
      if (!Array.isArray(decisionsRegistry)) {
        decisionsRegistry = [];
      }
    } catch {
      decisionsRegistry = [];
    }

    const newRecord = {
      record_id: recordId,
      timestamp: loggedAt,
      candidate_name: body.candidate_name,
      overall_score: body.overall_score,
      recommendation: body.recommendation,
      human_decision: body.human_decision,
      reviewer_notes: notes,
      criteria_summary: body.criteria_summary || null,
    };

    decisionsRegistry.push(newRecord);
    await fs.writeFile(
      jsonPath,
      JSON.stringify(decisionsRegistry, null, 2),
      "utf-8"
    );

    return NextResponse.json({
      success: true,
      record_id: recordId,
      logged_at: loggedAt,
      // Tells the frontend which storage mode is active
      storage: process.env.VERCEL ? "vercel-tmp" : "local-data",
    });
  } catch (error) {
    console.error("Failed to record decision:", error);
    return NextResponse.json(
      { error: "Internal Server Error while persisting decision" },
      { status: 500 }
    );
  }
}
