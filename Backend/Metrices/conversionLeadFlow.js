import * as cheerio from "cheerio";
import puppeteer from "puppeteer";
function checkCTAs($) {
    // Array of common CTA selectors
    const ctaSelectors = [
        'button',
        'input[type="button"]',
        'input[type="submit"]',
        '.cta',
        '.cta-button',
        '.cta-btn',
        '.btn-primary',
        '.btn-cta',
        '.btn',
        '.button',
        'a.cta',
        'a.cta-button',
        'a.btn',
        'a.btn-primary',
        'a[href*="signup"]',
        'a[href*="register"]',
        'a[href*="subscribe"]',
        '[id*="cta"]',
        '[class*="cta"]',
        '.hero button',
        '.hero a',
        '.promo button',
        '.promo a',
        '.signup button',
        '.signup a',
        '.download button',
        '.download a'
    ];

    let totalCTAs = 0;
    let foundCTAs = 0;

    ctaSelectors.forEach(selector => {
        const elements = $(selector);
        const count = elements.length;
        if (count > 0) {
            foundCTAs += count;
        }
        totalCTAs += count;
    });

    return {
        score: foundCTAs > 0 ? 1 : 0 // 1 if at least one CTA exists
    };
}

function checkCTAClarity($) {
    const ctaSelectors = ['button', 'a', '.cta', '.cta-button', '.btn-primary']; // simplified

    let totalCTAs = 0;
    let clearCTAs = 0;

    const clearVerbs = ["buy", "get", "download", "sign up", "subscribe", "start", "join", "register", "learn", "book", "order"];

    ctaSelectors.forEach(selector => {
        $(selector).each((i, el) => {
            const text = $(el).text().trim().toLowerCase();
            if (!text) return;
            totalCTAs++;
            const isClear = clearVerbs.some(verb => text.includes(verb));
            if (isClear) clearCTAs++;
        });
    });

    return {
        score: clearCTAs > 0 ? 1 : 0  // 1 if at least one CTA is clear
    };
}

async function checkCTAContrast(url) {
    const ctaSelectors = ['button', 'a', '.cta', '.cta-button', '.btn-primary'];

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const result = await page.evaluate((selectors) => {
        function rgbStringToArray(str) {
            const match = str.match(/\d+/g);
            return match ? match.map(Number) : [0,0,0];
        }

        function getContrast(foreground, background) {
            function luminance(r,g,b){
                [r,g,b] = [r,g,b].map(c => c/255 <= 0.03928 ? c/12.92 : Math.pow((c/255+0.055)/1.055,2.4));
                return 0.2126*r + 0.7152*g + 0.0722*b;
            }
            const L1 = luminance(...foreground);
            const L2 = luminance(...background);
            return (Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05);
        }

        const elements = document.querySelectorAll(selectors.join(','));
        let highContrastCount = 0;

        elements.forEach(el => {
            const style = window.getComputedStyle(el);
            const fg = rgbStringToArray(style.color);
            const bg = rgbStringToArray(style.backgroundColor);
            const contrast = getContrast(fg, bg);
            if (contrast >= 4.5) highContrastCount++;
        });

        return {
            score: highContrastCount > 0 ? 1 : 0
        };
    }, ctaSelectors);

    await browser.close();
    return result;
}


async function checkCTACrowding(url, maxCTAs = 2) {
    const ctaSelectors = [
        'button',
        'input[type="button"]',
        'input[type="submit"]',
        '.cta',
        '.cta-button',
        '.cta-btn',
        '.btn-primary',
        'a.cta',
        'a.cta-button',
        'a.btn',
        'a.btn-primary'
    ];

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const result = await page.evaluate((selectors, max) => {
        const totalCTAs = document.querySelectorAll(selectors.join(',')).length;
        const score = totalCTAs <= max ? 1 : 0; // 1 = not crowded, 0 = crowded
        return { totalCTAs, score };
    }, ctaSelectors, maxCTAs);

    await browser.close();
    return result;
}

function checkCTAFlowAlignment($) {
  try {
    // Common CTA texts (expandable list)
    const ctaKeywords = [
      "buy now", "sign up", "get started", "subscribe",
      "download", "contact us", "book now", "join now", "try for free"
    ];

    // Find CTA-like buttons or links
    const ctas = $("a, button").filter((_, el) => {
      const text = $(el).text().toLowerCase().trim();
      return ctaKeywords.some(keyword => text.includes(keyword));
    });

    if (ctas.length === 0) return 0; // No CTA found

    // Find position of first CTA in the DOM
    const totalElements = $("*").length;
    const firstCTAIndex = $("*").index(ctas.first());
    const ctaPositionRatio = firstCTAIndex / totalElements;

    // Heuristic:
    // CTA should appear after ~10% of content but before last 90%
    if (ctaPositionRatio > 0.1 && ctaPositionRatio < 0.9) {
      return 1; // Flow aligns with user journey
    }

    return 0; // Too early or too late → not aligned
  } catch (error) {
    console.error("Error checking CTA flow alignment:", error.message);
    return 0;
  }
}

async function checkFormPresence(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "load", timeout: 60000 });

    // Evaluate page content for lead capture forms
    const formExists = await page.evaluate(() => {
      const forms = document.querySelectorAll("form");
      for (const form of forms) {
        const inputs = form.querySelectorAll("input, textarea, select");

        // Typical lead form fields
        const leadKeywords = ["name", "email", "phone", "contact", "message"];
        const hasLeadField = Array.from(inputs).some(input =>
          leadKeywords.some(keyword =>
            (input.name || input.id || input.placeholder || "").toLowerCase().includes(keyword)
          )
        );

        if (hasLeadField) return true;
      }
      return false;
    });

    await browser.close();
    return formExists ? 1 : 0;

  } catch (error) {
    console.error("Error checking form presence:", error);
    await browser.close();
    return 0;
  }
}

function checkFormLengthOptimal($) {
  try {
    // Select all forms on the page
    const forms = $("form");
    if (forms.length === 0) return 0; // No forms → fail (not applicable)

    let hasOptimalForm = false;

    forms.each((_, form) => {
      // Count total form fields (input, select, textarea)
      const fieldCount = $(form).find("input, select, textarea").length;

      // If any form has fewer than 5 fields, mark as optimal
      if (fieldCount > 0 && fieldCount < 5) {
        hasOptimalForm = true;
      }
    });

    return hasOptimalForm ? 1 : 0;
  } catch (err) {
    console.error("Error checking form length:", err.message);
    return 0;
  }
}

async function checkRequiredVsOptionalFields(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "load", timeout: 60000 });

    const distinctionExists = await page.evaluate(() => {
      const forms = document.querySelectorAll("form");
      let hasRequired = false;
      let hasOptional = false;

      for (const form of forms) {
        const inputs = form.querySelectorAll("input, textarea, select, label");

        for (const el of inputs) {
          const labelText =
            (el.textContent || el.innerText || "").toLowerCase().trim();

          // Check for required indication
          if (
            el.hasAttribute("required") ||
            labelText.includes("*") ||
            labelText.includes("required")
          ) {
            hasRequired = true;
          }

          // Check for optional indication
          if (
            labelText.includes("(optional)") ||
            labelText.includes("optional")
          ) {
            hasOptional = true;
          }
        }
      }

      // Clear distinction if both required and optional are marked
      return hasRequired && hasOptional;
    });

    await browser.close();
    return distinctionExists ? 1 : 0;
  } catch (error) {
    console.error("Error checking required vs optional fields:", error);
    await browser.close();
    return 0;
  }
}

function checkInlineValidation($) {
  try {
    const inputs = $("input, textarea, select");
    if (inputs.length === 0) return 0; // No form fields → skip

    let hasValidation = false;

    inputs.each((_, el) => {
      const elem = $(el);

      // Look for HTML5 validation attributes
      const hasHTML5Validation =
        elem.attr("required") ||
        elem.attr("pattern") ||
        elem.attr("minlength") ||
        elem.attr("maxlength") ||
        elem.attr("type") === "email" ||
        elem.attr("type") === "number";

      // Look for JS event handlers indicating inline validation
      const hasEventValidation =
        elem.attr("oninput") ||
        elem.attr("onchange") ||
        elem.attr("onblur");

      // Look for classes or ARIA attributes used for inline errors
      const hasErrorIndicators =
        elem.attr("aria-invalid") ||
        elem.hasClass("error") ||
        elem.hasClass("invalid") ||
        elem.next().text().toLowerCase().includes("error") ||
        elem.parent().text().toLowerCase().includes("invalid");

      if (hasHTML5Validation || hasEventValidation || hasErrorIndicators) {
        hasValidation = true;
        return false; // Stop loop early
      }
    });

    return hasValidation ? 1 : 0;
  } catch (err) {
    console.error("Error checking inline validation:", err.message);
    return 0;
  }
}

async function checkSubmitButtonClarity(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "load", timeout: 60000 });

    const clarityExists = await page.evaluate(() => {
      // Collect all possible button-like elements
      const buttons = Array.from(document.querySelectorAll("button, input[type='submit'], input[type='button']"));

      // Common clear CTA phrases
      const clearTexts = [
        "get quote",
        "subscribe",
        "sign up",
        "register",
        "send",
        "contact",
        "join now",
        "apply now",
        "book now",
        "download",
        "submit",
        "start free trial",
        "get started",
        "request demo",
        "enquire now",
        "message",
        "try now"
      ];

      for (const btn of buttons) {
        const text = (btn.innerText || btn.value || "").toLowerCase().trim();
        if (text) {
          // Check if button text matches any clear CTA phrases
          if (clearTexts.some(keyword => text.includes(keyword))) {
            return true;
          }
        }
      }
      return false;
    });

    await browser.close();
    return clarityExists ? 1 : 0;
  } catch (error) {
    console.error("Error checking submit button clarity:", error);
    await browser.close();
    return 0;
  }
}

function checkAutoFocusField($) {
  try {
    // Look for any input, textarea, or select with autofocus attribute
    const hasAutoFocus = $("input[autofocus], textarea[autofocus], select[autofocus]").length > 0;

    return hasAutoFocus ? 1 : 0;
  } catch (err) {
    console.error("Error checking autofocus field:", err.message);
    return 0;
  }
}

async function checkMultiStepFormProgress(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "load", timeout: 60000 });

    const progressExists = await page.evaluate(() => {
      const forms = document.querySelectorAll("form");

      for (const form of forms) {
        const steps = form.querySelectorAll("fieldset, .step, .form-step, .multi-step");
        if (steps.length > 1) {
          // Multi-step form detected, now check for progress indicator
          const progressTexts = Array.from(document.querySelectorAll("p, span, div, li"))
            .map(el => el.textContent.toLowerCase());

          const progressPatterns = [
            /step \d+ of \d+/,
            /progress/i,
            /\d+\s*\/\s*\d+/  // e.g., 1/3
          ];

          const hasIndicator = progressTexts.some(text =>
            progressPatterns.some(pattern => pattern.test(text))
          );

          if (hasIndicator) return true;
        }
      }
      return false;
    });

    await browser.close();
    return progressExists ? 1 : 0;

  } catch (error) {
    console.error("Error checking multi-step form progress:", error);
    await browser.close();
    return 0;
  }
}

function checkTestimonials($) {
  try {
    // Common keywords for testimonial containers
    const testimonialKeywords = ["testimonial", "review", "feedback", "client-say", "user-story"];

    // Look for elements whose class or id includes a keyword
    const testimonialElems = $("*").filter((_, el) => {
      const $el = $(el);
      const className = ($el.attr("class") || "").toLowerCase();
      const idName = ($el.attr("id") || "").toLowerCase();

      return testimonialKeywords.some(keyword => className.includes(keyword) || idName.includes(keyword));
    });

    // Check if at least one has readable text
    const hasReadableText = testimonialElems.toArray().some(el => {
      const text = $(el).text().trim();
      return text.length > 1; // Arbitrary minimum length for readability
    });

    return hasReadableText ? 1 : 0;
  } catch (err) {
    console.error("Error checking testimonials:", err.message);
    return 0;
  }
}

function checkTrustBadges($) {
  try {
    const badgeKeywords = ["trust", "secure", "ssl", "payment", "verified", "badge", "compliance", "certified"];

    // Check images
    const badgeImages = $("img").filter((_, el) => {
      const $el = $(el);
      const alt = ($el.attr("alt") || "").toLowerCase();
      const src = ($el.attr("src") || "").toLowerCase();
      const className = ($el.attr("class") || "").toLowerCase();
      const idName = ($el.attr("id") || "").toLowerCase();

      return badgeKeywords.some(keyword =>
        alt.includes(keyword) || src.includes(keyword) || className.includes(keyword) || idName.includes(keyword)
      );
    });

    // Check other elements (div/span with badge classes)
    const badgeElements = $("*").filter((_, el) => {
      const $el = $(el);
      const className = ($el.attr("class") || "").toLowerCase();
      const idName = ($el.attr("id") || "").toLowerCase();
      return badgeKeywords.some(keyword => className.includes(keyword) || idName.includes(keyword));
    });

    return badgeImages.length > 0 || badgeElements.length > 0 ? 1 : 0;
  } catch (err) {
    console.error("Error checking trust badges:", err.message);
    return 0;
  }
}

function checkReviewsVisible($) {
  try {
    const keywords = ["review", "rating", "stars", "testimonial", "feedback"];

    // Look for elements with class or id containing keywords
    const reviewElems = $("*").filter((_, el) => {
      const $el = $(el);
      const className = ($el.attr("class") || "").toLowerCase();
      const idName = ($el.attr("id") || "").toLowerCase();

      return keywords.some(kw => className.includes(kw) || idName.includes(kw));
    });

    // Check if at least one has visible content
    const hasContent = reviewElems.toArray().some(el => {
      const text = $(el).text().trim();
      return text.length > 1; // Minimum text length for visibility
    });

    return hasContent ? 1 : 0;
  } catch (err) {
    console.error("Error checking reviews/ratings:", err.message);
    return 0;
  }
}



async function checkClientLogos(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "load", timeout: 60000 });

    const logosExist = await page.evaluate(() => {
      // Common client/logo container selectors
      const logoSelectors = [
        ".client-logo",
        ".partner-logo",
        ".logos",
        ".clients",
        "[class*='logo']",
        "[class*='partner']"
      ];

      for (const selector of logoSelectors) {
        const elements = document.querySelectorAll(selector);

        for (const el of elements) {
          const style = window.getComputedStyle(el);

          // Check for <img> tags inside the element
          const imgs = el.querySelectorAll("img");
          for (const img of imgs) {
            const imgStyle = window.getComputedStyle(img);
            if (
              img.src &&
              img.src.trim() !== "" &&
              imgStyle.display !== "none" &&
              imgStyle.visibility !== "hidden" &&
              imgStyle.opacity !== "0"
            ) {
              return true;
            }
          }

          // Check for background images
          const bgImage = style.backgroundImage;
          if (bgImage && bgImage !== "none") {
            return true;
          }
        }
      }

      return false;
    });

    await browser.close();
    return logosExist ? 1 : 0;

  } catch (error) {
    console.error("Error checking client logos:", error);
    await browser.close();
    return 0;
  }
}

async function checkCaseStudiesAccessibility(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "load", timeout: 60000 });

    const accessible = await page.evaluate(() => {
      const keywords = [
        "case study",
        "success story",
        "client story",
        "project showcase",
        "customer story",
        "our work",
        "portfolio"
      ];

      // Check links, buttons, and sections
      const elements = Array.from(document.querySelectorAll("a, button, div, section, article"));

      for (const el of elements) {
        const style = window.getComputedStyle(el);
        const text = (el.innerText || "").toLowerCase().trim();

        if (
          text &&
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          style.opacity !== "0"
        ) {
          // If text matches any case study keyword
          if (keywords.some(keyword => text.includes(keyword))) {
            return true;
          }
        }
      }

      return false;
    });

    await browser.close();
    return accessible ? 1 : 0;

  } catch (error) {
    console.error("Error checking case studies accessibility:", error);
    await browser.close();
    return 0;
  }
}

async function checkExitIntentTriggers(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Helper for delay
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  try {
    await page.goto(url, { waitUntil: "load", timeout: 60000 });

    // Give the page some time to load scripts
    await delay(2000);

    // Simulate exit-intent: move mouse to top of page
    await page.mouse.move(100, 0); // move to top

    // Wait a moment for popups to appear
    await delay(2000);

    const popupDetected = await page.evaluate(() => {
      const popupSelectors = [
        ".popup",
        ".modal",
        ".exit-intent",
        ".offer",
        ".newsletter",
        "[class*='popup']",
        "[class*='modal']",
        "[class*='offer']"
      ];

      for (const selector of popupSelectors) {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
          const style = window.getComputedStyle(el);
          const text = (el.innerText || "").trim();

          if (text.length > 0 && style.display !== "none" && style.visibility !== "hidden" && style.opacity !== "0") {
            return true; // visible popup detected
          }
        }
      }

      return false;
    });

    await browser.close();
    return popupDetected ? 1 : 0;

  } catch (error) {
    console.error("Error checking exit-intent triggers:", error);
    await browser.close();
    return 0;
  }
}


async function checkLeadMagnets(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Helper for delay
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  try {
    await page.goto(url, { waitUntil: "load", timeout: 60000 });

    // Wait a bit for dynamic content
    await delay(2000);

    const leadMagnetExists = await page.evaluate(() => {
      const keywords = [
        "free ebook",
        "free guide",
        "trial",
        "download",
        "whitepaper",
        "case study",
        "cheatsheet",
        "template"
      ];

      // Check links, buttons, sections, divs
      const elements = Array.from(document.querySelectorAll("a, button, div, section, article"));

      for (const el of elements) {
        const style = window.getComputedStyle(el);
        const text = (el.innerText || "").toLowerCase().trim();

        if (
          text &&
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          style.opacity !== "0"
        ) {
          if (keywords.some(keyword => text.includes(keyword))) {
            return true;
          }
        }
      }

      return false;
    });

    await browser.close();
    return leadMagnetExists ? 1 : 0;

  } catch (error) {
    console.error("Error checking lead magnets:", error);
    await browser.close();
    return 0;
  }
}



function checkContactInfoVisibility($) {
  try {
    const pageText = $("body").text();

    // Simple regex for email
    const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
    const emailFound = emailRegex.test(pageText);

    // Simple regex for phone numbers (international & local)
    const phoneRegex = /(\+?\d{1,3}[-.\s]?|\()?\d{1,4}(\)|[-.\s]?)?\d{1,4}[-.\s]?\d{1,9}/g;
    const phoneFound = phoneRegex.test(pageText);

    return emailFound || phoneFound ? 1 : 0;
  } catch (err) {
    console.error("Error checking contact info visibility:", err.message);
    return 0;
  }
}

function checkChatbotPresence($) {
  try {
    const chatbotKeywords = ["tawk.to", "intercom", "drift", "livechat", "zendesk"];
    const elementKeywords = ["chat", "live-chat", "chat-widget", "support-widget"];

    // Check scripts
    const scripts = $("script").toArray();
    const scriptFound = scripts.some(el => {
      const src = ($(el).attr("src") || "").toLowerCase();
      return chatbotKeywords.some(kw => src.includes(kw));
    });

    // Check elements by class/id
    const elementsFound = $("*").toArray().some(el => {
      const className = ($(el).attr("class") || "").toLowerCase();
      const idName = ($(el).attr("id") || "").toLowerCase();
      return elementKeywords.some(kw => className.includes(kw) || idName.includes(kw));
    });

    return scriptFound || elementsFound ? 1 : 0;
  } catch (err) {
    console.error("Error checking chatbot/live chat:", err.message);
    return 0;
  }
}

async function checkInteractiveElements(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "load", timeout: 60000 });

    const interactiveExists = await page.evaluate(() => {
      // 1️⃣ Check for tooltips via attributes
      const tooltipElements = Array.from(document.querySelectorAll("[title], [aria-label], [data-tooltip]"));
      if (tooltipElements.some(el => el.offsetParent !== null)) {
        return true;
      }

      // 2️⃣ Check for hoverable elements (simple detection via CSS :hover in stylesheets)
      const hoverElements = Array.from(document.querySelectorAll("*")).filter(el => {
        const style = window.getComputedStyle(el);
        return style.transitionDuration !== "0s"; // rough approximation for hover effects
      });
      if (hoverElements.length > 0) return true;

      // 3️⃣ Check for sliders/carousels
      const sliderSelectors = [
        ".slider",
        ".carousel",
        ".swiper",
        "[class*='slider']",
        "[class*='carousel']"
      ];
      for (const selector of sliderSelectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) return true;
      }

      return false;
    });

    await browser.close();
    return interactiveExists ? 1 : 0;

  } catch (error) {
    console.error("Error checking interactive elements:", error);
    await browser.close();
    return 0;
  }
}

function checkPersonalization($) {
  try {
    const placeholderKeywords = ["{{username}}", "{{user_name}}", "{{email}}"];
    const dynamicKeywords = ["personalization", "recommendation", "recently-viewed", "suggested-for-you", "dynamic-content"];
    const scriptProviders = ["optimizely", "segment", "vwo", "dynamicyield"];

    // Check text placeholders in body
    const bodyText = $("body").text();
    const hasPlaceholders = placeholderKeywords.some(kw => bodyText.includes(kw));

    // Check elements with dynamic content keywords in class/id
    const dynamicElements = $("*").toArray().some(el => {
      const className = ($(el).attr("class") || "").toLowerCase();
      const idName = ($(el).attr("id") || "").toLowerCase();
      return dynamicKeywords.some(kw => className.includes(kw) || idName.includes(kw));
    });

    // Check script src for personalization providers
    const scriptFound = $("script").toArray().some(el => {
      const src = ($(el).attr("src") || "").toLowerCase();
      return scriptProviders.some(provider => src.includes(provider));
    });

    return hasPlaceholders || dynamicElements || scriptFound ? 1 : 0;
  } catch (err) {
    console.error("Error checking personalization:", err.message);
    return 0;
  }
}

function checkProgressIndicators($) {
  try {
    const keywords = ["progress", "step", "wizard", "form-step", "progress-bar", "multi-step"];

    // Check for native <progress> elements
    const nativeProgress = $("progress").length > 0;

    // Check for elements with keywords in class or id
    const keywordElements = $("*").filter((_, el) => {
      const className = ($(el).attr("class") || "").toLowerCase();
      const idName = ($(el).attr("id") || "").toLowerCase();
      return keywords.some(kw => className.includes(kw) || idName.includes(kw));
    });

    return nativeProgress || keywordElements.length > 0 ? 1 : 0;
  } catch (err) {
    console.error("Error checking progress indicators:", err.message);
    return 0;
  }
}

function checkFriendlyErrorHandling($) {
  try {
    const inputs = $("input, textarea, select");
    if (inputs.length === 0) return 0;

    const errorKeywords = ["error", "invalid", "help-block", "error-message", "warning"];
    const messageKeywords = ["please", "required", "invalid", "must be", "enter a valid"];

    let hasFriendlyError = false;

    inputs.each((_, el) => {
      const $el = $(el);

      // HTML5 validation attributes
      const hasValidationAttr = $el.attr("required") || $el.attr("pattern") || $el.attr("minlength") || $el.attr("maxlength");

      // Check nearby sibling or parent for error-related classes or text
      const parentText = $el.parent().text().toLowerCase();
      const siblingText = $el.next().text().toLowerCase();
      const hasErrorText = messageKeywords.some(kw => parentText.includes(kw) || siblingText.includes(kw));

      const hasErrorClass = errorKeywords.some(kw => {
        const className = ($el.attr("class") || "").toLowerCase();
        const parentClass = ($el.parent().attr("class") || "").toLowerCase();
        return className.includes(kw) || parentClass.includes(kw);
      });

      if (hasValidationAttr || hasErrorText || hasErrorClass) {
        hasFriendlyError = true;
        return false; // Stop loop early
      }
    });

    return hasFriendlyError ? 1 : 0;
  } catch (err) {
    console.error("Error checking friendly error handling:", err.message);
    return 0;
  }
}

function checkMicrocopyClarity($) {
  try {
    const inputs = $("input, textarea, select");
    if (inputs.length === 0) return 0;

    let hasClarity = false;

    inputs.each((_, el) => {
      const $el = $(el);

      // Check for associated <label>
      const id = $el.attr("id");
      const hasLabel = id && $(`label[for="${id}"]`).length > 0;

      // Check for placeholder text
      const hasPlaceholder = $el.attr("placeholder") && $el.attr("placeholder").trim().length > 5;

      // Check for helper text nearby
      const helperText = $el.next("small, .help-text, .form-text").text().trim();
      const hasHelperText = helperText.length > 10;

      if (hasLabel || hasPlaceholder || hasHelperText) {
        hasClarity = true;
        return false; // Stop loop early
      }
    });

    return hasClarity ? 1 : 0;
  } catch (err) {
    console.error("Error checking microcopy clarity:", err.message);
    return 0;
  }
}

function checkIncentivesDisplayed($) {
  try {
    const keywords = ["discount", "free trial", "limited offer", "save", "deal", "promo", "offer"];

    // Get all visible text from the body
    const bodyText = $("body").text().toLowerCase();

    // Check if any keyword is present
    const found = keywords.some(kw => bodyText.includes(kw));

    return found ? 1 : 0;
  } catch (err) {
    console.error("Error checking incentives:", err.message);
    return 0;
  }
}

function checkScarcityUrgency($) {
  try {
    const keywords = ["limited stock", "only", "left", "hurry", "ends in", "countdown", "sale ends"];
    const elementKeywords = ["timer", "countdown", "stock", "urgency"];

    // Check visible text
    const bodyText = $("body").text().toLowerCase();
    const textFound = keywords.some(kw => bodyText.includes(kw));

    // Check element classes and ids
    const elementFound = $("*").toArray().some(el => {
      const className = ($(el).attr("class") || "").toLowerCase();
      const idName = ($(el).attr("id") || "").toLowerCase();
      return elementKeywords.some(kw => className.includes(kw) || idName.includes(kw));
    });

    return textFound || elementFound ? 1 : 0;
  } catch (err) {
    console.error("Error checking scarcity/urgency:", err.message);
    return 0;
  }
}

function checkSmoothScrolling($) {
  try {
    // Anchor links
    const anchorLinks = $('a[href^="#"]').length > 0;

    // CSS smooth scrolling
    const smoothCss = $('[style*="scroll-behavior: smooth"]').length > 0;

    // Inline JS smooth scrolling
    const scriptSmooth = $("script").toArray().some(el => {
      const scriptContent = $(el).html() || "";
      return scriptContent.includes('scrollIntoView') && scriptContent.includes('smooth');
    });

    return anchorLinks || smoothCss || scriptSmooth ? 1 : 0;
  } catch (err) {
    console.error("Error checking smooth scrolling:", err.message);
    return 0;
  }
}

function checkMobileCTAAdaptation($) {
  try {
    const ctaKeywords = ["cta", "button", "primary", "btn", "submit"];

    const ctas = $("a, button").toArray();

    const mobileFriendlyCTA = ctas.some(el => {
      const $el = $(el);
      const className = ($el.attr("class") || "").toLowerCase();
      const idName = ($el.attr("id") || "").toLowerCase();
      const style = ($el.attr("style") || "").toLowerCase();

      // Heuristic: contains CTA keyword and has inline padding/height or large button class
      const hasCTAClass = ctaKeywords.some(kw => className.includes(kw) || idName.includes(kw));
      const hasLargeStyle = /padding|height|font-size/.test(style) || /btn-lg|large|mobile/.test(className);

      return hasCTAClass && hasLargeStyle;
    });

    return mobileFriendlyCTA ? 1 : 0;
  } catch (err) {
    console.error("Error checking mobile CTA adaptation:", err.message);
    return 0;
  }
}

function checkMultiChannelFollowUp($) {
  try {
    const links = $("a").toArray();

    const channelDetected = links.some(el => {
      const $el = $(el);
      const href = ($el.attr("href") || "").toLowerCase();
      return href.startsWith("mailto:") || href.startsWith("tel:") || href.includes("wa.me") || href.includes("api.whatsapp.com/send");
    });

    return channelDetected ? 1 : 0;
  } catch (err) {
    console.error("Error checking multi-channel follow-up prompts:", err.message);
    return 0;
  }
}

export default async function conversionLeadFlow(url,page) {

      await page.goto(url, {waitUntil: "networkidle2",timeout: 240000});
      await page.waitForSelector("body", { timeout: 240000 });
      const htmlData = await page.content();
      const $ = cheerio.load(htmlData);
  const report = {};

  const checkCTAsScore=checkCTAs($)
  console.log("CTA Visibility Score:", checkCTAsScore);


  const checkCTAClarityScore=checkCTAClarity($);
  console.log("CTA Clarity Score:", checkCTAClarityScore);
  
  const checkCTAContrastScore=await checkCTAContrast(url);
  console.log("CTA Contrast Score:", checkCTAContrastScore);

  const checkCTACrowdingScore=await checkCTACrowding(url);
  console.log("CTA Crowding Score:", checkCTACrowdingScore);

  const checkCTAFlowAlignmentScore=checkCTAFlowAlignment($);
    console.log("CTA Flow Alignment Score:", checkCTAFlowAlignmentScore);

  const checkFormPresenceScore=await checkFormPresence(url);
  console.log("Form Presence Score:", checkFormPresenceScore);

  
   let checkFormLengthOptimalScore;
   let checkRequiredVsOptionalFieldsScore
   let checkInlineValidationScore
   let checkSubmitButtonClarityScore
   let checkAutoFocusFieldScore
   let checkMultiStepFormProgressScore

  if(checkFormPresenceScore===0){
checkFormLengthOptimalScore=1;
checkRequiredVsOptionalFieldsScore=1;
checkInlineValidationScore=1;
checkSubmitButtonClarityScore=1;
checkAutoFocusFieldScore=1;
checkMultiStepFormProgressScore=1;
  }
else{

checkFormLengthOptimalScore=checkFormLengthOptimal($);
checkRequiredVsOptionalFieldsScore=await checkRequiredVsOptionalFields(url);
checkInlineValidationScore=checkInlineValidation($);
checkSubmitButtonClarityScore=await checkSubmitButtonClarity(url);
checkAutoFocusFieldScore=checkAutoFocusField($);
checkMultiStepFormProgressScore=await checkMultiStepFormProgress(url);
}



console.log("Form Length Optimal Score:", checkFormLengthOptimalScore);
console.log("Required vs Optional Fields Score:", checkRequiredVsOptionalFieldsScore);
console.log("Inline Validation Score:", checkInlineValidationScore);
console.log("Submit Button Clarity Score:", checkSubmitButtonClarityScore);
console.log("AutoFocus Field Score:", checkAutoFocusFieldScore);
console.log("Multi-Step Form Progress Score:", checkMultiStepFormProgressScore);


const checkTestimonialsScore=checkTestimonials($);
console.log("Testimonials Score:", checkTestimonialsScore);

const checkReviewsVisibleScore=checkReviewsVisible($);
console.log("Reviews/ Ratings Visible Score:", checkReviewsVisibleScore);

const checkTrustBadgesScore=checkTrustBadges($);
console.log("Trust Badges Score:", checkTrustBadgesScore);

const checkClientLogosScore=await checkClientLogos(url);
console.log("Client Logos Score:", checkClientLogosScore);

const checkCaseStudiesAccessibilityScore=await checkCaseStudiesAccessibility(url);
console.log("Case Studies Accessibility Score:", checkCaseStudiesAccessibilityScore);

const checkExitIntentTriggersScore=await checkExitIntentTriggers(url);
console.log("Exit-Intent Triggers Score:", checkExitIntentTriggersScore);

const checkLeadMagnetsScore=await checkLeadMagnets(url);
console.log("Lead Magnets Score:", checkLeadMagnetsScore);

const checkContactInfoVisibilityScore=checkContactInfoVisibility($);
console.log("Contact Info Visibility Score:", checkContactInfoVisibilityScore);

const checkChatbotPresenceScore=checkChatbotPresence($);
console.log("Chatbot/ Live Chat Presence Score:", checkChatbotPresenceScore);

const checkInteractiveElementsScore=await checkInteractiveElements(url);
console.log("Interactive Elements Score:", checkInteractiveElementsScore);

const checkPersonalizationScore=checkPersonalization($);
console.log("Personalization Score:", checkPersonalizationScore);

const checkProgressIndicatorsScore=checkProgressIndicators($);
console.log("Progress Indicators Score:", checkProgressIndicatorsScore);

const checkFriendlyErrorHandlingScore=checkFriendlyErrorHandling($);
console.log("Friendly Error Handling Score:", checkFriendlyErrorHandlingScore);

const checkMicrocopyClarityScore=checkMicrocopyClarity($);
console.log("Microcopy Clarity Score:", checkMicrocopyClarityScore);

const checkIncentivesDisplayedScore=checkIncentivesDisplayed($);    
console.log("Incentives Displayed Score:", checkIncentivesDisplayedScore);

const checkScarcityUrgencyScore=checkScarcityUrgency($);
console.log("Scarcity/ Urgency Score:", checkScarcityUrgencyScore);

const checkSmoothScrollingScore=checkSmoothScrolling($);
console.log("Smooth Scrolling Score:", checkSmoothScrollingScore);

const checkMobileCTAAdaptationScore=checkMobileCTAAdaptation($);
console.log("Mobile CTA Adaptation Score:", checkMobileCTAAdaptationScore);

const checkMultiChannelFollowUpScore=checkMultiChannelFollowUp($);
console.log("Multi-Channel Follow-Up Prompts Score:", checkMultiChannelFollowUpScore);

// Collect all the scores in an array
const allScores = [
  checkCTAsScore.score,
  checkCTAClarityScore.score,
  checkCTAContrastScore.score,
  checkCTACrowdingScore.score,
  checkCTAFlowAlignmentScore,
  checkFormPresenceScore,
  checkFormLengthOptimalScore,
  checkRequiredVsOptionalFieldsScore,
  checkInlineValidationScore,
  checkSubmitButtonClarityScore,
  checkAutoFocusFieldScore,
  checkMultiStepFormProgressScore,
  checkTestimonialsScore,
  checkReviewsVisibleScore,
  checkTrustBadgesScore,
  checkClientLogosScore,
  checkCaseStudiesAccessibilityScore,
  checkExitIntentTriggersScore,
  checkLeadMagnetsScore,
  checkContactInfoVisibilityScore,
  checkChatbotPresenceScore,
  checkInteractiveElementsScore,
  checkPersonalizationScore,
  checkProgressIndicatorsScore,
  checkFriendlyErrorHandlingScore,
  checkMicrocopyClarityScore,
  checkIncentivesDisplayedScore,
  checkScarcityUrgencyScore,
  checkSmoothScrollingScore,
  checkMobileCTAAdaptationScore,
  checkMultiChannelFollowUpScore
];

// Sum all the scores
const totalScore = allScores.reduce((acc, score) => acc + score, 0);

// Calculate percentage
const maxScorePerMetric = 1; // Assuming each metric is out of 1
const percentageScore = (totalScore / allScores.length) * 100;

console.log("Total Score:", totalScore);
console.log("Overall Percentage:", percentageScore.toFixed(2) + "%");



  return report;
}