
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
          Score: MetricesCalculation_Data.technicalReport.coreWebVitals.lcpScore,
          Value: MetricesCalculation_Data.technicalReport.coreWebVitals.lcpValue,
          Parameter:'Set 1 if LCP ≤ 2500ms, otherwise set 0'
        },
        FID:{
          Score: MetricesCalculation_Data.technicalReport.coreWebVitals.fidScore,
          Value: MetricesCalculation_Data.technicalReport.coreWebVitals.fidValue,
          Parameter:'Set 1 if FID ≤ 100ms, otherwise set 0'
        },
        CLS:{
          Score: MetricesCalculation_Data.technicalReport.coreWebVitals.clsScore,
          Value: MetricesCalculation_Data.technicalReport.coreWebVitals.clsValue,
          Parameter:'Set 1 if CLS ≤ 0.1, otherwise set 0'
        },
        FCP:{
          Score: MetricesCalculation_Data.technicalReport.coreWebVitals.fcpScore,
          Value: MetricesCalculation_Data.technicalReport.coreWebVitals.fcpValue,
          Parameter:'Set 1 if FCP ≤ 1800ms, otherwise set 0'
        },
        TTFB:{
          Score: MetricesCalculation_Data.technicalReport.coreWebVitals.ttfbScore,
          Value: MetricesCalculation_Data.technicalReport.coreWebVitals.ttfbValue,
          Parameter:'Set 1 if TTFB ≤ 200ms, otherwise set 0'
        },
        TBT:{
          Score: MetricesCalculation_Data.technicalReport.coreWebVitals.tbtScore,
          Value: MetricesCalculation_Data.technicalReport.coreWebVitals.tbtValue,
          Parameter:'Set 1 if TBT ≤ 300ms, otherwise set 0'
        },
        SI:{
          Score: MetricesCalculation_Data.technicalReport.coreWebVitals.siScore,
          Value: MetricesCalculation_Data.technicalReport.coreWebVitals.siValue,
          Parameter:'Set 1 if SI ≤ 3000ms, otherwise set 0'
        },
        INP:{
          Score: MetricesCalculation_Data.technicalReport.coreWebVitals.inpScore,
          Value: MetricesCalculation_Data.technicalReport.coreWebVitals.inpValue,
          Parameter:'Set 1 if INP ≤ 200ms, otherwise set 0'
        },
        Core_Web_Vitals_Total_Score: MetricesCalculation_Data.technicalReport.coreWebVitals.coreWebVitalsTotal,
      },
      Delivery_and_Render: {
        Compression:{
          Score: MetricesCalculation_Data.technicalReport.deliveryAndRender.compressionScore,
          Value: MetricesCalculation_Data.technicalReport.deliveryAndRender.compressionValue,
          Parameter:'Set 1 if "gzip" or "brotli" compression is enabled, otherwise set 0 if it’s disabled or missing.'
        },
        Caching:{
          Score: MetricesCalculation_Data.technicalReport.deliveryAndRender.cachingScore,
          Value: MetricesCalculation_Data.technicalReport.deliveryAndRender.cachingValue,
          Parameter:'Set 1 if static resources have TTL ≥ 7 days, otherwise set 0 if TTL is less than 7 days or missing'
        },
        Resource_Optimization:{
          Score: MetricesCalculation_Data.technicalReport.deliveryAndRender.resourceOptimizationScore,
          Parameter:'Set 1 if images are optimized, CSS/JS minified, and offscreen images deferred; otherwise set 0.'
        },
        Render_Blocking:{
          Score: MetricesCalculation_Data.technicalReport.deliveryAndRender.renderBlockingScore,
          Value: MetricesCalculation_Data.technicalReport.deliveryAndRender.renderBlockingValue,
          Parameter:'Set 1 if there are no render-blocking CSS/JS resources, otherwise set 0'
        },
        HTTP:{
          Score: MetricesCalculation_Data.technicalReport.deliveryAndRender.httpScore,
          Value: MetricesCalculation_Data.technicalReport.deliveryAndRender.httpsValue,
          Parameter:'Set 1 if HTTP/2 is enabled, otherwise set 0 if not enabled'
        },
        Delivery_and_Render_Total_Score: MetricesCalculation_Data.technicalReport.deliveryAndRender.deliveryAndRenderTotal,
      },
      Crawlability_and_Hygiene: {
        Sitemap:{
          Score: MetricesCalculation_Data.technicalReport.crawlabilityAndHygiene.sitemapScore,
          Parameter:'Set 1 if /sitemap.xml exists, otherwise set 0'
        },
        Robots:{
          Score: MetricesCalculation_Data.technicalReport.crawlabilityAndHygiene.robotsScore,
          Parameter:'Set 1 if robots.txt exists, otherwise set 0'
        },
        Structured_Data:{
          Score: MetricesCalculation_Data.technicalReport.crawlabilityAndHygiene.structuredDataScore,
          Parameter:'Set 1 if JSON-LD structured data is present, otherwise set 0'
        },
        Broken_Links:{
          Score: MetricesCalculation_Data.technicalReport.crawlabilityAndHygiene.brokenScore,
          Value: MetricesCalculation_Data.technicalReport.crawlabilityAndHygiene.brokenPercent,
          Parameter:'Set 1 if 0% broken links, otherwise set 0'
        },
        Redirect_Chains:{
          Score: MetricesCalculation_Data.technicalReport.crawlabilityAndHygiene.redirectScore,
          Value: MetricesCalculation_Data.technicalReport.crawlabilityAndHygiene.hops,
          Parameter:'Set 1 if ≤ 1 hop, otherwise set 0'
        },
        Crawlability_and_Hygiene_Total_Score: MetricesCalculation_Data.technicalReport.crawlabilityAndHygiene.crawlabilityAndHygieneTotal,
      },
      Percentage: MetricesCalculation_Data.technicalReport.actualPercentage,
      Warning: MetricesCalculation_Data.technicalReport.warning,
      Total: MetricesCalculation_Data.technicalReport.Total,
      Improvements: MetricesCalculation_Data.technicalReport.improvements,
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