import axios from "axios";
import * as cheerio from "cheerio";

export default async function axios_cheerio(url) {

    try{
    const html = await axios.get(url);
    const htmlData = html.data;
    const $ = cheerio.load(htmlData);

    return $;
    }
    catch (error) {
    console.error("Error fetching Axios data:", error);
    res.status(500).json({ success: false, error: "Failed to fetch Axios data" });
  }
}
