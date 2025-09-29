import puppeteer from "puppeteer";

export default async function robotsRes(url,device) {

  if(device == 'desktop'){
    let browser;
    try {
      browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      
      const robotsUrl = new URL("/robots.txt", url).href;
      await page.goto(robotsUrl, { waitUntil: "networkidle2" });
      
      const robotsText = await page.evaluate(() => document.body.innerText);
      
      return robotsText;
    } catch (error) {
      console.error("Error fetching robots.txt", error);
      res.status(500).json({ success: false, error: "Failed to fetch robots.txt" });
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
else{
      let browser;
    try {
      browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
        await page.setViewport({
  width: 375,   
  height: 812,  
  isMobile: true,
  hasTouch: true,
});
      
      const robotsUrl = new URL("/robots.txt", url).href;
      await page.goto(robotsUrl, { waitUntil: "networkidle2" });
      
      const robotsText = await page.evaluate(() => document.body.innerText);
      
      return robotsText;
    } catch (error) {
      console.error("Error fetching robots.txt", error);
      res.status(500).json({ success: false, error: "Failed to fetch robots.txt" });
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
}
