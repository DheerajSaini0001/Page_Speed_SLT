import puppeteer from "puppeteer";

export default async function puppeteers(url) {
    
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

    const response = await page.goto(url, { waitUntil: "networkidle2",timeout: 240000 });
    await page.waitForSelector("body", { timeout: 240000 });

    return {browser,page,response}; 

  } catch (error) {
    if (browser) await browser.close();
    console.error("Error fetching Puppeteer data:", error);
    res.status(500).json({ success: false, error: "Failed to fetch Puppeteer API data" });
    return null;
  }
}
