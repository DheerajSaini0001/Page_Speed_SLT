
export default function Metrices(url, MetricesCalculation_Data, Overall_Data) {

  const metrices = {
    Schema:MetricesCalculation_Data.aioReport.G.jsonLdScripts,
    Site: url,
    Score: Overall_Data.totalScore,
    Grade: Overall_Data.grade,
    AIO_Compatibility_Badge: MetricesCalculation_Data.aioReport.G.aioCompatibleBadge,
    Section_Score: Overall_Data.sectionScores,
    Top_Fixes: Overall_Data.topFixes,
    recommendations: Overall_Data.recommendations,
    Technical_Performance: {
      Core_Web_Vitals: {
        LCP_Score: MetricesCalculation_Data.technicalReport.lcpScore,
        CLS_Score: MetricesCalculation_Data.technicalReport.clsScore,
        INP_Score: MetricesCalculation_Data.technicalReport.inpScore,
        Total_Score_A1: MetricesCalculation_Data.technicalReport.total_A1,
      },
      Delivery_and_Render: {
        TTFB_Score: MetricesCalculation_Data.technicalReport.ttfbScore,
        Compression_Score: MetricesCalculation_Data.technicalReport.compressionScore,
        Caching_Score: MetricesCalculation_Data.technicalReport.cachingscore,
        HTTP_Score: MetricesCalculation_Data.technicalReport.httpscore,
        Total_Score_A2: MetricesCalculation_Data.technicalReport.total_A2,
      },
      Crawlability_and_Hygiene: {
        Sitemap_Score: MetricesCalculation_Data.technicalReport.sitemapScore,
        Robots_Score: MetricesCalculation_Data.technicalReport.robotsScore,
        Broken_Links_Score: MetricesCalculation_Data.technicalReport.brokenLinksScore,
        Redirect_Chains_Score: MetricesCalculation_Data.technicalReport.redirectChainsScore,
        Total_Score_A3: MetricesCalculation_Data.technicalReport.totalScore_A3,
      },
      Technical_Performance_Score_Total: MetricesCalculation_Data.technicalReport.totalScore,
    },
    On_Page_SEO: {
      Essentials: {
        Unique_Title: {
          Title: MetricesCalculation_Data.seoReport.B1.title,
          Parameter:'Length of Title must be in between 30-60 characters',
          Title_Length: MetricesCalculation_Data.seoReport.B1.titleLength,
          Score: MetricesCalculation_Data.seoReport.B1.titleScore,
        },
        Meta_Description: {
          MetaDescription: MetricesCalculation_Data.seoReport.B1.MetaDescription,
          Parameter:'Length of MetaDescription must be less than 160 characters',
          MetaDescription_Length: MetricesCalculation_Data.seoReport.B1.metaDescLength,
          Score: MetricesCalculation_Data.seoReport.B1.metaDescScore,
        },
        Canonical: {
          Canonical: MetricesCalculation_Data.seoReport.B1.canonical,
          Parameter:'Page URL must be same as Canonical tag href URL',
          Score: MetricesCalculation_Data.seoReport.B1.canonicalScore,
        },
        H1: {
          H1_Count: MetricesCalculation_Data.seoReport.B1.h1Count,
          Parameter:'There must be only one H1 tag on the Page',
          Score: MetricesCalculation_Data.seoReport.B1.h1Score,
        },
        Total_Score_B1: MetricesCalculation_Data.seoReport.B1.total,
      },
      Media_and_Semantics: {
        Image_ALT:{
          Parameter:'Only Image which consist alt attribute must be Meaningfull !("", "image", "logo", "icon","pic","picture","photo"," ","12345","-","graphics")',
          Score:MetricesCalculation_Data.seoReport.B2.imageAltScore
        },
        Heading_Hierarchy:{
          Parameter:'Must follow heading hierarcy h1->h2->h3',
          Score:MetricesCalculation_Data.seoReport.B2.hierarchyScore
        },
        Descriptive_Links:{
          Parameter:'anchor tag text must be meaningfull !("click here", "read more","learn more","details","link","more","go","this")',
          Score: MetricesCalculation_Data.seoReport.B2.linkScore
        },
        Total_Score_B2: MetricesCalculation_Data.seoReport.B2.total,
      },
      Structure_and_Uniqueness: {
         URL_Slugs:{
          Slug:MetricesCalculation_Data.seoReport.B3.slug,
          Parameter:'Slug must be meaningfull & length must be less than 75 characters ',
          Score:MetricesCalculation_Data.seoReport.B3.urlSlugScore,
          URL_Slugs_Length:MetricesCalculation_Data.seoReport.B3.slugLength
        },
        Duplicate_Content:{
          Parameter:' Duplicate contnent occured within the page less than 50 %',
          Score: MetricesCalculation_Data.seoReport.B3.duplicateContent
        },
        Pagination_Tags:{
          Parameter:'Check for link rel to next and prev',
          Score: MetricesCalculation_Data.seoReport.B3.paginationScore
        },
        Total_Score_B3: MetricesCalculation_Data.seoReport.B3.total,
      },
      On_Page_SEO_Score_Total: MetricesCalculation_Data.seoReport.totalSEO,
    },
    Accessibility: {
      Color_Contrast:{
        Score:MetricesCalculation_Data.accessibilityReport.C.colorContrast,
        Parameter:'color-contrast attribute missing'
      },
      Focusable:{
        Score:MetricesCalculation_Data.accessibilityReport.C.keyboardNavigation,
        Parameter:'There are some missing attribute ("focus-order","focusable-content","tabindex","interactive-element-affordance")'
      },
      ARIA:{
        Score:MetricesCalculation_Data.accessibilityReport.C.ariaLabeling,
        Parameter:'There are some missing attribute ("label","aria-allowed-attr","aria-roles","aria-hidden-focus")'
      },
      Alt_or_Text_Equivalents:{
        Score:MetricesCalculation_Data.accessibilityReport.C.altTextEquivalents,
        Parameter:'image-alt attribute missing'
      },
      Skip_Links:{
        Score:MetricesCalculation_Data.accessibilityReport.C.skipLinks,
        Parameter:'Skip Link is present'
      },
      Landmarks:{
        Score:MetricesCalculation_Data.accessibilityReport.C.Landmark,
        Parameter:'There are some missing landmark roles ("banner","main","contentinfo","navigation","complementary")'
      },
      Accessibility_Score_Total: MetricesCalculation_Data.accessibilityReport.C.totalCScore,
    },
    Security_or_Compliance: {
      HTTPS:{
        Score:MetricesCalculation_Data.securityReport.D.httpsMixedContent,
        Parameter:'HTTPS missing in provided URL'
      },
      HSTS:{
        Score:MetricesCalculation_Data.securityReport.D.hsts,
        Parameter:'Strict transport security is not available'
      },
      Security_Headers:{
        Score:MetricesCalculation_Data.securityReport.D.securityHeaders,
        Parameter:'All security headers are not present ("content-security-policy","x-content-type-options","referrer-policy","x-frame-options","cross-origin-opener-policy")'
      },
      Cookie_Banner_and_Consent_Mode:{
        Score:MetricesCalculation_Data.securityReport.D.cookieConsent,
        Parameter:'No banner found ("cookie","consent","privacy","policy","accept","gdpr","tracking")'
      },
      Error_Pages:{
        Score:MetricesCalculation_Data.securityReport.D.errorPages,
        Parameter:'Site not have proper custom error page'
      },
      Security_or_Compliance_Score_Total: MetricesCalculation_Data.securityReport.D.totalDScore,
    },
    UX_and_Content_Structure: {
      Mobile_Friendliness_Score: MetricesCalculation_Data.uxReport.E.mobileFriendliness,
      Navigation_Depth_Score: MetricesCalculation_Data.uxReport.E.navigationDepth,
      Layout_Shift_On_interactions_Score: MetricesCalculation_Data.uxReport.E.layoutShift,
      Readability_Score: MetricesCalculation_Data.uxReport.E.readability,
      Intrusive_Interstitials_Score: MetricesCalculation_Data.uxReport.E.intrusiveInterstitials,
      UX_and_Content_Structure_Score_Total: MetricesCalculation_Data.uxReport.E.totalEScore,
    },
    Conversion_and_Lead_Flow: {
      Primary_CTAs_Score: MetricesCalculation_Data.conversionReport.F.primaryCTA,
      Forms_Score: MetricesCalculation_Data.conversionReport.F.forms,
      Thank_You_or_Success_State_Score: MetricesCalculation_Data.conversionReport.F.thankYouState,
      Tracking_Of_Form_Submits_or_Events_Score: MetricesCalculation_Data.conversionReport.F.tracking,
      Contact_Info_Score: MetricesCalculation_Data.conversionReport.F.contactInfo,
      Load_On_CRM_or_Webhook_Score: MetricesCalculation_Data.conversionReport.F.crmWebhook,
      Conversion_and_Lead_Flow_Score_Total: MetricesCalculation_Data.conversionReport.F.totalFScore,
    },
    AIO_Readiness: {
      Entity_and_Organization_Clarity: {
        Organization_JSON_LD_Score: MetricesCalculation_Data.aioReport.G.orgFields,
        Consistent_NAP_Score: MetricesCalculation_Data.aioReport.G.napConsistency,
        Humans_or_Policies_Score: MetricesCalculation_Data.aioReport.G.policies,
        Total_Score_G1: MetricesCalculation_Data.aioReport.G.totalG1,
      },
      Content_Answerability_and_Structure: {
        FAQ_or_How_To_JSON_LD_Score: MetricesCalculation_Data.aioReport.G.faqJsonLd,
        Section_Anchors_or_TOC_Score: MetricesCalculation_Data.aioReport.G.sectionAnchors,
        Descriptive_Media_Captions_or_Figcaptions_Score: MetricesCalculation_Data.aioReport.G.mediaCaptions,
        Total_Score_G2: MetricesCalculation_Data.aioReport.G.totalG2,
      },
      Product_or_Inventory_Schema_and_Feeds: {
        Correct_Schema_Types_Score: MetricesCalculation_Data.aioReport.G.productSchemas,
        Feed_Availability_Score: MetricesCalculation_Data.aioReport.G.feedAvailability,
        Total_Score_G3: MetricesCalculation_Data.aioReport.G.totalG3,
      },
      Crawl_Friendliness_for_Knowledge_Agents: {
        Robots_Allowlist_Score: MetricesCalculation_Data.aioReport.G.crawlFriendliness,
        Total_Score_G4: MetricesCalculation_Data.aioReport.G.crawlFriendliness,
      },
      AIO_Readiness_Score_Total: MetricesCalculation_Data.aioReport.G.totalGScore,
    }
  };

  return metrices;
}