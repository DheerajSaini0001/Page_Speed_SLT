const normalizeScore = (passRate, weight) => (passRate / 100) * weight;

export default async function conversionLeadFlow($) {
  const report = {};

  // 1️⃣ Primary CTAs above the fold
  const ctaAboveFold = $('a, button').filter((i, el) => {
    const text = $(el).text().toLowerCase();
    return /sign up|contact|buy|start|try|learn more|get/i.test(text);
  }).length;
  const ctaPassRate = ctaAboveFold > 0 ? 100 : 0;
  const ctaScore = normalizeScore(ctaPassRate, 2);

  // 2️⃣ Forms validation
  const forms = $("form").toArray();
  const validForms = forms.filter((f) => {
    const $f = $(f);
    const labels = $f.find("label").length;
    const requiredInputs = $f.find("input[required]").length;
    const hasValidation = $f.find("input[pattern], input[type=email], input[type=tel]").length;
    return labels > 0 && requiredInputs > 0 && hasValidation > 0;
  });
  const formsPassRate = (validForms.length / (forms.length || 1)) * 100;
  const formsScore = normalizeScore(formsPassRate, 2);

  // 3️⃣ Thank-You / Success state
  const thankYouLinks = $('a[href*="thank"], a[href*="success"]').length;
  const thankYouScore = thankYouLinks > 0 ? 1 : 0;

  // 4️⃣ Tracking scripts
  const trackingScripts = $('script').toArray().some((s) => {
    const code = $(s).html();
    return /gtag|fbq|dataLayer.push/i.test(code);
  });
  const trackingScore = trackingScripts ? 1 : 0;

  // 5️⃣ Contact Info
  const hasPhone = $('a[href^="tel:"]').length > 0;
  const hasEmail = $('a[href^="mailto:"]').length > 0;
  const hasAddress = /\d{1,5}\s\w+/.test($("body").text());
  const contactScore = (hasPhone || hasEmail || hasAddress) ? 1 : 0;

  // 6️⃣ CRM/Webhook endpoint
  const crmEndpoints = $("form[action^='http']").length;
  const crmScore = crmEndpoints > 0 ? 1 : 0;

  // Combine all F metrics
  report.F = {
    primaryCTA: parseFloat(ctaScore.toFixed(2)),
    forms: parseFloat(formsScore.toFixed(2)),
    thankYouState: thankYouScore,
    tracking: trackingScore,
    contactInfo: contactScore,
    crmWebhook: crmScore,
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