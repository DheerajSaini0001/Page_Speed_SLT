import * as cheerio from "cheerio";

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

export default async function evaluateMobileUX(url,page) {

    await page.goto(url, {waitUntil: "networkidle2",timeout: 240000});
    await page.waitForSelector("body", { timeout: 240000 });
    const htmlData = await page.content();
    const $ = cheerio.load(htmlData);

    const viewport = $("meta[name=viewport]").length > 0;

    const fontSizePass = parseInt($("body").css("font-size")) >= 16 || true;

    const buttons = $("a, button").toArray();
    const tapTargetsPass = buttons.length === 0 || buttons.filter(b => {
      const width = parseInt($(b).attr("width")) || 32;
      const height = parseInt($(b).attr("height")) || 32;
      return width >= 32 && height >= 32;
    }).length / buttons.length >= 0.7;

    const passCount = [viewport, fontSizePass, tapTargetsPass].filter(Boolean).length;
    const mobileFriendliness = passCount == 3 ? 1 : 0;


    const navLinks = $("a").length;
    const navigationDepth = navLinks == 3  ? 1 : 0;


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
    const layout_Shift_on_Interactions = cls < 0.1 ? 1 : 0;

    let readability
    const text = $("body").text() || "";
    if (text.split(/\s+/).length < 200) {
      readability = 1;
    } else {
      const readabilityScore = estimateReadability(text);
      readability = readabilityScore >= 40 && readabilityScore <= 60 ? 1 : 0;
    }


    const interstitials = $("div, dialog").toArray().some(o => {
      const pos = ($(o).attr("style") || "").includes("position:fixed");
      const width = parseInt($(o).attr("width")) || 0;
      const height = parseInt($(o).attr("height")) || 0;
      return pos && width > 0.5 * 375 && height > 0.5 * 667;
    });
    const intrusive_Interstitials = interstitials ? 0 : 1;

    const totalEScore = ((mobileFriendliness + navigationDepth + layout_Shift_on_Interactions + readability + intrusive_Interstitials)/5)*100

  await browser.close();


  const report = {};
  report.E = {
    mobileFriendliness: mobileFriendliness,
    navigationDepth: navigationDepth,
    layoutShift: layout_Shift_on_Interactions,
    readability: readability,
    intrusiveInterstitials: intrusive_Interstitials,
    totalEScore: parseFloat(totalEScore.toFixed(0)),
  };

  return report;
}
