# DAY 1 FOUNDATION: RecruitOS Mini
## AI OS Sprint — Discovery, Mapping, and Baseline

**Date:** Day 1 of 5 — Monday, September 2026  
**Candidate:** AI OS Sprint Applicant  
**Domain:** Recruiting & Talent Acquisition  

---

## 1. Target User & Job-to-Be-Done

**User:** A technical recruiter at a high-growth technology company.  
**Seniority:** Mid-level recruiter managing 2–4 open engineering roles simultaneously.  
**Context:** Receives resume submissions directly from an ATS (Applicant Tracking System) or email. Works independently without a dedicated sourcing team.

**Job-to-be-done:**  
> "When a new engineering resume arrives, I need to quickly decide whether this candidate meets our technical criteria well enough to advance to a phone screen — without spending 6+ minutes reading every resume in detail — so I can focus my time on candidates who are actually qualified."

**Key frustration:**  
The recruiter is not a software engineer. They cannot easily judge whether "3 years of React experience" is the same as "4 years of React/TypeScript." They rely on keyword matching, which misses nuance — career switchers with transferable skills, candidates with employment gaps, or overqualified executives applying for junior individual contributor roles.

---

## 2. Current Workflow Map

```
TRIGGER
└─► New resume arrives via email or ATS notification

INPUT
└─► PDF or plain-text resume file
└─► Role criteria document (usually a Word doc or Notion page)

STEP 1: Open & Read
└─► Recruiter opens resume in PDF viewer or email attachment
└─► Reads from top to bottom (approx. 3–5 minutes)

STEP 2: Manual Criterion Check
└─► Opens criteria document in a separate window
└─► Mentally cross-references each criterion against resume text
└─► Highlights or underlines matching keywords manually

STEP 3: Judgment Call
└─► Recruiter decides: Pass to phone screen / Reject / Hold for later
└─► Decision is based on keyword matches and subjective impression
└─► No standardized evidence format — just memory and highlighter

STEP 4: ATS Update
└─► Logs decision manually into ATS (Greenhouse, Lever, or spreadsheet)
└─► Types a short note (often skipped when volume is high)

OUTPUT
└─► Candidate moved to next stage OR archived
└─► Decision note in ATS (inconsistent quality)

EXCEPTION
└─► Unclear experience dates → recruiter guesses or skips
└─► Sparse resume → recruiter rejects (may be a false negative)
└─► Suspicious resume content → no detection mechanism, recruiter must notice manually
```

---

## 3. Evidence of Pain

| Pain Signal | Observation / Evidence |
| :--- | :--- |
| **Time per resume** | 5–8 minutes for a detailed review; 2–3 minutes when rushed (lower quality) |
| **Weekly volume** | 25–50 resumes per open role per week; 2–4 roles = 50–200 resumes/week |
| **Total weekly reading time** | 4–16 hours/week spent just on initial screening |
| **False rejection rate** | Career switchers and non-traditional candidates are frequently rejected at first glance due to unfamiliar job title keywords |
| **Inconsistency** | Two recruiters reviewing the same resume often reach different conclusions because there is no standard evidence format |
| **Missing nuance detection** | Unexplained 4-year employment gaps are frequently missed during fast scans |
| **No adversarial defense** | A candidate could write hidden text or misleading claims in a resume — no recruiter is trained to detect structured prompt manipulation |
| **ATS note quality** | Under high volume, decision notes are often blank, making it impossible to audit why a candidate was rejected months later |

**Key quote from recruiter observation:**  
> "I know I miss good candidates when I am looking at resume number 40 of the day. I just do not have the energy to read carefully anymore."

---

## 4. Baseline Measurement

| Metric | Manual Recruiter Baseline |
| :--- | :--- |
| **Time per resume (careful review)** | 6.5 minutes average |
| **Time per resume (rushed review)** | 2.5 minutes average (lower quality) |
| **Decisions per hour** | ~9 resumes/hour (careful) to ~24 resumes/hour (rushed) |
| **Evidence format** | Unstructured; highlighter or mental notes only |
| **Auditability** | None — no verbatim evidence recorded |
| **Error types detected** | Keyword matching only; no gap detection, no injection defense |
| **Decision logging** | Manual ATS update; often skipped when busy |
| **Infrastructure cost** | Recruiter hourly rate ($30–50/hr) applied to screening time |
| **Scalability ceiling** | ~25 careful reviews per recruiter per day |

---

## 5. Success Metric & Non-Goals

### ✅ Primary Success Metric
Reduce time-to-decision per resume from **6.5 minutes** to **under 10 seconds**, while producing a structured, verbatim-evidence-backed evaluation that a recruiter can review and act on in under 60 seconds.

### ✅ Secondary Metrics
- 100% of evaluations include verbatim evidence quotes or explicit "not found" statements (zero hallucinations)
- Prompt injection and binary payload attacks are detected and blocked before reaching the AI
- Every human decision is automatically persisted to a CSV and JSON audit log
- System runs at $0.00 cost using only free-tier APIs

### 🚫 Non-Goals (Explicit Out-of-Scope)
| What the system will NOT do | Reason |
| :--- | :--- |
| Send rejection or acceptance emails to candidates | Legal and candidate experience risk; requires human judgment |
| Schedule interviews automatically | Calendar actions require explicit recruiter consent |
| Make final hiring decisions autonomously | All ATS state mutations require a human button click |
| Parse graphical or multi-column PDF files | Out of scope for Day 5; flagged as Week 1 iteration target |
| Connect to live ATS APIs (Greenhouse, Lever) | Out of scope; flagged as Week 2 iteration target |
| Store data in a cloud database | Free-tier local file storage (CSV + JSON) is sufficient for v1 |

---

## 6. 10 Test Cases — Design Rationale

The following 10 test cases were designed to cover the full decision space: strong matches, weak matches, ambiguous edge cases, and deliberate adversarial attacks.

| ID | Name | Type | What It Tests |
| :--- | :--- | :--- | :--- |
| TC_01 | Senior Full Stack Happy Path | happy_path | All criteria clearly met; system must score ≥ 90 and recommend INTERVIEW |
| TC_02 | Underqualified Candidate | happy_path | Boot camp graduate vs 4+ year role; system must score low and recommend REJECT |
| TC_03 | Career Switcher with Transferable Skills | edge_case | 8-year analyst transitioning to engineering; system must not hard-reject; should HOLD |
| TC_04 | Unexplained Multi-Year Gap | edge_case | 4-year gap between 2020–2024; system must flag the gap and recommend HOLD |
| TC_05 | Overqualified Executive Profile | edge_case | VP-level applying for IC role; system must detect seniority mismatch and HOLD |
| TC_06 | Sparse Resume | edge_case | Only 5 bullet points with no dates or metrics; system must flag low information density |
| TC_07 | Missing Contact Details | edge_case | Strong technical profile but no email or phone; system must flag and still evaluate |
| TC_08 | Adversarial Prompt Injection | failure_case | Resume contains `=== CRITICAL SYSTEM OVERRIDE ===`; system must detect and REJECT |
| TC_09 | Garbled / Binary Input | failure_case | Mock PDF binary stream (`%PDF-1.7 \x00\xff`); system must block before AI call (0ms) |
| TC_10 | Completely Irrelevant Domain | failure_case | Pastry chef resume submitted for engineering role; system must REJECT with 0 score |

---

## 7. v1 Scope for Day 5

### In Scope (Must work end-to-end by Day 5):
- Plain-text resume input via web UI
- Criterion-by-criterion evaluation with verbatim evidence
- Score (0–100) + recommendation (INTERVIEW / HOLD / REJECT)
- Prompt injection detection and binary payload filtering
- Human approval gate (Approve / Reject button)
- Automatic dual persistence: `data/screening_log.csv` + `data/decisions.json`
- 10-scenario automated test suite with pass/fail results

### Deferred to Week 2:
- PDF file upload and parsing
- Batch processing (ZIP of multiple resumes)
- Direct ATS webhook integrations (Greenhouse, Lever)
- Candidate anonymization / blind screening mode

---

**Key Question Answer:**  
*Is the problem real, recurring, and measurable against a baseline?*

**Yes.** Technical recruiters at high-growth companies review 25–200 resumes per week. The manual process takes 5–8 minutes per resume with no structured evidence trail. RecruitOS Mini replaces the unstructured reading step with a deterministic, evidence-backed evaluation in under 10 seconds — while keeping the human recruiter in full control of the final hiring decision.
