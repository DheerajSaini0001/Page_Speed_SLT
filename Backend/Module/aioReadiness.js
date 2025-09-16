import axios from "axios";
import { load } from "cheerio"; // ✅ FIXED import
import PQueue from "p-queue";

// -------------------
// Helper: Normalize Score
// -------------------
const normalizeScore = (passRate, weight) => (passRate / 100) * weight;

// -------------------
// Helper: Normalize NAP
// -------------------
function normalizePhone(phone) {
  return phone ? phone.replace(/[\s\-\(\)]/g, "").replace(/^(\+?91|0)/, "") : "";
}

function normalizeEmail(email) {
  return email ? email.trim().toLowerCase() : "";
}

function normalizeAddress(addr) {
  return addr ? addr.trim().toLowerCase() : "";
}

function isConsistent(values, normalizer) {
  if (values.length < 2) return false;
  const normValues = values.map(normalizer).filter(Boolean);
  return new Set(normValues).size === 1 && normValues.length >= 2;
}

// -------------------
// Main Function
// -------------------
export default async function aioReadiness(html, robotsText) {
  const $ = load(html); // ✅ FIXED usage
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

    const bestPercent = Math.max(
      ...orgSchemas.map((schema) => {
        const presentFields = fields.reduce(
          (acc, f) => acc + (schema[f] ? 1 : 0),
          0
        );
        return (presentFields / fields.length) * 100;
      })
    );

    orgFieldScore = normalizeScore(bestPercent, 2);
    orgValid = bestPercent >= 60;
  }

  // -------------------
  // Consistent NAP
  // -------------------
  const headerText = $("header").text() || "";
  const footerText = $("footer").text() || "";
  const bodyText = $("body").text() || "";

  const phoneRegex = /\+?\d[\d\s\-()]{7,}/;
  const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
  const addressRegex = /(street|st\.|road|rd\.|avenue|ave\.|blvd|building)/i;

  const phones = [headerText, footerText, bodyText]
    .map((t) => t.match(phoneRegex))
    .filter(Boolean)
    .map((m) => m[0]);

  const emails = [headerText, footerText, bodyText]
    .map((t) => t.match(emailRegex))
    .filter(Boolean)
    .map((m) => m[0]);

  const addresses = [headerText, footerText, bodyText]
    .map((t) => t.match(addressRegex))
    .filter(Boolean)
    .map((m) => m[0]);

  let consistencyCount = 0;
  if (isConsistent(phones, normalizePhone)) consistencyCount++;
  if (isConsistent(emails, normalizeEmail)) consistencyCount++;
  if (isConsistent(addresses, normalizeAddress)) consistencyCount++;

  const napScore = normalizeScore((consistencyCount / 3) * 100, 1);

  // -------------------
  // Humans/Policies
  // -------------------
  const basePolicies = ["About", "Contact", "Privacy", "Terms"];
  const ecommercePolicies = ["Returns", "Shipping"];
  const policies = [...basePolicies, ...ecommercePolicies];

  const bodyLower = bodyText.toLowerCase();
  const policyPresent = policies.filter((p) =>
    bodyLower.includes(p.toLowerCase())
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

  let productPercent = 0;
  let productValid = false;

  if (productSchemas.length > 0) {
    productPercent = 100;
    // Require at least a name + price/offer for validity
    productValid = productSchemas.some(
      (s) => s.name && (s.offers || s.price)
    );
  }

  const productScore = normalizeScore(productPercent, 1.5);

  const hasFeed =
    $('link[type="application/rss+xml"], link[type="application/atom+xml"], link[type="application/json"]').length >
    0;
  const feedScore = hasFeed ? 0.5 : 0;

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
    // assume OK if missing
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
    totalGScore >= 7.5 && orgValid && productValid && robotsOk
      ? "Yes"
      : "No";

  report.G = {
    orgFields: parseFloat(orgFieldScore.toFixed(2)),
    napConsistency: parseFloat(napScore.toFixed(2)),
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
