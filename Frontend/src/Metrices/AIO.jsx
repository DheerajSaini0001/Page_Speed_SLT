import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext"; // ✅ ThemeContext import

export default function AIO({ data }) {
  const { darkMode } = useContext(ThemeContext); // ✅ useContext

  if (!data || !data.Metrices_Data) return <div />;

  // ✅ ScoreBadge theme-aware
  const ScoreBadge = ({ score, out }) => {
    const badgeBg = darkMode
      ? "bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-black"
      : "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white";

    return (
      <span className={darkMode? "px-2.5 py-1 rounded-full   text-black bg-white font-semibold text-sm shadow-md transform transition-transform hover:scale-110":" px-2.5 py-1 rounded-full text-white bg-black font-semibold text-sm shadow-md transform transition-transform hover:scale-110"} >
        {score}/{out}
      </span>
    );
  };

  // Theme-based classes
  const containerBg = darkMode ? "bg-gray-900 border-gray-700 text-white" : "bg-gray-100 border-gray-300 text-black";
  const cardBg = darkMode
    ? "bg-gradient-to-br from-blue-900 via-gray-900 to-black"
    : "bg-gradient-to-br from-blue-200 via-gray-200 to-white";

  return (
    <div
      id="AIOReadiness"
      className={`min-h-fit pt-20 pb-16 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 m-4 flex flex-col items-center justify-start p-6 space-y-6 ${containerBg}`}
    >
      <h1 className="text-3xl font-extrabold mb-6">
        AIO (AI-Optimization) Readiness{" "}
        <span>
          ({data.Metrices_Data?.AIO_Readiness?.AIO_Readiness_Score_Total} out of 10)
        </span>
      </h1>

      <h1 className="text-3xl font-extrabold mb-6">
        AIO Compatibility Badge -{" "}
        <span>
          {data.Metrices_Data?.AIO_Readiness?.AIO_Compatibility_Badge}
        </span>
      </h1>

      {/* All metric cards */}
      {[
        {
          title: "Entity & Organization Clarity",
          scores: data.Metrices_Data?.AIO_Readiness?.Entity_and_Organization_Clarity,
          outTotal: 4,
          borderColor: "border-indigo-500",
        },
        {
          title: "Content Answerability & Structure",
          scores: data.Metrices_Data?.AIO_Readiness?.Content_Answerability_and_Structure,
          outTotal: 3,
          borderColor: "border-indigo-500",
        },
        {
          title: "Product/Inventory Schema & Feeds",
          scores: data.Metrices_Data?.AIO_Readiness?.Product_or_Inventory_Schema_and_Feeds,
          outTotal: 2,
          borderColor: "border-pink-500",
        },
        {
          title: "Crawl Friendliness for Knowledge Agents",
          scores: data.Metrices_Data?.AIO_Readiness?.Crawl_Friendliness_for_Knowledge_Agents,
          outTotal: 1,
          borderColor: "border-pink-500",
        },
      ].map((section, idx) => (
        <div
          key={idx}
          className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg ${section.borderColor} bg-gradient-to-br hover:scale-105 transition-transform duration-300 ${cardBg}`}
        >
          <h2 className="text-xl font-bold mb-4">
            {section.title}{" "}
            <span>
              ({section.scores?.Total_Score_G1 ??
                section.scores?.Total_Score_G2 ??
                section.scores?.Total_Score_G3 ??
                section.scores?.Total_Score_G4 ??
                0}{" "}
              out of {section.outTotal})
            </span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
            {section.scores &&
              Object.entries(section.scores).map(([key, value], i) => {
                if (key.includes("Total_Score")) return null; // Skip total
                return (
                  <div key={i} className="flex justify-between items-center">
                    <span>{key.replace(/_/g, " ")}</span>
                    <ScoreBadge score={value ?? 0} out={section.outTotal} />
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
