import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(process.cwd(), "src");
const includeExtensions = new Set([".ts", ".tsx"]);

const bannedPatterns = [
  /bg-red-500/g,
  /rounded-card border border-card-border bg-card-bg p-card-padding/g,
  /bg-surface-muted\/40/g,
  /bg-surface-muted\/70/g,
  /font-\[var\(--weight-(medium|semibold|bold)\)\]/g,
];

const ignoredDirectories = new Set(["node_modules", "dist", ".git"]);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (ignoredDirectories.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }

    if (includeExtensions.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

const files = await walk(root);
const violations = [];

for (const file of files) {
  const content = await readFile(file, "utf8");

  for (const pattern of bannedPatterns) {
    pattern.lastIndex = 0;

    if (pattern.test(content)) {
      violations.push(`${path.relative(process.cwd(), file)}: ${pattern}`);
    }
  }
}

if (violations.length > 0) {
  console.error("Style guardrail violations found:\n");
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("Style guardrails passed.");
