import axios from "axios";

async function checkHTTPS(htmlData) {
  try {
    const mixedContent = htmlData.match(/http:\/\/[^"']+/gi);
    return res.request.protocol === "https:" && (!mixedContent || mixedContent.length === 0) ? 1 : 0;
  } catch {
    return 0;
  }
}

// Helper to check HSTS header
async function checkHSTS(html) {
  try {
    const hsts = html.headers["strict-transport-security"];
    if (!hsts) return 0;
    if (hsts.includes("preload")) return 1;
    return 0.5;
  } catch {
    return 0;
  }
}

// Helper to check security headers
async function checkSecurityHeaders(html) {
  try {
    const headers = html.headers;
    const requiredHeaders = [
      "content-security-policy",
      "x-content-type-options",
      "x-frame-options",
      "cross-origin-opener-policy",
      "referrer-policy",
    ];
    const presentCount = requiredHeaders.filter((h) => headers[h]).length;
    return (presentCount / requiredHeaders.length) * 3; // weight 3
  } catch {
    return 0;
  }
}

async function checkCookieBanner(url,page) {
      await page.goto(url, { waitUntil: "networkidle2" });
  try {
    // Look for common selectors/keywords
    const cookieBanner = await page.evaluate(() => {
      const text = document.body.innerText.toLowerCase();
      return (
        text.includes("cookie") &&
        (text.includes("consent") || text.includes("policy"))
      );
    });

    await browser.close();
    return cookieBanner ? 1 : 0;
  } catch {
    return 0;
  }
}

async function checkCustomErrorPage(url) {
  try {
    // Add a fake path that likely doesn’t exist
    const fakeUrl = url.replace(/\/$/, "") + "/nonexistent-" + Date.now();
    const res = await axios.get(fakeUrl, { validateStatus: () => true });

    if (res.status === 404 || res.status === 500) {
      // Look for custom branding/HTML rather than default server text
      const html = res.data.toLowerCase();
      if (
        html.includes("404") ||
        html.includes("page not found") ||
        html.includes("error")
      ) {
        return 1; // custom error page detected
      }
    }
    return 0;
  } catch {
    return 0;
  }
}


export default async function securityCompliance(url,html,htmlData,page) {
  const report = {};

  // Run all checks in parallel
  const [
    httpsScore,
    hstsScore,
    headersScore,
    cookieBannerScore,
    errorPageScore
  ] = await Promise.all([
    checkHTTPS(htmlData),           // 1️⃣ HTTPS & mixed content
    checkHSTS(html),            // 2️⃣ HSTS
    checkSecurityHeaders(html), // 3️⃣ Security Headers
    checkCookieBanner(url,page),    // 4️⃣ Cookie Banner & Consent
    checkCustomErrorPage(url)  // 5️⃣ 404/500 custom error pages
  ]);

  report.D = {
    httpsMixedContent: httpsScore * 2,
    hsts: hstsScore * 1,
    securityHeaders: parseFloat(headersScore.toFixed(2)),
    cookieConsent: cookieBannerScore,
    errorPages: errorPageScore,
    totalDScore:
      httpsScore * 2 +
      hstsScore * 1 +
      parseFloat(headersScore.toFixed(2)) +
      cookieBannerScore +
      errorPageScore,
  };

  return report;
}