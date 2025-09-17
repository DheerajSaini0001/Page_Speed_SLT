import axios from "axios";
import * as cheerio from "cheerio";

const normalizeScore = (passRate, weight) => (passRate / 100) * weight;

export default async function aioReadiness(url,robotsText) {
  const report = {};

  const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
      }
    });
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
}

  // Consistent NAP
const headerText = $("header").text() || "";
const footerText = $("footer").text() || "";
const bodyText = $("body").text() || "";

// Patterns
const phoneRegex = /\+?\d[\d\s\-]{7,}/g;
const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const addressRegex = /(street|st\.|road|rd\.|avenue|ave\.|blvd|building)/gi;

// Helper: normalize values
function normalizePhone(phone) {
  return phone.replace(/\D/g, ""); // remove non-digit characters
}
function normalizeEmail(email) {
  return email.toLowerCase();
}
function normalizeAddress(addr) {
  return addr.toLowerCase().replace(/\s+/g, " ").trim();
}

// Match all values
function matchAll(text, regex) {
  return (text.match(regex) || []).map(m => m.trim());
}

const phones = [
  ...matchAll(headerText, phoneRegex),
  ...matchAll(footerText, phoneRegex),
  ...matchAll(bodyText, phoneRegex)
];

const emails = [
  ...matchAll(headerText, emailRegex),
  ...matchAll(footerText, emailRegex),
  ...matchAll(bodyText, emailRegex)
];

const addresses = [
  ...matchAll(headerText, addressRegex),
  ...matchAll(footerText, addressRegex),
  ...matchAll(bodyText, addressRegex)
];
// Check consistency: appears in at least 2 sections after normalization
function isConsistent(values, type) {
  if (values.length < 2) return false;

  let normalized;
  if (type === "phone") normalized = values.map(normalizePhone);
  else if (type === "email") normalized = values.map(normalizeEmail);
  else if (type === "address") normalized = values.map(normalizeAddress);
  else normalized = values;

  // Count each unique value
  const counts = {};
  normalized.forEach(v => counts[v] = (counts[v] || 0) + 1);

  // Consistent if any normalized value appears at least twice
  return Object.values(counts).some(c => c >= 2);
}

// Consistency count
let consistencyCount = 0;
if (isConsistent(phones, "phone")) consistencyCount++;
if (isConsistent(emails, "email")) consistencyCount++;
if (isConsistent(addresses, "address")) consistencyCount++;

const napScore = (consistencyCount / 3)


  // Humans/Policies

// Base policies for all sites
const basePolicies = ["About", "Contact", "Privacy", "Terms"];

// E-commerce policies (only if site is selling products)
const ecommercePolicies = ["Returns", "Shipping"];

  // Detect if site is e-commerce
  const isEcommerce = /cart|checkout|product/i.test(bodyText);

 // Combine policies based on type of site
  const policies = isEcommerce ? [...basePolicies, ...ecommercePolicies] : [...basePolicies];

 // Count policies present (case-insensitive)
  const policyPresent = policies.filter(p =>
    bodyText.toLowerCase().includes(p.toLowerCase())
  ).length;

// Normalize (weight = 1)
const policyScore = (policyPresent / policies.length)


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
    napConsistency: parseFloat(napScore.toFixed(2)),
    policies: parseFloat(policyScore.toFixed(2)),
    totalG1: parseFloat((orgFieldScore + napScore + policyScore).toFixed(2)),
    faqJsonLd: parseFloat(faqScore.toFixed(2)),
    sectionAnchors: parseFloat(tocScore.toFixed(2)),
    mediaCaptions: parseFloat(mediaScore.toFixed(2)),
    totalG2: parseFloat((faqScore + tocScore + mediaScore).toFixed(2)),
    productSchemas: parseFloat(productScore.toFixed(2)),
    feedAvailability: parseFloat(feedScore.toFixed(2)),
    totalG3: parseFloat((productScore + feedScore).toFixed(2)),
    crawlFriendliness: parseFloat(robotsScore.toFixed(2)),
    totalGScore,
    aioCompatibleBadge: aioCompatible,
  };

  return report;
}