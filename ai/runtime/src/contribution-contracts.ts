export type ContributionRisk = "normal-knowledge" | "protected-configuration";
export type SecurityDecision = "allow" | "block" | "require-approval";
export type ContributionDecision = "allow" | "block" | "require-approval";

export interface ContributionFile {
  path: string;
  content: string;
}

export interface ContributionRequest {
  requestId: string;
  files: ContributionFile[];
  actor: "ai" | "human";
  hasHumanApproval: boolean;
  protectedAreaOverride?: boolean;
}

export interface SecurityFinding {
  code: string;
  severity: "high" | "medium";
  path: string | null;
  message: string;
}

export interface SecurityAssessment {
  decision: SecurityDecision;
  findings: SecurityFinding[];
  scannedFiles: number;
}

export interface GovernanceAssessment {
  decision: ContributionDecision;
  risk: ContributionRisk;
  findings: string[];
  requiresHumanApproval: boolean;
  authorizedApproverConfigured: boolean;
}

export interface ContributionGateResult {
  allowed: boolean;
  decision: ContributionDecision;
  risk: ContributionRisk;
  security: SecurityAssessment;
  governance: GovernanceAssessment;
  reason: string;
}
