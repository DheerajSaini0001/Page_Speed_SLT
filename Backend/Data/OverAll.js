
export default function OverAll(jsonData) {

     // Section totals
  const totalA = jsonData.Technical_Performance.Technical_Performance_Score_Total || 0;
  const totalB = jsonData.On_Page_SEO.On_Page_SEO_Score_Total || 0;
  const totalC = jsonData.Accessibility.Accessibility_Score_Total || 0;
  const totalD = jsonData.Security_or_Compliance.Security_or_Compliance_Score_Total || 0;
  const totalE = jsonData.UX_and_Content_Structure.UX_and_Content_Structure_Score_Total || 0;
  const totalF = jsonData.Conversion_and_Lead_Flow.Conversion_and_Lead_Flow_Score_Total || 0;
  const totalG = jsonData.AIO_Readiness.AIO_Readiness_Score_Total || 0;

  const scores = [
  { name: "Technical Performance", score: totalA },
  { name: "On-Page SEO", score: totalB },
  { name: "Accessibility", score: totalC },
  { name: "Security/Compliance", score: totalD },
  { name: "UX & Content", score: totalE },
  { name: "Conversion & Lead Flow", score: totalF },
  { name: "AIO Readiness", score: totalG }
];

  const totalScore = parseFloat(
    (totalA + totalB + totalC + totalD + totalE + totalF + totalG).toFixed(2)
  );

  // Grade
  let grade = "F";
  if (totalScore >= 90) grade = "A";
  else if (totalScore >= 80) grade = "B";
  else if (totalScore >= 70) grade = "C";
  else if (totalScore >= 60) grade = "D";

  // ✅ Top 5 lowest scores (directly from already-prepared scores[])
  const topFixes = [...scores]
  .sort((a, b) => a.score - b.score)  // sort ascending
  .slice(0, 5); 

const recommendations = [];

if (totalA < 20) {
  recommendations.push("Improve Technical Performance (optimize LCP, CLS, INP, and fix sitemap/robots).");
}

if (totalB < 15) {
  recommendations.push("Work on On-Page SEO (titles, meta descriptions, headings, image alts).");
}

if (totalC < 8) {
  recommendations.push("Accessibility is weak – fix ARIA labels, color contrast, and alt text.");
}

if (totalD < 5) {
  recommendations.push("Security is low – add HTTPS, HSTS, and required security headers.");
}

if (totalE < 6) {
  recommendations.push("UX & Content need improvements – check mobile friendliness, readability, navigation depth.");
}

if (totalF < 6) {
  recommendations.push("Conversion & Lead Flow is weak – ensure CTAs, forms, and tracking work properly.");
}

if (totalG < 6) {
  recommendations.push("AI-Optimization readiness is low – add structured data (Organization, Product, FAQ).");
}

  return {
    totalScore,
    grade,
    url:jsonData.URL,
    sectionScores: {
      A: totalA,
      B: totalB,
      C: totalC,
      D: totalD,
      E: totalE,
      F: totalF,
      G: totalG
    },
    badge: jsonData.AIO_Readiness.AIO_Compatibility_Badge,
    topFixes,
    recommendations
  };

}
