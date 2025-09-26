import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import { Check, X, AlertTriangle } from "lucide-react";
import CircularProgress from "../Component/CircularProgress";

export default function UX_Content_Structure({ data }) {
  const { darkMode } = useContext(ThemeContext);

  if (!data) return <div />;

  // ScoreBadge with descriptive text
  const ScoreBadge = ({ score, textGood, textBad }) => {
    const cssscore = score ? "bg-green-300" : "bg-red-300";
    const hasValue = score ? <Check size={18} /> : <X size={18} />;
    return (
      <span
        className={`px-2.5 flex items-center gap-1.5 py-1 rounded-full text-black font-semibold text-sm shadow-md transform transition-transform ${cssscore}`}
      >
        {hasValue} {score ? textGood : textBad}
      </span>
    );
  };

  const containerBg = darkMode
    ? "bg-zinc-900 border-gray-700 text-white"
    : "bg-gray-100 border-gray-300 text-black";
  const cardBg = darkMode
    ? "bg-gradient-to-br from-blue-900 via-gray-900 to-black"
    : "bg-gradient-to-br from-blue-200 via-gray-200 to-white";
  const textColor = darkMode ? "text-white" : "text-black";

  // Check if any UX metric failed
  const hasError =
    data.UX_and_Content_Structure.Mobile_Friendliness.Score === 0 ||
    data.UX_and_Content_Structure.Navigation_Depth.Score === 0 ||
    data.UX_and_Content_Structure.Layout_Shift_On_interactions.Score === 0 ||
    data.UX_and_Content_Structure.Readability.Score === 0 ||
    data.UX_and_Content_Structure.Intrusive_Interstitials.Score === 0;

  return (
    <div
      id="UXContentStructure"
      className={`min-h-fit pt-20 pb-16 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 m-4 flex flex-col items-center justify-start p-6 space-y-6 ${containerBg}`}
    >
      <h1 className={`responsive flex sm:gap-10 justify-center items-center text-3xl font-extrabold mb-6 text-center ${textColor}`}>
        UX Content Structure
       
        <CircularProgress
          value={data.UX_and_Content_Structure.UX_and_Content_Structure_Score_Total}
          size={70}
          stroke={5}
        />
      </h1>

      <div
        className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}
      >

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between items-center">
            <span className={textColor}>Mobile Friendliness</span>

            <ScoreBadge
              score={data.UX_and_Content_Structure.Mobile_Friendliness.Score}
              textGood="Mobile friendly"
              textBad="Not mobile friendly"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className={textColor}>Navigation Depth</span>

            <ScoreBadge
              score={data.UX_and_Content_Structure.Navigation_Depth.Score}
              textGood="Navigation depth OK"
              textBad="Navigation depth too deep"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className={textColor}>Layout Shift On Interactions</span>

            <ScoreBadge
              score={data.UX_and_Content_Structure.Layout_Shift_On_interactions.Score}
              textGood="Stable layout"
              textBad="Layout shifts detected"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className={textColor}>Readability</span>

            <ScoreBadge
              score={data.UX_and_Content_Structure.Readability.Score}
              textGood="Readable content"
              textBad="Readability issues"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className={textColor}>Intrusive Interstitials</span>

            <ScoreBadge
              score={data.UX_and_Content_Structure.Intrusive_Interstitials.Score}
              textGood="No intrusive interstitials"
              textBad="Intrusive interstitials present"
            />
          </div>
        </div>

        {/* Conditionally show error messages */}
        {hasError && <hr className="text-black mt-3" />}
        <div className="p-1 mt-2">
          {data.UX_and_Content_Structure.Mobile_Friendliness.Score === 0 && (
            <h1 className="flex gap-2 text-black">
              <AlertTriangle className="text-red-600" size={20} /> Viewport meta tag missing, Body font size less than 16px, Some buttons/links are too small tap targets less than 32px
            </h1>
          )}
          {data.UX_and_Content_Structure.Navigation_Depth.Score === 0 && (
            <h1 className="flex gap-2 text-black">
              <AlertTriangle className="text-red-600" size={20} /> Navigation depth too deep or inconsistent
            </h1>
          )}
          {data.UX_and_Content_Structure.Layout_Shift_On_interactions.Score === 0 && (
            <h1 className="flex gap-2 text-black">
              <AlertTriangle className="text-red-600" size={20} /> Layout shifts detected during user interactions
            </h1>
          )}
          {data.UX_and_Content_Structure.Readability.Score === 0 && (
            <h1 className="flex gap-2 text-black">
              <AlertTriangle className="text-red-600" size={20} /> Readability issues detected: Content too short or difficult to read.
            </h1>
          )}
          {data.UX_and_Content_Structure.Intrusive_Interstitials.Score === 0 && (
            <h1 className="flex gap-2 text-black">
              <AlertTriangle className="text-red-600" size={20} />Intrusive interstitials present
            </h1>
          )}
        </div>
      </div>
    </div>
  );
}
