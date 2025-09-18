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

    // Set headers like a real browser
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
    );
    await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });

    // Go to the page
    await page.goto(url, { waitUntil: "networkidle2" });
    await page.waitForSelector("body", { timeout: 10000 });

    // Get HTML content
    const htmlData = await page.content();

    // Load into Cheerio
    const $ = cheerio.load(htmlData);

    await browser.close();
    return $; // same $ object as before
  } catch (error) {
    if (browser) await browser.close();
    console.error("Error fetching Puppeteer data:", error);
    return null;
  }
}
