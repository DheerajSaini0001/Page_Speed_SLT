import express from "express";
import axios from "axios";
import cors from "cors";
const PORT =2000;

const app = express();
app.use(cors());

// --- Route: Fetch raw HTML ---
// app.get("/fetch-html", async (req, res) => {
//   const { url } = req.query;

//   if (!url) {
//     return res.status(400).json({ error: "Missing url parameter" });
//   }

//   try {
//     const response = await axios.get(url, {
//       headers: {
//         "User-Agent":
//           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0 Safari/537.36",
//         Accept: "text/html,application/xhtml+xml",
//       },
//     });

//     res.json({ html: response.data });
//   } catch (err) {
//     console.error("❌ Fetch failed:", err.message);
//     if (err.response) {
//       console.error("Status:", err.response.status, err.response.statusText);
//     }

//     res.status(500).json({
//       error: "Failed to fetch page",
//       details: err.message,
//       status: err.response?.status,
//     });
//   }
// });

app.post('/data', async (req, res) => {
  const { message } = req.body;
  console.log(`URL Received: ${message}`);

  try {
    const apiUrlDesktop =`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${ encodeURIComponent(message)}&strategy=desktop&key=${API_KEY}`;
    const apiUrlMobile =`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${ encodeURIComponent(message)}&strategy=mobile&key=${API_KEY}`;

    const responseDesktop = await fetch(apiUrlDesktop);
    const responseMobile = await fetch(apiUrlMobile);
    console.log(apiUrlDesktop);
    

    
    const dataDasktop = await responseDesktop.json();    
    const dataMobile = await responseMobile.json();    
    const alldata={desktop:dataDasktop,mobile:dataMobile}
    res.json(alldata);
    console.log(alldata);
    
  } catch (error) {
    console.error("Error fetching PageSpeed data:", error);
    res.status(500).json({ success: false, error: "Failed to fetch PageSpeed data" });
  }
});
// --- Start server on free port ---

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
