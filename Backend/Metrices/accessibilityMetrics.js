import AxePuppeteer from "@axe-core/puppeteer";

export default async function accessibilityMetrics(url,page) {

  await page.setRequestInterception(true);
  page.on("request", (request) => {
    const blockedResources = ["image", "stylesheet", "font"];
    if (blockedResources.includes(request.resourceType())) {
      request.abort();
    } else {
      request.continue();
    }
  });

  try {
    await page.goto(url, {
      waitUntil: "networkidle2", 
      timeout: 240000,         
    });
  } catch (err) {
    console.error("Page navigation failed:", err.message);
    await browser.close();
    return { error: "Page failed to load" };
  }

  let results;
  try {
    results = await new AxePuppeteer(page).analyze();
  } catch (err) {
    console.error("Axe analysis failed:", err.message);
    results = { violations: [] };
  } 

function calculatePassRate(results, ruleIds) {
  
  const relevant = results.violations.filter(v => ruleIds.includes(v.id));
  if (relevant.length === 0) return 1; 

  let failedNodes = 0;
  relevant.forEach(rule => {
    failedNodes += rule.nodes.length;
  });
  const totalNodes = relevant.reduce((acc, r) => acc + r.nodes.length, 0) || 1;
  const passRate = 1 - failedNodes / totalNodes;

  return passRate ? 1 : 0;
}

  async function Landmarks(page) {
    const landmarks = await page.$$(
      '[role="banner"], [role="main"], [role="contentinfo"], [role="navigation"], [role="complementary"]'
    );
    return landmarks.length > 0 ? 1 : 0;
  }

  const colorContrast = calculatePassRate(results, ["color-contrast"]);
  const focusOrder = calculatePassRate(results, ["focus-order"]);
  const focusableContent = calculatePassRate(results, ["focusable-content"]);
  const tabindex = calculatePassRate(results, ["tabindex"]);
  const interactiveElementAffordance = calculatePassRate(results, ["interactive-element-affordance"]);
  const label = calculatePassRate(results, ["label"]);
  const ariaAllowedAttr = calculatePassRate(results, ["aria-allowed-attr"]);
  const ariaRoles = calculatePassRate(results, ["aria-roles"]);
  const ariaHiddenFocus = calculatePassRate(results, ["aria-hidden-focus"]);
  const imageAlt = calculatePassRate(results, ["image-alt"]);
  const skipLinks = await page.$('a[href^="#"]:not([hidden])') ? 0 : 1
  const landMarks = await Landmarks(page);

  const Total = colorContrast+focusOrder+focusableContent+tabindex+interactiveElementAffordance+label+ariaAllowedAttr+ariaRoles+ariaHiddenFocus+imageAlt+skipLinks+landMarks

  // Warning
  const warning = [];

if (colorContrast === 0) {
  warning.push({
    metric: "Color Contrast",
    current: "Insufficient contrast detected",
    recommended: "Ensure sufficient contrast between text and background (WCAG AA standard)",
    severity: "High 🔴",
    suggestion: "Adjust text and background colors to improve readability for all users."
  });
}

if (focusOrder === 0) {
  warning.push({
    metric: "Focus Order",
    current: "Incorrect tab/focus order",
    recommended: "Logical focus sequence following the DOM order",
    severity: "Medium 🟡",
    suggestion: "Ensure that keyboard navigation follows a logical and intuitive order."
  });
}

if (focusableContent === 0) {
  warning.push({
    metric: "Focusable Content",
    current: "Focusable elements not accessible",
    recommended: "All interactive elements must be focusable",
    severity: "Medium 🟡",
    suggestion: "Add proper focus handling to all interactive elements."
  });
}

if (tabindex === 0) {
  warning.push({
    metric: "Tabindex",
    current: "Invalid tabindex usage",
    recommended: "Use tabindex correctly (avoid >0 values unless necessary)",
    severity: "Medium 🟡",
    suggestion: "Correct tabindex attributes to maintain proper navigation order."
  });
}

if (interactiveElementAffordance === 0) {
  warning.push({
    metric: "Interactive Element Affordance",
    current: "Interactive elements lack visual cues",
    recommended: "Provide clear affordance (buttons, links visually distinct)",
    severity: "Medium 🟡",
    suggestion: "Ensure clickable elements look interactive (e.g., hover, focus styles)."
  });
}

if (label === 0) {
  warning.push({
    metric: "Form Labels",
    current: "Form inputs missing labels",
    recommended: "All form elements must have descriptive labels",
    severity: "High 🔴",
    suggestion: "Add <label> or aria-label attributes to improve accessibility."
  });
}

if (ariaAllowedAttr === 0) {
  warning.push({
    metric: "ARIA Allowed Attributes",
    current: "Invalid ARIA attributes used",
    recommended: "Use only valid ARIA attributes",
    severity: "Medium 🟡",
    suggestion: "Remove or correct invalid ARIA attributes for compliance."
  });
}

if (ariaRoles === 0) {
  warning.push({
    metric: "ARIA Roles",
    current: "Incorrect ARIA roles",
    recommended: "Use valid ARIA roles for elements",
    severity: "Medium 🟡",
    suggestion: "Assign correct ARIA roles according to element purpose."
  });
}

if (ariaHiddenFocus === 0) {
  warning.push({
    metric: "Hidden Focusable Elements",
    current: "Hidden elements receive focus",
    recommended: "Hidden elements should not be focusable",
    severity: "Medium 🟡",
    suggestion: "Ensure elements with aria-hidden=true are removed from focus order."
  });
}

if (imageAlt === 0) {
  warning.push({
    metric: "Image Alt Text",
    current: "Images missing descriptive alt text",
    recommended: "All images should have meaningful alt attributes",
    severity: "High 🔴",
    suggestion: "Add descriptive alt text to all meaningful images for accessibility and SEO."
  });
}

if (skipLinks === 0) {
  warning.push({
    metric: "Skip Links",
    current: "Skip links missing",
    recommended: "Provide skip navigation links",
    severity: "Low 🟢",
    suggestion: "Add a skip-to-content link for keyboard users to improve navigation."
  });
}

if (landMarks === 0) {
  warning.push({
    metric: "Landmark Roles",
    current: "No landmark roles present",
    recommended: "Include banner, main, contentinfo, navigation, complementary roles",
    severity: "Medium 🟡",
    suggestion: "Add ARIA landmark roles to improve screen reader navigation."
  });
}

  const actualPercentage = parseFloat((((Total)/12)*100).toFixed(0));

  // console.log(actualPercentage);
  // console.log(warning);
  // console.log(Total);

  return {
    colorContrast,
    focusOrder,
    focusableContent,
    tabindex,
    interactiveElementAffordance,
    label,
    ariaAllowedAttr,
    ariaRoles,
    ariaHiddenFocus,
    imageAlt,
    skipLinks,
    landMarks,
    actualPercentage,warning,
    Total
  };
}

