
export default function Metrices(url,technicalReport,seoReport,accessibilityReport,securityReport,uxReport,conversionReport,aioReport) {

    const Metrices = {
      URL:url,
      Technical_Performance:{
        Core_Web_Vitals:{
          LCP_Score:technicalReport.lcpScore,
          CLS_Score:technicalReport.clsScore,
          INP_Score:technicalReport.inpScore,
          Total_Score_A1:technicalReport.total_A1
        },
        Delivery_and_Render:{
          TTFB_Score:technicalReport.ttfbScore,
          Compression_Score:technicalReport.compressionScore,
          Caching_Score:technicalReport.cachingscore,
          HTTP_Score:technicalReport.httpscore,
          Total_Score_A2:technicalReport.total_A2
        },
        Crawlability_and_Hygiene:{
          Sitemap_Score:technicalReport.sitemapScore,
          Robots_Score:technicalReport.robotsScore,
          Broken_Links_Score:technicalReport.brokenLinksScore,
          Redirect_Chains_Score:technicalReport.redirectChainsScore,
          Total_Score_A3:technicalReport.totalScore_A3
        },
        Technical_Performance_Score_Total:technicalReport.totalScore
      },
       On_Page_SEO:{
        Essentials:{
          Unique_Title_Score:seoReport.B1.title,
          Meta_Description_Score:seoReport.B1.metaDescription,
          Canonical_Score:seoReport.B1.canonical,
          H1_Score:seoReport.B1.h1,
          Total_Score_B1:seoReport.B1.total
        },
        Media_and_Semantics:{
          Image_ALT_Score:seoReport.B2.imageAlt,
          Heading_Hierarchy_Score:seoReport.B2.headingHierarchy,
          Descriptive_Links_Score:seoReport.B2.descriptiveLinks,
          Total_Score_B2:seoReport.B2.total
        },
        Structure_and_Uniqueness:{
          URL_Slugs_Score:seoReport.B3.urlSlugs,
          Duplicate_Content_Score:seoReport.B3.duplicateContent,
          Pagination_Tags_Score:seoReport.B3.pagination,
          Total_Score_B3:seoReport.B3.total
        },
        On_Page_SEO_Score_Total:seoReport.B1.total + seoReport.B2.total + seoReport.B3.total
      },
      Accessibility:{
        Color_Contrast_Score:accessibilityReport.C.colorContrast,
        Focusable_Score:accessibilityReport.C.keyboardNavigation,
        ARIA_Score:accessibilityReport.C.ariaLabeling,
        Alt_or_Text_Equivalents_Score:accessibilityReport.C.altTextEquivalents,
        Skip_Links_or_Landmarks_Score:accessibilityReport.C.skipLinksLandmarks,
        Accessibility_Score_Total:accessibilityReport.C.totalCScore
      },
      Security_or_Compliance:{
        HTTPS_Score:securityReport.D.httpsMixedContent,
        HSTS_Score:securityReport.D.hsts,
        Security_Headers_Score:securityReport.D.securityHeaders,
        Cookie_Banner_and_Consent_Mode_Score:securityReport.D.cookieConsent,
        Error_Pages_Score:securityReport.D.errorPages,
        Security_or_Compliance_Score_Total:securityReport.D.totalDScore
      },
      UX_and_Content_Structure:{
        Mobile_Friendliness_Score:uxReport.E.mobileFriendliness,
        Navigation_Depth_Score:uxReport.E.navigationDepth,
        Layout_Shift_On_interactions_Score:uxReport.E.layoutShift,
        Readability_Score:uxReport.E.readability,
        Intrusive_Interstitials_Score:uxReport.E.intrusiveInterstitials,
        UX_and_Content_Structure_Score_Total:uxReport.E.totalEScore
      },
      Conversion_and_Lead_Flow:{
        Primary_CTAs_Score:conversionReport.F.primaryCTA,
        Forms_Score:conversionReport.F.forms,
        Thank_You_or_Success_State_Score:conversionReport.F.thankYouState,
        Tracking_Of_Form_Submits_or_Events_Score:conversionReport.F.tracking,
        Contact_Info_Score:conversionReport.F.contactInfo,
        Load_On_CRM_or_Webhook_Score:conversionReport.F.crmWebhook,
        Conversion_and_Lead_Flow_Score_Total:conversionReport.F.totalFScore
      },
      AIO_Readiness:{
        Entity_and_Organization_Clarity:{
          Organization_JSON_LD_Score:aioReport.G.orgFields,
          Consistent_NAP_Score:aioReport.G.napConsistency,
          Humans_or_Policies_Score:aioReport.G.policies,
          Total_Score_G1:aioReport.G.totalG1
        },
        Content_Answerability_and_Structure:{
          FAQ_or_How_To_JSON_LD_Score:aioReport.G.faqJsonLd,
          Section_Anchors_or_TOC_Score:aioReport.G.sectionAnchors,
          Descriptive_Media_Captions_or_Figcaptions_Score:aioReport.G.mediaCaptions,
          Total_Score_G2: aioReport.G.totalG2
        },
         Product_or_Inventory_Schema_and_Feeds:{
          Correct_Schema_Types_Score:aioReport.G.productSchemas,
          Feed_Availability_Score:aioReport.G.feedAvailability,
          Total_Score_G3: aioReport.G.totalG3
        },
         Crawl_Friendliness_for_Knowledge_Agents:{
          Robots_Allowlist_Score: aioReport.G.crawlFriendliness,
          Total_Score_G4: aioReport.G.crawlFriendliness
        },
        AIO_Readiness_Score_Total: aioReport.G.totalGScore,
        AIO_Compatibility_Badge: aioReport.G.aioCompatibleBadge
      }
    }

    return Metrices
}
