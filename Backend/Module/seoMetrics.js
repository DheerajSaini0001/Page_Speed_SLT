import crypto from "crypto";

function hashContent(content) {
  return crypto.createHash("md5").update(content).digest("hex");
}

export default async function seoMetrics(url,htmlData,$) {

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

  const contentHash = hashContent(htmlData);
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