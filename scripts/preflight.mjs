import { existsSync, readFileSync } from "node:fs";

const required = [
  "package.json",
  "src/app/page.tsx",
  "src/app/api/markets/route.ts",
  "src/app/api/markets/[marketId]/trades/route.ts",
  "src/lib/scoring.ts",
  ".env.example",
];

let failed = false;
for (const file of required) {
  if (!existsSync(file)) {
    console.error(`MISSING: ${file}`);
    failed = true;
  }
}

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
for (const dep of ["next", "react", "react-dom"]) {
  if (!pkg.dependencies?.[dep]) {
    console.error(`MISSING dependency: ${dep}`);
    failed = true;
  }
}

if (process.env.PANTA_API_KEY) {
  console.log("PANTA_API_KEY: configured in this environment");
} else {
  console.log("PANTA_API_KEY: not configured (demo fallback will be used)");
}

if (failed) process.exit(1);
console.log("DecisionPulse preflight: PASS");
