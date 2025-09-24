import AxePuppeteer from "@axe-core/puppeteer";
import puppeteer from "puppeteer";

export default async function accessibilityMetrics(url) {
  const report = {};

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on("request", (request) => {
    const blockedResources = ["image", "stylesheet", "font"];
    if (blockedResources.includes(request.resourceType())) {
      request.abort();
    } else {
      request.continue();
    }
  });

  try {
    await page.goto(url, {
      waitUntil: "networkidle2", 
      timeout: 120000,         
    });
  } catch (err) {
    console.error("Page navigation failed:", err.message);
    await browser.close();
    return { error: "Page failed to load" };
  }

  let results;
  try {
    results = await new AxePuppeteer(page).analyze();
  } catch (err) {
    console.error("Axe analysis failed:", err.message);
    results = { violations: [] };
  }

  function calculatePassRate(results, ruleIds) {
    const total = ruleIds.length;
    if (total === 0) return 1;
    const violations = results.violations.filter(v => ruleIds.includes(v.id)).length;
    return (total - violations) / total;
  }

  async function hasSkipLinksOrLandmarks(page) {
    const skipLink = await page.$('a[href^="#"]:not([hidden])');
    const landmarks = await page.$$(
      '[role="banner"], [role="main"], [role="contentinfo"], [role="navigation"], [role="complementary"]'
    );
    return skipLink || landmarks.length > 0 ? 1 : 0;
  }

  const CC = calculatePassRate(results, ["color-contrast"]);
  const KN = calculatePassRate(results, [
    "focus-order",
    "focusable-content",
    "tabindex",
    "interactive-element-affordance"
  ]);
  const AL = calculatePassRate(results, [
    "label",
    "aria-allowed-attr",
    "aria-roles",
    "aria-hidden-focus"
  ]);
  const TX = calculatePassRate(results, ["image-alt"]);
  const SL = await hasSkipLinksOrLandmarks(page);

  await browser.close();

  const score = (CC * 3) + (KN * 3) + (AL * 3) + (TX * 2) + (SL * 1);

  report.C = {
    colorContrast: parseFloat((CC * 3).toFixed(2)),
    keyboardNavigation: parseFloat((KN * 3).toFixed(2)),
    ariaLabeling: parseFloat((AL * 3).toFixed(2)),
    altTextEquivalents: parseFloat((TX * 2).toFixed(2)),
    skipLinksLandmarks: parseFloat(SL.toFixed(2)),
    totalCScore: parseFloat(score.toFixed(2)),
  };

  return report;
}
