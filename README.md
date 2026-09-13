# RecruitOS Mini 🚀
> Principal AI-Powered Candidate Evaluation Engine & Evidence-Based Audit Gate

RecruitOS Mini is an evidence-grounded candidate resume screening engine built with **Next.js 14+ App Router**, **TypeScript**, **Tailwind CSS**, and **Google Gemini Flash** via `@ai-sdk/google`. It operates on **100% free-tier resources** and replaces subjective resume skimming with deterministic, verbatim-verified candidate audits.

---

## ⚡ 3-Step Setup Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local` in the project root:
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_studio_api_key_here
```
*(Get your free key at [Google AI Studio](https://aistudio.google.com/app/apikey))*

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running the 10-Scenario Evaluation Suite

To run the complete automated evaluation suite against all 10 edge, happy-path, and adversarial test scenarios:

```bash
node --env-file=.env.local node_modules/tsx/dist/cli.mjs scripts/run-evaluation.ts
```
*Or via npm alias:*
```bash
npm run verify
```

This script:
1. Loads all 10 evaluation test fixtures from `test_cases/test_cases.json`.
2. Tests qualification scoring, verbatim quote grounding, and prompt injection defense.
3. Outputs an ASCII results matrix in the terminal.
4. Generates a comprehensive audit report in `EVALUATION_REPORT.md`.

---

## 📖 Operator Runbook (For Non-Developers & Recruiters)

### 1. Dashboard Overview
Navigate to `http://localhost:3000` to access the Recruiter Dashboard:
- **Left Panel (Setup & Inputs)**:
  - **Quick-Fill Presets**: Click any preset button (`Senior Full-Stack Pass`, `Junior Reject`, `Career Switcher`, `Prompt Injection`) to immediately populate the resume and criteria fields.
  - **Evaluation Criteria**: View, add, or remove role criteria. Use "+ Add" for custom qualifications.
  - **Resume Input**: Paste any plain-text resume or CV excerpt.
  - **Screen Candidate CTA**: Click to initiate screening. Watch the live elapsed timer during inference (~5 seconds).

### 2. Reading Evaluation Results
The Right Panel displays structured audit intelligence:
- **Profile Card**: Displays extracted candidate name, verified email, phone, and composite score badge:
  - 🟢 **80 – 100**: Strong match (`INTERVIEW`)
  - 🟡 **50 – 79**: Partial match, career switcher, or notable gap (`HOLD`)
  - 🔴 **0 – 49**: Underqualified, domain mismatch, or injection (`REJECT`)
- **Criteria Table**: Displays each requirement, met indicator (`✓` / `✗`), model confidence (`HIGH`/`MEDIUM`/`LOW`), and an exact **verbatim quotation** from the resume.
- **Risk & Flags Alert Box**: Highlights any employment timeline gaps (> 12 months), missing contact details, or detected prompt injections.

### 3. Human Decision Gate & Audit Storage
RecruitOS Mini **never** makes autonomous hiring choices:
1. Review the score, verbatim quotes, and flags.
2. Enter any optional notes in the **Reviewer Notes** field (e.g. *"Approved for phone screen by Hiring Manager"*).
3. Click **"✓ Approve & Push to ATS"** or **"✗ Reject Candidate"**.
4. A green confirmation banner will appear with a unique record ID (`DEC_...`).

### 4. Where Decision Data is Stored
Every human decision is automatically persisted to two local audit stores:
- **CSV Audit Log**: Located at `data/screening_log.csv`. Can be opened directly in Microsoft Excel, Google Sheets, or Apple Numbers.
  - Columns: `Timestamp,CandidateName,Score,Recommendation,HumanDecision,ReviewerNotes`
- **JSON Registry**: Located at `data/decisions.json`. A structured JSON array suitable for ATS integrations and downstream webhook automation.

---

## 📁 Project Architecture

```
d:\ai-os-sprint\
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── screen/route.ts      # AI evaluation API endpoint
│   │   │   └── decisions/route.ts   # Human decision audit store (CSV + JSON)
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Recruiter Dashboard Interface
│   │   └── globals.css              # Tailwind styling
│   └── lib/
│       ├── schema.ts                # Strict Zod contracts & TypeScript types
│       └── evaluator.ts             # Free-tier Gemini engine with defense & retries
├── scripts/
│   ├── run-evaluation.ts            # 10-scenario evaluation suite runner
│   └── verify-v0.ts                 # Single-case baseline verification script
├── test_cases/
│   └── test_cases.json              # 10 realistic test fixtures
├── data/
│   ├── screening_log.csv            # Persistent CSV audit log
│   └── decisions.json               # Persistent JSON decision registry
├── EVALUATION_REPORT.md             # Generated evaluation report with RCAs
├── CASE_STUDY.md                    # Engineering & business case study
├── AI_COLLABORATION_NOTE.md         # Pair programming & flaw correction analysis
└── package.json                     # Project scripts and dependencies
```
