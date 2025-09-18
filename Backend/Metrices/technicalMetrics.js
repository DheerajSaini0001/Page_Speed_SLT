import axios from "axios";

export default async function technicalMetrics(url,data,$,robotsText) {
  let totalScore_A3 = 0;

  let sitemapScore = 0;
try {
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


totalScore_A3 += sitemapScore * 2;
totalScore_A3 += robotsScore * 2;

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
  } else if (brokenPercent > 0 && brokenPercent <= 2) {
    brokenScore = 1 - (brokenPercent / 2) * 0.5;  
  } else {
    brokenScore = 0;           
  }

} catch {
  brokenScore = 0;               
}


totalScore_A3 += brokenScore * 2;

let redirectScore = 0;
try {
  const res = await axios.get(url, { maxRedirects: 10, validateStatus: null });
  const hops = res.request?._redirectable?._redirectCount || 0;


  const percent = hops;

  if (percent === 0) {
    redirectScore = 1;                        
  } else if (percent > 0 && percent <= 5) {
    redirectScore = 1 - percent / 5;           
  } else {
    redirectScore = 0;                        
  }

} catch {
  redirectScore = 0;
}


totalScore_A3 += redirectScore * 2;


  // const audits = data?.lighthouseResult?.audits;

  const lcpScore = (data?.lighthouseResult?.audits?.["largest-contentful-paint"]?.score || 1)*5
  const clsScore =  (data?.lighthouseResult?.audits?.["cumulative-layout-shift"]?.score || 1)*3
  const inpScore = (data?.lighthouseResult?.audits?.["interactive"]?.score|| 1)*4
  const total_A1 = parseFloat(lcpScore + clsScore + inpScore)
  const ttfbScore = (data?.lighthouseResult?.audits?.["server-response-time"]?.score || 1)*3
  const compressionScore = (data?.lighthouseResult?.audits?.["uses-text-compression"]?.score || 1)*2
  const cachingscore = (data?.lighthouseResult?.audits?.["uses-long-cache-ttl"]?.score || 1)*2
  const httpscore = (data?.lighthouseResult?.audits?.["uses-http2"]?.score || 1 )*1
  const total_A2 = ttfbScore + compressionScore + cachingscore + httpscore

  const total = parseFloat(((total_A1 + total_A2 + totalScore_A3).toFixed(2)))
  // const colorContrastScore = audits["color-contrast"]?.score
  // const ariaRolesScore = audits["aria-roles"]?.score
  // const labelsScore = audits["label"]?.score


  return {
    lcpScore:parseFloat(lcpScore.toFixed(2)),
    clsScore:parseFloat(clsScore.toFixed(2)),
    inpScore:parseFloat(inpScore.toFixed(2)),
    total_A1:parseFloat(total_A1.toFixed(2)),
    ttfbScore:parseFloat(ttfbScore.toFixed(2)),
    compressionScore:parseFloat(compressionScore.toFixed(2)),
    cachingscore:parseFloat(cachingscore.toFixed(2)),
    httpscore:parseFloat(httpscore.toFixed(2)),
    total_A2:parseFloat(total_A2.toFixed(2)),
    sitemapScore: parseFloat((sitemapScore.toFixed(2))*2),
    robotsScore: parseFloat((robotsScore.toFixed(2))*2),
    brokenLinksScore: parseFloat((brokenScore.toFixed(2))*2),
    redirectChainsScore: parseFloat((redirectScore.toFixed(2))*2),
    totalScore_A3: parseFloat((totalScore_A3.toFixed(2))),
    totalScore: total
  };
}