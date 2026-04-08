import { test, expect } from "@playwright/test";

function parseAffiliateLinks(value: string | undefined): Record<string, string> {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed as Record<string, string>;
    }
  } catch {
    // Keep test robust: malformed JSON should fail with a clear message below.
  }
  throw new Error("AFFILIATE_LINKS must be valid JSON object");
}

test("grok lightning agent smoke check", async ({ page }) => {
  const grokUrl = process.env.GROK_WEB_URL ?? "https://grok.x.ai";
  const affiliateLinks = parseAffiliateLinks(process.env.AFFILIATE_LINKS);

  await page.goto(grokUrl, { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/grok\.x\.ai/);

  // Guardrail: ensure required affiliate keys exist before daily execution.
  for (const key of ["invideo", "nordvpn", "avast"]) {
    expect(affiliateLinks[key], `Missing AFFILIATE_LINKS.${key}`).toBeTruthy();
  }
});
