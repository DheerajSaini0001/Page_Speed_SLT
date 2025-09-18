import express from "express";
import cors from "cors";
import googleAPI from "./Tools/googleAPI.js";
import axios_cheerio from "./Tools/axios_cheerio.js";
import robotsRes from "./Tools/robotsRes.js";
import MetricesCalculation from "./Calculation/MetricesCalculation.js";
import Metrices from "./Data/Metrices.js";
import OverAll from "./Data/OverAll.js";

const PORT =2000;

const app = express();
app.use(express.json());
app.use(cors());

app.post('/data', async (req, res) => {

  const  message  = req.body;

  var url = message[0].trim();
  // If it doesn't start with http:// or https://, add https://
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  console.log(`URL Received: ${url}`);

  try {
    const googleApi_Data = await googleAPI(url);
    const axios_cheerio_Data = await axios_cheerio(url);
    const robotsRes_Data = await robotsRes(url);

    const MetricesCalculation_Data = await MetricesCalculation(url,googleApi_Data,axios_cheerio_Data,robotsRes_Data)
    const Metrices_Data = await Metrices(url,MetricesCalculation_Data.technicalReport,MetricesCalculation_Data.seoReport,MetricesCalculation_Data.accessibilityReport,MetricesCalculation_Data.securityReport,MetricesCalculation_Data.uxReport,MetricesCalculation_Data.conversionReport,MetricesCalculation_Data.aioReport)

    const Overall_Data = OverAll(Metrices_Data)
  res.json({Metrices_Data,Overall_Data});
  console.log(Metrices_Data);
  console.log(Overall_Data);
    
  } catch (error) {
    console.error("Error fetching PageSpeed data:", error);
    res.status(500).json({ success: false, error: "Failed to fetch PageSpeed data" });
  }
});


app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
