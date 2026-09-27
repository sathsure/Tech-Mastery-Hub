import type { ContributionGateResult, ContributionRequest } from "./contribution-contracts.js";
import { assessSecurity } from "./security-gateway.js";
import { assessGovernance } from "./governance-gateway.js";

export function evaluateContribution(request: ContributionRequest): ContributionGateResult {
  const security = assessSecurity(request);
  const governance = assessGovernance(request);

  if (security.decision === "block") {
    return {
      allowed: false,
      decision: "block",
      risk: governance.risk,
      security,
      governance,
      reason: "Security validation failed. The contribution is blocked."
    };
  }

  if (request.actor === "ai" && governance.decision !== "allow") {
    return {
      allowed: false,
      decision: "require-approval",
      risk: governance.risk,
      security,
      governance,
      reason: "Human approval is required before an AI-originated contribution can proceed."
    };
  }

  if (governance.decision === "require-approval") {
    return {
      allowed: false,
      decision: "require-approval",
      risk: governance.risk,
      security,
      governance,
      reason: "Governance requires human approval before the contribution can proceed."
    };
  }

  return {
    allowed: true,
    decision: "allow",
    risk: governance.risk,
    security,
    governance,
    reason: "Security and governance checks passed."
  };
}
