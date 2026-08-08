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
  // Raw white overlays and arbitrary glass values in component code.
  // These must go through the Layer 3 sidebar-glass tokens.
  /\b(?:bg|border|ring|ring-offset|from|via|to|text)-white(?:\/\d+)?/g,
  /shadow-\[[^\]]*rgba\(/g,
  /backdrop-blur-\[|blur-\[|backdrop-blur-(?:2xl|xl)/g,
  /backdrop-saturate-\d+/g,
  /rounded-\[\d+\.?\d*rem\]/g,
  /text-\[(?:18|22)px\]/g,
  // Direct token access in component code. Components must reference tokens
  // only through Tailwind utilities mapped in theme.css, never via var(--...).
  ...[
    "color",
    "space",
    "spacing",
    "gray",
    "green",
    "yellow",
    "blue",
    "lime",
    "red",
    "size",
    "weight",
    "radius",
    "tracking",
    "text",
    "motion",
    "ease",
    "shadow",
    "leading",
    "font",
  ].map((prefix) => new RegExp(`var\\(--${prefix}-`, "g")),
];

// Files allowed to reference raw token vars. The token gallery is a dev tool
// that must display the underlying values.
const whitelistedFiles = new Set([
  "src/app/tokens/token-gallery.tsx",
  "src/app/tokens/token-gallery.stories.tsx",
]);

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
  if (whitelistedFiles.has(path.relative(process.cwd(), file))) continue;

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
