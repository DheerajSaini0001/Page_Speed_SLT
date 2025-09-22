import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext";

export default function UX_Content_Structure({ data }) {
  const { darkMode } = useContext(ThemeContext);

  if (!data || !data.Metrices_Data) {
    return <div></div>;
  }

  const ScoreBadge = ({ score, out }) => (
    <span
    className={darkMode? "px-2.5 py-1 rounded-full   text-black bg-white font-semibold text-sm shadow-md transform transition-transform hover:scale-110":" px-2.5 py-1 rounded-full text-white bg-black font-semibold text-sm shadow-md transform transition-transform hover:scale-110"}
    >
      {score}/{out}
    </span>
  );

  const containerBg = darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-100 border-gray-300";
  const cardBg = darkMode ? "bg-gradient-to-br from-blue-900 via-gray-900 to-black" : "bg-gradient-to-br from-blue-200 via-gray-200 to-white";
  const textColor = darkMode ? "text-white " : "text-black ";

  return (
    <div
      id="UXContentStructure"
      className={`min-h-fit pt-20 pb-16 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 m-4 flex flex-col items-center justify-start p-6 space-y-6 ${containerBg}`}
    >
      <h1 className={`text-3xl font-extrabold mb-6 text-heading-25  ${textColor}`}>
        UX Content Structure{" "}
        <span className={`${textColor} text-custom-18`}>
          ({data.Metrices_Data?.UX_and_Content_Structure?.UX_and_Content_Structure_Score_Total}/10)
        </span>
      </h1>

      <div className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}>
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm ${textColor}`}>
          <div className="flex justify-between text-custom-18 items-center">
            <span>Mobile Friendliness Score</span>
            <ScoreBadge score={data.Metrices_Data?.UX_and_Content_Structure.Mobile_Friendliness_Score ?? 0} out={3} />
          </div>
          <div className="flex justify-between text-custom-18 items-center">
            <span>Navigation Depth Score</span>
            <ScoreBadge score={data.Metrices_Data?.UX_and_Content_Structure.Navigation_Depth_Score ?? 0} out={2} />
          </div>
          <div className="flex justify-between text-custom-18 items-center">
            <span>Layout Shift On interactions Score</span>
            <ScoreBadge score={data.Metrices_Data?.UX_and_Content_Structure.Layout_Shift_On_interactions_Score ?? 0} out={2} />
          </div>
          <div className="flex justify-between text-custom-18 items-center">
            <span>Readability Score</span>
            <ScoreBadge score={data.Metrices_Data?.UX_and_Content_Structure.Readability_Score ?? 0} out={2} />
          </div>
          <div className="flex justify-between text-custom-18 items-center">
            <span>Intrusive Interstitials Score</span>
            <ScoreBadge score={data.Metrices_Data?.UX_and_Content_Structure.Intrusive_Interstitials_Score ?? 0} out={1} />
          </div>
        </div>
      </div>
    </div>
  );
}
