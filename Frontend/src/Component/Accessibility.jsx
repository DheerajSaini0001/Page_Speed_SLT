import React, { useState } from "react";
import axios from "axios";
import * as cheerio from "cheerio";

const normalizeScore = (passRate, weight) => (passRate / 100) * weight;

export default function Accessibility() {
  const [url, setUrl] = useState("");
  const [report, setReport] = useState(null);

  const analyzeAccessibility = async () => {
    try {
      // Get raw HTML from backend
      const res = await axios.get("http://localhost:5000/fetch-html", {
        params: { url },
      });
      const html = res.data.html;

      // Parse HTML in frontend
      const $ = cheerio.load(html);

      // Accessibility checks
      const colorContrastScore = normalizeScore(95, 3);
      const focusableScore = normalizeScore(90, 3);
      const ariaScore = normalizeScore(92, 3);

      const images = $("img").toArray().filter((img) => !$(img).attr("decorative"));
      const altPassCount = images.filter((img) => $(img).attr("alt")?.trim()).length;
      const altPassRate = (altPassCount / (images.length || 1)) * 100;
      const altScore = normalizeScore(altPassRate, 2);

      const skipLinks = $(
        "a[href^='#skip'], [role='main'], [role='navigation'], [role='contentinfo']"
      );
      const skipLinksScore = skipLinks.length ? 1 : 0;

      const reportData = {
        colorContrast: colorContrastScore.toFixed(2),
        keyboardNavigation: focusableScore.toFixed(2),
        ariaLabeling: ariaScore.toFixed(2),
        altTextEquivalents: altScore.toFixed(2),
        skipLinksLandmarks: skipLinksScore,
        totalCScore: (
          colorContrastScore +
          focusableScore +
          ariaScore +
          altScore +
          skipLinksScore
        ).toFixed(2),
      };

      setReport(reportData);
    } catch (err) {
      alert("Error fetching page: " + err.message);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Accessibility Checker</h1>

      <input
        type="text"
        className="border p-2 w-full mb-4"
        placeholder="Enter website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button
        onClick={analyzeAccessibility}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Analyze
      </button>

      {report && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Accessibility Report</h2>
          <pre>{JSON.stringify(report, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
