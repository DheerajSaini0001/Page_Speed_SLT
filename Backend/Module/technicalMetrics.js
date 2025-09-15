import axios from "axios";

export default async function technicalMetrics(url,data,$,robotsText) {
  let totalScore_A3 = 0;

  let sitemapScore = 0;
try {
  const sitemapMatch = robotsText.match(/Sitemap:\s*(.*)/i);
  if (sitemapMatch) {
    const sitemapUrl = sitemapMatch[1].trim();
    try {
      const sitemapRes = await axios.get(sitemapUrl);
      // ✅ Only give 1 if sitemap reachable AND listed in robots.txt
      sitemapScore = sitemapRes.status === 200 ? 1 : 0.5;
    } catch {
      sitemapScore = 0.5; // sitemap listed but unreachable
    }
  } else {
    sitemapScore = 0; // sitemap not present
  }
} catch {
  sitemapScore = 0;
}

let robotsScore = 0;
try {
  if (robotsText && typeof robotsText === "string") {
    // Check for accidental global disallow
    const hasGlobalDisallow = /Disallow:\s*\/\s*$/mi.test(robotsText);
    robotsScore = !hasGlobalDisallow ? 1 : 0;
  } else {
    robotsScore = 0; // robots.txt missing or unparsable
  }
} catch {
  robotsScore = 0; // any error parsing robots.txt
}

// Add to total
totalScore_A3 += sitemapScore * 2;
totalScore_A3 += robotsScore * 2;

let brokenScore = 0;
try {
  const links = $("a[href]")
    .map((i, el) => $(el).attr("href"))
    .get()
    .filter((l) => l && l.startsWith("http"));

  let brokenCount = 0;
  await Promise.all(
    links.map(async (link) => {
      try {
        const res = await axios.head(link, { validateStatus: null, maxRedirects: 5 });
        if (res.status >= 400) brokenCount++;
      } catch {
        brokenCount++;
      }
    })
  );

  const brokenPercent = (brokenCount / (links.length || 1)) * 100;

  // --- Apply your rubric ---
  if (brokenPercent === 0) {
    brokenScore = 1;               // 0% broken
  } else if (brokenPercent > 0 && brokenPercent <= 2) {
    brokenScore = 1 - (brokenPercent / 2) * 0.5;  // linear 1 → 0.5
  } else {
    brokenScore = 0;               // >2% broken
  }

} catch {
  brokenScore = 0;                 // error case
}

// Add weighted score
totalScore_A3 += brokenScore * 2;

let redirectScore = 0;
try {
  const res = await axios.get(url, { maxRedirects: 10, validateStatus: null });
  const hops = res.request?._redirectable?._redirectCount || 0;

  // Convert hops into a "percent"
  // 0 hops = 0%, 5 hops = 5%, >5 hops = >5%
  const percent = hops;

  // --- Apply rubric ---
  if (percent === 0) {
    redirectScore = 1;                         // 0% → score 1
  } else if (percent > 0 && percent <= 5) {
    redirectScore = 1 - percent / 5;           // 0–5% → linear 1 → 0
  } else {
    redirectScore = 0;                         // >5% → score 0
  }

} catch {
  redirectScore = 0;
}

// Add weighted score
totalScore_A3 += redirectScore * 2;


  // const audits = data?.lighthouseResult?.audits;

  const lcpScore = (data?.lighthouseResult?.audits?.["largest-contentful-paint"]?.score || 1)*5
  const clsScore =  (data?.lighthouseResult?.audits?.["cumulative-layout-shift"]?.score || 1)*3
  const inpScore = (data?.lighthouseResult?.audits?.["interactive"]?.score|| 1)*4
  const total_A1 = parseFloat(lcpScore + clsScore + inpScore)
  const ttfbScore = (data?.lighthouseResult?.audits?.["server-response-time"]?.score || 1)*3
  const compressionScore = (data?.lighthouseResult?.audits?.["uses-text-compression"]?.score || 1)*2
  const cachingscore = (data?.lighthouseResult?.audits?.["uses-long-cache-ttl"]?.score || 1)*2
  const httpscore = (data?.lighthouseResult?.audits?.["uses-http2"]?.score || 1 )*1
  const total_A2 = ttfbScore + compressionScore + cachingscore + httpscore

  const total = total_A1 + total_A2 + totalScore_A3
  // const colorContrastScore = audits["color-contrast"]?.score
  // const ariaRolesScore = audits["aria-roles"]?.score
  // const labelsScore = audits["label"]?.score

  // --- Return all scores ---
  return {
    lcpScore:lcpScore,
    clsScore:clsScore,
    inpScore:inpScore,
    total_A1:total_A1,
    ttfbScore:ttfbScore,
    compressionScore:compressionScore,
    cachingscore:cachingscore,
    httpscore:httpscore,
    total_A2:total_A2,
    sitemapScore: sitemapScore * 2,
    robotsScore: robotsScore * 2,
    brokenLinksScore: brokenScore * 2,
    redirectChainsScore: redirectScore * 2,
    totalScore_A3: totalScore_A3,
    totalScore: total
  };
}