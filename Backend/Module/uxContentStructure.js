import puppeteer from "puppeteer";
import { JSDOM } from "jsdom";

// Helper: estimate readability using simple Flesch reading ease
function estimateReadability(text) {
  const words = text.split(/\s+/).length || 1;
  const sentences = text.split(/[.!?]/).length || 1;
  const syllables = text
    .toLowerCase()
    .split(/\s+/)
    .reduce((sum, word) => {
      const syl = word.replace(/[^aeiouy]/g, "").length || 1;
      return sum + syl;
    }, 0);
  const flesch =
    206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  return flesch;
}

export default async function evaluateMobileUX(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667, isMobile: true });

  const scores = [0, 0, 0, 0, 0]; // [mobile, nav, CLS, readability, interstitials]

  try {
    await page.goto(url, { waitUntil: "networkidle2" });

    // --- 1. Mobile Friendliness (weight 3) ---
    const viewport = await page.$("meta[name=viewport]");
    const fontSizePass = await page.evaluate(() => {
      const el = document.querySelector("body");
      const style = window.getComputedStyle(el);
      return parseInt(style.fontSize) >= 16;
    });

    const tapTargetsPass = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button,a"));
      if (!buttons.length) return true; // no buttons, treat as passed
      const passCount = buttons.filter(
        (b) => b.getBoundingClientRect().width >= 32 && b.getBoundingClientRect().height >= 32
      ).length;
      return passCount / buttons.length >= 0.7; // 70% buttons pass
    });

    // Count how many criteria pass (0–3)
    const passCount = [viewport, fontSizePass, tapTargetsPass].filter(Boolean).length;
    scores[0] = passCount; // 1 →1, 2 →2, 3 →3

    // --- 2. Navigation Depth (weight 2) ---
    const navLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("a")).filter(a => a.offsetParent !== null).length;
    });
    scores[1] = navLinks >= 3 ? 2 : navLinks >= 1 ? 1 : 0;

    // --- 3. Layout Shift (CLS) (weight 2) ---
    await page.evaluate(() => {
      window.cumulativeLayoutShiftScore = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            window.cumulativeLayoutShiftScore += entry.value;
          }
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    await new Promise(resolve => setTimeout(resolve, 3000));
    const cls = await page.evaluate(() => window.cumulativeLayoutShiftScore);
    scores[2] = cls < 0.1 ? 2 : 1;

    // --- 4. Readability (weight 2) ---
    const html = await page.content();
    const dom = new JSDOM(html);
    const text = dom.window.document.body.textContent || "";
    if (text.split(/\s+/).length < 200) {
      scores[3] = 2; // minimal text → full score
    } else {
      const readabilityScore = estimateReadability(text);
      scores[3] = readabilityScore >= 40 && readabilityScore <= 70 ? 2 : 1;
    }

    // --- 5. Intrusive Interstitials (weight 1) ---
    const interstitialScore = await page.evaluate(() => {
      const overlays = Array.from(document.querySelectorAll("div,dialog"));
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      return overlays.some(
        o => o.offsetHeight / vh > 0.5 && o.offsetWidth / vw > 0.5 && getComputedStyle(o).position === "fixed"
      ) ? 0 : 1;
    });
    scores[4] = interstitialScore;

  } catch (err) {
    console.error("Error evaluating UX:", err);
  }

  await browser.close();

  // --- Prepare final report ---
  const report = {};
  report.E = {
    mobileFriendliness: parseFloat(scores[0].toFixed(2)),
    navigationDepth: parseFloat(scores[1].toFixed(2)),
    layoutShift: parseFloat(scores[2].toFixed(2)),
    readability: parseFloat(scores[3].toFixed(2)),
    intrusiveInterstitials: parseFloat(scores[4].toFixed(2)),
    totalEScore: parseFloat(scores.reduce((a, b) => a + b, 0).toFixed(2)),
  };

  return report;
}
