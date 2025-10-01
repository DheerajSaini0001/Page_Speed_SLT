import AxePuppeteer from "@axe-core/puppeteer";
import puppeteer from "puppeteer";

export default async function accessibilityMetrics(url,device = 'Desktop') {
  const report = {};

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

      if (device === "mobile") {
      await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
      await page.setUserAgent(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) " +
        "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
      );
    }

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
      timeout: 240000,         
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
  
  const relevant = results.violations.filter(v => ruleIds.includes(v.id));
  if (relevant.length === 0) return 1; 

  let failedNodes = 0;
  relevant.forEach(rule => {
    failedNodes += rule.nodes.length;
  });
  const totalNodes = relevant.reduce((acc, r) => acc + r.nodes.length, 0) || 1;
  const passRate = 1 - failedNodes / totalNodes;

  return passRate ? 1 : 0;
}

  async function Landmarks(page) {
    const landmarks = await page.$$(
      '[role="banner"], [role="main"], [role="contentinfo"], [role="navigation"], [role="complementary"]'
    );
    return landmarks.length > 0 ? 1 : 0;
  }

  const colorContrast = calculatePassRate(results, ["color-contrast"]);
  const focusOrder = calculatePassRate(results, ["focus-order"]);
  const focusableContent = calculatePassRate(results, ["focusable-content"]);
  const tabindex = calculatePassRate(results, ["tabindex"]);
  const interactiveElementAffordance = calculatePassRate(results, ["interactive-element-affordance"]);
  const label = calculatePassRate(results, ["label"]);
  const ariaAllowedAttr = calculatePassRate(results, ["aria-allowed-attr"]);
  const ariaRoles = calculatePassRate(results, ["aria-roles"]);
  const ariaHiddenFocus = calculatePassRate(results, ["aria-hidden-focus"]);
  const imageAlt = calculatePassRate(results, ["image-alt"]);
  const SL = await page.$('a[href^="#"]:not([hidden])') ? 0 : 1
  const LM = await Landmarks(page);

  await browser.close();

  const score = ((colorContrast+focusOrder+focusableContent+tabindex+interactiveElementAffordance+label+ariaAllowedAttr+ariaRoles+ariaHiddenFocus+imageAlt+SL+LM)/12)*100;
console.log(score);

  report.C = {
    colorContrast,
    focusOrder,
    focusableContent,
    tabindex,
    interactiveElementAffordance,
    label,
    ariaAllowedAttr,
    ariaRoles,
    ariaHiddenFocus,
    imageAlt,
    skipLinks:SL,
    Landmark:LM,
    totalCScore:parseFloat(score.toFixed(0)) ,
  };

  return report;
}

