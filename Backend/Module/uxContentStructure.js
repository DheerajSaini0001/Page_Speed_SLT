import PQueue from "p-queue";


const normalizeScore = (passRate, weight) => (passRate / 100) * weight;

async function crawlDepthParallel(startUrl, maxDepth = 3, concurrency = 5) {
  const visited = new Set([startUrl]);
  let queue = [{ url: startUrl, depth: 0 }];
  let withinLimit = 0,
    total = 0;

  const queueExecutor = new PQueue({ concurrency });

  while (queue.length) {
    const batch = queue.splice(0, concurrency);

    await Promise.all(
      batch.map((item) =>
        queueExecutor.add(async () => {
          const { url: current, depth } = item;
          if (depth > maxDepth) return;

          try {
            const res = await axios.get(current);
            const $ = cheerio.load(res.data);
            total++;
            if (depth <= maxDepth) withinLimit++;

            $("a[href]").each((_, el) => {
              const link = $(el).attr("href");
              if (
                link &&
                !link.startsWith("mailto:") &&
                !link.startsWith("javascript:")
              ) {
                const fullUrl = new URL(link, startUrl).href;
                if (!visited.has(fullUrl) && fullUrl.startsWith(startUrl)) {
                  visited.add(fullUrl);
                  queue.push({ url: fullUrl, depth: depth + 1 });
                }
              }
            });
          } catch {}
        })
      )
    );
  }

  return total ? (withinLimit / total) * 100 : 100;
}

function fleschReadingEase(text) {
  // Simple approximation: can be replaced with proper library
  const words = text.split(/\s+/).length;
  const sentences = text.split(/[.!?]/).length;
  const syllables = text.split(/[aeiouy]+/gi).length - 1;
  if (sentences === 0 || words === 0) return 0;
  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
   return score;
}

export default async function uxContentStructure(url, $, page) {
  const report = {};

  // Inject CLS observer
  await page.evaluateOnNewDocument(() => {
    window.__cls = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__cls += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });

  await page.goto(url, { waitUntil: "networkidle2" });

  // --- 1️⃣ Mobile Friendliness ---
  const mobileTask = (async () => {
    const viewport = $("meta[name='viewport']").attr("content") ? 1 : 0;

    const { avgFontSize, badTapTargets } = await page.evaluate(() => {
      const elements = [...document.querySelectorAll("p,span,li,a")];
      const sizes = elements.map(
        (el) => parseFloat(window.getComputedStyle(el).fontSize) || 16
      );
      const avgFontSize = sizes.length
        ? sizes.reduce((a, b) => a + b, 0) / sizes.length
        : 16;

      const links = [...document.querySelectorAll("a,button")];
      const badTapTargets = links.filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width < 48 || r.height < 48;
      }).length;

      return { avgFontSize, badTapTargets };
    });

    const fontCheck = avgFontSize >= 16 ? 1 : 0;
    const tapTargetCheck = badTapTargets === 0 ? 1 : 0;
    return viewport + fontCheck + tapTargetCheck >= 2 ? 3 : 0;
  })();

  // --- 2️⃣ Navigation Depth ---
  const navTask = crawlDepthParallel(url, 3, 5).then((passRate) =>
    normalizeScore(passRate, 2)
  );

  // --- 3️⃣ Layout Shift (CLS) ---
  const clsTask = page.evaluate(() => window.__cls || 0).then((clsValue) => {
    const passRate = clsValue < 0.1 ? 100 : clsValue < 0.25 ? 70 : 30;
    return normalizeScore(passRate, 2);
  });

  // --- 4️⃣ Readability ---
  const readabilityTask = (async () => {
    const text = $("body").text();
    const fleschScore = fleschReadingEase(text);
    const passRate = Math.max(0, Math.min(100, 100 - Math.abs(fleschScore - 60)));
    return normalizeScore(passRate, 2);
  })();

  // --- 5️⃣ Intrusive Interstitials ---
  const interstitialTask = page.evaluate(() => {
    const els = [...document.querySelectorAll("div,section,aside")];
    return els.some((el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > window.innerWidth * 0.9 && rect.height > window.innerHeight * 0.9;
    });
  }).then((hasOverlay) => (hasOverlay ? 0 : 1));

  // --- Run all tasks in parallel ---
  const [
    mobileFriendlinessScore,
    navigationDepthScore,
    layoutShiftScore,
    readabilityScore,
    intrusiveInterstitialScore,
  ] = await Promise.all([
    mobileTask,
    navTask,
    clsTask,
    readabilityTask,
    interstitialTask,
  ]);

  report.E = {
    mobileFriendliness: mobileFriendlinessScore,
    navigationDepth: parseFloat(navigationDepthScore.toFixed(2)),
    layoutShift: parseFloat(layoutShiftScore.toFixed(2)),
    readability: parseFloat(readabilityScore.toFixed(2)),
    intrusiveInterstitials: intrusiveInterstitialScore,
    totalEScore: parseFloat(
      (
        mobileFriendlinessScore +
        navigationDepthScore +
        layoutShiftScore +
        readabilityScore +
        intrusiveInterstitialScore
      ).toFixed(2)
    ),
  };

  return report;
}