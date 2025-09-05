import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());

// --- Route: Fetch raw HTML ---
app.get("/fetch-html", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    res.json({ html: response.data });
  } catch (err) {
    console.error("❌ Fetch failed:", err.message);
    if (err.response) {
      console.error("Status:", err.response.status, err.response.statusText);
    }

    res.status(500).json({
      error: "Failed to fetch page",
      details: err.message,
      status: err.response?.status,
    });
  }
});

// --- Start server on free port ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
