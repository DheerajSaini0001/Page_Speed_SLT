// import puppeteer from "puppeteer";

function coreWebVitalsScore(value, threshold) {
  return value <= threshold ? 1 : 0;
}

export default async function technicalMetrics(url,data,puppeteerData) {

  // Technical Performance (Core Web Vitals)
  const lcpValue = parseFloat((data?.lighthouseResult?.audits?.["largest-contentful-paint"]?.numericValue || 0).toFixed(0)); 
  const lcpScore = coreWebVitalsScore(lcpValue,2500);
  
  const fidValue = parseFloat((data.lighthouseResult.audits['max-potential-fid'].numericValue || 0).toFixed(0)); 
  const fidScore = coreWebVitalsScore(fidValue,100);
  
  const clsValue = parseFloat((data?.lighthouseResult?.audits?.["cumulative-layout-shift"]?.numericValue || 0).toFixed(1)); 
  const clsScore = coreWebVitalsScore(clsValue,0.1);
  
  const fcpValue = parseFloat((data.lighthouseResult.audits['first-contentful-paint'].numericValue || 0).toFixed(0));
  const fcpScore = coreWebVitalsScore(fcpValue,1800);

  const ttfbValue = parseFloat((data?.lighthouseResult?.audits?.["server-response-time"]?.numericValue || 0).toFixed(0)); 
  const ttfbScore = coreWebVitalsScore(ttfbValue,200);

  const tbtValue = parseFloat((data?.lighthouseResult?.audits?.["total-blocking-time"]?.numericValue || 0).toFixed(0));
  const tbtScore = coreWebVitalsScore(tbtValue,300);
  
  const siValue = parseFloat((data?.lighthouseResult?.audits?.["speed-index"]?.numericValue || 0).toFixed(0));
  const siScore = coreWebVitalsScore(siValue,3000);

  const inpValue = parseFloat((data?.lighthouseResult?.audits?.["interactive"]?.numericValue || 0).toFixed(0)); 
  const inpScore = coreWebVitalsScore(inpValue,3800);

  const coreWebVitalsTotal = lcpScore + fidScore + clsScore + ttfbScore + tbtScore + siScore + fcpScore + inpScore
  
  const coreWebVitals ={
    lcpValue,lcpScore,
    fidValue,fidScore,
    clsValue,clsScore,
    fcpValue,fcpScore,
    ttfbValue,ttfbScore,
    tbtValue,tbtScore,
    siValue,siScore,
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
  // const browser = await puppeteer.launch({headless: true,args: ["--no-sandbox", "--disable-setuid-sandbox"]});
  // const page = await browser.newPage();
  // if(device == 'Desktop'){
  // await page.setUserAgent(
  //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  //     "(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
  //   );
  // await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });
  // }
  // else{
  //     await page.setUserAgent(
  //   "Mozilla/5.0 (Linux; Android 10; Mobile) " +
  //   "AppleWebKit/537.36 (KHTML, like Gecko) " +
  //   "Chrome/140.0.0.0 Mobile Safari/537.36"
  // );
  // await page.setViewport({
  //   width: 414,
  //   height: 896,
  //   isMobile: true,
  //   hasTouch: true,
  //   deviceScaleFactor: 2
  // });
  // }

  // const response = await page.goto(url, { waitUntil: "networkidle2",timeout: 240000 });
  const {browser,page,response} = puppeteerData
  const chain = response.request().redirectChain();
  const hops = chain.length; 
  const redirectScore = hops <= 1 ? 1 : 0;

  const structuredDataScore = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    .map(el => {
        try { return JSON.parse(el.innerText); } catch { return null; }
      })
      .filter(Boolean)
    return scripts.length > 0 ? 1 : 0;
  });

  const links = await page.$$eval("a[href]", (anchors) =>
    anchors
      .map((a) => a.href)
      .filter((l) => l && l.startsWith("http"))
  );

  let brokenCount = 0;
  await Promise.all(
    links.map(async (link) => {
      try {
        const status = await page.evaluate(async (l) => {
          try {
            const res = await fetch(l, { method: "HEAD" });
            return res.status;
          } catch {
            return 0;
          }
        }, link);

        if (status === 0 || status >= 400) brokenCount++;
      } catch {
        brokenCount++;
      }
    })
  );

  const totalLinks = links.length || 1;
  const brokenPercent = parseFloat(((brokenCount / totalLinks) * 100).toFixed(0));
  const brokenScore = brokenPercent === 0 ? 1 : 0;
  
  let sitemapScore = 0;
  try {
  const sitemapUrl = new URL("/sitemap.xml", url).href;
  const sitemapPage = await browser.newPage();
  const response = await sitemapPage.goto(sitemapUrl);
  sitemapScore = response.status() === 200 ? 1 : 0;
  }
  catch {
  sitemapScore = 0; 
  }

  let robotsScore = 0;
  try {
  const robotsUrl = new URL("/robots.txt", url).href;
  const robotsPage = await browser.newPage();;
  const response = await robotsPage.goto(robotsUrl);
  robotsScore = response.status() === 200 ? 1 : 0;
  }
  catch {
  robotsScore = 0; 
  }
  
  const crawlabilityAndHygieneTotal = sitemapScore + robotsScore + structuredDataScore + brokenScore + redirectScore
  
  const crawlabilityAndHygiene = {
    sitemapScore,
    robotsScore,
    structuredDataScore,
    brokenPercent,brokenScore,
    hops,redirectScore,
    crawlabilityAndHygieneTotal
  }
  
  const Total = parseFloat((((coreWebVitalsTotal + deliveryAndRenderTotal + crawlabilityAndHygieneTotal)/18)*100).toFixed(0))

  // Improvements
  const improvements = [];

// Technical Performance (Core Web Vitals)
if (lcpScore === 0) improvements.push({
  metric: "Largest Contentful Paint (LCP)",
  current: lcpValue + "ms",
  recommended: "< 2500ms",
  severity: "Critical 🔴",
  suggestion: "Optimize hero images, defer non-critical CSS, and improve server response for faster page loading."
});

if (fidScore === 0) improvements.push({
  metric: "First Input Delay (FID)",
  current: fidValue + "ms",
  recommended: "< 100ms",
  severity: "High 🟠",
  suggestion: "Reduce JavaScript execution time and break up long tasks to improve interactivity."
});

if (clsScore === 0) improvements.push({
  metric: "Cumulative Layout Shift (CLS)",
  current: clsValue,
  recommended: "< 0.1",
  severity: "High 🟠",
  suggestion: "Set size attributes for images, videos, and ads to prevent layout shifts."
});

if (fcpScore === 0) improvements.push({
  metric: "First Contentful Paint (FCP)",
  current: fcpValue + "ms",
  recommended: "< 1800ms",
  severity: "Medium 🟡",
  suggestion: "Prioritize above-the-fold content and optimize critical rendering paths."
});

if (ttfbScore === 0) improvements.push({
  metric: "Time To First Byte (TTFB)",
  current: ttfbValue + "ms",
  recommended: "< 200ms",
  severity: "Critical 🔴",
  suggestion: "Use a CDN, optimize server performance, or enable caching to reduce server response time."
});

if (tbtScore === 0) improvements.push({
  metric: "Total Blocking Time (TBT)",
  current: tbtValue + "ms",
  recommended: "< 300ms",
  severity: "High 🟠",
  suggestion: "Split heavy JS tasks, defer non-essential scripts to unblock main thread."
});

if (siScore === 0) improvements.push({
  metric: "Speed Index (SI)",
  current: siValue + "ms",
  recommended: "< 3000ms",
  severity: "Medium 🟡",
  suggestion: "Improve above-the-fold content loading for faster perceived speed."
});

if (inpScore === 0) improvements.push({
  metric: "Time to Interactive (TTI)",
  current: inpValue + "ms",
  recommended: "< 3800ms",
  severity: "High 🟠",
  suggestion: "Reduce main-thread work and optimize JS execution for faster interactivity."
});

// Technical Performance (Delivery & Render)
if (compressionScore === 0) improvements.push({
  metric: "Text Compression",
  current: "Disabled",
  recommended: "Enabled (gzip/brotli)",
  severity: "Medium 🟡",
  suggestion: "Enable text compression to reduce payload size and speed up page load."
});

if (cachingScore === 0) improvements.push({
  metric: "Caching",
  current: cachingValue + "s",
  recommended: "≥ 7 days",
  severity: "Medium 🟡",
  suggestion: "Set long cache TTL for static resources to improve repeat visit speed."
});

if (resourceOptimizationScore === 0) improvements.push({
  metric: "Resource Optimization",
  current: "Not fully optimized",
  recommended: "Images optimized, CSS/JS minified, offscreen images deferred",
  severity: "High 🟠",
  suggestion: "Compress images, minify CSS/JS, and lazy-load offscreen images to improve load times."
});

if (renderBlockingScore === 0) improvements.push({
  metric: "Render-Blocking Resources",
  current: "Present",
  recommended: "None",
  severity: "High 🟠",
  suggestion: "Defer or async non-critical CSS/JS to improve first render speed."
});

if (httpsScore === 0) improvements.push({
  metric: "HTTP/2 Protocol",
  current: "Not enabled",
  recommended: "Enabled",
  severity: "Medium 🟡",
  suggestion: "Enable HTTP/2 to allow multiplexing and faster delivery of resources."
});

// Technical Performance (Crawlability & Hygiene)
if (sitemapScore === 0) improvements.push({
  metric: "Sitemap",
  current: "Missing",
  recommended: "Available",
  severity: "Medium 🟡",
  suggestion: "Add sitemap.xml and submit it to search engines for better indexing."
});

if (robotsScore === 0) improvements.push({
  metric: "Robots.txt",
  current: "Missing",
  recommended: "Available",
  severity: "Medium 🟡",
  suggestion: "Ensure robots.txt exists and allows proper crawling."
});

if (structuredDataScore === 0) improvements.push({
  metric: "Structured Data",
  current: "Not present",
  recommended: "JSON-LD structured data present",
  severity: "Low 🟢",
  suggestion: "Add structured data to improve search results display."
});

if (brokenScore === 0) improvements.push({
  metric: "Broken Links",
  current: `${brokenPercent}% broken`,
  recommended: "0%",
  severity: "High 🟠",
  suggestion: "Fix all broken links to improve user experience and SEO."
});

if (redirectScore === 0) improvements.push({
  metric: "Redirect Chains",
  current: `${hops} hops`,
  recommended: "≤ 1 hop",
  severity: "Medium 🟡",
  suggestion: "Reduce redirect chains to speed up page load and improve crawlability."
});

  console.log(coreWebVitals);
  console.log(deliveryAndRender);
  console.log(crawlabilityAndHygiene);
  console.log(Total);
  console.log(improvements);
  
  return {
    coreWebVitals,
    deliveryAndRender,
    crawlabilityAndHygiene,
    Total,
    improvements
  };
}