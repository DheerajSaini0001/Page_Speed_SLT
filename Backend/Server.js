import express from "express";
import axios from "axios";
import cors from "cors";
import * as cheerio from "cheerio";
import crypto from "crypto";
const PORT =2000;

const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = 'AIzaSyCww7MhvCEUmHhlACNBqfbzL5PUraT8lkk';


// Helper: normalize pass rate (0–100%) to 0–1 score
const normalizeScore = (passRate, weight) => (passRate / 100) * weight;

function hashContent(content) {
  return crypto.createHash("md5").update(content).digest("hex");
}

// Helper to check HTTPS and mixed content
async function checkHTTPS(url) {
  try {
    const res = await axios.get(url);
    const mixedContent = res.data.match(/http:\/\/[^"']+/gi);
    return res.request.protocol === "https:" && (!mixedContent || mixedContent.length === 0) ? 1 : 0;
  } catch {
    return 0;
  }
}

// Helper to check HSTS header
async function checkHSTS(url) {
  try {
    const res = await axios.get(url);
    const hsts = res.headers["strict-transport-security"];
    if (!hsts) return 0;
    if (hsts.includes("preload")) return 1;
    return 0.5;
  } catch {
    return 0;
  }
}

// Helper to check security headers
async function checkSecurityHeaders(url) {
  try {
    const res = await axios.get(url);
    const headers = res.headers;
    const requiredHeaders = [
      "content-security-policy",
      "x-content-type-options",
      "x-frame-options",
      "cross-origin-opener-policy",
      "referrer-policy",
    ];
    const presentCount = requiredHeaders.filter((h) => headers[h]).length;
    return (presentCount / requiredHeaders.length) * 3; // weight 3
  } catch {
    return 0;
  }
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

async function technicalMetrics(url,data) {
  let totalScore_A3 = 0;
  
  // --- Helper functions ---
  const scoreBrokenLinks = (percent) => {
    if (percent === 0) return 1;
    if (percent > 0 && percent <= 2) return 1 - (percent / 2) * 0.5;
    return 0;
  };

  const scoreRedirectChains = (percent) => {
    if (percent === 0) return 1;
    if (percent > 0 && percent <= 5) return 1 - percent / 5;
    return 0;
  };

  // --- 1️⃣ Sitemap check ---
  let sitemapScore = 0;
  try {
    const robotsUrl = new URL("/robots.txt", url).href;
    const robotsRes = await axios.get(robotsUrl);
    const robotsText = robotsRes.data;

    const sitemapMatch = robotsText.match(/Sitemap:\s*(.*)/i);
    if (sitemapMatch) {
      const sitemapUrl = sitemapMatch[1].trim();
      try {
        const sitemapRes = await axios.get(sitemapUrl);
        sitemapScore = sitemapRes.status === 200 ? 1 : 0.5;
      } catch {
        sitemapScore = 0.5;
      }
    } else {
      sitemapScore = 0;
    }
  } catch {
    sitemapScore = 0;
  }
  totalScore_A3 += sitemapScore * 2;

  // --- 2️⃣ robots.txt validity ---
  let robotsScore = 0;
  try {
    const robotsUrl = new URL("/robots.txt", url).href;
    const res = await axios.get(robotsUrl);
    const robotsText = res.data;
    const hasGlobalDisallow = /Disallow:\s*\/\s*$/mi.test(robotsText);
    robotsScore = !hasGlobalDisallow ? 1 : 0;
  } catch {
    robotsScore = 0;
  }
  totalScore_A3 += robotsScore * 2;

  // --- 3️⃣ Broken links ---
  let brokenScore = 0;
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
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
    brokenScore = scoreBrokenLinks(brokenPercent);
  } catch {
    brokenScore = 0;
  }
  totalScore_A3 += brokenScore * 2;

  // --- 4️⃣ Redirect chains ---
  let redirectScore = 0;
  try {
    const res = await axios.get(url, { maxRedirects: 10, validateStatus: null });
    const hops = res.request?._redirectable?._redirectCount || 0;
    const percent = hops > 1 ? 100 : 0;
    redirectScore = scoreRedirectChains(percent);
  } catch {
    redirectScore = 0;
  }
  totalScore_A3 += redirectScore * 2;


  const lcpScore = ((data?.lighthouseResult?.audits?.["largest-contentful-paint"]?.score || 1)*5)
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

// Main SEO function (B1+B2+B3)
async function seoMetrics(url) {
  const result = {};

  let html;
  try {
    const res = await axios.get(url);
    html = res.data;
  } catch (err) {
    console.error("Failed to fetch page:", err.message);
    return null;
  }

  const $ = cheerio.load(html);

  // --- B1: Essentials ---
  const title = $("title").text().trim();
  const titleScore = title && title.length <= 60 ? 3 : 0; // weight 3

  const metaDesc = $('meta[name="description"]').attr("content") || "";
  const metaScore = metaDesc && metaDesc.length <= 160 ? 2 : 0; // weight 2

  const canonical = $('link[rel="canonical"]').attr("href") || "";
  const canonicalScore = canonical === url ? 2 : 0; // weight 2

  const h1Count = $("h1").length;
  const h1Score = h1Count === 1 ? 3 : 0; // weight 3

  const B1 = {
    title: titleScore,
    metaDescription: metaScore,
    canonical: canonicalScore,
    h1: h1Score,
    total: titleScore + metaScore + canonicalScore + h1Score,
  };

  // --- B2: Media & Semantics ---
  const images = $("img");
  const altCount = images.toArray().filter((img) => $(img).attr("alt")?.trim());
  const imageAltScore = ((altCount.length / (images.length || 1)) * 3).toFixed(2); // weight 3

  const headings = $("h1,h2,h3").map((i, el) => el.tagName).get();
  let hierarchyScore = 2; // weight 2 default
  for (let i = 0; i < headings.length - 1; i++) {
    if (headings[i] === "h3" && headings[i + 1] === "h1") hierarchyScore = 0;
  }

  const links = $("a").toArray();
  const goodLinks = links.filter(
    (a) => !["click here", "read more"].includes($(a).text().toLowerCase().trim())
  );
  const linkScore = ((goodLinks.length / (links.length || 1)) * 1).toFixed(2); // weight 1

  const B2 = {
    imageAlt: parseFloat(imageAltScore),
    headingHierarchy: hierarchyScore,
    descriptiveLinks: parseFloat(linkScore),
    total: parseFloat(imageAltScore) + hierarchyScore + parseFloat(linkScore),
  };

  // --- B3: Structure & Uniqueness ---
  let urlSlugScore = 2;
  try {
    const slug = new URL(url).pathname.slice(1);
    if (!/^([a-z0-9]+(-[a-z0-9]+)*)$/.test(slug) || slug.length > 75) urlSlugScore = 0;
  } catch {
    urlSlugScore = 0;
  }

  const contentHash = hashContent(html);
  const duplicatePercent = 0; // placeholder for multi-page comparison
  let dupScore = 3;
  if (duplicatePercent === 0) dupScore = 3;
  else if (duplicatePercent <= 5) dupScore = parseFloat((3 * (1 - duplicatePercent / 5)).toFixed(2));
  else dupScore = 0;

  const paginationScore = $("link[rel='next'], link[rel='prev']").length ? 1 : 0; // weight 1

  const B3 = {
    urlSlugs: urlSlugScore,
    duplicateContent: dupScore,
    pagination: paginationScore,
    total: urlSlugScore + dupScore + paginationScore,
  };

  const totalSEO = B1.total + B2.total + B3.total;

  return {
    B1,
    B2,
    B3,
    totalSEO,
  };
}

// Accessibility function (C section)
async function accessibilityMetrics(url) {
  const report = {};

  let html;
  try {
    const res = await axios.get(url);
    html = res.data;
  } catch (err) {
    console.error("Failed to fetch page:", err.message);
    return null;
  }

  const $ = cheerio.load(html);

  // --- C Metrics ---

  // 1️⃣ Color Contrast AA
  // Placeholder: in real usage, use axe-core or Pa11y
  const colorContrastPassRate = 95; // % of elements passing
  const colorContrastScore = normalizeScore(colorContrastPassRate, 3);

  // 2️⃣ Focusable / Keyboard Navigation
  const focusablePassRate = 90; // % of focusable elements correctly handled
  const focusableScore = normalizeScore(focusablePassRate, 3);

  // 3️⃣ ARIA / Labeling
  const ariaPassRate = 92; // % of form elements with proper labels/ARIA
  const ariaScore = normalizeScore(ariaPassRate, 3);

  // 4️⃣ Alt / Text Equivalents
  const images = $("img").toArray().filter((img) => !$(img).attr("decorative"));
  const altPassCount = images.filter((img) => $(img).attr("alt")?.trim()).length;
  const altPassRate = (altPassCount / (images.length || 1)) * 100;
  const altScore = normalizeScore(altPassRate, 2);

  // 5️⃣ Skip Links / Landmarks
  const skipLinks = $("a[href^='#skip'], [role='main'], [role='navigation'], [role='contentinfo']");
  const skipLinksScore = skipLinks.length ? 1 : 0;

  // Combine all C metrics
  report.C = {
    colorContrast: parseFloat(colorContrastScore.toFixed(2)),
    keyboardNavigation: parseFloat(focusableScore.toFixed(2)),
    ariaLabeling: parseFloat(ariaScore.toFixed(2)),
    altTextEquivalents: parseFloat(altScore.toFixed(2)),
    skipLinksLandmarks: skipLinksScore,
    totalCScore: parseFloat(
      (
        colorContrastScore +
        focusableScore +
        ariaScore +
        altScore +
        skipLinksScore
      ).toFixed(2)
    ),
  };

  return report;
}

// D section function
async function securityCompliance(url) {
  const report = {};

  // 1️⃣ HTTPS & mixed content (weight 2)
  const httpsScore = await checkHTTPS(url);

  // 2️⃣ HSTS (weight 1)
  const hstsScore = await checkHSTS(url);

  // 3️⃣ Security Headers (weight 3)
  const headersScore = await checkSecurityHeaders(url);

  // 4️⃣ Cookie Banner & Consent (weight 1)
  // Placeholder: in real use, check for cookie consent elements/scripts
  const cookieBannerScore = 1; // assume compliant

  // 5️⃣ 404/500 custom error pages (weight 1)
  // Placeholder: check /404 or /nonexistent page returns custom content
  const errorPageScore = 1; // assume compliant

  report.D = {
    httpsMixedContent: httpsScore * 2,
    hsts: hstsScore * 1,
    securityHeaders: parseFloat(headersScore.toFixed(2)),
    cookieConsent: cookieBannerScore,
    errorPages: errorPageScore,
    totalDScore:
      httpsScore * 2 +
      hstsScore * 1 +
      parseFloat(headersScore.toFixed(2)) +
      cookieBannerScore +
      errorPageScore,
  };

  return report;
}

// UX & Content Structure function
async function uxContentStructure(url) {
  const report = {};

  let html;
  try {
    const res = await axios.get(url);
    html = res.data;
  } catch (err) {
    console.error("Failed to fetch page:", err.message);
    return null;
  }

  const $ = cheerio.load(html);

  // 1️⃣ Mobile Friendliness (viewport, font size, tap targets)
  const viewport = $('meta[name="viewport"]').attr("content") ? 1 : 0;
  // Placeholder: assume font size and tap targets compliant
  const mobileFriendlinessScore = viewport ? 3 : 0; // weight 3

  // 2️⃣ Navigation Depth (≤3 clicks to key pages)
  // Placeholder: assume all key paths within 3 clicks
  const navigationDepthPassRate = 90; // %
  const navigationDepthScore = normalizeScore(navigationDepthPassRate, 2);

  // 3️⃣ Layout Shift on Interactions (CLS spikes)
  // Placeholder: assume 95% of interactions pass
  const clsPassRate = 95; // %
  const layoutShiftScore = normalizeScore(clsPassRate, 2);

  // 4️⃣ Readability (Flesch 50–70 for articles)
  const text = $("body").text();
  const fleschScore = fleschReadingEase(text);
  const readabilityPassRate = fleschScore >= 50 && fleschScore <= 70 ? 100 : 0; // simplified
  const readabilityScore = normalizeScore(readabilityPassRate, 2);

  // 5️⃣ Intrusive Interstitials (0/1)
  // Placeholder: assume compliant
  const intrusiveInterstitialScore = 1; // weight 1

  // Combine all E metrics
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

// Conversion & Lead Flow function
async function conversionLeadFlow(url) {
  const report = {};

  let html;
  try {
    const res = await axios.get(url);
    html = res.data;
  } catch (err) {
    console.error("Failed to fetch page:", err.message);
    return null;
  }

  const $ = cheerio.load(html);

  // 1️⃣ Primary CTAs above the fold (weight 2)
  // Placeholder: assume 90% of key pages have CTA above fold
  const ctaPassRate = 90; // %
  const ctaScore = normalizeScore(ctaPassRate, 2);

  // 2️⃣ Forms (labels, required, validation) (weight 2)
  const forms = $("form").toArray();
  const validForms = forms.filter((f) => {
    const labels = $(f).find("label").length;
    const inputs = $(f).find("input[required]").length;
    return labels > 0 && inputs >= 0; // simple check
  });
  const formsPassRate = (validForms.length / (forms.length || 1)) * 100;
  const formsScore = normalizeScore(formsPassRate, 2);

  // 3️⃣ Thank-You / Success state (weight 1)
  // Placeholder: assume 100% sampled pass
  const thankYouScore = 1;

  // 4️⃣ Tracking of form submits/events without PII (weight 2)
  // Placeholder: assume tracking works
  const trackingScore = 1;

  // 5️⃣ Contact Info (click-to-call, email, address, hours, map) (weight 2)
  // Placeholder: assume present and consistent
  const contactScore = 1;

  // 6️⃣ Load on CRM/Webhook dry-run (2xx to endpoint) (weight 1)
  // Placeholder: assume successful
  const crmScore = 1;

  // Combine all F metrics
  report.F = {
    primaryCTA: parseFloat(ctaScore.toFixed(2)),
    forms: parseFloat(formsScore.toFixed(2)),
    thankYouState: thankYouScore,
    tracking: trackingScore,
    contactInfo: contactScore,
    crmWebhook: crmScore,
    totalFScore: parseFloat(
      (
        ctaScore +
        formsScore +
        thankYouScore +
        trackingScore +
        contactScore +
        crmScore
      ).toFixed(2)
    ),
  };

  return report;
}

async function aioReadiness(url) {
  const report = {};

  let html;
  try {
    const res = await axios.get(url);
    html = res.data;
  } catch (err) {
    console.error("Failed to fetch page:", err.message);
    return null;
  }

  const $ = cheerio.load(html);

  // -------------------
  // G1: Entity & Organization Clarity (4)
  // -------------------
  const jsonLdScripts = $('script[type="application/ld+json"]')
    .map((i, el) => {
      try {
        return JSON.parse($(el).html());
      } catch {
        return null;
      }
    })
    .get()
    .filter(Boolean);

  const orgSchemas = jsonLdScripts.filter((s) => s["@type"] === "Organization");
  let orgFieldScore = 0;
  let orgValid = false;

  if (orgSchemas.length > 0) {
    const fields = ["name", "logo", "url", "contactPoint", "address", "sameAs"];
    const presentFields = fields.reduce(
      (acc, f) => acc + (orgSchemas[0][f] ? 1 : 0),
      0
    );
    const percent = (presentFields / fields.length) * 100;
    orgFieldScore = normalizeScore(percent, 2);
    orgValid = percent >= 80; // treat as valid if ≥80% fields present
  }

  // Consistent NAP
  const napScore = 1; // placeholder

  // Humans/Policies
  const policies = ["About", "Contact", "Privacy", "Terms", "Returns", "Shipping"];
  const policyPresent = policies.filter((p) =>
    $("body").text().includes(p)
  ).length;
  const policyScore = normalizeScore(
    (policyPresent / policies.length) * 100,
    1
  );

  // -------------------
  // G2: Content Answerability & Structure (3)
  // -------------------
  const faqSchemas = jsonLdScripts.filter(
    (s) => s["@type"] === "FAQPage" || s["@type"] === "HowTo"
  );
  const faqScore = normalizeScore(faqSchemas.length ? 100 : 0, 1.5);

  const headingsWithId = $("h1[id],h2[id],h3[id]").length;
  const headingsTotal = $("h1,h2,h3").length || 1;
  const tocScore = normalizeScore(
    (headingsWithId / headingsTotal) * 100,
    1
  );

  const imgWithFigcaption = $("figure figcaption").length;
  const mediaScore = normalizeScore(imgWithFigcaption ? 100 : 0, 0.5);

  // -------------------
  // G3: Product/Inventory Schema & Feeds (2)
  // -------------------
  const productSchemas = jsonLdScripts.filter((s) =>
    ["Product", "Vehicle", "Offer", "AggregateRating"].includes(s["@type"])
  );
  const productPercent = productSchemas.length > 0 ? 100 : 0; // placeholder
  const productScore = normalizeScore(productPercent, 1.5);
  const productValid = productPercent >= 70;

  const feedScore = 1; // placeholder (0.5 weight)

  // -------------------
  // G4: Crawl Friendliness (1)
  // -------------------
  const robotsScore = 1; // placeholder (assume not blocking)
  const robotsOk = robotsScore === 1;

  // -------------------
  // Totals
  // -------------------
  const totalGScore = parseFloat(
    (
      orgFieldScore +
      napScore +
      policyScore +
      faqScore +
      tocScore +
      mediaScore +
      productScore +
      feedScore +
      robotsScore
    ).toFixed(2)
  );

  // -------------------
  // Badge logic
  // -------------------
  const aioCompatible =
    totalGScore >= 7.5 &&
    orgValid &&
    productValid &&
    robotsOk
      ? "Yes"
      : "No";

  report.G = {
    orgFields: parseFloat(orgFieldScore.toFixed(2)),
    napConsistency: napScore,
    policies: parseFloat(policyScore.toFixed(2)),
    faqJsonLd: parseFloat(faqScore.toFixed(2)),
    sectionAnchors: parseFloat(tocScore.toFixed(2)),
    mediaCaptions: parseFloat(mediaScore.toFixed(2)),
    productSchemas: parseFloat(productScore.toFixed(2)),
    feedAvailability: feedScore,
    crawlFriendliness: robotsScore,
    totalGScore,
    aioCompatibleBadge: aioCompatible,
  };

  return report;
}

function calculateFinalScore(jsonData) {
  // Section totals
  const totalA = jsonData.A.Technical_Performance_Score_Total || 0;
  const totalB = jsonData.B.On_Page_SEO_Score_Total || 0;
  const totalC = jsonData.C.Accessibility_Score_Total || 0;
  const totalD = jsonData.D.Security_or_Compliance_Score_Total || 0;
  const totalE = jsonData.E.UX_and_Content_Structure_Score_Total || 0;
  const totalF = jsonData.F.Conversion_and_Lead_Flow_Score_Total || 0;
  const totalG = jsonData.G.AIO_Readiness_Score_Total || 0;

  const scores = [
  { name: "Technical Performance", score: totalA },
  { name: "On-Page SEO", score: totalB },
  { name: "Accessibility", score: totalC },
  { name: "Security/Compliance", score: totalD },
  { name: "UX & Content", score: totalE },
  { name: "Conversion & Lead Flow", score: totalF },
  { name: "AIO Readiness", score: totalG }
];

  const totalScore = parseFloat(
    (totalA + totalB + totalC + totalD + totalE + totalF + totalG).toFixed(2)
  );

  // Grade
  let grade = "F";
  if (totalScore >= 90) grade = "A";
  else if (totalScore >= 80) grade = "B";
  else if (totalScore >= 70) grade = "C";
  else if (totalScore >= 60) grade = "D";

  // ✅ Top 5 lowest scores (directly from already-prepared scores[])
  const topFixes = [...scores]
  .sort((a, b) => a.score - b.score)  // sort ascending
  .slice(0, 5); 

  return {
    totalScore,
    grade,
    url:jsonData.URL,
    sectionScores: {
      A: totalA,
      B: totalB,
      C: totalC,
      D: totalD,
      E: totalE,
      F: totalF,
      G: totalG
    },
    badge: jsonData.G.AIO_Compatibility_Badge,
    topFixes
  };
}


app.post('/data', async (req, res) => {
  const  message  = req.body;
  console.log(`URL Received: ${message}`);
  console.log(message);

  try {
    const apiUrl =`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${ encodeURIComponent(message)}&strategy=desktop&key=${API_KEY}`;

    const response = await fetch(apiUrl);
    const data = await response.json(); 

  const technicalReport = await technicalMetrics(message,data);
  const seoReport = await seoMetrics(message);
  const accessibilityReport = await accessibilityMetrics(message);
  const securityReport = await securityCompliance(message);
  const uxReport = await uxContentStructure(message);
  const conversionReport = await conversionLeadFlow(message);
  const aioReport = await aioReadiness(message);
  // console.log("Technical Report:", scores)
  // console.log("SEO Report (B1+B2+B3):", seoReport);
  // console.log("Accessibility C Section Report:", accessibilityReport);
  // console.log("Security/Compliance D Section Report:", securityReport);
  // console.log("UX & Content Structure E Section Report:", uxReport);
  // console.log("Conversion & Lead Flow F Section Report:", conversionReport);
  // console.log("AIO G Section Report:", aioReport);

    const jsonData = {
      URL:message[0],
      A:{
        A1:{
          LCP_Score:technicalReport.lcpScore,
          CLS_Score:technicalReport.clsScore,
          INP_Score:technicalReport.inpScore,
          Total_Score_A1:technicalReport.total_A1
        },
        A2:{
          TTFB_Score:technicalReport.ttfbScore,
          Compression_Score:technicalReport.compressionScore,
          Caching_Score:technicalReport.cachingscore,
          HTTP_Score:technicalReport.httpscore,
          Total_Score_A2:technicalReport.total_A2
        },
        A3:{
          Sitemap_Score:technicalReport.sitemapScore,
          Robots_Score:technicalReport.robotsScore,
          Broken_Links_Score:technicalReport.brokenLinksScore,
          Redirect_Chains_Score:technicalReport.redirectChainsScore,
          Total_Score_A3:technicalReport.totalScore_A3
        },
        Technical_Performance_Score_Total:technicalReport.totalScore
      },
      B:{
        B1:{
          Unique_Title_Score:seoReport.B1.title,
          Meta_Description_Score:seoReport.B1.metaDescription,
          Canonocal_Score:seoReport.B1.canonical,
          H1_Score:seoReport.B1.h1,
          Total_Score_B1:seoReport.B1.total
        },
        B2:{
          Image_ALT_Score:seoReport.B2.imageAlt,
          Heading_Hierarchy_Score:seoReport.B2.headingHierarchy,
          Descriptive_Links_Score:seoReport.B2.descriptiveLinks,
          Total_Score_B2:seoReport.B2.total
        },
        B3:{
          IURL_Slugs_Score:seoReport.B3.urlSlugs,
          Duplicate_Content_Score:seoReport.B3.duplicateContent,
          Pagination_Tags_Score:seoReport.B3.pagination,
          Total_Score_B3:seoReport.B3.total
        },
        On_Page_SEO_Score_Total:seoReport.B1.total + seoReport.B2.total + seoReport.B3.total
      },
      C:{
        Color_Contrast_Score:accessibilityReport.C.colorContrast,
        Focusable_Score:accessibilityReport.C.keyboardNavigation,
        ARIA_Score:accessibilityReport.C.ariaLabeling,
        Alt_or_Text_Equivalents_Score:accessibilityReport.C.altTextEquivalents,
        Skip_Links_or_Landmarks_Score:accessibilityReport.C.skipLinksLandmarks,
        Accessibility_Score_Total:accessibilityReport.C.totalCScore
      },
      D:{
        HTTPS_Score:securityReport.D.httpsMixedContent,
        HSTS_Score:securityReport.D.hsts,
        Security_Headers_Score:securityReport.D.securityHeaders,
        Cookie_Banner_and_Consent_Mode_Score:securityReport.D.cookieConsent,
        Error_Pages_Score:securityReport.D.errorPages,
        Security_or_Compliance_Score_Total:securityReport.D.totalDScore
      },
      E:{
        Mobile_Friendliness_Score:uxReport.E.mobileFriendliness,
        Navigation_Depth_Score:uxReport.E.navigationDepth,
        Layout_Shift_On_interactions_Score:uxReport.E.layoutShift,
        Readability_Score:uxReport.E.readability,
        Intrusive_Interstitials_Score:uxReport.E.intrusiveInterstitials,
        UX_and_Content_Structure_Score_Total:uxReport.E.totalEScore
      },
      F:{
        Primary_CTAs_Score:conversionReport.F.primaryCTA,
        Forms_Score:conversionReport.F.forms,
        Thank_You_or_Success_State_Score:conversionReport.F.thankYouState,
        Tracking_Of_Form_Submits_or_Events_Score:conversionReport.F.tracking,
        Contact_Info_Score:conversionReport.F.contactInfo,
        Load_On_CRM_or_Webhook_Score:conversionReport.F.crmWebhook,
        Conversion_and_Lead_Flow_Score_Total:conversionReport.F.totalFScore
      },
      G:{
        G1:{
          Organization_JSON_LD_Score:aioReport.G.orgFields,
          Consistent_NAP_Score:aioReport.G.napConsistency,
          Humans_or_Policies_Score:aioReport.G.policies,
          Total_Score_G1:aioReport.G.orgFields + aioReport.G.napConsistency + aioReport.G.policies
        },
        G2:{
          FAQ_or_How_To_JSON_LD_Score:aioReport.G.faqJsonLd,
          Section_Anchors_or_TOC_Score:aioReport.G.sectionAnchors,
          Descriptive_Media_Captions_or_Figcaptions_Score:aioReport.G.mediaCaptions,
          Total_Score_G2: aioReport.G.faqJsonLd + aioReport.G.sectionAnchors + aioReport.G.mediaCaptions
        },
        G3:{
          Correct_Schema_Types_Score:aioReport.G.productSchemas,
          Feed_Availability_Score:aioReport.G.feedAvailability,
          Total_Score_G3: aioReport.G.productSchemas + aioReport.G.feedAvailability
        },
        G4:{
          Robots_Allowlist_Score: aioReport.G.feedAvailability,
          Total_Score_G3: aioReport.G.crawlFriendliness
        },
        AIO_Readiness_Score_Total: aioReport.G.totalGScore,
        AIO_Compatibility_Badge: aioReport.G.aioCompatibleBadge
      }
    }
  const result = calculateFinalScore(jsonData);
  res.json({jsonData,result});
  console.log(jsonData);
  console.log(result);
    
  } catch (error) {
    console.error("Error fetching PageSpeed data:", error);
    res.status(500).json({ success: false, error: "Failed to fetch PageSpeed data" });
  }
});


app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
