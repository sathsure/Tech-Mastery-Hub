import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

async function run(name: string, command: string): Promise<void> {
  console.log(`\n===== ${name} =====`);

  const result = await execFileAsync(
    process.platform === "win32" ? "cmd.exe" : command,
    process.platform === "win32"
      ? ["/c", command]
      : [],
    {
      cwd: process.cwd(),
      maxBuffer: 10 * 1024 * 1024
    }
  );

  if (result.stdout.trim()) {
    process.stdout.write(result.stdout);
  }

  if (result.stderr.trim()) {
    process.stderr.write(result.stderr);
  }
}

async function main(): Promise<void> {
  await run("FULL RUNTIME REGRESSION", "npm.cmd run full-regression");
  await run("PRODUCT COMPLETION GATE", "npm.cmd run product-completion-check");

  console.log("");
  console.log("========================================");
  console.log("TECH-MASTERY-HUB AI TUTOR");
  console.log("100% IMPLEMENTATION ACCEPTANCE: PASS");
  console.log("========================================");
}

main().catch((error: unknown) => {
  console.error("");
  console.error(
    error instanceof Error
      ? error.message
      : "FINAL ACCEPTANCE FAILURE"
  );
  process.exitCode = 1;
});
