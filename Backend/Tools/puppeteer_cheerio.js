import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

export default async function puppeteer_cheerio(url) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();


    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
    );
    await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });

    await page.goto(url, { waitUntil: "networkidle2" });
    await page.waitForSelector("body", { timeout: 10000 });

    const htmlData = await page.content();

    const $ = cheerio.load(htmlData);

    await browser.close();
    return $; 
  } catch (error) {
    if (browser) await browser.close();
    console.error("Error fetching Puppeteer data:", error);
    res.status(500).json({ success: false, error: "Failed to fetch Puppeteer API data" });
    return null;
  }
}
