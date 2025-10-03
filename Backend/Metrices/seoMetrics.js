import axios from "axios";

function extractText($) {
  return $("body").text().replace(/\s+/g, " ").trim();
}


const checkHTTPS = (url) => {
  try {
    const parsedUrl = new URL(url);
    // Check if protocol is https
    return parsedUrl.protocol === 'https:' ? 1 : 0;
  } catch (error) {
    // Invalid URL
    return 0;
  }
};

const imagePresence=($)=>{
  const images = $("img").toArray();
  return images.length > 0 ? 1 : 0 ;
}
//Image havind alt
const imageAltScore = ($) => {
  const images = $("img").toArray();
  const imagesWithAlt = images.filter((img) => {
    const alt = $(img).attr("alt");
    return alt !== undefined && alt.trim() !== "";
  });

  const percentage = (imagesWithAlt.length / images.length) * 100;
  return percentage > 75 ? 1 : 0;
};

//Image have meaningfull Alt tag
const meaningfulAltScore = ($) => {
  const images = $("img").toArray();
  if (images.length === 0) return 0;

  const meaningfulAlts = images.filter((img) => {
    const alt = $(img).attr("alt")?.trim().toLowerCase() || "";
    const meaningless = ["", "image", "logo", "icon", "pic", "picture", "photo", " ", "12345", "-", "graphics"];
    return !meaningless.includes(alt);
  });

  const percentage = (meaningfulAlts.length / images.length) * 100;
  return percentage > 75 ? 1 : 0;
};

//checkig the image compression size point out of 1
const checkImagesSize = async ($) => {
  const images = $("img").toArray();

  if (images.length === 0) return 0; // No images

  let totalScore = 0;

  for (const img of images) {
    const src = $(img).attr("src");
    if (!src) continue;

    try {
      // Fetch the image as arraybuffer to get size
      const res = await axios.get(src, { responseType: "arraybuffer" });
      const sizeInKB = res.data.byteLength / 1024;

      // Score 1 if < 200KB else 0
      totalScore += sizeInKB < 200 ? 1 : 0;
    } catch (err) {
      // If image fails to load, consider score 0
      totalScore += 0;
    }
  }

  // Average % of images under 200KB
  const averageScore = (totalScore / images.length) * 100;

  return averageScore.toFixed(2); // e.g., "75.00"
};

const checkVideoExistance = ($) => {
  const videos = $("video, iframe[src*='youtube'], iframe[src*='vimeo']").toArray();
  return videos.length == 0 ? 0 : 1; 
};

//Proper Embedding of video point out of 1
const checkVideoEmbedding = ($) => {
  const videos = $("video, iframe[src*='youtube'], iframe[src*='vimeo']").toArray();
  return videos.length > 0 ? 1 : 0; // 1 = properly embedded, 0 = none
};

//Lazy loadinng of video point out of 1
const checkLazyLoading = ($) => {
  const videos = $("video, iframe").toArray();
  if (videos.length === 0) return 1;

  const lazyLoaded = videos.filter((el) => $(el).attr("loading") === "lazy").length;
  return lazyLoaded / videos.length >= 0.5 ? 1 : 0; 
  // score 1 if ≥50% of videos are lazy loaded
};

// structured matadat of videos point out of 1
const checkStructuredMetadata = ($) => {
  const scripts = $("script[type='application/ld+json']").toArray();
  if (scripts.length === 0) return 1;
  for (const script of scripts) {
    try {
      const data = JSON.parse($(script).html());
      if (Array.isArray(data)) {
        if (data.some((d) => d["@type"] === "VideoObject")) return 1;
      } else if (data["@type"] === "VideoObject") return 1;
    } catch (err) {
      continue;
    }
  }
  return 0;
};

  //Check heading herirchy order point out of 1
  const checkHierarchy = (headings) => {
    let lastLevel = 0;
    for (const h of headings) {
      const currentLevel = parseInt(h.tag[1]); // h1 -> 1, h2 -> 2
      if (lastLevel && currentLevel > lastLevel + 1) {
        return 0; // hierarchy broken
      }
      lastLevel = currentLevel;
    }
    return 1; // hierarchy okay
  };

  // Check for multiple h1 tags point out of 1

  //  check if keyboard is included point out of 1
  const keywords=["Canonical","Result","Audits"]

  const checkKeywordsInHeadings = (headings, keywords = []) => {
    if (keywords.length === 0) return 1; // no keywords specified
    const matched = headings.some(h => 
      keywords.some(kw => h.text.toLowerCase().includes(kw.toLowerCase()))
    );
    return matched ? 1 : 0;
  };

//Check for alt are discriptive
const altTextSEOScore =  ($, keywords = []) => {
  try {
    const images = $("img").toArray();
    const totalImages = images.length;
    if (totalImages === 0) return 0;

    const goodAlts = images.filter(img => {
      const alt = $(img).attr("alt")?.trim().toLowerCase() || "";

      // Skip meaningless or generic alt text
      const meaningless = [
        "", "image", "logo", "icon", "pic", "picture", "photo", " ",
        "12345", "-", "graphics"
      ];
      if (meaningless.includes(alt)) return false;

      // Check if alt contains any keyword (if provided)
      if (keywords.length > 0) {
        return keywords.some(kw => alt.includes(kw.toLowerCase()));
      }

      return true; // descriptive even without keyword
    });

    const percentage = (goodAlts.length / totalImages) * 100;
    return percentage.toFixed(2);
  } catch (err) {
    console.error("Error fetching page:", err.message);
    return 0;
  }
};

// Dicripitive Link
const checkInternalLinks = async ($, url, links) => {
  try {
    const domain = new URL(url).hostname;

    // Filter internal links
    const internalLinks = links.filter(link => {
      const href = $(link).attr("href");
      if (!href) return false; // Skip links without href
      try {
        const linkUrl = new URL(href, url); // Resolve relative URLs
        return linkUrl.hostname === domain;
      } catch {
        return false;
      }
    });

    if (internalLinks.length === 0) return { totalInternal: 0, descriptiveScore: 0 };

    // Check descriptive anchor text
    const genericAnchors = ["click here", "read more", "learn more", "details", "link", "more", "go", "this"];
    const descriptiveLinks = internalLinks.filter(link => {
      const text = $(link).text().trim().toLowerCase();
      return text.length > 0 && !genericAnchors.includes(text);
    });

    // Score: 1 if >75% internal links have descriptive text
    const descriptiveScore = (descriptiveLinks.length / internalLinks.length) * 100 > 75 ? 1 : 0;

    return { totalInternal: internalLinks.length, descriptiveScore };
  } catch (err) {
    console.error("Error checking internal links:", err);
    return { totalInternal: 0, descriptiveScore: 0 };
  }
};

// check for Semantic HTML Tags
const checkSemanticTags = async ($) => {
  try {
    const tags = ["article", "section", "header", "footer"];
    const result = {};

    tags.forEach(tag => {
      result[tag] = $(tag).length > 0 ? 1 : 0; // 1 if tag exists, else 0
    });

    return result;
  } catch (err) {
    console.error("Error checking semantic tags:", err);
    return { article: 0, section: 0, header: 0, footer: 0 };
  }
};

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
    const score = duplicationPercent <=75  ? 1 : 0;
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

//Check URL Structure
function checkURLStructure(url) {
  try {
    const { pathname } = new URL(url);

    // Rule 1: Short and readable (less than 5 segments)
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 5) return 0;

    // Rule 2: Only contains lowercase letters, numbers, and hyphens
    const validChars = segments.every(seg => /^[a-z0-9-]+$/.test(seg));
    if (!validChars) return 0;

    // Rule 3: No underscores, spaces, or other separators
    const noUnderscore = segments.every(seg => !seg.includes('_'));
    if (!noUnderscore) return 0;

    // Rule 4: Reasonably short segments (less than 30 chars each)
    const shortSegments = segments.every(seg => seg.length <= 30);
    if (!shortSegments) return 0;

    return 1; // All rules passed
  } catch (err) {
    return 0; // Invalid URL
  }
}

function getSlug(url) {
  try {
    const pathname = new URL(url).pathname; // get path
    const parts = pathname.split('/').filter(Boolean); // remove empty parts
    return parts.length ? parts[parts.length - 1] : null; // last part is slug
  } catch (err) {
    return null; // invalid URL
  }
}
function slugCheck(url) {
  try {
    const pathname = new URL(url).pathname; // get path
    const parts = pathname.split('/').filter(Boolean); // remove empty parts
    return parts.length > 0 ? 1 : 0; // last part is slug
  } catch (err) {
    return null; // invalid URL
  }
}
function slugValid(slug){
  if (slug.length > 25) return 0;       // length check
  const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/; // pattern check
  return regex.test(slug) ? 1 : 0;

}
// Check Pagination
function checkPagination($) {
  try {
    // Look for common pagination patterns
    const pagination = $(
      "a[rel='next'], a[rel='prev'], .pagination, .pager, .page-numbers"
    );

    // Also check anchor text manually (case-insensitive)
    const textBased = $("a").filter((i, el) => {
      const txt = $(el).text().toLowerCase();
      return txt.includes("next") || txt.includes("previous");
    });

    return (pagination.length + textBased.length) > 0 ? 0 : 1;
  } catch (err) {
    console.error("Error:", err.message);
    return 0;
  }
}


export default async function seoMetrics(url, $,robotsText) {
const titleExistanceScore = $("title") ? 1 : 0;
const title = $("title").text().trim() || "";
const titleLength = title.length;
const titleScore = titleLength >= 30 && titleLength <= 60 ? 1 : 0 ; 
console.log("Title:", title);
console.log("Title Existance Score:", titleExistanceScore);
console.log("Title Length:", titleLength);
console.log("Title Score:", titleScore);

const metaDescExistanceScore = $('meta[name="description"]') ? 1 : 0;
const metaDesc = $('meta[name="description"]').attr("content") || "";
const metaDescLength = metaDesc.length
const metaDescScore = metaDescLength <= 165 ? 1 : 0 
console.log("Meta Description Existance Score:", metaDescExistanceScore);
console.log("Meta Description:", metaDesc);
console.log("Meta Description Length:", metaDescLength);
console.log("Meta Description Score:", metaDescScore);

const URLStructureSrcore=checkURLStructure(url);
console.log("URL Structure Score:", URLStructureSrcore);


const canonicalExistanceScore = $('link[rel="canonical"]') ? 1 : 0 ;
const canonical = $('link[rel="canonical"]').attr("href") || "";
const canonicalScore = isValidCanonical(canonical, url) ? 1 : 0; 
console.log("Canonical Existance Score:", canonicalExistanceScore);
console.log("Canonical:", canonical);
console.log("Canonical Self Refe Score:", canonicalScore);


const h1Count = $("h1").length;
const h2Count = $("h2").length;
const h3Count = $("h3").length;
const h4Count = $("h4").length;
const h5Count = $("h5").length;
const h6Count = $("h6").length;
const h1CountScore = h1Count === 0 ? 0 : h1Count=== 1 ? 1 : 0 ;
const h1Score = h1Count === 0 ? 0 : h1Count=== 1 ? 1 : 2 ;
console.log("H1 Count:", h1Count);
console.log("H1 Score:", h1Score);


const imagePresenceScore=imagePresence($);
console.log("imagePresence Score",imagePresenceScore)
let  altPresence;


let altMeaningfullPercentage;


let compressionScore = await checkImagesSize($); // make sure this returns a % value
let imageCompressionScore ;

if(imagePresenceScore==0){
  altPresence=1
  altMeaningfullPercentage=1
  imageCompressionScore=1
  console.log("image is absent",altPresence,altMeaningfullPercentage,imageCompressionScore);
  

}
else{
  altPresence= imageAltScore($) < 75 ? 1 : 0;
  altMeaningfullPercentage= meaningfulAltScore($) < 75 ? 1 : 0;
  imageCompressionScore =compressionScore > 75 ? 1 : 0;
  console.log("image present",altPresence,altMeaningfullPercentage,imageCompressionScore);
  
}


let  embedding
let lazyLoading
let structuredMetadata
let videoExistanceScore=checkVideoExistance($)
console.log("Video Existence Score:", videoExistanceScore);
if(videoExistanceScore==0){

  embedding=1;
  lazyLoading=1;
  structuredMetadata=1;

  console.log("Video Embedding:", embedding);
  console.log("Lazy Loading of Videos:", lazyLoading);
  console.log("Structured Metadata for Videos:", structuredMetadata);
}
else{

  
  embedding= checkVideoEmbedding($)
  console.log("Video Embedding:", embedding);
  
  lazyLoading= checkLazyLoading($)
  console.log("Lazy Loading of Videos:", lazyLoading);
  
  structuredMetadata= checkStructuredMetadata($)
  console.log("Structured Metadata for Videos:", structuredMetadata);
}


//Extracting all headings
const headings = $("h1, h2, h3, h4, h5, h6")
  .map((i, el) => ({
    tag: el.tagName.toLowerCase(),
    text: $(el).text().trim()
  }))
  .get();




  let hierarchy;
if(h1Count==0 && h2Count==0 && h3Count==0 && h4Count==0 && h5Count==0 &&h6Count==0){
hierarchy=1
console.log("hiere not found",hierarchy);

  }
else{

  hierarchy= checkHierarchy(headings)
  console.log("Heading Hierarchy Score:", hierarchy);
}
  
const alttextScore=altTextSEOScore($,keywords)?1:0
console.log("ALT text Score",alttextScore);


const links = $("a").toArray();
const internal_and_discripitive_Link=checkInternalLinks($,url,links);
console.log("Internal & Descriptive Link Audit:", internal_and_discripitive_Link);



const semanticTagScore=checkSemanticTags($);
console.log("Semantic Tag Audit:", semanticTagScore);

const pageText = extractText($);
const dupScore = simpleDuplicateCheck(pageText);
console.log("dupScore",dupScore);

const slug=getSlug(url);
let slugCheckScore=slugCheck(url);
let slugScore;
if(slugCheckScore==0){
  slugScore=1;
  }
else{
  slugScore=slugValid(slug)
}

const checkHTTPSScore=checkHTTPS(url);
console.log("slug Presence Score ",slugCheckScore);
console.log("slugScore ",slugScore);

const paginationScore =checkPagination($)
console.log("paginationScore",paginationScore);

const internalLinksScore = (await internal_and_discripitive_Link).descriptiveScore;
const articleScore=(await semanticTagScore ).article;
const sectionScore=(await semanticTagScore ).section
const headerScore=(await semanticTagScore ).header
const footerScore=(await semanticTagScore ).footer

console.log("titleExistanceScore:", titleExistanceScore);
console.log("titleScore:", titleScore);
console.log("metaDescExistanceScore:", metaDescExistanceScore);
console.log("metaDescScore:", metaDescScore);
console.log("URLStructureSrcore:", URLStructureSrcore);
console.log("canonicalExistanceScore:", canonicalExistanceScore);
console.log("canonicalScore:", canonicalScore);
console.log("h1Score:", h1Score);
console.log("altPresence:", altPresence);
console.log("altMeaningfullPercentage:", altMeaningfullPercentage);
console.log("imageCompressionScore:", imageCompressionScore);
console.log("embedding:", embedding);
console.log("lazyLoading:", lazyLoading);
console.log("structuredMetadata:", structuredMetadata);
console.log("hierarchy:", hierarchy);
console.log("alttextScore:", alttextScore);
console.log("internalLinksScore:", internalLinksScore);
console.log(semanticTagScore);

console.log("semanticTagScore.article:", articleScore);
console.log("semanticTagScore.section:", sectionScore);
console.log("semanticTagScore.header:", headerScore);
console.log("semanticTagScore.footer:", footerScore);
console.log("dupScore:", dupScore);
console.log("slugScore:", slugScore);
console.log("paginationScore:", paginationScore);


const ActualScore=(paginationScore+titleExistanceScore+metaDescExistanceScore+internalLinksScore+canonicalExistanceScore+canonicalScore+alttextScore+checkHTTPSScore)/8*100

const totalScore = (
  titleExistanceScore + titleScore + metaDescExistanceScore + metaDescScore +
  URLStructureSrcore + canonicalExistanceScore + canonicalScore + h1Score +
  altPresence + altMeaningfullPercentage + imageCompressionScore + embedding +
  lazyLoading + structuredMetadata + hierarchy + alttextScore +
  internalLinksScore + 
  // articleScore +sectionScore+headerScore+footerScore+
  dupScore + slugScore + paginationScore
) / 20 * 100;

console.log("Actual ",ActualScore);


console.log("Total Seo",totalScore);



}