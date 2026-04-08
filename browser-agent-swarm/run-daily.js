#!/usr/bin/env node

const { spawn } = require("node:child_process");

function runPlaywright() {
  const child = spawn(
    "npx",
    ["playwright", "test", "swarm.spec.ts", "--project=chromium"],
    { stdio: "inherit", cwd: process.cwd(), shell: false }
  );

  child.on("exit", (code) => {
    process.exit(code ?? 1);
  });
}

function dryRun() {
  const now = new Date();
  const next = new Date(now);
  next.setUTCHours(9, 0, 0, 0);
  if (next <= now) {
    next.setUTCDate(next.getUTCDate() + 1);
  }

  console.log("Swarm daily schedule (UTC): 0 9 * * *");
  console.log(`Current UTC: ${now.toISOString()}`);
  console.log(`Next 9:00 UTC run: ${next.toISOString()}`);
}

if (process.argv.includes("--dry-run")) {
  dryRun();
} else {
  runPlaywright();
}
