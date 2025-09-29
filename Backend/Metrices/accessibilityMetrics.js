import AxePuppeteer from "@axe-core/puppeteer";
import puppeteer from "puppeteer";

export default async function accessibilityMetrics(url,device = 'desktop') {
  const report = {};
  if(device == 'desktop'){
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
    const total = ruleIds.length;
    if (total === 0) return 1;
    const violations = results.violations.filter(v => ruleIds.includes(v.id)).length;
    const result = (total - violations) / total
    return result >=70 ? 0 : 1;
  }

  async function Landmarks(page) {
    const landmarks = await page.$$(
      '[role="banner"], [role="main"], [role="contentinfo"], [role="navigation"], [role="complementary"]'
    );
    return landmarks.length > 0 ? 1 : 0;
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
  const SL = await page.$('a[href^="#"]:not([hidden])') ? 0 : 1
  const LM = await Landmarks(page);

  await browser.close();

  const score = ((CC+KN+AL+TX+SL+LM)/6)*100;

  report.C = {
    colorContrast: CC,
    keyboardNavigation: KN,
    ariaLabeling: AL,
    altTextEquivalents: TX,
    skipLinks:SL,
    Landmark:LM,
    totalCScore:parseFloat(score.toFixed(0)) ,
  };

  return report;
}
else{
   const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setViewport({
  width: 375,   
  height: 812,  
  isMobile: true,
  hasTouch: true,
});

await page.setUserAgent(
  "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) " +
  "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
);

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
    const total = ruleIds.length;
    if (total === 0) return 1;
    const violations = results.violations.filter(v => ruleIds.includes(v.id)).length;
    const result = (total - violations) / total
    return result >=70 ? 0 : 1;
  }

  async function Landmarks(page) {
    const landmarks = await page.$$(
      '[role="banner"], [role="main"], [role="contentinfo"], [role="navigation"], [role="complementary"]'
    );
    return landmarks.length > 0 ? 1 : 0;
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
  const SL = await page.$('a[href^="#"]:not([hidden])') ? 0 : 1
  const LM = await Landmarks(page);

  await browser.close();

  const score = ((CC+KN+AL+TX+SL+LM)/6)*100;

  report.C = {
    colorContrast: CC,
    keyboardNavigation: KN,
    ariaLabeling: AL,
    altTextEquivalents: TX,
    skipLinks:SL,
    Landmark:LM,
    totalCScore:parseFloat(score.toFixed(0)) ,
  };

  return report;
}
}
