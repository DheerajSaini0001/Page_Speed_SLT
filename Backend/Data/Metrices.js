
export default function Metrices(url, MetricesCalculation_Data, Overall_Data,timeTaken,device) {

  const metrices = {
    Schema:MetricesCalculation_Data.aioReport.G.jsonLdScripts,
    Device:device,
    Time_Taken:timeTaken,
    Site: url,
    Score: Overall_Data.totalScore,
    Grade: Overall_Data.grade,
    AIO_Compatibility_Badge: MetricesCalculation_Data.aioReport.G.aioCompatibleBadge,
    Section_Score: Overall_Data.sectionScores,
    Top_Fixes: Overall_Data.topFixes,
    // recommendations: Overall_Data.recommendations,
    Technical_Performance: {
      Core_Web_Vitals: {
        LCP:{
          Score: MetricesCalculation_Data.technicalReport.lcpScore,
          Time: MetricesCalculation_Data.technicalReport.lcpRaw,
          Parameter:'Set 1 if the largest contentful paint (LCP) is 2500 ms or less, otherwise set 0 if it’s greater or missing'
        },
        CLS:{
          Score: MetricesCalculation_Data.technicalReport.clsScore,
          Time: MetricesCalculation_Data.technicalReport.clsRaw,
          Parameter:'Set 1 if the cumulative layout shift (CLS) is 0.1 or less, otherwise set 0 if it’s greater or missing'
        },
        INP:{
          Score: MetricesCalculation_Data.technicalReport.inpScore,
          Time: MetricesCalculation_Data.technicalReport.inpRaw,
          Parameter:'Set 1 if the page is interactive (INP) within 200 ms or less, otherwise set 0 if it’s greater or missing'
        },
        Total_Score_A1: MetricesCalculation_Data.technicalReport.total_A1,
      },
      Delivery_and_Render: {
        TTFB:{
          Score: MetricesCalculation_Data.technicalReport.ttfbScore,
          Time: MetricesCalculation_Data.technicalReport.ttfbRaw,
          Parameter:'Set 1 if the Time to First Byte (TTFB) is 200 ms or less, otherwise set 0 if it’s greater or missing'
        },
        Compression:{
          Score: MetricesCalculation_Data.technicalReport.compressionScore,
          Parameter:'Set 1 if text compression is enabled, otherwise set 0 if it’s disabled or missing'
        },
        Caching:{
          Score: MetricesCalculation_Data.technicalReport.cachingscore,
          Parameter:'Set 1 if long-term caching is enabled, otherwise set 0 if it’s disabled or missing'
        },
        HTTP:{
          Score: MetricesCalculation_Data.technicalReport.httpscore,
          Parameter:'Set 1 if HTTP/2 is enabled, otherwise set 0 if it’s disabled or missing'
        },
        Total_Score_A2: MetricesCalculation_Data.technicalReport.total_A2,
      },
      Crawlability_and_Hygiene: {
        Sitemap:{
          Score: MetricesCalculation_Data.technicalReport.sitemapScore,
          Parameter:'Checks if a sitemap URL exists in "robots.txt" and is reachable'
        },
        Robots:{
          Score: MetricesCalculation_Data.technicalReport.robotsScore,
          Parameter:'Checks if the "robots.txt" does not block the entire site.'
        },
        Broken_Links:{
          Score: MetricesCalculation_Data.technicalReport.brokenLinksScore,
          Parameter:'Checks if a webpage has broken external links.'
        },
        Redirect_Chains:{
          Score: MetricesCalculation_Data.technicalReport.redirectChainsScore,
          Parameter:'Checks if a URL redirects.'
        },
        Total_Score_A3: MetricesCalculation_Data.technicalReport.totalScore_A3,
      },
      Technical_Performance_Score_Total: MetricesCalculation_Data.technicalReport.totalScore,
    },
    On_Page_SEO: {
      Essentials: {
        Unique_Title: {
          Title: MetricesCalculation_Data.seoReport.B1.title,
          Parameter:'Check for length of Title is in between 30-60 characters',
          Title_Length: MetricesCalculation_Data.seoReport.B1.titleLength,
          Score: MetricesCalculation_Data.seoReport.B1.titleScore,
        },
        Meta_Description: {
          MetaDescription: MetricesCalculation_Data.seoReport.B1.MetaDescription,
          Parameter:'Check for length of MetaDescription is less than 160 characters',
          MetaDescription_Length: MetricesCalculation_Data.seoReport.B1.metaDescLength,
          Score: MetricesCalculation_Data.seoReport.B1.metaDescScore,
        },
        Canonical: {
          Canonical: MetricesCalculation_Data.seoReport.B1.canonical,
          Parameter:'Check for Page URL is same as Canonical tag "href" URL',
          Score: MetricesCalculation_Data.seoReport.B1.canonicalScore,
        },
        H1: {
          H1_Count: MetricesCalculation_Data.seoReport.B1.h1Count,
          Parameter:'Check for there is only one H1 tag on the Page',
          Score: MetricesCalculation_Data.seoReport.B1.h1Score,
        },
        Total_Score_B1: MetricesCalculation_Data.seoReport.B1.total,
      },
      Media_and_Semantics: {
        Image_ALT:{
          Parameter:'Check for Image tag which consist alt attribute is Meaningfull and not contain this ("", "image", "logo", "icon","pic","picture","photo"," ","12345","-","graphics")',
          Score:MetricesCalculation_Data.seoReport.B2.imageAltScore
        },
        Heading_Hierarchy:{
          Parameter:'Check for heading hierarcy is followed "h1->h2->h3"',
          Score:MetricesCalculation_Data.seoReport.B2.hierarchyScore,
          Follow :MetricesCalculation_Data.seoReport.B2.follow
        },
        Descriptive_Links:{
          Parameter:'Check for anchor tag text does not contain this ("click here", "read more","learn more","details","link","more","go","this")',
          Score: MetricesCalculation_Data.seoReport.B2.linkScore
        },
        Total_Score_B2: MetricesCalculation_Data.seoReport.B2.total,
      },
      Structure_and_Uniqueness: {
        //  URL_Slugs:{
        //   Slug:MetricesCalculation_Data.seoReport.B3.slug,
        //   Parameter:'Check for Slug is meaningfull & length is less than 75 characters ',
        //   Score:MetricesCalculation_Data.seoReport.B3.urlSlugScore,
        //   URL_Slugs_Length:MetricesCalculation_Data.seoReport.B3.slugLength
        // },
         URL_Structure:{
          Slug:MetricesCalculation_Data.seoReport.B3.slug,
          Parameter:'Check for Slug is meaningfull & length is less than 75 characters ',
          Score:MetricesCalculation_Data.seoReport.B3.urlScore,
          URL_Slugs_Length:MetricesCalculation_Data.seoReport.B3.slugLength
        },
        Duplicate_Content:{
          Parameter:'Check for Duplicate contnent occured within the page less than 50 %',
          Score: MetricesCalculation_Data.seoReport.B3.duplicateContent
        },
        Pagination_Tags:{
          Parameter:'Check for presence of ("next" and "prev") in link rel',
          Score: MetricesCalculation_Data.seoReport.B3.paginationScore
        },
        Total_Score_B3: MetricesCalculation_Data.seoReport.B3.total,
      },
      On_Page_SEO_Score_Total: MetricesCalculation_Data.seoReport.totalSEO,
    },
    Accessibility: {
      Color_Contrast:{
        Score:MetricesCalculation_Data.accessibilityReport.C.colorContrast,
        Parameter:'Check for color-contrast attribute is present or not',
      },
      Focusable:{
        Score:MetricesCalculation_Data.accessibilityReport.C.keyboardNavigation,
        Parameter:'Check for some missing attribute like ("focus-order","focusable-content","tabindex","interactive-element-affordance")',
      },
      ARIA:{
        Score:MetricesCalculation_Data.accessibilityReport.C.ariaLabeling,
        Parameter:'Check for some missing attribute ("label","aria-allowed-attr","aria-roles","aria-hidden-focus")',
      },
      Alt_or_Text_Equivalents:{
        Score:MetricesCalculation_Data.accessibilityReport.C.altTextEquivalents,
        Parameter:'Check for presence of image-alt attribute',
      },
      Skip_Links:{
        Score:MetricesCalculation_Data.accessibilityReport.C.skipLinks,
        Parameter:'Check for Skip Link is present or not',
      },
      Landmarks:{
        Score:MetricesCalculation_Data.accessibilityReport.C.Landmark,
        Parameter:'Check for some missing landmark roles ("banner","main","contentinfo","navigation","complementary")',
      },
      Accessibility_Score_Total: MetricesCalculation_Data.accessibilityReport.C.totalCScore,
    },
    Security_or_Compliance: {
      HTTPS:{
        Score:MetricesCalculation_Data.securityReport.D.httpsMixedContent,
        Parameter:'Check for presence of HTTPS in provided URL',
      },
      HSTS:{
        Score:MetricesCalculation_Data.securityReport.D.hsts,
        Parameter:'Check for Strict transport security is available or not',
      },
      Security_Headers:{
        Score:MetricesCalculation_Data.securityReport.D.securityHeaders,
        Parameter:'Check for all security headers are present or not ("content-security-policy","x-content-type-options","referrer-policy","x-frame-options","cross-origin-opener-policy")',
      },
      Cookie_Banner_and_Consent_Mode:{
        Score:MetricesCalculation_Data.securityReport.D.cookieConsent,
        Parameter:'Check for banner found or not ("cookie","consent","privacy","policy","accept","gdpr","tracking")',
      },
      Error_Pages:{
        Score:MetricesCalculation_Data.securityReport.D.errorPages,
        Parameter:'Check for Site have proper custom error page or not',
      },
      Security_or_Compliance_Score_Total: MetricesCalculation_Data.securityReport.D.totalDScore,
    },
    UX_and_Content_Structure: {
      Mobile_Friendliness:{
        Score: MetricesCalculation_Data.uxReport.E.mobileFriendliness,
        Parameter:'Check for Viewport length > 0 ,fontsize >= 16 & button width & height >= 32',
      },
      Navigation_Depth:{
        Score: MetricesCalculation_Data.uxReport.E.navigationDepth,
        Parameter:'Check from anchor tag Navigation link is present or not',
      },
      Layout_Shift_On_interactions:{
        Score: MetricesCalculation_Data.uxReport.E.layoutShift,
        Parameter:'Check for (Cumulative Layout Shift too high ≥ 0.1)',
      },
      Readability:{
        Score: MetricesCalculation_Data.uxReport.E.readability,
        Parameter:'Check for Content readability is poor or not (textsize 40–60 px)',
      },
      Intrusive_Interstitials:{
        Score: MetricesCalculation_Data.uxReport.E.intrusiveInterstitials,
        Parameter:'Is there a visible, fixed-position element that covers a significant portion of the viewport',
      },
      UX_and_Content_Structure_Score_Total: MetricesCalculation_Data.uxReport.E.totalEScore,
    },
    Conversion_and_Lead_Flow: {
      Primary_CTAs:{
        Score: MetricesCalculation_Data.conversionReport.F.primaryCTA,
        Parameter:'Check anchor & button tag contain these text ("sign up","contact","buy","start","try","learn more","get","search","lucky")'
      },
      Forms:{
        Score: MetricesCalculation_Data.conversionReport.F.forms,
        Parameter:'Check form tag contain these fields ("input", "textarea", "select")'
      },
      Thank_You_or_Success_State:{
        Score: MetricesCalculation_Data.conversionReport.F.thankYouState,
        Parameter:'Check for any anchor tag whose href contains (“thank”, “success”, or “done”)'
      },
      Tracking_Of_Form_Submits_or_Events:{
        Score: MetricesCalculation_Data.conversionReport.F.tracking,
        Parameter:'Check for any script tag containing recognizable analytics or tracking code keywords ("gtag", "fbq", "dataLayer.push", "google-analytics", "googletagmanager", "ga(")'
      },
      Contact_Info:{
        Score: MetricesCalculation_Data.conversionReport.F.contactInfo,
        Parameter:'Check for if any one from these ("phone", "email", "address", "map", "hours") is present or not'
      },
      Load_On_CRM_or_Webhook:{
        Score: MetricesCalculation_Data.conversionReport.F.crmWebhook,
        Parameter:'Check for presence of a form tag with an action attribute'
      },
      Conversion_and_Lead_Flow_Score_Total: MetricesCalculation_Data.conversionReport.F.totalFScore,
    },
    AIO_Readiness: {
      Entity_and_Organization_Clarity: {
        Organization_JSON_LD_Score:{
          Score: MetricesCalculation_Data.aioReport.G.orgFields,
          Parameter:'Checks if an Organization JSON-LD exists with ≥75% of key fields ("name", "logo", "url", "contactPoint", "address", "sameAs")'
        },
        Consistent_NAP:{
          Score: MetricesCalculation_Data.aioReport.G.napConsistency,
          Parameter:'Check ("phones", "emails", "addresses") present in ("header", "footer", "body")'
        },
        Humans_or_Policies:{
          Score: MetricesCalculation_Data.aioReport.G.policies,
          Parameter:'Checks for key policy pages ("About", "Contact", "Privacy", "Terms", "Returns and Shipping" if e-commerce)'
        },
        Total_Score_G1: MetricesCalculation_Data.aioReport.G.totalG1,
      },
      Content_Answerability_and_Structure: {
        FAQ_or_How_To_JSON_LD:{
          Score: MetricesCalculation_Data.aioReport.G.faqJsonLd,
          Parameter:'Checks for FAQPage or HowTo JSON-LD schemas'
        },
        Section_Anchors_or_TOC:{
          Score: MetricesCalculation_Data.aioReport.G.sectionAnchors,
          Parameter:'Checks if any "H1–H2-H3" headings have IDs'
        },
        Descriptive_Media_Captions_or_Figcaptions:{
          Score: MetricesCalculation_Data.aioReport.G.mediaCaptions,
          Parameter:'Counts images with <figcaption>'
        },
        Total_Score_G2: MetricesCalculation_Data.aioReport.G.totalG2,
      },
      Product_or_Inventory_Schema_and_Feeds: {
        Correct_Schema_Types:{
          Score: MetricesCalculation_Data.aioReport.G.productSchemas,
          Parameter:'Checks for ("Product", "Vehicle", "Offer", "AggregateRating") JSON-LD schemas existence'
        },
        Feed_Availability:{
          Score: MetricesCalculation_Data.aioReport.G.feedAvailability,
          Parameter:'Checks for RSS, Atom, or JSON feeds'
        },
        Total_Score_G3: MetricesCalculation_Data.aioReport.G.totalG3,
      },
      Crawl_Friendliness_for_Knowledge_Agents: {
        Robots_Allowlist:{
          Score: MetricesCalculation_Data.aioReport.G.crawlFriendliness,
          Parameter:'Checks if "robots.txt" blocks all crawling (Disallow: /)'
        },
        Total_Score_G4: MetricesCalculation_Data.aioReport.G.crawlFriendliness,
      },
      AIO_Readiness_Score_Total: MetricesCalculation_Data.aioReport.G.totalGScore,
    }
  };

  return metrices;
}