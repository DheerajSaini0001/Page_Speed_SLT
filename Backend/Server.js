import puppeteer from "puppeteer";
import express from "express";
import cors from "cors";
import main from "./Main/main.js";

(async () => {
  const url = "https://carweek.com";
  let robotsScore = 0;

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    const robotsUrl = new URL("/robots.txt", url).href;
    const response = await page.goto(robotsUrl, { waitUntil: "networkidle2", timeout: 60000 });

    const responseStatus = response.status();
    console.log(responseStatus);
    
    robotsScore = responseStatus === 200 ? 1 : 0;

    console.log("Robots.txt URL:", robotsUrl);
    console.log("Status Code:", responseStatus);
    console.log("Robots Score:", robotsScore);

    if (robotsScore === 1) {
      const content = await page.evaluate(() => document.body.innerText);
      console.log("Content:\n", content);
    }
  } catch (err) {
    console.error("Error:", err.message);
    robotsScore = 0;
  } finally {
    await browser.close();
  }
})();



import dotenv from "dotenv";
dotenv.config();
const PORT =process.env.PORT;

const app = express();
app.use(express.json());
app.use(cors());

app.post('/data', async (req, res) => {

  const  message  = req.body;
  try {

(async () => {
  const url = "https://carweek.com";
  let robotsScore = 0;

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    const robotsUrl = new URL("/robots.txt", url).href;
    const response = await page.goto(robotsUrl, { waitUntil: "networkidle2", timeout: 60000 });

    const responseStatus = response.status();
    robotsScore = responseStatus === 200 ? 1 : 0;

    console.log("Robots.txt URL:", robotsUrl);
    console.log("Status Code:", responseStatus);
    console.log("Robots Score:", robotsScore);

    if (robotsScore === 1) {
      const content = await page.evaluate(() => document.body.innerText);
      console.log("Content:\n", content);
    }
  } catch (err) {
    console.error("Error:", err.message);
    robotsScore = 0;
  } finally {
    await browser.close();
  }
})();

  const data = await main(message)
  res.json(data);
  console.log(data);
    
  } catch (error) {
    console.error("Error fetching PageSpeed data:", error);
    res.status(500).json({ success: false, error: "Failed to fetch PageSpeed data" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});