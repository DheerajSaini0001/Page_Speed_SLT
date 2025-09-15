import AxePuppeteer from "@axe-core/puppeteer";


export default async function accessibilityMetrics(url,page) {
const report = {};

    await page.goto(url, { waitUntil: "networkidle2" });
    // Run axe-core audit
    const results = await new AxePuppeteer(page).analyze();
// --- Helper: Calculate pass rate for selected Axe rules ---
function calculatePassRate(results, ruleIds) {
  const total = ruleIds.length;
  if (total === 0) return 1; // if no rules, consider pass

  const violations = results.violations.filter(v => ruleIds.includes(v.id)).length;
  return (total - violations) / total; // pass rate: 1 = all pass, 0 = all fail
}

// --- Helper: Check for skip links or landmark elements ---
async function hasSkipLinksOrLandmarks(page) {
  // Look for common skip link pattern or landmark roles
  const skipLink = await page.$('a[href^="#"]:not([hidden])'); // visible skip link
  const landmarks = await page.$$('[role="banner"], [role="main"], [role="contentinfo"], [role="navigation"], [role="complementary"]');
  return (skipLink || landmarks.length > 0) ? 1 : 0;
}

  // --- Calculate each category ---
  const CC = calculatePassRate(results, ["color-contrast"]); // Color contrast AA
  const KN = calculatePassRate(results, [
    "focus-order",
    "focusable-content",
    "tabindex",
    "interactive-element-affordance"
  ]); // Keyboard navigation
  const AL = calculatePassRate(results, [
    "label",
    "aria-allowed-attr",
    "aria-roles",
    "aria-hidden-focus"
  ]); // ARIA/Labels
  const TX = calculatePassRate(results, ["image-alt"]); // Alt/text equivalents
  const SL = await hasSkipLinksOrLandmarks(page); // Skip links / landmarks

  // --- Weighted scoring ---
  const score = (CC * 3) + (KN * 3) + (AL * 3) + (TX * 2) + (SL * 1);

  // Combine all C metrics
  report.C = {
    colorContrast: parseFloat(CC.toFixed(2))*3,
    keyboardNavigation: parseFloat(KN.toFixed(2))*3,
    ariaLabeling: parseFloat(AL.toFixed(2))*3,
    altTextEquivalents: parseFloat(TX.toFixed(2))*2,
    skipLinksLandmarks: SL,
    totalCScore: parseFloat(score.toFixed(2)),
  };

  return report;
}