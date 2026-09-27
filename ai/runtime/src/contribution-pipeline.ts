import { evaluateContribution } from "./contribution-gateway.js";
import {
  validateContributionContent,
  analyzeCanonicalOwnership,
  detectContributionDuplicates,
  analyzeContributionRelationships,
  analyzeContributionImpact
} from "./contribution-validation.js";
import type { ContributionRequest } from "./contribution-contracts.js";

export interface ContributionPipelineResult {
  allowed: boolean;
  stage: string;
  reason: string;
  gateway: Awaited<ReturnType<typeof evaluateContribution>>;
  content: ReturnType<typeof validateContributionContent>;
  ownership: Awaited<ReturnType<typeof analyzeCanonicalOwnership>> | null;
  duplicates: Awaited<ReturnType<typeof detectContributionDuplicates>> | null;
  relationships:
    | Awaited<ReturnType<typeof analyzeContributionRelationships>>
    | null;
  impact: ReturnType<typeof analyzeContributionImpact> | null;
}

export async function evaluateContributionPipeline(
  request: ContributionRequest
): Promise<ContributionPipelineResult> {
  const gateway = await evaluateContribution(request);

  if (!gateway.allowed) {
    return {
      allowed: false,
      stage: "security-governance",
      reason: gateway.reason,
      gateway,
      content: {
        valid: false,
        findings: ["Skipped because security/governance blocked the contribution."],
        validatedFiles: 0
      },
      ownership: null,
      duplicates: null,
      relationships: null,
      impact: null
    };
  }

  const content = validateContributionContent(request.files);

  if (!content.valid) {
    return {
      allowed: false,
      stage: "content-validation",
      reason: content.findings.join(" "),
      gateway,
      content,
      ownership: null,
      duplicates: null,
      relationships: null,
      impact: null
    };
  }

  const ownership = await analyzeCanonicalOwnership(request.files);

  if (!ownership.valid) {
    return {
      allowed: false,
      stage: "canonical-ownership",
      reason: ownership.findings.join(" "),
      gateway,
      content,
      ownership,
      duplicates: null,
      relationships: null,
      impact: null
    };
  }

  const duplicates = await detectContributionDuplicates(request.files);

  if (!duplicates.valid) {
    return {
      allowed: false,
      stage: "duplicate-detection",
      reason: duplicates.findings.join(" "),
      gateway,
      content,
      ownership,
      duplicates,
      relationships: null,
      impact: null
    };
  }

  const relationships =
    await analyzeContributionRelationships(request.files);

  const impact = analyzeContributionImpact(
    request.files,
    relationships
  );

  return {
    allowed: impact.valid,
    stage: "impact-analysis",
    reason: impact.valid
      ? "Contribution passed deterministic pre-PR analysis."
      : impact.findings.join(" "),
    gateway,
    content,
    ownership,
    duplicates,
    relationships,
    impact
  };
}
