import puppeteer from "puppeteer";

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

export default async function evaluateMobileUX(url,$) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667, isMobile: true });

  const scores = [0, 0, 0, 0, 0]; 

  try {
    await page.goto(url, { waitUntil: "networkidle2" });

    const viewport = $("meta[name=viewport]").length > 0;

    const fontSizePass = parseInt($("body").css("font-size")) >= 16 || true;

    const buttons = $("a, button").toArray();
    const tapTargetsPass = buttons.length === 0 || buttons.filter(b => {
      const width = parseInt($(b).attr("width")) || 32;
      const height = parseInt($(b).attr("height")) || 32;
      return width >= 32 && height >= 32;
    }).length / buttons.length >= 0.7;

    const passCount = [viewport, fontSizePass, tapTargetsPass].filter(Boolean).length;
    scores[0] = passCount;


    const navLinks = $("a").length;
    scores[1] = navLinks >= 3 ? 2 : navLinks >= 1 ? 1 : 0;


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


    const text = $("body").text() || "";
    if (text.split(/\s+/).length < 200) {
      scores[3] = 2;
    } else {
      const readabilityScore = estimateReadability(text);
      scores[3] = readabilityScore >= 40 && readabilityScore <= 60 ? 2 : 1;
    }


    const interstitials = $("div, dialog").toArray().some(o => {
      const pos = ($(o).attr("style") || "").includes("position:fixed");
      const width = parseInt($(o).attr("width")) || 0;
      const height = parseInt($(o).attr("height")) || 0;
      return pos && width > 0.5 * 375 && height > 0.5 * 667;
    });
    scores[4] = interstitials ? 0 : 1;

  } catch (err) {
    console.error("Error evaluating UX:", err);
  }

  await browser.close();


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
