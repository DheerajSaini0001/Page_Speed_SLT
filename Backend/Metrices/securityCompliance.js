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

// synchronous: simple URL protocol check (no async overhead)
function checkHTTPS(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "https:" ? 1 : 0;
  } catch {
    return 0;
  }
}

// keep async: network I/O
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

// ------------------ Puppeteer-based helpers (can reuse provided page) ----------------------

/**
 * If `page` is provided, the function reuses it.
 * Otherwise it will launch its own browser (backwards compatible).
 * Returns an object: { cookies: [...], hasSecure: bool, hasHttpOnly: bool }
 */
export async function checkCookiesSecure(url, page = null) {
  let internalBrowser = null;
  try {
    if (!page) {
      internalBrowser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      page = await internalBrowser.newPage();
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    } else {
      // reuse existing page: ensure on the page
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    }

    const cookies = await page.cookies();

    const hasSecure = cookies.some((c) => c.secure);
    const hasHttpOnly = cookies.some((c) => c.httpOnly);

    if (internalBrowser) await internalBrowser.close();
    return { cookies, hasSecure, hasHttpOnly };
  } catch (err) {
    if (internalBrowser) try { await internalBrowser.close(); } catch {}
    return { cookies: [], hasSecure: false, hasHttpOnly: false };
  }
}

// legacy header-based check (keeps for compatibility)
export async function checkCookiesHttpOnlyHeader(url) {
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

/**
 * Reusable cookie consent check. If page provided, reuse it.
 * Returns 1 if consent element found, else 0.
 */
export async function checkCookieConsent(url, page = null) {
  let internalBrowser = null;
  try {
    if (!page) {
      internalBrowser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      page = await internalBrowser.newPage();
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    } else {
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    }

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
        if (internalBrowser) await internalBrowser.close();
        return 1;
      }
    }

    if (internalBrowser) await internalBrowser.close();
    return 0;
  } catch (err) {
    if (internalBrowser) try { await internalBrowser.close(); } catch {}
    return 0;
  }
}

/**
 * Privacy policy detection (reuses `page` if provided).
 * Returns 1 if found, else 0.
 */
export async function checkPrivacyPolicy(url, page = null) {
  let internalBrowser = null;
  try {
    if (!page) {
      internalBrowser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      page = await internalBrowser.newPage();
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    } else {
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    }

    const links = await page.$$eval("a", (anchors) =>
      anchors.map((a) => (a.href || "").toLowerCase())
    );

    const privacyPatterns = ["privacy", "privacy-policy", "privacy_policy"];

    const found = links.some((link) =>
      privacyPatterns.some((pattern) => link.includes(pattern))
    );

    if (internalBrowser) await internalBrowser.close();
    return found ? 1 : 0;
  } catch (err) {
    if (internalBrowser) try { await internalBrowser.close(); } catch {}
    return 0;
  }
}

// ---------------- Google Safe Browsing & VirusTotal ----------------

async function checkGoogleSafeBrowsing(url) {
  try {
    if (!safeBrowsingAPI) return false;
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
    return !!j.matches;
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
    const score = stats.malicious && stats.malicious > 0;
    return score ? 0 : 1; // 0 if blacklisted, 1 if safe
  } catch {
    return false;
  }
}

async function checkDomainBlacklist(domain, url) {
  const [g, v] = await Promise.all([
    checkGoogleSafeBrowsing(url),
    checkVirusTotal(domain),
  ]);
  // return 0 if blacklisted, 1 if safe
  return g || !v ? 0 : 1;
}

// ---------------- XSS Vulnerability Check (uses new page so we don't disturb main page) ----------------
async function checkXSS(url, browser = null) {
  let newBrowser = null;
  try {
    if (!browser) {
      newBrowser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      browser = newBrowser;
    }
    const page = await browser.newPage();
    const payload = `<script>alert(1)</script>`;
    const testUrl = url.includes("?")
      ? `${url}&xss=${encodeURIComponent(payload)}`
      : `${url}?xss=${encodeURIComponent(payload)}`;

    await page.goto(testUrl, { waitUntil: "networkidle2", timeout: 60000 });
    const html = await page.content();
    await page.close();
    if (newBrowser) await newBrowser.close();
    return html.toLowerCase().includes(payload.toLowerCase()) ? 0 : 1;
  } catch (err) {
    if (newBrowser) try { await newBrowser.close(); } catch {}
    return 0;
  }
}

// ---------------- SQL Injection Exposure Check ----------------
export async function checkSQLiExposure(urlString, options = {}) {
  const { timeout = 15000, lengthDiffThreshold = 0.25 } = options;

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
export async function checkFormsUseHTTPS(url, page = null) {
  let internalBrowser = null;
  try {
    if (!page) {
      internalBrowser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      page = await internalBrowser.newPage();
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    } else {
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    }

    const forms = await page.$$eval("form", (forms) =>
      forms.map((f) => f.getAttribute("action") || "")
    );

    if (internalBrowser) await internalBrowser.close();

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
    if (internalBrowser) try { await internalBrowser.close(); } catch {}
    return 0;
  }
}

// ---------------- GDPR / CCPA Compliance Check ----------------
export async function checkGDPRCCPA(url, page = null) {
  let internalBrowser = null;
  try {
    if (!page) {
      internalBrowser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      page = await internalBrowser.newPage();
      await page.setViewport({ width: 1200, height: 800 });
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    } else {
      await page.setViewport({ width: 1200, height: 800 });
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    }

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
        if (internalBrowser) await internalBrowser.close();
        return 1;
      }
    }

    if (internalBrowser) await internalBrowser.close();
    return 0;
  } catch (err) {
    if (internalBrowser) try { await internalBrowser.close(); } catch {}
    return 0;
  }
}

// ---------------- Data Collection Disclosure Check ----------------
export async function checkDataCollection(url, page = null) {
  let internalBrowser = null;
  try {
    if (!page) {
      internalBrowser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      page = await internalBrowser.newPage();
      await page.setViewport({ width: 1200, height: 800 });
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    } else {
      await page.setViewport({ width: 1200, height: 800 });
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    }

    const links = await page.$$eval("a", (anchors) =>
      anchors.map((a) => (a.href || "").toLowerCase())
    );

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

    if (internalBrowser) await internalBrowser.close();
    return found ? 1 : 0;
  } catch (err) {
    if (internalBrowser) try { await internalBrowser.close(); } catch {}
    return 0;
  }
}

// ---------------- Admin panel public check ----------------
export async function checkAdminPanelPublic(baseUrl, options = {}) {
  const {
    timeout = 10000,
    maxBodyChars = 20000,
  } = options;

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

  const adminKeywords = [
    "wp-login.php",
    "wordpress",
    "phpmyadmin",
    "administrator",
    "admin panel",
    "admin login",
    "sign in",
    "login",
    "username",
    "password",
    "control panel",
    "manage",
  ];

  function looksLikeAdmin(body, urlChecked) {
    if (!body) return false;
    const low = body.slice(0, maxBodyChars).toLowerCase();
    if (adminKeywords.some((kw) => low.includes(kw))) return true;
    if (adminPaths.some((p) => urlChecked.toLowerCase().endsWith(p.replace(/\/$/, "")))) return true;
    return false;
  }

  let origin;
  try {
    const u = new URL(baseUrl);
    origin = `${u.protocol}//${u.host}`;
  } catch {
    return 1;
  }

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
    const tryUrl = new URL(path, origin).toString();
    const res = await fetchWithTimeout(tryUrl);
    if (!res) continue;

    if (res.redirected) {
      try {
        const txt = await res.text();
        if (looksLikeAdmin(txt, res.url)) return 0;
      } catch {
        return 0;
      }
    }

    const status = res.status;
    if (status === 401 || status === 403) continue;
    if (status === 200) {
      let body = "";
      try {
        body = await res.text();
      } catch {}
      if (looksLikeAdmin(body, tryUrl)) return 0;
      continue;
    }
  }

  return 1;
}

// ---------------- Weak / Default Credentials Heuristic Check ----------------
export async function checkWeakDefaultCredentials(url, page = null) {
  let internalBrowser = null;
  try {
    if (!page) {
      internalBrowser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      page = await internalBrowser.newPage();
      await page.setViewport({ width: 1200, height: 800 });
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    } else {
      await page.setViewport({ width: 1200, height: 800 });
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    }

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
      if (internalBrowser) await internalBrowser.close();
      return 0;
    }

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
          html: f.innerHTML.slice(0, 2000),
        };
      })
    );

    for (const form of forms) {
      const hasPassword = form.inputs.some((i) => (i.type || "").toLowerCase() === "password");
      if (!hasPassword) continue;

      const hasCsrf = form.inputs.some((i) =>
        /csrf|token|authenticity_token|_token|anti_csrf/i.test(i.name + " " + i.id)
      );

      const captchaPresent =
        /recaptcha|g-recaptcha|captcha|hcaptcha|data-sitekey/i.test(form.html) ||
        /recaptcha|g-recaptcha|captcha|hcaptcha|data-sitekey/i.test(lowText);

      const usernameDefaults = ["admin", "root", "administrator", "user", "test"];
      const usernamePreset = form.inputs.some((i) =>
        usernameDefaults.includes((i.value || i.placeholder || "").toLowerCase())
      );

      const actionLower = (form.action || "").toLowerCase();
      const adminActionIndicators = ["wp-login.php", "phpmyadmin", "pma", "/admin", "/login"];
      const actionLooksAdmin = adminActionIndicators.some((s) => actionLower.includes(s));

      if (usernamePreset) {
        if (internalBrowser) await internalBrowser.close();
        return 0;
      }

      if (!hasCsrf && !captchaPresent) {
        if (internalBrowser) await internalBrowser.close();
        return 0;
      }

      if (actionLooksAdmin) {
        if (internalBrowser) await internalBrowser.close();
        return 0;
      }
    }

    try {
      const origin = await page.evaluate(() => location.origin);
      const headRes = await fetch(origin, { method: "HEAD", redirect: "follow" });
      const wwwAuth = headRes.headers.get("www-authenticate") || "";
      if (wwwAuth) {
        if (internalBrowser) await internalBrowser.close();
        return 0;
      }
    } catch {}

    if (internalBrowser) await internalBrowser.close();
    return 1;
  } catch (err) {
    if (internalBrowser) try { await internalBrowser.close(); } catch {}
    return 1;
  }
}

// ---------------- MFA Heuristic Check ----------------
export async function checkMFAEnabled(url, page = null) {
  let internalBrowser = null;
  try {
    if (!page) {
      internalBrowser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      page = await internalBrowser.newPage();
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    } else {
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    }

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

      const text = form.text.toLowerCase();
      const inputsText = form.inputs.map(i => (i.placeholder + i.name).toLowerCase()).join(" ");

      const mfaKeywords = ["otp", "two-factor", "2fa", "authenticator", "verification code", "mfa"];
      if (mfaKeywords.some(k => text.includes(k) || inputsText.includes(k))) {
        if (internalBrowser) await internalBrowser.close();
        return 1;
      }
    }

    if (internalBrowser) await internalBrowser.close();
    return 0;
  } catch (err) {
    if (internalBrowser) try { await internalBrowser.close(); } catch {}
    return 0;
  }
}

// ---------------- Utility (synchronous) ----------------
function Domain(urlString) {
  const u = new URL(urlString);
  let host = u.hostname;
  if (host.startsWith("www.")) host = host.slice(4);
  return host;
}

// ------------------ Main Export ----------------------
export default async function securityCompliance(url) {
  // Launch one browser and one main page to reuse for puppeteer checks
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({ "Accept-Language": "en-GB,en;q=0.9" });
  await page.setViewport({ width: 1200, height: 800 });

  // Navigate main page once (many checks reuse it)
  await page.goto(url, { waitUntil: "networkidle2", timeout: 240000 });

  // Parallelize header/network checks where possible
  const [
    checkSSLScore,
    checkSSLCertificateExpiryScore,
    checkHSTSScore,
    checkTLSVersionScore,
    checkXFrameOptionsScore,
    checkCSPScore,
    checkXContentTypeOptionsScore,
  ] = await Promise.all([
    checkSSL(url),
    checkSSLCertificateExpiry(url),
    checkHSTS(url),
    checkTLSVersion(url),
    checkXFrameOptions(url),
    checkCSP(url),
    checkXContentTypeOptions(url),
  ]);

  // Puppeteer-based checks reuse page
  const [
    cookieResult,
    cookieConsentScore,
    privacyPolicyScore,
    formsUseHTTPSScore,
    gdprCcpaScore,
    dataCollectionScore,
    weakDefaultCredsScore,
    mfaEnabledScore,
  ] = await Promise.all([
    checkCookiesSecure(url, page),
    checkCookieConsent(url, page),
    checkPrivacyPolicy(url, page),
    checkFormsUseHTTPS(url, page),
    checkGDPRCCPA(url, page),
    checkDataCollection(url, page),
    checkWeakDefaultCredentials(url, page),
    checkMFAEnabled(url, page),
  ]);

  const checkCookiesSecureScore = cookieResult.hasSecure ? 1 : 0;
  const checkCookiesHttpOnlyScore = cookieResult.hasHttpOnly ? 1 : 0;

  // domain-based and other checks (can run in parallel)
  const domain = Domain(url);
  const [
    safeBrowsingFlag,
    blacklistScore,
    malwareScanScore,
    xssVulnerabilityScore,
    sqliExposureScore,
    adminPanelPublicScore,
  ] = await Promise.all([
    checkGoogleSafeBrowsing(url), // returns boolean-ish
    checkDomainBlacklist(domain, url),
    checkVirusTotal(domain),
    checkXSS(url, browser),
    checkSQLiExposure(url),
    checkAdminPanelPublic(url),
  ]);

  const safeBrowsingScore = safeBrowsingFlag ? 0 : 1; // Google match true => unsafe (0). Keep prior semantics if you prefer invert adjust.

  // Some outputs in your previous version had different boolean semantics; adjust if needed
  console.log("======== SECURITY SCORES ========");
  console.log("HTTPS:", checkHTTPS(url));
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
  console.log("GDPR/CCPA Notice (1=present,0=not):", gdprCcpaScore);
  console.log("Data Collection Disclosure (1=found,0=not):", dataCollectionScore);
  console.log("Admin Panel Publicly Accessible (1=no,0=yes):", adminPanelPublicScore);
  console.log("Weak/Default Credentials Indicators (1=no,0=yes):", weakDefaultCredsScore);
  console.log("MFA Enabled (1=yes,0=no):", mfaEnabledScore);
  console.log("VirusTotal Blacklist Score (1=safe,0=blacklisted):", blacklistScore);
  console.log("Malware Scan (1=safe,0=malicious):", malwareScanScore);
  console.log("XSS Vulnerability (0=vulnerable,1=safe):", xssVulnerabilityScore);
  console.log("=================================");

  await browser.close();

  return {
    https: checkHTTPS(url),
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
    gdprCcpa: gdprCcpaScore,
    dataCollection: dataCollectionScore,
    adminPublic: adminPanelPublicScore,
    weakDefaultCredentials: weakDefaultCredsScore,
    mfaEnabled: mfaEnabledScore,
    blacklist: blacklistScore,
    malwareScan: malwareScanScore,
    xss: xssVulnerabilityScore,
  };
}
