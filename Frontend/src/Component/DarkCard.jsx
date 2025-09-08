import React, { useState } from "react";
import { Loader2 } from "lucide-react";

export default function DarkCard() {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`You entered: ${inputValue}`);
    }, 2000); // simulate loading
  };

  return (
    <div className="max-w-sm mx-auto mt-10 bg-gray-900 text-white rounded-2xl shadow-2xl p-6 space-y-4 border border-gray-700">
      {/* Heading */}
      <h2 className="text-2xl font-bold text-center">Dark Theme Card</h2>

      {/* Info Paragraph */}
      <p className="text-gray-400 text-sm text-center">
        Enter some text in the input below and click the button. A loader will
        appear while processing.
      </p>

      {/* Input Field */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type here..."
        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      {/* Button */}
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition rounded-lg py-2 font-semibold"
      >
        {loading ? (
          <Loader2 className="animate-spin mr-2 h-5 w-5" />
        ) : null}
        {loading ? "Processing..." : "Submit"}
      </button>
    </div>
  );
}
