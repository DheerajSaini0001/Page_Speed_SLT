import React, { useState } from "react";
import { Loader2, Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";
import Dashboard2 from "./Dashboard2";

export default function DarkCard() {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      setInputValue("");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-0 min-h-screen min-w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* ✅ Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-gray-900 border-b border-gray-700 flex items-center justify-between px-4 py-3 z-50">
        {/* Hamburger button (mobile only) */}
        {result && (
          <button
            className="lg:hidden p-2 rounded-lg bg-gray-800"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        )}

        {/* Logo / Title */}
        <div className="flex flex-col justify-center items-center text-2xl sm:text-4xl font-bold">
          Site Audits
        </div>
      </nav>

      <div className="flex flex-col min-h-screen pt-16 items-center">
        {/* ✅ Input Section */}
        {!result && (
          <div className="w-full mt-10 max-w-sm mx-auto bg-gray-900 rounded-2xl shadow-2xl p-6 space-y-4 border border-gray-700">
            <h2 className="text-2xl font-bold text-center">
              Check your Page Audits and Performance
            </h2>
            <p className="text-gray-400 text-sm text-center">
              Enter URL in the input below and click the Analyze button. A loader
              will appear while processing.
            </p>

            <form
              className="flex flex-col sm:flex-row gap-2"
              onSubmit={handleClick}
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type here..."
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition rounded-lg px-4 py-2 font-semibold"
              >
                {loading && <Loader2 className="animate-spin mr-2 h-5 w-5" />}
                {loading ? "⏳ Analyzing..." : "Analyze"}
              </button>
            </form>
          </div>
        )}

        {/* ✅ Sidebar + Dashboard layout */}
        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] w-full min-h-screen relative">
            {/* Sidebar */}
            <div
              className={`fixed lg:static top-16 left-0 w-64 bg-gray-900 border-r border-gray-700 transform ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 h-[calc(100vh-4rem)] overflow-y-auto pb-4`}
            >
              <Sidebar />
            </div>

            {/* Mobile overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Main Dashboard */}
            <div className="p-4 sm:p-6 w-full mt-0 lg:mt-0">
              <Dashboard2 data={result} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
