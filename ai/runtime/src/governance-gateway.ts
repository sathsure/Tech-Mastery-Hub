import type { ContributionRequest, ContributionRisk, GovernanceAssessment } from "./contribution-contracts.js";

const PROTECTED_PREFIXES = [
  "ai/instructions/",
  "ai/schemas/",
  "ai/architecture/",
  "scripts/",
  ".github/",
  ".git/",
  "ai/runtime/package.json",
  "ai/runtime/tsconfig.json"
];

function isProtectedPath(path: string): boolean {
  const normalized = path.replace(/\\/g, "/").replace(/^\/+/, "");
  return PROTECTED_PREFIXES.some((prefix) => normalized === prefix || normalized.startsWith(prefix));
}

export function assessGovernance(request: ContributionRequest): GovernanceAssessment {
  const protectedPaths = request.files.filter((file) => isProtectedPath(file.path)).map((file) => file.path);
  const risk: ContributionRisk = protectedPaths.length > 0 ? "protected-configuration" : "normal-knowledge";
  const findings: string[] = [];
  if (protectedPaths.length > 0) {
    findings.push(`Protected paths require the stricter approval policy: ${protectedPaths.join(", ")}.`);
  }
  const authorizedApproverConfigured = request.hasHumanApproval;
  const requiresHumanApproval = risk === "protected-configuration" || !request.hasHumanApproval;
  const decision = request.actor !== "ai"
    ? "require-approval"
    : requiresHumanApproval
      ? "require-approval"
      : "allow";
  if (request.actor === "ai" && !request.hasHumanApproval) {
    findings.push("AI-originated contributions require human approval before mutation.");
  }
  if (request.protectedAreaOverride === true && request.actor === "ai") {
    findings.push("AI cannot override protected-area governance.");
  }
  return { decision, risk, findings, requiresHumanApproval, authorizedApproverConfigured};
}
