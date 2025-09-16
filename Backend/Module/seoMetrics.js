
function extractText($) {
  return $("body").text().replace(/\s+/g, " ").trim();
}

function getShingles(text, size = 5) {
  const words = text.toLowerCase().split(/\s+/);
  const shingles = [];
  for (let i = 0; i <= words.length - size; i++) {
    shingles.push(words.slice(i, i + size).join(" "));
  }
  return new Set(shingles);
}

function jaccardSimilarity(setA, setB) {
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

function computeDuplicatePercent(currentHtml, otherPagesHtml) {
  const currentShingles = getShingles(currentHtml);
  let maxSim = 0;

  for (const html of otherPagesHtml) {
    const otherShingles = getShingles(html);
    const sim = jaccardSimilarity(currentShingles, otherShingles);
    if (sim > maxSim) maxSim = sim;
  }

  return maxSim * 100; // % duplicate
}

function calcDupScore(dupPercent) {
  if (dupPercent === 0) return 3; // fully unique
  if (dupPercent > 0 && dupPercent <= 5) {
    // Linear decay: at 0% → 3, at 5% → 0
    return parseFloat(((1 - dupPercent / 5) * 3).toFixed(2));
  }
  return 0; // beyond 5% = no score
}


function normalizeUrl(url) {
  try {
    const u = new URL(url);
    // remove www. for comparison
    let hostname = u.hostname.toLowerCase();
    if (hostname.startsWith("www.")) hostname = hostname.slice(4);
    // remove trailing slash from pathname
    const path = u.pathname.replace(/\/$/, "");
    return hostname + path;
  } catch {
    return null;
  }
}

function isValidCanonical(canonical, pageUrl) {
  const c = normalizeUrl(canonical);
  const p = normalizeUrl(pageUrl);
  console.log(canonical,c,p);
  
  return c && p && c === p;
}

export default async function seoMetrics(url, $, otherPages = [], duplicateTitles = new Set(), duplicateMeta = new Set()) {

 // --- B1: Essentials ---
const title = $("title").text().trim();
const titleScore =
  title && title.length <= 60 && !duplicateTitles.has(title) ? 3 : 0; // weight 3

const metaDesc = $('meta[name="description"]').attr("content") || "";
const metaScore =
  metaDesc && metaDesc.length <= 160 && !duplicateMeta.has(metaDesc) ? 2 : 0; // weight 2

const canonical = $('link[rel="canonical"]').attr("href") || "";
const canonicalScore = isValidCanonical(canonical, url) ? 2 : 0; // weight 2

const h1Count = $("h1").length;
const h1Text = $("h1").first().text().trim();
const h1Score =
  h1Count === 1 && h1Text.length > 0 ? 3 : 0; // weight 3

const B1 = {
  title: titleScore,
  metaDescription: metaScore,
  canonical: canonicalScore,
  h1: h1Score,
  total: titleScore + metaScore + canonicalScore + h1Score, // max 10
};

// --- B2: Media & Semantics ---
// Get all <img> elements in the page
const images = $("img").toArray();

// Count only meaningful ALT attributes
const meaningfulAlts = images.filter((img) => {
  const alt = $(img).attr("alt")?.trim().toLowerCase() || "";
  const meaningless = ["", "image", "logo", "icon"];
  return !meaningless.includes(alt);
});

// Calculate partial score
const totalImages = images.length;
const imageAltScore = totalImages > 0 
  ? parseFloat(((meaningfulAlts.length / totalImages) * 3).toFixed(2))
  : 0;

// Heading hierarchy check: H1 → H2 → H3 in logical order
const headings = $("h1,h2,h3").map((i, el) => el.tagName.toLowerCase()).get();

let hierarchyScore = 0;

// Only award score if there is at least one heading AND order is correct
if (headings.length > 0) {
  let broken = false;
  for (let i = 0; i < headings.length - 1; i++) {
    // H3 before H1 is a break in hierarchy
    if (headings[i] === "h3" && headings[i + 1] === "h1") {
      broken = true;
      break;
    }
  }
  if (!broken) {
    hierarchyScore = 2;
  }
}


// Descriptive links (avoid "click here", "read more")
const links = $("a").toArray();
const goodLinks = links.filter(
  (a) => !["click here", "read more"].includes($(a).text().toLowerCase().trim())
);
const linkScore = ((goodLinks.length / (links.length || 1)) * 1).toFixed(2); // weight 1

const B2 = {
  imageAlt: parseFloat(imageAltScore),
  headingHierarchy: hierarchyScore,
  descriptiveLinks: parseFloat(linkScore),
  total: parseFloat(imageAltScore) + hierarchyScore + parseFloat(linkScore), // max 6
};

  // --- B3: Structure & Uniqueness ---
let urlSlugScore = 2; // default full points
try {
  const slug = new URL(url).pathname.slice(1);
  if (slug && (!/^([a-z0-9]+(-[a-z0-9]+)*)$/.test(slug) || slug.length > 75)) {
    urlSlugScore = 0; // only fail if slug exists and is invalid
  }
} catch {
  urlSlugScore = 0;
}

const pageText = extractText($);

// Pass in other pages’ raw HTML text array
const duplicatePercent = computeDuplicatePercent(pageText, otherPages);

// Apply rubric scoring
const dupScore = calcDupScore(duplicatePercent);

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