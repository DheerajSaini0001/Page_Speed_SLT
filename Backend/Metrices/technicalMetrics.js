import axios from "axios";

export default async function technicalMetrics(url,data,$,robotsText) {
  let totalScore_A3 = 0;

  let sitemapScore = 0;
  const sitemapMatch = robotsText.match(/Sitemap:\s*(.*)/i);
  if (sitemapMatch) {
    const sitemapUrl = sitemapMatch[1].trim();
    try {
      const sitemapRes = await axios.get(sitemapUrl);
      sitemapScore = sitemapRes.status === 200 ? 1 : 0;
    } catch {
      sitemapScore = 0; 
    }
  }

let robotsScore = 0;
try {
  if (robotsText && typeof robotsText === "string") {
    const hasGlobalDisallow = /Disallow:\s*\/\s*$/mi.test(robotsText);
    robotsScore = !hasGlobalDisallow ? 1 : 0;
  } else {
    
    robotsScore = 0; 
  }
} catch {
  robotsScore = 0; 
}


totalScore_A3 += sitemapScore ;
totalScore_A3 += robotsScore;

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


  if (brokenPercent === 0) {
    brokenScore = 1;             
  } else {
    brokenScore = 0;           
  }

} catch {
  brokenScore = 0;               
}


totalScore_A3 += brokenScore ;

let redirectScore = 0;
try {
  const res = await axios.get(url, { maxRedirects: 10, validateStatus: null });
  const hops = res.request?._redirectable?._redirectCount || 0;


  const percent = hops;

  if (percent === 0) {
    redirectScore = 1;                        
  }else {
    redirectScore = 0;                        
  }

} catch {
  redirectScore = 0;
}


totalScore_A3 += redirectScore ;


  // const audits = data?.lighthouseResult?.audits;
  // console.log(audits);
  

const lcpRaw = data?.lighthouseResult?.audits?.["largest-contentful-paint"]?.numericValue; // in ms
const clsRaw = data?.lighthouseResult?.audits?.["cumulative-layout-shift"]?.numericValue; // unitless
const inpRaw = data?.lighthouseResult?.audits?.["interactive"]?.numericValue; // in ms

const lcpScore = lcpRaw !== undefined ? (lcpRaw <= 2500 ? 1 : 0) : 1;
const clsScore = clsRaw !== undefined ? (clsRaw <= 0.1 ? 1 : 0) : 1;
const inpScore = inpRaw !== undefined ? (inpRaw <= 3800 ? 1 : 0) : 1;

  const total_A1 = (lcpScore + clsScore + inpScore)

const ttfbRaw = data?.lighthouseResult?.audits?.["server-response-time"]?.numericValue; // in ms
const compressionRaw = data?.lighthouseResult?.audits?.["uses-text-compression"]?.numericValue; // usually 1 if enabled
const cachingRaw = data?.lighthouseResult?.audits?.["uses-long-cache-ttl"]?.numericValue; // usually 1 if enabled
const httpsRaw = data?.lighthouseResult?.audits?.["uses-http2"]?.numericValue; // usually 1 if enabled

const ttfbScore = ttfbRaw !== undefined ? (ttfbRaw <= 200 ? 1 : 0) : 1; // TTFB good if <= 200ms
const compressionScore = compressionRaw !== undefined ? (compressionRaw === 1 ? 1 : 0) : 1; // Compression enabled
const cachingScore = cachingRaw !== undefined ? (cachingRaw === 1 ? 1 : 0) : 1; // Caching enabled
const httpsScore = httpsRaw !== undefined ? (httpsRaw === 1 ? 1 : 0) : 1; // HTTP/2 enabled

  const total_A2 = ttfbScore + compressionScore + cachingScore + httpsScore

  const total = ((total_A1 + total_A2 + totalScore_A3)/11)*100
  // const colorContrastScore = audits["color-contrast"]?.score
  // const ariaRolesScore = audits["aria-roles"]?.score
  // const labelsScore = audits["label"]?.score


  return {
    lcpScore:lcpScore,
    clsScore:clsScore,
    inpScore:inpScore,
    total_A1:total_A1,
    ttfbScore:ttfbScore,
    compressionScore:compressionScore,
    cachingscore:cachingScore,
    httpscore:httpsScore,
    total_A2:total_A2,
    sitemapScore: sitemapScore,
    robotsScore: robotsScore,
    brokenLinksScore: brokenScore,
    redirectChainsScore: redirectScore,
    totalScore_A3: totalScore_A3,
    totalScore: parseFloat((total.toFixed(0)))
  };
}