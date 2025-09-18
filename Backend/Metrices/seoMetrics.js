
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

  return maxSim * 100; 
}

function calcDupScore(dupPercent) {
  if (dupPercent === 0) return 3; 
  if (dupPercent > 0 && dupPercent <= 5) {
    return parseFloat(((1 - dupPercent / 5) * 3).toFixed(2));
  }
  return 0; 
}


function normalizeUrl(url) {
  try {
    const u = new URL(url);
    let hostname = u.hostname.toLowerCase();
    if (hostname.startsWith("www.")) hostname = hostname.slice(4);
    const path = u.pathname.replace(/\/$/, "");
    return hostname + path;
  } catch {
    return null;
  }
}

function isValidCanonical(canonical, pageUrl) {
  const c = normalizeUrl(canonical);
  const p = normalizeUrl(pageUrl);
  return c && p && c === p;
}

export default async function seoMetrics(url, $, otherPages = [], duplicateTitles = new Set(), duplicateMeta = new Set()) {


const title = $("title").text().trim();
const titleScore =
  title && title.length <= 60 && !duplicateTitles.has(title) ? 3 : 0; 

const metaDesc = $('meta[name="description"]').attr("content") || "";
const metaScore =
  metaDesc && metaDesc.length <= 160 && !duplicateMeta.has(metaDesc) ? 2 : 0; 

const canonical = $('link[rel="canonical"]').attr("href") || "";
const canonicalScore = isValidCanonical(canonical, url) ? 2 : 0; 

const h1Count = $("h1").length;
const h1Text = $("h1").first().text().trim();
const h1Score =
  h1Count === 1 && h1Text.length > 0 ? 3 : 0; 

const B1 = {
  title: parseFloat(titleScore.toFixed(2)),
  metaDescription: parseFloat(metaScore.toFixed(2)),
  canonical: parseFloat(canonicalScore.toFixed(2)),
  h1: parseFloat(h1Score.toFixed(2)),
  total: parseFloat((titleScore + metaScore + canonicalScore + h1Score).toFixed(2)),
};


const images = $("img").toArray();


const meaningfulAlts = images.filter((img) => {
  const alt = $(img).attr("alt")?.trim().toLowerCase() || "";
  const meaningless = ["", "image", "logo", "icon"];
  return !meaningless.includes(alt);
});


const totalImages = images.length;
const imageAltScore = totalImages > 0 
  ? parseFloat(((meaningfulAlts.length / totalImages) * 3).toFixed(2))
  : 0;


const headings = $("h1,h2,h3").map((i, el) => el.tagName.toLowerCase()).get();

let hierarchyScore = 0;


if (headings.length > 0) {
  let broken = false;
  for (let i = 0; i < headings.length - 1; i++) {
    if (headings[i] === "h3" && headings[i + 1] === "h1") {
      broken = true;
      break;
    }
  }
  if (!broken) {
    hierarchyScore = 2;
  }
}



const links = $("a").toArray();
const goodLinks = links.filter(
  (a) => !["click here", "read more"].includes($(a).text().toLowerCase().trim())
);
const linkScore = ((goodLinks.length / (links.length || 1)) * 1); 

const B2 = {
  imageAlt: parseFloat(imageAltScore.toFixed(2)),
  headingHierarchy: parseFloat(hierarchyScore.toFixed(2)),
  descriptiveLinks: parseFloat(linkScore.toFixed(2)),
  total: parseFloat((imageAltScore + hierarchyScore + linkScore).toFixed(2)),
};


let urlSlugScore = 2; 
try {
  const slug = new URL(url).pathname.slice(1);
  if (slug && (!/^([a-z0-9]+(-[a-z0-9]+)*)$/.test(slug) || slug.length > 75)) {
    urlSlugScore = 0; 
  }
} catch {
  urlSlugScore = 0;
}

const pageText = extractText($);


const duplicatePercent = computeDuplicatePercent(pageText, otherPages);


const dupScore = calcDupScore(duplicatePercent);

  const paginationScore = $("link[rel='next'], link[rel='prev']").length ? 1 : 0; 

  const B3 = {
    urlSlugs: parseFloat(urlSlugScore.toFixed(2)),
    duplicateContent: parseFloat(dupScore.toFixed(2)),
    pagination: parseFloat(paginationScore.toFixed(2)),
    total: parseFloat((urlSlugScore + dupScore + paginationScore).toFixed(2)),
  };

  const totalSEO = parseFloat((B1.total + B2.total + B3.total.toFixed(2)));

  return {
    B1,
    B2,
    B3,
    totalSEO,
  };
}