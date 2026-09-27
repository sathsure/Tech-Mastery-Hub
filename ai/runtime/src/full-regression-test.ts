import { spawnSync } from "node:child_process";

const checks = [
  "check",
  "build",
  "response-check",
  "model-provider-check", "model-orchestration-check",
  "api-check",
  "contribution-check",
  "contribution-pipeline-check",
  "git-boundary-check",
  "contribution-execution-check",
  "remote-contribution-check",
  "github-provider-check",
  "reindex-check",
  "post-merge-reindex-check",
  "github-post-merge-reindex-check",
  "manual-completion-check"
];

for (const check of checks) {
  process.stdout.write(`\n===== ${check} =====\n`);

  const result = spawnSync(
    "npm.cmd",
    ["run", check],
    {
      stdio: "inherit",
      shell: true
    }
  );

  if (result.status !== 0) {
    process.exit(
      typeof result.status === "number"
        ? result.status
        : 1
    );
  }
}

process.stdout.write(
  "\nFULL RUNTIME REGRESSION: PASS\n"
);

