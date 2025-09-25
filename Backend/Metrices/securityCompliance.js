import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());


async function getAllHeaders(page) {
  const headers = {};
  page.on("response", async (response) => {
    const h = response.headers();
    Object.keys(h).forEach((k) => {
      headers[k.toLowerCase()] = h[k];
    });
  });
  return headers;
}


async function checkHTTPS(page) {
  const url = page.url();
  const isHTTPS = url.startsWith("https://") ? 1 : 0;

  // const mixedContent = await page.evaluate(() => {
  //   const elements = Array.from(document.querySelectorAll("img, script, link, iframe"));
  //   return elements.some(el => {
  //     const src = el.src || el.href;
  //     return src && src.startsWith("http://");
  //   });
  // });

  //  && !mixedContent
  return isHTTPS ? 1 : 0;
}


function checkHSTS(headers) {
  const hsts = headers["strict-transport-security"];
  if (!hsts) return 0;
  return hsts.includes("preload") ? 0: 1;

}


function checkSecurityHeaders(headers) {
  const groups = [
    ["content-security-policy"],
    ["x-content-type-options"],
    ["referrer-policy"],
    ["x-frame-options", "cross-origin-opener-policy"],
  ];

  let present = 0;

  for (const group of groups) {
    if (group.some(h => headers[h])) {
      present++;
    }
  }
  const result =  (present / groups.length) * 100; 
  return result > 75 ? 1 : 0
}



async function checkCookieBanner(page) {
  try {
    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        const keywords = [
          "cookie", "consent", "privacy", "policy", "accept", "gdpr", "tracking"
        ];

        const checkText = () => {
          const elements = Array.from(document.querySelectorAll("div, section, dialog, aside, footer, iframe, [role='dialog'], [class*='cookie'], [id*='cookie'], [class*='consent'], [id*='consent']"));
          const combinedText = elements.map(el => el.innerText.toLowerCase()).join(" ");
          return keywords.some(k => combinedText.includes(k));
        };

        if (checkText()) return resolve(1);

        const observer = new MutationObserver(() => {
          if (checkText()) {
            observer.disconnect();
            resolve(1);
          }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        setTimeout(() => {
          observer.disconnect();
          resolve(0);
        }, 240000);
      });
    });

    return result ? 1 : 0;
  } catch (e) {
    return 0;
  }
}


async function checkCustomErrorPage(page, url) {
  try {
    const fakeUrl = url.replace(/\/$/, "") + "/nonexistent-" + Date.now();
    await page.goto(fakeUrl, { waitUntil: "networkidle2" });

    if (page.url() !== fakeUrl) return 1;

    const text = await page.evaluate(() => document.body.innerText.toLowerCase());
    if (text.includes("404") || text.includes("error") || text.includes("not found")) return 1;

    return 0;
  } catch {
    return 0;
  }
}


export default async function securityCompliance(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  await page.setExtraHTTPHeaders({ "Accept-Language": "en-GB,en;q=0.9" });
  await page.setGeolocation({ latitude: 48.8566, longitude: 2.3522 });
  await page.setViewport({ width: 1200, height: 800 });

  const allHeaders = await getAllHeaders(page);

  await page.goto(url, { waitUntil: "networkidle2",timeout: 240000});

  const [
    httpsScore,
    hstsScore,
    headersScore,
    cookieBannerScore,
    errorPageScore,
  ] = await Promise.all([
    checkHTTPS(page),
    checkHSTS(allHeaders),
    checkSecurityHeaders(allHeaders),
    checkCookieBanner(page),
    checkCustomErrorPage(page, url),
  ]);

  await browser.close();

  const totalDScore = ((httpsScore + hstsScore  + headersScore + cookieBannerScore+ errorPageScore)/5)*100;

  return {
    D: {
      httpsMixedContent: httpsScore,
      hsts: hstsScore,
      securityHeaders: headersScore,
      cookieConsent: cookieBannerScore,
      errorPages: errorPageScore,
      totalDScore:parseFloat(totalDScore.toFixed(1)),
    },
  };
}
