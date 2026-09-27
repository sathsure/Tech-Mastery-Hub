import type { ContributionFile, ContributionRequest, SecurityAssessment, SecurityFinding } from "./contribution-contracts.js";

const SECRET_PATTERNS: Array<[string, RegExp]> = [
  ["private-key", /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/i],
  ["aws-access-key", /\bAKIA[0-9A-Z]{16}\b/],
  ["github-token", /\b(?:ghp|gho|ghs|ghr)_[A-Za-z0-9_]{20,}\b/],
  ["generic-secret-assignment", /\b(?:password|passwd|secret|api[_-]?key|access[_-]?token)\s*[:=]\s*["']?[A-Za-z0-9+/_=-]{8,}/i]
];

const INJECTION_PATTERNS: Array<[string, RegExp]> = [
  ["prompt-injection", /\b(?:ignore|disregard|override)\s+(?:all\s+)?(?:previous|prior|system|developer)\s+(?:instructions?|rules?)/i],
  ["instruction-spoofing", /\b(?:system message|developer message|assistant message)\s*:/i],
  ["security-bypass", /\b(?:disable|bypass|turn off|remove)\s+(?:security|validation|branch protection|approval)/i]
];

const UNSAFE_PATTERNS: Array<[string, RegExp]> = [
  ["executable-payload", /(?:<script\b|javascript:|powershell\s+-enc|cmd\.exe\s+\/c|bash\s+-c)/i],
  ["credential-exfiltration", /\b(?:send|upload|post|exfiltrate)\b.{0,80}\b(?:token|password|secret|credential)\b/i]
];

function findingsForContent(file: ContributionFile): SecurityFinding[] {
  const findings: SecurityFinding[] = [];
  for (const [code, pattern] of SECRET_PATTERNS) {
    if (pattern.test(file.content)) {
      findings.push({ code, severity: "high", path: file.path, message: `Potential secret detected in ${file.path}.` });
    }
  }
  for (const [code, pattern] of INJECTION_PATTERNS) {
    if (pattern.test(file.content)) {
      findings.push({ code, severity: "high", path: file.path, message: `Potential instruction injection detected in ${file.path}.` });
    }
  }
  for (const [code, pattern] of UNSAFE_PATTERNS) {
    if (pattern.test(file.content)) {
      findings.push({ code, severity: "high", path: file.path, message: `Potential unsafe payload detected in ${file.path}.` });
    }
  }
  return findings;
}

export function assessSecurity(request: ContributionRequest): SecurityAssessment {
  const findings = request.files.flatMap(findingsForContent);
  const invalidFiles = request.files.filter((file) => file.path.trim().length === 0);
  for (const file of invalidFiles) {
    findings.push({ code: "invalid-path", severity: "high", path: file.path, message: "Contribution contains an empty file path." });
  }
  const decision = findings.some((item) => item.severity === "high") ? "block" : "allow";
  return { decision, findings, scannedFiles: request.files.length };
}
