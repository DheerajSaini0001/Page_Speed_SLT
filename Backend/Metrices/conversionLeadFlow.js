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


  const ctaAboveFold = $('a, button').filter((i, el) => {
    const text = $(el).text().toLowerCase();
    return /sign up|contact|buy|start|try|learn more|get|search|lucky/i.test(text);
  }).length;
  const ctaPassRate = ctaAboveFold > 0 ? 1 : 0;


  const forms = $("form").toArray();
  const validForms = forms.filter((f) => {
    const $f = $(f);
    return $f.find("input, textarea, select").length > 0;
  });
  const formsPassRate = (validForms.length / (forms.length || 1)) * 100;
  const formsScore = formsPassRate == 100 ? 1 : 0;

  const thankYouLinks = $('a[href*="thank"], a[href*="success"], a[href*="done"]').length;
  const thankYouScore = thankYouLinks > 0 ? 1 : 0;


  const trackingScripts = $('script').toArray().some((s) => {
    const code = $(s).html() || "";
    return /gtag|fbq|dataLayer.push|google-analytics|googletagmanager|ga\(/i.test(code);
  });
  const trackingScore = trackingScripts ? 1 : 0;


  const hasPhone = $('a[href^="tel:"]').length > 0;
  const hasEmail = $('a[href^="mailto:"]').length > 0;
  const hasAddress = /\d{1,5}\s\w+/.test($("body").text());
  const hasMap = $('iframe[src*="google.com/maps"]').length > 0;
  const hasHours = /(mon|tue|wed|thu|fri|sat|sun)[^\n]{0,15}\d{1,2}\s*[:]\s*\d{2}/i.test($("body").text());

  const contactScore = (hasPhone || hasEmail || hasAddress || hasMap || hasHours) ? 1 : 0;


  const crmEndpoints = $("form[action]").length; 
  const crmScore = crmEndpoints > 0 ? 1 : 0;

  const total = ((ctaPassRate +formsScore +thankYouScore +trackingScore +contactScore +crmScore)/6)*100


  report.F = {
    primaryCTA: ctaPassRate,
    forms: formsScore,
    thankYouState: thankYouScore,
    tracking: trackingScore,
    contactInfo: contactScore,
    crmWebhook: crmScore,
    totalFScore: parseFloat(total.toFixed(0)),
  };

  return report;
}
