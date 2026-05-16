#!/usr/bin/env node
try {
  require("child_process").execSync("npx prisma generate", {
    stdio: "inherit",
    env: { ...process.env },
  });
} catch {
  console.log(
    "\n⚠ Skipping prisma generate — DATABASE_URL may not be set yet.\n" +
      "  Run 'npx prisma generate' after configuring your .env file.\n",
  );
}
