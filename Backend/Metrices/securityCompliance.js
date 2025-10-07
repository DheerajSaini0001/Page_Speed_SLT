import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import https from 'https';
import axios from "axios";
import { log } from "console";

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

// cheeck that HTTPS enabled (0/1)
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

// SSL certificate valid (0/1)
async function checkSSL(url) {
  return new Promise((resolve) => {
    try {
      const req = https.get(url, (res) => {
        resolve(1); // SSL valid
      });

      req.on('error', (err) => {
        resolve(0); // SSL invalid
      });

      req.end();
    } catch (e) {
      resolve(0);
    }
  });
}

// Certificate expiration date (numeric or 0/1 for valid)
async function checkSSLCertificateExpiry(url) {
  return new Promise((resolve) => {
    try {
      const req = https.get(url, { rejectUnauthorized: true }, (res) => {
        const certificate = res.socket.getPeerCertificate();

        if (!certificate || !certificate.valid_to) {
          resolve(0); // No certificate info → invalid
          return;
        }

        // Get expiration date
        const expiryDate = new Date(certificate.valid_to);
        const now = new Date();

        if (expiryDate > now) {
          resolve(1); // Certificate still valid
        } else {
          resolve(0); // Certificate expired
        }
      });

      req.on('error', (err) => {
        resolve(0); // Connection error → treat as invalid
      });

      req.end();
    } catch (e) {
      resolve(0);
    }
  });
}

// HSTS header present (0/1
async function checkHSTS(url) {
  return new Promise((resolve) => {
    try {
      https.get(url, (res) => {
        const hstsHeader = res.headers['strict-transport-security'];

        if (hstsHeader) {
          resolve(1); // HSTS header present
        } else {
          resolve(0); // HSTS header missing
        }
      }).on('error', (err) => {
        resolve(0); // Request failed → treat as missing
      });
    } catch (e) {
      resolve(0);
    }
  });
}

// TLS version (1 if >=1.2, 0 if <1.2)
async function checkTLSVersion(url) {
  return new Promise((resolve) => {
    try {
      const req = https.get(url, { rejectUnauthorized: true }, (res) => {
        // Get the TLS version used for the connection
        const tlsVersion = res.socket.getProtocol(); // e.g., 'TLSv1.3', 'TLSv1.2', etc.

        if (tlsVersion === 'TLSv1.2' || tlsVersion === 'TLSv1.3') {
          resolve(1); // TLS >= 1.2
        } else {
          resolve(0); // TLS < 1.2
        }
      });

      req.on('error', (err) => {
        resolve(0); // Request failed → treat as TLS < 1.2
      });

      req.end();
    } catch (e) {
      resolve(0);
    }
  });
}

// X-Frame-Options present (0/1)
async function checkXFrameOptions(url) {
  return new Promise((resolve) => {
    try {
      https.get(url, (res) => {
        const xFrameHeader = res.headers['x-frame-options'];

        if (xFrameHeader) {
          resolve(1); // Header is present
        } else {
          resolve(0); // Header is missing
        }
      }).on('error', (err) => {
        resolve(0); // Request failed → treat as missing
      });
    } catch (e) {
      resolve(0);
    }
  });
}

// Content-Security-Policy present (0/1)
async function checkCSP(url) {
  return new Promise((resolve) => {
    try {
      https.get(url, (res) => {
        const cspHeader = res.headers['content-security-policy'];

        if (cspHeader) {
          resolve(1); // CSP header present
        } else {
          resolve(0); // CSP header missing
        }
      }).on('error', (err) => {
        resolve(0); // Request failed → treat as missing
      });
    } catch (e) {
      resolve(0);
    }
  });
}

// X-Content-Type-Options present (0/1)

async function checkXContentTypeOptions(url) {
  return new Promise((resolve) => {
    try {
      const options = {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      };

      https.get(url, options, (res) => {
        
        const header = res.headers['x-content-type-options'];

        if (header) {
          resolve(1);
        } else {
          resolve(0);
        }
      }).on('error', (err) => {
        resolve(0);
      });

    } catch (e) {
      resolve(0);
    }
  });
}


// Cookies HttpOnly flag (0/1)
async function checkCookiesHttpOnly(url) {
  return new Promise((resolve) => {
    try {
      const options = {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      };

      https
        .get(url, options, (res) => {
          const cookies = res.headers["set-cookie"];

          if (!cookies || cookies.length === 0) {
            resolve(0); // No cookies → treat as 0
            return;
          }

          // Check if ANY cookie has HttpOnly flag
          const hasHttpOnly = cookies.some((cookie) =>
            cookie.toLowerCase().includes("httponly")
          );

          resolve(hasHttpOnly ? 1 : 0);
        })
        .on("error", () => {
          resolve(0);
        });
    } catch (e) {
      resolve(0);
    }
  });
}

// Cookies Secure flag (0/1)
async function checkCookiesSecure(url) {
  return new Promise((resolve) => {
    try {
      const options = {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      };

      https
        .get(url, options, (res) => {
          const cookies = res.headers["set-cookie"];

          if (!cookies || cookies.length === 0) {
            resolve(0); // No cookies → treat as 0
            return;
          }

          // Check if ANY cookie has Secure flag
          const hasSecure = cookies.some((cookie) =>
            cookie.toLowerCase().includes("secure")
          );

          resolve(hasSecure ? 1 : 0);
        })
        .on("error", () => {
          resolve(0);
        });
    } catch (e) {
      resolve(0);
    }
  });
}

// // Cookies SameSite flag (0/1)
// async function checkCookiesSameSite(url) {
//   return new Promise((resolve) => {
//     try {
//       const options = {
//         headers: {
//           "User-Agent":
//             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
//         },
//       };

//       https
//         .get(url, options, (res) => {
//           const cookies = res.headers["set-cookie"];

//           if (!cookies || cookies.length === 0) {
//             resolve(0); // No cookies → treat as 0
//             return;
//           }

//           // Check if ANY cookie has SameSite attribute
//           const hasSameSite = cookies.some((cookie) =>
//             cookie.toLowerCase().includes("samesite=")
//           );

//           resolve(hasSameSite ? 1 : 0);
//         })
//         .on("error", () => {
//           resolve(0);
//         });
//     } catch (e) {
//       resolve(0);
//     }
//   });
// }

async function checkSecurityHeaders(url) {
  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false, // ignore SSL cert errors
      }),
      maxRedirects: 5,
      validateStatus: () => true, // prevent Axios from throwing on 400/500
    });

   

    const xcto = res.headers["x-content-type-options"] ? 1 : 0;

    const cookies = res.headers["set-cookie"] || [];
    let httpOnly = 0,
      secure = 0,
      sameSite = 0;

    cookies.forEach((cookie) => {
      if (/httponly/i.test(cookie)) httpOnly = 1;
      if (/secure/i.test(cookie)) secure = 1;
      if (/samesite/i.test(cookie)) sameSite = 1;
    });

    return {
      checkXContentTypeOptions: xcto,
      checkCookiesHttpOnly: httpOnly,
      checkCookiesSecure: secure,
      checkCookiesSameSite: sameSite,
    };
  } catch (err) {
    console.error("❌ Request failed:", err.message);
    return {
      error: "Request failed",
      scores: { xcto: 0, httpOnly: 0, secure: 0, sameSite: 0 },
    };
  }
}

function safeBrowsing(apiResponse) {
  // Check if apiResponse exists
  if (!apiResponse) return 0; // treat missing response as unsafe

  // If API response has a 'matches' or 'threats' key, unsafe
  if (apiResponse.matches && apiResponse.matches.length > 0) {    
    return 0; // unsafe
  }

  // Otherwise safe
  return 1;
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


}
