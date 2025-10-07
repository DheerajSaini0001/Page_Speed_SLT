// securityCompliance.mjs
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import https from "follow-redirects";
import axios from "axios";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { URL } from "url";

dotenv.config();
puppeteer.use(StealthPlugin());

const safeBrowsingAPI = process.env.SafeBrowsing;
const VT_KEY = process.env.vt_key;

// ------------------ Helpers ----------------------

async function checkHTTPS(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "https:" ? 1 : 0;
  } catch {
    return 0;
  }
}

async function checkSSL(url) {
  return new Promise((resolve) => {
    try {
      const req = https.get(url, () => resolve(1));
      req.on("error", () => resolve(0));
      req.end();
    } catch {
      resolve(0);
    }
  });
}

async function checkSSLCertificateExpiry(url) {
  return new Promise((resolve) => {
    try {
      const req = https.get(url, { rejectUnauthorized: true }, (res) => {
        const cert = res.socket.getPeerCertificate();
        if (!cert || !cert.valid_to) return resolve(0);
        const expiryDate = new Date(cert.valid_to);
        resolve(expiryDate > new Date() ? 1 : 0);
      });
      req.on("error", () => resolve(0));
      req.end();
    } catch {
      resolve(0);
    }
  });
}

async function checkHSTS(url) {
  return new Promise((resolve) => {
    try {
      https.get(url, (res) => {
        resolve(res.headers["strict-transport-security"] ? 1 : 0);
      }).on("error", () => resolve(0));
    } catch {
      resolve(0);
    }
  });
}

async function checkTLSVersion(url) {
  return new Promise((resolve) => {
    try {
      const req = https.get(url, { rejectUnauthorized: true }, (res) => {
        const tlsVersion = res.socket.getProtocol();
        resolve(
          tlsVersion === "TLSv1.2" || tlsVersion === "TLSv1.3" ? 1 : 0
        );
      });
      req.on("error", () => resolve(0));
      req.end();
    } catch {
      resolve(0);
    }
  });
}

async function checkXFrameOptions(url) {
  return new Promise((resolve) => {
    try {
      https.get(url, (res) => {
        resolve(res.headers["x-frame-options"] ? 1 : 0);
      }).on("error", () => resolve(0));
    } catch {
      resolve(0);
    }
  });
}

async function checkCSP(url) {
  return new Promise((resolve) => {
    try {
      https.get(url, (res) => {
        resolve(res.headers["content-security-policy"] ? 1 : 0);
      }).on("error", () => resolve(0));
    } catch {
      resolve(0);
    }
  });
}

async function checkXContentTypeOptions(url) {
  return new Promise((resolve) => {
    try {
      const options = {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        },
      };
      https.get(url, options, (res) => {
        resolve(res.headers["x-content-type-options"] ? 1 : 0);
      }).on("error", () => resolve(0));
    } catch {
      resolve(0);
    }
  });
}

// ------------------ Puppeteer-based cookie check ----------------------

async function checkCookiesSecure(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    const cookies = await page.cookies();

    if (!cookies.length) {
      await browser.close();
      return { cookies: [], hasSecure: false, hasHttpOnly: false };
    }

    const hasSecure = cookies.some((c) => c.secure);
    const hasHttpOnly = cookies.some((c) => c.httpOnly);

    await browser.close();
    return { cookies, hasSecure, hasHttpOnly };
  } catch (err) {
    try { await browser.close(); } catch {}
    return { cookies: [], hasSecure: false, hasHttpOnly: false };
  }
}

// legacy header-based check
async function checkCookiesHttpOnlyHeader(url) {
  return new Promise((resolve) => {
    try {
      https.get(url, (res) => {
        const cookies = res.headers["set-cookie"];
        if (!cookies?.length) return resolve(0);
        const hasHttpOnly = cookies.some((c) =>
          c.toLowerCase().includes("httponly")
        );
        resolve(hasHttpOnly ? 1 : 0);
      }).on("error", () => resolve(0));
    } catch {
      resolve(0);
    }
  });
}

// ---------------- Cookie Consent Check (Puppeteer) ----------------

export async function checkCookieConsent(url) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    const consentSelectors = [
      "[id*=cookie]",
      "[class*=cookie]",
      "[id*=consent]",
      "[class*=consent]",
      "[aria-label*=cookie]",
      "[data-cookie-banner]",
    ];

    for (const selector of consentSelectors) {
      const exists = await page.$(selector);
      if (exists) {
        await browser.close();
        return 1;
      }
    }

    await browser.close();
    return 0;
  } catch (err) {
    if (browser) await browser.close();
    return 0;
  }
}

// ---------------- Privacy Policy Check (Puppeteer) ----------------

export async function checkPrivacyPolicy(url) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    const links = await page.$$eval("a", (anchors) =>
      anchors.map((a) => (a.href || "").toLowerCase())
    );

    const privacyPatterns = ["privacy", "privacy-policy", "privacy_policy"];

    const found = links.some((link) =>
      privacyPatterns.some((pattern) => link.includes(pattern))
    );

    await browser.close();
    return found ? 1 : 0;
  } catch (err) {
    if (browser) await browser.close();
    return 0;
  }
}

// ---------------- Google Safe Browsing & VirusTotal ----------------

async function checkGoogleSafeBrowsing(url) {
  if (!safeBrowsingAPI) return false;
  try {
    const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${safeBrowsingAPI}`;
    const body = {
      client: { clientId: "myapp", clientVersion: "1.0" },
      threatInfo: {
        threatTypes: ["MALWARE"],
        platformTypes: ["ANY_PLATFORM"],
        threatEntryTypes: ["URL"],
        threatEntries: [{ url }],
      },
    };
    const res = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    const j = await res.json();
    return !j.matches;
  } catch {
    return false;
  }
}

async function checkVirusTotal(domain) {
  try {
    if (!VT_KEY) return false;
    const endpoint = `https://www.virustotal.com/api/v3/domains/${domain}`;
    const res = await fetch(endpoint, { headers: { "x-apikey": VT_KEY } });
    if (!res.ok) return false;
    const j = await res.json();
    const stats = j?.data?.attributes?.last_analysis_stats || {};
    return stats.malicious && stats.malicious > 0 ? 0 : 1;
  } catch {
    return false;
  }
}

async function checkDomainBlacklist(domain, url) {
  const [g, v] = await Promise.all([
    checkGoogleSafeBrowsing(url),
    checkVirusTotal(domain),
  ]);
  return g || v ? 1 : 0;
}

// ---------------- XSS Vulnerability Check ----------------
async function checkXSS(url) {
  try {
    const payload = `<script>alert(1)</script>`;
    const testUrl = url.includes("?")
      ? `${url}&xss=${encodeURIComponent(payload)}`
      : `${url}?xss=${encodeURIComponent(payload)}`;

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(testUrl, { waitUntil: "networkidle2", timeout: 60000 });
    const html = await page.content();
    await browser.close();

    return html.toLowerCase().includes(payload.toLowerCase()) ? 0 : 1;
  } catch {
    return 0;
  }
}

// ---------------- SQL Injection Exposure Check ----------------
export async function checkSQLiExposure(urlString, options = {}) {
  const { timeout = 15000, lengthDiffThreshold = 0.25 } = options;

<<<<<<< HEAD
export default async function securityCompliance(url,apiResponse,page) {

  await page.setGeolocation({ latitude: 48.8566, longitude: 2.3522 });
  const allHeaders = await getAllHeaders(page);
  await page.goto(url, { waitUntil: "networkidle2",timeout: 240000});

const checkHTTPSScore=checkHTTPS(url);
console.log("Https Score",checkHTTPSScore);

const checkSSLScore = await checkSSL(url);
console.log("checkSSL Score", checkSSLScore);

const checkSSLCertificateExpiryScore= await checkSSLCertificateExpiry(url);
console.log("checkSSLCertificateExpiry Score",checkSSLCertificateExpiryScore);

const checkHSTSScore=await checkHSTS(url);
console.log("checkHSTS Score",checkHSTSScore);

const checkTLSVersionScore=await checkTLSVersion(url);
console.log("checkTLSVersion Score",checkTLSVersionScore);


const checkXFrameOptionsScore=await checkXFrameOptions(url);
console.log("checkXFrameOptions Score",checkXFrameOptionsScore);

const checkCSPScore=await checkCSP(url);
console.log("checkCSP Score",checkCSPScore);

const checkXContentTypeOptionsScore=await checkXContentTypeOptions(url);
console.log("checkXContentTypeOptions Score",checkXContentTypeOptionsScore);

const checkCookiesHttpOnlyScore=await checkCookiesHttpOnly(url);
console.log("checkCookiesHttpOnly Score",checkCookiesHttpOnlyScore);

const checkCookiesSecureScore=await checkCookiesSecure(url);
console.log("checkCookiesSecure Score",checkCookiesSecureScore);

// const checkCookiesSameSiteScore=await checkCookiesSameSite(url);
// console.log("checkCookiesSameSite Score",checkCookiesSameSiteScore);


const checkSecurityHeadersScore=await checkSecurityHeaders(url)
console.log("checkCookiesSameSite Score",checkSecurityHeadersScore);

const safeBrowsingScore=safeBrowsing(apiResponse);
console.log("safeBrowsing Score",safeBrowsingScore);


=======
  const payloads = [
    `' OR '1'='1`,
    `" OR "1"="1`,
    `' OR 1=1 -- `,
    `') OR ('1'='1`,
    `" OR 1=1 -- `,
    ` ' OR 'a'='a`,
  ];

  const sqlErrorPatterns = [
    /you have an error in your sql syntax/i,
    /warning: mysql/i,
    /unclosed quotation mark after the character string/i,
    /pg_query\(|pg_query\_params\(|pg_connect\(/i,
    /syntax error at or near/i,
    /sqlite_exception/i,
    /sqlite3\.OperationalError/i,
    /oracle.*error/i,
    /mysql_fetch_array\(/i,
    /mysql_num_rows\(/i,
    /sql syntax.*mysql/i,
    /unterminated quoted string/i,
    /SQLSTATE\[/i,
  ];

  function looksLikeSQLError(body) {
    if (!body) return false;
    return sqlErrorPatterns.some((rx) => rx.test(body));
  }

  let url;
  try {
    url = new URL(urlString);
  } catch {
    return 1;
  }

  async function fetchBody(u) {
    try {
      const res = await fetch(u.toString(), { redirect: "follow", timeout });
      const text = await res.text();
      return { status: res.status, text };
    } catch {
      return { status: 0, text: "" };
    }
  }

  const baseline = await fetchBody(url);
  const baselineText = baseline.text || "";
  const baselineLength = baselineText.length || 0;

  const params = Array.from(url.searchParams.keys());
  const testParams = params.length ? params : ["q"];

  for (const param of testParams) {
    for (const p of payloads) {
      const testUrl = new URL(url);
      testUrl.searchParams.set(param, p);

      const res = await fetchBody(testUrl);
      const body = res.text || "";
      const length = body.length || 0;

      if (looksLikeSQLError(body)) return 0;
      if (baselineLength > 0) {
        const diff = Math.abs(length - baselineLength) / baselineLength;
        if (diff >= lengthDiffThreshold) return 0;
      } else {
        if (length > 0) return 0;
      }
      if (res.status === 500) return 0;
    }
  }

  return 1;
}

// ---------------- Forms Use HTTPS Check ----------------
export async function checkFormsUseHTTPS(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    const forms = await page.$$eval("form", (forms) =>
      forms.map((f) => f.getAttribute("action") || "")
    );

    await browser.close();

    if (!forms.length) return 1;

    const allHttps = forms.every((action) => {
      if (!action || action.startsWith("/")) return true;
      try {
        return new URL(action).protocol === "https:";
      } catch {
        return false;
      }
    });

    return allHttps ? 1 : 0;
  } catch (err) {
    await browser.close();
    return 0;
  }
}

// ---------------- GDPR / CCPA Compliance Check ----------------
export async function checkGDPRCCPA(url) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // Common selectors for GDPR/CCPA consent banners
    const consentSelectors = [
      "[id*=gdpr]",
      "[class*=gdpr]",
      "[id*=cookie]",
      "[class*=cookie]",
      "[id*=consent]",
      "[class*=consent]",
      "[aria-label*=cookie]",
      "[data-cookie-banner]",
      "[id*=ccpa]",
      "[class*=ccpa]",
      "[data-ccpa-consent]",
    ];

    for (const selector of consentSelectors) {
      const exists = await page.$(selector);
      if (exists) {
        await browser.close();
        return 1; // GDPR/CCPA notice present
      }
    }

    await browser.close();
    return 0; // Not present
  } catch (err) {
    if (browser) await browser.close();
    return 0; // On error, treat as not present
  }
}


// ---------------- Data Collection Disclosure Check ----------------
export async function checkDataCollection(url) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // Get all anchor hrefs
    const links = await page.$$eval("a", (anchors) =>
      anchors.map((a) => (a.href || "").toLowerCase())
    );

    // Keywords for data collection disclosure
    const dataKeywords = [
      "data-collection",
      "data-usage",
      "how we collect data",
      "information we collect",
      "personal information",
      "user data",
      "privacy",
      "terms-of-service",
      "terms-of-use",
      "cookies",
    ];

    const found = links.some((link) =>
      dataKeywords.some((keyword) => link.includes(keyword))
    );

    await browser.close();
    return found ? 1 : 0; // 1 if disclosure found, else 0
  } catch (err) {
    if (browser) await browser.close();
    return 0; // Treat errors as not disclosed
  }
}
/**
 * Check whether common admin panels are publicly accessible.
 * Returns 0 if an admin endpoint appears publicly reachable (bad), 1 otherwise (good).
 *
 * Non-destructive: only performs GET requests.
 */
export async function checkAdminPanelPublic(baseUrl, options = {}) {
  const {
    timeout = 10000, // ms per request
    maxBodyChars = 20000, // only read first N chars for detection
  } = options;

  // candidate admin paths (add/remove as you need)
  const adminPaths = [
    "/admin",
    "/admin/login",
    "/administrator",
    "/administrator/index.php",
    "/user",
    "/users",
    "/login",
    "/wp-admin/",
    "/wp-login.php",
    "/cms",
    "/manage",
    "/backend",
    "/controlpanel",
    "/control-panel",
    "/admin.php",
    "/admin/login.php",
    "/adminpanel",
    "/admin-console",
    "/phpmyadmin/",
    "/pma/",
    "/dbadmin/",
    "/sqladmin/",
  ];

  // common keywords that indicate admin/login pages
  const adminKeywords = [
    "wp-login.php",
    "wordpress",
    "phpmyadmin",
    "phpmyadmin",
    "administrator",
    "admin panel",
    "admin login",
    "sign in",
    "sign-in",
    "login",
    "username",
    "user name",
    "password",
    "enter password",
    "panel",
    "control panel",
    "manage",
  ];

  function looksLikeAdmin(body, urlChecked) {
    if (!body) return false;
    const low = body.slice(0, maxBodyChars).toLowerCase();
    if (adminKeywords.some((kw) => low.includes(kw))) return true;
    // also check url path hints
    if (adminPaths.some((p) => urlChecked.toLowerCase().endsWith(p.replace(/\/$/, "")))) return true;
    return false;
  }

  // build origin and ensure trailing slash handling
  let origin;
  try {
    const u = new URL(baseUrl);
    origin = `${u.protocol}//${u.host}`;
  } catch {
    // invalid URL -> treat as safe
    return 1;
  }

  // helper to fetch with timeout
  async function fetchWithTimeout(url) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, { redirect: "follow", signal: controller.signal });
      clearTimeout(id);
      return res;
    } catch (err) {
      clearTimeout(id);
      return null;
    }
  }

  for (const path of adminPaths) {
    // ensure we don't produce double slashes
    const tryUrl = new URL(path, origin).toString();

    const res = await fetchWithTimeout(tryUrl);
    if (!res) continue; // network error/timeout -> skip

    // If redirected to another location (login pages often redirect), consider it reachable
    if (res.redirected) {
      // fetch the final URL body small sample to inspect
      try {
        const txt = await res.text();
        if (looksLikeAdmin(txt, res.url)) return 0;
      } catch {
        return 0; // redirected and reachable -> consider exposed
      }
    }

    // handle status codes
    const status = res.status;

    // 401/403 -> requires auth or blocked => treat as not publicly accessible
    if (status === 401 || status === 403) {
      continue;
    }

    // 200 => may be login/admin page, read body and check keywords
    if (status === 200) {
      let body = "";
      try {
        body = await res.text();
      } catch {
        body = "";
      }
      if (looksLikeAdmin(body, tryUrl)) {
        return 0; // publicly reachable admin/login detected
      } else {
        // some sites return generic 200 but not admin — keep checking others
        continue;
      }
    }

    // other statuses (404, 301, 302 handled above via redirected) -> skip
  }

  // no admin endpoints found as publicly reachable
  return 1;
}

// ---------------- Weak / Default Credentials Heuristic Check ----------------
/**
 * Non-destructive heuristic that returns:
 *   0 => possible weak/default credentials (suspicious)
 *   1 => no obvious signs
 *
 * IMPORTANT: this function never attempts to log in or submit credentials.
 */
export async function checkWeakDefaultCredentials(url) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    // load page
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // 1) quick page text scan for explicit "default credentials" mentions
    const pageText = await page.evaluate(() => document.documentElement.innerText || "");
    const lowText = (pageText || "").toLowerCase();
    const explicitIndicators = [
      "default password",
      "default credentials",
      "username: admin",
      "password: admin",
      "admin/admin",
      "demo login",
      "test credentials",
      "login with admin",
      "use admin",
    ];
    if (explicitIndicators.some((kw) => lowText.includes(kw))) {
      await browser.close();
      return 0;
    }

    // 2) find login forms (forms that contain an input[type=password])
    const forms = await page.$$eval("form", (forms) =>
      forms.map((f) => {
        const inputs = Array.from(f.querySelectorAll("input")).map((i) => ({
          name: i.getAttribute("name") || "",
          id: i.getAttribute("id") || "",
          type: i.getAttribute("type") || "",
          placeholder: i.getAttribute("placeholder") || "",
          value: i.getAttribute("value") || "",
          autocomplete: i.getAttribute("autocomplete") || "",
        }));
        return {
          action: f.getAttribute("action") || "",
          method: (f.getAttribute("method") || "get").toLowerCase(),
          inputs,
          html: f.innerHTML.slice(0, 2000), // small sample
        };
      })
    );

    // If no forms, that's fine (no direct login form)
    for (const form of forms) {
      // does the form have a password field?
      const hasPassword = form.inputs.some((i) => (i.type || "").toLowerCase() === "password");
      if (!hasPassword) continue;

      // check for CSRF token style fields (name contains csrf, token, _token, auth)
      const hasCsrf = form.inputs.some((i) =>
        /csrf|token|authenticity_token|_token|anti_csrf/i.test(i.name + " " + i.id)
      );

      // check for captcha presence in form html or page (recaptcha iframe, captcha text etc.)
      const captchaPresent =
        /recaptcha|g-recaptcha|captcha|hcaptcha|data-sitekey/i.test(form.html) ||
        /recaptcha|g-recaptcha|captcha|hcaptcha|data-sitekey/i.test(lowText);

      // check username-like input placeholders/values that equal common defaults
      const usernameDefaults = ["admin", "root", "administrator", "user", "test"];
      const usernamePreset = form.inputs.some((i) =>
        usernameDefaults.includes((i.value || i.placeholder || "").toLowerCase())
      );

      // check if form action points to suspicious known endpoints
      const actionLower = (form.action || "").toLowerCase();
      const adminActionIndicators = ["wp-login.php", "phpmyadmin", "pma", "/admin", "/login"];

      const actionLooksAdmin = adminActionIndicators.some((s) => actionLower.includes(s));

      // Heuristics: flag if login form exists AND:
      //  - username preset to 'admin' OR
      //  - no CSRF token AND no captcha (makes brute forcing/default creds easier) OR
      //  - action looks like common admin endpoint
      if (usernamePreset) {
        await browser.close();
        return 0;
      }

      if (!hasCsrf && !captchaPresent) {
        // no CSRF and no captcha — higher chance weak/default creds could be exploited
        await browser.close();
        return 0;
      }

      if (actionLooksAdmin) {
        // exposed admin login endpoint present
        await browser.close();
        return 0;
      }
    }

    // 3) Inspect headers for WWW-Authenticate (basic auth) — weaker check via fetch to origin
    try {
      // use page's location origin
      const origin = await page.evaluate(() => location.origin);
      const headRes = await fetch(origin, { method: "HEAD", redirect: "follow" });
      const wwwAuth = headRes.headers.get("www-authenticate") || "";
      if (wwwAuth) {
        // presence of Basic auth does not mean weak creds, but we flag for review
        await browser.close();
        return 0;
      }
    } catch (e) {
      // non-fatal; ignore
    }

    // 4) If we reached here, no obvious passive indicators found
    await browser.close();
    return 1;
  } catch (err) {
    try { if (browser) await browser.close(); } catch {}
    // on error treat as safe (1) — or you may choose to return 0 to be conservative
    return 1;
  }
}

export async function checkMFAEnabled(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // Find all login forms
    const forms = await page.$$eval("form", (forms) =>
      forms.map((f) => ({
        inputs: Array.from(f.querySelectorAll("input")).map(i => ({
          type: i.type,
          placeholder: i.placeholder || "",
          name: i.name || ""
        })),
        text: f.innerText || ""
      }))
    );

    for (const form of forms) {
      const hasPassword = form.inputs.some(i => i.type === "password");
      if (!hasPassword) continue;

      // Heuristic: look for MFA keywords in text or input names/placeholder
      const text = form.text.toLowerCase();
      const inputsText = form.inputs.map(i => (i.placeholder + i.name).toLowerCase()).join(" ");

      const mfaKeywords = ["otp", "two-factor", "2fa", "authenticator", "verification code", "mfa"];
      if (mfaKeywords.some(k => text.includes(k) || inputsText.includes(k))) {
        await browser.close();
        return 1; // MFA enabled
      }
    }

    await browser.close();
    return 0; // MFA not detected
  } catch (err) {
    try { await browser.close(); } catch {}
    return 0; // on error, assume not detected
  }
}



// ---------------- Utility ----------------
function Domain(urlString) {
  const u = new URL(urlString);
  let host = u.hostname;
  if (host.startsWith("www.")) host = host.slice(4);
  return host;
}

// ------------------ Main Export ----------------------
export default async function securityCompliance(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({ "Accept-Language": "en-GB,en;q=0.9" });
  await page.setViewport({ width: 1200, height: 800 });

  await page.goto(url, { waitUntil: "networkidle2", timeout: 240000 });

  const checkHTTPSScore = await checkHTTPS(url);
  const checkSSLScore = await checkSSL(url);
  const checkSSLCertificateExpiryScore = await checkSSLCertificateExpiry(url);
  const checkHSTSScore = await checkHSTS(url);
  const checkTLSVersionScore = await checkTLSVersion(url);
  const checkXFrameOptionsScore = await checkXFrameOptions(url);
  const checkCSPScore = await checkCSP(url);
  const checkXContentTypeOptionsScore = await checkXContentTypeOptions(url);

  const cookieResult = await checkCookiesSecure(url);
  const checkCookiesSecureScore = cookieResult.hasSecure ? 1 : 0;
  const checkCookiesHttpOnlyScore = cookieResult.hasHttpOnly ? 1 : 0;
  const cookieConsentScore = await checkCookieConsent(url);
  const privacyPolicyScore = await checkPrivacyPolicy(url);

  const domain = Domain(url);
  const safeBrowsingScore = (await checkGoogleSafeBrowsing(url)) ? 1 : 0;
  const blacklistScore = await checkDomainBlacklist(domain, url);
  const malwareScanScore = await checkVirusTotal(domain);
  const xssVulnerabilityScore = await checkXSS(url);
  const sqliExposureScore = await checkSQLiExposure(url);
  const formsUseHTTPSScore = await checkFormsUseHTTPS(url);
  const checkGDPRCCPAScore = await checkGDPRCCPA(url);
const checkDataCollectionScore = await checkDataCollection(url);

const checkAdminPanelPublicScore = await checkAdminPanelPublic(url);
const weakDefaultCredsScore = await checkWeakDefaultCredentials(url);
const mfaEnabledScore = await checkMFAEnabled(url);

  console.log("======== SECURITY SCORES ========");
  console.log("HTTPS:", checkHTTPSScore);
  console.log("SSL:", checkSSLScore);
  console.log("SSL Expiry:", checkSSLCertificateExpiryScore);
  console.log("HSTS:", checkHSTSScore);
  console.log("TLS:", checkTLSVersionScore);
  console.log("X-Frame-Options:", checkXFrameOptionsScore);
  console.log("CSP:", checkCSPScore);
  console.log("X-Content-Type-Options:", checkXContentTypeOptionsScore);
  console.log("Cookies HttpOnly:", checkCookiesHttpOnlyScore);
  console.log("Cookies Secure:", checkCookiesSecureScore);
  console.log("Cookie Consent (1=present,0=not):", cookieConsentScore);
  console.log("Privacy Policy (1=exists,0=not):", privacyPolicyScore);
  console.log("Google Safe Browsing (1=safe,0=unsafe):", safeBrowsingScore);
  console.log("SQLi Exposure (0=vulnerable,1=safe):", sqliExposureScore);
  console.log("Forms Use HTTPS (0=unsafe,1=safe):", formsUseHTTPSScore);
  console.log("VirusTotal Blacklist Score (1=safe,0=blacklisted):", blacklistScore);
  console.log("Malware Scan (1=safe,0=malicious):", malwareScanScore);
  console.log("XSS Vulnerability (0=vulnerable,1=safe):", xssVulnerabilityScore);
  console.log("GDPR/CCPA Notice (1=present,0=not):", checkGDPRCCPAScore);
  console.log("Data Collection Disclosure (1=found,0=not):", checkDataCollectionScore);
  console.log("Admin Panel Publicly Accessible (1=no,0=yes):", checkAdminPanelPublicScore);
  console.log("Weak/Default Credentials Indicators (1=no,0=yes):", weakDefaultCredsScore);
  console.log("MFA Enabled (1=yes,0=no):", mfaEnabledScore);
  
  
  
  
  
  console.log("=================================");

  await browser.close();

  return {
    https: checkHTTPSScore,
    ssl: checkSSLScore,
    sslExpiry: checkSSLCertificateExpiryScore,
    hsts: checkHSTSScore,
    tls: checkTLSVersionScore,
    xFrameOptions: checkXFrameOptionsScore,
    csp: checkCSPScore,
    xContentTypeOptions: checkXContentTypeOptionsScore,
    cookiesHttpOnly: checkCookiesHttpOnlyScore,
    cookiesSecure: checkCookiesSecureScore,
    cookieConsent: cookieConsentScore,
    privacyPolicy: privacyPolicyScore,
    googleSafeBrowsing: safeBrowsingScore,
    sqliExposure: sqliExposureScore,
    formsUseHTTPS: formsUseHTTPSScore,
    blacklist: blacklistScore,
    malwareScan: malwareScanScore,
    xss: xssVulnerabilityScore,
  };
>>>>>>> d245fc50e7c395c1f2d2adb90ff002a51614e3d2
}
