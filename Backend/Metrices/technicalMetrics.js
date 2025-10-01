// import puppeteer from "../Tools/puppeteers.js";
import puppeteer from "puppeteer";

function coreWebVitalsScore(value, threshold) {
  return value <= threshold ? 1 : 0;
}

export default async function technicalMetrics(url,data,$,puppeteer_Data,robotsText) {

  // Technical Performance (Core Web Vitals)
  const lcpValue = parseFloat((data?.lighthouseResult?.audits?.["largest-contentful-paint"]?.numericValue || 0).toFixed(0)); 
  const lcpScore = coreWebVitalsScore(lcpValue,2500);
  
  const fidValue = data.lighthouseResult.audits['max-potential-fid'].numericValue || 0; 
  const fidScore = coreWebVitalsScore(fidValue,100);
  
  const clsValue = parseFloat((data?.lighthouseResult?.audits?.["cumulative-layout-shift"]?.numericValue || 0).toFixed(1)); 
  const clsScore = coreWebVitalsScore(clsValue,0.1);
  
  const fcpValue = parseFloat((data.lighthouseResult.audits['first-contentful-paint'].numericValue || 0).toFixed(0));
  const fcpScore = coreWebVitalsScore(fcpValue,1800);

  const ttfbValue = data?.lighthouseResult?.audits?.["server-response-time"]?.numericValue || 0; 
  const ttfbScore = coreWebVitalsScore(ttfbValue,200);

  const tbtValue = parseFloat((data?.lighthouseResult?.audits?.["total-blocking-time"]?.numericValue || 0).toFixed(0));
  const tbtScore = coreWebVitalsScore(tbtValue,300);
  
  const siValue = parseFloat((data?.lighthouseResult?.audits?.["speed-index"]?.numericValue || 0).toFixed(0));
  const siScore = coreWebVitalsScore(siValue,3000);

  const inpValue = parseFloat((data?.lighthouseResult?.audits?.["interactive"]?.numericValue || 0).toFixed(0)); 
  const inpScore = inpValue <= 3800 ? 1 : 0;


  const coreWebVitalsTotal = lcpScore + fidScore + clsScore + ttfbScore + tbtScore + siScore + fcpScore + inpScore
  
  const coreWebVitals ={
    lcpValue,lcpScore,
    fidValue,fidScore,
    clsValue,clsScore,
    ttfbValue,ttfbScore,
    tbtValue,tbtScore,
    siValue,siScore,
    fcpValue,fcpScore,
    inpValue,inpScore,
    coreWebVitalsTotal
  }
  
  // Technical Performance (Delivery & Render)
  const compressionValue = data?.lighthouseResult?.audits?.["uses-text-compression"]?.numericValue || 0; 
  const compressionScore = compressionValue === 1 ? 1 : 0; 
  
  const cachingValue = parseFloat((data?.lighthouseResult?.audits?.["uses-long-cache-ttl"]?.numericValue || 0).toFixed(0));
  const cachingScore = cachingValue >= 604800 ? 1 : 0; 

  const imagesOptimized = data?.lighthouseResult?.audits?.["uses-optimized-images"]?.score || 0;
  const offscreenImages = data?.lighthouseResult?.audits?.["offscreen-images"]?.score || 0;
  const cssJsMinified = Math.min( data?.lighthouseResult?.audits?.["unminified-css"]?.score || 1, data?.lighthouseResult?.audits?.["unminified-javascript"]?.score || 1);
  const resourceOptimizationScore = (imagesOptimized === 1 && offscreenImages === 1 && cssJsMinified === 1) ? 1 : 0;
  
  const renderBlockingValue = data?.lighthouseResult?.audits?.["render-blocking-resources"]?.score || 0;
  const renderBlockingScore = renderBlockingValue === 1 ? 1 : 0;

  const httpsValue = data?.lighthouseResult?.audits?.["uses-http2"]?.numericValue || 0;
  const httpsScore = httpsValue === 1 ? 1 : 0;

  const deliveryAndRenderTotal = compressionScore + cachingScore + httpsScore + renderBlockingScore + resourceOptimizationScore;

  const deliveryAndRender = {
    compressionValue,compressionScore,
    cachingValue,cachingScore,
    resourceOptimizationScore,
    renderBlockingValue,renderBlockingScore,
    httpsScore,httpsValue,
    deliveryAndRenderTotal
  }

  // Technical Performance (Crawlability & Hygiene)
  const browser = await puppeteer.launch({headless: true,args: ["--no-sandbox", "--disable-setuid-sandbox"]});
  const page = await browser.newPage();
  await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
    );
    await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });

    await page.goto(url, { waitUntil: "networkidle2",timeout: 240000 });

  const structuredDataScore = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    .map(el => {
        try { return JSON.parse(el.innerText); } catch { return null; }
      })
      .filter(Boolean)
    return scripts.length > 0 ? 1 : 0;
  });
  
  let sitemapScore = 0;
  const sitemapMatch = robotsText.match(/Sitemap:\s*(.*)/i);
  if (sitemapMatch) {
    const sitemapUrl = sitemapMatch[1].trim();
    try {
      const sitemappage = await browser.newPage();
      const response = await sitemappage.goto(sitemapUrl);
      sitemapScore = response.status === 200 ? 1 : 0;
    } catch {
      sitemapScore = 0; 
    }
  }

let robotsScore = 0;
try {
  const robotsUrl = new URL("/robots.txt", url).href;
  const robotsPage = await browser.newPage();
  const response = await robotsPage.goto(robotsUrl, { waitUntil: "networkidle2",timeout:240000 });
  const responseStatus = response.status();
  sitemapScore = responseStatus === 200 ? 1 : 0;
}
catch {
  robotsScore = 0; 
}

  
  // let brokenScore = 0;
  // try {
  //   const links = await page.$$eval("a[href]", els => els.map(el => el.href).filter(h => h.startsWith("http")));
  //   let brokenCount = 0;

  //   for (const link of links) {
  //     try {
  //       const page = await browser.newPage();
  //       const resp = await page.goto(link, { waitUntil: "domcontentloaded" });
  //       if (!resp || resp.status() >= 400) brokenCount++;
  //     } catch {
  //       brokenCount++;
  //     }
  //   }

  //   brokenScore = brokenCount === 0 ? 1 : 0;
  // } catch {
  //   brokenScore = 0;
  // }
  
  // let redirectScore = 0;
  // try {
  //   const resp = await page.goto(url, { waitUntil: "domcontentloaded" });
  //   redirectScore = resp.request().redirectChain().length === 0 ? 1 : 0;
  // } catch {
  //   redirectScore = 0;
  // }
  
  browser.close()
  
  const crawlabilityAndHygieneTotal = sitemapScore + robotsScore + structuredDataScore 
  
  const crawlabilityAndHygiene = {
    sitemapScore,
    robotsScore,
    structuredDataScore,
    // brokenScore,
    // redirectScore,
    crawlabilityAndHygieneTotal
  }
  
  
  const Total = parseFloat((((coreWebVitalsTotal + deliveryAndRenderTotal + crawlabilityAndHygieneTotal)/18)*100).toFixed(0))
  
  console.log(coreWebVitals);
  console.log(deliveryAndRender);
  console.log(crawlabilityAndHygiene);
  console.log(Total);
  
  return {
    coreWebVitals,
    deliveryAndRender,
    crawlabilityAndHygiene,
    Total
  };
}