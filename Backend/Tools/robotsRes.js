import puppeteer from "puppeteer";

export default async function robotsRes(url) {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Go to robots.txt of the site
    const robotsUrl = new URL("/robots.txt", url).href;
    await page.goto(robotsUrl, { waitUntil: "networkidle2" });

    // Extract the text content of robots.txt
    const robotsText = await page.evaluate(() => document.body.innerText);

    return robotsText;
  } catch (error) {
    console.error("Error fetching robots.txt:", error);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
