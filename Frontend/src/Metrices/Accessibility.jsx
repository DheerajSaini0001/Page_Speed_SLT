import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext"; // ✅ ThemeContext import

export default function Accessibility({ data }) {
  const { darkMode } = useContext(ThemeContext); // ✅ useContext

  if (!data || !data.Metrices_Data) {
    return <div />;
  }

  // ✅ ScoreBadge theme-aware
  const ScoreBadge = ({ score, out }) => {
    const badgeBg = darkMode
      ? "bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-black"
      : "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white";

    return (
      <span
        className={`px-2.5 py-1 rounded-full font-semibold text-sm shadow-md transform transition-transform hover:scale-110 ${badgeBg}`}
      >
        {score}/{out}
      </span>
    );
  };

  // Theme-based classes
  const containerBg = darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-100 border-gray-300";
  const cardBg = darkMode
    ? "bg-gradient-to-br from-blue-900 via-gray-900 to-black"
    : "bg-gradient-to-br from-blue-200 via-gray-200 to-white";
  const textColor = darkMode ? "text-white" : "text-black";

  return (
    <div
      id="accessibility"
      className={`min-h-fit pt-20 pb-16 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 m-4 flex flex-col items-center justify-start p-6 space-y-6 ${containerBg}`}
    >
      <h1 className={`text-3xl font-extrabold mb-6 ${textColor}`}>
        Accessibility{" "}
        <span className={textColor}>
          ({data.Metrices_Data?.Accessibility?.Accessibility_Score_Total} out of 12)
        </span>
      </h1>

      <div
        className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div className="flex justify-between items-center">
            <span className={textColor}>Color Contrast Score</span>
            <ScoreBadge score={data.Metrices_Data?.Accessibility.Color_Contrast_Score ?? 0} out={3} />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Focusable/Keyboard Nav Score</span>
            <ScoreBadge score={data.Metrices_Data?.Accessibility.Focusable_Score ?? 0} out={3} />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>ARIA/Labelling Score</span>
            <ScoreBadge score={data.Metrices_Data?.Accessibility.ARIA_Score ?? 0} out={3} />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Alt/Text Equivalents Score</span>
            <ScoreBadge score={data.Metrices_Data?.Accessibility.Alt_or_Text_Equivalents_Score ?? 0} out={2} />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Skip Links/Landmarks Score</span>
            <ScoreBadge score={data.Metrices_Data?.Accessibility.Skip_Links_or_Landmarks_Score ?? 0} out={1} />
          </div>
        </div>
      </div>
    </div>
  );
}
