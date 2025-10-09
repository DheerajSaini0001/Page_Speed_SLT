import * as cheerio from "cheerio";

// Navigation clarity – Menus clear & logically grouped (0/1)
function checkNavigationClarity($) {
    const nav = $('nav'); // select main nav
    if (nav.length === 0) return 0; // no navigation → 0

    const menuItems = nav.find('li, a'); // get all menu items
    if (menuItems.length === 0) return 0; // empty menu → 0

    // Check if each menu item has text and is unique
    const texts = [];
    menuItems.each((i, el) => {
        const text = $(el).text().trim();
        if (text) texts.push(text);
    });

    const uniqueTexts = new Set(texts);
    if (uniqueTexts.size !== texts.length) return 0; // repeated items → 0
    if (texts.length !== menuItems.length) return 0; // some empty → 0

    return 1; // menus exist, labeled, unique → 1
}

function checkBreadcrumbs($) {
    // Try to find typical breadcrumb containers
    const breadcrumbSelectors = [
        '.breadcrumb',      // common class
        'nav[aria-label="breadcrumb"]', // accessibility-friendly
        '.breadcrumbs',     // alternative class
        'ol.breadcrumb',    // ordered list breadcrumbs
        'ul.breadcrumb'     // unordered list breadcrumbs
    ];

    let breadcrumbFound = false;

    for (const selector of breadcrumbSelectors) {
        const breadcrumbs = $(selector);
        if (breadcrumbs.length > 0) {
            // Check if it has at least one visible item with text
            const items = breadcrumbs.find('li, a, span');
            const hasTextItem = items.toArray().some(el => $(el).text().trim() !== '');
            if (hasTextItem) {
                breadcrumbFound = true;
                break;
            }
        }
    }

    return breadcrumbFound ? 1 : 0;
}

function checkClickableLogo($, baseDomain) {
    // Find common logo selectors
    const logoSelectors = [
        'a.logo',
        'a.site-logo',
        'a[href]',
        'header a img',
        '.navbar-brand',
        'a[aria-label*="logo" i]',
        'a img[alt*="logo" i]'
    ];

    let foundClickableLogo = false;

    for (const selector of logoSelectors) {
        const logoLink = $(selector).first();

        if (logoLink.length > 0) {
            // If it's an <a> tag wrapping an <img> or text
            const href = logoLink.attr('href');

            if (href) {
                // Normalize the href and compare with baseDomain or home path
                if (
                    href === '/' ||
                    href === './' ||
                    href === '#' ||
                    href.includes(baseDomain)
                ) {
                    foundClickableLogo = true;
                    break;
                }
            }
        }
    }

    return foundClickableLogo ? 1 : 0;
}

function checkMobileResponsiveness($) {
    // 1. Check for viewport meta tag
    const viewport = $('meta[name="viewport"]').attr('content');
    const hasViewport = viewport && viewport.includes('width=device-width');

    // 2. Check if CSS includes media queries
    const hasMediaQueries = $('style, link[rel="stylesheet"]').toArray().some(el => {
        const elTag = $(el).prop('tagName').toLowerCase();
        if (elTag === 'style') {
            return $(el).html().includes('@media');
        } else if (elTag === 'link') {
            // basic pattern for responsive stylesheets
            const href = $(el).attr('href') || '';
            return href.toLowerCase().includes('responsive') || href.toLowerCase().includes('mobile');
        }
        return false;
    });

    return hasViewport && hasMediaQueries ? 1 : 0;
}

// readability
function checkParagraphLengthAndSpacing($) {
    const paragraphs = $('p');
    if (paragraphs.length === 0) return 0; // no paragraphs → 0

    let totalWords = 0;
    let tooLongCount = 0;

    paragraphs.each((i, el) => {
        const text = $(el).text().trim();
        const wordCount = text.split(/\s+/).length;

        totalWords += wordCount;
        if (wordCount > 120) tooLongCount++; // paragraph too long
    });

    const avgWords = totalWords / paragraphs.length;

    // Rule of thumb:
    // ✅ Ideal paragraph length: 40–120 words
    // ❌ If avg > 120 or >30% of paragraphs too long → 0
    if (avgWords <= 120 && tooLongCount / paragraphs.length <= 0.3) {
        return 1; // good readability
    } else {
        return 0; // too long paragraphs
    }
}

function checkFontStyleAndSizeConsistency($) {
    // Collect all inline font styles (for <p>, <h1>-<h6>, <span>, <div>)
    const elements = $('p, h1, h2, h3, h4, h5, h6, span, div');

    if (elements.length === 0) return 0; // no text elements → 0

    const fontFamilies = [];
    const fontSizes = [];

    elements.each((i, el) => {
        const style = ($(el).attr('style') || '').toLowerCase();

        // extract font-family
        const familyMatch = style.match(/font-family\s*:\s*([^;]+)/);
        if (familyMatch) fontFamilies.push(familyMatch[1].trim());

        // extract font-size
        const sizeMatch = style.match(/font-size\s*:\s*([\d.]+)(px|em|rem|pt)?/);
        if (sizeMatch) fontSizes.push(parseFloat(sizeMatch[1]));
    });

    // If no font info found, assume consistent (likely defined in CSS)
    if (fontFamilies.length === 0 && fontSizes.length === 0) return 1;

    // Check font-family consistency
    const uniqueFamilies = new Set(fontFamilies);
    const consistentFamily = uniqueFamilies.size <= 2; // small variations allowed

    // Check font-size consistency
    if (fontSizes.length === 0) return consistentFamily ? 1 : 0;
    const avgSize = fontSizes.reduce((a, b) => a + b, 0) / fontSizes.length;
    const inconsistentCount = fontSizes.filter(size => Math.abs(size - avgSize) > 2).length;
    const consistentSize = inconsistentCount / fontSizes.length <= 0.2;

    return consistentFamily && consistentSize ? 1 : 0;
}

function getLuminance(color) {
    if (!color) return 1; // default white
    let r, g, b;

    if (color.startsWith('#')) {
        const hex = color.replace('#', '');
        if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
        } else {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        }
    } else if (color.startsWith('rgb')) {
        const nums = color.match(/\d+/g).map(Number);
        [r, g, b] = nums;
    } else {
        // unknown or named color → assume readable
        return 1;
    }

    [r, g, b] = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Compute contrast ratio
function contrastRatio(fg, bg) {
    const L1 = getLuminance(fg);
    const L2 = getLuminance(bg);
    const lighter = Math.max(L1, L2);
    const darker = Math.min(L1, L2);
    return (lighter + 0.05) / (darker + 0.05);
}

function checkContrastAndColorHarmony($) {
    const elements = $('p, span, div, h1, h2, h3, h4, h5, h6');
    if (elements.length === 0) return 0;

    let lowContrastCount = 0;
    let totalChecked = 0;

    elements.each((i, el) => {
        const style = ($(el).attr('style') || '').toLowerCase();
        const colorMatch = style.match(/color\s*:\s*([^;]+)/);
        const bgMatch = style.match(/background(-color)?\s*:\s*([^;]+)/);

        const fg = colorMatch ? colorMatch[1].trim() : '#000000';
        const bg = bgMatch ? bgMatch[2].trim() : '#ffffff';

        const ratio = contrastRatio(fg, bg);
        totalChecked++;

        if (ratio < 4.5) lowContrastCount++;
    });

    // Pass condition: at least 80% elements have acceptable contrast
    const acceptable = (lowContrastCount / totalChecked) <= 0.2;
    return acceptable ? 1 : 0;
}

function checkWhitespaceUsage($) {
  const elements = $('div, section, article, p, h1, h2, h3, h4, h5, h6');
  if (elements.length === 0) return 0;

  let spacedCount = 0;
  let totalChecked = 0;

  elements.each((i, el) => {
    const style = ($(el).attr('style') || '').toLowerCase();

    // Extract inline margin/padding if available
    const marginMatch = style.match(/margin\s*:\s*([0-9]+)px/);
    const paddingMatch = style.match(/padding\s*:\s*([0-9]+)px/);

    const margin = marginMatch ? parseInt(marginMatch[1]) : 0;
    const padding = paddingMatch ? parseInt(paddingMatch[1]) : 0;

    // if either margin or padding ≥ 8px, consider it well spaced
    if (margin >= 8 || padding >= 8) spacedCount++;
    totalChecked++;
  });

  const ratio = spacedCount / totalChecked;
  return ratio >= 0.6 ? 1 : 0; // Pass if 60% of blocks have enough space
}

// Content and Engagement flow

function checkContentRelevance($) {
    // 1️⃣ Get page title
    const title = $('title').text().trim().toLowerCase();
    if (!title) return 0;

    // 2️⃣ Get main page content text
    const content = $('p, li, h1, h2, h3').text().trim().toLowerCase();
    if (!content) return 0;

    // 3️⃣ Split title into keywords
    const titleWords = title.split(/\s+/).filter(w => w.length > 2); // ignore small words

    // 4️⃣ Count how many title words appear in content
    let matchCount = 0;
    titleWords.forEach(word => {
        if (content.includes(word)) matchCount++;
    });

    // 5️⃣ Compute ratio
    const relevanceRatio = titleWords.length > 0 ? matchCount / titleWords.length : 0;

    // 6️⃣ Threshold: ≥50% title words appear in content → relevant
    return relevanceRatio >= 0.5 ? 1 : 0;
}

function checkCallToActionClarity($) {
    // Find common CTA elements
    const ctas = $('button, a, input[type="button"], input[type="submit"]');
    if (ctas.length === 0) return 0; // no CTA → 0

    let validCTA = 0;

    ctas.each((i, el) => {
        let text = '';
        const tag = el.tagName.toLowerCase();

        if (tag === 'button' || tag === 'a') {
            text = $(el).text().trim();
        } else if (tag === 'input') {
            text = $(el).attr('value') ? $(el).attr('value').trim() : '';
        }

        // Consider it purposeful if text length ≥3 (not empty/generic)
        if (text.length >= 3) validCTA++;
    });

    // Pass if at least 1 visible, labeled CTA exists
    return validCTA >= 1 ? 1 : 0;
}



function checkMultimediaBalance($) {
    const textElements = $('p, h1, h2, h3, h4, h5, h6, li');
    const mediaElements = $('img, video, iframe');

    const textCount = textElements.length;
    const mediaCount = mediaElements.length;

    if (textCount === 0) return 0; // no text → not balanced

    const ratio = textCount / (mediaCount + 1); // +1 to avoid division by 0

    // Rule of thumb: at least 1 text element per media element
    return ratio >= 1 ? 1 : 0;
}

function checkInternalLinkingQuality($, domain) {
    const links = $('a[href]').map((i, el) => $(el).attr('href')).get();

    if (links.length === 0) return 0; // no links → fail

    // Filter internal links
    const internalLinks = links.filter(link => {
        return link.startsWith('/') || link.includes(domain);
    });

    if (internalLinks.length === 0) return 0; // no internal links → fail

    // Optional: check logical flow using keywords
    const pageKeywords = $('h1, h2, h3').text().toLowerCase().split(/\s+/);
    let relevantLinkCount = 0;

    internalLinks.forEach(link => {
        const lowerLink = link.toLowerCase();
        // simple heuristic: link URL contains any keyword from headings
        if (pageKeywords.some(word => word.length > 3 && lowerLink.includes(word))) {
            relevantLinkCount++;
        }
    });

    // Pass if at least 1 internal link matches page keywords → logical flow
    return relevantLinkCount >= 1 ? 1 : 0;
}

function checkUserJourneyContinuity($) {
    // Find potential next-step elements
    const ctas = $('button, a, input[type="button"], input[type="submit"]');

    if (ctas.length === 0) return 0; // no next step → fail

    let validCTA = 0;

    ctas.each((i, el) => {
        let text = '';
        const tag = el.tagName.toLowerCase();

        if (tag === 'button' || tag === 'a') {
            text = $(el).text().trim();
        } else if (tag === 'input') {
            text = $(el).attr('value') ? $(el).attr('value').trim() : '';
        }

        // Consider valid if text indicates action (length ≥3)
        if (text.length >= 3) validCTA++;
    });

    // Pass if at least 1 valid CTA exists
    return validCTA >= 1 ? 1 : 0;
}

// Accessability and Usability Extras
function checkInteractiveFeedback($) {
    // 1️⃣ Check for hover/active styles (inline or class)
    const interactiveElements = $('button, a, input[type="submit"], input[type="button"]');

    let feedbackFound = false;

    interactiveElements.each((i, el) => {
        const style = ($(el).attr('style') || '').toLowerCase();
        const classNames = ($(el).attr('class') || '').toLowerCase();

        // Heuristic: if inline hover-like styles exist or class names include common feedback keywords
        if (style.includes('hover') || style.includes('active') ||
            classNames.includes('hover') || classNames.includes('active') || 
            classNames.includes('focus')) {
            feedbackFound = true;
        }
    });

    // 2️⃣ Check forms for submission feedback messages
    const feedbackMessages = $('form + div, form + span, .error, .success, .message');
    if (feedbackMessages.length > 0) feedbackFound = true;

    // 3️⃣ Check for onclick attributes (click feedback)
    if ($('[onclick]').length > 0) feedbackFound = true;

    return feedbackFound ? 1 : 0;
}


function checkScrollDepthLogic($) {
    // 1️⃣ Identify long pages
    const headings = $('h2, h3');
    const paragraphs = $('p');
    const isLongPage = headings.length >= 10 || paragraphs.length >= 20;
    
    if (!isLongPage) return 1; // short page → automatically pass

    // 2️⃣ Check for Table of Contents (links to internal anchors)
    const tocLinks = $('a[href^="#"]');
    const tocExists = tocLinks.length > 0;

    // 3️⃣ Check for Back-to-top button/link
    const backToTop = $('a[href="#top"], button.back-to-top, .back-to-top');
    const backToTopExists = backToTop.length > 0;

    // Pass if TOC or Back-to-top exists
    return (tocExists || backToTopExists) ? 1 : 0;
}

function checkErrorEmptyState($) {
    // 1️⃣ Extract body text
    const bodyText = $('body').text().trim().toLowerCase();

    if (!bodyText) return 0; // completely empty → fail

    // 2️⃣ Check for common empty/error state keywords
    const keywords = ['404', 'not found', 'page not found', 'no results', 'empty', 'nothing here'];
    const hasKeyword = keywords.some(kw => bodyText.includes(kw));

    if (!hasKeyword) return 0; // no helpful messaging → fail

    // 3️⃣ Check for next-step guidance (button or link)
    const guidance = $('a, button, input[type="button"], input[type="submit"]').filter((i, el) => {
        const text = $(el).text().trim().toLowerCase() || $(el).attr('value')?.trim().toLowerCase();
        return text && text.length >= 3; // some guidance text
    });

    return guidance.length > 0 ? 1 : 0; // 1 = helpful, 0 = unhelpful
}

function checkStickyNavigation($) {
    // Find common navigation elements
    const navElements = $('nav, .navbar, .menu, .header');

    if (navElements.length === 0) return 0; // no nav → fail

    let stickyFound = false;

    navElements.each((i, el) => {
        const style = ($(el).attr('style') || '').toLowerCase();
        const classes = ($(el).attr('class') || '').toLowerCase();

        // 1️⃣ Check inline CSS for sticky/fixed
        if (style.includes('position: sticky') || style.includes('position: fixed')) {
            stickyFound = true;
        }

        // 2️⃣ Check class names indicating sticky (common naming conventions)
        if (classes.includes('sticky') || classes.includes('fixed')) {
            stickyFound = true;
        }
    });

    return stickyFound ? 1 : 0;
}

function checkLoadingIndicators($) {
    // 1️⃣ Look for common loading classes
    const loadingClasses = $('.loading, .spinner, .skeleton, .placeholder');
    if (loadingClasses.length > 0) return 1;

    // 2️⃣ Look for loading text
    const bodyText = $('body').text().toLowerCase();
    const loadingTexts = ['loading', 'please wait', 'fetching', 'loading...'];
    const hasLoadingText = loadingTexts.some(text => bodyText.includes(text));

    return hasLoadingText ? 1 : 0;
}
function Domain(urlString) {
  const u = new URL(urlString);
  let host = u.hostname;
  if (host.startsWith("www.")) host = host.slice(4);
  return host;
}



function estimateReadability(text) {
  const words = text.split(/\s+/).length || 1;
  const sentences = text.split(/[.!?]/).length || 1;
  const syllables = text
    .toLowerCase()
    .split(/\s+/)
    .reduce((sum, word) => {
      const syl = word.replace(/[^aeiouy]/g, "").length || 1;
      return sum + syl;
    }, 0);
  const flesch =
    206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  return flesch;
}

export default async function evaluateMobileUX(url,page) {

    await page.goto(url, {waitUntil: "networkidle2",timeout: 240000});
    await page.waitForSelector("body", { timeout: 240000 });
    const htmlData = await page.content();
    const $ = cheerio.load(htmlData);

    const checkNavigationClarityScore = checkNavigationClarity($);
    // console.log("Navigation Clarity Score:", checkNavigationClarityScore);
    console.log("checkNavigationClarity Score:", checkNavigationClarityScore);
    const checkBreadcrumbsScore = checkBreadcrumbs($);
    // console.log("Breadcrumbs Score:", checkBreadcrumbsScore);
    console.log("checkBreadcrumbs Score:", checkBreadcrumbsScore);

    const domain = Domain(url);

    const checkClickableLogoScore = checkClickableLogo($,domain);
    // console.log("Clickable Logo Score:", checkClickableLogoScore);
    console.log("checkClickableLogo Score:", checkClickableLogoScore);

    const checkMobileResponsivenessScore = checkMobileResponsiveness($);
    // console.log("Mobile Responsiveness Score:", checkMobileResponsivenessScore);
    console.log("checkMobileResponsiveness Score:", checkMobileResponsivenessScore);

    const checkParagraphLengthAndSpacingScore = checkParagraphLengthAndSpacing($);
    console.log("Paragraph Length & Spacing Score:", checkParagraphLengthAndSpacingScore);
    // console.log("checkParagraphLengthAndSpacing Score:", checkParagraphLengthAndSpacingScore);  

    const checkFontStyleAndSizeConsistencyScore = checkFontStyleAndSizeConsistency($);
    console.log("Font Style & Size Consistency Score:", checkFontStyleAndSizeConsistencyScore);
    // console.log("checkFontStyleAndSizeConsistency Score:", checkFontStyleAndSizeConsistencyScore);

    const checkContrastAndColorHarmonyScore = checkContrastAndColorHarmony($);
    console.log("Contrast & Color Harmony Score:", checkContrastAndColorHarmonyScore);
    // console.log("checkContrastAndColorHarmony Score:", checkContrastAndColorHarmonyScore);
    
    const checkWhitespaceUsageScore = checkWhitespaceUsage($);
    console.log("Whitespace Usage Score:", checkWhitespaceUsageScore);
    // console.log("checkWhitespaceUsage Score:", checkWhitespaceUsageScore);

    const checkContentRelevanceScore = checkContentRelevance($);
    console.log("Content Relevance Score:", checkContentRelevanceScore);
    // console.log("checkContentRelevance Score:", checkContentRelevanceScore);

    const checkCallToActionClarityScore = checkCallToActionClarity($);
    console.log("Call to Action Clarity Score:", checkCallToActionClarityScore);
    // console.log("checkCallToActionClarity Score:", checkCallToActionClarityScore);

   
    
    const checkMultimediaBalanceScore = checkMultimediaBalance($);
    console.log("Multimedia Balance Score:", checkMultimediaBalanceScore);
    // console.log("checkMultimediaBalance Score:", checkMultimediaBalanceScore);

    const checkInternalLinkingQualityScore = checkInternalLinkingQuality($,domain);
    console.log("Internal Linking Quality Score:", checkInternalLinkingQualityScore);
    // console.log("checkInternalLinkingQuality Score:", checkInternalLinkingQualityScore);

    const checkUserJourneyContinuityScore = checkUserJourneyContinuity($);
    console.log("User Journey Continuity Score:", checkUserJourneyContinuityScore);
    // console.log("checkUserJourneyContinuity Score:", checkUserJourneyContinuityScore);
    
    const checkErrorEmptyStateScore = checkErrorEmptyState($);
    console.log("Error & Empty State Score:", checkErrorEmptyStateScore);
    // console.log("checkErrorEmptyState Score:", checkErrorEmptyStateScore);

    const checkInteractiveFeedbackScore = checkInteractiveFeedback($);
    console.log("Interactive Feedback Score:", checkInteractiveFeedbackScore);
    // console.log("checkInteractiveFeedback Score:", checkInteractiveFeedbackScore);


    
  
    const checkStickyNavigationScore = checkStickyNavigation($);
    console.log("Sticky Navigation Score:", checkStickyNavigationScore);
    // console.log("checkStickyNavigation Score:", checkStickyNavigationScore);
    
    const checkScrollDepthLogicScore=checkScrollDepthLogic($);
    console.log("checkScrollDepthLogic Score",checkScrollDepthLogicScore);
    
    const checkLoadingIndicatorsScore = checkLoadingIndicators($);
    console.log("Loading Indicators Score:", checkLoadingIndicatorsScore);
    // console.log("checkLoadingIndicators Score:", checkLoadingIndicatorsScore);


// 1️⃣ Create an array of all scores
const allScores = [
    checkNavigationClarityScore,
    checkBreadcrumbsScore,
    checkClickableLogoScore,
    checkMobileResponsivenessScore,
    checkParagraphLengthAndSpacingScore,
    checkFontStyleAndSizeConsistencyScore,
    checkContrastAndColorHarmonyScore,
    checkWhitespaceUsageScore,
    checkContentRelevanceScore,
    checkCallToActionClarityScore,
    checkMultimediaBalanceScore,
    checkInternalLinkingQualityScore,
    checkUserJourneyContinuityScore,
    checkErrorEmptyStateScore,
    checkInteractiveFeedbackScore,
    checkStickyNavigationScore,
    checkScrollDepthLogicScore,
    checkLoadingIndicatorsScore
];

// 2️⃣ Sum all scores
const totalScore = allScores.reduce((sum, score) => sum + score, 0);

// 3️⃣ Calculate percentage
const percentage = (totalScore / allScores.length) * 100;

// 4️⃣ Print
console.log("Overall UX/UI Compliance Percentage:", percentage.toFixed(2) + "%");


    const viewport = $("meta[name=viewport]").length > 0;

    const fontSizePass = parseInt($("body").css("font-size")) >= 16 || true;

    const buttons = $("a, button").toArray();
    const tapTargetsPass = buttons.length === 0 || buttons.filter(b => {
      const width = parseInt($(b).attr("width")) || 32;
      const height = parseInt($(b).attr("height")) || 32;
      return width >= 32 && height >= 32;
    }).length / buttons.length >= 0.7;

    const passCount = [viewport, fontSizePass, tapTargetsPass].filter(Boolean).length;
    const mobileFriendliness = passCount == 3 ? 1 : 0;


    const navLinks = $("a").length;
    const navigationDepth = navLinks == 3  ? 1 : 0;


    await page.evaluate(() => {
      window.cumulativeLayoutShiftScore = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            window.cumulativeLayoutShiftScore += entry.value;
          }
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    await new Promise(resolve => setTimeout(resolve, 3000));
    const cls = await page.evaluate(() => window.cumulativeLayoutShiftScore);
    const layout_Shift_on_Interactions = cls < 0.1 ? 1 : 0;

    let readability
    const text = $("body").text() || "";
    if (text.split(/\s+/).length < 200) {
      readability = 1;
    } else {
      const readabilityScore = estimateReadability(text);
      readability = readabilityScore >= 40 && readabilityScore <= 60 ? 1 : 0;
    }


    const interstitials = $("div, dialog").toArray().some(o => {
      const pos = ($(o).attr("style") || "").includes("position:fixed");
      const width = parseInt($(o).attr("width")) || 0;
      const height = parseInt($(o).attr("height")) || 0;
      return pos && width > 0.5 * 375 && height > 0.5 * 667;
    });
    const intrusive_Interstitials = interstitials ? 0 : 1;

    const totalEScore = ((mobileFriendliness + navigationDepth + layout_Shift_on_Interactions + readability + intrusive_Interstitials)/5)*100


  const report = {};
  report.E = {
    mobileFriendliness: mobileFriendliness,
    navigationDepth: navigationDepth,
    layoutShift: layout_Shift_on_Interactions,
    readability: readability,
    intrusiveInterstitials: intrusive_Interstitials,
    totalEScore: parseFloat(totalEScore.toFixed(0)),
  };

  return report;
}
