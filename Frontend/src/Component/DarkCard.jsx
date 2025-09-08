import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import Sidebar from "./Sidebar";
import Dashboard2 from "./Dashboard2";


export default function DarkCard() {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState(null);

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:2000/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([inputValue]),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      setResult(result);
      console.log(result);
      setInputValue("");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="flex flex-col min-h-screen pt-60 items-center">
        {/* Show input section only if result is not available */}
        {!result && (
          <div className="max-w-sm mx-auto min-w-10 min-h-2xl bg-gray-900 text-white rounded-2xl shadow-2xl p-6 space-y-4 border border-gray-700">
            {/* Heading */}
            <h2 className="text-2xl font-bold text-center">
              Check your Page Audits and Performance
            </h2>

            {/* Info Paragraph */}
            <p className="text-gray-400 text-sm text-center">
              Enter URL in the input below and click the Analyze button. A loader will
              appear while processing.
            </p>

            <div className="flex m-2">
              {/* Input Field */}
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type here..."
                className="w-full px-4 p-2 py-2 rounded-lg bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              {/* Button */}
              <button
                onClick={handleClick}
                disabled={loading}
                className="ml-2 p-3 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition rounded-lg py-2 font-semibold"
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                ) : null}
                {loading
                  ? "⏳ Analyzing website... Please wait."
                  : "Analyze"}
              </button>
            </div>
          </div>
        )}

        {/* Sidebar appears after result */}
        {result && <Sidebar data={result} />}
        <Dashboard2 data={result}/>
      </div>
    </div>
  );
}
