import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import { Check, X } from "lucide-react"; // Imported Check and X icons

export default function Technical_Performance({ data }) {
  const { darkMode } = useContext(ThemeContext);

  if (!data || !data.Metrices_Data) {
    return <div></div>;
  }

  // Updated ScoreBadge to match the other components' style and logic
  const ScoreBadge = ({ score }) => {
    const cssscore = score ? "bg-green-300" : "bg-red-300";
    const hasValue = score ? <Check size={18} /> : <X size={18} />;

    return (
      <span
        className={`px-2.5 py-1 rounded-full text-black font-semibold text-sm shadow-md transform transition-transform hover:scale-110 ${cssscore}`}
      >
        {hasValue}
      </span>
    );
  };

  const containerBg = darkMode
    ? "bg-zinc-900 border-gray-700"
    : "bg-gray-100 border-gray-300";
  const cardBg = darkMode
    ? "bg-gradient-to-br from-blue-900 via-gray-900 to-black"
    : "bg-gradient-to-br from-blue-200 via-gray-200 to-white";
  const textColor = darkMode ? "text-white" : "text-black";

  return (
    <div
      id="TechnicalPerformance"
      className={`min-h-fit pt-20 pb-16 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 m-4 flex flex-col items-center justify-start p-6 space-y-6 ${containerBg}`}
    >
      <h1 className={`text-3xl font-extrabold mb-6 ${textColor}`}>
        Technical Performance{" "}
       
      </h1>

      {/* Core Web Vitals */}
      <div
        className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}
      >
        <h2 className={`text-xl font-bold mb-4 ${textColor}`}>
          Core Web Vitals{" "}
          
        </h2>
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm`}>
          <div className={`flex justify-between items-center ${textColor}`}>
            <span>Largest Contentful Paint (LCP) Score</span>
            <ScoreBadge
              score={
                data.Metrices_Data?.Technical_Performance?.Core_Web_Vitals
                  ?.LCP_Score ?? 0
              }
            />
          </div>
          <div className={`flex justify-between items-center ${textColor}`}>
            <span>Cumulative Layout Shift (CLS) Score</span>
            <ScoreBadge
              score={
                data.Metrices_Data?.Technical_Performance?.Core_Web_Vitals
                  ?.CLS_Score ?? 0
              }
            />
          </div>
          <div className={`flex justify-between items-center ${textColor}`}>
            <span>Interaction to Next Paint (INP) Score</span>
            <ScoreBadge
              score={
                data.Metrices_Data?.Technical_Performance?.Core_Web_Vitals
                  ?.INP_Score ?? 0
              }
            />
          </div>
        </div>
      </div>

      {/* Delivery & Render */}
      <div
        className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-purple-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}
      >
        <h2 className={`text-xl font-bold mb-4 ${textColor}`}>
          Delivery & Render{" "}
         
        </h2>
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm`}>
          <div className={`flex justify-between items-center ${textColor}`}>
            <span>Time to First Byte (TTFB) Score</span>
            <ScoreBadge
              score={
                data.Metrices_Data?.Technical_Performance?.Delivery_and_Render
                  ?.TTFB_Score ?? 0
              }
            />
          </div>
          <div className={`flex justify-between items-center ${textColor}`}>
            <span>Compression Score</span>
            <ScoreBadge
              score={
                data.Metrices_Data?.Technical_Performance?.Delivery_and_Render
                  ?.Compression_Score ?? 0
              }
            />
          </div>
          <div className={`flex justify-between items-center ${textColor}`}>
            <span>Caching Score</span>
            <ScoreBadge
              score={
                data.Metrices_Data?.Technical_Performance?.Delivery_and_Render
                  ?.Caching_Score ?? 0
              }
            />
          </div>
          <div className={`flex justify-between items-center ${textColor}`}>
            <span>HTTP/2 or HTTP/3 Score</span>
            <ScoreBadge
              score={
                data.Metrices_Data?.Technical_Performance?.Delivery_and_Render
                  ?.HTTP_Score ?? 0
              }
            />
          </div>
        </div>
      </div>

      {/* Crawlability & Hygiene */}
      <div
        className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-pink-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}
      >
        <h2 className={`text-xl font-bold mb-4 ${textColor}`}>
          Crawlability & Hygiene{" "}
         
        </h2>
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm`}>
          <div className={`flex justify-between items-center ${textColor}`}>
            <span>Sitemap Score</span>
            <ScoreBadge
              score={
                data.Metrices_Data?.Technical_Performance
                  ?.Crawlability_and_Hygiene?.Sitemap_Score ?? 0
              }
            />
          </div>
          <div className={`flex justify-between items-center ${textColor}`}>
            <span>Robots Score</span>
            <ScoreBadge
              score={
                data.Metrices_Data?.Technical_Performance
                  ?.Crawlability_and_Hygiene?.Robots_Score ?? 0
              }
            />
          </div>
          <div className={`flex justify-between items-center ${textColor}`}>
            <span>Broken Links Score</span>
            <ScoreBadge
              score={
                data.Metrices_Data?.Technical_Performance
                  ?.Crawlability_and_Hygiene?.Broken_Links_Score ?? 0
              }
            />
          </div>
          <div className={`flex justify-between items-center ${textColor}`}>
            <span>Redirect Chains Score</span>
            <ScoreBadge
              score={
                data.Metrices_Data?.Technical_Performance
                  ?.Crawlability_and_Hygiene?.Redirect_Chains_Score ?? 0
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}