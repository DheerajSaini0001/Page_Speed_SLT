import * as cheerio from "cheerio";

export default async function conversionLeadFlow(page) {

      await page.goto(url, {waitUntil: "networkidle2",timeout: 240000});
      await page.waitForSelector("body", { timeout: 240000 });
      const htmlData = await page.content();
      const $ = cheerio.load(htmlData);
  const report = {};


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
