import "dotenv/config";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { evaluateCandidate } from "../src/lib/evaluator";

// Load .env.local if present
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
}

async function main() {
  console.log("==================================================");
  console.log("   RecruitOS Mini - Verification Engine (v0)      ");
  console.log("==================================================\n");

  const sampleResume = `Alex Rivers
Email: alex.rivers@example.com | Phone: +1 (555) 234-5678
Location: San Francisco, CA

SUMMARY:
Results-driven Senior Full Stack Software Engineer with 6 years of experience building modern web applications and cloud architectures.

EXPERIENCE:
Staff Software Engineer | Acme FinTech (2020 - Present)
- Architected and built the next-generation billing engine using Node.js, TypeScript, and React.
- Deployed microservices to AWS ECS with Docker, handling $4M+ monthly transaction volume.
- Mentored junior engineers and led agile sprint planning for a team of 8.

Full Stack Developer | CloudScale Inc. (2018 - 2020)
- Developed enterprise client portals with React and TypeScript.
- Implemented RESTful and GraphQL APIs using Node.js and PostgreSQL.

SKILLS:
Languages & Frameworks: React, TypeScript, Node.js, JavaScript, Python
Cloud & DevOps: AWS (ECS, S3, RDS), Docker, CI/CD GitHub Actions`;

  const roleCriteria = [
    "4+ years React/TypeScript",
    "Production backend with Node.js",
    "Cloud deployment (AWS/GCP)",
  ];

  console.log("Role Criteria:");
  roleCriteria.forEach((c, idx) => console.log(`  ${idx + 1}. ${c}`));
  console.log("\nEvaluating candidate sample resume...\n");

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    console.warn("⚠️  NOTE: No GOOGLE_GENERATIVE_AI_API_KEY detected in .env.local or environment.");
    console.warn("   Testing input pre-validation defenses (Binary & Length checks)...");

    // Test binary injection pre-validation test case
    const binaryTest = await evaluateCandidate(
      "%PDF-1.7 \x00\x01\x02\x03\xff\xfe unreadable binary garbage stream",
      roleCriteria
    );
    console.log("\n[Defense Check 1: Binary Payload Sanitization]");
    console.log(JSON.stringify(binaryTest, null, 2));

    // Test short input pre-validation test case
    const shortTest = await evaluateCandidate("Too short", roleCriteria);
    console.log("\n[Defense Check 2: Minimum Length Sanitization]");
    console.log(JSON.stringify(shortTest, null, 2));

    console.log("\n--------------------------------------------------");
    console.log("💡 To run live evaluation with Gemini 1.5 Flash:");
    console.log("   1. Create .env.local with:");
    console.log("      GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy...");
    console.log("   2. Run: npm run verify");
    console.log("--------------------------------------------------");
    return;
  }

  try {
    const result = await evaluateCandidate(sampleResume, roleCriteria);

    console.log("==================================================");
    console.log("         EVALUATION RESULT (VALIDATED)            ");
    console.log("==================================================");
    console.log(JSON.stringify(result.evaluation, null, 2));
    console.log("==================================================");
    console.log(`⏱️  Latency:      ${result.latencyMs} ms`);
    console.log(`🔄  Attempts:     ${result.attempts}`);
    console.log(`🎯  Recommendation: ${result.evaluation.recommendation}`);
    console.log(`⭐  Overall Score:  ${result.evaluation.overall_score}/100`);
    console.log(`🚩  Flags:          ${result.evaluation.flags.length > 0 ? result.evaluation.flags.join(", ") : "None"}`);
    console.log(`👤  Human Review:   ${result.evaluation.human_review_required ? "YES" : "NO"}`);
    console.log("==================================================");
  } catch (error) {
    console.error("❌ Evaluation failed:", error);
    process.exit(1);
  }
}

main();
