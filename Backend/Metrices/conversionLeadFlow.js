const normalizeScore = (passRate, weight) => (passRate / 100) * weight;

export default async function conversionLeadFlow($) {
  const report = {};

  // 1️⃣ Primary CTAs above the fold (weight 2)
  const ctaAboveFold = $('a, button').filter((i, el) => {
    const text = $(el).text().toLowerCase();
    return /sign up|contact|buy|start|try|learn more|get|search|lucky/i.test(text);
  }).length;
  const ctaPassRate = ctaAboveFold > 0 ? 100 : 0;
  const ctaScore = normalizeScore(ctaPassRate, 2);

  // 2️⃣ Forms presence/validation (weight 2)
  const forms = $("form").toArray();
  // ✅ Count a form as valid if it has *any input element*
  const validForms = forms.filter((f) => {
    const $f = $(f);
    return $f.find("input, textarea, select").length > 0;
  });
  const formsPassRate = (validForms.length / (forms.length || 1)) * 100;
  const formsScore = normalizeScore(formsPassRate, 2);

  // 3️⃣ Thank-You / Success state (weight 1)
  const thankYouLinks = $('a[href*="thank"], a[href*="success"], a[href*="done"]').length;
  const thankYouScore = thankYouLinks > 0 ? 1 : 0;

  // 4️⃣ Tracking scripts (weight 2)
  const trackingScripts = $('script').toArray().some((s) => {
    const code = $(s).html() || "";
    return /gtag|fbq|dataLayer.push|google-analytics|googletagmanager|ga\(/i.test(code);
  });
  const trackingScore = trackingScripts ? 2 : 0;

  // 5️⃣ Contact Info (weight 2)
  const hasPhone = $('a[href^="tel:"]').length > 0;
  const hasEmail = $('a[href^="mailto:"]').length > 0;
  const hasAddress = /\d{1,5}\s\w+/.test($("body").text()); // simple street pattern
  const hasMap = $('iframe[src*="google.com/maps"]').length > 0;
  const hasHours = /(mon|tue|wed|thu|fri|sat|sun)[^\n]{0,15}\d{1,2}\s*[:]\s*\d{2}/i.test($("body").text());

  const contactScore = (hasPhone || hasEmail || hasAddress || hasMap || hasHours) ? 2 : 0;

  // 6️⃣ CRM/Webhook endpoint (weight 1)
  const crmEndpoints = $("form[action]").length; // accept relative or absolute URLs
  const crmScore = crmEndpoints > 0 ? 1 : 0;

  // ✅ Combine all F metrics
  report.F = {
    primaryCTA: parseFloat(ctaScore.toFixed(2)),
    forms: parseFloat(formsScore.toFixed(2)),
    thankYouState: parseFloat(thankYouScore.toFixed(2)),
    tracking: parseFloat(trackingScore.toFixed(2)),
    contactInfo: parseFloat(contactScore.toFixed(2)),
    crmWebhook: parseFloat(crmScore.toFixed(2)),
    totalFScore: parseFloat(
      (
        ctaScore +
        formsScore +
        thankYouScore +
        trackingScore +
        contactScore +
        crmScore
      ).toFixed(2)
    ),
  };

  return report;
}
