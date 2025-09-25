
function extractText($) {
  return $("body").text().replace(/\s+/g, " ").trim();
}

// function getShingles(text, size = 5) {
//   const words = text.toLowerCase().split(/\s+/);
//   const shingles = [];
//   for (let i = 0; i <= words.length - size; i++) {
//     shingles.push(words.slice(i, i + size).join(" "));
//   }
//   return new Set(shingles);
// }

// function jaccardSimilarity(setA, setB) {
//   const intersection = new Set([...setA].filter(x => setB.has(x)));
//   const union = new Set([...setA, ...setB]);
//   return intersection.size / union.size;
// }

// function computeDuplicatePercent(currentHtml, otherPagesHtml) {
//   const currentShingles = getShingles(currentHtml);
//   let maxSim = 0;

//   for (const html of otherPagesHtml) {
//     const otherShingles = getShingles(html);
//     const sim = jaccardSimilarity(currentShingles, otherShingles);
//     if (sim > maxSim) maxSim = sim;
//   }

//   return maxSim * 100; 
// }

// function calcDupScore(dupPercent) {
//   if (dupPercent === 0) return 3; 
//   if (dupPercent > 0 && dupPercent <= 5) {
//     return parseFloat(((1 - dupPercent / 5) * 3).toFixed(2));
//   }
//   return 0; 
// }

function simpleDuplicateCheck(text) {
    const words = text.split(/\s+/);
    const wordCounts = {};
    let duplicates = 0;

    words.forEach(word => {
        word = word.toLowerCase(); 
        if (wordCounts[word]) {
            duplicates++;
        } else {
            wordCounts[word] = 1;
        }
    });

    const duplicationPercent = (duplicates / words.length) * 100;
    const score = duplicationPercent <= 5 ? 1 : 0;
    return score;
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

export default async function seoMetrics(url, $) {

const title = $("title").text().trim() || "";
const titleLength = title.length;
const titleScore = titleLength >= 30 && titleLength <= 60 ? 1 : 0 ; 

const metaDesc = $('meta[name="description"]').attr("content") || "";
const metaDescLength = metaDesc.length
const metaDescScore = metaDescLength <= 160 ? 1 : 0 

const canonical = $('link[rel="canonical"]').attr("href") || "";
const canonicalScore = isValidCanonical(canonical, url) ? 1 : 0; 

const h1Count = $("h1").length;
const h1Score = h1Count === 1 ? 1 : 0 ;

// const contentText = $("p").map((i, el) => $(el).text().trim()).get().join(" ").toLowerCase();
// const h1Text = $("h1").first().text().trim();
// const keywords = h1Text.toLowerCase().split(/\s+/);
// const matchCount = keywords.filter((word) => contentText.includes(word)).length;
// const descriptiveScore = (matchCount / keywords.length) ? 1 : 0;
// const h1OverallScore = h1Score + descriptiveScore

const B1 = {
  title: title,
  titleLength: titleLength,
  titleScore: titleScore,
  metaDescription: metaDesc,
  metaDescLength: metaDescLength,
  metaDescScore: metaDescScore,
  canonical: canonical,
  canonicalScore: canonicalScore,
  h1Count:h1Count,
  h1Score:h1Score,
  total: (titleScore + metaDescScore + canonicalScore + h1Score),
};


const images = $("img").toArray();
const meaningfulAlts = images.filter((img) => {
  const alt = $(img).attr("alt")?.trim().toLowerCase() || "";
  const meaningless = ["", "image", "logo", "icon","pic","picture","photo"," ","12345","-","graphics"];
  return !meaningless.includes(alt);
});
const imageAltScore = meaningfulAlts ? 1 : 0;

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
    hierarchyScore = 1;
  }
}

const links = $("a").toArray();
const goodLinks = links.filter(
  (a) => !["click here", "read more","learn more","details","link","more","go","this"].includes($(a).text().toLowerCase().trim())
);
const linkScore = goodLinks ? 1 : 0; 

const B2 = {
  imageAltScore: imageAltScore,
  hierarchyScore: hierarchyScore,
  linkScore: linkScore,
  total: (imageAltScore + hierarchyScore + linkScore),
};


let urlSlugScore = 0; 
const slug = new URL(url).pathname.slice(1);
const slugLength = slug.length 
if(!slug){
  urlSlugScore = 1
}
else if(slug && (!/^([a-z0-9]+(-[a-z0-9]+)*)$/.test(slug) && slugLength > 75)) {
    urlSlugScore = 2; 
}
else{
    urlSlugScore = 3;
} 

const pageText = extractText($);
// const duplicatePercent = computeDuplicatePercent(pageText, otherPages);
// const dupScore = calcDupScore(duplicatePercent);
const dupScore = simpleDuplicateCheck(pageText);

const paginationScore = $("link[rel='next'], link[rel='prev']").length ? 1 : 0; 

  const B3 = {
    slug:slug,
    urlSlugScore: urlSlugScore,
    slugLength:slugLength,
    duplicateContent: dupScore,
    paginationScore: paginationScore,
    total: (urlSlugScore + dupScore + paginationScore),
  };

  const totalSEO = ((B1.total + B2.total + B3.total)/10)*100;

  return {
    B1,
    B2,
    B3,
    totalSEO,
  };
}