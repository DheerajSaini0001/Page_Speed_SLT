import technicalMetrics from "../Metrices/technicalMetrics.js";
import seoMetrics from "../Metrices/seoMetrics.js";
import accessibilityMetrics from "../Metrices/accessibilityMetrics.js";
import securityCompliance from "../Metrices/securityCompliance.js";
import uxContentStructure from "../Metrices/uxContentStructure.js";
import conversionLeadFlow from "../Metrices/conversionLeadFlow.js";
import aioReadiness from "../Metrices/aioReadiness.js";
import puppeteers from "../Tools/puppeteers.js";


export default async function MetricesCalculation(url,data,robotsText) {

const {browser,page} = await puppeteers();

const technicalReport = await technicalMetrics(url,data,page);
const seoReport = await seoMetrics(url,page);
const accessibilityReport = await accessibilityMetrics(url,page);
const securityReport = await securityCompliance(url,page);
const uxReport = await uxContentStructure(url, page);
const conversionReport = await conversionLeadFlow(page);
const aioReport = await aioReadiness(url, robotsText,page);
browser.close();

  // console.log("Technical Report:", technicalReport)
  // console.log("SEO Report (B1+B2+B3):", seoReport);
  // console.log("Accessibility C Section Report:", accessibilityReport);
  // console.log("Security/Compliance D Section Report:", securityReport);
  // console.log("UX & Content Structure E Section Report:", uxReport);
  // console.log("Conversion & Lead Flow F Section Report:", conversionReport);
  // console.log("AIO G Section Report:", aioReport);

  return {
    technicalReport,
    seoReport,
    accessibilityReport,
    securityReport,
    uxReport,
    conversionReport,
    aioReport
  };
}
