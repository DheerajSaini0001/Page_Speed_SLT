import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import { Check, X } from "lucide-react"; // Imported Check and X icons

export default function Accessibility({ data }) {
  const { darkMode } = useContext(ThemeContext);

  if (!data) {
    return <div />;
  }

  // Updated ScoreBadge to match the On_Page_SEO component's style and logic
  const ScoreBadge = ({ score }) => {
    const cssscore = score ? "bg-green-300" : "bg-red-300";
    const hasValue = score ? <Check size={18} /> : <X size={18} />;
    
    // The badgeBg variable from the original code is not used, so it can be removed for clarity.
    // The logic here is simplified to directly use the light/dark mode check.
    return (
      <span
        className={`${
          darkMode
            ? "px-2.5 py-1 rounded-full text-black font-semibold text-sm shadow-md transform transition-transform "
            : "px-2.5 py-1 rounded-full text-black font-semibold text-sm shadow-md transform transition-transform "
        } ${cssscore}`}
      >
        {hasValue}
      </span>
    );
  };

  // Theme-based classes
  const containerBg = darkMode
    ? "bg-zinc-900 border-gray-700 text-white"
    : "bg-gray-100 border-gray-300 text-black";
  const cardBg = darkMode
    ? "bg-gradient-to-br from-blue-900 via-gray-900 to-black"
    : "bg-gradient-to-br from-blue-200 via-gray-200 to-white";
  const textColor = darkMode ? "text-white" : "text-black";

  return (
    <div
      id="accessibility"
      className={`min-h-fit pt-20 pb-16 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 m-4 flex flex-col items-center justify-start p-6 space-y-6 ${containerBg}`}
    >
      <h1 className="text-3xl font-extrabold mb-6">
        Accessibility{" "}
        
      </h1>

      <div
        className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex justify-between items-center">
            <span className={`${textColor}`}>Color Contrast Score</span>
            <ScoreBadge score={data.Accessibility.Color_Contrast.Score} />
          </div>
          <div className="flex justify-between items-center">
            <span className={`${textColor}`}>Focusable/Keyboard Nav Score</span>
            <ScoreBadge score={data.Accessibility.Focusable.Score} />
          </div>
          <div className="flex justify-between items-center">
            <span className={`${textColor}`}>ARIA/Labelling Score</span>
            <ScoreBadge score={data.Accessibility.ARIA.Score} />
          </div>
          <div className="flex justify-between items-center">
            <span className={`${textColor}`}>Alt/Text Equivalents Score</span>
            <ScoreBadge score={data.Accessibility.Alt_or_Text_Equivalents.Score} />
          </div>
          <div className="flex justify-between items-center">
            <span className={`${textColor}`}>Skip Links Score</span>
            <ScoreBadge score={data.Accessibility.Skip_Links.Score} />
          </div>
          <div className="flex justify-between items-center">
            <span className={`${textColor}`}>Landmarks Score</span>
            <ScoreBadge score={data.Accessibility.Landmarks.Score} />
          </div>
        </div>
      </div>
    </div>
  );
}