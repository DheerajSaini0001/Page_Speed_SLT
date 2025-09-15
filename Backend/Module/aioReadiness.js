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

export default async function aioReadiness($,robotsText) {
  const report = {};

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

  // ✅ count fields in the best available org schema
  const bestPercent = Math.max(
    ...orgSchemas.map((schema) => {
      const presentFields = fields.reduce(
        (acc, f) => acc + (schema[f] ? 1 : 0),
        0
      );
      return (presentFields / fields.length) * 100;
    })
  );

  // ✅ weighted score (max = 2)
  orgFieldScore = normalizeScore(bestPercent, 2);

  // ✅ more lenient validity threshold (60% instead of 80%)
  orgValid = bestPercent >= 60;
}
  // Consistent NAP
// Extract different sections
const headerText = $("header").text() || "";
const footerText = $("footer").text() || "";
const bodyText = $("body").text() || "";

// Patterns
const phoneRegex = /\+?\d[\d\s\-]{7,}/;
const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const addressRegex = /(street|st\.|road|rd\.|avenue|ave\.|blvd|building)/i;

// Match values
const phones = [headerText.match(phoneRegex), footerText.match(phoneRegex), bodyText.match(phoneRegex)].filter(Boolean).map(m => m[0]);
const emails = [headerText.match(emailRegex), footerText.match(emailRegex), bodyText.match(emailRegex)].filter(Boolean).map(m => m[0]);
const addresses = [headerText.match(addressRegex), footerText.match(addressRegex), bodyText.match(addressRegex)].filter(Boolean).map(m => m[0]);

// Helper: check if value appears in at least 2 sections
function isConsistent(values) {
  return new Set(values).size === 1 && values.length >= 2; 
}

// Consistency count
let consistencyCount = 0;
if (isConsistent(phones)) consistencyCount++;
if (isConsistent(emails)) consistencyCount++;
if (isConsistent(addresses)) consistencyCount++;

// Score scaled with weight = 1
const napScore = normalizeScore((consistencyCount / 3) * 100, 1);

  // Humans/Policies

// Base policies for all sites
const basePolicies = ["About", "Contact", "Privacy", "Terms"];

// E-commerce policies (only if site is selling products)
const ecommercePolicies = ["Returns", "Shipping"];

// Combine policies (you could add a check like: if ($("body").text().match(/cart|checkout|product/i)) ...)
const policies = [...basePolicies, ...ecommercePolicies];

// Count matches
const policyPresent = policies.filter((p) => bodyText.includes(p)).length;

// Normalize (weight = 1)
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

const hasFeed = $('link[type="application/rss+xml"], link[type="application/atom+xml"], link[type="application/json"]').length > 0;
const feedScore = hasFeed ? 0.5 : 0; // weight 0.5

  // -------------------
  // G4: Crawl Friendliness (1)
  // -------------------
let robotsScore = 1;
let robotsOk = true;
try {
  if (/Disallow:\s*\/\s*$/i.test(robotsText)) {
    robotsScore = 0;
    robotsOk = false;
  }
} catch {
  // if robots.txt missing, assume OK
}

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