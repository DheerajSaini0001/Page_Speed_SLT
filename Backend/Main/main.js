import MetricesCalculation from "../Calculation/MetricesCalculation.js";
import Metrices from "../Data/Metrices.js";
import OverAll from "../Data/OverAll.js";
import puppeteer_cheerio from "../Tools/puppeteer_cheerio.js";
import googleAPI from "../Tools/googleAPI.js";
import robotsRes from "../Tools/robotsRes.js";

export default async function main(message) {

  var url = message[0].trim();
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

    console.log(`URL Received: ${url}`);

    const googleApi_Data = await googleAPI(url);
    const axios_cheerio_Data = await puppeteer_cheerio(url);
    const robotsRes_Data = await robotsRes(url);

    const MetricesCalculation_Data = await MetricesCalculation(url,googleApi_Data,axios_cheerio_Data,robotsRes_Data)
    const Metrices_Data = await Metrices(url,MetricesCalculation_Data.technicalReport,MetricesCalculation_Data.seoReport,MetricesCalculation_Data.accessibilityReport,MetricesCalculation_Data.securityReport,MetricesCalculation_Data.uxReport,MetricesCalculation_Data.conversionReport,MetricesCalculation_Data.aioReport)

    const Overall_Data = OverAll(Metrices_Data)

    return {
        Metrices_Data,
        Overall_Data

    }


}
