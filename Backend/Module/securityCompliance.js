import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

// Simple wait function compatible with all Puppeteer versions
async function wait(ms = 5000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Collect headers from all network responses
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

// HTTPS & Mixed Content (weight 2)
async function checkHTTPS(page) {
  const url = page.url();
  const isHTTPS = url.startsWith("https://") ? 1 : 0;

  const mixedContent = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll("img, script, link, iframe"));
    return elements.some(el => {
      const src = el.src || el.href;
      return src && src.startsWith("http://");
    });
  });

  return isHTTPS && !mixedContent ? 1 : 0;
}

// HSTS (weight 1)
async function checkHSTS(headers) {
  const hsts = headers["strict-transport-security"];
  if (!hsts) return 0;
  if (hsts.includes("preload")) return 1;
  return 0.5;
}

// Security Headers (weight 3)
async function checkSecurityHeaders(headers) {
  // Required sets (X-Frame-Options OR COOP counts as one slot)
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

  return (present / groups.length) * 3; // weight 3
}


// Cookie Banner & Consent (weight 1)
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

        // wait longer (10s) for dynamically loaded banners
        setTimeout(() => {
          observer.disconnect();
          resolve(0);
        }, 10000);
      });
    });

    return result;
  } catch (e) {
    return 0;
  }
}


// Custom Error Pages (weight 1)
async function checkCustomErrorPage(page, url) {
  try {
    const fakeUrl = url.replace(/\/$/, "") + "/nonexistent-" + Date.now();
    await page.goto(fakeUrl, { waitUntil: "networkidle2" });

    // SPA redirect detected
    if (page.url() !== fakeUrl) return 1;

    const text = await page.evaluate(() => document.body.innerText.toLowerCase());
    if (text.includes("404") || text.includes("error") || text.includes("not found")) return 1;

    return 0;
  } catch {
    return 0;
  }
}

// Main function: security compliance
export default async function securityCompliance(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  // EU simulation for cookie banner detection
  await page.setExtraHTTPHeaders({ "Accept-Language": "en-GB,en;q=0.9" });
  await page.setGeolocation({ latitude: 48.8566, longitude: 2.3522 });
  await page.setViewport({ width: 1200, height: 800 });

  const allHeaders = await getAllHeaders(page);

  await page.goto(url, { waitUntil: "networkidle2" });
  await wait(5000); // wait 5 seconds for all async requests

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

  const totalDScore =
    httpsScore * 2 +
    hstsScore * 1 +
    parseFloat(headersScore.toFixed(2)) +
    cookieBannerScore * 1 +
    errorPageScore * 1;

  return {
    D: {
      httpsMixedContent: httpsScore * 2,
      hsts: hstsScore * 1,
      securityHeaders: parseFloat(headersScore.toFixed(2)),
      cookieConsent: cookieBannerScore,
      errorPages: errorPageScore,
      totalDScore,
    },
  };
}
