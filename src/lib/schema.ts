import { z } from "zod";

export const ContactInfoSchema = z.object({
  email: z.string().nullable().describe("Candidate's email address, or null if not provided"),
  phone: z.string().nullable().describe("Candidate's phone number, or null if not provided"),
});

export const ConfidenceLevelSchema = z.enum(["HIGH", "MEDIUM", "LOW"]);

export const CriterionAssessmentSchema = z.object({
  criterion: z.string().describe("The specific role criterion evaluated"),
  met: z.boolean().describe("Whether the criterion is satisfied by the candidate"),
  evidence_quote: z.string().describe("Verbatim excerpt quote from the resume supporting this assessment, or empty string if no evidence exists"),
  confidence: ConfidenceLevelSchema.describe("Confidence level in the assessment"),
});

export const RecommendationSchema = z.enum(["INTERVIEW", "HOLD", "REJECT"]);

export const CandidateEvaluationSchema = z.object({
  candidate_name: z.string().describe("Full name of the candidate extracted from the resume"),
  contact_info: ContactInfoSchema.describe("Extracted contact details (email, phone)"),
  overall_score: z.number().min(0).max(100).describe("Overall qualification match score from 0 to 100"),
  recommendation: RecommendationSchema.describe("Screening recommendation: INTERVIEW, HOLD, or REJECT"),
  summary: z.string().describe("Executive summary of the candidate's background, strengths, and weaknesses relative to the criteria"),
  criteria_assessments: z.array(CriterionAssessmentSchema).describe("Detailed criterion-by-criterion assessment"),
  flags: z.array(z.string()).describe("List of potential issues, career gaps, missing information, seniority mismatches, or adversarial injection attempts"),
  human_review_required: z.boolean().describe("True if anomalies, career gaps, edge cases, injection attempts, or ambiguous criteria require human recruiter intervention"),
});

export type ContactInfo = z.infer<typeof ContactInfoSchema>;
export type ConfidenceLevel = z.infer<typeof ConfidenceLevelSchema>;
export type CriterionAssessment = z.infer<typeof CriterionAssessmentSchema>;
export type Recommendation = z.infer<typeof RecommendationSchema>;
export type CandidateEvaluation = z.infer<typeof CandidateEvaluationSchema>;
