import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import { Check, X, AlertTriangle } from "lucide-react"; // Imported icons
import CircularProgress from "../Component/CircularProgress"; // Imported CircularProgress

export default function Accessibility({ data }) {
  const { darkMode } = useContext(ThemeContext);

  if (!data) {
    return <div />;
  }

  // Updated ScoreBadge to accept descriptive text, matching On_Page_SEO
  const ScoreBadge = ({ score, out, des }) => {
    const cssscore = score ? "bg-green-300" : "bg-red-300";
    const hasValue = score ? <Check size={18} /> : <X size={18} />;

    return (
      <span
        className={`px-2.5 flex items-center gap-1.5 py-1 rounded-full text-black font-semibold text-sm shadow-md transform transition-transform ${cssscore}`}
      >
        {hasValue} {out} {des}
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

  // Check if any metric has failed to conditionally show the error section
  const hasError =
    data.Accessibility.Color_Contrast.Score === 0 ||
    data.Accessibility.Focusable.Score === 0 ||
    data.Accessibility.ARIA.Score === 0 ||
    data.Accessibility.Alt_or_Text_Equivalents.Score === 0 ||
    data.Accessibility.Skip_Links.Score === 0 ||
    data.Accessibility.Landmarks.Score === 0;

  return (
    <div
      id="accessibility"
      className={`min-h-fit pt-20 pb-16 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 m-4 flex flex-col items-center justify-start p-6 space-y-6 ${containerBg}`}
    >
      <h1 className="flex items-center justify-center sm:gap-10 text-3xl font-extrabold mb-6">
        Accessibility{" "}
        <CircularProgress
          value={data.Accessibility.Accessibility_Score_Total.toFixed(0)}
          size={70}
          stroke={5}
        />
      </h1>

      <div
        className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between items-center">
            <span className={`${textColor}`}>Color Contrast Score</span>
            <ScoreBadge
              score={data.Accessibility.Color_Contrast.Score}
              out={data.Accessibility.Color_Contrast.Score?"Good Contrast ":"contrast issues"}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={`${textColor}`}>Focusable/Keyboard Nav Score</span>
            <ScoreBadge
              score={data.Accessibility.Focusable.Score}
              out={data.Accessibility.Focusable.Score?"Keyboard Accessibility good":"Keyboard Accessibility Bad"}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={`${textColor}`}>ARIA/Labelling Score</span>
            <ScoreBadge
              score={data.Accessibility.ARIA.Score}
              out={data.Accessibility.ARIA.Score?"ARIA Compliance":"ARIA issues found"}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={`${textColor}`}>Alt/Text Equivalents Score</span>
            <ScoreBadge
              score={data.Accessibility.Alt_or_Text_Equivalents.Score}
              out={data.Accessibility.Alt_or_Text_Equivalents.Score?"Alt Attributed Img":"Not all images have alt"}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={`${textColor}`}>Skip Links Score</span>
            <ScoreBadge
              score={data.Accessibility.Skip_Links.Score}
              out={data.Accessibility.Skip_Links.Score?"Skip link not found":"Skip Link Avalible"}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={`${textColor}`}>Landmarks Score</span>
            <ScoreBadge
              score={data.Accessibility.Landmarks.Score}
              out={data.Accessibility.Landmarks.Score?"All landmark Avalible":"Some Landmark Missing"}
            />
          </div>
        </div>

        {/* Conditionally rendered error section */}
        {hasError && <hr className="text-black mt-3" />}

        <div className="p-1 mt-2">
          {data.Accessibility.Color_Contrast.Score === 0 && (
            <h1 className="flex gap-2">
              <AlertTriangle size={20} className="text-red-700" />{" "}
              {data.Accessibility.Color_Contrast.Score?"":""}
            </h1>
          )}
          {data.Accessibility.Focusable.Score === 0 && (
            <h1 className="flex gap-2">
              <AlertTriangle size={20} className="text-red-700" />{" "}
              {data.Accessibility.Focusable.Parameter}
            </h1>
          )}
          {data.Accessibility.ARIA.Score === 0 && (
            <h1 className="flex gap-2">
              <AlertTriangle size={20} className="text-red-700" />{" "}
              {data.Accessibility.ARIA.Parameter}
            </h1>
          )}
          {data.Accessibility.Alt_or_Text_Equivalents.Score === 0 && (
            <h1 className="flex gap-2">
              <AlertTriangle size={20} className="text-red-700" />{" "}
              {data.Accessibility.Alt_or_Text_Equivalents.Parameter}
            </h1>
          )}
          {data.Accessibility.Skip_Links.Score === 0 && (
            <h1 className="flex gap-2">
              <AlertTriangle size={20} className="text-red-700" />{" "}
              {data.Accessibility.Skip_Links.Parameter}
            </h1>
          )}
          {data.Accessibility.Landmarks.Score === 0 && (
            <h1 className="flex gap-2">
              <AlertTriangle size={20} className="text-red-700" />{" "}
              {data.Accessibility.Landmarks.Parameter}
            </h1>
          )}
        </div>
      </div>
    </div>
  );
}