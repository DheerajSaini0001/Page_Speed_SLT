import express from "express";
import axios from "axios";
import cors from "cors";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";
import technicalMetrics from "./Module/technicalMetrics.js";
import seoMetrics from "./Module/seoMetrics.js";
import accessibilityMetrics from "./Module/accessibilityMetrics.js";
import securityCompliance from "./Module/securityCompliance.js";
import uxContentStructure from "./Module/uxContentStructure.js";
import conversionLeadFlow from "./Module/conversionLeadFlow.js";
import aioReadiness from "./Module/aioReadiness.js";


const PORT =2000;

const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = 'AIzaSyCww7MhvCEUmHhlACNBqfbzL5PUraT8lkk';

function calculateFinalScore(jsonData) {
  // Section totals
  const totalA = jsonData.A.Technical_Performance_Score_Total || 0;
  const totalB = jsonData.B.On_Page_SEO_Score_Total || 0;
  const totalC = jsonData.C.Accessibility_Score_Total || 0;
  const totalD = jsonData.D.Security_or_Compliance_Score_Total || 0;
  const totalE = jsonData.E.UX_and_Content_Structure_Score_Total || 0;
  const totalF = jsonData.F.Conversion_and_Lead_Flow_Score_Total || 0;
  const totalG = jsonData.G.AIO_Readiness_Score_Total || 0;

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
    badge: jsonData.G.AIO_Compatibility_Badge,
    topFixes,
    recommendations
  };
}


app.post('/data', async (req, res) => {
  const  message  = req.body;
  var url = message[0].trim();
  // If it doesn't start with http:// or https://, add https://
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }
  console.log(`URL Received: ${url}`);
  // console.log(message);

  try {
    const googleAPI =`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${ encodeURIComponent(url)}&strategy=desktop&key=${API_KEY}`;
    // console.log(googleAPI);
    const response = await fetch(googleAPI);
    const data = await response.json(); 
    
    const html = await axios.get(url);
    const htmlData = html.data;
    const $ = cheerio.load(htmlData);
    // console.log(html);
    // console.log(htmlData);
    // console.log($);
    

    const robotsRes = await axios.get(new URL("/robots.txt", url).href);
    const robotsText = robotsRes.data;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    // console.log(page);
    
  
  const technicalReport = await technicalMetrics(url,data,$,robotsText);
  const seoReport = await seoMetrics(url,$);
  const accessibilityReport = await accessibilityMetrics(url,page);
  const securityReport = await securityCompliance(url);
  const uxReport = await uxContentStructure(url,$,page);
  const conversionReport = await conversionLeadFlow($);
  const aioReport = await aioReadiness($,robotsText);
  // console.log("Technical Report:", technicalReport)
  // console.log("SEO Report (B1+B2+B3):", seoReport);
  // console.log("Accessibility C Section Report:", accessibilityReport);
  // console.log("Security/Compliance D Section Report:", securityReport);
  // console.log("UX & Content Structure E Section Report:", uxReport);
  // console.log("Conversion & Lead Flow F Section Report:", conversionReport);
  // console.log("AIO G Section Report:", aioReport);
  await browser.close();

    const jsonData = {
      URL:url,
      A:{
        A1:{
          LCP_Score:technicalReport.lcpScore,
          CLS_Score:technicalReport.clsScore,
          INP_Score:technicalReport.inpScore,
          Total_Score_A1:technicalReport.total_A1
        },
        A2:{
          TTFB_Score:technicalReport.ttfbScore,
          Compression_Score:technicalReport.compressionScore,
          Caching_Score:technicalReport.cachingscore,
          HTTP_Score:technicalReport.httpscore,
          Total_Score_A2:technicalReport.total_A2
        },
        A3:{
          Sitemap_Score:technicalReport.sitemapScore,
          Robots_Score:technicalReport.robotsScore,
          Broken_Links_Score:technicalReport.brokenLinksScore,
          Redirect_Chains_Score:technicalReport.redirectChainsScore,
          Total_Score_A3:technicalReport.totalScore_A3
        },
        Technical_Performance_Score_Total:technicalReport.totalScore
      },
      B:{
        B1:{
          Unique_Title_Score:seoReport.B1.title,
          Meta_Description_Score:seoReport.B1.metaDescription,
          Canonical_Score:seoReport.B1.canonical,
          H1_Score:seoReport.B1.h1,
          Total_Score_B1:seoReport.B1.total
        },
        B2:{
          Image_ALT_Score:seoReport.B2.imageAlt,
          Heading_Hierarchy_Score:seoReport.B2.headingHierarchy,
          Descriptive_Links_Score:seoReport.B2.descriptiveLinks,
          Total_Score_B2:seoReport.B2.total
        },
        B3:{
          URL_Slugs_Score:seoReport.B3.urlSlugs,
          Duplicate_Content_Score:seoReport.B3.duplicateContent,
          Pagination_Tags_Score:seoReport.B3.pagination,
          Total_Score_B3:seoReport.B3.total
        },
        On_Page_SEO_Score_Total:seoReport.B1.total + seoReport.B2.total + seoReport.B3.total
      },
      C:{
        Color_Contrast_Score:accessibilityReport.C.colorContrast,
        Focusable_Score:accessibilityReport.C.keyboardNavigation,
        ARIA_Score:accessibilityReport.C.ariaLabeling,
        Alt_or_Text_Equivalents_Score:accessibilityReport.C.altTextEquivalents,
        Skip_Links_or_Landmarks_Score:accessibilityReport.C.skipLinksLandmarks,
        Accessibility_Score_Total:accessibilityReport.C.totalCScore
      },
      D:{
        HTTPS_Score:securityReport.D.httpsMixedContent,
        HSTS_Score:securityReport.D.hsts,
        Security_Headers_Score:securityReport.D.securityHeaders,
        Cookie_Banner_and_Consent_Mode_Score:securityReport.D.cookieConsent,
        Error_Pages_Score:securityReport.D.errorPages,
        Security_or_Compliance_Score_Total:securityReport.D.totalDScore
      },
      E:{
        Mobile_Friendliness_Score:uxReport.E.mobileFriendliness,
        Navigation_Depth_Score:uxReport.E.navigationDepth,
        Layout_Shift_On_interactions_Score:uxReport.E.layoutShift,
        Readability_Score:uxReport.E.readability,
        Intrusive_Interstitials_Score:uxReport.E.intrusiveInterstitials,
        UX_and_Content_Structure_Score_Total:uxReport.E.totalEScore
      },
      F:{
        Primary_CTAs_Score:conversionReport.F.primaryCTA,
        Forms_Score:conversionReport.F.forms,
        Thank_You_or_Success_State_Score:conversionReport.F.thankYouState,
        Tracking_Of_Form_Submits_or_Events_Score:conversionReport.F.tracking,
        Contact_Info_Score:conversionReport.F.contactInfo,
        Load_On_CRM_or_Webhook_Score:conversionReport.F.crmWebhook,
        Conversion_and_Lead_Flow_Score_Total:conversionReport.F.totalFScore
      },
      G:{
        G1:{
          Organization_JSON_LD_Score:aioReport.G.orgFields,
          Consistent_NAP_Score:aioReport.G.napConsistency,
          Humans_or_Policies_Score:aioReport.G.policies,
          Total_Score_G1:aioReport.G.orgFields + aioReport.G.napConsistency + aioReport.G.policies
        },
        G2:{
          FAQ_or_How_To_JSON_LD_Score:aioReport.G.faqJsonLd,
          Section_Anchors_or_TOC_Score:aioReport.G.sectionAnchors,
          Descriptive_Media_Captions_or_Figcaptions_Score:aioReport.G.mediaCaptions,
          Total_Score_G2: aioReport.G.faqJsonLd + aioReport.G.sectionAnchors + aioReport.G.mediaCaptions
        },
        G3:{
          Correct_Schema_Types_Score:aioReport.G.productSchemas,
          Feed_Availability_Score:aioReport.G.feedAvailability,
          Total_Score_G3: aioReport.G.productSchemas + aioReport.G.feedAvailability
        },
        G4:{
          Robots_Allowlist_Score: aioReport.G.crawlFriendliness,
          Total_Score_G4: aioReport.G.crawlFriendliness
        },
        AIO_Readiness_Score_Total: aioReport.G.totalGScore,
        AIO_Compatibility_Badge: aioReport.G.aioCompatibleBadge
      }
    }
  const result = calculateFinalScore(jsonData);
  res.json({jsonData,result});
  console.log(jsonData);
  console.log(result);
    
  } catch (error) {
    console.error("Error fetching PageSpeed data:", error);
    res.status(500).json({ success: false, error: "Failed to fetch PageSpeed data" });
  }
});


app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
