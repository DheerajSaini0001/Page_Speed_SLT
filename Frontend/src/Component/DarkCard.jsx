import React, { useState } from "react";
import { Loader2, Menu, X ,Search} from "lucide-react";
import Sidebar from "./Sidebar";
import Dashboard2 from "./Dashboard2";
import Technical_Performance from "../Metrices/Technical_Performance";
import On_Page_SEO from "../Metrices/On_Page_SEO";
import Accessibility from "../Metrices/Accessibility";
import Security_Compilance from "../Metrices/Security_Compilance";
import UX_Content_Structure from "../Metrices/UX_Content_Structure";
import Conversion_Lead_Flow from "../Metrices/Conversion_Lead_Flow";
import AIO from "../Metrices/AIO";
// import logo from "./android-chrome-192x192.png";
import Footer from "./Footer";
import RawData from "../Metrices/RawData";
import Assets from '../assets/Assets.js'

export default function DarkCard() {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const response = await fetch("http://localhost:2000/data", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify([inputValue]),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Server error: ${response.status}`);
  //     }

  //     const result = await response.json();
  //     setResult(result);
  //     console.log(result);

  //     setInputValue("");
  //   } catch (error) {
  //     alert("Error: " + error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleClick = async (e) => {
    e.preventDefault();
    console.log(inputValue);
    
    setLoading(true);
  
    // ✅ Validation function
    const checkURL = () => {
      if (!inputValue) {
        alert("URL is empty");
        return false;
      }
    
      if (inputValue.includes(" ")) {
        alert("Invalid URL: spaces are not allowed");
        return false;
      }
    
      if (inputValue.includes(".")) {
        return true;
      } else {
        alert("Invalid URL");
        return false;
      }
    };
    
  
    // ✅ Stop execution if invalid
    if (!inputValue || !checkURL()) {
      setLoading(false);
      return; 
    }
  
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
      // console.log(result);
  
      setInputValue("");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="scroll-smooth m-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-x-hidden flex flex-col min-h-screen">
      {/* ✅ Navbar */}
      <nav className="fixed top-0 left-0 w-full h-16 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-4 z-50">
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
        <div className="flex flex-col-rev justify-center  items-center gap-4 font-serif text-4xl font-bold bg-gradient-to-r from-sky-200 via-rose-200 to-orange-200  bg-clip-text text-transparent">
          <div>
            <img src={Assets.Logo} alt="" className="h-14" />
          </div>
          <div>Site Audits</div>
        </div>
      </nav>

      {/* Spacer to prevent content from going under navbar */}
      <div className="h-16"></div>

      {/* ✅ Main Content Wrapper */}
      <div className="flex-1 flex flex-col items-center">
        {/* Input Section (before result) */}
        {!result && (
          <div className="w-full mt-40 max-w-2xl mx-auto bg-gray-900 rounded-2xl shadow-2xl p-6 space-y-4 border border-gray-700">
            <h2 className="text-2xl font-bold text-center">
              Check your Page Audits and Performance
            </h2>
            <p className="text-gray-400 text-sm text-center">
              Enter URL in the input below and click the Analyze button.
            </p>

            <div className="w-96 flex flex-col justify-center items-center mx-auto">
              <form
                className="flex flex-col sm:flex-row gap-2"
                onSubmit={handleClick}
              >
               <div className="relative w-full">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/> <input
                  type="text"
                  value={inputValue}
                  disabled={loading}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter URL here..."
                  className="flex-1 pl-10 pr-4 rounded-4xl py-2 bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                /></div>
                <button
                  type="submit"
                  disabled={loading}
                   className= " flex  gap-2 items-center justify-center bg-[#c2fbd7] text-green-700 rounded-full   font-sans px-5 py-2 text-base border-0 select-none touch-manipulation transition duration-250 shadow-[rgba(44,187,99,0.2)_0_-25px_18px_-14px_inset,rgba(44,187,99,0.15)_0_1px_2px,rgba(44,187,99,0.15)_0_2px_4px,rgba(44,187,99,0.15)_0_4px_8px,rgba(44,187,99,0.15)_0_8px_16px,rgba(44,187,99,0.15)_0_16px_32px] hover:shadow-[rgba(44,187,99,0.35)_0_-25px_18px_-14px_inset,rgba(44,187,99,0.25)_0_1px_2px,rgba(44,187,99,0.25)_0_2px_4px,rgba(44,187,99,0.25)_0_4px_8px,rgba(44,187,99,0.25)_0_8px_16px,rgba(44,187,99,0.25)_0_16px_32px] active:scale-[1.05] active:-rotate-1 "
                >
                  {loading && (
                    <Loader2 className="animate-spin w-5 h-5" />
                  )}
                  {loading ? " Analyzing.." : "Analyze"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Sidebar + Dashboard layout (only when result exists) */}
        {result && (
          <div className="relative w-full flex flex-1">
            {/* Sidebar */}
            <div
              className={`fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] overflow-x-hidden bg-gray-900 border-r border-gray-700 transform 
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
              lg:translate-x-0 transition-transform overflow-x-hidden duration-300 ease-in-out overflow-y-auto pb-4`}
            >
              <Sidebar data={result} />
            </div>

            {/* Mobile overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Main Dashboard */}
            <div className="flex-1 lg:ml-64 pb-0 pl-4 pr-4 pt-4 space-y-8">
              <section id="deshboard" className="scroll-mt-20">
                <Dashboard2 data={result} />
              </section>

              <section id="technical-performance" className="scroll-mt-20">
                <Technical_Performance data={result} />
              </section>

              <section id="on-page-seo" className="scroll-mt-20">
                <On_Page_SEO data={result} />
              </section>

              <section id="accessibility">
                <Accessibility data={result} />
              </section>

              <section id="security" className="scroll-mt-20">
                <Security_Compilance data={result} />
              </section>

              <section id="ux" className="scroll-mt-20">
                <UX_Content_Structure data={result} />
              </section>

              <section id="conversion" className="scroll-mt-20">
                <Conversion_Lead_Flow data={result} />
              </section>

              <section id="aio" className="scroll-mt-20">
                <AIO data={result} />
              </section>

              <section id="Rawdata" className="scroll-mt-20">
                <RawData data={result} />
              </section>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Footer (always at bottom) */}
      <footer className="mt-auto bg-gray-800 text-white text-center">
        <Footer />
      </footer>
    </div>
  );
}
