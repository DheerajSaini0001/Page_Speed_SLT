
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
    // Top_Fixes: Overall_Data.topFixes,
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
      Passed: MetricesCalculation_Data.technicalReport.passed,
      Total: MetricesCalculation_Data.technicalReport.Total,
      Improvements: MetricesCalculation_Data.technicalReport.improvements,
    },
    On_Page_SEO: {
      Essentials: {
        Title: {
          Title: MetricesCalculation_Data.seoReport.essentials.title,
          Title_Exist : MetricesCalculation_Data.seoReport.essentials.titleExistanceScore,
          Title_Length: MetricesCalculation_Data.seoReport.essentials.titleLength,
          Score: MetricesCalculation_Data.seoReport.essentials.titleScore,
          Parameter:'1 if title exists and 30–60 characters, else 0'
        },
        Meta_Description: {
          MetaDescription: MetricesCalculation_Data.seoReport.essentials.metaDesc,
          MetaDescription_Exist: MetricesCalculation_Data.seoReport.essentials.metaDescExistanceScore,
          MetaDescription_Length: MetricesCalculation_Data.seoReport.essentials.metaDescLength,
          Score: MetricesCalculation_Data.seoReport.essentials.metaDescScore,
          Parameter:'1 if meta description exists and ≤ 165 characters, else 0'
        },
        URL_Structure: {
          Score: MetricesCalculation_Data.seoReport.essentials.URLStructureScore,
          Parameter:'1 if URL ≤ 5 segments, lowercase, hyphen-separated, else 0'
        },
        Canonical: {
          Canonical: MetricesCalculation_Data.seoReport.essentials.canonical,
          Canonical_Exist: MetricesCalculation_Data.seoReport.essentials.canonicalExistanceScore,
          Score: MetricesCalculation_Data.seoReport.essentials.canonicalScore,
          Parameter:'1 if canonical tag exists and matches page URL, else 0'
        },
        Essentials_Total_Score: MetricesCalculation_Data.seoReport.essentials.essentialsTotal,
      },
      Media_and_Semantics: {
        H1: {
          H1_Count: MetricesCalculation_Data.seoReport.mediaAndSemantics.h1Count,
          H1_Count_Score: MetricesCalculation_Data.seoReport.mediaAndSemantics.h1CountScore,
          Score: MetricesCalculation_Data.seoReport.mediaAndSemantics.h1Score,
          Parameter:'1 if exactly one H1, 2 if >1, 0 if none'
        },
        Image:{
          Image_Exist: MetricesCalculation_Data.seoReport.mediaAndSemantics.imagePresenceScore,
          Image_Alt_Exist: MetricesCalculation_Data.seoReport.mediaAndSemantics.altPresence,
          Image_Alt_Meaningfull_Exist: MetricesCalculation_Data.seoReport.mediaAndSemantics.altMeaningfullPercentage,
          Image_Compression_Exist: MetricesCalculation_Data.seoReport.mediaAndSemantics.imageCompressionScore,
          Parameter:'Alt text ≥ 75% meaningful, images ≤ 200KB'
        },
        Video:{
          Video_Exist: MetricesCalculation_Data.seoReport.mediaAndSemantics.videoExistanceScore,
          Video_Embedding_Exist: MetricesCalculation_Data.seoReport.mediaAndSemantics.embedding,
          Video_LazyLoading_Exist: MetricesCalculation_Data.seoReport.mediaAndSemantics.lazyLoading,
          Video_Structured_Metadata_Exist: MetricesCalculation_Data.seoReport.mediaAndSemantics.structuredMetadata,
          Parameter:'Proper embedding, lazy-loading, JSON-LD metadata'
        },
        Heading_Hierarchy:{
          H1_Count: MetricesCalculation_Data.seoReport.mediaAndSemantics.h1Count,
          H2_Count: MetricesCalculation_Data.seoReport.mediaAndSemantics.h2Count,
          H3_Count: MetricesCalculation_Data.seoReport.mediaAndSemantics.h3Count,
          H4_Count: MetricesCalculation_Data.seoReport.mediaAndSemantics.h4Count,
          H5_Count: MetricesCalculation_Data.seoReport.mediaAndSemantics.h5Count,
          H6_Count: MetricesCalculation_Data.seoReport.mediaAndSemantics.h6Count,
          Heading: MetricesCalculation_Data.seoReport.mediaAndSemantics.headings,
          Score:MetricesCalculation_Data.seoReport.mediaAndSemantics.hierarchy,
          Parameter:'1 if headings follow proper H1→H2→H3 order, else 0',
        },
        ALT_Text_Relevance: {
          Score: MetricesCalculation_Data.seoReport.mediaAndSemantics.alttextScore,
          Parameter: "1 if alt text contains keywords or is descriptive, else 0"
        },
        Internal_Links: {
          Total: MetricesCalculation_Data.seoReport.mediaAndSemantics.totalInternalLinks,
          Descriptive_Score: MetricesCalculation_Data.seoReport.mediaAndSemantics.internalLinksDescriptiveScore,
          Parameter: "1 if ≥ 75% internal links are descriptive, else 0"
        },
        Semantic_Tags: {
          Article_Score: MetricesCalculation_Data.seoReport.mediaAndSemantics.articleScore,
          Section_Score: MetricesCalculation_Data.seoReport.mediaAndSemantics.sectionScore,
          Header_Score: MetricesCalculation_Data.seoReport.mediaAndSemantics.headerScore,
          Footer_Score: MetricesCalculation_Data.seoReport.mediaAndSemantics.footerScore,
          Parameter: "1 if tag exists, else 0"
        },
        Media_and_Semantics_Total_Score: MetricesCalculation_Data.seoReport.mediaAndSemantics.mediaAndSemanticsTotal
      },
      Structure_and_Uniqueness: {
        Duplicate_Content:{
          Score: MetricesCalculation_Data.seoReport.structureAndUniqueness.dupScore,
          Parameter:'1 if duplication ≤ 75%, else 0'
        },
         URL_Slugs:{
          Slug:MetricesCalculation_Data.seoReport.structureAndUniqueness.slug,
          Slug_Check_Score:MetricesCalculation_Data.seoReport.structureAndUniqueness.slugCheckScore,
          Score:MetricesCalculation_Data.seoReport.structureAndUniqueness.slugScore,
          Parameter:'1 if slug exists, ≤25 characters, lowercase hyphenated, else 0'
        },
        HTTPS: {
          Score: MetricesCalculation_Data.seoReport.structureAndUniqueness.checkHTTPSScore,
          Parameter: "1 if HTTPS implemented, else 0"
        },
        Pagination_Tags:{
          Score: MetricesCalculation_Data.seoReport.structureAndUniqueness.paginationScore,
          Parameter:'1 if pagination links or rel=next/prev exist, else 0'
        },
        Structure_and_Uniqueness_Total_Score: MetricesCalculation_Data.seoReport.structureAndUniqueness.structureAndUniquenessTotal,
      },
      Percentage: MetricesCalculation_Data.seoReport.actualPercentage,
      Warning: MetricesCalculation_Data.seoReport.warning,
      Passed: MetricesCalculation_Data.seoReport.passed,
      Total: MetricesCalculation_Data.seoReport.Total,
      Improvements: MetricesCalculation_Data.seoReport.improvements
    },
    Accessibility: {
      Color_Contrast:{
        Score:MetricesCalculation_Data.accessibilityReport.colorContrast,
        Parameter:'1 if color contrast passes, else 0'
      },
      Focus_Order:{
        Score:MetricesCalculation_Data.accessibilityReport.focusOrder,
        Parameter:'1 if tab/focus order is correct, else 0'
      },
      Focusable_Content:{
        Score:MetricesCalculation_Data.accessibilityReport.focusableContent,
        Parameter:'1 if focusable elements are correctly used, else 0'
      },
      Tab_Index:{
        Score:MetricesCalculation_Data.accessibilityReport.tabindex,
        Parameter:'1 if tabindex attributes are valid, else 0'
      },
      Interactive_Element_Affordance:{
        Score:MetricesCalculation_Data.accessibilityReport.interactiveElementAffordance,
        Parameter:'1 if interactive elements have clear affordance, else 0'
      },
      Label:{
        Score:MetricesCalculation_Data.accessibilityReport.label,
        Parameter:'1 if form elements have labels, else 0'
      },
      Aria_Allowed_Attr:{
        Score:MetricesCalculation_Data.accessibilityReport.ariaAllowedAttr,
        Parameter:'1 if only allowed ARIA attributes are used, else 0'
      },
      Aria_Roles:{
        Score:MetricesCalculation_Data.accessibilityReport.ariaRoles,
        Parameter:'1 if ARIA roles are correctly applied, else 0'
      },
      Aria_Hidden_Focus:{
        Score:MetricesCalculation_Data.accessibilityReport.ariaHiddenFocus,
        Parameter:'1 if hidden elements do not receive focus, else 0'
      },
      Image_Alt:{
        Score:MetricesCalculation_Data.accessibilityReport.imageAlt,
        Parameter:'1 if images have descriptive alt text, else 0'
      },
      Skip_Links:{
        Score:MetricesCalculation_Data.accessibilityReport.skipLinks,
        Parameter:'1 if skip links exist, else 0',
      },
      Landmarks:{
        Score:MetricesCalculation_Data.accessibilityReport.landMarks,
        Parameter:'1 if landmark roles (banner, main, contentinfo, navigation, complementary) exist, else 0'
      },
      Percentage: MetricesCalculation_Data.accessibilityReport.actualPercentage,
      Warning: MetricesCalculation_Data.accessibilityReport.warning,
      Passed: MetricesCalculation_Data.accessibilityReport.passed,
      Total: MetricesCalculation_Data.accessibilityReport.Total
    },
    Security_or_Compliance: {
    HTTPS: {
      Score: MetricesCalculation_Data.securityReport.checkHTTPSScore,
      Parameter: '1 if HTTPS is implemented, else 0'
    },
    SSL: {
      Score: MetricesCalculation_Data.securityReport.checkSSLScore,
      Parameter: '1 if SSL/TLS certificate is valid, else 0'
    },
    SSL_Expiry: {
      Score: MetricesCalculation_Data.securityReport.checkSSLCertificateExpiryScore,
      Parameter: '1 if SSL certificate is not expired, else 0'
    },
    HSTS: {
      Score: MetricesCalculation_Data.securityReport.checkHSTSScore,
      Parameter: '1 if HSTS header is present, else 0'
    },
    TLS_Version: {
      Score: MetricesCalculation_Data.securityReport.checkTLSVersionScore,
      Parameter: '1 if secure TLS version is used, else 0'
    },
    X_Frame_Options: {
      Score: MetricesCalculation_Data.securityReport.checkXFrameOptionsScore,
      Parameter: '1 if X-Frame-Options header is set, else 0'
    },
    CSP: {
      Score: MetricesCalculation_Data.securityReport.checkCSPScore,
      Parameter: '1 if Content Security Policy (CSP) is set, else 0'
    },
    X_Content_Type_Options: {
      Score: MetricesCalculation_Data.securityReport.checkXContentTypeOptionsScore,
      Parameter: '1 if X-Content-Type-Options header is set, else 0'
    },
    Cookies_Secure: {
      Score: MetricesCalculation_Data.securityReport.checkCookiesSecureScore,
      Parameter: '1 if cookies are set with Secure flag, else 0'
    },
    Cookies_HttpOnly: {
      Score: MetricesCalculation_Data.securityReport.checkCookiesHttpOnlyScore,
      Parameter: '1 if cookies are HttpOnly, else 0'
    },
    Google_Safe_Browsing: {
      Score: MetricesCalculation_Data.securityReport.safeBrowsingScore,
      Parameter: '1 if site is safe according to Google Safe Browsing, else 0'
    },
    Blacklist: {
      Score: MetricesCalculation_Data.securityReport.blacklistScore,
      Parameter: '1 if site is not blacklisted, else 0'
    },
    Malware_Scan: {
      Score: MetricesCalculation_Data.securityReport.malwareScanScore,
      Parameter: '1 if no malware detected, else 0'
    },
    SQLi_Exposure: {
      Score: MetricesCalculation_Data.securityReport.sqliExposureScore,
      Parameter: '1 if site is not vulnerable to SQL injection, else 0'
    },
    XSS: {
      Score: MetricesCalculation_Data.securityReport.xssVulnerabilityScore,
      Parameter: '1 if site is not vulnerable to XSS, else 0'
    },
    Cookie_Consent: {
      Score: MetricesCalculation_Data.securityReport.cookieConsentScore,
      Parameter: '1 if cookie consent banner is implemented, else 0'
    },
    Privacy_Policy: {
      Score: MetricesCalculation_Data.securityReport.privacyPolicyScore,
      Parameter: '1 if privacy policy exists, else 0'
    },
    Forms_Use_HTTPS: {
      Score: MetricesCalculation_Data.securityReport.formsUseHTTPSScore,
      Parameter: '1 if forms submit over HTTPS, else 0'
    },
    GDPR_CCPA: {
      Score: MetricesCalculation_Data.securityReport.checkGDPRCCPAScore,
      Parameter: '1 if GDPR/CCPA compliance implemented, else 0'
    },
    Data_Collection: {
      Score: MetricesCalculation_Data.securityReport.checkDataCollectionScore,
      Parameter: '1 if data collection practices are compliant, else 0'
    },
    Weak_Default_Credentials: {
      Score: MetricesCalculation_Data.securityReport.weakDefaultCredsScore,
      Parameter: '1 if no weak default credentials exist, else 0'
    },
    MFA_Enabled: {
      Score: MetricesCalculation_Data.securityReport.mfaEnabledScore,
      Parameter: '1 if multi-factor authentication is enabled, else 0'
    },
    Admin_Panel_Public: {
      Score: MetricesCalculation_Data.securityReport.checkAdminPanelPublicScore,
      Parameter: '1 if admin panel is not publicly accessible, else 0'
    },
    Mixed_Content: {
      Score: MetricesCalculation_Data.securityReport.mixedContentScore,
      Parameter: '1 if no mixed content (HTTP resources) exists, else 0'
    },
    Vulnerable_JS: {
      Score: MetricesCalculation_Data.securityReport.vulnerableJSScore,
      Parameter: '1 if no vulnerable JS libraries detected, else 0'
    },
    Noopener: {
      Score: MetricesCalculation_Data.securityReport.noopenerScore,
      Parameter: '1 if links with target=_blank use rel=noopener, else 0'
    },
    Console_Errors: {
      Score: MetricesCalculation_Data.securityReport.consoleErrorsScore,
      Parameter: '1 if no console errors found, else 0'
    },
    Percentage: MetricesCalculation_Data.securityReport.actualPercentage,
    Warning: MetricesCalculation_Data.securityReport.warning,
    Passed:MetricesCalculation_Data.securityReport. passed,
    Total: MetricesCalculation_Data.securityReport.Total,
    Improvements: MetricesCalculation_Data.securityReport.improvements
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