import { chmodSync, copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const viteCli = resolve(projectRoot, "node_modules/vite/bin/vite.js");
const bundledEsbuild = resolve(
  projectRoot,
  "node_modules/@esbuild/linux-x64/bin/esbuild",
);
const patchedEsbuild = resolve(projectRoot, ".cache/esbuild/bin/esbuild");

mkdirSync(dirname(patchedEsbuild), { recursive: true });
try {
  copyFileSync(bundledEsbuild, patchedEsbuild);
} catch (error) {
  if (!existsSync(patchedEsbuild) || error?.code !== "ETXTBSY") {
    throw error;
  }
}
chmodSync(patchedEsbuild, 0o755);

const result = spawnSync(
  process.execPath,
  [viteCli, ...process.argv.slice(2)],
  {
    cwd: projectRoot,
    stdio: "inherit",
    env: {
      ...process.env,
      ESBUILD_BINARY_PATH: existsSync(patchedEsbuild)
        ? patchedEsbuild
        : bundledEsbuild,
    },
  },
);

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 0);
