import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const repoUrl = "https://github.com/Jaxongir1006/ai-interview-prep-api.git";
const projectRoot = resolve(import.meta.dirname, "..");
const tmpDir = resolve(projectRoot, "tmp");
const backendDir = resolve(tmpDir, "ai-interview-prep-api");

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || projectRoot,
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

await mkdir(tmpDir, { recursive: true });

if (existsSync(resolve(backendDir, ".git"))) {
  run("git", ["fetch", "--all", "--prune"], { cwd: backendDir });
  run("git", ["pull", "--ff-only"], { cwd: backendDir });
} else {
  run("git", ["clone", "--depth", "1", repoUrl, backendDir]);
}

console.log(`Backend repository is available at ${backendDir}`);
